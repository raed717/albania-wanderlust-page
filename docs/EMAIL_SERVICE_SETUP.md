# Email Service Integration (Supabase + Resend)

Complete guide for implementing transactional email sending with Supabase Edge Functions and Resend API.

---

## 📋 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Setup Instructions](#-setup-instructions)
3. [Configuration](#-configuration)
4. [Frontend Usage](#-frontend-usage)
5. [Backend Implementation](#-backend-implementation)
6. [Testing](#-testing)
7. [Monitoring & Logging](#-monitoring--logging)
8. [Security Best Practices](#-security-best-practices)
9. [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  React Frontend │
│  (Vite App)     │
└────────┬────────┘
         │
         │ HTTPS POST
         │ /functions/v1/send-email
         ↓
┌─────────────────────────┐
│  Supabase Edge Function │
│  (Deno Runtime)         │
│  • Validation           │
│  • Rate Limiting        │
│  • JWT Verification     │
│  • Error Handling       │
└────────┬────────────────┘
         │
         │ HTTP + API Key
         ↓
┌──────────────────┐
│  Resend API      │
│  (Email Service) │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  User's Inbox    │
└──────────────────┘

Logging:
Edge Function → Supabase Database (email_logs table)
```

### Key Features

✅ **Security**

- API keys never exposed to browser
- Request validation
- Rate limiting (100 req/min per user)
- Optional JWT verification
- Input sanitization

✅ **Reliability**

- Automatic retry logic (3 attempts)
- Exponential backoff
- Error logging

✅ **Scalability**

- Stateless functions
- Edge deployment
- Database logging for analytics

✅ **Developer Experience**

- TypeScript types
- React hooks
- Template system
- Detailed errors

---

## 🚀 Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g supabase
# or with brew: brew install supabase/tap/supabase
```

### 2. Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up and create an account
3. Verify your domain or use default `onboarding@resend.dev` for testing
4. Copy your **API Key**

### 3. Add Resend API Key to Supabase

```bash
supabase secrets set RESEND_API_KEY your_resend_api_key_here
```

Verify it was added:

```bash
supabase secrets list
```

### 4. Deploy the Edge Function

The function is already created at:
`supabase/functions/send-email/index.ts`

Deploy it:

```bash
supabase functions deploy send-email
```

### 5. Create Email Logging Table

Option A - Using CLI:

```bash
supabase migration new create_email_logs_table
# Copy the SQL from supabase/migrations/create_email_logs_table.sql
```

Option B - Using Dashboard:

1. Go to Supabase Dashboard
2. SQL Editor
3. Run the migration SQL

Then apply migrations:

```bash
supabase migration up
```

---

## ⚙️ Configuration

### Environment Variables

#### Frontend (`.env.local`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Backend (Supabase Secrets)

Set via CLI:

```bash
supabase secrets set RESEND_API_KEY "your_resend_api_key"
```

These are automatically available in the Edge Function as `Deno.env.get()`.

### Optional: Update Default From Address

In `supabase/functions/send-email/index.ts`, line ~210:

```typescript
from: emailData.from || "noreply@discover-albania.com", // Update this
```

---

## 📱 Frontend Usage

### Option 1: React Hook (Recommended)

```tsx
import {
  useEmailService,
  getBookingConfirmationTemplate,
} from "@/services/api/emailService";

export function BookingConfirmation() {
  const { sendEmail, isLoading, error } = useEmailService();

  const handleSendConfirmation = async () => {
    const template = getBookingConfirmationTemplate({
      userName: "John Doe",
      bookingId: "BOOK-12345",
      bookingDate: "2026-02-15",
      property: "Mountain Villa",
      totalPrice: 250.0,
      confirmationUrl: "https://discover-albania.com/bookings/BOOK-12345",
    });

    const result = await sendEmail({
      to: "user@example.com",
      subject: "Your Booking Confirmation",
      html: template,
      replyTo: "support@discover-albania.com",
      tags: {
        category: "booking",
        bookingId: "BOOK-12345",
      },
    });

    if (result.success) {
      console.log("✅ Email sent:", result.messageId);
      // Show success toast
    } else {
      console.error("❌ Error:", result.error);
      // Show error toast
    }
  };

  return (
    <button onClick={handleSendConfirmation} disabled={isLoading}>
      {isLoading ? "Sending..." : "Send Confirmation"}
    </button>
  );
}
```

### Option 2: Direct Function

```tsx
import {
  sendEmailDirect,
  getPaymentReceiptTemplate,
} from "@/services/api/emailService";

async function sendPaymentReceipt(orderId: string, amount: number) {
  const template = getPaymentReceiptTemplate({
    userName: "Jane Smith",
    orderId,
    amount,
    date: new Date().toLocaleDateString(),
    paymentMethod: "PayPal",
  });

  const response = await sendEmailDirect({
    to: "customer@example.com",
    subject: "Payment Receipt",
    html: template,
  });

  console.log(response); // { success: true, messageId: "..." }
}
```

### Option 3: Custom HTML

```tsx
const { sendEmail } = useEmailService();

await sendEmail({
  to: ["user1@example.com", "user2@example.com"],
  subject: "Newsletter",
  html: `<h1>Hello!</h1><p>Check out our latest updates.</p>`,
  text: "Hello! Check out our latest updates.", // Plain text fallback
  replyTo: "newsletter@discover-albania.com",
  tags: {
    type: "newsletter",
    week: "2",
  },
});
```

---

## 🔧 Backend Implementation

### Edge Function Location

```
supabase/functions/send-email/
├── index.ts       # Main function
└── deno.json      # Dependencies
```

### Key Components

#### 1. Validation

```typescript
// Automatic validation of:
// - Email format (RFC 5322)
// - Required fields (to, subject, html)
// - Optional fields (replyTo, tags, etc.)
```

#### 2. Rate Limiting

```typescript
// 100 requests per 60 seconds per user/IP
// Respects Retry-After header
const rateLimitCheck = checkRateLimit(identifier);
```

#### 3. Resend Integration

```typescript
// Sends to Resend API
// Retries on 5xx errors (max 3 attempts)
// Exponential backoff: 1s, 2s, 3s
```

#### 4. Logging

```typescript
// Logs to email_logs table:
// - user_id
// - recipient
// - subject
// - status (sent/failed)
// - message_id
// - error (if failed)
// - created_at
```

---

## 🧪 Testing

### Local Testing

1. **Start Supabase locally:**

   ```bash
   supabase start
   ```

2. **Test function with curl:**

   ```bash
   curl -i --location --request POST \
     'http://127.0.0.1:54321/functions/v1/send-email' \
     --header 'Content-Type: application/json' \
     --data '{
       "to": "test@example.com",
       "subject": "Test Email",
       "html": "<h1>Hello</h1>"
     }'
   ```

3. **Check logs:**

   ```bash
   supabase functions logs send-email
   ```

### Production Testing

1. **Deploy:**

   ```bash
   supabase functions deploy send-email
   ```

2. **Test from frontend:**

   ```tsx
   const result = await sendEmailDirect({
     to: "your-email@example.com",
     subject: "Production Test",
     html: "<p>Testing from production</p>",
   });
   console.log(result);
   ```

3. **Check inbox** - Email should arrive in 1-2 minutes

### Error Test Cases

```typescript
// Test 1: Invalid email format
const r1 = await sendEmailDirect({
  to: "invalid-email",
  subject: "Test",
  html: "Test",
});
// Expected: { success: false, error: "Invalid email address" }

// Test 2: Missing required field
const r2 = await sendEmailDirect({
  to: "user@example.com",
  // Missing subject
  html: "Test",
});
// Expected: { success: false, error: "Missing required fields: to, subject, html" }

// Test 3: Rate limit exceeded
for (let i = 0; i < 101; i++) {
  await sendEmailDirect({...});
}
// Expected on request 101: { success: false, error: "Rate limit exceeded", statusCode: 429 }
```

---

## 📊 Monitoring & Logging

### View Email Logs

```sql
-- In Supabase SQL Editor

-- View all emails
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 50;

-- View failed emails
SELECT * FROM email_logs WHERE status = 'failed';

-- View emails sent today
SELECT COUNT(*) as count FROM email_logs
WHERE created_at > NOW() - INTERVAL '1 day';

-- Group by status
SELECT status, COUNT(*) as count FROM email_logs
GROUP BY status;
```

### Monitor Function Usage

```bash
# View function logs
supabase functions logs send-email

# View with filters (tail)
supabase functions logs send-email --tail
```

### Set Up Alerts

In Supabase Dashboard:

1. Go to **Monitoring → Realtime**
2. Create a new alert for **Edge Function errors**
3. Trigger email to admins on failures

---

## 🔐 Security Best Practices

### ✅ DO

- ✅ Store API keys in Supabase secrets only
- ✅ Validate all input on the backend
- ✅ Use rate limiting to prevent abuse
- ✅ Log all email attempts
- ✅ Use HTTPS for all requests
- ✅ Implement optional JWT verification
- ✅ Add `replyTo` field for customer support
- ✅ Use email tags for categorization
- ✅ Sanitize user data in HTML templates

### ❌ DON'T

- ❌ Never expose API keys in frontend code
- ❌ Don't trust client-side email addresses without verification
- ❌ Don't send sensitive data in email body
- ❌ Don't skip input validation
- ❌ Don't hardcode recipient addresses in frontend
- ❌ Don't use `from` address from untrusted sources
- ❌ Don't disable rate limiting
- ❌ Don't log PII unnecessarily

### JWT Verification (Optional)

To require authentication, uncomment in `index.ts`:

```typescript
// In MAIN HANDLER section
const authHeader = req.headers.get("authorization");
if (!authHeader) {
  return new Response(
    JSON.stringify({ success: false, error: "Unauthorized" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}

const jwtVerification = await verifyJWT(...);
if (!jwtVerification.valid) {
  return new Response(
    JSON.stringify({ success: false, error: jwtVerification.error }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}
```

---

## 🛠️ Troubleshooting

### Issue: "RESEND_API_KEY not found"

**Solution:**

```bash
supabase secrets set RESEND_API_KEY your_key_here
supabase functions deploy send-email
```

### Issue: Emails not arriving

**Check:**

1. Verify domain in Resend dashboard
2. Check spam folder
3. Verify recipient email format
4. Check email logs table for errors

```sql
SELECT * FROM email_logs WHERE status = 'failed' ORDER BY created_at DESC;
```

### Issue: Rate limit errors

**Cause:** Sending >100 emails per minute per user

**Solution:**

- Increase `RATE_LIMIT_MAX` in `index.ts`
- Use Redis for distributed rate limiting in production
- Queue emails in a job queue (Bull, RabbitMQ)

### Issue: "Invalid authorization header"

**Solution:**

```tsx
// Ensure token is passed correctly
const response = await fetch(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`, // Not "JWT Bearer ..."
  },
});
```

### Issue: Function deployment fails

**Try:**

```bash
# Clear cache
rm -rf .supabase/

# Redeploy
supabase functions deploy send-email
```

---

## 📈 Advanced Optimization Tasks

### 1. Email Queue System

Use a job queue to handle bulk emails:

```typescript
// jobs/sendBulkEmails.ts
import { Queue } from "bull"; // or similar

const emailQueue = new Queue("emails");

emailQueue.process(async (job) => {
  await sendEmailViaResend(job.data);
});
```

### 2. Template Engine

Build a templating system:

```typescript
// templates/bookingConfirmation.ts
export function renderTemplate(data: BookingData): string {
  return `
    <h1>Hello ${escapeHtml(data.name)}</h1>
    ...
  `;
}
```

### 3. Role-Based Authorization

```typescript
// In Edge Function
if (jwtVerification.role !== "admin" && jwtVerification.role !== "staff") {
  return unauthorized();
}
```

### 4. Webhook Tracking

Subscribe to Resend events:

```typescript
// supabase/functions/resend-webhook/index.ts
// Track: delivered, opened, clicked, complained, bounced
```

### 5. Email Analytics

```typescript
// Dashboard showing:
// - Delivery rate
// - Open rate
// - Click rate
// - Bounce rate
// - Unsubscribe rate
```

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://docs.deno.com/)
- [SMTP vs API-Based Email](https://resend.com/blog/smtp-vs-api-based-email)

---

## 🎯 Checklist

- [ ] Resend account created and API key obtained
- [ ] `RESEND_API_KEY` added to Supabase secrets
- [ ] Edge Function deployed: `supabase functions deploy send-email`
- [ ] Migration applied: `supabase migration up`
- [ ] `.env.local` configured with Supabase URL
- [ ] Email service imported in components
- [ ] Test email sent and received
- [ ] Error handling tested
- [ ] Rate limiting tested
- [ ] Logging verified in `email_logs` table

---

**Last Updated:** January 21, 2026  
**Maintainer:** Discover Albania Team

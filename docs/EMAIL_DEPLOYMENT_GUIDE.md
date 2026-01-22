# Email Service Deployment Guide

Step-by-step instructions for deploying the email service to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Resend account created at https://resend.com
- [ ] Domain verified in Resend (or using `onboarding@resend.dev` for testing)
- [ ] Resend API key obtained
- [ ] Supabase project initialized
- [ ] All files created (see file list below)
- [ ] Environment variables configured
- [ ] Tests run locally

---

## 📁 Files to Deploy

```
supabase/
├── functions/
│   └── send-email/
│       ├── index.ts           ✅ Created
│       └── deno.json          ✅ Created
└── migrations/
    └── create_email_logs_table.sql   ✅ Created

src/
├── types/
│   └── email.types.ts         ✅ Created
└── services/
    └── api/
        └── emailService.ts    ✅ Created

docs/
└── EMAIL_SERVICE_SETUP.md     ✅ Created
```

---

## 🚀 Deployment Steps

### Step 1: Local Testing

```bash
# Start Supabase locally
supabase start

# Run the function locally
curl -X POST http://127.0.0.1:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "html": "<h1>Test Email</h1>"
  }'
```

### Step 2: Set Secrets

```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY "re_your_actual_api_key_here"

# Verify
supabase secrets list
```

### Step 3: Create Migration

```bash
# Create the migration
supabase migration new create_email_logs_table

# This creates an empty file in supabase/migrations/
# Copy the SQL from docs/EMAIL_SERVICE_SETUP.md into this file

# Push to remote
supabase push
```

### Step 4: Deploy Edge Function

```bash
# Deploy to production
supabase functions deploy send-email

# Verify deployment
supabase functions list
```

Output should show:

```
Name: send-email
Slug: send-email
Status: active
URL: https://your-project.supabase.co/functions/v1/send-email
```

### Step 5: Verify in Supabase Dashboard

1. Go to https://supabase.co → Your Project
2. Navigate to **Edge Functions**
3. Click **send-email**
4. Check "Function Configuration" tab
5. Verify secrets are properly set

### Step 6: Test in Production

```bash
# Via curl with your real endpoint
curl -X POST \
  https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Production Test",
    "html": "<h1>It works!</h1>"
  }'
```

Check your inbox - email should arrive within 1-2 minutes.

---

## 📱 Frontend Integration

### Step 1: Update Environment Variables

`.env.local` or `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... # Your anon key
```

### Step 2: Import and Use

```tsx
import { useEmailService } from "@/services/api/emailService";

export function MyComponent() {
  const { sendEmail } = useEmailService();

  const handleEmail = async () => {
    const result = await sendEmail({
      to: "user@example.com",
      subject: "Hello",
      html: "<p>Welcome!</p>",
    });

    if (result.success) {
      console.log("Email sent!");
    }
  };

  return <button onClick={handleEmail}>Send Email</button>;
}
```

---

## 🔒 Security Configuration

### Enable JWT Verification (Optional but Recommended)

In production, you may want to require authentication. Edit `supabase/functions/send-email/index.ts`:

**Current (Unauthenticated):**

```typescript
// Line ~250: Optional JWT verification
if (authHeader && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  const jwtVerification = await verifyJWT(...);
  if (!jwtVerification.valid) {
    console.warn("[Auth] Invalid token:", jwtVerification.error);
    // Continue anyway - unauthenticated requests allowed
  }
}
```

**For Strict Authentication:**

```typescript
// Add this check and redeploy
if (!authHeader) {
  return new Response(
    JSON.stringify({ success: false, error: "Unauthorized" }),
    { status: 401, headers: { "Content-Type": "application/json" } },
  );
}

const jwtVerification = await verifyJWT(
  authHeader,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);
if (!jwtVerification.valid) {
  return new Response(
    JSON.stringify({ success: false, error: "Invalid token" }),
    { status: 401, headers: { "Content-Type": "application/json" } },
  );
}
```

Then redeploy:

```bash
supabase functions deploy send-email
```

And update frontend to send token:

```tsx
const { session } = useAuth();
const response = await fetch(endpoint, {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});
```

---

## 📊 Monitoring Setup

### View Logs in Supabase Dashboard

1. Go to **Edge Functions** → **send-email**
2. Click **Invocations** tab
3. See all function calls, errors, and performance metrics

### Programmatic Log Access

```bash
# Tail logs in real-time
supabase functions logs send-email --tail
```

### Database Logging

Query email activity:

```sql
SELECT
  recipient,
  status,
  COUNT(*) as count,
  MAX(created_at) as last_sent
FROM email_logs
GROUP BY recipient, status
ORDER BY last_sent DESC;
```

---

## 🚨 Troubleshooting Deployment

### Error: "Cannot find RESEND_API_KEY"

**Solution:**

```bash
# 1. Verify the key is set
supabase secrets list

# 2. If missing, set it again
supabase secrets set RESEND_API_KEY "your_key"

# 3. Redeploy function
supabase functions deploy send-email
```

### Error: "Failed to parse Deno dependencies"

**Solution:**

```bash
# Clear cache
rm -rf .supabase/

# Check deno.json syntax
cat supabase/functions/send-email/deno.json

# Redeploy
supabase functions deploy send-email
```

### Error: 404 when calling function

**Solution:**

1. Verify function is deployed:

   ```bash
   supabase functions list
   ```

2. Check the exact URL:

   ```
   https://your-project.supabase.co/functions/v1/send-email
   ```

3. Verify VITE_SUPABASE_URL matches exactly

### Emails not sending in production

**Check:**

1. **RESEND_API_KEY is correct:**

   ```bash
   supabase secrets list
   ```

2. **Email address is valid** - Resend won't send to invalid addresses

3. **Check email_logs table for errors:**

   ```sql
   SELECT * FROM email_logs
   WHERE status = 'failed'
   ORDER BY created_at DESC;
   ```

4. **Verify Resend domain** is verified in your Resend dashboard

---

## 📈 Performance Optimization

### Rate Limiting Configuration

Adjust limits in `supabase/functions/send-email/index.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60; // seconds (currently 60)
const RATE_LIMIT_MAX = 100; // requests (currently 100)
```

Example configurations:

- Strict: `60s, 10 req` → 10 emails per minute per user
- Default: `60s, 100 req` → 100 emails per minute per user
- Generous: `60s, 1000 req` → 1000 emails per minute per user

### For Bulk Emails

Use a queue system instead of rate-limited direct calls:

```tsx
// Future enhancement: implement email queue
import { Queue } from "bull";

const emailQueue = new Queue("email-sends");

// Add to queue
await emailQueue.add({
  recipients: ["user1@example.com", "user2@example.com"],
  subject: "Bulk email",
  html: "...",
});

// Process in background
emailQueue.process(10, async (job) => {
  // Send up to 10 emails in parallel
  await sendEmailDirect(job.data);
});
```

---

## 🔄 Updating the Function

If you need to make changes:

```bash
# 1. Edit supabase/functions/send-email/index.ts
# 2. Test locally
supabase functions deploy send-email

# 3. Verify in dashboard
# 4. Test in production
```

Changes are deployed immediately - no downtime.

---

## ✅ Post-Deployment Checklist

- [ ] Function deployed and accessible
- [ ] Secrets properly configured
- [ ] Migration applied to database
- [ ] Email logs table working
- [ ] Test email sent successfully
- [ ] Error paths tested (invalid email, rate limit, etc.)
- [ ] Frontend updated with correct URLs
- [ ] Monitoring set up in Supabase dashboard
- [ ] Documentation updated for team
- [ ] Backup of configuration saved

---

## 🎯 Common Integration Points

### Booking Confirmation Flow

```tsx
// 1. User completes booking
const booking = await createBooking(data);

// 2. Send confirmation email
const emailResult = await sendEmail({
  to: booking.userEmail,
  subject: "Booking Confirmation",
  html: getBookingConfirmationTemplate(booking),
});

// 3. Log success
if (emailResult.success) {
  await markBookingEmailSent(booking.id);
}
```

### PayPal Payment Flow

```tsx
// After PayPal captures order
const receipt = await generateReceipt(paypalOrder);

await sendEmail({
  to: userEmail,
  subject: "Payment Receipt",
  html: getPaymentReceiptTemplate(receipt),
  tags: {
    category: "payment_receipt",
    orderId: paypalOrder.id,
  },
});
```

---

**Last Updated:** January 21, 2026  
**Status:** Production Ready

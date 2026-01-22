# 📧 Email Service Implementation Checklist

Complete step-by-step checklist for implementing the email service.

---

## 🎯 Phase 1: Preparation (5 minutes)

- [ ] **Read** the summary document: `docs/EMAIL_SERVICE_IMPLEMENTATION_SUMMARY.md`
- [ ] **Copy** `.env.example` to `.env.local`
- [ ] **Create** Resend account at https://resend.com
- [ ] **Verify** your domain in Resend (or use `onboarding@resend.dev` for testing)
- [ ] **Copy** Resend API key to clipboard
- [ ] **Note** your Supabase project URL and anon key

---

## 🔐 Phase 2: Backend Setup (10 minutes)

### Set Environment Variables

```bash
# Set Resend API key in Supabase
supabase secrets set RESEND_API_KEY "re_your_actual_key_here"

# Verify it was set
supabase secrets list
```

- [ ] ✅ `supabase secrets set RESEND_API_KEY` executed
- [ ] ✅ Verified in `supabase secrets list`

### Deploy Edge Function

```bash
# Deploy the send-email function
supabase functions deploy send-email
```

- [ ] ✅ Function deployed successfully
- [ ] ✅ No errors in output
- [ ] ✅ Verified in Supabase dashboard

### Create Database Migration

```bash
# Push migrations (includes email_logs table)
supabase push
```

- [ ] ✅ Migration applied successfully
- [ ] ✅ `email_logs` table exists in Supabase

---

## 🖥️ Phase 3: Frontend Configuration (5 minutes)

### Update Environment Variables

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

- [ ] ✅ `.env.local` updated with correct values
- [ ] ✅ `VITE_SUPABASE_URL` matches your project
- [ ] ✅ File not committed to git (in `.gitignore`)

### Restart Development Server

```bash
npm run dev
```

- [ ] ✅ Dev server starts without errors
- [ ] ✅ No console errors about missing env vars

---

## 🧪 Phase 4: Local Testing (10 minutes)

### Test 1: Direct API Call

```bash
# Start Supabase locally (if testing offline)
supabase start

# Send test email via curl
curl -X POST http://127.0.0.1:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Local Test",
    "html": "<h1>Hello from local!</h1>"
  }'
```

Expected response:

```json
{
  "success": true,
  "messageId": "abc123...",
  "statusCode": 200
}
```

- [ ] ✅ Request succeeds (200 status)
- [ ] ✅ Response has `messageId`
- [ ] ✅ No error messages

### Test 2: Validation Errors

```bash
# Test invalid email
curl -X POST http://127.0.0.1:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "invalid-email",
    "subject": "Test",
    "html": "<h1>Test</h1>"
  }'
```

Expected response:

```json
{
  "success": false,
  "error": "Invalid email address: invalid-email",
  "statusCode": 400
}
```

- [ ] ✅ Returns 400 status
- [ ] ✅ Error message is descriptive

### Test 3: React Component

Create a test file or use browser console:

```tsx
import { sendEmailDirect } from "@/services/api/emailService";

const result = await sendEmailDirect({
  to: "your-real-email@example.com",
  subject: "Test from React",
  html: "<h1>If you see this, it works!</h1>",
});

console.log(result);
```

- [ ] ✅ No console errors
- [ ] ✅ Response logged to console
- [ ] ✅ Check your email inbox

### Test 4: Hook Usage

In a React component:

```tsx
import { useEmailService } from "@/services/api/emailService";

export function TestComponent() {
  const { sendEmail, isLoading, error } = useEmailService();

  const handleClick = async () => {
    const result = await sendEmail({
      to: "test@example.com",
      subject: "Hook Test",
      html: "<p>Testing the hook</p>",
    });
    console.log(result);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Test Email"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

- [ ] ✅ Button renders without errors
- [ ] ✅ Loading state works
- [ ] ✅ Email sends on click
- [ ] ✅ Error handling works

---

## ✅ Phase 5: Database Verification (5 minutes)

### Check Email Logs

In Supabase Dashboard → SQL Editor:

```sql
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;
```

- [ ] ✅ Table exists
- [ ] ✅ Can query data
- [ ] ✅ See recent email records

### Verify Columns

```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'email_logs' ORDER BY ordinal_position;
```

Expected columns:

- `id` (uuid)
- `user_id` (uuid)
- `recipient` (text)
- `subject` (text)
- `status` (text)
- `message_id` (text)
- `error` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

- [ ] ✅ All columns present
- [ ] ✅ Data types correct

### Check Row-Level Security

```sql
SELECT * FROM pg_policies WHERE tablename = 'email_logs';
```

Should show 2 policies:

- "Users can view their own email logs"
- "Service role can insert email logs"

- [ ] ✅ RLS is enabled
- [ ] ✅ Policies are correct

---

## 🎨 Phase 6: Integration Examples (15 minutes)

### Example 1: Simple Email

```tsx
import { useEmailService } from "@/services/api/emailService";

export function WelcomeEmail() {
  const { sendEmail } = useEmailService();

  const handleSend = async () => {
    await sendEmail({
      to: "user@example.com",
      subject: "Welcome!",
      html: "<h1>Welcome to Discover Albania</h1>",
    });
  };

  return <button onClick={handleSend}>Send Welcome</button>;
}
```

- [ ] ✅ Component renders
- [ ] ✅ Email sends on click
- [ ] ✅ No console errors

### Example 2: Booking Confirmation

```tsx
import {
  useEmailService,
  getBookingConfirmationTemplate,
} from "@/services/api/emailService";

export function BookingConfirmationButton() {
  const { sendEmail } = useEmailService();

  const handleSend = async () => {
    const html = getBookingConfirmationTemplate({
      userName: "John Doe",
      bookingId: "BOOK-123",
      bookingDate: "2026-02-15",
      property: "Mountain Villa",
      totalPrice: 250.0,
      confirmationUrl: "https://discover-albania.com/bookings/BOOK-123",
    });

    await sendEmail({
      to: "john@example.com",
      subject: "Booking Confirmation - BOOK-123",
      html,
      tags: { bookingId: "BOOK-123" },
    });
  };

  return <button onClick={handleSend}>Send Confirmation</button>;
}
```

- [ ] ✅ Template renders correctly
- [ ] ✅ Email sent successfully
- [ ] ✅ Check email formatting

### Example 3: Payment Receipt

```tsx
import {
  useEmailService,
  getPaymentReceiptTemplate,
} from "@/services/api/emailService";

export function PaymentReceiptButton() {
  const { sendEmail } = useEmailService();

  const handleSend = async () => {
    const html = getPaymentReceiptTemplate({
      userName: "Jane Smith",
      orderId: "ORD-456",
      amount: 150.0,
      date: new Date().toLocaleDateString(),
      paymentMethod: "PayPal",
    });

    await sendEmail({
      to: "jane@example.com",
      subject: "Payment Receipt - ORD-456",
      html,
    });
  };

  return <button onClick={handleSend}>Send Receipt</button>;
}
```

- [ ] ✅ Template renders correctly
- [ ] ✅ Email sent successfully
- [ ] ✅ Formatting looks professional

---

## 🔒 Phase 7: Security Review (5 minutes)

### Verify Secrets

- [ ] ✅ No API keys in code files
- [ ] ✅ No API keys in `.env.local` (which is gitignored)
- [ ] ✅ `.env.local` is in `.gitignore`

### Check CORS & Headers

```typescript
// Verify function doesn't expose secrets in response
// Should only return: success, messageId, error, statusCode
```

- [ ] ✅ No sensitive data in responses
- [ ] ✅ Proper error messages

### Test Rate Limiting

Try sending >100 emails within 60 seconds:

```tsx
for (let i = 0; i < 101; i++) {
  sendEmail({...});
}
```

On request 101+, should get:

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "statusCode": 429
}
```

- [ ] ✅ Rate limiting works
- [ ] ✅ Resets after 60 seconds

### Test Input Validation

- [ ] ✅ Invalid emails rejected
- [ ] ✅ Missing fields rejected
- [ ] ✅ XSS attempts handled
- [ ] ✅ SQL injection not possible

---

## 📊 Phase 8: Monitoring Setup (10 minutes)

### View Function Logs

```bash
# Real-time logs
supabase functions logs send-email --tail
```

- [ ] ✅ Can see logs in terminal
- [ ] ✅ See both successes and errors

### Monitor Database

In Supabase Dashboard:

1. Go to **SQL Editor**
2. Create saved query:

```sql
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  status,
  COUNT(*) as count
FROM email_logs
GROUP BY hour, status
ORDER BY hour DESC;
```

- [ ] ✅ Can run queries
- [ ] ✅ Can see statistics
- [ ] ✅ Understand data structure

### Set Up Alerts (Optional)

In Supabase Dashboard → Monitoring:

- [ ] ⏳ Create alert for function errors
- [ ] ⏳ Create alert for high failure rate (>5%)
- [ ] ⏳ Configure email notifications

---

## 📚 Phase 9: Documentation Review (10 minutes)

Read documentation:

- [ ] ✅ `EMAIL_SERVICE_IMPLEMENTATION_SUMMARY.md` - Overview
- [ ] ✅ `EMAIL_SERVICE_SETUP.md` - Detailed guide
- [ ] ✅ `EMAIL_DEPLOYMENT_GUIDE.md` - Deployment steps
- [ ] ✅ `EMAIL_SERVICE_QUICK_REF.md` - Quick reference

Understand:

- [ ] ✅ How the architecture works
- [ ] ✅ Where files are located
- [ ] ✅ How to troubleshoot common issues
- [ ] ✅ How to monitor email activity

---

## 🚀 Phase 10: Production Deployment (30 minutes)

### Pre-Deployment

- [ ] ✅ All tests pass locally
- [ ] ✅ No console errors
- [ ] ✅ Email logs show successes
- [ ] ✅ Team has reviewed code

### Deploy

```bash
# Deploy to production
supabase functions deploy send-email

# Apply any pending migrations
supabase push
```

- [ ] ✅ Deployment completes successfully
- [ ] ✅ No errors in output
- [ ] ✅ Function shows as "active" in dashboard

### Production Testing

```bash
# Test with real endpoint
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Production Test",
    "html": "<h1>Production is live!</h1>"
  }'
```

- [ ] ✅ Email arrives in inbox within 1-2 minutes
- [ ] ✅ Log entry created in `email_logs`
- [ ] ✅ No errors in function logs

### Update Documentation

- [ ] ✅ Update team wiki/docs with setup instructions
- [ ] ✅ Share quick reference guide
- [ ] ✅ Create runbook for troubleshooting

---

## 🎯 Phase 11: Team Handoff (5 minutes)

Share with team:

- [ ] ✅ Link to `EMAIL_SERVICE_QUICK_REF.md`
- [ ] ✅ Example code snippets
- [ ] ✅ Common issues & solutions
- [ ] ✅ How to request features

Create Slack channel or wiki post:

```
📧 Email Service Now Live!

Quick Start:
1. Use sendEmailDirect() or useEmailService()
2. Pass to, subject, html
3. Email sent in 1-2 minutes

Examples:
- src/components/examples/EmailComponentExample.tsx

Docs:
- docs/EMAIL_SERVICE_QUICK_REF.md

Support:
- #backend-support channel
```

- [ ] ✅ Team notified
- [ ] ✅ Examples accessible
- [ ] ✅ Support channel ready

---

## 🎉 Phase 12: Success!

Celebrate these achievements:

- ✅ Secure email service deployed
- ✅ Zero API keys exposed to frontend
- ✅ Production-ready error handling
- ✅ Database logging for analytics
- ✅ Rate limiting prevents abuse
- ✅ Team can send emails
- ✅ Full documentation in place
- ✅ Monitoring set up

---

## 📝 Notes

### Project Info

- **Email Service Version:** 1.0
- **Framework:** Supabase Edge Functions (Deno)
- **Email Provider:** Resend
- **Status:** Production Ready

### Important Files

```
supabase/functions/send-email/
src/services/api/emailService.ts
src/types/email.types.ts
docs/EMAIL_SERVICE_*.md
```

### Support Contacts

- Supabase: https://supabase.com/docs
- Resend: https://resend.com/docs
- Your Team: [Backend Team Contact]

---

**Total Implementation Time: ~2-3 hours**

✨ **You're all set to send emails!** ✨

---

**Last Updated:** January 21, 2026  
**Checklist Version:** 1.0

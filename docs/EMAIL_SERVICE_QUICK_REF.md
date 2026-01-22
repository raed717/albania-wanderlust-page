# Email Service - Quick Reference

Quick lookup guide for the email service implementation.

---

## 🚀 Quick Start (5 Minutes)

### 1. Get Resend API Key

```bash
# Sign up at https://resend.com
# Copy your API key
```

### 2. Set Secret in Supabase

```bash
supabase secrets set RESEND_API_KEY "re_your_key_here"
```

### 3. Deploy Function

```bash
supabase functions deploy send-email
```

### 4. Use in React

```tsx
import { useEmailService } from "@/services/api/emailService";

const { sendEmail } = useEmailService();

await sendEmail({
  to: "user@example.com",
  subject: "Hello!",
  html: "<h1>Welcome</h1>",
});
```

---

## 📝 API Reference

### Request Format

```json
{
  "to": "user@example.com", // string | string[]
  "subject": "Subject Line", // string (required)
  "html": "<h1>Content</h1>", // string (required)
  "text": "Plain text version", // string (optional)
  "replyTo": "support@example.com", // string (optional)
  "from": "noreply@example.com", // string (optional)
  "userId": "uuid", // string (optional)
  "tags": {
    // object (optional)
    "category": "booking",
    "orderId": "12345"
  }
}
```

### Response Format

**Success:**

```json
{
  "success": true,
  "messageId": "abc123def456",
  "statusCode": 200
}
```

**Error:**

```json
{
  "success": false,
  "error": "Invalid email address",
  "statusCode": 400
}
```

### HTTP Status Codes

- `200` - Email sent successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (if JWT verification enabled)
- `429` - Rate limit exceeded
- `500` - Server error

---

## 🎨 Pre-built Templates

### Booking Confirmation

```tsx
import { getBookingConfirmationTemplate } from "@/services/api/emailService";

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
  subject: "Your Booking Confirmation",
  html,
});
```

### Payment Receipt

```tsx
import { getPaymentReceiptTemplate } from "@/services/api/emailService";

const html = getPaymentReceiptTemplate({
  userName: "Jane Smith",
  orderId: "ORD-456",
  amount: 150.0,
  date: new Date().toLocaleDateString(),
  paymentMethod: "PayPal",
});

await sendEmail({
  to: "jane@example.com",
  subject: "Payment Receipt",
  html,
});
```

---

## 🔧 File Locations

```
supabase/
├── functions/send-email/
│   ├── index.ts           Main function code
│   └── deno.json          Dependencies
└── migrations/
    └── create_email_logs_table.sql

src/
├── types/email.types.ts   TypeScript definitions
└── services/api/emailService.ts   React hook & utilities

docs/
├── EMAIL_SERVICE_SETUP.md     Full documentation
├── EMAIL_DEPLOYMENT_GUIDE.md  Deployment steps
└── EMAIL_SERVICE_QUICK_REF.md This file
```

---

## 💾 Supabase Tables

### email_logs

```sql
-- Query all emails
SELECT * FROM email_logs ORDER BY created_at DESC;

-- Failed emails
SELECT * FROM email_logs WHERE status = 'failed';

-- Stats by status
SELECT status, COUNT(*) FROM email_logs GROUP BY status;

-- Today's activity
SELECT COUNT(*) FROM email_logs
WHERE created_at > NOW() - INTERVAL '1 day';
```

Columns:

- `id` - UUID
- `user_id` - FK to auth.users
- `recipient` - Email address
- `subject` - Email subject
- `status` - 'sent' | 'failed'
- `message_id` - Resend message ID
- `error` - Error message if failed
- `created_at` - Timestamp

---

## ⚙️ Configuration

### Environment Variables

```bash
# Frontend (.env.local)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Backend (Supabase Secrets)
RESEND_API_KEY=re_...
```

### Rate Limiting

Default: **100 emails per 60 seconds per user**

Adjust in `supabase/functions/send-email/index.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 100; // max requests
```

---

## 🧪 Testing

### Local Test

```bash
supabase start

curl -X POST http://127.0.0.1:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "html": "<h1>Hello</h1>"
  }'
```

### Production Test

```tsx
import { sendEmailDirect } from "@/services/api/emailService";

const result = await sendEmailDirect({
  to: "your-email@example.com",
  subject: "Production Test",
  html: "<p>Testing from production</p>",
});

console.log(result);
```

### Error Test

```tsx
// Invalid email
const r1 = await sendEmailDirect({
  to: "invalid",
  subject: "Test",
  html: "Test",
});
// Returns: { success: false, error: "Invalid email address" }

// Missing field
const r2 = await sendEmailDirect({
  to: "user@example.com",
  // No subject!
  html: "Test",
});
// Returns: { success: false, error: "Missing required fields..." }
```

---

## 🐛 Debugging

### Check Function Status

```bash
supabase functions list
supabase functions logs send-email
supabase functions logs send-email --tail
```

### Check Secrets

```bash
supabase secrets list
# Should show RESEND_API_KEY
```

### Check Database

```sql
-- Did the email log get created?
SELECT * FROM email_logs
WHERE recipient = 'test@example.com'
ORDER BY created_at DESC
LIMIT 1;

-- Check for errors
SELECT error FROM email_logs
WHERE status = 'failed'
LIMIT 5;
```

### Network Test

```bash
# Test Resend API key directly
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<h1>Hello</h1>"
  }'
```

---

## 📊 Monitoring Commands

```bash
# Real-time function logs
supabase functions logs send-email --tail

# View function invocations
supabase functions describe send-email

# Query database logs
supabase db query

# Check errors in last 24h
SELECT * FROM email_logs
WHERE status = 'failed'
AND created_at > NOW() - INTERVAL '24 hours';

# Email volume per hour
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as count,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
FROM email_logs
GROUP BY hour
ORDER BY hour DESC
LIMIT 24;
```

---

## 🚨 Common Issues

| Issue                      | Cause           | Fix                                         |
| -------------------------- | --------------- | ------------------------------------------- |
| "RESEND_API_KEY not found" | Secret not set  | `supabase secrets set RESEND_API_KEY "..."` |
| Email not arriving         | Invalid domain  | Verify domain in Resend dashboard           |
| 404 on function call       | Wrong endpoint  | Check `VITE_SUPABASE_URL` matches           |
| Rate limit errors          | Too many emails | Increase `RATE_LIMIT_MAX` or use queue      |
| Empty `from` address       | Missing config  | Set `from` in request or update default     |
| Invalid email errors       | Typo in address | Check recipient email format                |
| Deployment fails           | Syntax error    | Check `deno.json` and `index.ts`            |

---

## 📚 Resources

- [Resend Docs](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://docs.deno.com/)
- [Email Service Setup](./EMAIL_SERVICE_SETUP.md)
- [Deployment Guide](./EMAIL_DEPLOYMENT_GUIDE.md)

---

## 🎯 Next Steps

1. ✅ Create Resend account
2. ✅ Set RESEND_API_KEY in Supabase
3. ✅ Deploy send-email function
4. ✅ Apply database migration
5. ✅ Test locally
6. ✅ Use in React component
7. ⏳ Monitor email_logs table
8. ⏳ Set up Slack alerts (optional)
9. ⏳ Implement email templates
10. ⏳ Add webhook tracking (optional)

---

**Last Updated:** January 21, 2026  
**Version:** 1.0  
**Status:** Production Ready

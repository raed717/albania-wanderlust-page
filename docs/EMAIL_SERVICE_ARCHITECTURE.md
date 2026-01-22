# Email Service Architecture

Visual guide to the email service architecture and data flow.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Components:                                                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐    │
│  │ BookingForm     │  │ PaymentReceipt   │  │ ContactForm         │    │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬────────────┘    │
│           │                    │                     │                   │
│           └────────────────────┼─────────────────────┘                   │
│                                │                                         │
│                    useEmailService() Hook                                │
│                                │                                         │
│                   sendEmailDirect() Function                             │
│                                │                                         │
└────────────────────────────────┼─────────────────────────────────────────┘
                                 │
                                 │ HTTPS POST /functions/v1/send-email
                                 │ Content-Type: application/json
                                 │
                                 ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTION (Deno)                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Step 1: Parse Request                                                   │
│  ┌────────────────────────────────────────┐                              │
│  │ • Parse JSON body                      │                              │
│  │ • Extract: to, subject, html, tags    │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
│                   ↓                                                       │
│  Step 2: Validate Input                                                  │
│  ┌────────────────────────────────────────┐                              │
│  │ • Email format (RFC 5322)              │                              │
│  │ • Required fields present              │                              │
│  │ • HTML/text content valid              │                              │
│  │ • Subject not empty                    │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
│                   ↓                                                       │
│  Step 3: Check Rate Limit                                                │
│  ┌────────────────────────────────────────┐                              │
│  │ • Get user identifier (IP or user ID)  │                              │
│  │ • Check: < 100 req/min                 │                              │
│  │ • If exceeded: return 429              │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
│                   ↓                                                       │
│  Step 4: Verify JWT (Optional)                                           │
│  ┌────────────────────────────────────────┐                              │
│  │ • Get token from Authorization header  │                              │
│  │ • Verify with Supabase                 │                              │
│  │ • Extract user ID                      │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
│                   ↓                                                       │
│  Step 5: Send via Resend                                                 │
│  ┌────────────────────────────────────────┐                              │
│  │ • Format payload for Resend API        │                              │
│  │ • Add Authorization header (API key)   │                              │
│  │ • Retry on 5xx (max 3 attempts)        │                              │
│  │ • Exponential backoff: 1s, 2s, 3s      │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
│                   ↓                                                       │
│  Step 6: Log Result                                                      │
│  ┌────────────────────────────────────────┐                              │
│  │ • Insert into email_logs table         │                              │
│  │ • Log: recipient, subject, status      │                              │
│  │ • Log: message_id, error, timestamp    │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
│                   ↓                                                       │
│  Step 7: Return Response                                                 │
│  ┌────────────────────────────────────────┐                              │
│  │ Success: {success, messageId, 200}     │                              │
│  │ Error:   {success: false, error, 4xx}  │                              │
│  └────────────────┬───────────────────────┘                              │
│                   │                                                       │
└───────────────────┼──────────────────────────────────────────────────────┘
                    │
        ┌───────────┴──────────────┬──────────────┐
        │                          │              │
        ↓                          ↓              ↓
   Success (200)            Error (4xx/5xx)  Logging
        │                          │              │
        ├──→ HTTP 200              ├──→ 429      ├──→ INSERT email_logs
        │    Resend ID                Rate limit    recipient
        │                               Invalid     subject
        │                               email       status: 'sent'/'failed'
        │                               Validation  message_id
        │                               error       error
        │                                           created_at
        │
        ↓
 ┌────────────────────────────────────┐
 │   RESEND API (api.resend.com)       │
 └────────────┬───────────────────────┘
              │
              ├─→ Email Rendering
              ├─→ DKIM/SPF Signing
              ├─→ Authentication
              │
              ↓
 ┌────────────────────────────────────┐
 │   Email Providers                   │
 │   • Gmail                           │
 │   • Outlook                         │
 │   • Yahoo                           │
 │   • etc.                            │
 └────────────┬───────────────────────┘
              │
              ↓
 ┌────────────────────────────────────┐
 │   User's Inbox ✅ Email Delivered   │
 └────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Successful Email Flow

```
User Component
     │
     └─→ await sendEmail({
            to: "user@example.com",
            subject: "Hello",
            html: "<h1>Hi</h1>"
        })
         │
         └─→ fetch("/functions/v1/send-email", {
              method: "POST",
              body: JSON.stringify({...})
            })
             │
             └─→ Edge Function Handler
                  │
                  ├─ Parse JSON ✓
                  ├─ Validate input ✓
                  ├─ Check rate limit ✓
                  ├─ Verify JWT (optional) ✓
                  ├─ Send to Resend ✓
                  ├─ Log to database ✓
                  │
                  └─→ Return {
                        success: true,
                        messageId: "abc123",
                        statusCode: 200
                      }
                      │
                      └─→ React Hook Updates
                           │
                           └─→ Component Re-renders
                                │
                                └─→ Show success toast
```

### Error Handling Flow

```
User Component
     │
     └─→ await sendEmail({...})
         │
         └─→ fetch("/functions/v1/send-email", {...})
             │
             └─→ Edge Function Handler
                  │
                  ├─ Parse JSON → ERROR!
                  │   (Invalid JSON)
                  │
                  └─→ Return {
                        success: false,
                        error: "Invalid JSON",
                        statusCode: 400
                      }
                      │
                      └─→ React Hook Captures Error
                           │
                           ├─ Set error state
                           ├─ Set isLoading = false
                           │
                           └─→ Component Shows Error
                                │
                                └─→ Display error toast
```

---

## 📊 Database Schema

```
┌────────────────────────────────────────────────────────────────┐
│                      email_logs Table                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Column          │  Type                 │  Constraints       │
│  ─────────────────────────────────────────────────────────────│
│  id              │  UUID                 │  PRIMARY KEY       │
│  user_id         │  UUID                 │  FK(auth.users)    │
│  recipient       │  TEXT                 │  NOT NULL          │
│  subject         │  TEXT                 │  NOT NULL          │
│  status          │  TEXT                 │  NOT NULL          │
│                  │                       │  CHECK IN          │
│                  │                       │  ('sent','failed') │
│  message_id      │  TEXT                 │  (Resend ID)       │
│  error           │  TEXT                 │  (Error msg)       │
│  created_at      │  TIMESTAMP            │  DEFAULT NOW()     │
│  updated_at      │  TIMESTAMP            │  DEFAULT NOW()     │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Indexes:                                                      │
│  • idx_email_logs_user_id (for user lookups)                  │
│  • idx_email_logs_recipient (for recipient lookups)           │
│  • idx_email_logs_status (for status filtering)               │
│  • idx_email_logs_created_at (for time-range queries)         │
│                                                                │
│  RLS Policies:                                                 │
│  • Users can view their own logs                              │
│  • Service role can insert logs                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers

```
┌────────────────────────────────────────────────────┐
│  Layer 1: Frontend Security                        │
├────────────────────────────────────────────────────┤
│  • No API keys in code                             │
│  • No secrets in .env files                        │
│  • HTTPS only                                      │
│  • User authentication (optional JWT)              │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 2: Request Validation                       │
├────────────────────────────────────────────────────┤
│  • Email format validation                         │
│  • Required field validation                       │
│  • Field length limits                             │
│  • Type checking                                   │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 3: Rate Limiting                            │
├────────────────────────────────────────────────────┤
│  • 100 requests/minute per user/IP                │
│  • Prevents abuse and DoS attacks                 │
│  • Returns 429 Too Many Requests                  │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 4: Authentication (Optional)                │
├────────────────────────────────────────────────────┤
│  • JWT verification via Supabase                  │
│  • User ID extraction                             │
│  • Can enforce per-user restrictions              │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 5: Backend Secrets                          │
├────────────────────────────────────────────────────┤
│  • Resend API key in Supabase secrets              │
│  • Never exposed in logs                          │
│  • Used only for Resend API calls                 │
│  • Rotatable via Supabase CLI                     │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 6: Audit Logging                            │
├────────────────────────────────────────────────────┤
│  • All email attempts logged                      │
│  • Success/failure tracked                        │
│  • Error messages stored                          │
│  • Recipient email recorded                       │
│  • Timestamp for investigation                    │
└────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Architecture

```
Request Distribution:
─────────────────────

Global Users
     │
     ├─→ North America   ┌──────────────────┐
     │                   │ Supabase Region  │
     │                   │ (us-east-1)      │
     ├─→ Europe          │ Edge Function    │
     │                   │ send-email       │
     │                   └────────┬─────────┘
     ├─→ Asia                    │
     │                           │
     └─→ Australia               │
                                 ↓
                        ┌──────────────────┐
                        │  Resend API      │
                        │  Global          │
                        │  Delivery        │
                        └──────────────────┘


Request Handling:
─────────────────

Edge Function receives request
     │
     ├─ Parse & validate (fast, <10ms)
     ├─ Check rate limit (fast, <5ms)
     ├─ Call Resend API (~1-2 seconds)
     ├─ Log to database (~50-100ms)
     │
     └─ Return response

Total: ~2-3 seconds per email


Concurrency:
────────────

Without Queue System:
• 100 req/min limit per user
• Prevents abuse
• Good for transactional emails

With Queue System (future):
• Unlimited frontend requests
• Queue jobs in Redis/Bull
• Process in background
• Better for bulk emails

```

---

## 🔄 Retry Logic

```
Resend API Call
     │
     ├─→ Success (2xx)
     │   └─→ Log: status = 'sent'
     │       Return: messageId
     │
     └─→ Failure
         │
         ├─→ 5xx Server Error
         │   │
         │   └─→ Attempt 1 (wait 1s)
         │       │
         │       ├─→ Success ✓
         │       │
         │       └─→ Failure → Attempt 2 (wait 2s)
         │           │
         │           ├─→ Success ✓
         │           │
         │           └─→ Failure → Attempt 3 (wait 3s)
         │               │
         │               ├─→ Success ✓
         │               │
         │               └─→ Failure → Give up
         │                   Log: status = 'failed'
         │                   Return: error message
         │
         ├─→ 4xx Client Error
         │   └─→ Don't retry
         │       Return: error message immediately
         │
         └─→ Network Error
             └─→ Retry with exponential backoff
                 (same as 5xx)

Exponential Backoff:
• Attempt 1: wait 1000ms
• Attempt 2: wait 2000ms
• Attempt 3: wait 3000ms
```

---

## 📱 Component Integration

```
┌─────────────────────────────────────────────────────────┐
│  src/components/*/YourComponent.tsx                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  import { useEmailService } from "@/services/...";     │
│                                                         │
│  export function BookingForm() {                        │
│    const { sendEmail, isLoading, error } =             │
│      useEmailService();                                 │
│                                                         │
│    const handleSubmit = async (booking) => {            │
│      const result = await sendEmail({                   │
│        to: booking.userEmail,                           │
│        subject: "Booking Confirmed",                    │
│        html: getTemplate(...),                          │
│      });                                                │
│                                                         │
│      if (result.success) {                              │
│        // Show success                                  │
│      } else {                                           │
│        // Show error                                    │
│      }                                                  │
│    };                                                   │
│                                                         │
│    return (                                             │
│      <button disabled={isLoading}>                      │
│        {isLoading ? "Sending..." : "Submit"}            │
│      </button>                                          │
│    );                                                   │
│  }                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 API Endpoints

```
Base URL:
https://your-project.supabase.co/functions/v1

Endpoint:
POST /send-email

Request Headers:
• Content-Type: application/json
• Authorization: Bearer {jwt_token} (optional)
• X-Forwarded-For: (automatic, for rate limiting)

Request Body:
{
  "to": "user@example.com" | ["user1@example.com", "user2@example.com"],
  "subject": "Email Subject",
  "html": "<h1>HTML Content</h1>",
  "text": "Plain text fallback",
  "replyTo": "support@example.com",
  "from": "noreply@example.com",
  "userId": "uuid-of-user",
  "tags": {
    "category": "booking",
    "bookingId": "123"
  }
}

Response (Success):
{
  "success": true,
  "messageId": "abc123def456",
  "statusCode": 200
}

Response (Error):
{
  "success": false,
  "error": "Invalid email address",
  "statusCode": 400
}

Status Codes:
• 200: Success
• 400: Bad request (validation error)
• 401: Unauthorized (invalid JWT)
• 429: Rate limit exceeded
• 500: Server error
```

---

## 📊 Monitoring Points

```
┌─────────────────────────────────────────────────────┐
│  Frontend Monitoring                                │
├─────────────────────────────────────────────────────┤
│  • sendEmail() hook errors                          │
│  • Network failures                                 │
│  • Rate limit hits                                  │
│  • Performance metrics (time to send)               │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Edge Function Logs                                 │
├─────────────────────────────────────────────────────┤
│  • Function invocations                             │
│  • Validation errors                                │
│  • Resend API errors                                │
│  • Retry attempts                                   │
│  • Database write errors                            │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Database Logging                                   │
├─────────────────────────────────────────────────────┤
│  • email_logs table entries                         │
│  • Success rate                                     │
│  • Failure reasons                                  │
│  • Volume trends                                    │
│  • Per-user statistics                              │
└─────────────────────────────────────────────────────┘
```

---

**Architecture Version:** 1.0  
**Last Updated:** January 21, 2026

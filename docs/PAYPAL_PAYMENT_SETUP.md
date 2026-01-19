# PayPal Payment Integration - Setup Guide

## Overview

This document describes the secure PayPal payment system implemented for the Discover Albania booking platform. The system implements server-side validation, fraud resistance, and full auditability.

## Architecture

### Components

1. **Supabase Edge Functions** (Server-side)
   - `create-paypal-order`: Creates PayPal orders with server-side validation
   - `capture-paypal-order`: Captures payments with atomic database updates
   - `paypal-webhook`: Handles PayPal webhook events for payment state synchronization

2. **Database Schema**
   - `booking` table: Extended with `paypal_order_id` column
   - `payment_transactions` table: Audit trail and idempotency tracking

3. **Frontend Integration**
   - React component using `@paypal/react-paypal-js`
   - Integrated in `BookingsSummary.tsx`

## Security Features

### ✅ Price Integrity
- **Never trust frontend price**: All prices are validated server-side from the database
- Booking `totalPrice` is fetched from DB and used to create PayPal orders
- Amount verification on capture ensures payment matches booking price

### ✅ Booking Ownership Validation
- Every request validates that the authenticated user owns the booking
- Prevents unauthorized payment attempts

### ✅ Idempotency & Double-Payment Protection
- Unique constraints on `paypal_order_id` and `paypal_capture_id`
- Database checks prevent duplicate captures
- Optimistic locking on booking updates

### ✅ Atomic Database Updates
- Payment transaction and booking status updated together
- Optimistic locking prevents race conditions

### ✅ Webhook Signature Validation
- All webhook events verified using PayPal's signature verification API
- Prevents malicious webhook calls

## Environment Variables

### Required for Edge Functions

Set these in your Supabase project settings (Settings → Edge Functions → Secrets):

```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com  # or https://api-m.paypal.com for production
PAYPAL_WEBHOOK_ID=your_webhook_id  # Optional but recommended
SUPABASE_URL=your_supabase_url  # Auto-set by Supabase
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Auto-set by Supabase
```

### Required for Frontend

Add to your `.env` file:

```
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id  # Same as Edge Function, but public
```

## PayPal Sandbox Setup

1. **Create PayPal Developer Account**
   - Go to https://developer.paypal.com
   - Create a sandbox app
   - Note your Client ID and Secret

2. **Create Webhook** (Optional but recommended)
   - In PayPal Developer Dashboard → Webhooks
   - Create webhook pointing to: `https://your-project.supabase.co/functions/v1/paypal-webhook`
   - Subscribe to events:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`
   - Copy the Webhook ID

3. **Test Accounts**
   - Use PayPal sandbox test accounts for testing
   - Personal account: buyer@personal.example.com
   - Business account: merchant@business.example.com

## Database Schema

### Migration Applied

The migration `add_paypal_payment_tracking` adds:

1. **`booking.paypal_order_id`** (TEXT)
   - Stores PayPal order ID for tracking

2. **`payment_transactions` table**
   - `id` (UUID, Primary Key)
   - `booking_id` (UUID, Foreign Key → booking.id)
   - `paypal_order_id` (TEXT, UNIQUE)
   - `paypal_capture_id` (TEXT, UNIQUE)
   - `amount` (NUMERIC)
   - `currency` (TEXT)
   - `status` (TEXT: pending, completed, denied, refunded)
   - `webhook_event_id` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

### Indexes

- `idx_payment_transactions_booking_id`
- `idx_payment_transactions_paypal_order_id`
- `idx_booking_paypal_order_id`

## Payment Flow

### 1. User Initiates Payment

```
User clicks "Pay Now" → PayPalButtons component
```

### 2. Create Order (Frontend → Edge Function)

```
Frontend calls paymentService.createPayPalOrder({ bookingId })
  ↓
Edge Function: create-paypal-order
  - Validates user authentication
  - Validates booking ownership
  - Validates booking status (must be "pending")
  - Validates payment status (must not be "paid")
  - Fetches booking.totalPrice from database
  - Creates PayPal order with server-validated price
  - Stores paypal_order_id in booking
  - Creates payment_transactions record
  - Returns orderId to frontend
```

### 3. User Approves Payment (PayPal UI)

```
PayPalButtons handles PayPal UI
  ↓
User approves payment in PayPal popup
```

### 4. Capture Payment (Frontend → Edge Function)

```
Frontend calls paymentService.capturePayPalOrder({ orderId, bookingId })
  ↓
Edge Function: capture-paypal-order
  - Validates user authentication
  - Validates booking ownership
  - Validates paypal_order_id matches
  - Checks idempotency (already paid?)
  - Captures PayPal order
  - Verifies capture status === "COMPLETED"
  - Verifies amount matches booking.totalPrice
  - Updates payment_transactions (atomic)
  - Updates booking (atomic with optimistic locking)
  - Returns success to frontend
```

### 5. Webhook Synchronization (PayPal → Edge Function)

```
PayPal sends webhook event
  ↓
Edge Function: paypal-webhook
  - Verifies webhook signature
  - Handles event type:
    * PAYMENT.CAPTURE.COMPLETED → Update booking to paid
    * PAYMENT.CAPTURE.DENIED → Update transaction to denied
    * PAYMENT.CAPTURE.REFUNDED → Update booking to canceled
  - Idempotent processing (handles duplicates)
```

## Testing

### Test Scenarios

1. **Happy Path**
   - Create booking → Pay → Verify booking status = "confirmed", payment_status = "paid"

2. **Double Payment Prevention**
   - Attempt to pay same booking twice → Second attempt returns "already processed"

3. **Payment Denied**
   - Use PayPal test account with insufficient funds → Verify transaction status = "denied"

4. **Booking Already Paid**
   - Try to pay booking that's already paid → Returns error

5. **Unauthorized Access**
   - Try to pay someone else's booking → Returns 403 Unauthorized

### PayPal Sandbox Test Cards

- **Success**: Use any test card from PayPal sandbox
- **Decline**: Use card number that triggers decline
- **Insufficient Funds**: Use test account with no balance

## Error Handling

### Frontend Errors

- Payment creation fails → Toast notification shown
- Payment capture fails → Toast notification shown
- Network errors → Retry mechanism (user can try again)

### Backend Errors

- All errors logged to Supabase Edge Function logs
- User-friendly error messages returned to frontend
- Critical errors (booking update failures) logged for investigation

## Production Checklist

Before going live:

- [ ] Switch `PAYPAL_BASE_URL` to production: `https://api-m.paypal.com`
- [ ] Update `VITE_PAYPAL_CLIENT_ID` to production client ID
- [ ] Create production webhook in PayPal dashboard
- [ ] Set `PAYPAL_WEBHOOK_ID` in Supabase secrets
- [ ] Test with real PayPal account (small amount)
- [ ] Verify webhook events are received
- [ ] Monitor Edge Function logs for errors
- [ ] Set up alerts for payment failures

## Migration to Other Payment Providers

The architecture is designed to be payment-provider agnostic:

1. **Database**: `payment_transactions` table can track any payment provider
2. **Service Layer**: `paymentService.ts` can be extended with new providers
3. **Frontend**: Payment buttons can be swapped without changing booking logic

To add Paddle/LemonSqueezy:
- Create new Edge Functions following the same pattern
- Extend `paymentService.ts` with new functions
- Add new payment button components
- Use same `payment_transactions` table with provider-specific fields

## Security Decisions Explained

### Why Server-Side Order Creation?

- Prevents price manipulation from frontend
- Ensures booking ownership validation
- Centralizes business logic

### Why Atomic Updates?

- Prevents race conditions
- Ensures data consistency
- Optimistic locking prevents double payments

### Why Webhook Verification?

- Validates events are from PayPal
- Prevents malicious webhook calls
- Ensures payment state synchronization

### Why Idempotency?

- Handles network retries safely
- Prevents duplicate charges
- Ensures consistent state

## Support & Troubleshooting

### Common Issues

1. **"Missing authorization header"**
   - User not logged in → Redirect to login

2. **"Booking not found"**
   - Booking ID invalid → Check booking exists

3. **"Amount mismatch"**
   - PayPal amount doesn't match booking → Critical error, log for investigation

4. **Webhook not received**
   - Check webhook URL is correct
   - Verify webhook is active in PayPal dashboard
   - Check Edge Function logs

### Monitoring

- Monitor Edge Function logs in Supabase dashboard
- Check `payment_transactions` table for failed payments
- Monitor booking status changes

## References

- [PayPal REST API Documentation](https://developer.paypal.com/docs/api/overview/)
- [PayPal Webhooks Guide](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

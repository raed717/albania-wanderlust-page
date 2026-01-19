# PayPal Payment Integration - Environment Variables

## Required Environment Variables

### Supabase Edge Functions Secrets

Set these in your Supabase project:
**Settings → Edge Functions → Secrets**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PAYPAL_CLIENT_ID` | PayPal REST API Client ID | `AeA1QIZXiflr1_-...` | ✅ Yes |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API Client Secret | `ECb...` | ✅ Yes |
| `PAYPAL_BASE_URL` | PayPal API base URL | `https://api-m.sandbox.paypal.com` (sandbox)<br>`https://api-m.paypal.com` (production) | ✅ Yes |
| `PAYPAL_WEBHOOK_ID` | PayPal Webhook ID for signature verification | `WH-...` | ⚠️ Recommended |
| `SUPABASE_URL` | Your Supabase project URL | Auto-set by Supabase | ✅ Auto-set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Auto-set by Supabase | ✅ Auto-set |

### Frontend Environment Variables

Add to your `.env` file in the project root:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_PAYPAL_CLIENT_ID` | PayPal Client ID (public, safe to expose) | `AeA1QIZXiflr1_-...` | ✅ Yes |

## Setup Instructions

### 1. Get PayPal Credentials

#### Sandbox (Development)
1. Go to https://developer.paypal.com
2. Log in or create account
3. Navigate to **Dashboard → Apps & Credentials**
4. Create a new app (or use default)
5. Copy **Client ID** and **Secret**

#### Production
1. Same as above, but use **Live** mode
2. Switch to **Live** tab in PayPal Developer Dashboard
3. Create production app
4. Copy production **Client ID** and **Secret**

### 2. Set Supabase Secrets

```bash
# Using Supabase CLI (recommended)
supabase secrets set PAYPAL_CLIENT_ID=your_client_id
supabase secrets set PAYPAL_CLIENT_SECRET=your_client_secret
supabase secrets set PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
supabase secrets set PAYPAL_WEBHOOK_ID=your_webhook_id
```

Or via Supabase Dashboard:
1. Go to **Settings → Edge Functions → Secrets**
2. Add each secret variable
3. Click **Save**

### 3. Set Frontend Environment Variable

Create or update `.env` file in project root:

```env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Note**: This is the same Client ID as the Edge Function, but it's safe to expose in frontend code.

### 4. Create PayPal Webhook (Optional but Recommended)

1. In PayPal Developer Dashboard → **Webhooks**
2. Click **Create Webhook**
3. Set URL: `https://your-project-ref.supabase.co/functions/v1/paypal-webhook`
4. Subscribe to events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
5. Copy the **Webhook ID** and set as `PAYPAL_WEBHOOK_ID` secret

## Environment-Specific Configuration

### Development (Sandbox)

```env
# .env
VITE_PAYPAL_CLIENT_ID=your_sandbox_client_id
```

```bash
# Supabase Secrets
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret
```

### Production

```env
# .env
VITE_PAYPAL_CLIENT_ID=your_production_client_id
```

```bash
# Supabase Secrets
PAYPAL_BASE_URL=https://api-m.paypal.com
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_secret
PAYPAL_WEBHOOK_ID=your_production_webhook_id
```

## Verification

### Test Edge Functions

1. Check Edge Functions are deployed:
   - `create-paypal-order`
   - `capture-paypal-order`
   - `paypal-webhook`

2. Verify secrets are set:
   ```bash
   supabase secrets list
   ```

3. Test payment flow:
   - Create a booking
   - Attempt payment
   - Check Edge Function logs for errors

### Test Frontend

1. Verify `.env` file exists with `VITE_PAYPAL_CLIENT_ID`
2. Restart dev server: `npm run dev`
3. Check browser console for PayPal script loading
4. Navigate to `/myBookings` and verify PayPal button appears

## Security Notes

- ✅ `VITE_PAYPAL_CLIENT_ID` is safe to expose (public key)
- ❌ Never expose `PAYPAL_CLIENT_SECRET` in frontend
- ❌ Never commit `.env` file with secrets to git
- ✅ Use Supabase secrets for server-side credentials
- ✅ Use environment variables for frontend public keys

## Troubleshooting

### "PAYPAL_CLIENT_ID is not defined"
- Check Supabase secrets are set correctly
- Verify Edge Function has access to secrets
- Check secret names match exactly (case-sensitive)

### "VITE_PAYPAL_CLIENT_ID is not defined"
- Check `.env` file exists in project root
- Verify variable name starts with `VITE_`
- Restart dev server after adding env variable

### PayPal buttons not loading
- Check `VITE_PAYPAL_CLIENT_ID` is set
- Verify Client ID is valid
- Check browser console for errors
- Ensure PayPalScriptProvider is wrapping the app

# Stripe Integration Setup Guide for ScorePro

## Overview
ScorePro has been updated to a freemium subscription model with three tiers:
- **Free Plan**: $0/month - 5 courses, basic tracking
- **Pro Plan**: $29/month - All 87 courses, quizzes, certificates, priority support
- **Enterprise Plan**: $99/month - Everything in Pro + white-label branding, custom domain, multi-user licenses

## Prerequisites
1. A Stripe account (create at https://stripe.com)
2. Stripe API keys (test and live modes)
3. Stripe webhook endpoint configured

## Setup Steps

### 1. Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete business verification
3. Access your Dashboard

### 2. Get API Keys
1. In Stripe Dashboard, go to Developers > API keys
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Store these securely

### 3. Create Products and Prices in Stripe
1. Go to Products in Stripe Dashboard
2. Create three products:

**Pro Plan**:
- Name: ScorePro Pro Plan
- Price: $29.00 USD/month
- Billing period: Monthly
- Add 7-day free trial
- Copy the Price ID (starts with `price_`)

**Enterprise Plan**:
- Name: ScorePro Enterprise Plan
- Price: $99.00 USD/month
- Billing period: Monthly
- Add 7-day free trial
- Copy the Price ID

### 4. Configure Supabase Environment Variables
Add the following secrets to your Supabase project:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Webhook Secret (from step 5)
STRIPE_WEBHOOK_SECRET=whsec_...
```

To add secrets in Supabase:
1. Go to Project Settings > Edge Functions
2. Add environment variables
3. Restart edge functions after adding

### 5. Set Up Stripe Webhook
1. In Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://YOUR_SUPABASE_URL/functions/v1/stripe-webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Webhook signing secret** (starts with `whsec_`)
7. Add this to Supabase as `STRIPE_WEBHOOK_SECRET`

### 6. Deploy Database Migration
Run the migration to create Stripe-specific tables:

```bash
# The migration file is ready at:
# /workspace/supabase/migrations/1761173400_create_stripe_tables.sql

# Apply it using Supabase CLI or Dashboard
supabase db push
```

This creates:
- `stripe_plans` table with Free, Pro, and Enterprise plans
- `stripe_subscriptions` table to track user subscriptions
- RLS policies for secure access

### 7. Deploy Edge Functions
Deploy the Stripe-related edge functions:

```bash
# create-checkout-session function (creates Stripe checkout)
# stripe-webhook function (handles Stripe webhooks)

# Files are ready at:
# /workspace/supabase/functions/create-checkout-session/index.ts
# /workspace/supabase/functions/stripe-webhook/index.ts
```

### 8. Update Price IDs in Code
Update the price IDs in BillingPage.tsx to match your Stripe products:

```typescript
const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    priceId: 'price_free', // No Stripe price needed
    // ...
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 29,
    priceId: 'price_YOUR_ACTUAL_PRO_PRICE_ID', // Update this
    // ...
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 99,
    priceId: 'price_YOUR_ACTUAL_ENTERPRISE_PRICE_ID', // Update this
    // ...
  },
];
```

### 9. Test the Integration
1. Use Stripe test mode and test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Register a test account on ScorePro
3. Go to Billing page
4. Try subscribing to Pro or Enterprise
5. Verify:
   - Redirected to Stripe checkout
   - Payment processed successfully
   - Subscription created in database
   - User can access Pro/Enterprise features

### 10. Go Live
When ready for production:
1. Switch from test keys to live keys in Supabase
2. Update Stripe products to live mode
3. Update webhook endpoint to use live mode
4. Test thoroughly with real (small) transactions
5. Monitor Stripe Dashboard for payments

## Database Schema

### stripe_plans Table
```sql
- id: SERIAL PRIMARY KEY
- price_id: VARCHAR(255) UNIQUE (Stripe price ID)
- plan_type: VARCHAR(50) (free, pro, enterprise)
- price: INTEGER (in cents, e.g., 2900 for $29)
- monthly_limit: INTEGER (course access limit)
- features: JSONB (list of features)
```

### stripe_subscriptions Table
```sql
- id: SERIAL PRIMARY KEY
- user_id: UUID (references auth.users)
- stripe_subscription_id: VARCHAR(255) (Stripe subscription ID)
- stripe_customer_id: VARCHAR(255) (Stripe customer ID)
- price_id: VARCHAR(255) (references stripe_plans)
- status: VARCHAR(50) (active, canceled, trialing, etc.)
- trial_end: TIMESTAMP
- current_period_start: TIMESTAMP
- current_period_end: TIMESTAMP
```

## Edge Functions

### create-checkout-session
**Purpose**: Creates a Stripe checkout session when a user clicks "Subscribe"

**Input**:
```json
{
  "planType": "pro",
  "customerEmail": "user@example.com"
}
```

**Output**:
```json
{
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_..."
  }
}
```

### stripe-webhook
**Purpose**: Handles Stripe webhook events to update subscription status

**Events Handled**:
- `checkout.session.completed`: Creates subscription record
- `customer.subscription.updated`: Updates subscription status
- `customer.subscription.deleted`: Marks subscription as canceled

## Frontend Integration

### Billing Page (BillingPage.tsx)
- Displays all three pricing tiers
- Shows current subscription status
- Handles upgrade/downgrade flows
- Integrates with Stripe checkout

### Subscription Flow
1. User clicks "Subscribe to Pro/Enterprise"
2. Frontend calls `create-checkout-session` edge function
3. User redirected to Stripe checkout
4. After payment, Stripe redirects back with success/cancel
5. Webhook updates subscription in database
6. User sees updated subscription status

## Access Control

### Free Plan Users
- Can access only 5 designated free courses
- Basic progress tracking
- No certificates

### Pro Plan Users
- Full access to all 87 courses
- All 97 quizzes
- Certificates upon completion
- Priority support

### Enterprise Plan Users
- Everything in Pro
- White-label branding options
- Custom domain setup
- Multi-user licenses
- Dedicated support

## Troubleshooting

### Checkout Not Working
1. Check Stripe API keys are correct in Supabase
2. Verify edge function is deployed
3. Check browser console for errors
4. Verify price IDs match Stripe Dashboard

### Webhook Not Triggering
1. Check webhook endpoint URL is correct
2. Verify webhook secret in Supabase
3. Check Stripe Dashboard > Webhooks for failed deliveries
4. Review edge function logs in Supabase

### Subscription Not Showing
1. Check database for subscription record
2. Verify user_id matches auth.users
3. Check RLS policies allow user to read their subscription
4. Review edge function logs for errors

## Security Best Practices
1. Never expose secret keys in frontend code
2. Use webhook signatures to verify Stripe events
3. Implement proper RLS policies on subscription tables
4. Validate all inputs in edge functions
5. Use HTTPS for all communications
6. Regularly rotate API keys

## Support
For issues with:
- **Stripe Integration**: Check Stripe Dashboard logs
- **Edge Functions**: Check Supabase Edge Function logs
- **Database**: Check Supabase Database logs
- **Frontend**: Check browser console

## Next Steps
1. Set up Stripe account
2. Configure API keys in Supabase
3. Deploy database migration
4. Deploy edge functions
5. Test with Stripe test cards
6. Go live when ready

---

**Note**: The platform is currently configured with placeholder price IDs. You must replace them with your actual Stripe price IDs for the subscription system to work.

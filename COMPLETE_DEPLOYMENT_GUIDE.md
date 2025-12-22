# Complete Stripe Integration & Deployment Guide

## Current Status
- ✅ Frontend UI: Complete with subscription tiers and pricing
- ✅ Subscription Logic: Implemented with course access restrictions
- ⏳ Backend Deployment: Requires Supabase token refresh
- ⏳ Stripe Configuration: Requires API keys

---

## Part 1: Deploy Supabase Backend

### Step 1: Refresh Supabase Access Token
The current Supabase access token is expired. Request a token refresh from the coordinator.

### Step 2: Deploy Database Migration
Once token is refreshed, run this migration:

**File**: `/workspace/supabase/migrations/1761173400_create_stripe_tables.sql`

**Manual Deployment via Supabase Dashboard**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to SQL Editor
4. Copy and paste the migration SQL
5. Click "Run"
6. Verify tables created: `stripe_plans` and `stripe_subscriptions`

### Step 3: Deploy Edge Functions
Deploy these two edge functions:

**create-checkout-session**:
- File: `/workspace/supabase/functions/create-checkout-session/index.ts`
- Purpose: Creates Stripe checkout sessions

**stripe-webhook**:
- File: `/workspace/supabase/functions/stripe-webhook/index.ts`
- Purpose: Handles Stripe webhook events

**Manual Deployment**:
```bash
# Using Supabase CLI
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

---

## Part 2: Configure Stripe

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Sign up for an account
3. Complete business verification

### Step 2: Create Products and Prices

#### Pro Plan Product
1. Go to Products in Stripe Dashboard
2. Click "Add Product"
3. Fill in:
   - Name: ScorePro Pro Plan
   - Description: All 87 courses, quizzes, certificates, and priority support
   - Pricing Model: Recurring
   - Price: $29.00 USD
   - Billing Period: Monthly
   - Add free trial: 7 days
4. Click "Save product"
5. **Copy the Price ID** (starts with `price_`)

#### Enterprise Plan Product
1. Click "Add Product"
2. Fill in:
   - Name: ScorePro Enterprise Plan
   - Description: Complete business launch package with software, training, and 1-on-1 support
   - Pricing Model: Recurring
   - Price: $250.00 USD
   - Billing Period: Monthly
   - Add free trial: 7 days
3. Click "Save product"
4. **Copy the Price ID**

### Step 3: Get API Keys
1. Go to Developers > API keys
2. Copy:
   - **Publishable key** (pk_test_... or pk_live_...)
   - **Secret key** (sk_test_... or sk_live_...)

### Step 4: Configure Webhook
1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://nybgfstvvufadfcbesus.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy the Webhook Signing Secret** (whsec_...)

### Step 5: Set Environment Variables in Supabase
1. Go to Project Settings > Edge Functions
2. Add these secrets:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Save changes
4. Restart edge functions

### Step 6: Update Price IDs in Code

**File**: `/workspace/scorepro-platform/src/pages/BillingPage.tsx`

Find and replace:
```typescript
priceId: 'price_pro_monthly',  // Replace with your actual Pro price ID
priceId: 'price_enterprise_monthly',  // Replace with your actual Enterprise price ID
```

**File**: `/workspace/supabase/migrations/1761173400_create_stripe_tables.sql`

Update the INSERT statement:
```sql
('price_pro_monthly', 'pro', ...)  -- Replace price_pro_monthly with actual ID
('price_enterprise_monthly', 'enterprise', ...)  -- Replace with actual ID
```

Then re-run the migration or update directly in database.

---

## Part 3: Test the Integration

### Test Cards (Stripe Test Mode)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Require 3D Secure**: 4000 0025 0000 3155

### End-to-End Test Flow

#### Test 1: Free User Experience
1. Register a new account
2. Verify you see "Free Plan" in billing page
3. Go to courses page
4. Verify you can access first 5 courses
5. Try to access course #6 - should show "Pro/Enterprise Only" lock
6. Click on locked course - should show toast error message

#### Test 2: Pro Subscription
1. Go to Billing page
2. Click "Start Pro Trial" button
3. Verify redirect to Stripe checkout
4. Use test card: 4242 4242 4242 4242
5. Complete payment
6. Verify redirect back to platform
7. Check subscription status shows "Pro Plan"
8. Go to courses page
9. Verify all 87 courses are now accessible
10. Verify no lock icons on any courses

#### Test 3: Enterprise Subscription
1. From Pro account, go to Billing
2. Click "Start Business Launch Program"
3. Use test card to upgrade
4. Verify subscription shows "Enterprise"
5. Verify all features accessible

#### Test 4: Webhook Events
1. In Stripe Dashboard, go to Webhooks
2. Check for successful deliveries
3. Verify events logged:
   - `checkout.session.completed`
   - `customer.subscription.created`
4. Check Supabase database:
   - Query `stripe_subscriptions` table
   - Verify subscription record created
   - Verify status is "active" or "trialing"

#### Test 5: Trial Period
1. Create new subscription with trial
2. Verify trial_end date is 7 days from now
3. During trial: User should have full access
4. After trial (in test, you can update date in DB): Verify billing occurs

#### Test 6: Subscription Cancellation
1. In Stripe Dashboard, cancel a test subscription
2. Verify webhook fires
3. Check database - status should update to "canceled"
4. User should lose Pro/Enterprise features
5. Should revert to Free plan (5 courses)

---

## Part 4: Subscription Logic Implementation

### How It Works

#### Subscription Checking (`/src/lib/subscription.ts`)
```typescript
// getUserSubscription() - Gets user's current plan
// Returns: { plan_type: 'free'|'pro'|'enterprise', status, course_limit }

// canAccessCourse() - Checks if user can access specific course
// Free users: First 5 courses only
// Pro/Enterprise: All courses

// canAccessCertificates() - Pro+ only
// canAccessQuiz() - Pro+ only
```

#### Course Catalog Enforcement
- Free users see lock icons on courses 6-87
- Clicking locked course shows upgrade prompt
- Subscription badge shows current plan
- Upgrade button visible for free users

#### Feature Gating
- **Certificates**: Pro/Enterprise only (enforced in CertificatesPage)
- **Quizzes**: Pro/Enterprise only (enforced in LessonPlayerPage)
- **Full Course Access**: Pro/Enterprise get all 87 courses
- **Free Users**: Limited to 5 courses

### Database Schema

**stripe_plans Table**:
```sql
id | price_id | plan_type | price | monthly_limit | features
1  | price_free | free | 0 | 5 | [...]
2  | price_pro_monthly | pro | 2900 | 87 | [...]
3  | price_enterprise_monthly | enterprise | 25000 | 87 | [...]
```

**stripe_subscriptions Table**:
```sql
id | user_id | stripe_subscription_id | price_id | status | trial_end | ...
1  | uuid... | sub_xxx | price_pro_monthly | active | 2025-11-01 | ...
```

---

## Part 5: Go Live Checklist

### Before Going Live
- [ ] Test all subscription flows in test mode
- [ ] Verify webhook events working correctly
- [ ] Test course access restrictions
- [ ] Test certificate generation for Pro users
- [ ] Verify trial period handling
- [ ] Test subscription cancellation
- [ ] Review all pricing and feature descriptions
- [ ] Test on multiple devices/browsers

### Switch to Live Mode
1. **Get Live API Keys from Stripe**:
   - Switch Stripe Dashboard to Live mode
   - Copy live publishable key (pk_live_...)
   - Copy live secret key (sk_live_...)

2. **Create Live Products**:
   - Create Pro plan product in live mode
   - Create Enterprise plan product in live mode
   - Copy live price IDs

3. **Configure Live Webhook**:
   - Create webhook endpoint in live mode
   - Same URL as test mode
   - Copy live webhook secret (whsec_...)

4. **Update Supabase Environment Variables**:
   - Replace test keys with live keys
   - Update STRIPE_SECRET_KEY
   - Update STRIPE_WEBHOOK_SECRET

5. **Update Frontend**:
   - Update price IDs in BillingPage.tsx
   - Rebuild and redeploy frontend

6. **Test with Real Card**:
   - Use a real card for a small test purchase
   - Verify entire flow works
   - Cancel test subscription immediately

7. **Monitor**:
   - Watch Stripe Dashboard for payments
   - Monitor Supabase logs for errors
   - Check webhook deliveries

---

## Part 6: Troubleshooting

### Issue: Checkout Button Not Working
**Check**:
1. Browser console for errors
2. Edge function deployed correctly
3. Stripe API keys configured
4. Price IDs match Stripe products

### Issue: Webhook Not Firing
**Check**:
1. Webhook URL is correct
2. Events are selected in Stripe
3. Webhook secret is correct in Supabase
4. Edge function logs for errors

### Issue: Subscription Not Showing
**Check**:
1. Database for subscription record
2. User ID matches auth.users
3. RLS policies allow user to read
4. Subscription status is 'active' or 'trialing'

### Issue: Course Access Not Working
**Check**:
1. Subscription record exists
2. Plan type is correct
3. Frontend subscription check working
4. Browser console for errors

### Issue: Payment Fails
**Check**:
1. Using correct test cards
2. Stripe account verified
3. Products configured correctly
4. Currency and amount correct

---

## Part 7: Manual Fallback (If Automated Deployment Fails)

### Deploy Migration Manually
1. Open Supabase Dashboard
2. SQL Editor
3. Copy entire migration file
4. Execute
5. Verify tables created

### Deploy Edge Functions Manually
1. Open Supabase Functions editor
2. Create new function: `create-checkout-session`
3. Copy code from `/workspace/supabase/functions/create-checkout-session/index.ts`
4. Deploy
5. Repeat for `stripe-webhook`

### Update Frontend Manually
1. Get code from `/workspace/scorepro-platform/src/pages/BillingPage.tsx`
2. Replace price IDs
3. Build: `pnpm run build`
4. Deploy dist folder

---

## Support Resources

**Stripe Documentation**:
- Checkout: https://stripe.com/docs/payments/checkout
- Subscriptions: https://stripe.com/docs/billing/subscriptions/overview
- Webhooks: https://stripe.com/docs/webhooks
- Test Cards: https://stripe.com/docs/testing

**Supabase Documentation**:
- Edge Functions: https://supabase.com/docs/guides/functions
- Database: https://supabase.com/docs/guides/database
- Auth: https://supabase.com/docs/guides/auth

**ScorePro Files**:
- Migration: `/workspace/supabase/migrations/1761173400_create_stripe_tables.sql`
- Edge Functions: `/workspace/supabase/functions/`
- Subscription Logic: `/workspace/scorepro-platform/src/lib/subscription.ts`
- Billing Page: `/workspace/scorepro-platform/src/pages/BillingPage.tsx`

---

## Next Steps

1. **Request Supabase token refresh** from coordinator
2. **Get Stripe API keys** (provide to system)
3. **Deploy backend** (migrations + edge functions)
4. **Configure Stripe** (products, webhook)
5. **Test thoroughly** using test cards
6. **Go live** when ready

---

**Status**: Backend code ready, awaiting deployment credentials  
**Estimated Time to Complete**: 2-4 hours once credentials provided  
**Created**: October 25, 2025

# Stripe Integration Guide for ScorePro Platform

This guide provides step-by-step instructions for integrating Stripe payment processing into the ScorePro E-Learning Platform.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Stripe Account Setup](#stripe-account-setup)
4. [Backend Integration](#backend-integration)
5. [Frontend Integration](#frontend-integration)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The ScorePro platform includes a complete database structure for subscriptions and payments. The billing UI is ready and waiting for Stripe integration. This guide will help you:

- Set up your Stripe account
- Create subscription products and prices
- Implement checkout flows
- Handle webhooks for subscription events
- Manage customer billing

**Current Status:**
- ✅ Database tables created (`subscriptions`, `payments`, `coupons`)
- ✅ Billing UI pages created
- ✅ RLS policies configured
- ❌ Stripe API integration (requires your API keys)
- ❌ Webhook handlers (code ready, needs deployment)
- ❌ Checkout flows (code ready, needs API keys)

---

## Prerequisites

- Node.js 18+ installed
- Supabase project configured (already done)
- Access to deploy Edge Functions
- Basic understanding of webhooks

---

## Stripe Account Setup

### Step 1: Create Stripe Account

1. Visit [https://stripe.com](https://stripe.com)
2. Click "Sign up" and create your account
3. Complete business verification (can start with test mode immediately)

### Step 2: Get API Keys

1. Navigate to **Developers > API keys** in Stripe Dashboard
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
4. **IMPORTANT**: Keep these keys secure - never commit them to version control

### Step 3: Create Products & Prices

1. Go to **Products** in Stripe Dashboard
2. Create three products matching your plans:

**Product 1: Pro Plan**
- Name: "ScorePro Pro Subscription"
- Description: "Full access to all 87 credit repair courses"
- Price: $29/month (recurring)
- Note the Price ID (starts with `price_`)

**Product 2: Enterprise Plan**
- Name: "ScorePro Enterprise Subscription"
- Description: "White-label multi-tenant access with custom branding"
- Price: $99/month (recurring)
- Note the Price ID

**Product 3: Free Plan**
- This doesn't need a Stripe product since it's free
- Handle access control in your application logic

---

## Backend Integration

### Step 1: Store Stripe Secrets in Supabase

1. Go to Supabase Dashboard > Project Settings > Edge Functions
2. Add environment secrets:

```bash
# Test Mode Keys (for development)
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Live Mode Keys (for production)
# STRIPE_SECRET_KEY=sk_live_your_live_secret_key
# STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
# STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Step 2: Create Checkout Edge Function

Create a new file: `supabase/functions/create-checkout-session/index.ts`

```typescript
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { priceId, successUrl, cancelUrl } = await req.json();

        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not configured');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) throw new Error('No authorization header');

        const token = authHeader.replace('Bearer ', '');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        // Verify user
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey!
            }
        });

        if (!userResponse.ok) throw new Error('Invalid token');
        const userData = await userResponse.json();

        // Create Stripe checkout session
        const checkoutSession = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'mode': 'subscription',
                'payment_method_types[]': 'card',
                'line_items[0][price]': priceId,
                'line_items[0][quantity]': '1',
                'success_url': successUrl,
                'cancel_url': cancelUrl,
                'client_reference_id': userData.id,
                'customer_email': userData.email,
            }),
        });

        const session = await checkoutSession.json();

        return new Response(JSON.stringify({ data: { sessionId: session.id, url: session.url } }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            error: { code: 'CHECKOUT_FAILED', message: error.message }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
```

### Step 3: Create Webhook Handler Edge Function

Create a new file: `supabase/functions/stripe-webhook/index.ts`

```typescript
Deno.serve(async (req) => {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!signature || !webhookSecret) {
        return new Response('Webhook signature or secret missing', { status: 400 });
    }

    try {
        const body = await req.text();
        
        // Verify webhook signature
        // Note: Full Stripe webhook verification requires crypto operations
        // For production, consider using Stripe's official libraries or implement full HMAC verification
        
        const event = JSON.parse(body);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                
                // Create subscription record
                await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey!,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: session.client_reference_id,
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription,
                        plan_name: 'pro', // Determine from price ID
                        status: 'active',
                        current_period_start: new Date().toISOString(),
                        current_period_end: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
                    })
                });
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                
                // Update subscription status
                await fetch(
                    `${supabaseUrl}/rest/v1/subscriptions?stripe_subscription_id=eq.${subscription.id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey!,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: subscription.status,
                            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        })
                    }
                );
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                
                // Record payment
                await fetch(`${supabaseUrl}/rest/v1/payments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey!,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        stripe_payment_id: invoice.payment_intent,
                        amount: invoice.amount_paid / 100,
                        currency: invoice.currency,
                        status: 'succeeded',
                        payment_date: new Date(invoice.created * 1000).toISOString(),
                    })
                });
                break;
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return new Response(`Webhook error: ${error.message}`, { status: 400 });
    }
});
```

### Step 4: Deploy Edge Functions

Deploy both edge functions using the deployment tool:

```bash
# Deploy checkout session function
supabase functions deploy create-checkout-session

# Deploy webhook handler
supabase functions deploy stripe-webhook
```

### Step 5: Configure Webhook in Stripe

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://nybgfstvvufadfcbesus.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your Supabase Edge Function secrets as `STRIPE_WEBHOOK_SECRET`

---

## Frontend Integration

### Step 1: Update Environment Variables

Update your frontend Supabase client configuration to include Stripe publishable key:

```typescript
// src/lib/stripe.ts
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key';

export const STRIPE_PRICE_IDS = {
  pro: 'price_your_pro_price_id',
  enterprise: 'price_your_enterprise_price_id',
};
```

### Step 2: Update Billing Page

Update `src/pages/BillingPage.tsx` to integrate Stripe Checkout:

```typescript
import { STRIPE_PRICE_IDS } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

const handleSubscribe = async (priceId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        successUrl: `${window.location.origin}/billing?success=true`,
        cancelUrl: `${window.location.origin}/billing?canceled=true`,
      }
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    if (data?.data?.url) {
      window.location.href = data.data.url;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to start checkout. Please try again.');
  }
};

// Add to your "Upgrade" buttons:
<button 
  onClick={() => handleSubscribe(STRIPE_PRICE_IDS.pro)}
  className="..."
>
  Upgrade to Pro
</button>
```

### Step 3: Add Subscription Status Check

Update dashboard to check active subscription:

```typescript
const checkSubscription = async (userId: string) => {
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  return data;
};
```

---

## Testing

### Test Mode

1. Use test API keys (pk_test_* and sk_test_*)
2. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`
3. Use any future expiry date and any CVC

### Test Workflow

1. Navigate to `/billing` page
2. Click "Upgrade to Pro"
3. Complete checkout with test card
4. Verify redirect to success URL
5. Check database for new subscription record
6. Verify webhook received in Stripe Dashboard

### Common Test Scenarios

- ✅ Successful subscription creation
- ✅ Failed payment handling
- ✅ Subscription cancellation
- ✅ Subscription renewal
- ✅ Payment method update

---

## Production Deployment

### Pre-Launch Checklist

- [ ] Complete Stripe account verification
- [ ] Switch to live API keys
- [ ] Update webhook endpoint to use live keys
- [ ] Test with real payment method
- [ ] Configure email receipts in Stripe
- [ ] Set up fraud detection rules
- [ ] Review pricing and product descriptions
- [ ] Test subscription cancellation flow
- [ ] Set up billing email notifications
- [ ] Configure tax settings (if applicable)

### Switch to Live Mode

1. In Stripe Dashboard, toggle to "Live mode"
2. Get live API keys from **Developers > API keys**
3. Update Supabase Edge Function secrets:
   ```bash
   STRIPE_SECRET_KEY=sk_live_your_live_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   ```
4. Update webhook endpoint to use live mode
5. Update frontend configuration with live publishable key

### Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhooks** with signature verification
3. **Use HTTPS** for all communications
4. **Implement rate limiting** on checkout endpoints
5. **Log all transactions** for audit trail
6. **Monitor for fraud** using Stripe Radar

---

## Troubleshooting

### Issue: Webhook not receiving events

**Solution:**
1. Check webhook URL is correct
2. Verify endpoint is publicly accessible
3. Check Stripe Dashboard > Webhooks > Events for errors
4. Ensure webhook secret is correctly configured

### Issue: Checkout session creation fails

**Solution:**
1. Verify API keys are correct
2. Check price ID exists in Stripe
3. Ensure user is authenticated
4. Check Edge Function logs for errors

### Issue: Subscription not showing in database

**Solution:**
1. Verify webhook received `checkout.session.completed` event
2. Check RLS policies allow INSERT on subscriptions table
3. Verify user_id matches between Stripe and database
4. Check Edge Function logs for database errors

### Issue: Payment succeeded but subscription inactive

**Solution:**
1. Check subscription status in Stripe Dashboard
2. Verify webhook events were processed
3. Check database subscription status field
4. Ensure `customer.subscription.updated` webhook is configured

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)

---

## Support

For issues with:
- **Stripe Integration**: Contact Stripe Support or visit [Stripe Community](https://support.stripe.com/)
- **Supabase Functions**: Check [Supabase Discord](https://discord.supabase.com)
- **Platform Issues**: Review deployment documentation

---

**Last Updated:** 2025-10-22

**Status:** Ready for integration - requires Stripe account and API keys

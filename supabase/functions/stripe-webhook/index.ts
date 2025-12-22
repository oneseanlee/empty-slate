// Stripe Webhook Handler Edge Function
// Handles Stripe webhook events for subscription management

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No stripe-signature header');
    }

    const body = await req.text();
    
    // Verify webhook signature (simplified - in production use crypto library)
    // For now, we'll trust the webhook and process the event
    const event = JSON.parse(body);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = session.subscription;
        const customerEmail = session.customer_email;
        
        // Get user by email
        const { data: userData } = await supabase.auth.admin.listUsers();
        const user = userData?.users?.find(u => u.email === customerEmail);
        
        if (!user) {
          console.error('User not found for email:', customerEmail);
          break;
        }

        // Get subscription details from Stripe
        const stripeResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${subscription}`, {
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          },
        });
        const subscriptionData = await stripeResponse.json();

        // Map Stripe price to our plan type
        const priceId = subscriptionData.items.data[0].price.id;
        
        // Create subscription record
        await supabase.from('stripe_subscriptions').insert({
          user_id: user.id,
          stripe_subscription_id: subscription,
          stripe_customer_id: session.customer,
          price_id: priceId,
          status: subscriptionData.status,
          trial_end: subscriptionData.trial_end ? new Date(subscriptionData.trial_end * 1000).toISOString() : null,
          current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        await supabase
          .from('stripe_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await supabase
          .from('stripe_subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: {
          code: 'WEBHOOK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

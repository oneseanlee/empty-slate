// Stripe Webhook Handler Edge Function
// Handles Stripe webhook events for subscription management

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@14.10.0';

// HMAC-based signature verification for Stripe webhooks
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = signature.split(',');
    let timestamp = '';
    let v1Signatures: string[] = [];
    
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key === 'v1') {
        v1Signatures.push(value);
      }
    }
    
    if (!timestamp || v1Signatures.length === 0) {
      console.error('Invalid signature format: missing timestamp or v1 signature');
      return false;
    }
    
    // Check timestamp to prevent replay attacks (5 minute tolerance)
    const timestampSeconds = parseInt(timestamp, 10);
    const currentSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(currentSeconds - timestampSeconds) > 300) {
      console.error('Webhook timestamp too old or in the future');
      return false;
    }
    
    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`;
    
    // Calculate expected signature using HMAC-SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );
    
    // Convert to hex
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare with provided signatures (constant-time comparison)
    for (const sig of v1Signatures) {
      if (sig.length === expectedSignature.length) {
        let match = true;
        for (let i = 0; i < sig.length; i++) {
          if (sig[i] !== expectedSignature[i]) {
            match = false;
          }
        }
        if (match) {
          return true;
        }
      }
    }
    
    console.error('Signature verification failed: no matching signature');
    return false;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

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
      console.error('Missing required environment variables');
      throw new Error('Missing required environment variables');
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No stripe-signature header present');
      return new Response(
        JSON.stringify({ error: { code: 'MISSING_SIGNATURE', message: 'No stripe-signature header' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const body = await req.text();
    
    // Verify the webhook signature using HMAC-SHA256
    const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
    
    if (!isValid) {
      console.error('Webhook signature verification failed');
      return new Response(
        JSON.stringify({ error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse the verified event
    const event = JSON.parse(body);
    
    console.log(`Processing verified webhook event: ${event.type} (${event.id})`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = session.subscription;
        const customerEmail = session.customer_email;
        
        console.log(`Processing checkout.session.completed for ${customerEmail}`);
        
        // Validate required fields
        if (!customerEmail || !subscription) {
          console.error('Missing required fields in checkout session');
          break;
        }
        
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
        
        if (!stripeResponse.ok) {
          console.error('Failed to fetch subscription from Stripe');
          break;
        }
        
        const subscriptionData = await stripeResponse.json();

        // Map Stripe price to our plan type
        const priceId = subscriptionData.items?.data?.[0]?.price?.id;
        
        if (!priceId) {
          console.error('No price ID found in subscription data');
          break;
        }
        
        // Create subscription record
        const { error: insertError } = await supabase.from('stripe_subscriptions').insert({
          user_id: user.id,
          stripe_subscription_id: subscription,
          stripe_customer_id: session.customer,
          price_id: priceId,
          status: subscriptionData.status,
          trial_end: subscriptionData.trial_end ? new Date(subscriptionData.trial_end * 1000).toISOString() : null,
          current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
        });
        
        if (insertError) {
          console.error('Failed to insert subscription:', insertError);
        } else {
          console.log(`Subscription created for user ${user.id}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        console.log(`Processing subscription update for ${subscription.id}`);
        
        const { error: updateError } = await supabase
          .from('stripe_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
          
        if (updateError) {
          console.error('Failed to update subscription:', updateError);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        console.log(`Processing subscription deletion for ${subscription.id}`);
        
        const { error: deleteError } = await supabase
          .from('stripe_subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
          
        if (deleteError) {
          console.error('Failed to mark subscription as canceled:', deleteError);
        }
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
          message: 'Webhook processing failed',
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

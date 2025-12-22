// Stripe Checkout Session Creation Edge Function
// This function creates a Stripe checkout session for subscription payments

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const { planType, customerEmail } = await req.json();
    
    if (!planType || !customerEmail) {
      throw new Error('Missing required parameters: planType and customerEmail');
    }

    // Map plan types to Stripe price IDs
    const priceIdMap: Record<string, string> = {
      'pro': 'price_pro_monthly',
      'enterprise': 'price_enterprise_monthly',
    };

    const priceId = priceIdMap[planType];
    if (!priceId) {
      throw new Error(`Invalid plan type: ${planType}`);
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Stripe checkout session
    const checkoutData = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      customer_email: customerEmail,
      success_url: `${req.headers.get('origin') || 'http://localhost:5173'}/billing?session_id={CHECKOUT_SESSION_ID}&subscription=success`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:5173'}/billing?subscription=cancelled`,
      subscription_data: {
        trial_period_days: 7, // 7-day free trial for paid plans
      },
      metadata: {
        plan_type: planType,
      },
    };

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(checkoutData as any).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({ 
        data: { 
          checkoutUrl: session.url,
          sessionId: session.id,
        } 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: {
          code: 'CHECKOUT_ERROR',
          message: error.message,
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

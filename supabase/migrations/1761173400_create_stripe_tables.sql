-- Create Stripe Plans Table
CREATE TABLE IF NOT EXISTS stripe_plans (
  id SERIAL PRIMARY KEY,
  price_id VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  price INTEGER NOT NULL,
  monthly_limit INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Stripe Subscriptions Table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  price_id VARCHAR(255) NOT NULL REFERENCES stripe_plans(price_id),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete')),
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE stripe_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_plans
CREATE POLICY "Anyone can view plans"
  ON stripe_plans FOR SELECT
  USING (true);

-- RLS Policies for stripe_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON stripe_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON stripe_subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert default plans
INSERT INTO stripe_plans (price_id, plan_type, price, monthly_limit, features) VALUES
  ('price_free', 'free', 0, 5, '["Access to 5 courses", "Basic progress tracking", "XP and levels system", "Badge earning"]'::jsonb),
  ('price_pro_monthly', 'pro', 2900, 87, '["All 87 courses (complete curriculum)", "All 97 quizzes", "Certificates upon completion", "Full progress tracking", "Priority support"]'::jsonb),
  ('price_enterprise_monthly', 'enterprise', 25000, 87, '["Everything in Pro", "White-labeled credit repair software platform", "Complete business training program", "1-on-1 business launch support", "Weekly coaching calls for 3 months", "Custom domain and branding setup", "Multi-user licenses", "Dedicated account manager"]'::jsonb)
ON CONFLICT (price_id) DO NOTHING;

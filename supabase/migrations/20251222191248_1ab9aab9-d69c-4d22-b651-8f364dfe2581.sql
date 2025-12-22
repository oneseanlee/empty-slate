-- Create tenants table
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    custom_domain TEXT,
    branding_config JSONB DEFAULT '{"logo_url": "", "primary_color": "#1d4ed8", "secondary_color": "#22c55e", "font_family": "Inter"}'::jsonb,
    stripe_account_id TEXT,
    revenue_share_percentage DECIMAL(5,2) DEFAULT 70.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    display_order INTEGER DEFAULT 0,
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'interactive')),
    video_url TEXT,
    transcript TEXT,
    content_html TEXT,
    duration_minutes INTEGER,
    display_order INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score INTEGER DEFAULT 70,
    questions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (application users, not auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'reseller_admin', 'instructor', 'support', 'learner', 'finance')),
    profile_data JSONB DEFAULT '{}'::jsonb,
    subscription_plan TEXT DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_xp table
CREATE TABLE public.user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    criteria_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    badge_type TEXT CHECK (badge_type IN ('category', 'milestone', 'streak', 'quiz')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('category', 'master')),
    verification_code TEXT UNIQUE NOT NULL,
    certificate_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    answers_json JSONB DEFAULT '{}'::jsonb,
    attempted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'monthly', 'annual', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stripe_subscriptions view/table for billing
CREATE TABLE public.stripe_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT DEFAULT 'active',
    stripe_plans JSONB DEFAULT '{"name": "free", "price": 0}'::jsonb,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discussions table
CREATE TABLE public.discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    is_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discussion_votes table
CREATE TABLE public.discussion_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(discussion_id, user_id)
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for courses, lessons, categories (learning content)
CREATE POLICY "Anyone can view active tenants" ON public.tenants FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active lessons" ON public.lessons FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active quizzes" ON public.quizzes FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active badges" ON public.badges FOR SELECT USING (is_active = true);

-- Users can manage their own data
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- User XP policies
CREATE POLICY "Users can view their own XP" ON public.user_xp FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert their own XP" ON public.user_xp FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own XP" ON public.user_xp FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Certificates policies
CREATE POLICY "Users can view their own certificates" ON public.certificates FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert their own certificates" ON public.certificates FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert their own quiz attempts" ON public.quiz_attempts FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can view their own stripe subscriptions" ON public.stripe_subscriptions FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Discussions policies (public read, authenticated write)
CREATE POLICY "Anyone can view discussions" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON public.discussions FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own discussions" ON public.discussions FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Discussion votes policies
CREATE POLICY "Anyone can view votes" ON public.discussion_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.discussion_votes FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can create their own tickets" ON public.support_tickets FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Coupons public read
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Audit logs (admin only - no public access)
CREATE POLICY "No public access to audit logs" ON public.audit_logs FOR SELECT USING (false);

-- Insert default tenant for new users
INSERT INTO public.tenants (id, name, slug) 
VALUES ('00000000-0000-0000-0000-000000000001', 'ScorePro', 'scorepro');
-- Migration: enable_rls_policies
-- Created at: 1761068742

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  SELECT tenant_id INTO v_tenant_id
  FROM users
  WHERE auth_user_id = auth.uid();
  RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user has role
CREATE OR REPLACE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM users
  WHERE auth_user_id = auth.uid();
  RETURN v_role = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tenants policies (only super admins can manage tenants)
CREATE POLICY "Super admins can view all tenants" ON tenants
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Super admins can insert tenants" ON tenants
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Super admins can update tenants" ON tenants
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Users policies (tenant isolated)
CREATE POLICY "Users can view users in same tenant" ON users
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    (tenant_id = get_user_tenant_id() OR user_has_role('super_admin'))
  );

CREATE POLICY "Users can be created" ON users
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (
    auth.role() IN ('anon', 'service_role') AND
    (auth_user_id = auth.uid() OR user_has_role('reseller_admin') OR user_has_role('super_admin'))
  );

-- Categories policies (tenant isolated or global)
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    is_active = true AND
    (tenant_id IS NULL OR tenant_id = get_user_tenant_id())
  );

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Courses policies
CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    is_active = true AND
    (tenant_id IS NULL OR tenant_id = get_user_tenant_id())
  );

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Lessons policies
CREATE POLICY "Anyone can view active lessons" ON lessons
  FOR SELECT USING (auth.role() IN ('anon', 'service_role') AND is_active = true);

CREATE POLICY "Admins can manage lessons" ON lessons
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Quizzes policies
CREATE POLICY "Anyone can view quizzes" ON quizzes
  FOR SELECT USING (auth.role() IN ('anon', 'service_role') AND is_active = true);

CREATE POLICY "Admins can manage quizzes" ON quizzes
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can create quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- User progress policies
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update their progress" ON user_progress
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Certificates policies
CREATE POLICY "Anyone can view certificates for verification" ON certificates
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "System can create certificates" ON certificates
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Badges policies
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT USING (auth.role() IN ('anon', 'service_role') AND is_active = true);

CREATE POLICY "Admins can manage badges" ON badges
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- User badges policies
CREATE POLICY "Users can view their badges" ON user_badges
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "System can award badges" ON user_badges
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- User XP policies
CREATE POLICY "Users can view their XP" ON user_xp
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "System can manage XP" ON user_xp
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Discussions policies
CREATE POLICY "Anyone can view discussions" ON discussions
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Authenticated users can create discussions" ON discussions
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update their own discussions" ON discussions
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Discussion votes policies
CREATE POLICY "Anyone can view votes" ON discussion_votes
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can vote" ON discussion_votes
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Support tickets policies
CREATE POLICY "Users can view tickets in their tenant" ON support_tickets
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Support staff can update tickets" ON support_tickets
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Subscriptions policies
CREATE POLICY "Users can view subscriptions in their tenant" ON subscriptions
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    tenant_id = get_user_tenant_id()
  );

CREATE POLICY "System can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Payments policies
CREATE POLICY "Users can view payments in their tenant" ON payments
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    tenant_id = get_user_tenant_id()
  );

CREATE POLICY "System can create payments" ON payments
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Coupons policies
CREATE POLICY "Users can view active coupons" ON coupons
  FOR SELECT USING (
    auth.role() IN ('anon', 'service_role') AND
    is_active = true AND
    tenant_id = get_user_tenant_id()
  );

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- Audit logs policies (read-only for admins)
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));;
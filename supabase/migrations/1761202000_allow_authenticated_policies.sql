-- Migration: allow_authenticated_policies
-- Add authenticated access policies required by the app.

-- Users
CREATE POLICY "Authenticated users can view own profile or tenant users"
  ON users FOR SELECT
  USING (
    auth.uid() = auth_user_id
    OR (user_has_role('reseller_admin') AND tenant_id = get_user_tenant_id())
    OR user_has_role('super_admin')
  );

CREATE POLICY "Authenticated users can update own profile"
  ON users FOR UPDATE
  USING (
    auth.uid() = auth_user_id
    OR (user_has_role('reseller_admin') AND tenant_id = get_user_tenant_id())
    OR user_has_role('super_admin')
  );

CREATE POLICY "Authenticated users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Categories
CREATE POLICY "Authenticated can view active categories"
  ON categories FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND is_active = true
    AND (tenant_id IS NULL OR tenant_id = get_user_tenant_id())
  );

-- Courses
CREATE POLICY "Authenticated can view active courses"
  ON courses FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND is_active = true
    AND (tenant_id IS NULL OR tenant_id = get_user_tenant_id())
  );

-- Lessons
CREATE POLICY "Authenticated can view active lessons"
  ON lessons FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);

-- Quizzes
CREATE POLICY "Authenticated can view active quizzes"
  ON quizzes FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);

-- Quiz attempts
CREATE POLICY "Authenticated users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User progress
CREATE POLICY "Authenticated users can manage own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User XP
CREATE POLICY "Authenticated users can manage own XP"
  ON user_xp FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User badges
CREATE POLICY "Authenticated users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Certificates
CREATE POLICY "Authenticated users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

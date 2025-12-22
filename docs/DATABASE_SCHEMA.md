# ScorePro E-Learning Platform - Database Schema Documentation

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**Database:** PostgreSQL 15 on Supabase  
**Total Tables:** 20  

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Core Tables](#core-tables)
3. [Learning Content Tables](#learning-content-tables)
4. [User Progress Tables](#user-progress-tables)
5. [Gamification Tables](#gamification-tables)
6. [Billing Tables](#billing-tables)
7. [Community Tables](#community-tables)
8. [Multi-Tenant Tables](#multi-tenant-tables)
9. [Relationships & Foreign Keys](#relationships--foreign-keys)
10. [Indexes](#indexes)
11. [Row-Level Security (RLS)](#row-level-security-rls)
12. [Common Queries](#common-queries)

---

## Schema Overview

### Database Structure

```
Core Authentication
  └── users (extends Supabase auth.users)

Learning Content
  └── categories
      └── courses
          └── lessons
              └── quizzes

User Progress
  └── user_progress
  └── quiz_submissions
  └── user_xp

Gamification
  └── badges
  └── user_badges
  └── certificates

Billing
  └── subscriptions
  └── payments

Community (Future)
  └── discussions
  └── discussion_replies
  └── support_tickets
  └── ticket_messages

Multi-Tenant
  └── tenants
  └── audit_logs
```

---

## Core Tables

### `users`

Extends Supabase `auth.users` with additional profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, FK to auth.users | User ID (from Supabase Auth) |
| `email` | text | UNIQUE, NOT NULL | User email address |
| `full_name` | text | | Full name |
| `avatar_url` | text | | Profile picture URL |
| `role` | text | DEFAULT 'learner' | User role (learner, reseller_admin, super_admin) |
| `subscription_tier` | text | DEFAULT 'free' | Subscription level (free, pro, enterprise) |
| `tenant_id` | uuid | FK to tenants | Associated tenant (for white-label) |
| `is_active` | boolean | DEFAULT true | Account active status |
| `last_login_at` | timestamptz | | Last login timestamp |
| `created_at` | timestamptz | DEFAULT now() | Account creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `users_email_idx` on `email`
- `users_tenant_id_idx` on `tenant_id`
- `users_subscription_tier_idx` on `subscription_tier`

**RLS:** Users can read/update their own record; admins can read all users in their tenant.

---

## Learning Content Tables

### `categories`

Course categories (12 total).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Category ID |
| `name` | text | NOT NULL | Category name |
| `description` | text | | Category description |
| `icon_name` | text | | Icon identifier for UI |
| `display_order` | int | UNIQUE | Sort order for display |
| `is_active` | boolean | DEFAULT true | Category visible/hidden |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |

**Example Data:**
```sql
INSERT INTO categories (name, description, display_order) VALUES
  ('Getting Started', 'Begin your credit repair journey', 1),
  ('Credit Fundamentals', 'Core concepts you need to know', 2),
  ...
```

**Indexes:**
- `categories_display_order_idx` on `display_order`

**RLS:** Public read access; admin-only write.

### `courses`

Individual courses (87 total).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Course ID |
| `category_id` | uuid | FK to categories, NOT NULL | Parent category |
| `title` | text | NOT NULL | Course title |
| `description` | text | | Course description |
| `difficulty_level` | text | | beginner/intermediate/advanced |
| `estimated_duration_minutes` | int | | Estimated completion time |
| `display_order` | int | | Order within category |
| `is_active` | boolean | DEFAULT true | Course available |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `courses_category_id_idx` on `category_id`
- `courses_display_order_idx` on `display_order`

**RLS:** Public read access (filtered by subscription tier in application); admin-only write.

### `lessons`

Lesson content within courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Lesson ID |
| `course_id` | uuid | FK to courses, NOT NULL | Parent course |
| `title` | text | NOT NULL | Lesson title |
| `description` | text | | Brief description |
| `content_html` | text | | Full lesson content (HTML) |
| `video_url` | text | | Video URL (YouTube, Vimeo, etc.) |
| `duration_minutes` | int | | Estimated reading time |
| `display_order` | int | | Order within course |
| `xp_reward` | int | DEFAULT 10 | XP awarded for completion |
| `is_active` | boolean | DEFAULT true | Lesson available |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `lessons_course_id_idx` on `course_id`
- `lessons_display_order_idx` on `display_order`

**RLS:** Public read access; admin-only write.

### `quizzes`

Quizzes associated with lessons.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Quiz ID |
| `lesson_id` | uuid | FK to lessons, NOT NULL | Associated lesson |
| `title` | text | NOT NULL | Quiz title |
| `questions` | jsonb | NOT NULL | Array of question objects |
| `passing_score` | int | DEFAULT 70 | Minimum percentage to pass |
| `xp_reward` | int | DEFAULT 20 | XP for passing |
| `is_active` | boolean | DEFAULT true | Quiz available |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**JSONB Structure (`questions`):**
```json
[
  {
    "question": "What percentage of your FICO score is payment history?",
    "options": ["35%", "30%", "15%", "10%"],
    "correct_answer": 0,
    "explanation": "Payment history is the most important factor at 35%."
  }
]
```

**Indexes:**
- `quizzes_lesson_id_idx` on `lesson_id`

**RLS:** Public read access; admin-only write.

---

## User Progress Tables

### `user_progress`

Tracks lesson completion per user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Progress record ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `lesson_id` | uuid | FK to lessons, NOT NULL | Lesson |
| `completed` | boolean | DEFAULT false | Lesson completed |
| `completed_at` | timestamptz | | Completion timestamp |
| `time_spent_seconds` | int | DEFAULT 0 | Time spent on lesson |
| `created_at` | timestamptz | DEFAULT now() | First access timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**Unique Constraint:** `(user_id, lesson_id)` - One progress record per user per lesson

**Indexes:**
- `user_progress_user_id_idx` on `user_id`
- `user_progress_lesson_id_idx` on `lesson_id`
- `user_progress_completed_idx` on `completed`

**RLS:** Users can read/write their own progress; admins can read all in their tenant.

### `quiz_submissions`

Tracks quiz attempts and scores.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Submission ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `quiz_id` | uuid | FK to quizzes, NOT NULL | Quiz |
| `answers` | jsonb | NOT NULL | User's answers |
| `score` | int | NOT NULL | Score percentage (0-100) |
| `passed` | boolean | NOT NULL | Whether user passed |
| `time_spent_seconds` | int | DEFAULT 0 | Time spent on quiz |
| `created_at` | timestamptz | DEFAULT now() | Submission timestamp |

**JSONB Structure (`answers`):**
```json
[
  {"question_index": 0, "selected_answer": 0, "correct": true},
  {"question_index": 1, "selected_answer": 2, "correct": false}
]
```

**Indexes:**
- `quiz_submissions_user_id_idx` on `user_id`
- `quiz_submissions_quiz_id_idx` on `quiz_id`
- `quiz_submissions_passed_idx` on `passed`

**RLS:** Users can read/write their own submissions; admins can read all in their tenant.

### `user_xp`

Tracks user XP, level, and streaks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Record ID |
| `user_id` | uuid | FK to users, UNIQUE, NOT NULL | User |
| `total_xp` | int | DEFAULT 0 | Total XP earned |
| `level` | int | DEFAULT 1 | Current level |
| `current_streak` | int | DEFAULT 0 | Consecutive days active |
| `longest_streak` | int | DEFAULT 0 | Best streak achieved |
| `last_activity_date` | date | | Last activity date (for streaks) |
| `created_at` | timestamptz | DEFAULT now() | First activity timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `user_xp_user_id_idx` on `user_id` (unique)
- `user_xp_total_xp_idx` on `total_xp` (for leaderboards)

**RLS:** Users can read/write their own XP; admins can read all in their tenant.

---

## Gamification Tables

### `badges`

Available achievement badges (22 total).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Badge ID |
| `name` | text | NOT NULL | Badge name |
| `description` | text | | Badge description |
| `icon_name` | text | | Icon identifier |
| `criteria_type` | text | NOT NULL | How badge is earned |
| `criteria_value` | int | | Threshold value |
| `xp_reward` | int | DEFAULT 0 | Bonus XP for earning |
| `badge_category` | text | | Category (milestone, streak, etc.) |
| `display_order` | int | | Display order |
| `is_active` | boolean | DEFAULT true | Badge available |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |

**Criteria Types:**
- `first_login`
- `lessons_completed` (criteria_value = number of lessons)
- `quizzes_passed`
- `streak_days`
- `perfect_quiz`
- `category_complete`
- etc.

**Indexes:**
- `badges_criteria_type_idx` on `criteria_type`
- `badges_display_order_idx` on `display_order`

**RLS:** Public read access; admin-only write.

### `user_badges`

Badges earned by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Record ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `badge_id` | uuid | FK to badges, NOT NULL | Badge earned |
| `earned_at` | timestamptz | DEFAULT now() | When badge was earned |

**Unique Constraint:** `(user_id, badge_id)` - Each badge earned once per user

**Indexes:**
- `user_badges_user_id_idx` on `user_id`
- `user_badges_badge_id_idx` on `badge_id`

**RLS:** Users can read their own badges; admins can read all in their tenant.

### `certificates`

Generated certificates for completed categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Certificate ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `category_id` | uuid | FK to categories, NOT NULL | Completed category |
| `certificate_code` | text | UNIQUE, NOT NULL | Verification code |
| `issued_at` | timestamptz | DEFAULT now() | Issue date |
| `pdf_url` | text | | PDF file URL (future) |

**Unique Constraint:** `(user_id, category_id)` - One certificate per user per category

**Indexes:**
- `certificates_user_id_idx` on `user_id`
- `certificates_certificate_code_idx` on `certificate_code` (unique)

**RLS:** Users can read their own certificates; admins can read all in their tenant.

---

## Billing Tables

### `subscriptions`

User subscription records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Subscription ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `stripe_subscription_id` | text | UNIQUE | Stripe subscription ID |
| `stripe_customer_id` | text | | Stripe customer ID |
| `tier` | text | NOT NULL | free/pro/enterprise |
| `status` | text | NOT NULL | active/canceled/past_due/etc. |
| `current_period_start` | timestamptz | | Billing period start |
| `current_period_end` | timestamptz | | Billing period end |
| `cancel_at_period_end` | boolean | DEFAULT false | Auto-cancel flag |
| `created_at` | timestamptz | DEFAULT now() | Subscription creation |
| `updated_at` | timestamptz | DEFAULT now() | Last update |

**Indexes:**
- `subscriptions_user_id_idx` on `user_id`
- `subscriptions_stripe_subscription_id_idx` on `stripe_subscription_id`
- `subscriptions_status_idx` on `status`

**RLS:** Users can read their own subscriptions; admins can read all in their tenant.

### `payments`

Payment transaction records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Payment ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `subscription_id` | uuid | FK to subscriptions | Related subscription |
| `stripe_payment_id` | text | UNIQUE | Stripe payment intent ID |
| `amount` | int | NOT NULL | Amount in cents |
| `currency` | text | DEFAULT 'usd' | Currency code |
| `status` | text | NOT NULL | succeeded/failed/pending |
| `description` | text | | Payment description |
| `created_at` | timestamptz | DEFAULT now() | Payment timestamp |

**Indexes:**
- `payments_user_id_idx` on `user_id`
- `payments_subscription_id_idx` on `subscription_id`
- `payments_stripe_payment_id_idx` on `stripe_payment_id`
- `payments_status_idx` on `status`

**RLS:** Users can read their own payments; admins can read all in their tenant.

---

## Community Tables

### `discussions`

Community Q&A threads (future feature).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Discussion ID |
| `user_id` | uuid | FK to users, NOT NULL | Author |
| `lesson_id` | uuid | FK to lessons | Related lesson (optional) |
| `title` | text | NOT NULL | Discussion title |
| `content` | text | NOT NULL | Discussion body |
| `is_pinned` | boolean | DEFAULT false | Pinned to top |
| `is_locked` | boolean | DEFAULT false | Locked (no new replies) |
| `view_count` | int | DEFAULT 0 | Times viewed |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**RLS:** Public read; authenticated write; author can update/delete own.

### `discussion_replies`

Replies to discussions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Reply ID |
| `discussion_id` | uuid | FK to discussions, NOT NULL | Parent discussion |
| `user_id` | uuid | FK to users, NOT NULL | Author |
| `content` | text | NOT NULL | Reply body |
| `is_solution` | boolean | DEFAULT false | Marked as solution |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**RLS:** Public read; authenticated write; author can update/delete own.

### `support_tickets`

Support ticket system (future feature).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Ticket ID |
| `user_id` | uuid | FK to users, NOT NULL | User |
| `subject` | text | NOT NULL | Ticket subject |
| `category` | text | | Category (billing, technical, etc.) |
| `priority` | text | DEFAULT 'normal' | low/normal/high/urgent |
| `status` | text | DEFAULT 'open' | open/in_progress/resolved/closed |
| `assigned_to` | uuid | FK to users | Admin assigned |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |
| `resolved_at` | timestamptz | | Resolution timestamp |

**RLS:** Users can read/write their own tickets; admins can read/write all in their tenant.

### `ticket_messages`

Messages within support tickets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Message ID |
| `ticket_id` | uuid | FK to support_tickets, NOT NULL | Parent ticket |
| `user_id` | uuid | FK to users, NOT NULL | Author |
| `message` | text | NOT NULL | Message content |
| `is_internal` | boolean | DEFAULT false | Admin-only note |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |

**RLS:** Users can read messages on their tickets; admins can read/write all in their tenant.

---

## Multi-Tenant Tables

### `tenants`

White-label tenant/reseller organizations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Tenant ID |
| `name` | text | NOT NULL | Organization name |
| `subdomain` | text | UNIQUE | Subdomain (e.g., acme) |
| `custom_domain` | text | UNIQUE | Custom domain |
| `logo_url` | text | | Logo image URL |
| `primary_color` | text | | Brand primary color |
| `secondary_color` | text | | Brand secondary color |
| `email_from_name` | text | | Email sender name |
| `email_from_address` | text | | Email sender address |
| `is_active` | boolean | DEFAULT true | Tenant active |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update timestamp |

**RLS:** Admins can read their own tenant; super admins can read all.

### `audit_logs`

Audit trail for important actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | Log ID |
| `user_id` | uuid | FK to users | User who performed action |
| `tenant_id` | uuid | FK to tenants | Related tenant |
| `action` | text | NOT NULL | Action performed |
| `resource_type` | text | | Type of resource (user, course, etc.) |
| `resource_id` | uuid | | ID of affected resource |
| `details` | jsonb | | Additional details |
| `ip_address` | inet | | User IP address |
| `created_at` | timestamptz | DEFAULT now() | Action timestamp |

**RLS:** Admin read-only access; system writes.

---

## Relationships & Foreign Keys

### Primary Relationships

```
users
  └── user_progress (user_id)
  └── quiz_submissions (user_id)
  └── user_xp (user_id)
  └── user_badges (user_id)
  └── certificates (user_id)
  └── subscriptions (user_id)
  └── payments (user_id)

categories
  └── courses (category_id)

courses
  └── lessons (course_id)

lessons
  └── quizzes (lesson_id)
  └── user_progress (lesson_id)

quizzes
  └── quiz_submissions (quiz_id)

badges
  └── user_badges (badge_id)

tenants
  └── users (tenant_id)
```

### Cascade Behavior

**ON DELETE CASCADE:**
- `courses` → `lessons`: Deleting course deletes its lessons
- `lessons` → `quizzes`: Deleting lesson deletes its quizzes
- `users` → `user_progress`: Deleting user deletes their progress

**ON DELETE RESTRICT:**
- `categories` → `courses`: Cannot delete category with courses
- `users` → `subscriptions`: Must handle subscriptions before deleting user

---

## Indexes

### Performance Indexes

All foreign keys are indexed for join performance.

**Additional Indexes:**
```sql
-- User lookups
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_subscription_tier_idx ON users(subscription_tier);

-- Course browsing
CREATE INDEX courses_category_id_idx ON courses(category_id);
CREATE INDEX lessons_course_id_idx ON lessons(course_id);

-- Progress tracking
CREATE INDEX user_progress_user_id_completed_idx ON user_progress(user_id, completed);
CREATE INDEX quiz_submissions_user_id_passed_idx ON quiz_submissions(user_id, passed);

-- Leaderboards
CREATE INDEX user_xp_total_xp_desc_idx ON user_xp(total_xp DESC);

-- Billing
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
CREATE INDEX payments_created_at_idx ON payments(created_at DESC);
```

---

## Row-Level Security (RLS)

### RLS Policies

All tables have RLS enabled with policies for:

**Public Read (Content):**
```sql
-- Anyone can read categories, courses, lessons, quizzes, badges
CREATE POLICY "Public content" ON lessons
  FOR SELECT
  USING (is_active = true);
```

**User-Scoped (Progress):**
```sql
-- Users can only see/modify their own progress
CREATE POLICY "Users manage own progress" ON user_progress
  FOR ALL
  USING (auth.uid() = user_id);
```

**Tenant-Scoped (Multi-Tenant):**
```sql
-- Admins can see users in their tenant
CREATE POLICY "Admins see tenant users" ON users
  FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('reseller_admin', 'super_admin')
  );
```

**Admin-Only (Management):**
```sql
-- Only admins can modify content
CREATE POLICY "Admins manage content" ON lessons
  FOR INSERT, UPDATE, DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('reseller_admin', 'super_admin')
  );
```

---

## Common Queries

### User Progress Summary

```sql
SELECT 
  u.email,
  u.full_name,
  u.subscription_tier,
  COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) as completed_lessons,
  COUNT(DISTINCT qs.id) FILTER (WHERE qs.passed = true) as quizzes_passed,
  COALESCE(ux.total_xp, 0) as total_xp,
  COALESCE(ux.level, 1) as level,
  COUNT(DISTINCT ub.badge_id) as badges_earned,
  COUNT(DISTINCT c.id) as certificates_earned
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN quiz_submissions qs ON u.id = qs.user_id
LEFT JOIN user_xp ux ON u.id = ux.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN certificates c ON u.id = c.user_id
WHERE u.id = 'user-uuid-here'
GROUP BY u.id, u.email, u.full_name, u.subscription_tier, ux.total_xp, ux.level;
```

### Course Completion Rates

```sql
SELECT 
  c.title,
  cat.name as category,
  COUNT(DISTINCT l.id) as total_lessons,
  COUNT(DISTINCT up.lesson_id) as completed_by_users,
  ROUND(
    COUNT(DISTINCT up.user_id)::numeric / 
    (SELECT COUNT(*) FROM users WHERE subscription_tier != 'free')::numeric * 100,
    2
  ) as completion_rate_pct
FROM courses c
JOIN categories cat ON c.category_id = cat.id
LEFT JOIN lessons l ON l.course_id = c.id
LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.completed = true
GROUP BY c.id, c.title, cat.name
ORDER BY completion_rate_pct DESC;
```

### Leaderboard

```sql
SELECT 
  u.full_name,
  ux.total_xp,
  ux.level,
  ux.current_streak,
  COUNT(DISTINCT ub.badge_id) as badge_count,
  ROW_NUMBER() OVER (ORDER BY ux.total_xp DESC) as rank
FROM users u
JOIN user_xp ux ON u.id = ux.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.full_name, ux.total_xp, ux.level, ux.current_streak
ORDER BY ux.total_xp DESC
LIMIT 100;
```

### Revenue Report (Monthly)

```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(DISTINCT user_id) as paying_customers,
  SUM(amount) / 100.0 as revenue_dollars,
  COUNT(*) as total_payments,
  AVG(amount) / 100.0 as avg_payment
FROM payments
WHERE status = 'succeeded'
  AND created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

---

## Database Maintenance

### Backup Strategy

Supabase provides:
- Automatic daily backups (retained 7 days on Pro)
- Point-in-time recovery
- Manual backup via `pg_dump`

### Optimization

**Regular Tasks:**
```sql
-- Update table statistics
ANALYZE;

-- Rebuild indexes if needed
REINDEX INDEX CONCURRENTLY index_name;

-- Check for bloat
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitoring

**Key Metrics:**
- Table sizes
- Index usage
- Slow queries
- Connection count
- Cache hit ratio

**Access:** Supabase Dashboard > Database > Logs

---

## Conclusion

This schema supports:
- ✅ Multi-tenant white-label architecture
- ✅ Comprehensive learning content delivery
- ✅ Progress tracking and analytics
- ✅ Gamification (XP, badges, certificates)
- ✅ Subscription billing (Stripe-ready)
- ✅ Community features (future)
- ✅ Security via RLS
- ✅ Scalability through indexing

**For Implementation Details:**
- See migration files in `supabase/migrations/`
- See RLS policies in Supabase Dashboard
- See API documentation in `API_DOCUMENTATION.md`

---

*Schema Version: 1.0*  
*Last Updated: October 23, 2025*  
*Database: PostgreSQL 15 on Supabase*

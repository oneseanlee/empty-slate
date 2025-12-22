# ScorePro Platform - Production Deployment Guide

## Overview

This guide covers the final steps to make your ScorePro platform production-ready, including Stripe integration, content population, and optimization.

## Current Status

### ✅ Completed

- Multi-tenant database architecture (20 tables)
- User authentication and authorization
- Course catalog with 87 courses across 12 categories
- 5 sample lessons with quizzes (25 questions total)
- Progress tracking and XP system
- Badge award system (22 badges)
- Certificate generation framework
- Billing UI pages
- Admin dashboard
- Edge functions for core features
- Responsive frontend design

### ❌ Pending (Requires Stripe Integration)

1. **Payment Processing**
   - Subscription checkout flows
   - Payment method management
   - Billing history
   - Invoice generation

2. **Access Control Based on Subscription**
   - Free tier: 5 courses
   - Pro tier: All 87 courses + certificates
   - Enterprise tier: White-label features

## Step-by-Step Production Setup

### Phase 1: Stripe Integration (REQUIRED)

**Priority: HIGH** - Monetization depends on this

1. Follow the complete guide: `docs/STRIPE_INTEGRATION.md`
2. Estimated time: 2-4 hours
3. Required:
   - Stripe account (verified for live mode)
   - API keys (test and live)
   - Product catalog created
   - Webhooks configured

**Files to create:**
- `supabase/functions/create-checkout-session/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `src/lib/stripe.ts`

**Environment variables to add:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Testing checklist:**
- [ ] Can create checkout session
- [ ] Checkout redirects to Stripe
- [ ] Payment succeeds with test card
- [ ] Webhook creates subscription record
- [ ] User gets access to pro features
- [ ] Subscription shows in billing page

### Phase 2: Content Population

**Priority: MEDIUM** - Improves user experience

#### Expand Lessons (Currently: 5 lessons, Need: 87)

Each course needs at least one lesson with:
- Video URL or embedded content
- Lesson description/transcript
- Quiz with 5-10 questions

**Option A: Manual Entry**
```sql
INSERT INTO lessons (course_id, title, slug, content_html, duration_minutes, xp_reward)
VALUES
('course-id', 'Lesson Title', 'lesson-slug', '<h2>Content</h2>', 30, 50);
```

**Option B: Bulk Import**
1. Create CSV with lesson data
2. Use Supabase Table Editor to import
3. Validate all lessons have content

#### Add More Quizzes (Currently: 5 quizzes, Need: 87)

```sql
INSERT INTO quizzes (lesson_id, title, passing_score, questions_json)
VALUES
('lesson-id', 'Quiz Title', 70, '[{"question": "...", "options": [...], "correctAnswer": 0}]'::jsonb);
```

**Quiz Question Format:**
```json
{
  "question": "Your question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Why this is correct"
}
```

### Phase 3: Media Assets

**Priority: MEDIUM**

#### Video Hosting Options:

**Option 1: YouTube (Free)**
- Upload videos to private/unlisted YouTube
- Embed using iframe
- Update `lessons.video_url` with YouTube URLs

**Option 2: Vimeo (Paid)**
- Better privacy controls
- No ads
- Professional appearance

**Option 3: Self-hosted**
- Use Supabase Storage for video files
- Requires larger storage plan
- More control over playback

#### Update Lesson Video URLs:
```sql
UPDATE lessons
SET video_url = 'https://youtube.com/embed/VIDEO_ID'
WHERE id = 'lesson-id';
```

### Phase 4: Feature Enhancements

**Priority: LOW** - Nice to have

#### 1. Email Notifications

Create Edge Function for transactional emails:
- Welcome email on registration
- Certificate earned notification
- Subscription renewal reminders
- Weekly progress summaries

**Use:**
- SendGrid
- Mailgun  
- Resend
- Supabase Auth emails (limited)

#### 2. Discussion Forums

Database tables already exist:
- `discussions`
- `discussion_votes`

Create UI pages:
- Question submission form
- Answer thread display
- Voting system
- Instructor badge for staff answers

#### 3. Support Ticket System

Database table exists: `support_tickets`

Create UI:
- Ticket submission form
- Ticket list for users
- Admin ticket management dashboard
- Status updates and responses

#### 4. Analytics Dashboard

Enhance admin dashboard with:
- Revenue charts (integrate with Stripe)
- User engagement metrics
- Course completion rates
- Popular courses
- User retention

Consider using:
- Chart.js or Recharts for visualizations
- Export to CSV functionality

### Phase 5: White-Label Features

**Priority: LOW** - For enterprise tier

#### Tenant Customization:

1. **Logo Upload**
   - Storage bucket exists: `tenant-logos`
   - Create admin UI to upload
   - Display tenant logo in header

2. **Color Theme**
   - Add theme fields to `tenants` table
   - Create color picker in admin panel
   - Apply CSS variables dynamically

3. **Custom Domain**
   - Configure DNS CNAME records
   - Set up SSL certificates
   - Update tenant config with domain

### Phase 6: Performance Optimization

**Priority: MEDIUM**

#### 1. Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, completed);
CREATE INDEX idx_subscriptions_user_active ON subscriptions(user_id, status);
CREATE INDEX idx_courses_category ON courses(category_id);
```

#### 2. Frontend Optimization

- Enable code splitting
- Lazy load routes
- Optimize images (WebP format)
- Implement caching headers
- Use CDN for static assets

#### 3. API Response Caching

- Cache course catalog (updates rarely)
- Cache category list
- Cache user progress (with invalidation)

### Phase 7: Security Hardening

**Priority: HIGH**

#### 1. Review RLS Policies

```sql
-- Ensure policies are restrictive
-- Example: Users can only see their own progress
CREATE POLICY "Users view own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);
```

#### 2. Rate Limiting

- Implement on Edge Functions
- Prevent abuse of quiz submissions
- Limit API calls per user

#### 3. Input Validation

- Sanitize all user inputs
- Validate email formats
- Check file uploads for malicious content

### Phase 8: Testing

**Priority: HIGH**

#### Test Scenarios:

**User Flows:**
- [ ] Registration and login
- [ ] Course browsing and filtering
- [ ] Lesson completion
- [ ] Quiz taking and scoring
- [ ] Certificate earning
- [ ] Badge unlocking
- [ ] Subscription upgrade
- [ ] Payment processing
- [ ] Subscription cancellation

**Admin Flows:**
- [ ] User management
- [ ] Analytics viewing
- [ ] Course management (when implemented)

**Edge Cases:**
- [ ] Duplicate quiz submissions
- [ ] Concurrent lesson completions
- [ ] Failed payments
- [ ] Webhook retries

### Phase 9: Launch Preparation

**Priority: HIGH**

#### Pre-Launch Checklist:

**Legal:**
- [ ] Terms of Service created
- [ ] Privacy Policy created
- [ ] Cookie consent implemented (GDPR)
- [ ] Data retention policy defined
- [ ] Refund policy established

**Business:**
- [ ] Pricing finalized
- [ ] Support email configured
- [ ] FAQ page created
- [ ] Onboarding flow tested
- [ ] Marketing materials ready

**Technical:**
- [ ] Custom domain configured
- [ ] SSL certificate valid
- [ ] Backup strategy implemented
- [ ] Monitoring set up (Sentry, LogRocket)
- [ ] Error tracking configured
- [ ] Performance benchmarks established

**Content:**
- [ ] All 87 courses have lessons
- [ ] All lessons have quizzes
- [ ] Videos are uploaded and tested
- [ ] Certificates tested and verified

## Maintenance Tasks

### Daily:
- Monitor error logs
- Check payment failures
- Respond to support tickets

### Weekly:
- Review user analytics
- Check subscription churn
- Update course content as needed

### Monthly:
- Financial reconciliation
- Performance review
- Security audit
- Backup verification

## Scaling Considerations

### Database:
- Supabase free tier: 500MB database
- Pro tier: 8GB database
- Enterprise: Custom

### Storage:
- Free tier: 1GB
- Pro tier: 100GB
- Consider CDN for videos

### Edge Functions:
- Free tier: 500K invocations/month
- Pro tier: 2M invocations/month

### Users:
- Plan for concurrent users
- Consider read replicas for scaling
- Implement caching strategy

## Cost Estimates

### Monthly Operating Costs:

**Minimum (MVP):**
- Supabase Free: $0
- Domain: $12/year ($1/month)
- Email: Free tier (SendGrid)
- **Total: ~$1/month**

**Production (100 active users):**
- Supabase Pro: $25/month
- Domain + SSL: $1/month
- Email (SendGrid): $15/month
- Video Hosting (Vimeo): $20/month
- **Total: ~$61/month**

**Scale (1000+ users):**
- Supabase Pro: $25/month
- Domain: $1/month
- Email: $50/month
- CDN (Cloudflare): $20/month
- Video (Vimeo Pro): $75/month
- Monitoring (Sentry): $26/month
- **Total: ~$197/month**

**Revenue Potential:**
- 100 Pro users × $29 = $2,900/month
- 10 Enterprise × $99 = $990/month
- **Total: $3,890/month**
- **Profit Margin: ~95%**

## Next Steps

1. **Immediate (This Week):**
   - Set up Stripe account
   - Complete Stripe integration guide
   - Test subscription flow end-to-end

2. **Short Term (This Month):**
   - Populate all 87 lessons with content
   - Add quizzes to all lessons
   - Upload/link video content
   - Create legal pages

3. **Medium Term (Next 3 Months):**
   - Build email notification system
   - Implement discussion forums
   - Add support ticket system
   - Create marketing site

4. **Long Term (6+ Months):**
   - White-label customization
   - Mobile app (React Native)
   - Advanced analytics
   - Affiliate program

## Getting Help

- **Stripe Issues:** [Stripe Support](https://support.stripe.com)
- **Supabase Issues:** [Supabase Discord](https://discord.supabase.com)
- **General Platform Issues:** Review deployment documentation

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-22  
**Status:** Platform Ready - Awaiting Stripe Integration

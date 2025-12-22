# ScorePro E-Learning Platform - Administrator Guide

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**For:** Reseller Admins and Platform Owners  

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Management](#user-management)
3. [Content Management](#content-management)
4. [Analytics & Reporting](#analytics--reporting)
5. [Billing & Subscriptions](#billing--subscriptions)
6. [White-Label Customization](#white-label-customization)
7. [Support & Troubleshooting](#support--troubleshooting)
8. [Security & Compliance](#security--compliance)
9. [Best Practices](#best-practices)

---

## Getting Started

### Accessing the Admin Dashboard

1. **Create Your Account:**
   - Visit: https://17jmk02u0vv8.space.minimax.io
   - Click "Sign Up"
   - Enter your email and create a password
   - Verify your email (if email service configured)

2. **Get Admin Access:**
   - Log into Supabase Dashboard: https://supabase.com/dashboard
   - Navigate to Authentication > Users
   - Find your user account
   - Click to edit user metadata
   - Add or change `role` field to `reseller_admin`
   - Save changes

3. **Access Admin Panel:**
   - Log into platform: https://17jmk02u0vv8.space.minimax.io
   - Navigate to `/admin` route
   - You should see the Admin Dashboard

### Admin Dashboard Overview

**Key Sections:**
- **Overview:** Quick stats and metrics
- **Users:** User management and details
- **Analytics:** Platform usage and engagement
- **Revenue:** Billing and subscription data (requires Stripe)
- **Content:** Course and quiz management
- **Settings:** Platform configuration

---

## User Management

### Viewing Users

**Access:** Admin Dashboard > Users

**Available Information:**
- User email
- Full name
- Registration date
- Subscription tier (Free/Pro/Enterprise)
- Total XP and level
- Courses completed
- Last login
- Account status

**Actions:**
- Search users by email or name
- Filter by subscription tier
- Sort by various metrics
- Export user list (CSV)

### User Details

**Click on any user to view:**
- Complete profile information
- Learning progress (courses/lessons completed)
- Quiz performance history
- Badges earned
- Certificates generated
- Subscription history
- Login activity
- Support tickets (if any)

### Managing User Roles

**Via Supabase Dashboard:**

1. Go to Supabase Dashboard > Authentication > Users
2. Find the user
3. Edit user metadata
4. Set `role` field:
   - `learner` - Regular user (default)
   - `reseller_admin` - Can access admin dashboard
   - `super_admin` - Full platform access (future)

**Role Capabilities:**

| Feature | Learner | Reseller Admin | Super Admin |
|---------|---------|----------------|--------------|
| Complete courses | ✓ | ✓ | ✓ |
| Take quizzes | ✓ | ✓ | ✓ |
| View own progress | ✓ | ✓ | ✓ |
| Access admin dashboard | ✗ | ✓ | ✓ |
| View all users | ✗ | ✓ (tenant) | ✓ (all) |
| Manage users | ✗ | ✓ (tenant) | ✓ (all) |
| View analytics | ✗ | ✓ (tenant) | ✓ (all) |
| Manage content | ✗ | ✗ | ✓ |
| Platform settings | ✗ | ✗ | ✓ |

### Deactivating Users

**Current Method (Supabase Dashboard):**
1. Authentication > Users
2. Find the user
3. Click "..." menu
4. Select "Delete User" or disable via metadata

**Future Feature:** In-app user suspension/deactivation

### Bulk Operations

**Current:** Manual via Supabase
**Future:** Bulk import/export, mass email, bulk role changes

---

## Content Management

### Course Catalog

**Current Structure:**
- **12 Categories** with 87 courses total
- Each course contains lessons
- Each lesson has optional quiz

**Viewing Content:**
- Access via Supabase Dashboard > Table Editor
- Tables: `categories`, `courses`, `lessons`, `quizzes`

### Adding New Lessons

**Via Supabase Dashboard:**

1. Go to Table Editor > `lessons`
2. Click "Insert row"
3. Fill in:
   - `course_id` - Select parent course
   - `title` - Lesson title
   - `description` - Brief description
   - `content_html` - Full lesson content (HTML)
   - `duration_minutes` - Estimated time
   - `display_order` - Position in course
   - `xp_reward` - XP for completion (10-50)
   - `is_active` - true
4. Click "Save"

**Content Format:**
```html
<div class="lesson-content">
  <h1>Lesson Title</h1>
  <h2>Section Heading</h2>
  <p>Paragraph text...</p>
  <ul>
    <li>List item</li>
  </ul>
</div>
```

**Using Enhancement Script:**

If you want to expand existing lessons to 1,500-2,500 words:

```bash
# In the workspace directory
python3 code/enhance_all_lessons.py
```

### Creating Quizzes

**Via Supabase Dashboard:**

1. Go to Table Editor > `quizzes`
2. Click "Insert row"
3. Fill in:
   - `lesson_id` - Link to lesson
   - `title` - Quiz title (e.g., "[Lesson Title] - Quiz")
   - `questions` - JSONB array of questions
   - `passing_score` - Usually 70
   - `xp_reward` - XP for passing (10-30)
   - `is_active` - true
4. Click "Save"

**Quiz Question Format:**

```json
[
  {
    "question": "What is the primary factor in credit scores?",
    "options": [
      "Payment history",
      "Credit utilization",
      "Length of credit history",
      "Credit mix"
    ],
    "correct_answer": 0,
    "explanation": "Payment history accounts for 35% of your FICO score, making it the most important factor."
  },
  {
    "question": "How many free credit reports are you entitled to annually?",
    "options": [
      "One per bureau (3 total)",
      "One combined report",
      "Unlimited",
      "None unless you pay"
    ],
    "correct_answer": 0,
    "explanation": "Under FCRA, you're entitled to one free report from each of the three bureaus every 12 months."
  }
]
```

### Managing Badges

**Existing Badges:** 22 pre-configured

**View/Edit:**
- Supabase Dashboard > Table Editor > `badges`

**Badge Fields:**
- `name` - Badge name (e.g., "First Login")
- `description` - What it's for
- `icon_name` - Icon identifier
- `criteria_type` - How it's earned (lessons_completed, streak, etc.)
- `criteria_value` - Threshold value
- `xp_reward` - Bonus XP for earning
- `badge_category` - Type (milestone, achievement, etc.)

**Adding New Badge:**
1. Insert new row in `badges` table
2. Badge will auto-award when criteria met (via check-badges function)

### Updating Course Metadata

**Categories:**
- Edit via `categories` table
- Fields: name, description, icon, display_order

**Courses:**
- Edit via `courses` table
- Fields: title, description, difficulty, duration, category_id

---

## Analytics & Reporting

### Dashboard Metrics

**Overview Page Shows:**
- Total users (active and inactive)
- Monthly Recurring Revenue (MRR) - requires Stripe
- New sign-ups this month
- Average completion rate
- Most popular courses
- User engagement trends

### User Analytics

**Available Metrics:**
- Registration trends (daily/weekly/monthly)
- Active users (DAU/WAU/MAU)
- Completion rates by course
- Average time to completion
- Quiz pass rates
- Dropout points
- Device types (requires GA integration)
- Geographic distribution (requires GA)

### Revenue Analytics

**Requires Stripe Integration**

Once Stripe is connected:
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Churn rate
- Average Revenue Per User (ARPU)
- Lifetime Value (LTV)
- Conversion rates (Free → Pro → Enterprise)
- Refund rates

### Content Performance

**Track:**
- Most viewed lessons
- Highest completion rates
- Lowest completion rates (needs improvement)
- Quiz difficulty (pass/fail rates)
- Time spent per lesson
- User feedback/ratings (future feature)

### Exporting Data

**Current Methods:**

**Via Supabase Dashboard:**
1. Table Editor > Select table
2. Use filters to narrow data
3. Copy data or export to CSV

**Via SQL Query:**
```sql
-- Example: Export user progress
COPY (
  SELECT u.email, COUNT(up.id) as completed_lessons
  FROM users u
  LEFT JOIN user_progress up ON u.id = up.user_id AND up.completed = true
  GROUP BY u.id
) TO '/tmp/user_progress.csv' CSV HEADER;
```

**Future:** One-click export from admin dashboard

### Custom Reports

**SQL Queries for Common Reports:**

**1. User Progress Report:**
```sql
SELECT 
  u.email,
  u.full_name,
  u.subscription_tier,
  COUNT(DISTINCT up.lesson_id) as completed_lessons,
  COALESCE(ux.total_xp, 0) as total_xp,
  COALESCE(ux.level, 1) as level,
  COUNT(DISTINCT ub.badge_id) as badges_earned
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id AND up.completed = true
LEFT JOIN user_xp ux ON u.id = ux.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.email, u.full_name, u.subscription_tier, ux.total_xp, ux.level
ORDER BY completed_lessons DESC;
```

**2. Course Popularity:**
```sql
SELECT 
  c.title as course_title,
  cat.name as category,
  COUNT(DISTINCT up.user_id) as unique_users,
  COUNT(up.id) as total_completions,
  ROUND(COUNT(DISTINCT up.user_id)::numeric / 
        (SELECT COUNT(*) FROM users)::numeric * 100, 2) as completion_rate_pct
FROM courses c
JOIN categories cat ON c.category_id = cat.id
LEFT JOIN lessons l ON l.course_id = c.id
LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.completed = true
GROUP BY c.id, c.title, cat.name
ORDER BY unique_users DESC;
```

**3. Quiz Performance:**
```sql
SELECT 
  l.title as lesson_title,
  COUNT(qs.id) as attempts,
  COUNT(qs.id) FILTER (WHERE qs.passed = true) as passes,
  ROUND(COUNT(qs.id) FILTER (WHERE qs.passed = true)::numeric / 
        COUNT(qs.id)::numeric * 100, 2) as pass_rate_pct,
  ROUND(AVG(qs.score), 2) as avg_score
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
LEFT JOIN quiz_submissions qs ON qs.quiz_id = q.id
GROUP BY q.id, l.title
HAVING COUNT(qs.id) > 0
ORDER BY pass_rate_pct ASC;
```

---

## Billing & Subscriptions

### Current Status

**Billing UI:** Complete and functional  
**Stripe Integration:** Pending (requires API keys)

**See:** `STRIPE_INTEGRATION.md` for complete setup guide

### Subscription Tiers

**Free Tier:**
- Access to 5 courses
- Basic progress tracking
- XP and badges
- No certificates

**Pro Tier ($29/month):**
- All 87 courses
- Full progress tracking
- XP, badges, and certificates
- Priority support

**Enterprise Tier ($99/month):**
- All Pro features
- White-label branding
- Custom domain support
- Dedicated account manager
- Multi-user licenses

### Managing Subscriptions

**After Stripe Integration:**

**View Subscriptions:**
- Admin Dashboard > Revenue > Subscriptions
- Filter by status (active/canceled/past_due)
- Search by user email

**Manual Subscription Management:**
1. Supabase Dashboard > `subscriptions` table
2. Find user's subscription
3. Update `status` or `current_period_end`
4. **Note:** This won't affect Stripe billing

**Proper Method:** Manage via Stripe Dashboard
- Stripe.com > Customers
- Find customer and manage subscription
- Webhook will update local database

### Handling Refunds

**Process:**
1. Verify refund eligibility (within 30 days, etc.)
2. Process refund in Stripe Dashboard
3. Optionally downgrade user to Free tier
4. Send confirmation email

**Best Practices:**
- Clear refund policy
- Quick processing (within 3-5 business days)
- Collect feedback on cancellation reason
- Offer alternatives (pause subscription, downgrade)

### Revenue Reports

**Key Metrics to Track:**
- Monthly Recurring Revenue (MRR)
- Churn rate (cancellations / total subscribers)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- LTV:CAC ratio (should be 3:1 or higher)

**Access:** Stripe Dashboard > Reports

---

## White-Label Customization

### Multi-Tenant Architecture

The platform supports multiple tenants (resellers) with isolated data.

**Tenant Table Fields:**
- `name` - Company name
- `subdomain` - Custom subdomain (future)
- `custom_domain` - Full custom domain (future)
- `logo_url` - Company logo
- `primary_color` - Brand color
- `secondary_color` - Accent color
- `email_from_name` - Email sender name
- `is_active` - Tenant status

### Customizing Branding

**Current Method: Code Changes**

**1. Update Logo:**
- Replace `scorepro-platform/public/logo.png` with your logo
- Recommended size: 200x60px (transparent PNG)

**2. Update Colors:**
- Edit `scorepro-platform/tailwind.config.js`
- Modify color palette:

```javascript
colors: {
  primary: {
    50: '#your-color-50',
    // ... through 900
  },
  // ...
}
```

**3. Update Company Name:**
- Search and replace "ScorePro" in codebase
- Update in: Homepage, About, Footer, Email templates

**Future Feature:** Admin UI for branding customization

### Custom Domain Setup

**Future Feature**

**Planned Process:**
1. Purchase domain (e.g., learn.yourcompany.com)
2. Add domain in admin settings
3. Configure DNS (CNAME record)
4. Verify domain ownership
5. Auto-provision SSL certificate
6. Domain active within 24 hours

### Email Customization

**Email Templates Location:**
- Future: Supabase Edge Functions
- Templates for: Welcome, Password Reset, Course Completion, Certificate

**Customization:**
- Company logo in header
- Brand colors
- Company name and contact info
- Custom messaging

---

## Support & Troubleshooting

### Common Issues

**Issue: User can't log in**

**Solutions:**
1. Verify email is correct
2. Check if email is verified
3. Try password reset
4. Check user status in Supabase (not deleted)
5. Check for typos in email address

**Issue: Quiz not loading**

**Solutions:**
1. Verify quiz exists for lesson (`quizzes` table)
2. Check quiz `is_active` = true
3. Verify quiz has valid questions JSON
4. Check browser console for errors
5. Test in incognito mode (cache issue)

**Issue: XP not awarding**

**Solutions:**
1. Check Edge Function logs: Supabase > Edge Functions > complete-lesson
2. Verify user completed lesson successfully
3. Check `user_xp` table for entry
4. Manually award XP if needed (update `user_xp` table)

**Issue: Certificate not generating**

**Solutions:**
1. Verify user completed all lessons in category
2. Check Edge Function logs: generate-certificate
3. Verify `certificates` table entry created
4. Check storage bucket for PDF (future feature)

### Accessing Logs

**Edge Function Logs:**
1. Supabase Dashboard > Edge Functions
2. Select function (complete-lesson, submit-quiz, etc.)
3. View "Logs" tab
4. Filter by date/time
5. Look for errors or console.log output

**Database Logs:**
1. Supabase Dashboard > Database
2. Select "Logs" (if enabled)
3. Filter by query type or error

**Frontend Errors:**
- Browser DevTools > Console tab
- Look for network errors or JavaScript exceptions

### User Support Workflow

**Recommended Process:**

1. **User submits ticket** (email or in-app form)
2. **Categorize issue:**
   - Account access
   - Technical problem
   - Billing question
   - Content question
   - Feature request
3. **Investigate:**
   - Check user account status
   - Review relevant logs
   - Reproduce issue if possible
4. **Resolve:**
   - Fix technical issues
   - Provide instructions
   - Escalate to developer if needed
5. **Follow up:**
   - Confirm resolution
   - Update documentation if recurring issue
   - Add to FAQ

---

## Security & Compliance

### User Data Protection

**Access Controls:**
- Admin access limited to authorized personnel
- Use Supabase's built-in RLS policies
- Regularly audit admin user list
- Remove access for departing team members

**Data Handling:**
- Never share user data with third parties
- Encrypt sensitive data
- Use secure connections (HTTPS) always
- Regular backups (Supabase handles this)

### GDPR Compliance

**User Rights:**

**Right to Access:**
- User can request their data
- Export from Supabase tables
- Provide within 30 days

**Right to Deletion:**
- User can request account deletion
- Delete from Supabase Auth + all related tables
- Confirm deletion within 30 days

**Right to Portability:**
- Provide data in machine-readable format (JSON/CSV)
- Include all user-generated data

**Implementation:**
- Add data export feature to user settings
- Add account deletion option
- Log all data requests

### Security Best Practices

**For Admins:**
- Use strong, unique passwords
- Enable 2FA on Supabase account
- Don't share admin credentials
- Use password manager
- Log out when finished
- Don't access admin panel on public Wi-Fi

**For Platform:**
- Keep dependencies updated
- Monitor security advisories
- Regular security audits
- Implement rate limiting
- Monitor for suspicious activity
- Have incident response plan

### Compliance Checklist

- [ ] Privacy Policy published and linked
- [ ] Terms of Service published and linked
- [ ] Cookie consent banner (if using cookies)
- [ ] GDPR data export capability
- [ ] GDPR deletion capability
- [ ] Refund policy clearly stated
- [ ] Subscription terms clearly disclosed
- [ ] Email opt-out mechanism
- [ ] Data breach notification process
- [ ] Regular security audits scheduled

---

## Best Practices

### Content Management

**Quality Standards:**
- Keep lessons between 1,000-2,500 words
- Include practical examples
- Use clear, simple language
- Break up text with headings and lists
- Proofread for errors
- Verify factual accuracy (especially legal info)
- Update content regularly (annually minimum)

**Quiz Design:**
- 5-8 questions per quiz
- Mix difficulty levels
- Avoid trick questions
- Provide helpful explanations
- Test key concepts, not trivia
- Review and update based on pass rates

### User Engagement

**Strategies:**
- Send weekly progress emails
- Highlight achievement milestones
- Offer completion incentives
- Create user success stories
- Encourage community participation
- Regular new content releases
- Seasonal challenges or competitions

**Retention Tactics:**
- Onboarding email sequence
- Re-engagement campaigns for inactive users
- Personalized course recommendations
- Progress reminders
- Streak notifications
- Early warning for subscription cancellations

### Performance Optimization

**Monitor:**
- Page load times (target < 2 seconds)
- API response times (target < 500ms)
- Error rates (target < 1%)
- Database query performance

**Optimize:**
- Compress images
- Enable caching
- Minimize API calls
- Use lazy loading
- Optimize database queries
- Use CDN for static assets

### Business Operations

**Regular Tasks:**
- **Daily:** Check support queue, monitor uptime
- **Weekly:** Review analytics, process refunds
- **Monthly:** Financial reports, content updates
- **Quarterly:** User survey, feature planning
- **Annually:** Strategic review, major updates

**Growth Strategies:**
- Content marketing (blog posts on credit topics)
- SEO optimization
- Affiliate program
- Partner with credit counselors
- Social media presence
- Free webinars or workshops
- Referral incentives

---

## Quick Reference

### Important URLs

- **Platform:** https://17jmk02u0vv8.space.minimax.io
- **Admin:** https://17jmk02u0vv8.space.minimax.io/admin
- **Supabase:** https://supabase.com/dashboard
- **Stripe:** https://dashboard.stripe.com (after setup)

### Key Database Tables

- `users` - User accounts
- `categories` - Course categories (12)
- `courses` - Individual courses (87)
- `lessons` - Lesson content
- `quizzes` - Quiz questions
- `user_progress` - Completion tracking
- `user_xp` - XP and levels
- `badges` - Achievement badges (22)
- `user_badges` - Earned badges
- `certificates` - Generated certificates
- `subscriptions` - User subscriptions
- `payments` - Payment history

### Support Contacts

- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com
- **Platform Documentation:** See `docs/` folder

---

## Conclusion

This admin guide covers the essential aspects of managing the ScorePro E-Learning Platform. As you grow more familiar with the system, you'll discover additional capabilities and optimization opportunities.

**Remember:**
- User experience is paramount
- Data security is non-negotiable
- Regular content updates keep learners engaged
- Analytics drive informed decisions
- Community builds loyalty

**Next Steps:**
1. Familiarize yourself with the admin dashboard
2. Complete Stripe integration (see `STRIPE_INTEGRATION.md`)
3. Review and customize content as needed
4. Set up monitoring and alerts
5. Create support workflows
6. Launch and iterate!

---

*Guide Version: 1.0*  
*Last Updated: October 23, 2025*  
*For questions or issues not covered here, consult the technical documentation or contact support.*

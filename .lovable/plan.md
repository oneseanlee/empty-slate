
## Referral & Affiliate Program — 50% Commission Split

### Overview
Build a fully functional referral/affiliate program where users get a unique referral link, earn 50% of every subscription payment from users they refer, and can track their earnings and payouts from a dedicated dashboard.

---

### How It Will Work (User Flow)

1. Any logged-in user gets a unique referral code (e.g. `cruedu.com/register?ref=abc123`)
2. When a referred user signs up via that link, the referral is recorded
3. When the referred user subscribes (Pro $29/mo or Enterprise $250/mo), the referrer earns **50% commission**:
   - Pro referral → **$14.50/month** recurring
   - Enterprise referral → **$125.00/month** recurring
4. Earnings accumulate in the affiliate dashboard
5. Admin can mark commissions as paid when processing payouts

---

### Database Changes (3 new tables)

**1. `referral_codes` table** — one unique code per user
```
id, user_id, code (unique short string), created_at, is_active
```

**2. `referrals` table** — tracks who referred whom
```
id, referrer_user_id, referred_user_id, referral_code, status (pending/converted/invalid), converted_at, created_at
```

**3. `affiliate_commissions` table** — tracks each commission earned
```
id, referrer_user_id, referred_user_id, payment_amount, commission_amount (50%), commission_rate (0.50), status (pending/paid/cancelled), stripe_payment_intent_id, created_at, paid_at
```

RLS policies: Users can only view their own referrals and commissions. Admins can view/update all.

---

### Registration Flow Update
- `RegisterPage.tsx` reads `?ref=CODE` from the URL query string
- Stores the referral code in `localStorage` during signup
- After account creation, calls a backend function to record the referral link

---

### New Pages & Components

**`src/pages/AffiliatePage.tsx`** — Full affiliate dashboard with:
- Unique referral link with one-click copy button
- Stats cards: Total Referred, Active Subscribers, Total Earned, Pending Payout
- Commission earnings table (who converted, when, how much)
- Shareable social links (copy link, share via email)
- Payout request section (shows bank/PayPal info or contact instructions)

---

### Backend Edge Function

**`supabase/functions/record-referral/index.ts`**
- Called after registration when a referral code is present
- Validates the referral code exists and belongs to a real user
- Inserts into `referrals` table
- Prevents self-referral

**`supabase/functions/process-affiliate-commission/index.ts`**
- Called from the Stripe webhook when a payment succeeds
- Looks up if the paying user was referred
- If yes, inserts a commission record at 50% of payment amount
- Updates the `referrals` table status to `converted`

---

### Navigation Updates
- Add "Affiliate Program" link to the Dashboard navigation bar
- Add it to `App.tsx` as a new protected route at `/affiliate`

---

### Admin Panel Update
- Add an "Affiliate Commissions" tab to `AdminDashboardPage.tsx`
- Shows all pending commissions with ability to mark as paid

---

### Technical Implementation Steps (in order)

1. **Database migration** — create `referral_codes`, `referrals`, `affiliate_commissions` tables with RLS policies
2. **Auto-generate referral code** — database trigger that creates a referral code row when a new user is inserted into `users` table
3. **`record-referral` edge function** — validates & records referral on signup
4. **`process-affiliate-commission` edge function** — wired into existing Stripe webhook flow
5. **`AffiliatePage.tsx`** — full UI dashboard
6. **`RegisterPage.tsx` update** — capture `?ref=` param and call record-referral after signup
7. **`DashboardPage.tsx` update** — add Affiliate nav link
8. **`App.tsx` update** — add `/affiliate` route
9. **`AdminDashboardPage.tsx` update** — commissions management tab

---

### Commission Math Summary

| Plan | Monthly Price | Your Commission (50%) |
|------|--------------|----------------------|
| Pro | $29/mo | **$14.50/mo** per active referral |
| Enterprise | $250/mo | **$125.00/mo** per active referral |

Example: Refer 10 Pro users → **$145/month** passive income recurring.

---

### Security Notes
- Referral codes are server-validated — no client-side manipulation possible
- Self-referral is blocked server-side
- Commission writes only happen in authenticated edge functions with service role
- RLS ensures users can only see their own data

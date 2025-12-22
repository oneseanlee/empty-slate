Lovable Import Checklist

1) Repo root
   - Use the repo root as the project root when importing.

2) Environment variables (in Lovable)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3) Supabase setup
   - Apply migrations under `supabase/migrations`.
   - Deploy edge functions: `complete-lesson`, `submit-quiz`, `generate-certificate`, `check-badges`, `create-checkout-session`, `stripe-webhook`.

4) Build/start
   - Install: `pnpm install`
   - Dev: `pnpm dev`
   - Prod build: `pnpm build`

5) Stripe (optional, required for billing)
   - Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Supabase function env vars.

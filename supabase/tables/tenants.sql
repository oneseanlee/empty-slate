CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    custom_domain TEXT,
    branding_config JSONB DEFAULT '{"logo_url": "",
    "primary_color": "#1d4ed8",
    "secondary_color": "#22c55e",
    "font_family": "Inter"}'::jsonb,
    stripe_account_id TEXT,
    revenue_share_percentage DECIMAL(5,2) DEFAULT 70.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
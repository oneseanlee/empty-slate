CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    auth_user_id UUID,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin',
    'reseller_admin',
    'instructor',
    'support',
    'learner',
    'finance')),
    profile_data JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
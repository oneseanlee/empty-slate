CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    criteria_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    badge_type TEXT CHECK (badge_type IN ('category',
    'milestone',
    'streak',
    'quiz')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
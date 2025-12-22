CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video',
    'text',
    'interactive')),
    video_url TEXT,
    transcript TEXT,
    content_html TEXT,
    duration_minutes INTEGER,
    display_order INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
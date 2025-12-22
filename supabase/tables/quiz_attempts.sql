CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    quiz_id UUID NOT NULL,
    score INTEGER NOT NULL,
    answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    passed BOOLEAN DEFAULT false,
    time_taken_seconds INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
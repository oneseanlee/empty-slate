CREATE TABLE discussion_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL,
    user_id UUID NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote',
    'downvote')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(discussion_id,
    user_id)
);
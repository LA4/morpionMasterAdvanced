-- Create scores table in Supabase
-- This table stores game scores for each user

CREATE TABLE IF NOT EXISTS public.scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON public.scores(user_id);

-- Create index on score for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_scores_score ON public.scores(score DESC);

-- Create index on created_at for recent scores queries
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON public.scores(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all scores (for leaderboards)
CREATE POLICY "Allow public read access" ON public.scores
    FOR SELECT
    USING (true);

-- Policy: Users can insert their own scores (when authenticated)
CREATE POLICY "Allow authenticated users to insert scores" ON public.scores
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own scores
CREATE POLICY "Allow users to update their own scores" ON public.scores
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can only delete their own scores
CREATE POLICY "Allow users to delete their own scores" ON public.scores
    FOR DELETE
    USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE public.scores IS 'Stores game scores for authenticated users';
COMMENT ON COLUMN public.scores.id IS 'Unique identifier for the score entry';
COMMENT ON COLUMN public.scores.user_id IS 'ID of the user who submitted the score (from auth.users)';
COMMENT ON COLUMN public.scores.user_name IS 'Display name of the user';
COMMENT ON COLUMN public.scores.score IS 'The score value (must be non-negative)';
COMMENT ON COLUMN public.scores.created_at IS 'Timestamp when the score was submitted';

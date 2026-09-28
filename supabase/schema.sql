-- ========================================================
-- ICICI Bank Relationship Manager Survey - Database Schema
-- Run this script in the Supabase SQL Editor to initialize.
-- ========================================================

-- 1. Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Q1: Net Promoter Score (0-10)
    nps_score SMALLINT CHECK (nps_score >= 0 AND nps_score <= 10),
    q1_follow_up_text TEXT,
    
    -- Q2: Customer Effort Score / Query Resolution Ease
    resolution_ease TEXT CHECK (resolution_ease IN ('Very Easy', 'Easy', 'Difficult', 'Very Difficult')),
    q2_follow_up_text TEXT,
    
    -- Q3: 8 Aspect Ratings stored as JSONB
    -- Example: {"accessibility": "Very Good", "proactive_contact": "Good", ...}
    aspect_ratings JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Q4: General Open-Ended Feedback
    q4_feedback_text TEXT,
    
    -- Metadata (Optional)
    user_agent TEXT,
    ip_address TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Allow public/anonymous respondents to insert survey submissions
CREATE POLICY "Allow anonymous survey submissions"
    ON public.survey_responses
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 4. RLS Policy: Allow authenticated admin users to read responses
CREATE POLICY "Allow read access for authenticated users"
    ON public.survey_responses
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON public.survey_responses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_nps_score ON public.survey_responses (nps_score);

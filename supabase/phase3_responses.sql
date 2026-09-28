-- ==============================================================================
-- PHASE 3: SURVEY RESPONSES TABLE
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES public.survey_tokens(id) ON DELETE CASCADE,
    response_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index for fast token lookup & timestamp queries
CREATE INDEX IF NOT EXISTS idx_survey_responses_token_id ON public.survey_responses(token_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON public.survey_responses(submitted_at DESC);

-- 3. Grant permissions to API roles
GRANT ALL ON TABLE public.survey_responses TO anon, authenticated, service_role;

-- 4. Display table structure confirmation
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'survey_responses';

-- ==============================================================================
-- PHASE 2: SURVEY TOKENS TABLE & MANUAL SEED DATA
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create survey_tokens table (No RLS for Phase 2 prototype)
CREATE TABLE IF NOT EXISTS public.survey_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'opened', 'completed', 'expired')),
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    opened_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_survey_tokens_status ON public.survey_tokens(status);
CREATE INDEX IF NOT EXISTS idx_survey_tokens_generated_at ON public.survey_tokens(generated_at);

-- 3. Grant table permissions to API roles
GRANT ALL ON TABLE public.survey_tokens TO anon, authenticated, service_role;

-- 4. Insert 3 manual test tokens for preliminary verification
INSERT INTO public.survey_tokens (token, status)
VALUES 
    ('testpending', 'pending'),
    ('testopened', 'opened'),
    ('testcompleted', 'completed')
ON CONFLICT (token) DO NOTHING;

-- 5. Query table to confirm setup
SELECT * FROM public.survey_tokens ORDER BY generated_at DESC;

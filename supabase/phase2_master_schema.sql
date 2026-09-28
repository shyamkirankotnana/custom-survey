-- ==============================================================================
-- PHASE 2: MASTER DATABASE SCHEMA
-- Custom NPS Survey Platform
-- Tables: surveys, survey_batches, survey_tokens, survey_responses, audit_logs
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLE: surveys
-- Stores survey definitions and metadata.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TABLE: survey_batches
-- Stores metadata about generated token batches.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.survey_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    batch_name TEXT NOT NULL,
    batch_size INTEGER NOT NULL CHECK (batch_size > 0),
    generated_by TEXT DEFAULT 'admin',
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. TABLE: survey_tokens
-- Stores every unique survey link token (NanoID).
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.survey_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES public.survey_batches(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Indexes for fast token lookup
CREATE INDEX IF NOT EXISTS idx_survey_tokens_token ON public.survey_tokens(token);
CREATE INDEX IF NOT EXISTS idx_survey_tokens_status ON public.survey_tokens(status);
CREATE INDEX IF NOT EXISTS idx_survey_tokens_survey_id ON public.survey_tokens(survey_id);

-- ------------------------------------------------------------------------------
-- 4. TABLE: survey_responses
-- Stores completed survey responses as JSONB.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    token_id UUID REFERENCES public.survey_tokens(id) ON DELETE SET NULL,
    response_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for response analytics
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON public.survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON public.survey_responses(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_jsonb ON public.survey_responses USING gin (response_json);

-- ------------------------------------------------------------------------------
-- 5. TABLE: audit_logs
-- Tracks administrative system activity.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    performed_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. PERMISSIONS & ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
-- Grant table privileges to anon, authenticated, and service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Enable RLS across all tables
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Surveys: Public read access
DROP POLICY IF EXISTS "Allow public read on surveys" ON public.surveys;
CREATE POLICY "Allow public read on surveys" ON public.surveys FOR SELECT TO anon, authenticated USING (true);

-- Tokens: Public read access (to validate link tokens)
DROP POLICY IF EXISTS "Allow public token validation" ON public.survey_tokens;
CREATE POLICY "Allow public token validation" ON public.survey_tokens FOR SELECT TO anon, authenticated USING (true);

-- Responses: Public insert access (to record survey submissions)
DROP POLICY IF EXISTS "Allow anonymous response submissions" ON public.survey_responses;
CREATE POLICY "Allow anonymous response submissions" ON public.survey_responses FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Responses: Authenticated read access
DROP POLICY IF EXISTS "Allow authenticated response read" ON public.survey_responses;
CREATE POLICY "Allow authenticated response read" ON public.survey_responses FOR SELECT TO authenticated USING (true);

-- Batches & Audit Logs: Admin/Authenticated access
DROP POLICY IF EXISTS "Allow authenticated batch management" ON public.survey_batches;
CREATE POLICY "Allow authenticated batch management" ON public.survey_batches FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated audit log management" ON public.audit_logs;
CREATE POLICY "Allow authenticated audit log management" ON public.audit_logs FOR ALL TO authenticated USING (true);

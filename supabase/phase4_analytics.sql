-- ==============================================================================
-- PHASE 4: RESPONSE MANAGEMENT & ANALYTICS VIEW
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create summary view vw_response_summary
CREATE OR REPLACE VIEW public.vw_response_summary AS
SELECT
    (SELECT COUNT(*) FROM public.survey_responses) AS total_responses,
    (SELECT COUNT(*) FROM public.survey_tokens) AS total_tokens,
    (SELECT COUNT(*) FROM public.survey_tokens WHERE status = 'opened') AS total_opened,
    (SELECT COUNT(*) FROM public.survey_tokens WHERE status = 'completed') AS total_completed,
    (SELECT COUNT(*) FROM public.survey_responses WHERE submitted_at >= CURRENT_DATE) AS completed_today;

-- 2. Grant permissions to API roles
GRANT ALL ON public.vw_response_summary TO anon, authenticated, service_role;

-- 3. Query view to verify output
SELECT * FROM public.vw_response_summary;

-- ==============================================================================
-- PHASE 5: NPS ANALYTICS VIEW
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create SQL view for NPS calculations (supports npsScore and nps keys)
CREATE OR REPLACE VIEW public.vw_nps_summary AS
SELECT
    COUNT(*) FILTER (
        WHERE COALESCE((response_json->>'npsScore')::int, (response_json->>'nps')::int) >= 9
    ) AS promoters,

    COUNT(*) FILTER (
        WHERE COALESCE((response_json->>'npsScore')::int, (response_json->>'nps')::int) BETWEEN 7 AND 8
    ) AS passives,

    COUNT(*) FILTER (
        WHERE COALESCE((response_json->>'npsScore')::int, (response_json->>'nps')::int) <= 6
    ) AS detractors,

    COUNT(*) AS total_responses
FROM public.survey_responses;

-- 2. Grant permissions to API roles
GRANT ALL ON public.vw_nps_summary TO anon, authenticated, service_role;

-- 3. Query view to verify calculation
SELECT 
    *,
    CASE 
        WHEN total_responses > 0 THEN 
            ROUND((((promoters::decimal / total_responses) - (detractors::decimal / total_responses)) * 100), 1)
        ELSE 0 
    END AS nps_score
FROM public.vw_nps_summary;

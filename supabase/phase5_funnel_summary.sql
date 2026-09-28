-- ==============================================================================
-- PHASE 5: FUNNEL SUMMARY VIEW
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create SQL view for Funnel Performance calculation
CREATE OR REPLACE VIEW public.vw_funnel_summary AS
SELECT
    COUNT(*) AS generated,
    COUNT(*) FILTER (
        WHERE status IN ('opened', 'completed')
    ) AS opened,
    COUNT(*) FILTER (
        WHERE status = 'completed'
    ) AS completed
FROM public.survey_tokens;

-- 2. Grant permissions to API roles
GRANT ALL ON public.vw_funnel_summary TO anon, authenticated, service_role;

-- 3. Query view to verify calculation
SELECT 
    *,
    CASE WHEN generated > 0 THEN ROUND((opened::decimal / generated) * 100, 1) ELSE 0 END AS open_rate,
    CASE WHEN opened > 0 THEN ROUND((completed::decimal / opened) * 100, 1) ELSE 0 END AS completion_rate
FROM public.vw_funnel_summary;

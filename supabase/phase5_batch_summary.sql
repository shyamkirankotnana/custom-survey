-- ==============================================================================
-- PHASE 5: BATCH GENERATION SUMMARY VIEW
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create SQL view for Batch Generation History
CREATE OR REPLACE VIEW public.vw_batch_summary AS
SELECT 
    date_trunc('second', generated_at) AS batch_time,
    COUNT(*) AS total_links,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
    COUNT(*) FILTER (WHERE status = 'opened') AS opened_count,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
    COUNT(*) FILTER (WHERE status = 'expired') AS expired_count,
    (ARRAY_AGG(token))[1] AS sample_token
FROM public.survey_tokens
GROUP BY date_trunc('second', generated_at)
ORDER BY batch_time DESC;

-- 2. Grant permissions to API roles
GRANT ALL ON public.vw_batch_summary TO anon, authenticated, service_role;

-- 3. Query view to verify calculation
SELECT * FROM public.vw_batch_summary LIMIT 20;

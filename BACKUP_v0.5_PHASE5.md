# Custom Survey Platform - Phase 5 System Backup Documentation
**Git Tag**: `v0.5-phase5-complete`  
**Commit**: `0f58981`  
**Date**: September 29, 2026  
**Architecture**: Next.js 16 (App Router) + Supabase PostgreSQL + TypeScript  

---

## 1. System Overview & Architecture Maturity

The Custom Survey Platform has completed **Phase 5 (NPS Analytics Engine & Conversion Funnel Metrics)**. The system now features an end-to-end tokenized survey lifecycle, single-token batch generation controls, response management, CSV/JSON export, automated database reset utilities, and real-time Net Promoter Score (NPS) calculation views.

```
Respondent Link -> Token Validation (/s/[token]) -> Live Survey (/s/[token]/survey) -> JSON Submission -> Thank You
                                                                                               ↓
Admin Portals: Tokens (/admin/tokens) | Responses (/admin/responses) | NPS Analytics (/admin/analytics)
```

---

## 2. Complete Database Schema

### `public.surveys`
```sql
CREATE TABLE public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `public.survey_tokens`
```sql
CREATE TABLE public.survey_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'opened', 'completed', 'expired')),
    opened_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### `public.survey_responses`
```sql
CREATE TABLE public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES public.survey_tokens(id) ON DELETE CASCADE,
    response_json JSONB NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Database Views

### A. `vw_response_summary` (Phase 4)
```sql
CREATE OR REPLACE VIEW public.vw_response_summary AS
SELECT 
    r.id AS response_id,
    t.token,
    t.status AS token_status,
    COALESCE((r.response_json->>'npsScore')::int, (r.response_json->>'nps')::int) AS nps_score,
    r.response_json->>'resolutionEase' AS resolution_ease,
    r.response_json->>'positiveFeedback' AS positive_feedback,
    r.response_json->>'additionalComments' AS additional_comments,
    r.response_json->'aspectRatings' AS aspect_ratings,
    r.response_json,
    r.submitted_at,
    t.opened_at,
    t.completed_at
FROM public.survey_responses r
JOIN public.survey_tokens t ON r.token_id = t.id
ORDER BY r.submitted_at DESC;
```

### B. `vw_nps_summary` (Phase 5)
```sql
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
```

### C. `vw_funnel_summary` (Phase 5)
```sql
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

GRANT ALL ON public.vw_funnel_summary TO anon, authenticated, service_role;
```

---

## 4. Key Services & Operations

### Token Service (`lib/services/token.service.ts`)
* `validateToken(token)`: Read-only check for status (`pending`, `opened`, `completed`, `expired`).
* `markOpened(token)`: Transitions status from `pending` to `opened` and records `opened_at`.
* `submitResponse(token, responseJson)`: Saves response payload to `survey_responses` and updates token status to `completed`.
* `generateBatch(count)`: Generates custom batch of 10-char NanoIDs (`1`, `10`, `100`, etc.).

### Analytics Service (`lib/services/analytics.service.ts`)
* `getNpsAnalytics()`: Queries `vw_nps_summary` for NPS score and sentiment breakdown.
* `getFunnelMetrics()`: Queries `vw_funnel_summary` for single-query funnel conversion metrics.

### Database Reset Utility (`scripts/reset_db.mjs`)
* Command: `npm run db:reset`
* Purges `survey_responses` and `survey_tokens` for clean test cycles.

---

## 5. API Contracts

| Route | Method | Description |
| :--- | :---: | :--- |
| `/s/[token]` | `GET` | Respondent landing page; validates link |
| `/s/[token]/survey` | `GET` | Survey runner page; marks link opened |
| `/api/survey/submit` | `POST` | Submits JSON response payload & marks link completed |
| `/api/admin/tokens/generate` | `POST` | Batch generates tokens (`{ count: N }`) |
| `/api/admin/tokens/list` | `GET` | Fetches list of tokens for admin portal |
| `/api/admin/tokens/export` | `GET` | Downloads CSV export of survey links |
| `/api/admin/responses/list` | `GET` | Fetches response list with filters |
| `/api/admin/responses/export/csv` | `GET` | Downloads CSV export of survey responses |
| `/api/admin/responses/export/json` | `GET` | Downloads full JSON export of survey responses |
| `/api/admin/analytics` | `GET` | Fetches NPS metrics & funnel conversion data |

---

## 6. Environment Variables Schema (`.env.local`)

```env
# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
```

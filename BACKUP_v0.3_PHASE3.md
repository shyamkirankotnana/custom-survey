# SYSTEM BACKUP & ARCHITECTURE SNAPSHOT
**Release Tag:** `v0.3-phase3-complete`  
**Date:** September 29, 2026  
**Status:** Minimum Viable Survey Platform (MVSP) Completed & Verified  

---

## 1. Version Control Metadata
* **Git Branch:** `nextjs-migration`
* **Git Tag:** `v0.3-phase3-complete`
* **Remote Repository:** `https://github.com/shyamkirankotnana/custom-survey.git`
* **Hosting Platform:** Vercel (`https://custom-survey-ebon.vercel.app`)

---

## 2. Complete Database Schemas (Phases 1–3)

```sql
-- 1. TABLE: surveys
CREATE TABLE public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE: survey_tokens
CREATE TABLE public.survey_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'opened', 'completed', 'expired')),
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    opened_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_survey_tokens_status ON public.survey_tokens(status);
CREATE INDEX idx_survey_tokens_generated_at ON public.survey_tokens(generated_at);

-- 3. TABLE: survey_responses
CREATE TABLE public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES public.survey_tokens(id) ON DELETE CASCADE,
    response_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_survey_responses_token_id ON public.survey_responses(token_id);
CREATE INDEX idx_survey_responses_submitted_at ON public.survey_responses(submitted_at DESC);

-- Permissions (Prototype Phase)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
```

---

## 3. Route & URL Architecture

| Route | Purpose | Access Rule / Logic |
| :--- | :--- | :--- |
| **`/admin/tokens`** | Link Engine & Token Generator | Renders batch generator UI & CSV export download. |
| **`/s/[token]`** | Link Validation Landing | Read-only validation. `pending` tokens remain `pending` (email scanner safe). |
| **`/s/[token]/survey`** | Context-Aware Survey Form | Renders survey app with `token` context. Triggers `pending` $\rightarrow$ `opened` (`opened_at = NOW()`). |
| **`/api/admin/tokens/generate`** | NanoID Batch API | Generates 100 10-char NanoIDs (`nanoid(10)`) and bulk-inserts into `survey_tokens`. |
| **`/api/admin/tokens/export`** | CSV Export API | Streams CSV formatted as `token,url,status,generated_at`. |
| **`/api/survey/open`** | Status Transition API | Updates token `status = 'opened'` and sets `opened_at = NOW()`. |
| **`/api/survey/submit`** | Response Persistence API | Saves `response_json`, links `token_id`, and sets token `status = 'completed'` with `completed_at = NOW()`. |

---

## 4. Sample JSON Response Payload

```json
{
  "token": "a8KP2sdDqL",
  "responseJson": {
    "npsScore": 10,
    "q1FollowUpText": "RM was proactive and clear",
    "resolutionEase": "Very Easy",
    "q2FollowUpText": "Resolved within hours",
    "aspectRatings": {
      "accessibility": "Very Good",
      "frequency": "Good",
      "banking_knowledge": "Very Good",
      "investment_knowledge": "Good",
      "understanding_needs": "Very Good",
      "resolution_quality": "Very Good",
      "service_timelines": "Very Good",
      "rm_etiquette": "Very Good"
    },
    "q4FeedbackText": "Great support overall"
  }
}
```

---

## 5. Sample CSV Export Format (`/api/admin/tokens/export`)

```csv
token,url,status,generated_at
"a8KP2sdDqL","https://custom-survey-ebon.vercel.app/s/a8KP2sdDqL","pending","2026-09-29T02:50:00Z"
"mZk88AsnP","https://custom-survey-ebon.vercel.app/s/mZk88AsnP","pending","2026-09-29T02:50:00Z"
```

---

## 6. Pre-Production Security Checklist (Phase 7)
- [ ] Remove `GRANT ALL ON ALL TABLES IN SCHEMA public TO anon...`
- [ ] Enable Row Level Security (RLS) policies on `survey_responses`.
- [ ] Restrict `anon` key to Server-Side API execution only.
- [ ] Restrict `SELECT` access on `survey_responses` to authenticated admin users.

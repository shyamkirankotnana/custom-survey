-- ========================================================
-- Phase 1: Create 'surveys' Table & Insert Test Record
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- ========================================================

-- 1. Create surveys table
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policy allowing anonymous/public SELECT for Phase 1 testing
DROP POLICY IF EXISTS "Allow public select on surveys" ON public.surveys;
CREATE POLICY "Allow public select on surveys"
    ON public.surveys
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 4. Insert 1 test survey record
INSERT INTO public.surveys (name, description, status)
VALUES (
    'ICICI Bank Relationship Manager Survey 2026',
    'Customer feedback survey for evaluating Relationship Manager service quality.',
    'active'
);

-- 5. Display inserted record in Supabase Results tab
SELECT * FROM public.surveys;

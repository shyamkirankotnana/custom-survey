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

-- 2. Grant table permissions to anon and authenticated roles
GRANT ALL ON TABLE public.surveys TO anon, authenticated, service_role;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policy allowing anonymous/public SELECT for Phase 1 testing
DROP POLICY IF EXISTS "Allow public select on surveys" ON public.surveys;
CREATE POLICY "Allow public select on surveys"
    ON public.surveys
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. Insert 1 test survey record (if not already present)
INSERT INTO public.surveys (name, description, status)
SELECT 
    'ICICI Bank Relationship Manager Survey 2026',
    'Customer feedback survey for evaluating Relationship Manager service quality.',
    'active'
WHERE NOT EXISTS (SELECT 1 FROM public.surveys);

-- 6. Display inserted record in Supabase Results tab
SELECT * FROM public.surveys;

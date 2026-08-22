-- ============================================================
-- SRMVEC CSE Blog — Supabase Schema & Row Level Security (RLS)
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PROFILES TABLE (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin', 'faculty_admin', 'editor')),
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies to allow clean re-runs
DROP POLICY IF EXISTS "Allow authenticated read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins update profiles" ON public.profiles;

-- Profiles Policies:
CREATE POLICY "Allow authenticated read profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins update profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty_admin', 'editor')
    )
  );

-- Automatically create profile on new user signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$function$;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_role TEXT NOT NULL CHECK (author_role IN ('student', 'teacher', 'admin', 'faculty_admin', 'editor')),
  is_published BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Clean up any existing blog policies for clean re-runs
DROP POLICY IF EXISTS "Public view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authors update own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins update any blog" ON public.blogs;
DROP POLICY IF EXISTS "Permitted teachers update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authors delete own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins delete any blog" ON public.blogs;
DROP POLICY IF EXISTS "Permitted teachers delete blogs" ON public.blogs;

-- Blogs Policies:
CREATE POLICY "Public view published blogs" ON public.blogs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users insert blogs" ON public.blogs
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = author_id
  );

CREATE POLICY "Authors update own blogs" ON public.blogs
  FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins update any blog" ON public.blogs
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty_admin', 'editor')
    )
  );

CREATE POLICY "Permitted teachers update blogs" ON public.blogs
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'teacher' 
      AND (permissions->>'can_edit_others')::boolean = true
    )
  );

CREATE POLICY "Authors delete own blogs" ON public.blogs
  FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Admins delete any blog" ON public.blogs
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty_admin', 'editor')
    )
  );

CREATE POLICY "Permitted teachers delete blogs" ON public.blogs
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'teacher' 
      AND (permissions->>'can_delete_others')::boolean = true
    )
  );


-- ============================================================
-- 3. PUBLICATIONS & PATENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('journal', 'conference', 'patent', 'book_chapter')),
  category TEXT NOT NULL,
  journal_name TEXT NOT NULL,
  issn_isbn TEXT NOT NULL,
  year INTEGER NOT NULL,
  contributors TEXT NOT NULL,
  mentors TEXT,
  abstract TEXT NOT NULL,
  url TEXT,
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_role TEXT NOT NULL CHECK (author_role IN ('student', 'teacher', 'admin', 'faculty_admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on publications
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Clean up any existing publication policies for clean re-runs
DROP POLICY IF EXISTS "Public view publications" ON public.publications;
DROP POLICY IF EXISTS "Authenticated users insert publications" ON public.publications;
DROP POLICY IF EXISTS "Authors update own publications" ON public.publications;
DROP POLICY IF EXISTS "Authors delete own publications" ON public.publications;

-- Publications Policies:
CREATE POLICY "Public view publications" ON public.publications
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users insert publications" ON public.publications
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = author_id
  );

CREATE POLICY "Authors update own publications" ON public.publications
  FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors delete own publications" ON public.publications
  FOR DELETE TO authenticated
  USING (auth.uid() = author_id);



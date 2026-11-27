-- ============================================================
-- SRMVEC CSE Blog — Comprehensive Production Supabase Schema
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- 100% Idempotent: Safely creates or updates schema, RLS policies,
-- triggers, private security definer routines, and performance indexes.
-- ============================================================

-- ═══════════════════════════════════════════════════════════════════════
-- 0. DYNAMIC CLEAN DROP OF LEGACY POLICIES (Table-Existence Safe)
-- ═══════════════════════════════════════════════════════════════════════

-- Dynamically drops existing policies without failing on tables that don't exist yet (avoids 42P01)
-- and releases all dependencies on public.is_admin() (avoids 2BP01).
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        policyname IN (
          'Users read own profile', 'Admins update profiles', 'Users update own profile',
          'Allow authenticated read profiles', 'Admins read profiles', 'profiles_select_policy',
          'profiles_update_owner', 'profiles_update_admin',
          'Allow read faculty whitelist', 'Admins manage faculty whitelist',
          'Public view published blogs', 'Authors & Admins view own or pending blogs',
          'Authenticated users insert blogs', 'Authors update own blogs', 'Admins update any blog',
          'Permitted teachers update blogs', 'Authors delete own blogs', 'Admins delete any blog',
          'Permitted teachers delete blogs', 'blogs_select_policy', 'blogs_insert_authenticated',
          'blogs_update_policy', 'blogs_delete_policy',
          'Public view publications', 'Authenticated users insert publications', 'Admins insert publications',
          'Authors update own publications', 'Admins update publications', 'Authors delete own publications',
          'Admins delete publications', 'publications_select_public', 'publications_insert_authenticated',
          'publications_update_policy', 'publications_delete_policy',
          'achievements_select_published', 'achievements_insert_admin', 'achievements_update_admin',
          'achievements_delete_admin',
          'faculty_select_public', 'faculty_insert_admin', 'faculty_update_admin',
          'faculty_delete_admin'
        )
        OR qual LIKE '%is_admin%'
        OR with_check LIKE '%is_admin%'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Drop public.is_admin cleanly with CASCADE
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;


-- ═══════════════════════════════════════════════════════════════════════
-- 1. PRIVATE SCHEMA & NON-RECURSIVE AUTHORIZATION HELPER
-- ═══════════════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'faculty_admin', 'editor')
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;


-- ═══════════════════════════════════════════════════════════════════════
-- 2. DATA RECONCILIATION & PROFILES HARDENING
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS register_number TEXT,
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS permissions JSONB,
  ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE public.profiles
  SET status = 'pending'
  WHERE role IN ('teacher', 'faculty') AND status IS NULL;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_status_check
  CHECK (status IS NULL OR status IN ('pending', 'approved', 'rejected'));

UPDATE public.profiles 
  SET must_change_password = FALSE 
  WHERE must_change_password IS NULL;

UPDATE public.profiles 
  SET permissions = '{}'::jsonb 
  WHERE permissions IS NULL;

UPDATE public.profiles 
  SET department = 'CSE' 
  WHERE department IS NULL;

ALTER TABLE public.profiles 
  ALTER COLUMN must_change_password SET DEFAULT FALSE,
  ALTER COLUMN must_change_password SET NOT NULL,
  ALTER COLUMN permissions SET DEFAULT '{}'::jsonb,
  ALTER COLUMN permissions SET NOT NULL,
  ALTER COLUMN department SET DEFAULT 'CSE';

-- Normalize existing register numbers
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_register_number_key;
DROP INDEX IF EXISTS idx_profiles_register_number;

UPDATE public.profiles 
  SET register_number = UPPER(TRIM(register_number)) 
  WHERE register_number IS NOT NULL AND register_number <> UPPER(TRIM(register_number));

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_register_number_unique 
  ON public.profiles (UPPER(TRIM(register_number))) 
  WHERE register_number IS NOT NULL;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'teacher', 'faculty', 'admin', 'faculty_admin', 'editor'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Public-safe identity check used before student account activation. It returns
-- only a status/reason and never exposes profile or email data.
CREATE OR REPLACE FUNCTION public.verify_student_name(p_reg_no TEXT, p_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_profile RECORD;
  v_expected TEXT;
  v_actual TEXT;
BEGIN
  SELECT id, email, full_name, role
    INTO v_profile
    FROM public.profiles
   WHERE UPPER(TRIM(register_number)) = UPPER(TRIM(p_reg_no))
     AND role = 'student'
   LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'not_found');
  END IF;

  v_expected := regexp_replace(UPPER(TRIM(v_profile.full_name)), '\s+', ' ', 'g');
  v_actual := regexp_replace(UPPER(TRIM(p_name)), '\s+', ' ', 'g');

  IF v_expected <> v_actual THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'name_mismatch');
  END IF;

  IF v_profile.email NOT LIKE '%@student.srmvec.ac.in' THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'already_registered');
  END IF;

  RETURN jsonb_build_object('valid', true);
END;
$$;

REVOKE ALL ON FUNCTION public.verify_student_name(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_student_name(TEXT, TEXT) TO anon, authenticated;

-- Table-level grants for profiles
GRANT SELECT, UPDATE ON public.profiles TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- 3. PROFILES RLS & SENSITIVE COLUMN PROTECTION
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR private.is_admin());

DROP POLICY IF EXISTS "profiles_update_owner" ON public.profiles;
CREATE POLICY "profiles_update_owner" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (NULLIF(current_setting('request.jwt.claim.role', true), '') = 'authenticated') AND NOT private.is_admin() THEN
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
      RAISE EXCEPTION 'Access denied: You cannot change your account role.';
    END IF;

    IF (NEW.permissions IS DISTINCT FROM OLD.permissions) THEN
      RAISE EXCEPTION 'Access denied: You cannot change account permissions.';
    END IF;

    IF (NEW.must_change_password IS DISTINCT FROM OLD.must_change_password) THEN
      RAISE EXCEPTION 'Access denied: must_change_password cannot be modified directly.';
    END IF;

    IF (NEW.register_number IS DISTINCT FROM OLD.register_number) THEN
      RAISE EXCEPTION 'Access denied: Register number cannot be modified.';
    END IF;

    IF (NEW.email IS DISTINCT FROM OLD.email) THEN
      RAISE EXCEPTION 'Access denied: Email cannot be changed via profile update.';
    END IF;

    IF (NEW.department IS DISTINCT FROM OLD.department) THEN
      RAISE EXCEPTION 'Access denied: Department cannot be changed via profile update.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_profile_sensitive_columns() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_profile_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_sensitive_columns();


-- ═══════════════════════════════════════════════════════════════════════
-- 4. FACULTY WHITELIST TABLE (Private & RLS-Protected)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.faculty_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT DEFAULT 'CSE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faculty_whitelist
  ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'CSE';

-- Deduplicate by normalized email using window function (UUID type-safe, avoids min(uuid) 42883)
DELETE FROM public.faculty_whitelist
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY created_at ASC) as rnum
    FROM public.faculty_whitelist
  ) t
  WHERE t.rnum > 1
);

UPDATE public.faculty_whitelist 
  SET email = LOWER(TRIM(email)) 
  WHERE email <> LOWER(TRIM(email));

ALTER TABLE public.faculty_whitelist DROP CONSTRAINT IF EXISTS faculty_whitelist_email_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_faculty_whitelist_lower_email 
  ON public.faculty_whitelist (LOWER(TRIM(email)));

ALTER TABLE public.faculty_whitelist ENABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS public.check_faculty_whitelist_email(TEXT);

DROP POLICY IF EXISTS "Admins manage faculty whitelist" ON public.faculty_whitelist;
CREATE POLICY "Admins manage faculty whitelist"
  ON public.faculty_whitelist
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

INSERT INTO public.faculty_whitelist (email, full_name, department)
VALUES
  ('pr.cse@srmvalliammai.ac.in', 'Dr. Priya Ramesh', 'CSE'),
  ('ks.cse@srmvalliammai.ac.in', 'Prof. Karthik Subramanian', 'CSE'),
  ('ms.cse@srmvalliammai.ac.in', 'Dr. Meena Sundarajan', 'CSE')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════
-- 5. ZERO-TRUST AUTH LIFECYCLE (Signup & Email Confirmation)
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_role TEXT := 'student';
  v_reg_no TEXT;
  v_full_name TEXT;
  v_is_whitelisted_faculty BOOLEAN := FALSE;
  v_email TEXT;
BEGIN
  v_email := NULLIF(TRIM(NEW.email), '');

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(SPLIT_PART(v_email, '@', 1), ''),
    'User'
  );

  v_reg_no := UPPER(NULLIF(TRIM(NEW.raw_user_meta_data->>'register_number'), ''));

  IF v_email IS NOT NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.faculty_whitelist 
      WHERE LOWER(TRIM(email)) = LOWER(v_email)
    ) INTO v_is_whitelisted_faculty;
  END IF;

  IF v_is_whitelisted_faculty THEN
    v_role := 'teacher';
  ELSE
    v_role := 'student';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    register_number,
    must_change_password
  )
  VALUES (
    NEW.id,
    COALESCE(v_email, NEW.id::text || '@auth.local'),
    v_full_name,
    v_role,
    v_reg_no,
    CASE WHEN v_role = 'student' THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_faculty BOOLEAN := FALSE;
  v_email      TEXT;
BEGIN
  IF (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
    v_email := NULLIF(TRIM(NEW.email), '');

    IF v_email IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM public.faculty_whitelist
        WHERE LOWER(TRIM(email)) = LOWER(v_email)
      ) INTO v_is_faculty;

      IF v_is_faculty THEN
        UPDATE public.profiles
        SET
          role                 = 'teacher',
          must_change_password = FALSE,
          updated_at           = NOW()
        WHERE id = NEW.id
          AND role = 'student';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_user_email_confirmed() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_confirmed();


CREATE OR REPLACE FUNCTION public.handle_user_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password) THEN
    UPDATE public.profiles
    SET 
      must_change_password = FALSE,
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_user_password_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_password_changed ON auth.users;
CREATE TRIGGER on_auth_user_password_changed
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_password_change();

DROP FUNCTION IF EXISTS public.complete_student_password_reset();


-- ═══════════════════════════════════════════════════════════════════════
-- 6. BLOGS TABLE (Anti-Spoofing & Publishing Workflow Guard)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_role TEXT NOT NULL CHECK (author_role IN ('student', 'teacher', 'faculty', 'admin', 'faculty_admin', 'editor')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist on pre-existing blogs tables (avoids 42703)
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill NULL values
UPDATE public.blogs SET status = 'pending' WHERE status IS NULL;
UPDATE public.blogs SET is_published = FALSE WHERE is_published IS NULL;
UPDATE public.blogs SET views = 0 WHERE views IS NULL;
UPDATE public.blogs SET tags = '{}' WHERE tags IS NULL;

ALTER TABLE public.blogs
  ALTER COLUMN is_published SET DEFAULT FALSE,
  ALTER COLUMN status SET DEFAULT 'pending';

-- Add status check constraint safely
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT constraint_name 
    FROM information_schema.constraint_column_usage 
    WHERE table_schema = 'public' 
      AND table_name = 'blogs' 
      AND column_name = 'status'
  ) LOOP
    EXECUTE 'ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.blogs
  ADD CONSTRAINT blogs_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Server-side Trigger: Enforce trusted author identity and publishing authorization
CREATE OR REPLACE FUNCTION public.enforce_blog_author_and_publishing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
  v_profile RECORD;
BEGIN
  v_caller_is_admin := private.is_admin();

  IF TG_OP = 'INSERT' THEN
    IF NOT v_caller_is_admin OR NEW.author_id IS NULL THEN
      NEW.author_id := auth.uid();
    END IF;

    SELECT full_name, role INTO v_profile
    FROM public.profiles
    WHERE id = NEW.author_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Author profile does not exist.';
    END IF;

    NEW.author_name := v_profile.full_name;
    NEW.author_role := v_profile.role;

    IF NOT v_caller_is_admin THEN
      NEW.status := 'pending';
      NEW.is_published := FALSE;
      NEW.views := 0;
    ELSE
      IF NEW.status IS NULL THEN NEW.status := 'approved'; END IF;
      IF NEW.is_published IS NULL THEN NEW.is_published := TRUE; END IF;
    END IF;

    NEW.created_at := NOW();
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT v_caller_is_admin THEN
      NEW.author_id := OLD.author_id;
      NEW.author_name := OLD.author_name;
      NEW.author_role := OLD.author_role;
      NEW.views := OLD.views;

      IF (NEW.title IS DISTINCT FROM OLD.title) OR 
         (NEW.content IS DISTINCT FROM OLD.content) OR 
         (NEW.category IS DISTINCT FROM OLD.category) OR 
         (NEW.tags IS DISTINCT FROM OLD.tags) THEN
        NEW.status := 'pending';
        NEW.is_published := FALSE;
      ELSE
        NEW.status := OLD.status;
        NEW.is_published := OLD.is_published;
      END IF;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_blog_author_and_publishing() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_blog_author ON public.blogs;
CREATE TRIGGER trg_enforce_blog_author
  BEFORE INSERT OR UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.enforce_blog_author_and_publishing();

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anonymous-Safe SELECT: Separated public published policy from authenticated admin/owner policy
-- so anonymous queries NEVER evaluate private.is_admin() (prevents 42501 permission denied for function is_admin)
DROP POLICY IF EXISTS "blogs_select_policy" ON public.blogs;
DROP POLICY IF EXISTS "blogs_select_published" ON public.blogs;
CREATE POLICY "blogs_select_published" ON public.blogs
  FOR SELECT TO anon, authenticated
  USING ((is_published = TRUE OR is_published IS NULL) AND (status = 'approved' OR status IS NULL));

DROP POLICY IF EXISTS "blogs_select_authenticated" ON public.blogs;
CREATE POLICY "blogs_select_authenticated" ON public.blogs
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.uid()) = author_id)
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "blogs_insert_authenticated" ON public.blogs;
CREATE POLICY "blogs_insert_authenticated" ON public.blogs
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "blogs_update_policy" ON public.blogs;
CREATE POLICY "blogs_update_policy" ON public.blogs
  FOR UPDATE TO authenticated
  USING (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  )
  WITH CHECK (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "blogs_delete_policy" ON public.blogs;
CREATE POLICY "blogs_delete_policy" ON public.blogs
  FOR DELETE TO authenticated
  USING (
    ((SELECT auth.uid()) = author_id AND status = 'pending')
    OR private.is_admin()
  );

CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published_status ON public.blogs(is_published, status);

-- Table-level grants for blogs
GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blogs TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- 7. PUBLICATIONS & PATENTS TABLE (Anti-Spoofing & Verified Identity)
-- ═══════════════════════════════════════════════════════════════════════

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
  author_role TEXT NOT NULL CHECK (author_role IN ('student', 'teacher', 'faculty', 'admin', 'faculty_admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist on pre-existing publications tables
ALTER TABLE public.publications
  ADD COLUMN IF NOT EXISTS mentors TEXT,
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.enforce_publication_author()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
  v_profile RECORD;
BEGIN
  v_caller_is_admin := private.is_admin();

  IF TG_OP = 'INSERT' THEN
    IF NOT v_caller_is_admin OR NEW.author_id IS NULL THEN
      NEW.author_id := auth.uid();
    END IF;

    SELECT full_name, role INTO v_profile
    FROM public.profiles
    WHERE id = NEW.author_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Author profile does not exist.';
    END IF;

    NEW.author_name := v_profile.full_name;
    NEW.author_role := v_profile.role;
    NEW.created_at := NOW();
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT v_caller_is_admin THEN
      NEW.author_id := OLD.author_id;
      NEW.author_name := OLD.author_name;
      NEW.author_role := OLD.author_role;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_publication_author() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_publication_author ON public.publications;
CREATE TRIGGER trg_enforce_publication_author
  BEFORE INSERT OR UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.enforce_publication_author();

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publications_select_public" ON public.publications;
CREATE POLICY "publications_select_public" ON public.publications
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "publications_insert_authenticated" ON public.publications;
CREATE POLICY "publications_insert_authenticated" ON public.publications
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "publications_update_policy" ON public.publications;
CREATE POLICY "publications_update_policy" ON public.publications
  FOR UPDATE TO authenticated
  USING (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  )
  WITH CHECK (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "publications_delete_policy" ON public.publications;
CREATE POLICY "publications_delete_policy" ON public.publications
  FOR DELETE TO authenticated
  USING (
    (SELECT auth.uid()) = author_id
    OR private.is_admin()
  );

CREATE INDEX IF NOT EXISTS idx_publications_author_id ON public.publications(author_id);
CREATE INDEX IF NOT EXISTS idx_publications_year ON public.publications(year DESC);

-- Table-level grants for publications
GRANT SELECT ON public.publications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.publications TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- 8. ACHIEVEMENTS TABLE (Strict Admin Control & Hardened RLS)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.achievements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  short_desc       TEXT NOT NULL,
  image_url        TEXT,
  achievement_date DATE NOT NULL,
  category         TEXT NOT NULL CHECK (category IN ('Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Placement', 'Other')),
  student_name     TEXT NOT NULL,
  year             TEXT,
  posted_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published     BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist on pre-existing achievements tables
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Anonymous-Safe SELECT: Separated public published policy from authenticated admin policy
-- so anonymous queries NEVER evaluate private.is_admin() (prevents 42501 permission denied for function is_admin)
DROP POLICY IF EXISTS "achievements_select_published" ON public.achievements;
DROP POLICY IF EXISTS "achievements_select_admin" ON public.achievements;

CREATE POLICY "achievements_select_published" ON public.achievements
  FOR SELECT TO anon, authenticated
  USING (is_published = TRUE OR is_published IS NULL);

CREATE POLICY "achievements_select_admin" ON public.achievements
  FOR SELECT TO authenticated
  USING (private.is_admin());

DROP POLICY IF EXISTS "achievements_insert_admin" ON public.achievements;
CREATE POLICY "achievements_insert_admin"
  ON public.achievements
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "achievements_update_admin" ON public.achievements;
CREATE POLICY "achievements_update_admin"
  ON public.achievements
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "achievements_delete_admin" ON public.achievements;
CREATE POLICY "achievements_delete_admin"
  ON public.achievements
  FOR DELETE TO authenticated
  USING (private.is_admin());

CREATE OR REPLACE FUNCTION public.achievements_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.achievements_set_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS achievements_updated_at ON public.achievements;
CREATE TRIGGER achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.achievements_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_achievements_posted_by ON public.achievements(posted_by);
CREATE INDEX IF NOT EXISTS idx_achievements_is_published ON public.achievements(is_published);

-- Table-level grants (required in addition to RLS policies)
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.achievements TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- 9. SECURITY DEFINER ROUTINE LOCKDOWN & CLEANUP (Resolves Lints 0028 & 0029)
-- ═══════════════════════════════════════════════════════════════════════

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_user_email_confirmed() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_user_password_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_sensitive_columns() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_blog_author_and_publishing() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_publication_author() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.achievements_set_updated_at() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated';
    EXECUTE 'DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE';
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════
-- 10. FACULTY TABLE (Public Directory, Admin-Managed)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.faculty (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  designation TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  department  TEXT NOT NULL DEFAULT 'CSE',
  qual        TEXT,
  exp         TEXT,
  spec        TEXT,
  image       TEXT,
  joined      INTEGER,
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

-- Public read: faculty directory is intentionally public (anon + authenticated)
DROP POLICY IF EXISTS "faculty_select_public" ON public.faculty;
CREATE POLICY "faculty_select_public" ON public.faculty
  FOR SELECT TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "faculty_insert_admin" ON public.faculty;
CREATE POLICY "faculty_insert_admin" ON public.faculty
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "faculty_update_admin" ON public.faculty;
CREATE POLICY "faculty_update_admin" ON public.faculty
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "faculty_delete_admin" ON public.faculty;
CREATE POLICY "faculty_delete_admin" ON public.faculty
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- SECURITY INVOKER: this trigger only sets updated_at -- no elevated privilege needed
CREATE OR REPLACE FUNCTION public.faculty_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.faculty_set_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS faculty_updated_at ON public.faculty;
CREATE TRIGGER faculty_updated_at
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.faculty_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty(department);
CREATE INDEX IF NOT EXISTS idx_faculty_email ON public.faculty(email);

-- Table-level grants for faculty
GRANT SELECT ON public.faculty TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faculty TO authenticated;


-- 11. ADDITIONAL SECURITY HARDENING (Lints 0028/0029 — SECURITY INVOKER & Legacy Cleanup)
-- ═══════════════════════════════════════════════════════════════════════

-- Downgrade achievements_set_updated_at to SECURITY INVOKER (it only stamps updated_at —
-- no cross-schema reads, no elevated privilege needed).
CREATE OR REPLACE FUNCTION public.achievements_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.achievements_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.faculty_set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_faculty_status(p_target_id UUID, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_updated public.profiles;
BEGIN
  IF NOT private.is_admin() THEN
    RAISE EXCEPTION 'Access denied: administrator role required';
  END IF;

  IF p_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid faculty status';
  END IF;

  UPDATE public.profiles
  SET status = p_status,
      updated_at = NOW()
  WHERE id = p_target_id
    AND role IN ('teacher', 'faculty')
  RETURNING * INTO v_updated;

  IF v_updated.id IS NULL THEN
    RAISE EXCEPTION 'Faculty profile not found';
  END IF;

  RETURN jsonb_build_object(
    'id', v_updated.id,
    'status', v_updated.status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_faculty_status(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_faculty_status(UUID, TEXT) TO authenticated;

-- Drop legacy functions flagged by the security advisor as callable by anon/authenticated.
-- These were created in earlier migrations and are superseded by trigger-based auth lifecycle.
DO $$
BEGIN
  -- set_new_profile_status: superseded by handle_new_user trigger
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
             WHERE n.nspname = 'public' AND p.proname = 'set_new_profile_status') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.set_new_profile_status() FROM PUBLIC, anon, authenticated';
    EXECUTE 'DROP FUNCTION IF EXISTS public.set_new_profile_status() CASCADE';
  END IF;

  -- admin_set_faculty_status: superseded by direct admin RLS policies on profiles
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
             WHERE n.nspname = 'public' AND p.proname = 'admin_set_faculty_status') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.admin_set_faculty_status(uuid, text) FROM PUBLIC, anon, authenticated';
    EXECUTE 'DROP FUNCTION IF EXISTS public.admin_set_faculty_status(uuid, text) CASCADE';
  END IF;

  -- rls_auto_enable: Supabase internal helper, safe to drop
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
             WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated';
    EXECUTE 'DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE';
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════════════
-- ═══════════════════════════════════════════════════════════════════════
-- 12. REVOKE & DROP STUDENT LOOKUP POLICY AND RPC (Zero PII Leakage Remediation)
-- ═══════════════════════════════════════════════════════════════════════

-- Drop broad anon lookup policy on profiles to prevent student data exposure
DROP POLICY IF EXISTS "profiles_student_lookup_by_regno" ON public.profiles;

-- Revoke and drop get_student_email_by_regno to prevent enumeration of student emails
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
             WHERE n.nspname = 'public' AND p.proname = 'get_student_email_by_regno') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.get_student_email_by_regno(text) FROM PUBLIC, anon, authenticated';
    EXECUTE 'DROP FUNCTION IF EXISTS public.get_student_email_by_regno(text) CASCADE';
  END IF;
END $$;

-- Refresh PostgREST schema cache so newly created RPCs (e.g. admin_set_faculty_status) are immediately available
NOTIFY pgrst, 'reload schema';


-- ═══════════════════════════════════════════════════════════════════════
-- 13. EVENTS TABLE (Custom events added by admin, persisted for all users)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.events (
  id              TEXT PRIMARY KEY,
  numeric_id      BIGINT,
  title           TEXT NOT NULL,
  college         TEXT,
  dept            TEXT,
  date            TEXT,
  reg_close_date  TEXT,
  reg_close_formatted TEXT,
  time            TEXT,
  venue           TEXT,
  fee             TEXT,
  prizes          TEXT,
  poster          TEXT,
  tech_events     TEXT[],
  non_tech_events TEXT[],
  contact         TEXT,
  reg_url         TEXT,
  description     TEXT,
  is_deleted      BOOLEAN DEFAULT FALSE,
  created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-deleted events
DROP POLICY IF EXISTS "events_select_public" ON public.events;
CREATE POLICY "events_select_public" ON public.events
  FOR SELECT TO anon, authenticated
  USING (is_deleted = FALSE OR is_deleted IS NULL);

-- Only admins can insert
DROP POLICY IF EXISTS "events_insert_admin" ON public.events;
CREATE POLICY "events_insert_admin" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

-- Only admins can update
DROP POLICY IF EXISTS "events_update_admin" ON public.events;
CREATE POLICY "events_update_admin" ON public.events
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- Only admins can delete (soft-delete via is_deleted flag, or hard delete)
DROP POLICY IF EXISTS "events_delete_admin" ON public.events;
CREATE POLICY "events_delete_admin" ON public.events
  FOR DELETE TO authenticated
  USING (private.is_admin());

GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;

CREATE INDEX IF NOT EXISTS idx_events_is_deleted ON public.events(is_deleted);
CREATE INDEX IF NOT EXISTS idx_events_reg_close_date ON public.events(reg_close_date);

NOTIFY pgrst, 'reload schema';


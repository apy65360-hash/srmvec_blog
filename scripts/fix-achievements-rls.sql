-- ============================================================
-- SRMVEC CSE Blog — Fix Achievements & Blogs Public Visibility
-- ============================================================
-- PROBLEM:
-- Public/anonymous visitors on the Home page only see the 3 hardcoded
-- fallback achievements because the previous RLS policy evaluated:
--   USING (is_published = TRUE OR private.is_admin())
-- Since 'anon' has no EXECUTE permission on private.is_admin(),
-- PostgreSQL throws "42501: permission denied for function is_admin".
-- Only logged-in Admins have permission to evaluate is_admin(),
-- which is why new achievements only showed when logged in as admin!
--
-- SOLUTION:
-- Separate the SELECT policies:
-- 1) Public policy checks only (is_published = TRUE) without calling is_admin().
-- 2) Admin policy allows authenticated admins to read all rows.
-- ============================================================

BEGIN;

-- 1. Ensure columns and defaults on achievements table
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
UPDATE public.achievements SET is_published = TRUE WHERE is_published IS NULL;

-- 2. Drop conflicting unified policies on achievements
DROP POLICY IF EXISTS "achievements_select_published" ON public.achievements;
DROP POLICY IF EXISTS "achievements_select_admin" ON public.achievements;

-- 3. Create Anonymous-Safe SELECT policy for achievements
CREATE POLICY "achievements_select_published" ON public.achievements
  FOR SELECT TO anon, authenticated
  USING (is_published = TRUE OR is_published IS NULL);

-- 4. Create Authenticated Admin SELECT policy for achievements (allows viewing drafts)
CREATE POLICY "achievements_select_admin" ON public.achievements
  FOR SELECT TO authenticated
  USING (private.is_admin());

-- 5. Grant SELECT to anon and authenticated roles
GRANT SELECT ON public.achievements TO anon, authenticated;

-- 6. Fix blogs table policies identically so anonymous visitors can read approved blogs
DROP POLICY IF EXISTS "blogs_select_policy" ON public.blogs;
DROP POLICY IF EXISTS "blogs_select_published" ON public.blogs;
DROP POLICY IF EXISTS "blogs_select_authenticated" ON public.blogs;

CREATE POLICY "blogs_select_published" ON public.blogs
  FOR SELECT TO anon, authenticated
  USING ((is_published = TRUE OR is_published IS NULL) AND (status = 'approved' OR status IS NULL));

CREATE POLICY "blogs_select_authenticated" ON public.blogs
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.uid()) = author_id)
    OR private.is_admin()
  );

GRANT SELECT ON public.blogs TO anon, authenticated;

COMMIT;

-- 7. Notify PostgREST to immediately refresh its schema cache
NOTIFY pgrst, 'reload schema';

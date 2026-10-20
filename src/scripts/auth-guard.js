/**
 * Route Guard Middleware for SRMVEC Portal
 * Enforces role-based permissions and intercepts unreset student sessions.
 */

import { supabase } from './supabase.js';

export async function protectRoute({ allowedRoles = [], requirePasswordUpdated = true } = {}) {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';

  let sessionUser = null;

  // 1. Check Supabase session first if client is initialized
  if (supabase) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        // Fetch user profile from DB
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, full_name, role, register_number, must_change_password')
          .eq('id', session.user.id)
          .maybeSingle();

        const role = profile?.role || session.user.user_metadata?.role || 'student';
        const mustChange = profile?.must_change_password ?? session.user.user_metadata?.must_change_password ?? false;

        sessionUser = {
          userId: session.user.id,
          id: session.user.id,
          email: session.user.email,
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email,
          displayName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email,
          role: role,
          registerNumber: profile?.register_number || session.user.user_metadata?.register_number || '',
          mustChangePassword: !!mustChange
        };
      }
    } catch (e) {
      console.warn("Auth guard session check warning:", e);
    }
  }

  // Fallback to local session if Supabase wasn't connected or returned null
  if (!sessionUser && window.Auth) {
    sessionUser = window.Auth.currentUser();
  }

  // Determine appropriate login destination
  let loginPage = 'login.html';
  if (allowedRoles.includes('teacher')) {
    loginPage = 'teacher-login.html';
  } else if (allowedRoles.includes('student')) {
    loginPage = 'student-login.html';
  } else if (allowedRoles.some(r => ['admin', 'faculty_admin', 'editor'].includes(r))) {
    loginPage = 'admin-login.html';
  }

  // Not authenticated
  if (!sessionUser) {
    window.location.replace(`${loginPage}?denied=1&next=${encodeURIComponent(currentPage)}`);
    return null;
  }

  // FIRST LOGIN ENFORCEMENT:
  // If student must change password, intercept and redirect immediately
  if (sessionUser.role === 'student' && sessionUser.mustChangePassword && requirePasswordUpdated) {
    if (!currentPage.includes('change-password.html')) {
      window.location.replace(`change-password.html?forced=1&next=${encodeURIComponent(currentPage)}`);
      return null;
    }
  }

  // If on change-password.html but password is ALREADY updated, redirect to home
  if (sessionUser.mustChangePassword === false && currentPage.includes('change-password.html')) {
    const home = sessionUser.role === 'teacher' ? 'teachers-corner.html' : 'student-corner.html';
    window.location.replace(home);
    return null;
  }

  // Check role authorization
  if (allowedRoles.length > 0) {
    const isAdmin = ['admin', 'faculty_admin', 'editor'].includes(sessionUser.role);
    const hasRole = allowedRoles.includes(sessionUser.role) || (allowedRoles.includes('admin') && isAdmin);

    if (!hasRole) {
      alert("Access Denied: You do not have permission to view this section.");
      const defaultHome = sessionUser.role === 'teacher' ? 'teachers-corner.html' : 'student-corner.html';
      window.location.replace(defaultHome);
      return null;
    }
  }

  return sessionUser;
}

if (typeof window !== 'undefined') {
  window.protectRoute = protectRoute;
}

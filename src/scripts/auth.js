/**
 * Front-end session helper for the CSE Blog portal.
 * Integrated with Supabase Auth and localStorage fallback.
 */
const AUTH_STORAGE_KEY = "srmvec_portal_session";
const BLOGDB_USER_KEY = "srmvec_current_user";

const Auth = {
  async login(emailOrName, password, role) {
    let supabaseError = null;

    // Try Supabase auth first if available
    if (window.supabase) {
      const email = emailOrName.includes('@') ? emailOrName.trim() : `${emailOrName.toLowerCase().replace(/\s+/g, '')}@srmvec.ac.in`;
      
      let { data, error } = await window.supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      // If failed and emailOrName was entered without @, also try raw input as email just in case
      if (error && !emailOrName.includes('@')) {
        const retry = await window.supabase.auth.signInWithPassword({
          email: emailOrName.trim(),
          password: password
        });
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }

      if (!error && data && data.user) {
        // Fetch user profile
        let profile = null;
        try {
          const { data: profileData } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profile = profileData;
        } catch (e) {
          console.warn("Profile fetch warning:", e);
        }

        let userRole = profile?.role || data.user.user_metadata?.role;
        if (!userRole) {
          userRole = (role === 'admin' || role === 'faculty_admin' || role === 'editor') ? 'faculty_admin' : (role || 'student');
        }

        // Auto-create or repair missing profile in Supabase table
        if (!profile) {
          try {
            await window.supabase.from('profiles').upsert([{
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
              role: userRole
            }]);
          } catch (e) {
            console.warn("Profile auto-creation warning:", e);
          }
        }

        const user = {
          userId: data.user.id,
          id: data.user.id,
          name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email,
          displayName: profile?.full_name || data.user.user_metadata?.full_name || data.user.email,
          username: data.user.email,
          role: userRole,
          email: data.user.email,
          permissions: profile?.permissions || {}
        };
        return this.startSession(user);
      } else if (error) {
        supabaseError = error.message;
      }
    }

    // Local fallback authentication
    const user = window.PortalUsers ? window.PortalUsers.match(emailOrName, password, role) : null;
    if (!user) {
      return supabaseError ? { error: supabaseError } : null;
    }
    return this.startSession(user);
  },

  startSession(user) {
    const session = {
      userId: user.userId || user.id,
      id: user.id || user.userId,
      name: user.name || user.displayName,
      displayName: user.name || user.displayName,
      username: user.username || user.email || user.name,
      role: user.role,
      email: user.email || "",
      permissions: user.permissions || {},
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    sessionStorage.setItem(BLOGDB_USER_KEY, JSON.stringify(session));
    this.updateAdminDropdowns();
    return session;
  },

  currentUser() {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(BLOGDB_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  },

  isAdmin() {
    const u = this.currentUser();
    return u && (u.role === "admin" || u.role === "faculty_admin" || u.role === "editor");
  },

  isTeacher() {
    const u = this.currentUser();
    return u && u.role === "teacher";
  },

  isStudent() {
    const u = this.currentUser();
    return u && u.role === "student";
  },

  async logout() {
    if (window.supabase) {
      try {
        await window.supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signout failed:", e);
      }
    }
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(BLOGDB_USER_KEY);
    this.updateAdminDropdowns();
  },

  safeNext(next) {
    const value = String(next || "").trim();
    return /^[\w.-]+\.html(\?[^\s]*)?(#[^\s]*)?$/.test(value) ? value : null;
  },

  homeFor(role) {
    if (role === "teacher") { return "dashboard.html"; }
    if (role === "admin" || role === "faculty_admin" || role === "editor") { return "admin-corner.html"; }
    return "student-corner.html";
  },

  requireLogin(allowedRoles) {
    const user = this.currentUser();
    const page = location.pathname.split("/").pop() || "index.html";
    let loginPage = "login.html";
    if (Array.isArray(allowedRoles)) {
      if (allowedRoles.some(r => ["admin", "faculty_admin", "editor"].includes(r))) {
        loginPage = "admin-login.html";
      } else if (allowedRoles.includes("teacher")) {
        loginPage = "teacher-login.html";
      }
    }
    if (!user) {
      location.replace(loginPage + "?next=" + encodeURIComponent(page));
      return null;
    }

    const isAdminUser = this.isAdmin();
    const isAllowed = Array.isArray(allowedRoles) && allowedRoles.length && (
      allowedRoles.includes(user.role) || (allowedRoles.some(r => ["admin", "faculty_admin", "editor"].includes(r)) && isAdminUser)
    );

    if (Array.isArray(allowedRoles) && allowedRoles.length && !isAllowed) {
      location.replace(loginPage + "?denied=1");
      return null;
    }
    return user;
  },

  /**
   * Updates Admin Corner dropdown menus across pages:
   * Hides restricted links (Manage Faculty, Data Dashboard, Admin Corner) when not logged in as Admin.
   */
  updateAdminDropdowns() {
    const isAdmin = this.isAdmin();

    // Select all dropdown menus that contain Admin Corner or links to admin pages
    const dropdowns = document.querySelectorAll(".nav-item.dropdown");
    dropdowns.forEach(dropdown => {
      const headerLink = dropdown.querySelector("a");
      const menu = dropdown.querySelector(".dropdown-menu");

      if (headerLink && headerLink.textContent.includes("Admin Corner") && menu) {
        let manageFacultyLink = menu.querySelector('a[href*="manage-faculty.html"]');
        let dashboardLink = menu.querySelector('a[href*="dashboard.html"]');
        let adminCornerLink = menu.querySelector('a[href*="admin-corner.html"]');
        let adminLoginLink = menu.querySelector('a[href*="admin-login.html"]');

        if (!isAdmin) {
          // Hide admin-only items
          if (manageFacultyLink) manageFacultyLink.style.display = "none";
          if (dashboardLink) dashboardLink.style.display = "none";
          if (adminCornerLink) adminCornerLink.style.display = "none";

          if (adminLoginLink) {
            adminLoginLink.textContent = "Admin Login";
            adminLoginLink.href = "admin-login.html";
            adminLoginLink.style.display = "block";
          }
        } else {
          // Show admin-only items when logged in as admin
          if (manageFacultyLink) manageFacultyLink.style.display = "block";
          if (dashboardLink) dashboardLink.style.display = "block";
          
          if (!adminCornerLink && menu) {
            const acLink = document.createElement("a");
            acLink.href = "admin-corner.html";
            acLink.textContent = "Admin Corner Dashboard";
            menu.insertBefore(acLink, menu.firstChild);
          } else if (adminCornerLink) {
            adminCornerLink.style.display = "block";
          }

          if (adminLoginLink) {
            adminLoginLink.textContent = "Logout (Admin)";
            adminLoginLink.href = "#";
            adminLoginLink.onclick = (e) => {
              e.preventDefault();
              Auth.logout().then(() => {
                location.href = "index.html";
              });
            };
          }
        }
      }
    });
  },

  renderUserBadge() {
    const user = this.currentUser();
    document.querySelectorAll("[data-auth-user]").forEach(function (node) {
      node.textContent = user ? user.name + " (" + user.role + ")" : "Guest";
    });
    document.querySelectorAll("[data-auth-logout]").forEach(function (node) {
      node.addEventListener("click", function (event) {
        event.preventDefault();
        Auth.logout().then(() => {
          location.href = "index.html";
        });
      });
    });
    this.updateAdminDropdowns();
    return user;
  }
};

if (typeof window !== "undefined") {
  window.Auth = Auth;
  document.addEventListener("DOMContentLoaded", () => {
    Auth.updateAdminDropdowns();
  });
}


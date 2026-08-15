/**
 * Front-end session helper for the CSE Blog portal.
 * Accounts live in users.js; sign-in is NAME + ID NUMBER (e.g. "Dr. Priya Ramesh" / "CSE101").
 * Note: this is a demo-only client-side check, not real security.
 */
const AUTH_STORAGE_KEY = "srmvec_portal_session";
const BLOGDB_USER_KEY = "srmvec_current_user";

const Auth = {
  /**
   * Signs in with a name (or ID) and the account's ID number as the password.
   * Pass a role to restrict the lookup to teachers or students.
   */
  login(nameOrId, idNumber, role) {
    const user = window.PortalUsers ? window.PortalUsers.match(nameOrId, idNumber, role) : null;
    if (!user) {
      return null;
    }
    return this.startSession(user);
  },

  startSession(user) {
    const session = {
      userId: user.userId,
      id: user.id,
      name: user.name,
      displayName: user.name,
      username: user.name,
      role: user.role,
      email: user.email || "",
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    // Shared with the corner pages (blog-data.js) so they skip their own login screen.
    sessionStorage.setItem(BLOGDB_USER_KEY, JSON.stringify(session));
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

  logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(BLOGDB_USER_KEY);
  },

  /**
   * Keeps a ?next= destination on this site: relative page names only, so a
   * crafted link cannot bounce someone to another origin after sign-in.
   */
  safeNext(next) {
    const value = String(next || "").trim();
    return /^[\w.-]+\.html(\?[^\s]*)?(#[^\s]*)?$/.test(value) ? value : null;
  },

  /** Landing page for a role after sign-in. */
  homeFor(role) {
    if (role === "teacher") { return "dashboard.html"; }
    if (role === "admin") { return "admin-corner.html"; }
    return "student-corner.html";
  },

  /**
   * Redirects to the login page when nobody is signed in, or when the signed-in
   * user's role is not in allowedRoles (omit allowedRoles to allow any role).
   */
  requireLogin(allowedRoles) {
    const user = this.currentUser();
    const page = location.pathname.split("/").pop() || "index.html";
    let loginPage = "login.html";
    if (Array.isArray(allowedRoles)) {
      if (allowedRoles.includes("admin")) {
        loginPage = "admin-login.html";
      } else if (allowedRoles.includes("teacher")) {
        loginPage = "teacher-login.html";
      }
    }
    if (!user) {
      location.replace(loginPage + "?next=" + encodeURIComponent(page));
      return null;
    }
    if (Array.isArray(allowedRoles) && allowedRoles.length && !allowedRoles.includes(user.role)) {
      location.replace(loginPage + "?denied=1");
      return null;
    }
    return user;
  },

  /** Fills every [data-auth-user] element and wires [data-auth-logout] triggers. */
  renderUserBadge() {
    const user = this.currentUser();
    document.querySelectorAll("[data-auth-user]").forEach(function (node) {
      node.textContent = user ? user.name + " (" + user.role + ")" : "Guest";
    });
    document.querySelectorAll("[data-auth-logout]").forEach(function (node) {
      node.addEventListener("click", function (event) {
        event.preventDefault();
        Auth.logout();
        location.href = "index.html";
      });
    });
    return user;
  }
};

if (typeof window !== "undefined") {
  window.Auth = Auth;
}

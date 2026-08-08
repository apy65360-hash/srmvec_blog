/**
 * Front-end session helper for the CSE Blog portal.
 * Credentials live in users.js; this file only handles login state.
 * Note: this is a demo-only client-side check, not real security.
 */
const AUTH_STORAGE_KEY = "srmvec_portal_session";

const Auth = {
  login(username, password) {
    const users = window.PORTAL_USERS || [];
    const match = users.find(function (user) {
      return user.username === String(username).trim() && user.password === password;
    });
    if (!match) {
      return null;
    }
    const session = {
      id: match.id,
      name: match.name,
      role: match.role,
      email: match.email,
      username: match.username,
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  currentUser() {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  },

  logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Redirects to login.html when nobody is signed in, or when the signed-in
   * user's role is not in allowedRoles (omit allowedRoles to allow any role).
   */
  requireLogin(allowedRoles) {
    const user = this.currentUser();
    const target = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() || "index.html");
    if (!user) {
      location.replace(target);
      return null;
    }
    if (Array.isArray(allowedRoles) && allowedRoles.length && !allowedRoles.includes(user.role)) {
      location.replace("login.html?denied=1");
      return null;
    }
    return user;
  },

  /** Fills every [data-auth-user] element with the signed-in user's name and role. */
  renderUserBadge() {
    const user = this.currentUser();
    document.querySelectorAll("[data-auth-user]").forEach(function (node) {
      node.textContent = user ? user.name + " (" + user.role + ")" : "Guest";
    });
    document.querySelectorAll("[data-auth-logout]").forEach(function (node) {
      node.addEventListener("click", function (event) {
        event.preventDefault();
        Auth.logout();
        location.href = "login.html";
      });
    });
    return user;
  }
};

if (typeof window !== "undefined") {
  window.Auth = Auth;
}

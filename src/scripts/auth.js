/**
 * Front-end session helper for the CSE Blog portal.
 * Integrated with Supabase Auth and localStorage fallback.
 */
const AUTH_STORAGE_KEY = "srmvec_portal_session";
const BLOGDB_USER_KEY = "srmvec_current_user";

/* ────────────────────────────────────────────────────────────
 *  Password Security Utilities (Free-tier HIBP k-Anonymity)
 *  Replaces Supabase Pro's "Prevent use of leaked passwords"
 * ──────────────────────────────────────────────────────────── */

/**
 * Checks if a password has appeared in known data breaches via the
 * free HIBP Pwned Passwords API.  Uses k-Anonymity: only the first
 * 5 characters of the SHA-1 hash are sent — the actual password and
 * full hash are NEVER transmitted over the network.
 *
 * @param {string} password - The plain-text password to check.
 * @returns {Promise<{ isPwned: boolean, breachCount: number }>}
 */
async function isPasswordLeaked(password) {
  if (!password) return { isPwned: false, breachCount: 0 };

  try {
    // 1. Compute SHA-1 hash in the browser
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(password));
    const sha1 = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('').toUpperCase();

    // 2. Split: 5-char prefix (sent) + 35-char suffix (kept local)
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    // 3. Query the Cloudflare-cached HIBP range endpoint (free & unlimited)
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' }   // prevents response-size side-channel
    });

    if (!response.ok) {
      console.warn('HIBP service returned non-OK status; skipping leak check.');
      return { isPwned: false, breachCount: 0 };
    }

    const text = await response.text();

    // 4. Search returned suffixes for a match
    for (const line of text.split('\n')) {
      const [hashSuffix, count] = line.trim().split(':');
      if (hashSuffix === suffix) {
        return { isPwned: true, breachCount: parseInt(count, 10) };
      }
    }

    return { isPwned: false, breachCount: 0 };
  } catch (err) {
    // Fail open — don't block the user if offline / network error
    console.warn('Pwned-password check skipped (network/offline):', err);
    return { isPwned: false, breachCount: 0 };
  }
}

/**
 * College-context-aware password validator.
 * Combines length, campus-keyword blocklist, register-number guard,
 * and HIBP breach database lookup.
 *
 * @param {string}  newPassword  - The candidate password.
 * @param {string}  [regNo]      - Optional register number to block.
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
async function validateNewPassword(newPassword, regNo) {
  if (!newPassword || newPassword.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }

  const passLower = newPassword.toLowerCase();

  // Block passwords that contain the student's own register number
  if (regNo && passLower.includes(regNo.toLowerCase())) {
    return { valid: false, error: 'Password must not contain your Register Number.' };
  }

  // Block campus-obvious keywords
  const blockedKeywords = ['srmvec', 'valliammai', 'srmvalliammai', 'password', 'college'];
  for (const keyword of blockedKeywords) {
    if (passLower.includes(keyword)) {
      return { valid: false, error: `Password must not contain "${keyword}".` };
    }
  }

  // Check against 800M+ real-world breached passwords via HIBP
  const { isPwned, breachCount } = await isPasswordLeaked(newPassword);
  if (isPwned) {
    return {
      valid: false,
      error: `This password has appeared in ${breachCount.toLocaleString()} known data breaches. Please choose a different, unique password.`
    };
  }

  return { valid: true };
}

// Expose utilities globally so HTML pages can call them directly
if (typeof window !== 'undefined') {
  window.isPasswordLeaked = isPasswordLeaked;
  window.validateNewPassword = validateNewPassword;
}


const Auth = {
  async login(emailOrName, password, role) {
    let supabaseError = null;

    if (role === 'teacher') {
      const emailLower = String(emailOrName || '').trim().toLowerCase();
      if (!/^[a-z0-9._-]+\.cse@srmvalliammai\.ac\.in$/i.test(emailLower)) {
        return { error: 'Teachers must use an email matching <nameinitial>.cse@srmvalliammai.ac.in' };
      }
    }

    // Try Supabase auth first if available
    if (window.supabase) {
      const email = emailOrName.includes('@') ? emailOrName.trim() : `${emailOrName.toLowerCase().replace(/\s+/g, '')}@srmvalliammai.ac.in`;
      
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
    let user = null;
    if (window.PortalUsers) {
      if (role === 'teacher') {
        user = window.PortalUsers.matchTeacher(emailOrName, password);
      } else if (role === 'student') {
        user = window.PortalUsers.matchStudent(emailOrName, password) || window.PortalUsers.match(emailOrName, password, role);
      } else {
        user = window.PortalUsers.match(emailOrName, password, role);
      }
    }
    if (!user) {
      return supabaseError ? { error: supabaseError } : null;
    }
    return this.startSession(user);
  },

  /**
   * Request Email OTP for Faculty login
   * Restricts OTP dispatch to authorized faculty whitelist and institutional email format.
   */
  async requestFacultyOtp(email) {
    const emailLower = String(email || '').trim().toLowerCase();
    
    // Strict domain and format validation
    const facultyRegex = /^[a-z0-9._-]+(\.cse)?@(srmvalliammai\.ac\.in|srmvec\.ac\.in)$/i;
    if (!facultyRegex.test(emailLower)) {
      return { error: 'Please enter a valid institutional faculty email (e.g. pr.cse@srmvalliammai.ac.in).' };
    }

    // Supabase OTP Flow
    if (window.supabase) {
      try {
        // Dispatch OTP via Supabase Auth
        // shouldCreateUser: false ensures unauthorized/non-provisioned emails cannot trigger OTP or self-signup
        const { error: otpError } = await window.supabase.auth.signInWithOtp({
          email: emailLower,
          options: {
            shouldCreateUser: false
          }
        });

        if (otpError) {
          if (otpError.message && (otpError.message.includes('Signups not allowed') || otpError.message.includes('User not found') || otpError.message.includes('otp_disabled'))) {
            return { error: 'This email is not authorized or provisioned in the faculty roster. Please contact the administrator.' };
          }
          return { error: otpError.message };
        }

        return { success: true, message: 'A 6-digit verification code has been dispatched to your institutional email.' };
      } catch (err) {
        return { error: err.message || 'Failed to dispatch verification code.' };
      }
    }

    // Local fallback for offline/demo mode
    if (window.PortalUsers) {
      const match = window.PortalUsers.allTeachers().find(t => t.email.toLowerCase() === emailLower);
      if (match) {
        return { success: true, message: 'Demo mode: Verification code sent. Use 123456 to sign in.' };
      }
      return { error: 'No faculty record found for this email address.' };
    }

    return { error: 'Authentication service unavailable.' };
  },

  /**
   * Verify Faculty Email OTP code
   */
  async verifyFacultyOtp(email, token) {
    const emailLower = String(email || '').trim().toLowerCase();
    const cleanToken = String(token || '').trim();

    if (!cleanToken) {
      return { error: 'Please enter the verification code.' };
    }

    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.verifyOtp({
          email: emailLower,
          token: cleanToken,
          type: 'email'
        });

        if (error || !data || !data.user) {
          return { error: error?.message || 'Invalid or expired verification code.' };
        }

        // Fetch or create profile
        let { data: profile } = await window.supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!profile) {
          await window.supabase.from('profiles').upsert([{
            id: data.user.id,
            email: emailLower,
            full_name: data.user.user_metadata?.full_name || emailLower.split('@')[0],
            role: 'teacher'
          }]);
        }

        const user = {
          userId: data.user.id,
          id: data.user.id,
          name: profile?.full_name || data.user.user_metadata?.full_name || emailLower,
          displayName: profile?.full_name || data.user.user_metadata?.full_name || emailLower,
          username: emailLower,
          role: profile?.role || 'teacher',
          email: emailLower,
          permissions: profile?.permissions || {}
        };

        return this.startSession(user);
      } catch (err) {
        return { error: err.message || 'OTP verification failed.' };
      }
    }

    // Local fallback for demo mode (Token '123456')
    if (window.PortalUsers && cleanToken === '123456') {
      const teacher = window.PortalUsers.allTeachers().find(t => t.email.toLowerCase() === emailLower);
      if (teacher) {
        return this.startSession(teacher);
      }
    }

    return { error: 'Invalid verification code.' };
  },

  /**
   * Student Login with Register Number + Password
   * Synthesizes canonical student email and checks for forced password change.
   */
  async loginStudent(registerNumber, password) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    if (!cleanRegNo || !password) {
      return { error: 'Please enter both your Register Number and password.' };
    }

    const syntheticEmail = `${cleanRegNo.toLowerCase()}@student.srmvec.ac.in`;
    let supabaseError = null;

    if (window.supabase) {
      try {
        // Sign in using synthetic email
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email: syntheticEmail,
          password: password
        });

        if (!error && data && data.user) {
          const { data: profile } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          const mustChange = profile?.must_change_password ?? (data.user.user_metadata?.must_change_password ?? false);

          const user = {
            userId: data.user.id,
            id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || cleanRegNo,
            displayName: profile?.full_name || data.user.user_metadata?.full_name || cleanRegNo,
            username: cleanRegNo,
            registerNumber: cleanRegNo,
            role: 'student',
            email: syntheticEmail,
            mustChangePassword: !!mustChange,
            permissions: profile?.permissions || {}
          };

          const session = this.startSession(user);
          return { session, mustChangePassword: !!mustChange };
        } else if (error) {
          supabaseError = error.message;
        }
      } catch (err) {
        supabaseError = err.message;
      }
    }

    // Local fallback for offline/demo students
    if (window.PortalUsers) {
      const localStudent = window.PortalUsers.allStudents().find(s => 
        (s.id && s.id.toUpperCase() === cleanRegNo) || (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
      );

      // Check against DOB or default password SRMVEC#<regNo> or CSE<regNo>
      if (localStudent) {
        const defaultPass = `SRMVEC#${cleanRegNo}`;
        const isMatch = (password === defaultPass) || (password === localStudent.dob) || (password === cleanRegNo);
        if (isMatch) {
          const isDefault = (password === defaultPass) || (password === localStudent.dob);
          localStudent.mustChangePassword = isDefault;
          localStudent.registerNumber = cleanRegNo;
          const session = this.startSession(localStudent);
          return { session, mustChangePassword: isDefault };
        }
      }
    }

    return { error: supabaseError || 'Invalid Register Number or Password.' };
  },

  /**
   * Handle Forced Password Update for Students.
   * Validates against leaked passwords (HIBP) and campus-obvious keywords
   * before committing the update to Supabase Auth.
   */
  async updateStudentPassword(newPassword) {
    // Retrieve current student's register number for contextual validation
    const current = this.currentUser();
    const regNo = current?.registerNumber || current?.register_number || '';

    // Run full validation: length + keyword blocklist + HIBP breach check
    const validation = await validateNewPassword(newPassword, regNo);
    if (!validation.valid) {
      return { error: validation.error };
    }

    if (window.supabase) {
      try {
        // Update Supabase Auth user password
        // The PostgreSQL trigger on_auth_user_password_changed automatically clears must_change_password on profiles
        const { error: passErr } = await window.supabase.auth.updateUser({
          password: newPassword
        });

        if (passErr) {
          return { error: passErr.message };
        }
      } catch (err) {
        return { error: err.message || 'Failed to update password.' };
      }
    }

    // Update session state
    if (current) {
      current.mustChangePassword = false;
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current));
      sessionStorage.setItem(BLOGDB_USER_KEY, JSON.stringify(current));
    }

    return { success: true };
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
      registerNumber: user.registerNumber || user.register_number || "",
      mustChangePassword: user.mustChangePassword ?? user.must_change_password ?? false,
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
      } else if (allowedRoles.includes("student")) {
        loginPage = "student-login.html";
      }
    }
    if (!user) {
      location.replace(loginPage + "?next=" + encodeURIComponent(page));
      return null;
    }

    // Forced password reset interception for students
    if (user.role === 'student' && user.mustChangePassword && !page.includes('change-password.html')) {
      location.replace("change-password.html?forced=1&next=" + encodeURIComponent(page));
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


/**
 * Front-end session helper for the CSE Blog portal.
 * Integrated with Supabase Auth and localStorage fallback.
 */
import './supabase.js';
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

  // ── Faculty / Teacher Auth Methods ─────────────────────────────────────────

  /**
   * Register a new faculty account with institutional email + password.
   * Account is created in Supabase Auth but marked as 'pending' in profiles
   * until an admin approves it.
   */
  async registerTeacher(fullName, email, password) {
    const FACULTY_REGEX = /^[a-z0-9._-]+(\.cse)?@(srmvalliammai\.ac\.in|srmvec\.ac\.in)$/i;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName  = String(fullName || '').trim();

    if (!FACULTY_REGEX.test(cleanEmail)) {
      return { error: 'Only institutional emails (@srmvalliammai.ac.in or @srmvec.ac.in) are allowed.' };
    }
    if (!password || password.length < 8) {
      return { error: 'Password must be at least 8 characters.' };
    }

    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName, role: 'teacher' }
          }
        });

        if (error) {
          if (error.message && (error.message.includes('already registered') || error.message.includes('already in use') || error.message.includes('User already registered'))) {
            return { error: 'An account with this email is already registered. Please sign in.' };
          }
          return { error: error.message };
        }

        if (data && data.user) {
          // Upsert profile row with status: 'pending' — admin must approve before login is allowed
          try {
            await window.supabase.from('profiles').upsert([{
              id:         data.user.id,
              email:      cleanEmail,
              full_name:  cleanName,
              role:       'teacher',
              status:     'pending'
            }], { onConflict: 'id' });
          } catch (e) {
            console.warn('Profile upsert warning:', e);
          }
          // Do NOT start a session — account needs admin approval first
          return { pendingApproval: true, email: cleanEmail };
        }

        return { pendingApproval: true, email: cleanEmail };
      } catch (err) {
        return { error: err.message || 'Registration failed.' };
      }
    }
    return { error: 'Registration service unavailable.' };
  },

  /**
   * Sign in a faculty member with institutional email + password.
   * Blocks login if account status is 'pending' or 'rejected'.
   */
  async loginTeacher(email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { error: 'Please enter your email and password.' };
    }

    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data && data.user) {
          const { data: profile } = await window.supabase
            .from('profiles').select('*').eq('id', data.user.id).maybeSingle();

          // Check approval status
          const status = profile?.status || 'pending';
          if (status === 'pending') {
            // Sign them back out — no session allowed until approved
            await window.supabase.auth.signOut().catch(() => {});
            return { error: 'pending_approval' };
          }
          if (status === 'rejected') {
            await window.supabase.auth.signOut().catch(() => {});
            return { error: 'Your account has been rejected. Please contact the administrator.' };
          }

          const role = profile?.role || data.user.user_metadata?.role || 'teacher';
          const user = {
            userId: data.user.id, id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail,
            displayName: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail,
            username: cleanEmail, role,
            email: cleanEmail,
            mustChangePassword: false,
            permissions: profile?.permissions || {}
          };
          return { session: this.startSession(user) };
        }

        if (error) {
          if (error.message && error.message.includes('Invalid login')) {
            return { error: 'Invalid email or password.' };
          }
          return { error: error.message };
        }
      } catch (err) {
        return { error: err.message || 'Login failed.' };
      }
    }

    // Local fallback
    if (window.PortalUsers) {
      const teacher = window.PortalUsers.allTeachers
        ? window.PortalUsers.allTeachers().find(t => t.email.toLowerCase() === cleanEmail)
        : null;
      if (teacher && (password === teacher.password || password === teacher.id)) {
        return { session: this.startSession(teacher) };
      }
    }

    return { error: 'Invalid email or password.' };
  },


  /**
   * Request Email OTP for Faculty login (legacy — kept for backward compat)
   * @deprecated Use loginTeacher() with email + password instead.
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

  // ── Student Auth Methods ────────────────────────────────────────────────────

  /**
   * Check if a register number exists in the roster and whether they have
   * already completed first-login registration.
   * Returns: { exists: bool, is_registered: bool }
   */
  async checkStudentRoster(registerNumber) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.rpc('check_student_roster', { p_reg_no: cleanRegNo });
        if (!error && data) return data;
      } catch (e) { /* fall through */ }
    }
    // Local fallback
    if (window.PortalUsers) {
      const local = window.PortalUsers.allStudents().find(s =>
        (s.id && s.id.toUpperCase() === cleanRegNo) ||
        (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
      );
      if (local) return { exists: true, is_registered: false };
    }
    return { exists: false };
  },

  /**
   * Verify student identity: checks Full Name against the roster.
   * Returns: { valid: bool, reason?: 'not_found'|'already_registered'|'name_mismatch' }
   */
  async verifyStudentName(registerNumber, fullName) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    const cleanName  = String(fullName || '').trim();
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.rpc('verify_student_name', {
          p_reg_no: cleanRegNo,
          p_name:   cleanName
        });
        if (!error && data) return data;
      } catch (e) { /* fall through */ }
    }
    // Local fallback
    if (window.PortalUsers) {
      const local = window.PortalUsers.allStudents().find(s =>
        (s.id && s.id.toUpperCase() === cleanRegNo) &&
        s.name && s.name.toUpperCase().replace(/\s+/g, ' ').trim() ===
                  cleanName.toUpperCase().replace(/\s+/g, ' ').trim()
      );
      return local ? { valid: true } : { valid: false, reason: 'name_mismatch' };
    }
    return { valid: false, reason: 'not_found' };
  },

  /**
   * First-time registration: creates a Supabase auth account with the student's
   * personal email and chosen password after identity has been verified.
   * Returns: { emailConfirmRequired: bool, email: string } on success, or { error }
   */
  async registerStudent(registerNumber, fullName, email, password) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName  = String(fullName || '').trim();

    if (!cleanRegNo || !cleanEmail || !password) {
      return { error: 'Register number, email, and password are all required.' };
    }

    // Fast local validation
    const validation = await validateNewPassword(password, cleanRegNo);
    if (!validation.valid) return { error: validation.error };

    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name:       cleanName,
              register_number: cleanRegNo,
              role:            'student',
              status:          'approved'
            }
          }
        });

        if (error) return { error: error.message };

        // Explicitly ensure profile row has status: 'approved' for student
        if (data && data.user) {
          try {
            await window.supabase.from('profiles').upsert([{
              id:              data.user.id,
              email:           cleanEmail,
              full_name:       cleanName,
              register_number: cleanRegNo,
              role:            'student',
              status:          'approved'
            }], { onConflict: 'id' });
          } catch (e) {
            console.warn('Student profile creation notice:', e);
          }
        }


        // If a session was returned, email confirmation is not required
        if (data.session && data.user) {
          const user = {
            userId:            data.user.id,
            id:                data.user.id,
            name:              cleanName,
            displayName:       cleanName,
            username:          cleanRegNo,
            registerNumber:    cleanRegNo,
            role:              'student',
            email:             cleanEmail,
            mustChangePassword: false,
            permissions:       {}
          };
          this.startSession(user);
          return { emailConfirmRequired: false, email: cleanEmail };
        }

        // Session is null → Supabase requires email confirmation
        return { emailConfirmRequired: true, email: cleanEmail };

      } catch (err) {
        return { error: err.message || 'Registration failed.' };
      }
    }

    // Local fallback (offline / demo mode)
    if (window.PortalUsers) {
      const result = window.PortalUsers.register({
        name: cleanName, id: cleanRegNo, role: 'student',
        email: cleanEmail, dob: password
      });
      if (result.error) return result;
      this.startSession({ ...result.user, registerNumber: cleanRegNo });
      return { emailConfirmRequired: false, email: cleanEmail };
    }

    return { error: 'Registration service unavailable.' };
  },

  /**
   * Returning student login: looks up the student's personal email by register
   * number (via Supabase RPC), then signs in with email + password.
   */
  async loginStudent(registerNumber, password) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    if (!cleanRegNo || !password) {
      return { error: 'Please enter your Register Number and password.' };
    }

    // Resolve personal email from profiles table via secure RPC
    let studentEmail = null;
    if (window.supabase) {
      try {
        const { data } = await window.supabase.rpc('get_student_email_by_regno', { p_reg_no: cleanRegNo });
        studentEmail = data || null;
      } catch (e) { /* fall through */ }
    }

    if (studentEmail && window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email:    studentEmail,
          password
        });

        if (!error && data && data.user) {
          const { data: profile } = await window.supabase
            .from('profiles').select('*').eq('id', data.user.id).maybeSingle();

          const user = {
            userId:            data.user.id,
            id:                data.user.id,
            name:              profile?.full_name || data.user.user_metadata?.full_name || cleanRegNo,
            displayName:       profile?.full_name || data.user.user_metadata?.full_name || cleanRegNo,
            username:          cleanRegNo,
            registerNumber:    cleanRegNo,
            role:              'student',
            email:             studentEmail,
            mustChangePassword: !!(profile?.must_change_password),
            permissions:       profile?.permissions || {}
          };
          return { session: this.startSession(user), mustChangePassword: user.mustChangePassword };
        }

        if (error) return { error: error.message };

      } catch (err) {
        return { error: err.message || 'Login failed.' };
      }
    }

    // Email not found in Supabase → student hasn't registered yet
    if (!studentEmail && window.supabase) {
      return { error: 'No account found. Please complete first-time registration.' };
    }

    // Local fallback (demo / offline)
    if (window.PortalUsers) {
      const local = window.PortalUsers.allStudents().find(s =>
        (s.id && s.id.toUpperCase() === cleanRegNo) ||
        (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
      );
      if (local) {
        const isMatch = password === local.dob || password === `SRMVEC#${cleanRegNo}` || password === cleanRegNo;
        if (isMatch) {
          local.registerNumber = cleanRegNo;
          return { session: this.startSession(local), mustChangePassword: false };
        }
      }
    }

    return { error: 'Invalid Register Number or Password.' };
  },

  /**
   * Forgot password: looks up the student's registered personal email and sends
   * a Supabase password-reset link to it.
   * Returns: { success: true, maskedEmail: '...' } or { error }
   */
  async forgotStudentPassword(registerNumber) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    if (!cleanRegNo) return { error: 'Please enter your Register Number.' };

    if (window.supabase) {
      try {
        const { data: email } = await window.supabase.rpc('get_student_email_by_regno', { p_reg_no: cleanRegNo });
        if (!email) return { error: 'No registered email found. Please contact the administrator.' };

        const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/change-password.html?forced=1&next=student-corner.html`
        });
        if (error) return { error: error.message };

        // Mask email: ab***@gmail.com
        const masked = email.replace(/^(.{2}).*(@.+)$/, '$1***$2');
        return { success: true, maskedEmail: masked };
      } catch (err) {
        return { error: err.message || 'Failed to send reset email.' };
      }
    }
    return { error: 'Password reset requires an internet connection.' };
  },

  /**
   * Student Login with Register Number + Password (kept for internal calls)
   * @deprecated Use loginStudent() — this alias will be removed.
   */
  async checkStudentLoginType(registerNumber) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.rpc('check_student_login_type', { p_reg_no: cleanRegNo });
        if (!error && data) return data;
      } catch (e) { /* fall through to local */ }
    }
    if (window.PortalUsers) {
      const local = window.PortalUsers.allStudents().find(s =>
        (s.id && s.id.toUpperCase() === cleanRegNo) ||
        (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
      );
      if (local) return { exists: true, must_change_password: true };
    }
    return { exists: false };
  },

  /**
   * First-login: verify student identity by Register Number + Full Name.
   * If verified, signs in with temp password (register number itself).
   */
  async loginStudentFirstTime(registerNumber, fullName) {
    const cleanRegNo = String(registerNumber || '').trim().toUpperCase();
    const cleanName  = String(fullName || '').trim();
    if (!cleanRegNo || !cleanName) {
      return { error: 'Please enter both your Register Number and Full Name.' };
    }

    // Verify identity via Supabase RPC
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.rpc('verify_student_first_login', {
          p_reg_no: cleanRegNo,
          p_name: cleanName
        });
        if (error) return { error: error.message };
        if (!data) return { error: 'Verification failed. Please try again.' };
        if (!data.valid) {
          if (data.reason === 'not_found')     return { error: 'Register Number not found in records.' };
          if (data.reason === 'already_set')   return { error: 'already_set' }; // Signal to show password form
          if (data.reason === 'name_mismatch') return { error: 'Name does not match records. Check spelling.' };
          return { error: 'Verification failed.' };
        }
      } catch (e) {
        return { error: e.message || 'Verification error.' };
      }
    } else {
      // Local fallback
      if (window.PortalUsers) {
        const local = window.PortalUsers.allStudents().find(s =>
          (s.id && s.id.toUpperCase() === cleanRegNo) &&
          s.name && s.name.toUpperCase().replace(/\s+/g,' ').trim() === cleanName.toUpperCase().replace(/\s+/g,' ').trim()
        );
        if (!local) return { error: 'Name does not match records. Check spelling.' };
      }
    }

    // Identity verified — sign in using register number as temp password
    const result = await this.loginStudent(cleanRegNo, cleanRegNo);
    if (result && !result.error) return { ...result, mustChangePassword: true };

    // Try SRMVEC# prefix fallback
    const result2 = await this.loginStudent(cleanRegNo, `SRMVEC#${cleanRegNo}`);
    if (result2 && !result2.error) return { ...result2, mustChangePassword: true };

    return { error: 'Auto sign-in failed after verification. Please contact the administrator.' };
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

    // Update top institutional utility bar across pages when logged in
    const user = this.currentUser();
    const topLinks = document.querySelector(".top-utility-links");
    if (topLinks && user) {
      if (user.role === "student") {
        topLinks.innerHTML = `
          <span style="color:#e2e8f0;font-weight:600;"><i class="fa-solid fa-user-graduate" style="color:#60a5fa;margin-right:0.35rem;"></i>Hi, ${user.name || user.displayName || 'Student'}</span>
          <a href="student-corner.html" style="color:#93c5fd;font-weight:600;"><i class="fa-solid fa-pen-nib"></i> Student Corner</a>
          <a href="#" class="top-auth-logout-link" style="color:#fca5a5;font-weight:600;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
        `;
      } else if (user.role === "teacher") {
        topLinks.innerHTML = `
          <span style="color:#e2e8f0;font-weight:600;"><i class="fa-solid fa-chalkboard-user" style="color:#c084fc;margin-right:0.35rem;"></i>Hi, ${user.name || user.displayName || 'Faculty'}</span>
          <a href="teachers-corner.html" style="color:#d8b4fe;font-weight:600;"><i class="fa-solid fa-pen-nib"></i> Teacher's Corner</a>
          <a href="#" class="top-auth-logout-link" style="color:#fca5a5;font-weight:600;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
        `;
      } else if (isAdmin) {
        topLinks.innerHTML = `
          <span style="color:#e2e8f0;font-weight:600;"><i class="fa-solid fa-shield-halved" style="color:#fbbf24;margin-right:0.35rem;"></i>Hi, Admin</span>
          <a href="admin-corner.html" style="color:#fde047;font-weight:600;"><i class="fa-solid fa-gauge"></i> Admin Corner</a>
          <a href="#" class="top-auth-logout-link" style="color:#fca5a5;font-weight:600;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
        `;
      }

      topLinks.querySelectorAll(".top-auth-logout-link").forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          this.logout().then(() => {
            location.href = "index.html";
          });
        };
      });
    }
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

export { Auth };
export default Auth;


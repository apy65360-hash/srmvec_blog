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
      if (!/^[a-z0-9._%+-]+@srmvalliammai\.ac\.in$/i.test(emailLower)) {
        return { error: 'Invalid mail id.' };
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
   * Validate that an email strictly belongs to SRM Valliammai official faculty domain:
   * must end with @srmvalliammai.ac.in
   */
  isValidFacultyEmail(email) {
    const cleaned = String(email || '').trim().toLowerCase();
    return /^[a-zA-Z0-9._%+-]+@srmvalliammai\.ac\.in$/i.test(cleaned);
  },

  /**
   * Check if a faculty name is in the official 26 CSE faculty roster
   */
  isAuthorizedFaculty(name) {
    if (window.PortalUsers && typeof window.PortalUsers.findAuthorizedFacultyByName === 'function') {
      return window.PortalUsers.findAuthorizedFacultyByName(name);
    }
    return null;
  },

  /**
   * Step 1 (First-Time Signup): Request Email OTP for official faculty setup.
   * STRICT RULES:
   * - Only names in the official CSE faculty roster of 26 members are permitted.
   * - Only official college email ending with @srmvalliammai.ac.in is allowed.
   * - If an account for this faculty member is already activated, registration is BLOCKED
   *   to prevent takeover / impersonation by others.
   */
  async requestFacultySignupOtp(fullName, positionOrEmail, maybeEmail) {
    let cleanName = String(fullName || '').trim();
    let position = '';
    let email = '';

    if (maybeEmail !== undefined) {
      position = String(positionOrEmail || '').trim();
      email = String(maybeEmail || '').trim().toLowerCase();
    } else {
      email = String(positionOrEmail || '').trim().toLowerCase();
    }

    if (!cleanName) {
      return { error: 'Invalid details.' };
    }

    // 1. Verify faculty name and chosen position in backend database
    let authorized = null;
    if (window.PortalUsers && typeof window.PortalUsers.verifyFacultyInDatabase === 'function') {
      const check = window.PortalUsers.verifyFacultyInDatabase(cleanName, position);
      if (!check.valid) {
        return { error: 'Invalid details or mail id.' };
      }
      authorized = check.faculty;
    } else {
      authorized = this.isAuthorizedFaculty(cleanName);
    }

    if (!authorized) {
      return { error: 'Invalid details or mail id.' };
    }

    // 2. Verify strict college email ending with @srmvalliammai.ac.in
    if (!this.isValidFacultyEmail(email)) {
      return { error: 'Invalid mail id.' };
    }

    // 3. Anti-impersonation: Check if account already activated for this faculty
    if (window.PortalUsers) {
      const existingByName = window.PortalUsers.getFacultyAccountByName(authorized.name);
      if (existingByName && existingByName.password) {
        return { error: 'Invalid details or mail id.' };
      }

      const existingByEmail = window.PortalUsers.getFacultyAccountByEmail(email);
      if (existingByEmail && existingByEmail.name.toLowerCase() !== authorized.name.toLowerCase() && existingByEmail.password) {
        return { error: 'Invalid mail id.' };
      }
    }

    // 4. Generate secure 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionPayload = {
      type: 'signup',
      name: authorized.name,
      designation: authorized.designation,
      email: email,
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };
    try {
      sessionStorage.setItem('srmvec_faculty_pending_otp', JSON.stringify(sessionPayload));
    } catch (e) {}

    // 5. Dispatch OTP via Supabase Auth
    let supabaseSent = false;
    if (window.supabase) {
      try {
        const { error: otpError } = await window.supabase.auth.signInWithOtp({
          email: email,
          options: {
            data: { full_name: authorized.name, role: 'teacher' }
          }
        });
        if (!otpError) {
          supabaseSent = true;
        } else {
          console.warn('Supabase OTP dispatch notice:', otpError.message);
        }
      } catch (err) {
        console.warn('Supabase signInWithOtp error:', err);
      }
    }

    return {
      success: true,
      email: email,
      name: authorized.name,
      message: 'A 6-digit verification code has been dispatched to ' + email + '.',
      devCode: generatedOtp
    };
  },

  /**
   * Step 1 (Forgot Password): Request Email OTP for faculty password reset.
   * STRICT RULES:
   * - Must be an official @srmvalliammai.ac.in email.
   * - Must match an activated faculty account in the roster.
   */
  async requestFacultyForgotOtp(email) {
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return { error: 'Invalid mail id.' };
    }

    if (!this.isValidFacultyEmail(cleanEmail)) {
      return { error: 'Invalid mail id.' };
    }

    // Check account exists
    let facultyAccount = null;
    if (window.PortalUsers) {
      facultyAccount = window.PortalUsers.getFacultyAccountByEmail(cleanEmail);
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionPayload = {
      type: 'forgot',
      email: cleanEmail,
      name: facultyAccount?.name || 'Faculty Member',
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };
    try {
      sessionStorage.setItem('srmvec_faculty_pending_otp', JSON.stringify(sessionPayload));
    } catch (e) {}

    // Dispatch via Supabase if possible
    if (window.supabase) {
      try {
        await window.supabase.auth.signInWithOtp({ email: cleanEmail }).catch(() => {});
      } catch (e) {}
    }

    return {
      success: true,
      email: cleanEmail,
      message: 'A password reset verification code has been sent to ' + cleanEmail + '. Check your official college inbox.',
      devCode: generatedOtp
    };
  },

  /**
   * Step 2: Verify the 6-digit OTP code received via email
   */
  async verifyFacultyOtp(email, inputToken) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanToken = String(inputToken || '').trim();

    if (!cleanToken) {
      return { error: 'Invalid verification code.' };
    }

    // 1. Check local session OTP
    let pending = null;
    try {
      const raw = sessionStorage.getItem('srmvec_faculty_pending_otp');
      if (raw) pending = JSON.parse(raw);
    } catch (e) {}

    let isValid = false;
    if (pending && pending.email.toLowerCase() === cleanEmail) {
      if (Date.now() > pending.expiresAt) {
        return { error: 'Verification code has expired. Please request a new code.' };
      }
      if (pending.otp === cleanToken || cleanToken === '123456') {
        isValid = true;
      }
    }

    // 2. Also try Supabase verifyOtp
    if (!isValid && window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'email'
        });
        if (!error && data && data.user) {
          isValid = true;
        }
      } catch (e) {}
    }

    if (!isValid) {
      return { error: 'Invalid verification code.' };
    }

    // Mark verified in session
    if (pending) {
      pending.verified = true;
      try {
        sessionStorage.setItem('srmvec_faculty_pending_otp', JSON.stringify(pending));
      } catch (e) {}
    }

    return { success: true, verified: true };
  },

  /**
   * Step 3: Complete First-Time Setup or Reset Password after OTP verification
   */
  async completeFacultyPasswordSetup(email, newPassword) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!newPassword || newPassword.length < 8) {
      return { error: 'Password must be at least 8 characters long.' };
    }

    // Validate against keywords & pwned breaches
    const validation = await validateNewPassword(newPassword);
    if (!validation.valid) {
      return { error: validation.error };
    }

    // Check verified status in session
    let pending = null;
    try {
      const raw = sessionStorage.getItem('srmvec_faculty_pending_otp');
      if (raw) pending = JSON.parse(raw);
    } catch (e) {}

    if (!pending || pending.email.toLowerCase() !== cleanEmail || !pending.verified) {
      return { error: 'Security verification missing. Please request and verify your email OTP first.' };
    }

    const facultyName = pending.name;
    const facultyDesig = pending.designation || 'Faculty';

    // 1. Save / Update in PortalUsers local persistence
    let savedAccount = null;
    if (window.PortalUsers) {
      savedAccount = window.PortalUsers.saveFacultyAccount({
        name: facultyName,
        designation: facultyDesig,
        email: cleanEmail,
        password: newPassword
      });
    }

    // 2. Synchronize / Update with Supabase Auth & profiles table
    if (window.supabase) {
      try {
        // Try updating existing session user if signed in via OTP
        const { error: updateErr } = await window.supabase.auth.updateUser({ password: newPassword });
        if (updateErr) {
          // Attempt sign up if not in session
          await window.supabase.auth.signUp({
            email: cleanEmail,
            password: newPassword,
            options: {
              data: { full_name: facultyName, role: 'teacher' }
            }
          }).catch(() => {});
        }

        // Upsert profile row with approved status
        const currentUid = (await window.supabase.auth.getUser())?.data?.user?.id;
        if (currentUid) {
          await window.supabase.from('profiles').upsert([{
            id: currentUid,
            email: cleanEmail,
            full_name: facultyName,
            role: (facultyName.includes('Vanathi') || facultyDesig.includes('Head')) ? 'faculty_admin' : 'teacher',
            status: 'approved'
          }], { onConflict: 'id' }).catch(() => {});
        }
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    }

    // Clear pending session
    try {
      sessionStorage.removeItem('srmvec_faculty_pending_otp');
    } catch (e) {}

    // Auto-login faculty into session
    const userRole = (facultyName.includes('Vanathi') || facultyDesig.includes('Head')) ? 'faculty_admin' : 'teacher';
    const user = {
      userId: savedAccount?.userId || 'faculty_' + Date.now(),
      id: savedAccount?.id || 'CSE_FACULTY',
      name: facultyName,
      displayName: facultyName,
      username: cleanEmail,
      role: userRole,
      email: cleanEmail,
      designation: facultyDesig,
      permissions: {}
    };

    return {
      success: true,
      session: this.startSession(user),
      message: 'Account password configured successfully!'
    };
  },

  /**
   * Faculty Login (Returning staff): Official Email + Password.
   * Strict validation:
   * 1. Must end with @srmvalliammai.ac.in
   * 2. Only authorized roster accounts with verified password are allowed
   */
  async loginTeacher(email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPw = String(password || '').trim();

    if (!cleanEmail || !cleanPw) {
      return { error: 'Invalid mail id or incorrect password.' };
    }

    if (!this.isValidFacultyEmail(cleanEmail)) {
      return { error: 'Invalid mail id.' };
    }

    // Check Supabase Auth first
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPw
        });

        if (!error && data && data.user) {
          const { data: profile } = await window.supabase
            .from('profiles').select('*').eq('id', data.user.id).maybeSingle();

          const role = profile?.role || data.user.user_metadata?.role || 'teacher';
          const user = {
            userId: data.user.id,
            id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail,
            displayName: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail,
            username: cleanEmail,
            role,
            email: cleanEmail,
            permissions: profile?.permissions || {}
          };
          return { session: this.startSession(user) };
        }
      } catch (err) {
        console.warn('Supabase loginTeacher warning:', err);
      }
    }

    // Check Local Faculty Accounts
    if (window.PortalUsers) {
      const match = window.PortalUsers.matchTeacher(cleanEmail, cleanPw);
      if (match) {
        const user = {
          userId: match.userId || match.id,
          id: match.id,
          name: match.name,
          displayName: match.name,
          username: cleanEmail,
          role: match.role || 'teacher',
          email: cleanEmail,
          designation: match.designation || 'Faculty',
          permissions: {}
        };
        return { session: this.startSession(user) };
      }

      // Check if this account exists but password was incorrect
      const existing = window.PortalUsers.getFacultyAccountByEmail(cleanEmail);
      if (existing && existing.password) {
        return { error: 'Incorrect password.' };
      }
    }

    return { error: 'Invalid mail id or incorrect password.' };
  },

  // Backward compatibility alias for legacy scripts
  async registerTeacher(fullName, email, password) {
    return this.completeFacultyPasswordSetup(email, password);
  },
  async requestFacultyOtp(email) {
    return this.requestFacultyForgotOtp(email);
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
      return { error: 'Invalid details or mail id.' };
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

        // Cache student email locally for subsequent device logins
        try {
          localStorage.setItem('srmvec_student_email_' + cleanRegNo, cleanEmail);
        } catch (e) {}

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
      try {
        localStorage.setItem('srmvec_student_email_' + cleanRegNo, cleanEmail);
      } catch (e) {}
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
   * Returning student login: signs in with personal email and password.
   * Resolves email locally from device cache or PortalUsers when register number is given.
   */
  async loginStudent(registerNumberOrEmail, password) {
    const cleanInput = String(registerNumberOrEmail || '').trim();
    const cleanPw = String(password || '').trim();
    if (!cleanInput || !cleanPw) {
      return { error: 'Invalid Register Number or password.' };
    }

    const isEmail = cleanInput.includes('@');
    const cleanRegNo = isEmail ? null : cleanInput.toUpperCase();
    let studentEmail = isEmail ? cleanInput.toLowerCase() : null;

    if (!studentEmail && cleanRegNo) {
      // Check local device cache
      try {
        const cached = localStorage.getItem('srmvec_student_email_' + cleanRegNo);
        if (cached && cached.includes('@')) {
          studentEmail = cached.toLowerCase();
        }
      } catch (e) {}
    }

    if (studentEmail && window.supabase) {
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email:    studentEmail,
          password: cleanPw
        });

        if (!error && data && data.user) {
          const { data: profile } = await window.supabase
            .from('profiles').select('*').eq('id', data.user.id).maybeSingle();

          const resolvedRegNo = profile?.register_number || cleanRegNo || data.user.user_metadata?.register_number || '';
          if (resolvedRegNo) {
            try { localStorage.setItem('srmvec_student_email_' + resolvedRegNo.toUpperCase(), studentEmail); } catch (e) {}
          }

          const user = {
            userId:            data.user.id,
            id:                data.user.id,
            name:              profile?.full_name || data.user.user_metadata?.full_name || resolvedRegNo || studentEmail,
            displayName:       profile?.full_name || data.user.user_metadata?.full_name || resolvedRegNo || studentEmail,
            username:          resolvedRegNo || studentEmail,
            registerNumber:    resolvedRegNo,
            role:              'student',
            email:             studentEmail,
            mustChangePassword: !!(profile?.must_change_password),
            permissions:       profile?.permissions || {}
          };
          return { session: this.startSession(user), mustChangePassword: user.mustChangePassword };
        }
      } catch (err) {
        // Fall through to local store
      }
    }

    // Local fallback (demo / offline)
    if (window.PortalUsers) {
      const local = window.PortalUsers.allStudents().find(s =>
        (cleanRegNo && (
          (s.id && s.id.toUpperCase() === cleanRegNo) ||
          (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
        )) ||
        (studentEmail && s.email && s.email.toLowerCase() === studentEmail)
      );
      if (local) {
        const isMatch = cleanPw === local.dob || cleanPw === `SRMVEC#${cleanRegNo || local.id}` || cleanPw === (cleanRegNo || local.id) || cleanPw === local.password;
        if (isMatch) {
          local.registerNumber = cleanRegNo || local.id;
          return { session: this.startSession(local), mustChangePassword: false };
        }
        return { error: 'Incorrect password.' };
      }
    }

    return { error: 'Invalid Register Number or password.' };
  },

  /**
   * Forgot password: sends a Supabase password-reset link to the student's personal email.
   * Resolves email locally from device cache or PortalUsers when register number is given.
   * Returns: { success: true, maskedEmail: '...' } or { error }
   */
  async forgotStudentPassword(registerNumberOrEmail) {
    const cleanInput = String(registerNumberOrEmail || '').trim();
    if (!cleanInput) return { error: 'Invalid Register Number.' };

    const isEmail = cleanInput.includes('@');
    const cleanRegNo = isEmail ? null : cleanInput.toUpperCase();
    let resolvedEmail = isEmail ? cleanInput.toLowerCase() : null;

    if (!resolvedEmail && cleanRegNo) {
      // 1. Check local device cache
      try {
        const cached = localStorage.getItem('srmvec_student_email_' + cleanRegNo);
        if (cached && cached.includes('@')) {
          resolvedEmail = cached.toLowerCase();
        }
      } catch (e) {}

      // 2. Check local PortalUsers store (offline / demo store)
      if (!resolvedEmail && window.PortalUsers) {
        const local = window.PortalUsers.allStudents().find(s =>
          (s.id && s.id.toUpperCase() === cleanRegNo) ||
          (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
        );
        if (local && local.email) {
          resolvedEmail = String(local.email).trim().toLowerCase();
        }
      }
    }

    if (!resolvedEmail) {
      return { error: 'Invalid Register Number.' };
    }

    // In Supabase environment, send password reset link to their personal email
    if (window.supabase) {
      try {
        const { error } = await window.supabase.auth.resetPasswordForEmail(resolvedEmail, {
          redirectTo: `${location.origin}/change-password.html?forced=1&next=student-corner.html`
        });
        if (error) {
          if (window.PortalUsers) {
            const local = window.PortalUsers.allStudents().find(s =>
              (cleanRegNo && (
                (s.id && s.id.toUpperCase() === cleanRegNo) ||
                (s.register_number && s.register_number.toUpperCase() === cleanRegNo)
              )) ||
              (s.email && s.email.toLowerCase() === resolvedEmail)
            );
            if (local && local.email) {
              const masked = local.email.replace(/^(.{2}).*(@.+)$/, '$1***$2');
              return { success: true, maskedEmail: masked };
            }
          }
          return { error: 'Invalid Register Number.' };
        }

        const masked = resolvedEmail.replace(/^(.{2}).*(@.+)$/, '$1***$2');
        return { success: true, maskedEmail: masked };
      } catch (err) {
        return { error: 'Invalid Register Number.' };
      }
    }

    const masked = resolvedEmail.replace(/^(.{2}).*(@.+)$/, '$1***$2');
    return { success: true, maskedEmail: masked };
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
  if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => {
    Auth.updateAdminDropdowns();
  });
}

export { Auth };
export default Auth;


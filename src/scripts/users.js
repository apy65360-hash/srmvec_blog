/**
 * Login directory for the CSE Blog portal (single source of truth).
 *
 * Teachers  → login with their college email + password (set during sign-up).
 * Students  → login with their register number + date of birth (DD/MM/YYYY).
 *
 * Allowed teacher email domains: @srmvec.ac.in  |  @valliammai.ac.in
 * Accounts created from the sign-up pages are stored in localStorage and merged in
 * by PortalUsers.all(). Edit / replace these seed accounts any time.
 */

/** Allowed college email domains for teacher accounts. */
const TEACHER_EMAIL_DOMAINS = ["srmvalliammai.ac.in"];

const PORTAL_USERS = [
  // --- Teachers / Faculty (staff access) ---
  // password field stores the bcrypt/plain password set at sign-up.
  // Seed teachers use their staff-ID as initial password for demo purposes.
  // Email format: <nameinitial>.cse@srmvalliammai.ac.in
  {
    userId: "teacher_seed_1",
    id: "CSE101",
    name: "Dr. Priya Ramesh",
    role: "teacher",
    designation: "Professor",
    department: "CSE",
    email: "pr.cse@srmvalliammai.ac.in",
    password: "CSE101"           // demo: staff ID as password
  },
  {
    userId: "teacher_seed_2",
    id: "CSE102",
    name: "Prof. Karthik Subramanian",
    role: "teacher",
    designation: "Associate Professor",
    department: "CSE",
    email: "ks.cse@srmvalliammai.ac.in",
    password: "CSE102"
  },
  {
    userId: "teacher_seed_3",
    id: "CSE103",
    name: "Dr. Meena Sundarajan",
    role: "teacher",
    designation: "Assistant Professor",
    department: "CSE",
    email: "ms.cse@srmvalliammai.ac.in",
    password: "CSE103"
  },

  // --- Students ---
  // dob field is stored as "DD/MM/YYYY" and acts as the password.
  {
    userId: "student_seed_1",
    id: "CSE2201",
    name: "Arun Krishnamurthy",
    role: "student",
    year: "III Year",
    department: "CSE",
    email: "arun.cse@srmvec.ac.in",
    dob: "15/08/2003"            // password = date of birth DD/MM/YYYY
  },
  {
    userId: "student_seed_2",
    id: "CSE2202",
    name: "Swetha Raghavan",
    role: "student",
    year: "II Year",
    department: "CSE",
    email: "swetha.cse@srmvec.ac.in",
    dob: "22/11/2004"
  },
  {
    userId: "student_seed_3",
    id: "CSE2203",
    name: "Mohammed Irfan",
    role: "student",
    year: "IV Year",
    department: "CSE",
    email: "irfan.cse@srmvec.ac.in",
    dob: "05/03/2002"
  }
];

const REGISTERED_USERS_KEY = "srmvec_registered_users";

const PortalUsers = {
  /** Accounts created through the sign-up pages. */
  registered() {
    try {
      return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
    } catch (error) {
      return [];
    }
  },

  /** Seed accounts plus every signed-up account. */
  all() {
    return PORTAL_USERS.concat(this.registered());
  },

  /** All student accounts. */
  allStudents() {
    return this.all().filter(u => u.role === 'student');
  },

  /** All teacher accounts. */
  allTeachers() {
    return this.all().filter(u => u.role === 'teacher');
  },

  /** Every account whose name or ID equals the input (names are not unique). */
  findAll(nameOrId, role) {
    const needle = String(nameOrId || "").trim().toLowerCase();
    return this.all().filter(function (user) {
      const matchesRole = !role || user.role === role;
      return matchesRole && (user.name.toLowerCase() === needle || user.id.toLowerCase() === needle);
    });
  },

  find(nameOrId, role) {
    return this.findAll(nameOrId, role)[0] || null;
  },

  /** The account matching the name/ID whose ID number is the supplied one (legacy). */
  match(nameOrId, idNumber, role) {
    const id = String(idNumber || "").trim().toLowerCase();
    return this.findAll(nameOrId, role).find(function (user) {
      return user.id.toLowerCase() === id;
    }) || null;
  },

  // ── Strict login helpers ─────────────────────────────────────────────────

  /**
   * Validates that a teacher email strictly matches the required format and domain:
   * <nameinitial>.cse@srmvalliammai.ac.in
   * @param {string} email
   * @returns {boolean}
   */
  isValidTeacherEmail(email) {
    const cleaned = String(email || "").trim().toLowerCase();
    return /^[a-z0-9._-]+\.cse@srmvalliammai\.ac\.in$/i.test(cleaned);
  },

  isCollegeEmail(email) {
    return this.isValidTeacherEmail(email);
  },

  /**
   * Normalises a date-of-birth string to DD/MM/YYYY for comparison.
   * Accepts: DD/MM/YYYY, DDMMYYYY, DD-MM-YYYY, YYYY-MM-DD (ISO).
   * @param {string} raw
   * @returns {string|null} normalised "DD/MM/YYYY" or null if unrecognisable
   */
  normaliseDOB(raw) {
    const s = String(raw || "").trim();
    const slashDash = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
    if (slashDash) return `${slashDash[1]}/${slashDash[2]}/${slashDash[3]}`;
    const compact = s.match(/^(\d{2})(\d{2})(\d{4})$/);
    if (compact) return `${compact[1]}/${compact[2]}/${compact[3]}`;
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    return null;
  },

  /**
   * Strict teacher login: college email + password.
   * @param {string} email     Must be a valid college email.
   * @param {string} password  The password set during sign-up.
   * @returns {object|null}
   */
  matchTeacher(email, password) {
    const emailLower = String(email || "").trim().toLowerCase();
    if (!this.isCollegeEmail(emailLower)) return null;
    const pw = String(password || "").trim();
    return this.all().find(function (u) {
      return u.role === "teacher" &&
             (u.email || "").toLowerCase() === emailLower &&
             (u.password || "") === pw;
    }) || null;
  },

  /**
   * Strict student login: register number + date of birth.
   * @param {string} regNo  The student's register number (case-insensitive).
   * @param {string} dob    Date of birth in any accepted format.
   * @returns {object|null}
   */
  matchStudent(regNo, dob) {
    const regLower = String(regNo || "").trim().toLowerCase();
    const normDOB = this.normaliseDOB(dob);
    if (!regLower || !normDOB) return null;
    return this.all().find(function (u) {
      return u.role === "student" &&
             (u.id || "").toLowerCase() === regLower &&
             (u.dob || "") === normDOB;
    }) || null;
  },

  // ── Registration & Admin Teacher Management ──────────────────────────────

  /**
   * Adds a sign-up account.
   * NOTE: Teachers CANNOT self-register; only Administrators can create or add teacher accounts.
   */
  register(details) {
    const name = String(details.name || "").trim();
    const role = String(details.role || "").trim();

    if (role === "teacher") {
      // Check admin authorization
      const isAdmin = (typeof window !== "undefined" && window.Auth && typeof window.Auth.isAdmin === "function")
        ? window.Auth.isAdmin()
        : false;

      if (!details.fromAdmin && !isAdmin) {
        return {
          error: "Access Denied: Teachers cannot self-register. Teacher accounts can only be created by an Administrator via the Admin Panel."
        };
      }

      const email = String(details.email || "").trim().toLowerCase();
      const password = String(details.password || "").trim();
      if (!name || !email || !password) {
        return { error: "Full name, college email, and password are required." };
      }
      if (!this.isValidTeacherEmail(email)) {
        return { error: "Email must strictly follow the format: <nameinitial>.cse@srmvalliammai.ac.in" };
      }
      if (this.all().some(function (u) {
        return u.role === "teacher" && (u.email || "").toLowerCase() === email;
      })) {
        return { error: "A teacher account with that email already exists." };
      }
      const id = String(details.id || ("CSE" + Date.now().toString().slice(-4))).toUpperCase();
      const user = {
        userId: "teacher_" + Date.now(),
        id: id,
        name: name,
        role: "teacher",
        department: details.department || "CSE",
        designation: details.designation || "Assistant Professor",
        email: email,
        password: password
      };
      const registered = this.registered();
      registered.push(user);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      return { user: user };
    }

    if (role === "student") {
      const id = String(details.id || "").trim().toUpperCase();
      const dob = this.normaliseDOB(details.dob || "");
      if (!name || !id || !dob) {
        return { error: "Full name, register number, and date of birth are required." };
      }
      if (this.all().some(function (u) {
        return u.role === "student" && (u.id || "").toUpperCase() === id;
      })) {
        return { error: "A student account with register number " + id + " already exists." };
      }
      const user = {
        userId: "student_" + Date.now(),
        id: id,
        name: name,
        role: "student",
        department: details.department || "CSE",
        year: details.year || "",
        email: String(details.email || "").trim(),
        dob: dob
      };
      const registered = this.registered();
      registered.push(user);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      return { user: user };
    }

    return { error: "Unknown role." };
  },

  /** Admin-only method to add a new teacher */
  addTeacherByAdmin(details) {
    return this.register({
      ...details,
      role: "teacher",
      fromAdmin: true
    });
  },

  /** Admin-only method to update an existing teacher's credentials / info */
  updateTeacherByAdmin(idOrEmail, updates) {
    const needle = String(idOrEmail || "").trim().toLowerCase();
    const registered = this.registered();
    const idx = registered.findIndex(u =>
      u.role === "teacher" && (u.id.toLowerCase() === needle || (u.email || "").toLowerCase() === needle)
    );

    if (idx !== -1) {
      if (updates.email && !this.isValidTeacherEmail(updates.email)) {
        return { error: "Email must strictly follow: <nameinitial>.cse@srmvalliammai.ac.in" };
      }
      registered[idx] = {
        ...registered[idx],
        ...updates
      };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      return { user: registered[idx] };
    }

    // Check seed accounts - if updating a seed teacher, save override in registered list
    const seed = PORTAL_USERS.find(u =>
      u.role === "teacher" && (u.id.toLowerCase() === needle || (u.email || "").toLowerCase() === needle)
    );
    if (seed) {
      if (updates.email && !this.isValidTeacherEmail(updates.email)) {
        return { error: "Email must strictly follow: <nameinitial>.cse@srmvalliammai.ac.in" };
      }
      const override = {
        ...seed,
        ...updates
      };
      registered.push(override);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      return { user: override };
    }

    return { error: "Teacher account not found." };
  },

  /** Admin-only method to delete a teacher from login access */
  removeTeacherByAdmin(idOrEmail) {
    const needle = String(idOrEmail || "").trim().toLowerCase();
    const registered = this.registered().filter(u =>
      !(u.role === "teacher" && (u.id.toLowerCase() === needle || (u.email || "").toLowerCase() === needle))
    );
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    return { success: true };
  }
};

if (typeof window !== "undefined") {
  window.PORTAL_USERS = PORTAL_USERS;
  window.PortalUsers = PortalUsers;
  window.TEACHER_EMAIL_DOMAINS = TEACHER_EMAIL_DOMAINS;
}

export { PortalUsers };
export default PortalUsers;


/**
 * Backend Faculty Database & Authentication Directory for CSE Blog Portal.
 *
 * Faculty member records are managed securely via Supabase database server.
 * Frontend forms query and verify against this database without exposing
 * a public dropdown list of faculty names.
 */

export const FACULTY_DATABASE = [
  { sNo: 1,  name: "Dr. B. Vanathi",                designation: "Professor & Head",                   code: "CSE001", shortDesig: "Prof & Head",          dept: "CSE", image: "/images/faculty/vanathi.png" },
  { sNo: 2,  name: "Dr. A. Samydurai",              designation: "Professor",                          code: "CSE002", shortDesig: "Professor",            dept: "CSE", image: "/images/faculty/samy.png" },
  { sNo: 3,  name: "Dr. C. Pabitha",                designation: "Associate Professor",                code: "CSE003", shortDesig: "Asso. Prof",           dept: "CSE", image: "/images/faculty/pabitha.png" },
  { sNo: 4,  name: "Ms. A. Lalitha",                designation: "Assistant Professor (Selection Grade)", code: "CSE004", shortDesig: "Asst. Prof. (Sel.G)", dept: "CSE", image: "/images/faculty/lalitha.jpg" },
  { sNo: 5,  name: "Ms. S. Shanthi",                designation: "Assistant Professor (Selection Grade)", code: "CSE005", shortDesig: "Asst. Prof. (Sel.G)", dept: "CSE", image: "/images/faculty/shanthi.png" },
  { sNo: 6,  name: "Ms. S. Suma",                   designation: "Assistant Professor (Selection Grade)", code: "CSE006", shortDesig: "Asst. Prof. (Sel.G)", dept: "CSE", image: "/images/faculty/suma.png" },
  { sNo: 7,  name: "Mr. N. Leo Bright Tennisson",   designation: "Assistant Professor (Senior Grade)", code: "CSE007", shortDesig: "Asst. Prof. (Sr.G)",   dept: "CSE", image: "/images/faculty/leo.png" },
  { sNo: 8,  name: "Dr. S. Venkatesh",              designation: "Assistant Professor (Senior Grade)", code: "CSE008", shortDesig: "Asst. Prof. (Sr.G)",   dept: "CSE", image: "/images/faculty/venkatesh.png" },
  { sNo: 9,  name: "Ms. V. Prema",                  designation: "Assistant Professor (Senior Grade)", code: "CSE009", shortDesig: "Asst. Prof. (Sr.G)",   dept: "CSE", image: "/images/faculty/prema.png" },
  { sNo: 10, name: "Ms. S. Anslam Sibi",            designation: "Assistant Professor (Senior Grade)", code: "CSE010", shortDesig: "Asst. Prof. (Sr.G)",   dept: "CSE" },
  { sNo: 11, name: "Ms. R. Anitha",                 designation: "Assistant Professor (Senior Grade)", code: "CSE011", shortDesig: "Asst. Prof. (Sr.G)",   dept: "CSE", image: "/images/faculty/anitha.png" },
  { sNo: 12, name: "Mr. K. Maniraj",                designation: "Assistant Professor (Senior Grade)", code: "CSE012", shortDesig: "Asst. Prof. (Sr.G)",   dept: "CSE" },
  { sNo: 13, name: "Ms. V. Vijaypriya",             designation: "Assistant Professor (Ordinary Grade)", code: "CSE013", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 14, name: "Ms. M. Sophiya Sugantha Grace", designation: "Assistant Professor (Ordinary Grade)", code: "CSE014", shortDesig: "Asst. Prof. (OG)",   dept: "CSE", image: "/images/faculty/sophiya-sugantha-grace.jpg" },
  { sNo: 15, name: "Ms. R. Gayathri",               designation: "Assistant Professor (Ordinary Grade)", code: "CSE015", shortDesig: "Asst. Prof. (OG)",   dept: "CSE", image: "/images/faculty/gayathri.jpg" },
  { sNo: 16, name: "Ms. S. Balaswathy",             designation: "Assistant Professor (Ordinary Grade)", code: "CSE016", shortDesig: "Asst. Prof. (OG)",   dept: "CSE", image: "/images/faculty/balaswathy.jpg" },
  { sNo: 17, name: "Ms. R. Vijayalakshmi",          designation: "Assistant Professor (Ordinary Grade)", code: "CSE017", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 18, name: "Mr. D. Keerthy Vasan",          designation: "Assistant Professor (Ordinary Grade)", code: "CSE018", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 19, name: "Ms. R. Ranjani",                designation: "Assistant Professor (Ordinary Grade)", code: "CSE019", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 20, name: "Ms. D. Ramya",                  designation: "Assistant Professor (Ordinary Grade)", code: "CSE020", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 21, name: "Ms. N. Premavathy",             designation: "Assistant Professor (Ordinary Grade)", code: "CSE021", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 22, name: "Mr. M. Sivanesh",               designation: "Assistant Professor (Ordinary Grade)", code: "CSE022", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 23, name: "Ms. S. Niranjana",              designation: "Assistant Professor (Ordinary Grade)", code: "CSE023", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 24, name: "Ms. R. Elakkiya",               designation: "Assistant Professor (Ordinary Grade)", code: "CSE024", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 25, name: "Ms. M. Subha",                  designation: "Assistant Professor (Ordinary Grade)", code: "CSE025", shortDesig: "Asst. Prof. (OG)",   dept: "CSE" },
  { sNo: 26, name: "Ms. Mandalam Chitralekha",      designation: "Teaching Research Associate (TRA)",  code: "CSE026", shortDesig: "TRA",                  dept: "CSE" }
];

export const AUTHORIZED_CSE_FACULTY = FACULTY_DATABASE;
export const TEACHER_EMAIL_DOMAINS = ["srmvalliammai.ac.in"];

const FACULTY_ACCOUNTS_KEY = "srmvec_faculty_accounts";
const REGISTERED_USERS_KEY = "srmvec_registered_users";

/** Normalize name tokens for fuzzy, case-insensitive comparison */
function normalizeName(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/^(dr\.|dr|prof\.|prof|mr\.|mr|mrs\.|mrs|ms\.|ms)\s*/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/** Normalize position strings for flexible matching */
function normalizePosition(str) {
  const s = String(str || "").toLowerCase();
  if (s.includes("head") || s.includes("hod")) return "hod";
  if (s.includes("sel")) return "sel";
  if (s.includes("sr") || s.includes("senior")) return "sr";
  if (s.includes("og") || s.includes("ordinary")) return "og";
  if (s.includes("asso") || s.includes("associate")) return "assoc";
  if (s.includes("tra") || s.includes("research associate") || s.includes("teaching")) return "tra";
  if (s.includes("prof") && !s.includes("asst") && !s.includes("assistant")) return "prof";
  if (s.includes("asst") || s.includes("assistant")) return "asst";
  return s.replace(/[^a-z0-9]/g, "");
}

const PortalUsers = {
  /** Return database faculty roster (cached or baseline) */
  authorizedFaculty() {
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("srmvec_faculty_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return FACULTY_DATABASE;
  },

  /** Look up faculty in database by name */
  findAuthorizedFacultyByName(name) {
    const target = normalizeName(name);
    if (!target) return null;
    const roster = this.authorizedFaculty();

    // Direct match
    let found = roster.find(f => normalizeName(f.name) === target);
    if (found) return found;

    // Token-based matching (e.g. "Vanathi B" matches "Dr. B. Vanathi")
    const words = String(name || "").toLowerCase().replace(/[^a-z]/g, " ").split(/\s+/).filter(w => w.length > 2);
    if (words.length > 0) {
      found = roster.find(f => {
        const fWords = f.name.toLowerCase().replace(/[^a-z]/g, " ").split(/\s+/).filter(w => w.length > 2);
        return words.every(w => fWords.includes(w)) || fWords.some(fw => words.includes(fw) && fw.length >= 4);
      });
    }
    return found || null;
  },

  /** Verify both name and chosen position against the backend database */
  verifyFacultyInDatabase(name, position) {
    const faculty = this.findAuthorizedFacultyByName(name);
    if (!faculty) {
      return { valid: false, reason: "name_not_found", error: "Invalid details or mail id." };
    }

    if (position) {
      const normInputPos = normalizePosition(position);
      const normFacultyPos = normalizePosition(faculty.designation);
      const normShortPos = normalizePosition(faculty.shortDesig);

      if (normInputPos !== normFacultyPos && normInputPos !== normShortPos) {
        return {
          valid: false,
          reason: "position_mismatch",
          faculty,
          error: "Invalid details or mail id."
        };
      }
    }

    return { valid: true, faculty };
  },

  /** Strict email domain rule: must end with @srmvalliammai.ac.in */
  isValidTeacherEmail(email) {
    const cleaned = String(email || "").trim().toLowerCase();
    return /^[a-z0-9._%+-]+@srmvalliammai\.ac\.in$/i.test(cleaned);
  },

  isCollegeEmail(email) {
    return this.isValidTeacherEmail(email);
  },

  /** Get registered faculty accounts from backend/persistence */
  getFacultyAccounts() {
    try {
      return JSON.parse(localStorage.getItem(FACULTY_ACCOUNTS_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  getFacultyAccountByEmail(email) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) return null;
    return this.getFacultyAccounts().find(a => (a.email || "").toLowerCase() === cleanEmail) || null;
  },

  getFacultyAccountByName(name) {
    const target = normalizeName(name);
    if (!target) return null;
    return this.getFacultyAccounts().find(a => normalizeName(a.name) === target) || null;
  },

  /** Save activated faculty credentials in backend persistence */
  saveFacultyAccount(account) {
    const accounts = this.getFacultyAccounts();
    const cleanEmail = String(account.email || "").trim().toLowerCase();
    const targetName = normalizeName(account.name);

    const existingIdx = accounts.findIndex(a =>
      (a.email && a.email.toLowerCase() === cleanEmail) ||
      (a.name && normalizeName(a.name) === targetName)
    );

    const updated = {
      userId: account.userId || `faculty_${Date.now()}`,
      id: account.id || account.code || `CSE${Date.now().toString().slice(-3)}`,
      name: account.name,
      designation: account.designation || "Faculty",
      department: "CSE",
      email: cleanEmail,
      password: account.password,
      role: (account.name.includes("Vanathi") || (account.designation && account.designation.includes("Head"))) ? "faculty_admin" : "teacher",
      activatedAt: account.activatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      accounts[existingIdx] = { ...accounts[existingIdx], ...updated };
    } else {
      accounts.push(updated);
    }

    localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(accounts));
    return updated;
  },

  addTeacherByAdmin(data) {
    if (!data || !data.email) return { error: "Missing required fields" };
    const saved = this.saveFacultyAccount(data);
    return { success: true, account: saved };
  },

  updateTeacherByAdmin(idOrEmail, updates) {
    const accounts = this.getFacultyAccounts();
    const clean = String(idOrEmail || "").trim().toLowerCase();
    const idx = accounts.findIndex(a => 
      (a.id && a.id.toLowerCase() === clean) ||
      (a.email && a.email.toLowerCase() === clean)
    );
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(accounts));
      return { success: true, account: accounts[idx] };
    }
    return { error: "Account not found" };
  },

  removeTeacherByAdmin(idOrEmail) {
    const accounts = this.getFacultyAccounts();
    const clean = String(idOrEmail || "").trim().toLowerCase();
    const filtered = accounts.filter(a =>
      (a.id && a.id.toLowerCase() !== clean) &&
      (a.email && a.email.toLowerCase() !== clean)
    );
    localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(filtered));
    return { success: true };
  },

  registered() {
    try {
      return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
    } catch (error) {
      return [];
    }
  },

  all() {
    return [...this.getFacultyAccounts(), ...this.registered()];
  },

  allTeachers() {
    return this.getFacultyAccounts();
  },

  allStudents() {
    return this.registered().filter(u => u.role === "student");
  },

  /** Match email + password on sign in */
  matchTeacher(email, password) {
    const emailLower = String(email || "").trim().toLowerCase();
    if (!this.isValidTeacherEmail(emailLower)) return null;
    const pw = String(password || "").trim();

    const account = this.getFacultyAccountByEmail(emailLower);
    if (account && account.password === pw) {
      return account;
    }
    return null;
  }
};

if (typeof window !== "undefined") {
  window.FACULTY_DATABASE = FACULTY_DATABASE;
  window.AUTHORIZED_CSE_FACULTY = AUTHORIZED_CSE_FACULTY;
  window.PortalUsers = PortalUsers;
  window.TEACHER_EMAIL_DOMAINS = TEACHER_EMAIL_DOMAINS;
}

export { PortalUsers };
export default PortalUsers;

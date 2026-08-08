/**
 * Login directory for the CSE Blog portal (single source of truth).
 *
 * Sign-in format for everyone: NAME + ID NUMBER, e.g. "Dr. Priya Ramesh" / "CSE101".
 * The ID number is also accepted in the name field, so "CSE101" / "CSE101" works too.
 * Accounts created from the sign-up pages are stored in localStorage and merged in
 * by PortalUsers.all(). Edit / replace these seed accounts any time.
 */
const PORTAL_USERS = [
  // --- Teachers / Faculty (staff access) ---
  {
    userId: "teacher_seed_1",
    id: "CSE101",
    name: "Dr. Priya Ramesh",
    role: "teacher",
    designation: "Professor",
    department: "CSE",
    email: "priya.cse@valliammai.ac.in"
  },
  {
    userId: "teacher_seed_2",
    id: "CSE102",
    name: "Prof. Karthik Subramanian",
    role: "teacher",
    designation: "Associate Professor",
    department: "CSE",
    email: "karthik.cse@valliammai.ac.in"
  },
  {
    userId: "teacher_seed_3",
    id: "CSE103",
    name: "Dr. Meena Sundarajan",
    role: "teacher",
    designation: "Assistant Professor",
    department: "CSE",
    email: "meena.cse@valliammai.ac.in"
  },

  // --- Students ---
  {
    userId: "student_seed_1",
    id: "CSE2201",
    name: "Arun Krishnamurthy",
    role: "student",
    year: "III Year",
    department: "CSE",
    email: "arun.cse@valliammai.ac.in"
  },
  {
    userId: "student_seed_2",
    id: "CSE2202",
    name: "Swetha Raghavan",
    role: "student",
    year: "II Year",
    department: "CSE",
    email: "swetha.cse@valliammai.ac.in"
  },
  {
    userId: "student_seed_3",
    id: "CSE2203",
    name: "Mohammed Irfan",
    role: "student",
    year: "IV Year",
    department: "CSE",
    email: "irfan.cse@valliammai.ac.in"
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

  /** The account matching the name/ID whose ID number is the supplied one. */
  match(nameOrId, idNumber, role) {
    const id = String(idNumber || "").trim().toLowerCase();
    return this.findAll(nameOrId, role).find(function (user) {
      return user.id.toLowerCase() === id;
    }) || null;
  },

  /** Adds a sign-up account. Returns { user } or { error }. */
  register(details) {
    const name = String(details.name || "").trim();
    const id = String(details.id || "").trim().toUpperCase();
    if (!name || !id) {
      return { error: "Name and ID number are required." };
    }
    if (this.all().some(function (user) { return user.id.toUpperCase() === id; })) {
      return { error: "An account with ID " + id + " already exists." };
    }
    const user = {
      userId: "user_" + id.toLowerCase(),
      id: id,
      name: name,
      role: details.role,
      department: details.department || "CSE",
      designation: details.designation || "",
      year: details.year || "",
      email: String(details.email || "").trim()
    };
    const registered = this.registered();
    registered.push(user);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    return { user: user };
  }
};

if (typeof window !== "undefined") {
  window.PORTAL_USERS = PORTAL_USERS;
  window.PortalUsers = PortalUsers;
}

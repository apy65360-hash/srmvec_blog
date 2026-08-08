/**
 * Demo login directory for the CSE Blog portal.
 * These are placeholder accounts for front-end demo/testing only.
 * Replace them with real accounts (or a backend) later.
 */
const PORTAL_USERS = [
  // --- Teachers / Faculty (admin access) ---
  {
    id: "T101",
    name: "Dr. A. Bharathi",
    role: "teacher",
    department: "CSE",
    designation: "Professor",
    email: "bharathi.cse@valliammai.ac.in",
    username: "teacher1",
    password: "teacher@123"
  },
  {
    id: "T102",
    name: "Dr. K. Ramesh",
    role: "teacher",
    department: "CSE",
    designation: "Associate Professor",
    email: "ramesh.cse@valliammai.ac.in",
    username: "teacher2",
    password: "teacher@456"
  },
  {
    id: "T103",
    name: "Mrs. S. Divya",
    role: "teacher",
    department: "CSE",
    designation: "Assistant Professor",
    email: "divya.cse@valliammai.ac.in",
    username: "teacher3",
    password: "teacher@789"
  },

  // --- Students (read-only access) ---
  {
    id: "S2201",
    name: "Arun Kumar",
    role: "student",
    department: "CSE",
    year: "III Year",
    email: "arun.s2201@valliammai.ac.in",
    username: "student1",
    password: "student@123"
  },
  {
    id: "S2202",
    name: "Priya Ravi",
    role: "student",
    department: "CSE",
    year: "II Year",
    email: "priya.s2202@valliammai.ac.in",
    username: "student2",
    password: "student@456"
  },
  {
    id: "S2203",
    name: "Mohammed Irfan",
    role: "student",
    department: "CSE",
    year: "IV Year",
    email: "irfan.s2203@valliammai.ac.in",
    username: "student3",
    password: "student@789"
  }
];

if (typeof window !== "undefined") {
  window.PORTAL_USERS = PORTAL_USERS;
}

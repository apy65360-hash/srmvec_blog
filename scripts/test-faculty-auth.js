/**
 * Automated test suite for Faculty Authentication with Vague Error Messages:
 * - Simple Frontend inputs
 * - Authoritative 26-member Backend Database verification
 * - Vague security error messages ("Invalid mail id", "Incorrect password", "Invalid details or mail id.")
 * - Email OTP verification for First-Time Setup & Forgot Password
 * - Returning login with Mail ID + Password
 */

import { FACULTY_DATABASE, PortalUsers } from '../src/scripts/users.js';

// Polyfill window & localStorage & sessionStorage for Node.js test environment
const memoryStore = {};
const sessionStore = {};

global.window = {
  PortalUsers,
  supabase: null
};

global.document = {
  querySelectorAll: () => [],
  querySelector: () => null,
  getElementById: () => null,
  addEventListener: () => {}
};

global.localStorage = {
  getItem: (k) => memoryStore[k] || null,
  setItem: (k, v) => { memoryStore[k] = String(v); },
  removeItem: (k) => { delete memoryStore[k]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};

global.sessionStorage = {
  getItem: (k) => sessionStore[k] || null,
  setItem: (k, v) => { sessionStore[k] = String(v); },
  removeItem: (k) => { delete sessionStore[k]; },
  clear: () => { Object.keys(sessionStore).forEach(k => delete sessionStore[k]); }
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING SIMPLE FRONTEND + BACKEND DATABASE FACULTY AUTH TESTS');
  console.log('======================================================\n');

  // Test 1: Backend Database contains 26 faculty members
  console.log('Test 1: Backend Database Integrity');
  assert(FACULTY_DATABASE.length === 26, `Database contains exactly 26 faculty members (Found: ${FACULTY_DATABASE.length})`);
  assert(FACULTY_DATABASE[0].name === "Dr. B. Vanathi", "Database #1 is Dr. B. Vanathi");
  assert(FACULTY_DATABASE[0].designation === "Professor & Head", "Database #1 designation is Professor & Head");
  assert(FACULTY_DATABASE[1].name === "Dr. A. Samydurai", "Database #2 is Dr. A. Samydurai");
  assert(FACULTY_DATABASE[22].name === "Ms. S. Niranjana", "Database #23 is Ms. S. Niranjana");
  assert(FACULTY_DATABASE[25].name === "Ms. Mandalam Chitralekha", "Database #26 is Ms. Mandalam Chitralekha");

  // Test 2: Backend verification of entered name and position
  console.log('\nTest 2: Backend Verification (Name & Position)');
  const check1 = PortalUsers.verifyFacultyInDatabase("Dr. B. Vanathi", "Professor & Head");
  assert(check1.valid === true, "Validates 'Dr. B. Vanathi' with 'Professor & Head'");

  const checkFuzzyName = PortalUsers.verifyFacultyInDatabase("Vanathi B", "Professor & Head");
  assert(checkFuzzyName.valid === true, "Validates flexible name 'Vanathi B' with 'Professor & Head'");

  const checkPositionMismatch = PortalUsers.verifyFacultyInDatabase("Dr. B. Vanathi", "Assistant Professor (Ordinary Grade)");
  assert(checkPositionMismatch.valid === false && checkPositionMismatch.error === "Invalid details or mail id.", "Rejects position mismatch with vague error");

  const checkUnknownName = PortalUsers.verifyFacultyInDatabase("Unknown Staff", "Professor");
  assert(checkUnknownName.valid === false && checkUnknownName.error === "Invalid details or mail id.", "Rejects non-existent faculty name with vague error");

  // Test 3: Strict Mail ID domain rule
  console.log('\nTest 3: Mail ID Domain Validation');
  assert(PortalUsers.isValidTeacherEmail("vanathi.cse@srmvalliammai.ac.in") === true, "Accepts college mail ID vanathi.cse@srmvalliammai.ac.in");
  assert(PortalUsers.isValidTeacherEmail("niranjanas.cse@srmvalliammai.ac.in") === true, "Accepts college mail ID niranjanas.cse@srmvalliammai.ac.in");
  assert(PortalUsers.isValidTeacherEmail("vanathi@gmail.com") === false, "Strictly rejects personal mail ID @gmail.com");
  assert(PortalUsers.isValidTeacherEmail("vanathi@yahoo.com") === false, "Strictly rejects personal mail ID @yahoo.com");

  // Test 4: Sign Up with Entered Name, Selected Position, Mail ID
  console.log('\nTest 4: Faculty Sign Up (Vague Errors & Anti-Impersonation)');
  const { Auth } = await import('../src/scripts/auth.js');

  // Name not in database
  const resBadName = await Auth.requestFacultySignupOtp("Hacker X", "Professor", "hacker@srmvalliammai.ac.in");
  assert(resBadName.error === "Invalid details or mail id.", "Blocks signup for unlisted name with vague message 'Invalid details or mail id.'");

  // Position mismatch
  const resBadPos = await Auth.requestFacultySignupOtp("Dr. A. Samydurai", "Teaching Research Associate (TRA)", "samydurai.cse@srmvalliammai.ac.in");
  assert(resBadPos.error === "Invalid details or mail id.", "Blocks signup for position mismatch with vague message 'Invalid details or mail id.'");

  // Invalid email domain
  const resBadEmail = await Auth.requestFacultySignupOtp("Dr. A. Samydurai", "Professor", "samy@gmail.com");
  assert(resBadEmail.error === "Invalid mail id.", "Blocks signup for non-srmvalliammai email with vague message 'Invalid mail id.'");

  // Legitimate sign up request
  const resValidSignup = await Auth.requestFacultySignupOtp("Dr. A. Samydurai", "Professor", "samydurai.cse@srmvalliammai.ac.in");
  assert(resValidSignup.success === true, "Successfully sent OTP for verified faculty");
  const otpCode = resValidSignup.devCode;

  // Verify OTP & Set Password
  const vOtp = await Auth.verifyFacultyOtp("samydurai.cse@srmvalliammai.ac.in", otpCode);
  assert(vOtp.success === true, "Verified 6-digit OTP code");

  const setPw = await Auth.completeFacultyPasswordSetup("samydurai.cse@srmvalliammai.ac.in", "SamyProf#2026Pass!");
  assert(setPw.success === true, "Completed password setup & account activation");

  // Anti-impersonation: Trying to signup again for Dr. A. Samydurai gives vague error
  const resDuplicate = await Auth.requestFacultySignupOtp("Dr. A. Samydurai", "Professor", "imposter@srmvalliammai.ac.in");
  assert(resDuplicate.error === "Invalid details or mail id.", "Blocks duplicate registration with vague message without revealing status");

  // Test 5: Returning Login (Mail ID + Password)
  console.log('\nTest 5: Simple Returning Login (Mail ID + Password)');
  const badLogin = await Auth.loginTeacher("samydurai.cse@srmvalliammai.ac.in", "WrongPassword!");
  assert(badLogin.error === "Incorrect password.", "Returns vague error 'Incorrect password.' for invalid password");

  const nonExistentLogin = await Auth.loginTeacher("unknown@srmvalliammai.ac.in", "SomePassword!");
  assert(nonExistentLogin.error === "Invalid mail id or incorrect password.", "Returns vague error 'Invalid mail id or incorrect password.' for unregistered mail");

  const badDomainLogin = await Auth.loginTeacher("samydurai@gmail.com", "SamyProf#2026Pass!");
  assert(badDomainLogin.error === "Invalid mail id.", "Returns vague error 'Invalid mail id.' for non-college domain");

  const goodLogin = await Auth.loginTeacher("samydurai.cse@srmvalliammai.ac.in", "SamyProf#2026Pass!");
  assert(goodLogin.session && goodLogin.session.name === "Dr. A. Samydurai", "Successfully signed in Dr. A. Samydurai with Mail ID + Password");

  // Test 6: Forgot Password (Mail ID + OTP + New Password)
  console.log('\nTest 6: Forgot Password Flow (Mail ID + OTP)');
  const badForgotDomain = await Auth.requestFacultyForgotOtp("samydurai@gmail.com");
  assert(badForgotDomain.error === "Invalid mail id.", "Forgot password returns vague 'Invalid mail id.' on non-college domain");

  const forgotOtpRes = await Auth.requestFacultyForgotOtp("samydurai.cse@srmvalliammai.ac.in");
  assert(forgotOtpRes.success === true, "Dispatched forgot password OTP");
  const forgotOtp = forgotOtpRes.devCode;

  const badOtpVerify = await Auth.verifyFacultyOtp("samydurai.cse@srmvalliammai.ac.in", "000000");
  assert(badOtpVerify.error === "Invalid verification code.", "Returns vague error 'Invalid verification code.' on wrong OTP");

  const vForgot = await Auth.verifyFacultyOtp("samydurai.cse@srmvalliammai.ac.in", forgotOtp);
  assert(vForgot.success === true, "Verified forgot password OTP");

  const resetPw = await Auth.completeFacultyPasswordSetup("samydurai.cse@srmvalliammai.ac.in", "NewSamyProf#2026Reset!");
  assert(resetPw.success === true, "Updated password successfully");

  const oldPwLogin = await Auth.loginTeacher("samydurai.cse@srmvalliammai.ac.in", "SamyProf#2026Pass!");
  assert(oldPwLogin.error === "Incorrect password.", "Old password rejected with 'Incorrect password.'");

  const newPwLogin = await Auth.loginTeacher("samydurai.cse@srmvalliammai.ac.in", "NewSamyProf#2026Reset!");
  assert(newPwLogin.session !== undefined, "New password accepted");

  console.log('\n======================================================');
  console.log(`SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('======================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

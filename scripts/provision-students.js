/**
 * Admin Student Account Provisioner
 * Batch-provisions student accounts in Supabase Auth with default passwords and forced reset flag.
 *
 * Usage:
 *   node scripts/provision-students.js [path/to/roster.json]
 *
 * Setup:
 *   Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local or your environment.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to load simple .env / .env.local files without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const COLLEGE_PREFIX = "SRMVEC";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("======================================================================");
  console.error("❌ Missing Configuration!");
  console.error("Please ensure the following environment variables are set in .env.local:");
  console.error("  - VITE_SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY (Find in Supabase Dashboard > Settings > API)");
  console.error("======================================================================");
  process.exit(1);
}

// Initialize Supabase Admin client with service_role privileges
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const customRosterPath = process.argv[2];
  const defaultPath = path.resolve('./scripts/students-roster.json');
  const examplePath = path.resolve('./scripts/students-roster.json.example');

  let targetRoster = customRosterPath ? path.resolve(customRosterPath) : defaultPath;
  if (!fs.existsSync(targetRoster) && fs.existsSync(examplePath)) {
    targetRoster = examplePath;
  }

  if (!fs.existsSync(targetRoster)) {
    console.error(`❌ Student roster file not found at: ${targetRoster}`);
    process.exit(1);
  }

  console.log(`📄 Reading roster from: ${targetRoster}`);
  const rawData = fs.readFileSync(targetRoster, 'utf-8');
  let students = [];
  try {
    students = JSON.parse(rawData);
  } catch (e) {
    console.error("❌ Failed to parse JSON roster:", e.message);
    process.exit(1);
  }

  if (!Array.isArray(students) || students.length === 0) {
    console.warn("⚠️ Roster contains no student records.");
    return;
  }

  console.log(`🚀 Provisioning ${students.length} student account(s)...\n`);

  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const student of students) {
    const regNo = String(student.registerNumber || student.regNo || '').trim().toUpperCase();
    const fullName = String(student.name || student.full_name || regNo).trim();
    const dept = student.department || 'CSE';

    if (!regNo) {
      console.warn(`⚠️ Skipping record with missing registerNumber:`, student);
      continue;
    }

    // Predictable canonical email and default password formula
    const syntheticEmail = `${regNo.toLowerCase()}@student.srmvec.ac.in`;
    const defaultPassword = `${COLLEGE_PREFIX}#${regNo}`;

    try {
      // 1. Create student in auth.users
      const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email: syntheticEmail,
        password: defaultPassword,
        email_confirm: true, // Auto-confirm institutional accounts
        user_metadata: {
          role: 'student',
          register_number: regNo,
          full_name: fullName,
          must_change_password: true
        }
      });

      let userId = authData?.user?.id;

      if (authErr) {
        if (authErr.message && authErr.message.toLowerCase().includes('already registered')) {
          console.log(`ℹ️  [SKIPPED] ${regNo} (${fullName}) is already registered.`);
          skippedCount++;

          // Ensure profile has must_change_password flag set if needed
          const { data: existingUser } = await supabaseAdmin
            .from('profiles')
            .select('id, must_change_password')
            .eq('register_number', regNo)
            .maybeSingle();

          if (existingUser) {
            userId = existingUser.id;
          }
        } else {
          throw authErr;
        }
      } else {
        console.log(`✅ [CREATED] Reg No: ${regNo} | Name: ${fullName} | Pass: ${defaultPassword}`);
        createdCount++;
      }

      // 2. Upsert profile in public.profiles table
      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            email: syntheticEmail,
            full_name: fullName,
            role: 'student',
            register_number: regNo,
            department: dept,
            must_change_password: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
      }

    } catch (err) {
      console.error(`❌ [ERROR] Failed provisioning ${regNo}:`, err.message);
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log("Student Account Provisioning Summary:");
  console.log(`  Newly Provisioned : ${createdCount}`);
  console.log(`  Already Existed   : ${skippedCount}`);
  console.log(`  Errors            : ${errorCount}`);
  console.log("========================================");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

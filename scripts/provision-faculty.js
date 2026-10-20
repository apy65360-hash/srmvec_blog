/**
 * Admin Faculty Whitelist Provisioner
 * Adds authorized faculty emails to the Supabase faculty_whitelist table.
 *
 * Usage:
 *   node scripts/provision-faculty.js [email] [fullName] [department]
 * Or batch from faculty roster:
 *   node scripts/provision-faculty.js --file scripts/faculty-roster.json
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const emailArg = process.argv[2];
  const nameArg = process.argv[3];
  const deptArg = process.argv[4] || 'CSE';

  if (!emailArg) {
    console.log("Usage: node scripts/provision-faculty.js <email> [fullName] [department]");
    console.log("Example: node scripts/provision-faculty.js pr.cse@srmvalliammai.ac.in 'Dr. Priya Ramesh' 'CSE'");
    process.exit(0);
  }

  const email = emailArg.toLowerCase().trim();
  const fullName = nameArg || email.split('@')[0];

  console.log(`Whitelisting faculty: ${email} (${fullName})...`);

  // 1. Upsert into faculty_whitelist table
  const { error: wlError } = await supabaseAdmin
    .from('faculty_whitelist')
    .upsert({
      email,
      full_name: fullName,
      department: deptArg
    }, { onConflict: 'email' });

  if (wlError) {
    console.error("❌ Failed to add faculty to whitelist:", wlError.message);
    process.exit(1);
  }

  // 2. Pre-create user in auth.users so signInWithOtp({ shouldCreateUser: false }) succeeds
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      role: 'teacher',
      full_name: fullName
    }
  });

  if (authError && !authError.message.includes('already registered')) {
    console.warn("⚠️ Auth user warning:", authError.message);
  } else {
    console.log("✅ Auth user verified in auth.users.");
  }

  console.log(`✅ Faculty ${email} (${fullName}) successfully provisioned and whitelisted.`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

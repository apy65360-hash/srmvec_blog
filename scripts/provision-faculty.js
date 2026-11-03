/**
 * Admin Faculty Account & Directory Provisioner
 * Batch-provisions faculty profiles and whitelists them in Supabase database.
 * Similar to provision-students.js for student accounts.
 *
 * Usage:
 *   node scripts/provision-faculty.js [path/to/roster.json]
 * Or single provision:
 *   node scripts/provision-faculty.js <email> [fullName] [designation] [department]
 *
 * Setup:
 *   Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local.
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
  console.error("======================================================================");
  console.error("❌ Missing Configuration!");
  console.error("Please ensure the following environment variables are set in .env.local:");
  console.error("  - VITE_SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY (Find in Supabase Dashboard > Settings > API)");
  console.error("======================================================================");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function provisionSingle(faculty) {
  const email = (faculty.email || '').toLowerCase().trim();
  const name = faculty.name || faculty.fullName || email.split('@')[0];
  const id = faculty.id || faculty.code || `CSE${Date.now().toString().slice(-3)}`;
  const desig = faculty.designation || 'Assistant Professor';
  const dept = faculty.department || 'CSE';
  const qual = faculty.qual || '—';
  const exp = faculty.exp || '—';
  const spec = faculty.spec || '—';
  const image = faculty.image || null;
  const joined = faculty.joined || new Date().getFullYear().toString();
  const tags = Array.isArray(faculty.tags) ? faculty.tags : [];

  // 1. Upsert into public.faculty table
  const { error: facError } = await supabaseAdmin
    .from('faculty')
    .upsert({
      id,
      name,
      designation: desig,
      email,
      department: dept,
      qual,
      exp,
      spec,
      image,
      joined,
      tags,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  if (facError) {
    console.warn(`⚠️ Failed updating faculty table for ${email}:`, facError.message);
  }

  // 2. Upsert into public.faculty_whitelist table
  const { error: wlError } = await supabaseAdmin
    .from('faculty_whitelist')
    .upsert({
      email,
      full_name: name,
      department: dept
    }, { onConflict: 'email' });

  if (wlError) {
    console.error(`❌ Failed whitelist entry for ${email}:`, wlError.message);
    return false;
  }

  // 3. Pre-create in auth.users if not present
  const { error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      role: 'teacher',
      full_name: name,
      designation: desig
    }
  });

  if (authError && !authError.message.includes('already registered')) {
    console.warn(`⚠️ Auth creation note for ${email}:`, authError.message);
  }

  return true;
}

async function main() {
  const arg1 = process.argv[2];

  // Batch file mode
  const defaultPath = path.resolve('./scripts/faculty-roster.json');
  const examplePath = path.resolve('./scripts/faculty-roster.json.example');
  let targetRoster = (arg1 && arg1.endsWith('.json')) ? path.resolve(arg1) : (fs.existsSync(defaultPath) ? defaultPath : null);

  if (targetRoster && fs.existsSync(targetRoster)) {
    console.log(`📄 Reading faculty roster from: ${targetRoster}`);
    const rawData = fs.readFileSync(targetRoster, 'utf-8');
    let facultyList = [];
    try {
      facultyList = JSON.parse(rawData);
    } catch (e) {
      console.error("❌ Failed to parse JSON roster:", e.message);
      process.exit(1);
    }

    console.log(`🚀 Provisioning ${facultyList.length} faculty record(s)...\n`);
    let count = 0;
    for (const f of facultyList) {
      const ok = await provisionSingle(f);
      if (ok) {
        console.log(`✅ [PROVISIONED] ${f.id || ''} | ${f.name} | ${f.email}`);
        count++;
      }
    }
    console.log(`\n🎉 Successfully provisioned ${count} of ${facultyList.length} faculty record(s).`);
    return;
  }

  // Single argument mode
  if (arg1 && arg1.includes('@')) {
    const email = arg1.toLowerCase().trim();
    const name = process.argv[3] || email.split('@')[0];
    const desig = process.argv[4] || 'Assistant Professor';
    const dept = process.argv[5] || 'CSE';

    console.log(`Whitelisting & provisioning faculty: ${email} (${name})...`);
    const ok = await provisionSingle({ email, name, designation: desig, department: dept });
    if (ok) {
      console.log(`✅ Faculty ${email} (${name}) successfully provisioned in Supabase.`);
    }
    return;
  }

  console.log("======================================================================");
  console.log("Usage:");
  console.log("  Batch Provision: node scripts/provision-faculty.js [path/to/roster.json]");
  console.log("  Single Member  : node scripts/provision-faculty.js <email> [fullName] [designation] [dept]");
  console.log("Example:");
  console.log("  node scripts/provision-faculty.js pr.cse@srmvalliammai.ac.in 'Dr. Priya Ramesh' 'Professor' 'CSE'");
  console.log("======================================================================");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

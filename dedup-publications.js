import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ixoddnwmhifjrhzonkuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b2RkbndtaGlmanJoem9ua3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NzQ3MTksImV4cCI6MjEwMjM1MDcxOX0.6jBpiEVVU7q4dRJxKAwVtzzpe3DsfoCFKhqUIuNubSs';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getCategory(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('neural') || t.includes('deep learning') || t.includes('machine learning') || t.includes('predict') || t.includes('algorithm') || t.includes('classification') || t.includes('segmentation') || t.includes('image') || t.includes('detection') || t.includes('recognition') || t.includes('model') || t.includes('ai') || t.includes('cnn') || t.includes('optimization') || t.includes('regression')) return 'AI & ML';
  if (t.includes('secure') || t.includes('security') || t.includes('cryptographic') || t.includes('deduplication') || t.includes('auth') || t.includes('attack') || t.includes('encryption') || t.includes('intrusion') || t.includes('trust')) return 'Cybersecurity';
  if (t.includes('cloud') || t.includes('kubernetes') || t.includes('microservice') || t.includes('network') || t.includes('routing') || t.includes('iot') || t.includes('edge') || t.includes('wireless') || t.includes('sensor')) return 'Cloud & DevOps';
  if (t.includes('data') || t.includes('stream') || t.includes('clustering') || t.includes('database') || t.includes('query') || t.includes('ingestion') || t.includes('big data')) return 'Data Engineering';
  return 'General Tech';
}
function cleanText(t) { if (!t) return ''; return t.replace(/\r?\n/g, ', ').replace(/\s+/g, ' ').trim().replace(/(^,\s*|,\s*$)/g, ''); }
function extractYear(y, def) { if (!y) return def; const m = y.match(/\b(20\d{2})\b/); return m ? parseInt(m[1]) : def; }
function getPubType(j) { const t = (j || '').toLowerCase(); return (t.includes('conference') || t.includes('symposium') || t.includes('proceedings')) ? 'conference' : 'journal'; }
function extractMentors(c) { return c.split(',').map(p => p.trim()).filter(p => p.startsWith('Dr.') || p.includes('Prof')).join(', '); }
function extractUrl(t) { if (!t) return null; const m = t.match(/(https?:\/\/[^\s\t]+)/); if (m) return m[1]; const d = t.match(/DOI:\s*([^\s\t]+)/i); return d ? `https://doi.org/${d[1]}` : null; }

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'latin1');
  const filename = path.basename(filePath);
  const isStudentFile = filename.toLowerCase().includes('student');
  let defaultYear = 2024;
  if (filename.includes('22-23')) defaultYear = 2022;
  else if (filename.includes('23-24')) defaultYear = 2023;
  else if (filename.includes('24-25')) defaultYear = 2024;
  else if (filename.includes('25-26')) defaultYear = 2025;

  const rows = content.split(/\r?\n(?=\d+\t)/);
  const publications = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue;
    const cols = row.split('\t').map(c => c.trim());
    if (cols.length < 3) continue;
    let title, contributors, journalName, issnIsbn, yearText, extraVol;
    if (isStudentFile) {
      contributors = cols[1]; journalName = cols[3] || cols[2] || 'Student Publication';
      title = cols[4]; issnIsbn = cols[5] || ''; yearText = cols[5] || '';
    } else {
      contributors = cols[1]; title = cols[2]; issnIsbn = cols[3] || '';
      journalName = cols[4] || 'Journal'; yearText = cols[5] || ''; extraVol = cols[6] || '';
    }
    if (!title || title.toLowerCase().includes('title') || title.toLowerCase().includes('paper title')) continue;
    const cleanTitle = cleanText(title);
    const cleanContributors = cleanText(contributors);
    const cleanJournalName = cleanText(journalName);
    const cleanIssnIsbn = cleanText(issnIsbn);
    const cleanYearText = cleanText(yearText);
    const year = extractYear(cleanYearText, defaultYear);
    const category = getCategory(cleanTitle);
    const type = getPubType(cleanJournalName);
    const mentors = extractMentors(cleanContributors);
    const url = extractUrl(issnIsbn) || extractUrl(extraVol) || null;
    const abstract = `This research publication titled "${cleanTitle}" was authored by ${cleanContributors} and published in "${cleanJournalName}". It contributes to the field of ${category} by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.`;
    publications.push({
      title: cleanTitle, type, category,
      journal_name: cleanJournalName, issn_isbn: cleanIssnIsbn || 'N/A',
      year, contributors: cleanContributors, mentors: mentors || null,
      abstract, url, author_name: 'Sys Admin', author_role: 'faculty_admin'
    });
  }
  return publications;
}

// Deduplication rule: SAME title + SAME author = duplicate. Different author = keep both.
function deduplicate(records) {
  const seen = new Set();
  const unique = [];
  let removed = 0;

  for (const rec of records) {
    const titleKey = normalize(rec.title);
    const authorKey = normalize(rec.contributors);
    // Composite key: title + author — both must match to be considered a duplicate
    const key = `${titleKey}|||${authorKey}`;

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(rec);
    } else {
      removed++;
      console.log(`  ⊗ Removed duplicate: "${rec.title.substring(0, 60)}" by "${rec.contributors.substring(0, 40)}"`);
    }
  }

  console.log(`\nTotal: ${records.length} records → ${unique.length} unique (${removed} duplicates removed)\n`);
  return unique;
}

async function main() {
  // --- 1. Parse all files ---
  const postsDir = fs.existsSync('./posts') ? './posts' : './public/posts';
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.txt'));
  let allPubs = [];
  for (const file of files) {
    const pubs = parseFile(path.join(postsDir, file));
    console.log(`Parsed ${pubs.length} records from ${file}`);
    allPubs = allPubs.concat(pubs);
  }

  // --- 2. Deduplicate ---
  console.log('\nDeduplicating by title + author...');
  const unique = deduplicate(allPubs);

  // --- 3. Authenticate ---
  console.log('🔑 Authenticating with Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_EMAIL || 'sysadmin@srmveccse.ac.in',
    password: process.env.SUPABASE_PASSWORD || ''
  });
  if (authError) { console.error('❌ Auth failed:', authError.message); return; }
  const userId = authData.user.id;
  console.log(`✅ Authenticated. User ID: ${userId}`);

  // --- 4. Clear Supabase and re-insert ---
  console.log('🗑️  Deleting all existing publications from Supabase...');
  const { error: deleteError } = await supabase.from('publications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) { console.error('❌ Delete failed:', deleteError.message); return; }
  console.log('✅ All existing records deleted.');

  console.log(`📤 Inserting ${unique.length} unique records...`);
  let success = 0, errors = 0;
  for (const rec of unique) {
    const { error } = await supabase.from('publications').insert([{ ...rec, author_id: userId }]);
    if (error) { errors++; console.error(`  ❌ ${rec.title.substring(0, 50)}: ${error.message}`); }
    else success++;
  }
  console.log(`\n📊 Supabase import: ${success} inserted, ${errors} errors`);

  // --- 5. Update frontend SEED_PUBLICATIONS ---
  console.log('\n📝 Updating SEED_PUBLICATIONS in publications-patents.js...');
  const jsFilePath = 'src/scripts/publications-patents.js';
  let code = fs.readFileSync(jsFilePath, 'utf8');

  const frontendData = unique.map((pub, index) => ({
    id: `pub_imported_${index + 1}`,
    title: pub.title, type: pub.type, category: pub.category,
    journal: pub.journal_name, issn: pub.issn_isbn, year: pub.year,
    contributors: pub.contributors, mentors: pub.mentors,
    abstract: pub.abstract, url: pub.url,
    authorName: pub.author_name, authorRole: pub.author_role,
    createdAt: new Date().toISOString()
  }));

  const startIdx = code.indexOf('const SEED_PUBLICATIONS = [');
  const endMarker = ']\n\n  function init()';
  const endIdx = code.indexOf(endMarker, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    console.error('❌ Could not locate SEED_PUBLICATIONS boundaries in JS file.');
    return;
  }

  const newBlock = `const SEED_PUBLICATIONS = ${JSON.stringify(frontendData, null, 2)}`;
  code = code.substring(0, startIdx) + newBlock + '\n\n  function init()' + code.substring(endIdx + endMarker.length);
  fs.writeFileSync(jsFilePath, code, 'utf8');
  console.log(`✅ SEED_PUBLICATIONS updated with ${frontendData.length} unique records.`);
  console.log('\n🏁 Done!');
}

main().catch(err => console.error('❌ Fatal error:', err));

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ixoddnwmhifjrhzonkuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b2RkbndtaGlmanJoem9ua3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NzQ3MTksImV4cCI6MjEwMjM1MDcxOX0.6jBpiEVVU7q4dRJxKAwVtzzpe3DsfoCFKhqUIuNubSs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getCategory(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('neural') || t.includes('deep learning') || t.includes('machine learning') || t.includes('predict') || t.includes('algorithm') || t.includes('classification') || t.includes('segmentation') || t.includes('image') || t.includes('detection') || t.includes('recognition') || t.includes('model') || t.includes('ai') || t.includes('cnn') || t.includes('optimization') || t.includes('regression')) {
    return 'AI & ML';
  }
  if (t.includes('secure') || t.includes('security') || t.includes('cryptographic') || t.includes('deduplication') || t.includes('auth') || t.includes('attack') || t.includes('encryption') || t.includes('intrusion') || t.includes('trust')) {
    return 'Cybersecurity';
  }
  if (t.includes('cloud') || t.includes('kubernetes') || t.includes('microservice') || t.includes('network') || t.includes('routing') || t.includes('iot') || t.includes('edge') || t.includes('wireless') || t.includes('sensor')) {
    return 'Cloud & DevOps';
  }
  if (t.includes('data') || t.includes('stream') || t.includes('clustering') || t.includes('database') || t.includes('query') || t.includes('ingestion') || t.includes('big data')) {
    return 'Data Engineering';
  }
  return 'General Tech';
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\r?\n/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^,\s*|,\s*$)/g, '');
}

function extractYear(yearText, defaultYear) {
  if (!yearText) return defaultYear;
  const match = yearText.match(/\b(20\d{2})\b/);
  if (match) {
    return parseInt(match[1]);
  }
  return defaultYear;
}

function getPubType(journalName) {
  const text = (journalName || '').toLowerCase();
  if (text.includes('conference') || text.includes('symposium') || text.includes('proceedings') || text.includes('national') || text.includes('international conference')) {
    return 'conference';
  }
  return 'journal';
}

function extractMentors(contributorsStr) {
  const parts = contributorsStr.split(',').map(p => p.trim());
  const mentors = parts.filter(p => p.startsWith('Dr.') || p.includes('Prof') || p.includes('Professor'));
  return mentors.join(', ');
}

function extractUrl(text) {
  if (!text) return null;
  const match = text.match(/(https?:\/\/[^\s\t]+)/);
  if (match) {
    return match[1];
  }
  const doiMatch = text.match(/DOI:\s*([^\s\t]+)/i);
  if (doiMatch) {
    return `https://doi.org/${doiMatch[1]}`;
  }
  return null;
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
      contributors = cols[1];
      journalName = cols[3] || cols[2] || 'Student Publication';
      title = cols[4];
      issnIsbn = cols[5] || '';
      yearText = cols[5] || '';
    } else {
      contributors = cols[1];
      title = cols[2];
      issnIsbn = cols[3] || '';
      journalName = cols[4] || 'Journal';
      yearText = cols[5] || '';
      extraVol = cols[6] || '';
    }

    if (!title || title.toLowerCase().includes('title') || title.toLowerCase().includes('paper title')) {
      continue;
    }

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
      title: cleanTitle,
      type: type,
      category: category,
      journal_name: cleanJournalName,
      issn_isbn: cleanIssnIsbn || 'N/A',
      year: year,
      contributors: cleanContributors,
      mentors: mentors || null,
      abstract: abstract,
      url: url,
      author_name: 'Sys Admin',
      author_role: 'faculty_admin',
    });
  }

  return publications;
}

async function main() {
  console.log('🔑 Authenticating with Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_EMAIL || 'sysadmin@srmveccse.ac.in',
    password: process.env.SUPABASE_PASSWORD || ''
  });

  if (authError) {
    console.error('❌ Supabase Authentication Failed:', authError.message);
    return;
  }
  const userId = authData.user.id;
  console.log(`✅ Authenticated successfully! User ID: ${userId}`);

  const postsDir = fs.existsSync('./posts') ? './posts' : './public/posts';
  if (!fs.existsSync(postsDir)) {
    console.error(`❌ Posts directory not found: ${postsDir}`);
    return;
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.txt'));
  console.log(`📂 Found ${files.length} text files to import.`);

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    console.log(`\n📄 Processing file: ${file}`);
    const records = parseFile(filePath);
    console.log(`   Parsed ${records.length} records. Starting import to Supabase...`);

    let successCount = 0;
    let errorCount = 0;

    for (const record of records) {
      // Add author_id to match RLS requirements
      const recordWithAuth = {
        ...record,
        author_id: userId
      };

      // Since the publications table doesn't exist or doesn't have unique constraint, we'll try to insert
      const { data, error } = await supabase
        .from('publications')
        .insert([recordWithAuth])
        .select();

      if (error) {
        errorCount++;
        // Output error details to user
        console.error(`   ❌ Failed to insert: "${record.title.substring(0, 40)}..."`);
        console.error(`      Error message: ${error.message}`);
        console.error(`      Error code: ${error.code}`);
      } else {
        successCount++;
      }
    }

    console.log(`📊 Summary for ${file}:`);
    console.log(`   - Successfully imported: ${successCount}`);
    console.log(`   - Failed with errors: ${errorCount}`);
  }

  console.log('\n🏁 Script execution completed.');
}

main().catch(err => {
  console.error('❌ Fatal error during script execution:', err);
});

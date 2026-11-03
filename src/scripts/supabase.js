import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env) ? process.env : {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ixoddnwmhifjrhzonkuj.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b2RkbndtaGlmanJoem9ua3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NzQ3MTksImV4cCI6MjEwMjM1MDcxOX0.6jBpiEVVU7q4dRJxKAwVtzzpe3DsfoCFKhqUIuNubSs';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel project environment variables or .env.local file.');
}

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

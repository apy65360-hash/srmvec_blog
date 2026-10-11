/**
 * achievements.js
 * ─────────────────────────────────────────────────────────────────
 * Supabase data layer for the Achievements feature.
 * Exports async helpers used by achievements-home.js and achievements.html.
 */

import { supabase } from './supabase.js';

// ── Fetch latest N published achievements ─────────────────────────────────────
export async function fetchLatestAchievements(limit = 3) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_published', true)
    .order('achievement_date', { ascending: false })
    .limit(limit);
  if (error) { console.error('[achievements] fetchLatest:', error.message); return []; }
  return data ?? [];
}

// ── Fetch all published achievements ──────────────────────────────────────────
export async function fetchAllAchievements() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_published', true)
    .order('achievement_date', { ascending: false });
  if (error) { console.error('[achievements] fetchAll:', error.message); return []; }
  return data ?? [];
}

// ── Fetch a single achievement by id ─────────────────────────────────────────
export async function fetchAchievementById(id) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('[achievements] fetchById:', error.message); return null; }
  return data;
}

// ── Insert a new achievement (admin / teacher only) ───────────────────────────
export async function postAchievement(data) {
  if (!supabase) return { error: 'Supabase not initialised' };
  const { data: inserted, error } = await supabase
    .from('achievements')
    .insert([data])
    .select()
    .single();
  if (error) { console.error('[achievements] postAchievement:', error.message); }
  return { data: inserted, error };
}

// ── Delete an achievement by id ───────────────────────────────────────────────
export async function deleteAchievement(id) {
  if (!supabase) return { error: 'Supabase not initialised' };
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);
  if (error) { console.error('[achievements] deleteAchievement:', error.message); }
  return { error };
}

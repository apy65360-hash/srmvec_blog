/**
 * achievements.js
 * ─────────────────────────────────────────────────────────────────
 * Supabase data layer for the Achievements feature.
 * Exports async helpers used by achievements-home.js and achievements.html.
 */

import { supabase } from './supabase.js';

// Helper with timeout to prevent page freezes if Supabase is offline or table is pending
async function withTimeout(promise, ms = 3500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase query timed out')), ms))
  ]);
}

// ── Fetch latest N published achievements ─────────────────────────────────────
export async function fetchLatestAchievements(limit = 3) {
  if (!supabase) return [];
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('achievements')
        .select('*')
        .eq('is_published', true)
        .order('achievement_date', { ascending: false })
        .limit(limit)
    );
    if (error) { console.warn('[achievements] fetchLatest warning:', error.message); return []; }
    return data ?? [];
  } catch (err) {
    console.warn('[achievements] fetchLatest fallback triggered:', err.message);
    return [];
  }
}

// ── Fetch all published achievements ──────────────────────────────────────────
export async function fetchAllAchievements() {
  if (!supabase) return [];
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('achievements')
        .select('*')
        .eq('is_published', true)
        .order('achievement_date', { ascending: false })
    );
    if (error) { console.warn('[achievements] fetchAll warning:', error.message); return []; }
    return data ?? [];
  } catch (err) {
    console.warn('[achievements] fetchAll fallback triggered:', err.message);
    return [];
  }
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

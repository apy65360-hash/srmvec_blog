/**
 * achievements.js
 * ─────────────────────────────────────────────────────────────────
 * Supabase data layer for the Achievements feature with hybrid
 * offline/seed override support.
 * Exports async helpers used by achievements-home.js and achievements.html.
 */

import { supabase } from './supabase.js';

const STORAGE_OVERRIDES_KEY = 'srmvec_achievements_overrides';
const STORAGE_DELETED_KEY = 'srmvec_achievements_deleted';

export function getAchievementOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function getDeletedAchievementIds() {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function applyAchievementOverrides(list = []) {
  const overrides = getAchievementOverrides();
  const deletedIds = new Set(getDeletedAchievementIds().map(String));

  return list
    .filter(item => !deletedIds.has(String(item.id)))
    .map(item => {
      const ov = overrides[String(item.id)];
      return ov ? { ...item, ...ov } : item;
    });
}

// Helper with timeout to prevent page freezes if Supabase is offline or table is pending
async function withTimeout(promise, ms = 7000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase query timed out')), ms))
  ]);
}

// ── Fetch latest N published achievements (most recently uploaded first) ──────
export async function fetchLatestAchievements(limit = 3) {
  let list = [];
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('achievements')
          .select('*')
          .or('is_published.eq.true,is_published.is.null')
          .order('created_at', { ascending: false })
          .order('achievement_date', { ascending: false })
          .limit(limit * 2) // Fetch a few extra so deleted items don't reduce below limit
      );
      if (!error && data) {
        list = data;
      }
    } catch (err) {
      console.warn('[achievements] fetchLatest fallback triggered:', err.message);
    }
  }

  const processed = applyAchievementOverrides(list);
  return processed.slice(0, limit);
}

// ── Fetch all published achievements ──────────────────────────────────────────
export async function fetchAllAchievements() {
  let list = [];
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('achievements')
          .select('*')
          .or('is_published.eq.true,is_published.is.null')
          .order('created_at', { ascending: false })
          .order('achievement_date', { ascending: false })
      );
      if (!error && data) {
        list = data;
      }
    } catch (err) {
      console.warn('[achievements] fetchAll fallback triggered:', err.message);
    }
  }

  return applyAchievementOverrides(list);
}

// ── Fetch a single achievement by id ─────────────────────────────────────────
export async function fetchAchievementById(id) {
  const deletedIds = new Set(getDeletedAchievementIds().map(String));
  if (deletedIds.has(String(id))) return null;

  const overrides = getAchievementOverrides();
  let baseData = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        baseData = data;
      }
    } catch (e) {
      console.warn('[achievements] fetchById warning:', e.message);
    }
  }

  if (overrides[String(id)]) {
    return baseData ? { ...baseData, ...overrides[String(id)] } : overrides[String(id)];
  }

  return baseData;
}

// ── Insert a new achievement (admin / teacher only) ───────────────────────────
export async function postAchievement(data) {
  let inserted = null;
  let errorMsg = null;

  if (supabase) {
    try {
      const { data: dbItem, error } = await supabase
        .from('achievements')
        .insert([data])
        .select()
        .single();
      if (error) {
        console.error('[achievements] postAchievement error:', error.message);
        errorMsg = error.message;
      } else {
        inserted = dbItem;
      }
    } catch (err) {
      console.warn('[achievements] postAchievement exception:', err);
      errorMsg = err.message;
    }
  }

  if (!inserted) {
    inserted = {
      ...data,
      id: 'ach-' + Date.now(),
      created_at: new Date().toISOString()
    };
    // Save to local overrides
    try {
      const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY);
      const overrides = raw ? JSON.parse(raw) : {};
      overrides[String(inserted.id)] = inserted;
      localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.warn('[achievements] local save warning:', e);
    }
  }

  window.dispatchEvent(new CustomEvent('srmvec:achievements-updated', { detail: { action: 'insert', item: inserted } }));
  return { data: inserted, error: errorMsg };
}

// ── Update an existing achievement (admin only) ───────────────────────────────
export async function updateAchievement(id, data) {
  let updated = null;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

  if (supabase && isUuid) {
    try {
      const { data: dbItem, error } = await supabase
        .from('achievements')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[achievements] Supabase update notice (falling back to local override):', error.message);
      } else {
        updated = dbItem;
      }
    } catch (err) {
      console.warn('[achievements] updateAchievement exception:', err);
    }
  }

  // Always update local overrides so UI reflects immediately across seed and custom items
  try {
    const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY);
    const overrides = raw ? JSON.parse(raw) : {};
    overrides[String(id)] = {
      ...(overrides[String(id)] || {}),
      ...data,
      id: id,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(overrides));
    if (!updated) {
      updated = overrides[String(id)];
    }
    localStorage.setItem('srmvec_achievements_last_update', String(Date.now()));
  } catch (e) {
    console.warn('[achievements] localStorage override save warning:', e);
  }

  window.dispatchEvent(new CustomEvent('srmvec:achievements-updated', { detail: { action: 'update', id, data: updated } }));
  return { data: updated || { id, ...data }, error: null };
}

// ── Delete an achievement by id (admin only) ──────────────────────────────────
export async function deleteAchievement(id) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

  if (supabase && isUuid) {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
      if (error) {
        console.warn('[achievements] Supabase delete notice (falling back to local removal):', error.message);
      }
    } catch (err) {
      console.warn('[achievements] deleteAchievement exception:', err);
    }
  }

  // Track in localStorage deleted list so deleted seed and custom items stay removed
  try {
    const rawDel = localStorage.getItem(STORAGE_DELETED_KEY);
    const deletedIds = rawDel ? JSON.parse(rawDel) : [];
    if (!deletedIds.includes(String(id))) {
      deletedIds.push(String(id));
      localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(deletedIds));
    }
    const rawOv = localStorage.getItem(STORAGE_OVERRIDES_KEY);
    if (rawOv) {
      const overrides = JSON.parse(rawOv);
      delete overrides[String(id)];
      localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(overrides));
    }
    localStorage.setItem('srmvec_achievements_last_update', String(Date.now()));
  } catch (e) {
    console.warn('[achievements] localStorage deletion save warning:', e);
  }

  window.dispatchEvent(new CustomEvent('srmvec:achievements-updated', { detail: { action: 'delete', id } }));
  return { error: null };
}

/**
 * AnnouncementsStore
 * -------------------------------------------------
 * - Persists announcements in localStorage
 * - Fires Browser Notification API when new items are posted
 * - Exposes a subscribe() mechanism so the UI can react live
 */

const STORE_KEY = 'cse_announcements_v1';
const SEEN_KEY  = 'cse_announcements_seen_v1';

const SEED_DATA = [
  {
    id: 'ann_seed_1',
    title: 'Internal Assessment – IA1 Schedule Released',
    body: 'The IA1 timetable for all semesters (Odd 2026-27) has been published on the portal. Students are advised to check their individual schedules and prepare accordingly.',
    category: 'Academic',
    priority: 'high',
    author: 'Department Office',
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),  // 1 hr ago
  },
  {
    id: 'ann_seed_2',
    title: 'Lab Practical Exam – Dress Code Reminder',
    body: 'All students appearing for practical examinations must wear formals with their ID cards. Students in casuals will not be permitted inside the lab.',
    category: 'Exam',
    priority: 'medium',
    author: 'Lab Coordinator',
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),  // 5 hrs ago
  },
  {
    id: 'ann_seed_3',
    title: 'IEEE Student Branch – New Project Collaboration Drive',
    body: 'IEEE SRMVEC CSE Student Branch invites proposals for inter-year collaborative research projects. Last date to register is Sept 5, 2026. Contact branch coordinator for details.',
    category: 'Club',
    priority: 'normal',
    author: 'IEEE Student Branch',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'ann_seed_4',
    title: 'Placement Training – AMCAT Mock Test on Aug 25',
    body: 'The Training & Placement Cell will conduct an AMCAT mock test on 25th August 2026 at 10:00 AM in the Computer Lab. Attendance is mandatory for all pre-final year students.',
    category: 'Placement',
    priority: 'high',
    author: 'T&P Cell',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'ann_seed_5',
    title: 'Library – Extended Hours During Exam Season',
    body: 'The Central Library will remain open until 10:00 PM on all weekdays from Aug 20 to Sept 20. Digital resources are available 24×7 via the campus VPN.',
    category: 'General',
    priority: 'normal',
    author: 'Library Committee',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

/** ── Core CRUD ─────────────────────────────────── */
export const AnnouncementsStore = {

  /** Return all announcements sorted newest-first */
  getAll() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const items = raw ? JSON.parse(raw) : null;
      if (!items) {
        // First run – seed data
        this._save(SEED_DATA);
        return [...SEED_DATA];
      }
      return items.slice().sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } catch {
      return [...SEED_DATA];
    }
  },

  /** Add a new announcement and trigger notification */
  add(data) {
    const items = this.getAll();
    const newItem = {
      id: `ann_${Date.now()}`,
      title: data.title || 'Untitled Announcement',
      body: data.body || '',
      category: data.category || 'General',
      priority: data.priority || 'normal',
      author: data.author || 'Department',
      postedAt: new Date().toISOString(),
    };
    // Prepend
    const updated = [newItem, ...items];
    this._save(updated);

    // Fire browser notification
    this._notify(newItem);

    // Broadcast to subscribers
    _subscribers.forEach(fn => fn(this.getAll()));

    return newItem;
  },

  /** Remove an announcement by id */
  remove(id) {
    const updated = this.getAll().filter(a => a.id !== id);
    this._save(updated);
    _subscribers.forEach(fn => fn(this.getAll()));
  },

  /** Subscribe to store changes. Returns an unsubscribe fn. */
  subscribe(fn) {
    _subscribers.push(fn);
    return () => { _subscribers = _subscribers.filter(s => s !== fn); };
  },

  /** Mark all current ids as "seen" for notification dedup */
  markAllSeen() {
    const ids = this.getAll().map(a => a.id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  },

  /** Return count of unseen announcements */
  unseenCount() {
    const seenRaw = localStorage.getItem(SEEN_KEY);
    const seen = seenRaw ? JSON.parse(seenRaw) : [];
    return this.getAll().filter(a => !seen.includes(a.id)).length;
  },

  _save(items) {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  },

  /** Request Notification permission & send one */
  async _notify(item) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission === 'granted') {
      const n = new Notification(`📢 SRMVEC CSE – ${item.category}`, {
        body: item.title,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: item.id,
      });
      setTimeout(() => n.close(), 8000);
    }
  },
};

let _subscribers = [];

/** ── Category helpers ──────────────────────────── */
export const CATEGORY_META = {
  Academic:  { color: '#2563EB', bg: '#EFF6FF', icon: 'fa-graduation-cap' },
  Exam:      { color: '#DC2626', bg: '#FEF2F2', icon: 'fa-file-pen'       },
  Placement: { color: '#059669', bg: '#ECFDF5', icon: 'fa-briefcase'      },
  Club:      { color: '#7C3AED', bg: '#F5F3FF', icon: 'fa-users'          },
  Holiday:   { color: '#D97706', bg: '#FFFBEB', icon: 'fa-umbrella-beach' },
  General:   { color: '#0EA5E9', bg: '#F0F9FF', icon: 'fa-bullhorn'       },
};

export function getCategoryMeta(cat) {
  return CATEGORY_META[cat] || CATEGORY_META['General'];
}

/** Pretty-print "2 hours ago" style */
export function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/**
 * announcements.js
 * -------------------------------------------------
 * Renders the Announcement Column on the home page.
 * Features:
 *  • Newest-first sorted list
 *  • "NEW" pulse badge on items < 6 hours old
 *  • Category color pills + filter sidebar
 *  • Tech binary/hex canvas header animation
 *  • Marquee ticker (top of page) showing latest 3 items
 *  • Browser Notification API on new posts
 *  • Live re-render via store.subscribe()
 *  • Admin quick-post form (visible when logged in as teacher/admin)
 *  • Stats sidebar: total, urgent, this-week counts
 *  • System live clock in header
 */

import {
  AnnouncementsStore,
  getCategoryMeta,
  timeAgo,
} from './announcements-store.js';

// ── Wait for DOM ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // 1. Render ticker
  renderTicker();

  // 2. Render announcements column with no filter (show all)
  renderColumn('all');

  // 3. Render sidebar stats & urgent card
  renderStats();
  renderUrgent();

  // 4. Tech canvas effect on header
  initCanvasEffect();

  // 5. Live system clock in header
  initSysClock();

  // 6. Notification permission prompt logic
  initNotifPrompt();

  // 7. Category filter pill wiring
  initFilterPills();

  // 8. Admin post form
  wireAdminForm();

  // 9. Subscribe to store → re-render everything on change
  AnnouncementsStore.subscribe(() => {
    renderTicker();
    renderColumn(activeFilter);
    renderStats();
    renderUrgent();
  });

  // 10. Mark all seen after 5s
  setTimeout(() => AnnouncementsStore.markAllSeen(), 5000);
});

// ── Active filter state ───────────────────────────────────────────────────────
let activeFilter = 'all';

// ── Ticker ───────────────────────────────────────────────────────────────────
function renderTicker() {
  const ticker = document.getElementById('ann-ticker-text');
  if (!ticker) return;
  const all = AnnouncementsStore.getAll();
  if (!all.length) { ticker.textContent = 'No announcements yet.'; return; }

  const text = all.slice(0, 4)
    .map((a, i) => `${i + 1}. 📢 [${a.category.toUpperCase()}] ${a.title}`)
    .join('   ·   ');
  // Double for seamless loop
  ticker.textContent = text + '   ·   ' + text;
}

// ── Column renderer ───────────────────────────────────────────────────────────
function renderColumn(filterCat = 'all') {
  const list = document.getElementById('ann-list');
  if (!list) return;

  let items = AnnouncementsStore.getAll();
  if (filterCat !== 'all') {
    items = items.filter(a => a.category === filterCat);
  }

  const unseenCount = AnnouncementsStore.unseenCount();
  const badge = document.getElementById('ann-badge-count');
  if (badge) {
    badge.textContent = unseenCount;
    badge.style.display = unseenCount > 0 ? 'inline-flex' : 'none';
  }

  if (!items.length) {
    list.innerHTML = `<div class="ann-empty"><i class="fa-solid fa-inbox"></i><p>No announcements in this category.</p></div>`;
    return;
  }

  const SIX_HRS = 6 * 60 * 60 * 1000;
  list.innerHTML = items.map(item => {
    const meta   = getCategoryMeta(item.category);
    const isNew  = (Date.now() - new Date(item.postedAt).getTime()) < SIX_HRS;
    const isHigh = item.priority === 'high';

    return `
    <article class="ann-item ${isHigh ? 'ann-item--urgent' : ''}" data-id="${item.id}">
      <div class="ann-item-top">
        <span class="ann-cat-pill" style="background:${meta.bg}; color:${meta.color}; border-color:${meta.color}40;">
          <i class="fa-solid ${meta.icon}"></i> ${item.category}
        </span>
        <div class="ann-item-badges">
          ${isNew  ? `<span class="ann-badge-new"><span class="ann-live-dot" style="background:#166534;width:6px;height:6px;"></span>NEW</span>` : ''}
          ${isHigh ? `<span class="ann-badge-urgent"><i class="fa-solid fa-triangle-exclamation"></i> URGENT</span>` : ''}
        </div>
      </div>
      <h4 class="ann-item-title">${escHtml(item.title)}</h4>
      <p class="ann-item-body">${escHtml(item.body)}</p>
      <div class="ann-item-footer">
        <span class="ann-author"><i class="fa-solid fa-circle-user"></i> ${escHtml(item.author)}</span>
        <span class="ann-time" title="${new Date(item.postedAt).toLocaleString('en-IN')}">${timeAgo(item.postedAt)}</span>
      </div>
    </article>`;
  }).join('');
}

// ── Stats sidebar ─────────────────────────────────────────────────────────────
function renderStats() {
  const grid = document.getElementById('ann-stats-grid');
  if (!grid) return;

  const all    = AnnouncementsStore.getAll();
  const WEEK   = 7 * 24 * 60 * 60 * 1000;
  const recent = all.filter(a => Date.now() - new Date(a.postedAt).getTime() < WEEK);
  const urgent = all.filter(a => a.priority === 'high');

  const statRows = [
    { num: all.length,     label: 'Total'       },
    { num: recent.length,  label: 'This Week'   },
    { num: urgent.length,  label: 'Urgent'      },
    { num: AnnouncementsStore.unseenCount(), label: 'Unread' },
  ];

  grid.innerHTML = statRows.map(s => `
    <div class="ann-stat-tile">
      <span class="ann-stat-num">${s.num}</span>
      <span class="ann-stat-label">${s.label}</span>
    </div>`).join('');
}

// ── Urgent card ───────────────────────────────────────────────────────────────
function renderUrgent() {
  const card = document.getElementById('ann-urgent-card');
  const txt  = document.getElementById('ann-urgent-text');
  if (!card || !txt) return;

  const urgent = AnnouncementsStore.getAll().find(a => a.priority === 'high');
  if (urgent) {
    card.style.display = 'block';
    txt.textContent = urgent.title;
  } else {
    card.style.display = 'none';
  }
}

// ── Filter pills ──────────────────────────────────────────────────────────────
function initFilterPills() {
  const wrap = document.getElementById('ann-filter-pills');
  if (!wrap) return;

  wrap.addEventListener('click', e => {
    const btn = e.target.closest('.ann-pill');
    if (!btn) return;

    wrap.querySelectorAll('.ann-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderColumn(activeFilter);
  });
}

// ── Admin post form ───────────────────────────────────────────────────────────
function wireAdminForm() {
  const form = document.getElementById('ann-post-form');
  const wrap = document.getElementById('ann-post-wrap');
  if (!form || !wrap) return;

  // Show form only if teacher/admin
  try {
    const userRaw = localStorage.getItem('cse_auth_user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      if (user && (user.role === 'teacher' || user.role === 'admin')) {
        wrap.style.display = 'block';
      }
    }
  } catch {}

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title    = form.querySelector('#ann-title').value.trim();
    const body     = form.querySelector('#ann-body').value.trim();
    const category = form.querySelector('#ann-category').value;
    const priority = form.querySelector('#ann-priority').value;
    if (!title || !body) return;

    let author = 'Department';
    try {
      const u = JSON.parse(localStorage.getItem('cse_auth_user') || '{}');
      if (u.name) author = u.name;
    } catch {}

    AnnouncementsStore.add({ title, body, category, priority, author });

    const msg = document.getElementById('ann-post-msg');
    if (msg) {
      msg.style.display = 'flex';
      setTimeout(() => { msg.style.display = 'none'; }, 3500);
    }
    form.reset();
  });
}

// ── Notification permission prompt ───────────────────────────────────────────
function initNotifPrompt() {
  const prompt  = document.getElementById('ann-notif-prompt');
  const enable  = document.getElementById('ann-enable-notif');
  const dismiss = document.getElementById('ann-dismiss-notif');
  if (!prompt) return;

  // Hide if already granted or dismissed
  const dismissed = sessionStorage.getItem('ann_notif_dismissed');
  if (Notification.permission === 'granted' || dismissed) {
    prompt.style.display = 'none';
    return;
  }

  enable && enable.addEventListener('click', async () => {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      prompt.style.display = 'none';
      // Welcome notification
      new Notification('✅ Notifications Enabled', {
        body: 'You will now receive SRMVEC CSE department announcements in real-time.',
        tag: 'welcome',
      });
    }
  });

  dismiss && dismiss.addEventListener('click', () => {
    prompt.style.display = 'none';
    sessionStorage.setItem('ann_notif_dismissed', '1');
  });
}

// ── System live clock in header ──────────────────────────────────────────────
function initSysClock() {
  const el = document.getElementById('ann-sys-clock');
  if (!el) return;

  function tick() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    const ss  = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `SYS::${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ── Canvas binary / hex tech rain effect ─────────────────────────────────────
function initCanvasEffect() {
  const canvas = document.getElementById('ann-header-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウABCDEF0x23★◆'.split('');
  const NUM   = 32;
  const drops = Array.from({ length: NUM }, () => ({
    x:     Math.random() * 800,
    y:     Math.random() * 100 - 100,
    speed: Math.random() * 0.55 + 0.18,
    char:  chars[Math.floor(Math.random() * chars.length)],
    alpha: Math.random() * 0.45 + 0.1,
    size:  Math.random() * 8 + 6,
    timer: 0,
  }));

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    drops.forEach(d => {
      ctx.font = `${d.size}px monospace`;
      ctx.fillStyle = `rgba(14, 165, 233, ${d.alpha})`;
      ctx.fillText(d.char, d.x % w, d.y);
      d.y += d.speed;
      if (d.y > h + 12) d.y = -14;
      d.timer++;
      if (d.timer > 28) {
        d.char  = chars[Math.floor(Math.random() * chars.length)];
        d.timer = 0;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Utility ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

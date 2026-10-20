/**
 * achievements-home.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the Achievements Showcase carousel on the home page (index.html).
 * • Fetches latest 3 achievements from Supabase via achievements.js
 * • Falls back to SAMPLE_ACHIEVEMENTS when DB returns empty or on error
 * • Builds 3 original + 3 duplicate cards for seamless infinite loop
 * • Auto-slides every 4 s; pauses on hover
 * • Prev / Next button handlers + dot indicators
 */

import { fetchLatestAchievements } from './achievements.js';

// ── Department Achievement Records (from achievement pics) ──────────────
const SAMPLE_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'First Prize — Tech Heist Technical Quiz at MEDARZT Symposium',
    short_desc: 'Pooja S (II Year CSE-2) & Team Dream Scavengers won First Prize and a cash award in the Tech Heist Technical Quiz at MEDARZT.',
    image_url: '/images/achievements/medarzt-tech-heist.jpeg',
    category: 'Technical',
    achievement_date: '2026-10-11',
    student_name: 'Pooja S & Team Dream Scavengers',
  },
  {
    id: 'ach-2',
    title: 'Third Place — Tessarion\'s Trail at ZYVERSE 2K26 National Symposium',
    short_desc: 'P. Jeeva Kumar & S. Keerthana (II CSE Sec-2) bagged 3rd Place in the Tessarion\'s Trail event at ZYVERSE 2K26.',
    image_url: '/images/achievements/zyverse-tessarions-trail.jpeg',
    category: 'Technical',
    achievement_date: '2026-09-12',
    student_name: 'P. Jeeva Kumar & S. Keerthana',
  },
  {
    id: 'ach-3',
    title: 'Runners-Up Trophy — TECHQUIZ at CYNEX\'26 National Symposium',
    short_desc: 'CSE students won the Runner-Up Trophy in the National Level TECHQUIZ at CYNEX\'26 hosted by SRMIST Ramapuram.',
    image_url: '/images/achievements/cynex-techquiz-runnerup.jpeg',
    category: 'Technical',
    achievement_date: '2026-09-08',
    student_name: 'P. Jeevan Kumar, S. Mohamed Samith Khan & B. Bhumika',
  },
];

// ── Category icon map ─────────────────────────────────────────────────────────
const CAT_ICONS = {
  Technical:  'fa-microchip',
  Research:   'fa-flask',
  Academic:   'fa-graduation-cap',
  Sports:     'fa-trophy',
  Cultural:   'fa-music',
  Placement:  'fa-briefcase',
  Other:      'fa-star',
};

// ── Utility ──────────────────────────────────────────────────────────────────
function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildCard(ach, idx = 0) {
  const icon = CAT_ICONS[ach.category] || 'fa-award';
  const href = `achievements.html#achievement-${ach.id}`;
  const activeClass = idx === 0 ? ' motion-active' : '';

  return `
<div class="ach-card${activeClass}" data-index="${idx}" role="article">
  <div class="ach-card-img">
    <img
      src="${escHtml(ach.image_url || '/images/achievements/medarzt-tech-heist.jpeg')}"
      alt="${escHtml(ach.title)}"
      loading="lazy"
      onerror="this.src='/images/achievements/medarzt-tech-heist.jpeg'"
    />
    <div class="ach-card-img-overlay">
      <a href="${escHtml(href)}" class="ach-card-read-btn">
        Read Me <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </div>
  <div class="ach-card-body">
    <div class="ach-card-top-row">
      <span class="ach-card-category" data-cat="${escHtml(ach.category)}">
        <i class="fa-solid ${icon}"></i> ${escHtml(ach.category)}
      </span>
      <span class="ach-card-date">
        <i class="fa-regular fa-calendar"></i> ${formatDate(ach.achievement_date)}
      </span>
    </div>
    <h3 class="ach-card-title">${escHtml(ach.title)}</h3>
    <p class="ach-card-short-desc">${escHtml(ach.short_desc)}</p>
    <div class="ach-card-meta">
      <span class="ach-card-meta-name">
        <i class="fa-solid fa-user-graduate"></i> ${escHtml(ach.student_name)}
      </span>
    </div>
  </div>
</div>`;
}

// ── Carousel state ────────────────────────────────────────────────────────────
let currentIndex = 0;
let totalCards   = 0;
let autoTimer    = null;
let achievements = [];

function slideTo(idx) {
  const track = document.getElementById('achCarouselTrack');
  if (!track || totalCards === 0) return;

  currentIndex = ((idx % totalCards) + totalCards) % totalCards;

  // Active motion highlight class
  const cards = track.querySelectorAll('.ach-card');
  cards.forEach((card, i) => {
    card.classList.toggle('motion-active', i === currentIndex);
  });

  // On mobile/tablet, slide horizontally
  if (window.innerWidth < 992) {
    const firstCard = cards[0];
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = 16;
      track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }
  } else {
    track.style.transform = 'none';
  }

  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('#achDots .ach-dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

function buildDots(n) {
  const wrap = document.getElementById('achDots');
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const btn = document.createElement('button');
    btn.className = `ach-dot${i === 0 ? ' active' : ''}`;
    btn.setAttribute('aria-label', `View achievement ${i + 1}`);
    btn.addEventListener('click', () => {
      slideTo(i);
      resetAutoplay();
    });
    wrap.appendChild(btn);
  }
}

function startAutoplay() {
  stopAutoplay();
  autoTimer = setInterval(() => {
    slideTo(currentIndex + 1);
  }, 3500);
}

function stopAutoplay() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// ── Inject cards into DOM ────────────────────────────────────────────────────
function renderCarousel(data) {
  const track = document.getElementById('achCarouselTrack');
  if (!track) return;

  // Strictly only show latest three achievements on home page
  const latestThree = (data || []).slice(0, 3);
  achievements = latestThree;
  totalCards   = latestThree.length;

  if (totalCards === 0) {
    track.innerHTML = '<p style="color:#64748b;padding:2rem;text-align:center;">No achievements published yet.</p>';
    return;
  }

  // Exactly 3 cards — no duplicates
  track.innerHTML = latestThree.map((item, idx) => buildCard(item, idx)).join('');

  currentIndex = 0;
  buildDots(totalCards);

  // Prev / Next buttons
  const prevBtn = document.getElementById('achPrev');
  const nextBtn = document.getElementById('achNext');
  if (prevBtn) prevBtn.onclick = () => { slideTo(currentIndex - 1); resetAutoplay(); };
  if (nextBtn) nextBtn.onclick = () => { slideTo(currentIndex + 1); resetAutoplay(); };

  // Pause on hover
  const viewport = document.querySelector('.ach-carousel-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    viewport.addEventListener('focusin',    stopAutoplay);
    viewport.addEventListener('focusout',   startAutoplay);
  }

  // Touch support for mobile swipe
  let touchStartX = 0;
  if (viewport) {
    viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        slideTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        resetAutoplay();
      }
    }, { passive: true });
  }

  // Window resize handler
  window.addEventListener('resize', () => {
    slideTo(currentIndex);
  });

  // Start animated motion
  startAutoplay();
}

// ── Boot ─────────────────────────────────────────────────────────────────────
async function initAchievementsHome() {
  let data = [];
  try {
    data = await fetchLatestAchievements(3);
  } catch (err) {
    console.warn('[achievements-home] Supabase fetch failed:', err);
  }

  // Fall back to sample data if empty
  if (!data || data.length === 0) {
    data = SAMPLE_ACHIEVEMENTS;
  }

  renderCarousel(data);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAchievementsHome);
} else {
  initAchievementsHome();
}

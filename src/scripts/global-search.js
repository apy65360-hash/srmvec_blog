/**
 * Global Search Module for SRMVEC CSE Portal
 * Indexes and searches across:
 * - Blog posts & student/faculty articles
 * - Department news & official announcements
 * - Symposiums, hackathons & events
 * - 15+ Computing laboratories & facilities
 * - Admissions, eligibility & courses (B.E., M.E.)
 * - Academic calendar, exam dates & holidays
 * - Faculty directory, research papers & patents
 */

import { EventsStore } from './events-store.js';

// Static Department Knowledge Base
const STATIC_DEPT_DATA = [
  // Admissions & Academics
  {
    title: 'B.E. Computer Science and Engineering Admissions',
    category: 'Admissions',
    type: 'admissions',
    desc: '4-Year undergraduate degree program. Annual intake capacity: 180 seats. Anna University counselling & management quota.',
    url: 'admissions-eligibility.html#ug-courses',
    keywords: 'be cse admission ug b.tech engineering seats intake cutoff fees 180'
  },
  {
    title: 'M.E. Computer Science and Engineering Admissions',
    category: 'Admissions',
    type: 'admissions',
    desc: '2-Year postgraduate degree program. Annual intake capacity: 18 seats. Specializations in AI, Cloud, and Systems.',
    url: 'admissions-eligibility.html#pg-courses',
    keywords: 'me cse master engineering pg postgraduate gate tancet 18 seats'
  },
  {
    title: 'Admissions Eligibility Criteria & Academic Cutoffs',
    category: 'Admissions',
    type: 'admissions',
    desc: 'HSC (+2) eligibility: 45% aggregate in Maths, Physics, Chemistry (40% for reserved categories). Lateral entry criteria.',
    url: 'admissions-eligibility.html',
    keywords: 'eligibility cutoff criteria marks percentage hsc 12th math physics chemistry lateral entry'
  },

  // Laboratories & High-Tech Infrastructure
  {
    title: 'Artificial Intelligence & Deep Learning Laboratory',
    category: 'Laboratory',
    type: 'lab',
    desc: 'Equipped with NVIDIA RTX workstations, CUDA development environment, TensorFlow, PyTorch & GPU computing clusters.',
    url: 'laboratories.html#ai-lab',
    keywords: 'ai lab artificial intelligence deep learning gpu nvidia machine learning neural network'
  },
  {
    title: 'Cyber Security & Digital Forensics Laboratory',
    category: 'Laboratory',
    type: 'lab',
    desc: 'Dedicated security lab for ethical hacking, network packet analysis, cryptography, Wireshark, Kali Linux & penetration testing.',
    url: 'laboratories.html#cyber-lab',
    keywords: 'cyber security lab digital forensics ethical hacking network security penetration testing kali'
  },
  {
    title: 'Cloud Computing & DevOps Laboratory',
    category: 'Laboratory',
    type: 'lab',
    desc: 'Hands-on cloud orchestration environment with Docker, Kubernetes, AWS Educate, OpenStack & VMware virtualized infrastructure.',
    url: 'laboratories.html#cloud-lab',
    keywords: 'cloud lab devops kubernetes docker aws openstack virtualization servers'
  },
  {
    title: 'Internet of Things (IoT) & Embedded Systems Lab',
    category: 'Laboratory',
    type: 'lab',
    desc: 'Microcontroller experimentation with Raspberry Pi 4, Arduino, ESP32, sensor nodes, ZigBee, and LoRaWAN gateways.',
    url: 'laboratories.html#iot-lab',
    keywords: 'iot lab embedded systems raspberry pi arduino esp32 sensors zigbee hardware microcontrollers'
  },
  {
    title: 'Big Data Analytics & Data Science Laboratory',
    category: 'Laboratory',
    type: 'lab',
    desc: 'Big data processing hub with Apache Hadoop, Apache Spark, MongoDB, Tableau & Python analytics suites.',
    url: 'laboratories.html#data-lab',
    keywords: 'big data analytics lab data science spark hadoop mongodb python tableau database'
  },
  {
    title: 'Software Development & Full-Stack Web Lab',
    category: 'Laboratory',
    type: 'lab',
    desc: 'Modern web & mobile application engineering with React, Node.js, Next.js, Flutter, Android Studio, and PostgreSQL.',
    url: 'laboratories.html#software-lab',
    keywords: 'software lab web development full stack react nodejs flutter android database'
  },

  // Faculty & Research
  {
    title: 'Faculty Directory & Department Leadership',
    category: 'Faculty',
    type: 'faculty',
    desc: 'Meet our distinguished HoD, Professors, Associate & Assistant Professors shaping CSE academic excellence.',
    url: 'manage-faculty.html',
    keywords: 'faculty staff teachers professors hod dr b vanathi cse staff members contact'
  },
  {
    title: 'Publications, Scopus Journals & Registered Patents',
    category: 'Research',
    type: 'research',
    desc: 'Explore 200+ Scopus-indexed research papers, IEEE conference proceedings, patents, and copyright filings.',
    url: 'publications-patents.html',
    keywords: 'publications patents research papers scopus ieee journals citations intellectual property'
  },

  // Portals & Schedules
  {
    title: 'Academic Calendar 2026-2027 Schedule',
    category: 'Academics',
    type: 'calendar',
    desc: 'Comprehensive monthly & semester schedule for Internal Assessments (IA1, IA2), Model exams, practicals & holidays.',
    url: 'academic-calendar.html',
    keywords: 'academic calendar timetable schedule exam dates practicals cat1 cat2 ia1 holidays semester'
  },
  {
    title: 'Student Corner Portal — Article Submissions',
    category: 'Portal',
    type: 'portal',
    desc: 'Student dashboard to write, submit, and manage technical articles with real-time admin review & approval status.',
    url: 'student-corner.html',
    keywords: 'student corner portal write publish article submission student login blog post'
  },
  {
    title: "Teacher's Corner Portal — Academic Studio",
    category: 'Portal',
    type: 'portal',
    desc: 'Faculty editorial publishing studio to release lecture notes, academic guidance, and research insights.',
    url: 'teachers-corner.html',
    keywords: 'teacher corner portal faculty publishing studio staff login course notes guidance'
  },
  {
    title: 'Student Academic Dashboard & Analytics',
    category: 'Dashboard',
    type: 'dashboard',
    desc: 'Real-time metrics on 95% placement records, student accomplishments, departmental statistics & achievements.',
    url: 'dashboard.html',
    keywords: 'dashboard statistics placement records analytics student progress charts metrics'
  }
];

export function initGlobalSearch() {
  const searchContainers = document.querySelectorAll('.top-bar-search');
  if (!searchContainers.length) return;

  searchContainers.forEach(container => {
    let input = container.querySelector('input');
    if (!input) return;

    // Set accessibility and styling attributes
    input.setAttribute('id', 'globalSearchInput');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('placeholder', 'Search posts, news, events, labs...');

    // Create or find dropdown element
    let dropdown = container.querySelector('.global-search-results-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'global-search-results-dropdown';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', 'Search Results');
      container.appendChild(dropdown);
    }

    let selectedIndex = -1;
    let currentResults = [];

    // Helper to highlight matching terms
    function highlightMatch(text, query) {
      if (!query || !text) return text || '';
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Helper to get category icon and class
    function getCategoryMeta(type) {
      switch (type) {
        case 'blog':
          return { icon: 'fa-solid fa-newspaper', class: 'search-icon-blog', label: 'Blog Post' };
        case 'announcement':
          return { icon: 'fa-solid fa-bullhorn', class: 'search-icon-news', label: 'Dept News' };
        case 'event':
          return { icon: 'fa-solid fa-calendar-days', class: 'search-icon-event', label: 'Event' };
        case 'lab':
          return { icon: 'fa-solid fa-flask', class: 'search-icon-lab', label: 'Laboratory' };
        case 'admissions':
        case 'calendar':
          return { icon: 'fa-solid fa-graduation-cap', class: 'search-icon-acad', label: 'Academics' };
        case 'research':
        case 'faculty':
          return { icon: 'fa-solid fa-book-bookmark', class: 'search-icon-research', label: 'Research' };
        default:
          return { icon: 'fa-solid fa-compass', class: 'search-icon-blog', label: 'Portal' };
      }
    }

    // Gathers and queries all data items in real time
    function queryAll(term) {
      const q = term.trim().toLowerCase();
      if (!q) return [];

      const results = [];

      // 1. Query BlogDB
      try {
        if (window.BlogDB && typeof window.BlogDB.getAllRawBlogs === 'function') {
          const blogs = window.BlogDB.getAllRawBlogs();
          blogs.forEach(b => {
            const title = b.title || '';
            const content = b.content || '';
            const category = b.category || '';
            const author = b.author || '';
            const tags = Array.isArray(b.tags) ? b.tags.join(' ') : (b.tags || '');

            const matchScore = (
              (title.toLowerCase().includes(q) ? 10 : 0) +
              (category.toLowerCase().includes(q) ? 5 : 0) +
              (tags.toLowerCase().includes(q) ? 4 : 0) +
              (author.toLowerCase().includes(q) ? 3 : 0) +
              (content.toLowerCase().includes(q) ? 2 : 0)
            );

            if (matchScore > 0) {
              results.push({
                title: b.title,
                category: b.category || 'Blog',
                type: 'blog',
                desc: (b.content || '').substring(0, 100) + '...',
                url: `blog-view.html?id=${encodeURIComponent(b.id || '')}`,
                score: matchScore
              });
            }
          });
        }
      } catch (err) {
        console.warn('BlogDB search index error:', err);
      }

      // 2. Query Announcements Store
      try {
        if (window.AnnouncementsStore && typeof window.AnnouncementsStore.getAll === 'function') {
          const anns = window.AnnouncementsStore.getAll();
          anns.forEach(a => {
            const title = a.title || '';
            const body = a.body || '';
            const category = a.category || '';

            const matchScore = (
              (title.toLowerCase().includes(q) ? 10 : 0) +
              (category.toLowerCase().includes(q) ? 5 : 0) +
              (body.toLowerCase().includes(q) ? 3 : 0)
            );

            if (matchScore > 0) {
              results.push({
                title: a.title,
                category: a.category ? `News: ${a.category}` : 'Dept News',
                type: 'announcement',
                desc: (a.body || '').substring(0, 100) + '...',
                url: `announcement-view.html?id=${encodeURIComponent(a.id || '')}`,
                score: matchScore
              });
            }
          });
        }
      } catch (err) {
        console.warn('Announcements search index error:', err);
      }

      // 3. Query Events Store
      try {
        const eventsList = EventsStore && typeof EventsStore.getEvents === 'function' ? EventsStore.getEvents() : [];
        if (Array.isArray(eventsList)) {
          eventsList.forEach(ev => {
            const title = ev.title || '';
            const desc = ev.description || '';
            const college = ev.college || '';
            const tech = Array.isArray(ev.techEvents) ? ev.techEvents.join(' ') : '';
            const nonTech = Array.isArray(ev.nonTechEvents) ? ev.nonTechEvents.join(' ') : '';

            const matchScore = (
              (title.toLowerCase().includes(q) ? 10 : 0) +
              (tech.toLowerCase().includes(q) ? 6 : 0) +
              (college.toLowerCase().includes(q) ? 4 : 0) +
              (nonTech.toLowerCase().includes(q) ? 3 : 0) +
              (desc.toLowerCase().includes(q) ? 2 : 0)
            );

            if (matchScore > 0) {
              results.push({
                title: ev.title,
                category: `Event (${ev.date || 'Symposium'})`,
                type: 'event',
                desc: ev.description || `${ev.college} — ${ev.dept}`,
                url: `event1.html#${encodeURIComponent(ev.id || '')}`,
                score: matchScore
              });
            }
          });
        }
      } catch (err) {
        console.warn('Events search index error:', err);
      }

      // 4. Query Static Department Knowledge
      STATIC_DEPT_DATA.forEach(item => {
        const title = item.title || '';
        const desc = item.desc || '';
        const category = item.category || '';
        const kw = item.keywords || '';

        const matchScore = (
          (title.toLowerCase().includes(q) ? 10 : 0) +
          (kw.toLowerCase().includes(q) ? 8 : 0) +
          (category.toLowerCase().includes(q) ? 4 : 0) +
          (desc.toLowerCase().includes(q) ? 2 : 0)
        );

        if (matchScore > 0) {
          results.push({
            title: item.title,
            category: item.category,
            type: item.type,
            desc: item.desc,
            url: item.url,
            score: matchScore
          });
        }
      });

      // Sort results by relevance score descending
      results.sort((a, b) => b.score - a.score);

      // Return top 8 results
      return results.slice(0, 8);
    }

    // Render Dropdown Results
    function renderDropdown(results, query) {
      currentResults = results;
      selectedIndex = -1;

      if (!query.trim()) {
        dropdown.classList.remove('visible');
        dropdown.innerHTML = '';
        return;
      }

      if (results.length === 0) {
        dropdown.innerHTML = `
          <div class="search-results-header">
            <span>Search CSE Portal</span>
            <span>0 Results</span>
          </div>
          <div class="search-empty-state">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>No matches found for "<strong>${escapeHtml(query)}</strong>"</p>
            <small style="color:#64748B;">Try searching for "AI", "Admissions", "Labs", "IA1", "Events", or "Faculty"</small>
          </div>
        `;
        dropdown.classList.add('visible');
        return;
      }

      let html = `
        <div class="search-results-header">
          <span>Search Results (${results.length})</span>
          <span style="font-size:0.7rem;color:#F59E0B;">Press ↑ ↓ to navigate, Enter to open</span>
        </div>
        <div class="search-results-list">
      `;

      results.forEach((item, index) => {
        const meta = getCategoryMeta(item.type);
        const highlightedTitle = highlightMatch(escapeHtml(item.title), query);
        const highlightedDesc = highlightMatch(escapeHtml(item.desc), query);

        html += `
          <a href="${item.url}" class="search-result-item" data-index="${index}">
            <div class="search-item-icon ${meta.class}">
              <i class="${meta.icon}"></i>
            </div>
            <div class="search-item-content">
              <span class="search-item-badge">${escapeHtml(item.category || meta.label)}</span>
              <h4 class="search-item-title">${highlightedTitle}</h4>
              <p class="search-item-desc">${highlightedDesc}</p>
            </div>
          </a>
        `;
      });

      html += `</div>`;
      dropdown.innerHTML = html;
      dropdown.classList.add('visible');
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Input listeners
    input.addEventListener('input', (e) => {
      const q = e.target.value;
      const matches = queryAll(q);
      renderDropdown(matches, q);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) {
        const matches = queryAll(input.value);
        renderDropdown(matches, input.value);
      }
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      if (!dropdown.classList.contains('visible') || currentResults.length === 0) {
        if (e.key === 'Enter' && input.value.trim()) {
          const matches = queryAll(input.value);
          if (matches.length > 0) {
            window.location.href = matches[0].url;
          }
        }
        return;
      }

      const items = dropdown.querySelectorAll('.search-result-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
          window.location.href = currentResults[selectedIndex].url;
        } else if (currentResults.length > 0) {
          window.location.href = currentResults[0].url;
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('visible');
        input.blur();
      }
    });

    function updateSelection(items) {
      items.forEach((it, idx) => {
        if (idx === selectedIndex) {
          it.classList.add('selected');
          it.scrollIntoView({ block: 'nearest' });
        } else {
          it.classList.remove('selected');
        }
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('visible');
      }
    });
  });
}

// Resilient initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalSearch);
} else {
  initGlobalSearch();
}

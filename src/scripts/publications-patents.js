/**
 * PUBLICATIONS & PATENTS PORTAL SCRIPT — publications-patents.js
 * Manages research papers, journals, book chapters, and patents.
 * Leverages localStorage with Supabase database synchronization.
 */

const PubDB = (() => {
  const STORAGE_KEY = 'srmvec_publications';

  // Realistic seed data
  const SEED_PUBLICATIONS = [
    {
      id: 'pub_seed_1',
      title: 'Neural Network-Driven Diagnostic Model for Early Cardiac Anomalies',
      type: 'journal',
      category: 'AI & ML',
      journal: 'IEEE Transactions on Biomedical Engineering',
      issn: 'ISSN: 0018-9294',
      year: 2026,
      contributors: 'Swetha Raghavan, Dr. Priya Ramesh',
      mentors: 'Dr. Priya Ramesh',
      abstract: 'This research paper presents a deep convolutional neural architecture tailored for real-time classification of electrocardiogram (ECG) signals. Using a multi-scale fusion mechanism, the model achieves a 98.4% detection rate for early cardiac arrhythmic symptoms. We address challenges related to noise suppression and sensor drift in wearable clinical monitors.',
      url: 'https://doi.org/10.1109/TBME.2026.1234567',
      authorName: 'Dr. Priya Ramesh',
      authorId: 'teacher_seed_1',
      authorRole: 'teacher',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pub_seed_2',
      title: 'System and Method for Decentralized Zero-Trust Cloud Vault Authentication',
      type: 'patent',
      category: 'Cybersecurity',
      journal: 'Indian Patent Office (IPO)',
      issn: 'Patent App: IN-2025410982-A',
      year: 2025,
      contributors: 'Arun Krishnamurthy, Swetha Raghavan, Prof. Karthik Subramanian',
      mentors: 'Prof. Karthik Subramanian',
      abstract: 'A cryptographic zero-knowledge proof (ZKP) framework for authenticating cloud server containers without transferring raw credentials. The invention uses decentralized nodes to verify credential claims, mitigating single-point-of-failure vulnerabilities in identity and access management (IAM) infrastructures.',
      url: 'https://ipindiaservices.gov.in/publicsearch',
      authorName: 'Arun Krishnamurthy',
      authorId: 'student_seed_1',
      authorRole: 'student',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pub_seed_3',
      title: 'Automated Threat Modeling of Kubernetes Clusters using Graph Neural Networks',
      type: 'conference',
      category: 'Cybersecurity',
      journal: 'ACM Conference on Computer and Communications Security (CCS)',
      issn: 'ISBN: 978-1-4503-0000-0',
      year: 2026,
      contributors: 'Dr. Priya Ramesh, Dr. Meena Sundarajan',
      mentors: '',
      abstract: 'We present an end-to-end automated threat landscape analyzer for container orchestrations. By mapping Pod communications to directed graphs, we apply GNN algorithms to predict privilege escalation paths. Results validate that the model uncovers microservice vulnerabilities ahead of static scanners.',
      url: 'https://doi.org/10.1145/3600000.3600001',
      authorName: 'Dr. Priya Ramesh',
      authorId: 'teacher_seed_1',
      authorRole: 'teacher',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pub_seed_4',
      title: 'A High-Throughput Edge Stream Clustering Algorithm for IoT Data Ingestion',
      type: 'journal',
      category: 'Data Engineering',
      journal: 'Springer Journal of Supercomputing',
      issn: 'ISSN: 0920-8542',
      year: 2024,
      contributors: 'Swetha Raghavan, Dr. Meena Sundarajan',
      mentors: 'Dr. Meena Sundarajan',
      abstract: 'This journal details a lightweight stream clustering paradigm designed for resource-constrained nodes. We demonstrate our technique on high-frequency weather station sensors, optimizing CPU utilization by 42% while retaining high cluster purity compared to traditional k-means streaming pipelines.',
      url: 'https://doi.org/10.1007/s11227-024-05678-x',
      authorName: 'Swetha Raghavan',
      authorId: 'student_seed_2',
      authorRole: 'student',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PUBLICATIONS));
    }
  }

  function getPublications() {
    init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function savePublications(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  // Sync with Supabase table 'publications' if available
  async function fetchAsync() {
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase
          .from('publications')
          .select('*')
          .order('year', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            category: item.category,
            journal: item.journal_name,
            issn: item.issn_isbn,
            year: item.year,
            contributors: item.contributors,
            mentors: item.mentors || '',
            abstract: item.abstract,
            url: item.url || '',
            authorName: item.author_name,
            authorId: item.author_id,
            authorRole: item.author_role,
            createdAt: item.created_at
          }));
          savePublications(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase publications fetch skipped/failed, using cache:', err);
      }
    }
    return getPublications();
  }

  async function createPublication(item) {
    const items = getPublications();
    const newPub = {
      id: 'pub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: item.title.trim(),
      type: item.type,
      category: item.category,
      journal: item.journal.trim(),
      issn: item.issn.trim(),
      year: parseInt(item.year),
      contributors: item.contributors.trim(),
      mentors: (item.mentors || '').trim(),
      abstract: item.abstract.trim(),
      url: (item.url || '').trim(),
      authorName: item.authorName || 'Guest User',
      authorId: item.authorId || 'anonymous',
      authorRole: item.authorRole || 'student',
      createdAt: new Date().toISOString()
    };

    items.unshift(newPub);
    savePublications(items);

    // Try syncing to Supabase
    if (window.supabase && item.authorId && item.authorId !== 'anonymous') {
      try {
        await window.supabase
          .from('publications')
          .insert([{
            title: newPub.title,
            type: newPub.type,
            category: newPub.category,
            journal_name: newPub.journal,
            issn_isbn: newPub.issn,
            year: newPub.year,
            contributors: newPub.contributors,
            mentors: newPub.mentors || null,
            abstract: newPub.abstract,
            url: newPub.url || null,
            author_name: newPub.authorName,
            author_id: newPub.authorId,
            author_role: newPub.authorRole
          }]);
      } catch (err) {
        console.warn('Supabase publications insert skipped/failed:', err);
      }
    }

    return newPub;
  }

  return {
    getPublications,
    fetchAsync,
    createPublication
  };
})();

// DOM Interactions and Renderers
document.addEventListener('DOMContentLoaded', async () => {
  // Try fetching async from database first
  await PubDB.fetchAsync();
  
  // Set up login prompt visibility
  checkAuthAndSession();

  // Initial Render
  renderPublications();

  // Form type changer to customize labels dynamically
  const formType = document.getElementById('formType');
  if (formType) {
    formType.addEventListener('change', (e) => {
      const type = e.target.value;
      const journalLabel = document.getElementById('journalLabel');
      const issnLabel = document.getElementById('issnLabel');
      const formJournal = document.getElementById('formJournal');
      const formIssn = document.getElementById('formIssn');
      
      if (type === 'patent') {
        journalLabel.textContent = 'Patent Office / Authority Name *';
        formJournal.placeholder = 'e.g. United States Patent and Trademark Office (USPTO) or IPO';
        issnLabel.textContent = 'Patent Registration or Application Number *';
        formIssn.placeholder = 'e.g. Patent No: US-11928372-B2';
      } else {
        journalLabel.textContent = 'Journal / Conference Name *';
        formJournal.placeholder = 'e.g. IEEE Access or Springer Journal';
        issnLabel.textContent = 'ISSN / ISBN Number *';
        formIssn.placeholder = 'e.g. ISSN: 2169-3536';
      }
    });
  }

  // Modal Open/Close Event Listeners
  const openModalBtn = document.getElementById('openSubmitModalBtn');
  const submitModal = document.getElementById('submitModal');
  const closeModalBtn = document.getElementById('closeSubmitModal');
  const cancelBtn = document.getElementById('cancelSubmit');

  if (openModalBtn && submitModal) {
    openModalBtn.addEventListener('click', () => {
      submitModal.classList.add('open');
      // Autofill Year
      document.getElementById('formYear').value = new Date().getFullYear();
    });
  }

  const hideModal = () => {
    if (submitModal) submitModal.classList.remove('open');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
  if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

  // Filter Bindings
  const searchInput = document.getElementById('pubSearchInput');
  const typeSelect = document.getElementById('typeSelect');
  const topicPills = document.getElementById('topicPills');
  const yearPills = document.getElementById('yearPills');

  let activeTopic = 'all';
  let activeYear = 'all';

  if (searchInput) searchInput.addEventListener('input', renderPublications);
  if (typeSelect) typeSelect.addEventListener('change', renderPublications);

  if (topicPills) {
    topicPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      topicPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeTopic = btn.dataset.topic;
      renderPublications();
    });
  }

  if (yearPills) {
    yearPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      yearPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active-gold'));
      btn.classList.add('active-gold');
      activeYear = btn.dataset.year;
      renderPublications();
    });
  }

  // Handle Form Submission
  const submitForm = document.getElementById('pubSubmitForm');
  if (submitForm) {
    submitForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user = window.Auth ? window.Auth.currentUser() : null;
      
      const newPubData = {
        title: document.getElementById('formTitle').value,
        type: document.getElementById('formType').value,
        category: document.getElementById('formCategory').value,
        journal: document.getElementById('formJournal').value,
        issn: document.getElementById('formIssn').value,
        year: document.getElementById('formYear').value,
        url: document.getElementById('formUrl').value,
        contributors: document.getElementById('formContributors').value,
        mentors: document.getElementById('formMentors').value,
        abstract: document.getElementById('formAbstract').value,
        authorName: user ? user.name : 'Guest Scholar',
        authorId: user ? (user.id || user.userId) : 'anonymous',
        authorRole: user ? user.role : 'student'
      };

      await PubDB.createPublication(newPubData);
      submitForm.reset();
      hideModal();
      renderPublications();
    });
  }

  // Dynamic Publications Grid Render Function
  function renderPublications() {
    const list = PubDB.getPublications();
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const selectedType = typeSelect ? typeSelect.value : 'all';

    // Filters
    const filtered = list.filter(pub => {
      // Search matching
      const matchesSearch = 
        pub.title.toLowerCase().includes(query) ||
        pub.contributors.toLowerCase().includes(query) ||
        pub.journal.toLowerCase().includes(query) ||
        pub.issn.toLowerCase().includes(query) ||
        (pub.mentors && pub.mentors.toLowerCase().includes(query));

      // Type matching
      const matchesType = selectedType === 'all' || pub.type === selectedType;

      // Topic matching
      const matchesTopic = activeTopic === 'all' || pub.category === activeTopic;

      // Year matching
      let matchesYear = true;
      if (activeYear !== 'all') {
        if (activeYear === 'before-2024') {
          matchesYear = pub.year < 2024;
        } else {
          matchesYear = pub.year === parseInt(activeYear);
        }
      }

      return matchesSearch && matchesType && matchesTopic && matchesYear;
    });

    const grid = document.getElementById('publicationsGrid');
    if (!grid) return;

    // Update Stats Card Live
    updateStats(list);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-publications">
          <i class="fa-solid fa-file-circle-question"></i>
          <h3>No Publications Found</h3>
          <p>We couldn't find any papers matching your selected year, topic, or search terms. Try modifying your filters!</p>
        </div>`;
      return;
    }

    const isLoggedIn = !!(window.Auth && window.Auth.currentUser());

    grid.innerHTML = filtered.map(pub => {
      // Map icons to types
      let typeIcon = 'fa-file-invoice';
      let typeLabel = 'Publication';
      if (pub.type === 'journal') { typeIcon = 'fa-file-lines'; typeLabel = 'Journal'; }
      else if (pub.type === 'patent') { typeIcon = 'fa-award'; typeLabel = 'Patent'; }
      else if (pub.type === 'conference') { typeIcon = 'fa-users-rectangle'; typeLabel = 'Conference Paper'; }
      else if (pub.type === 'book_chapter') { typeIcon = 'fa-book-open'; typeLabel = 'Book Chapter'; }

      // Extra external links
      const linkHtml = pub.url 
        ? `<a href="${pub.url}" target="_blank" class="btn-link-action" onclick="event.stopPropagation();"><i class="fa-solid fa-arrow-up-right-from-square"></i> Read Full Text</a>`
        : `<span style="font-size:0.8rem;color:#94a3b8;font-weight:600;"><i class="fa-solid fa-circle-info"></i> Abstract View Only</span>`;

      const guideHtml = pub.mentors 
        ? `<div class="pub-meta-item"><i class="fa-solid fa-chalkboard-user"></i> Guided by: <strong style="color:#1e293b;">${pub.mentors}</strong></div>`
        : '';

      const detailJournalLabel = pub.type === 'patent' ? 'Patent Office / Authority' : 'Journal / Conference';
      const detailNumberLabel = pub.type === 'patent' ? 'Patent / Registration No.' : 'ISSN / ISBN Index';

      // Restrict details drawer contents for guest users
      const detailsDrawerContent = isLoggedIn ? `
        <div class="details-grid">
          <div class="details-cell">
            <div class="details-cell-label">${detailJournalLabel}</div>
            <div class="details-cell-value">${pub.journal}</div>
          </div>
          <div class="details-cell">
            <div class="details-cell-label">${detailNumberLabel}</div>
            <div class="details-cell-value">${pub.issn}</div>
          </div>
        </div>

        <div class="abstract-box">
          <h4>Abstract Summary</h4>
          <p>${pub.abstract}</p>
        </div>

        <div class="pub-card-actions">
          ${linkHtml}
          <span style="font-size:0.75rem;color:#94a3b8;font-weight:500;">Submitted by: ${pub.authorName} (${pub.authorRole})</span>
        </div>
      ` : `
        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; margin-bottom: 0.5rem; cursor: default;" onclick="event.stopPropagation();">
          <i class="fa-solid fa-lock" style="font-size: 1.8rem; color: #94a3b8; margin-bottom: 0.75rem; display: block;"></i>
          <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; color: var(--primary-navy); margin-bottom: 0.35rem; font-weight: 700;">Access Restricted to CSE Members</h4>
          <p style="font-size: 0.85rem; color: #64748b; max-width: 420px; margin: 0 auto 1.25rem auto; line-height: 1.5;">
            To read the full abstract, indexing codes, contributors guides, and access official DOI full-text links, please sign in with your student or faculty account.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <a href="student-corner.html" class="btn btn-blue btn-sm" style="padding: 0.5rem 1.2rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none;"><i class="fa-solid fa-user-graduate"></i> Student Login</a>
            <a href="teachers-corner.html" class="btn btn-primary btn-sm" style="background: var(--primary-navy); border-color: var(--primary-navy); padding: 0.5rem 1.2rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none;"><i class="fa-solid fa-chalkboard-user"></i> Faculty Login</a>
          </div>
        </div>
      `;

      const expandIndicatorText = isLoggedIn ? 'View Details' : '🔒 Read Full Paper';

      return `
        <div class="pub-card type-${pub.type}" data-id="${pub.id}" onclick="toggleCard(this)">
          <div class="pub-card-header">
            <div class="pub-badges">
              <span class="badge badge-${pub.type}"><i class="fa-solid ${typeIcon}"></i> ${typeLabel}</span>
              <span class="badge badge-topic">${pub.category}</span>
            </div>
            <span class="pub-year">${pub.year}</span>
          </div>

          <h3 class="pub-title">${pub.title}</h3>

          <div class="pub-meta-line">
            <div class="pub-meta-item">
              <i class="fa-solid fa-user-pen"></i> Authors: <span class="pub-contributors">${pub.contributors}</span>
            </div>
            ${guideHtml}
          </div>

          <!-- Animated Expanded Content Drawer -->
          <div class="pub-details-drawer">
            ${detailsDrawerContent}
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:0.25rem;">
            <span class="expand-indicator">
              <span>${expandIndicatorText}</span>
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </div>

        </div>`;
    }).join('');
  }

  // Update metrics dashboard counters dynamically
  function updateStats(items) {
    const total = items.length;
    const patents = items.filter(i => i.type === 'patent').length;
    const journals = items.filter(i => i.type !== 'patent').length;
    
    // Guided counts include any papers guides list or guide guides are listed
    const guided = items.filter(i => i.mentors && i.mentors.trim().length > 0).length;

    document.getElementById('statsTotal').textContent = total;
    document.getElementById('statsPatents').textContent = patents;
    document.getElementById('statsJournals').textContent = journals;
    document.getElementById('statsFaculty').textContent = guided;
  }

  // Authenticated checks
  function checkAuthAndSession() {
    const user = window.Auth ? window.Auth.currentUser() : null;
    const authBanner = document.getElementById('authBannerPrompt');
    const userActiveBanner = document.getElementById('userActivePrompt');
    const loggedUserName = document.getElementById('loggedUserName');

    if (user) {
      if (authBanner) authBanner.style.display = 'none';
      if (userActiveBanner) userActiveBanner.style.display = 'flex';
      if (loggedUserName) loggedUserName.textContent = user.name + ` (${user.role})`;
    } else {
      if (authBanner) authBanner.style.display = 'flex';
      if (userActiveBanner) userActiveBanner.style.display = 'none';
    }
  }
});

// Card Toggle Global Function
window.toggleCard = (cardElement) => {
  const isExpanded = cardElement.classList.contains('expanded');
  const isLoggedIn = !!(window.Auth && window.Auth.currentUser());
  const defaultText = isLoggedIn ? 'View Details' : '🔒 Read Full Paper';
  const activeText = isLoggedIn ? 'Collapse Details' : 'Collapse Drawer';

  // Collapse all other cards first for clean tech dashboard accordion view
  document.querySelectorAll('.pub-card').forEach(c => {
    c.classList.remove('expanded');
    const ind = c.querySelector('.expand-indicator span');
    if (ind) {
      ind.textContent = defaultText;
    }
  });

  if (!isExpanded) {
    cardElement.classList.add('expanded');
    const ind = cardElement.querySelector('.expand-indicator span');
    if (ind) ind.textContent = activeText;
  }
};

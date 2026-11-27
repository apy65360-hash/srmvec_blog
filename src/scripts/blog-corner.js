/* ===================================================
   BLOG CORNER CAROUSEL — blog-corner.js
   Home page sliding carousel — max 5 top blogs
   With Live Storage & Event Synchronization
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const track    = document.getElementById('blogCarouselTrack');
  const prevBtn  = document.getElementById('blogCarouselPrev');
  const nextBtn  = document.getElementById('blogCarouselNext');
  const dotsWrap = document.getElementById('blogCarouselDots');

  if (!track) return;

  let current = 0;
  let timer   = null;
  let blogs   = [];

  function renderCarousel() {
    if (typeof window.BlogDB === 'undefined') return;

    window.BlogDB.init();
    blogs = window.BlogDB.getTopBlogs(5);

    track.innerHTML = '';
    if (dotsWrap) dotsWrap.innerHTML = '';

    if (blogs.length === 0) {
      track.innerHTML = '<p style="color:#64748b;padding:2rem;text-align:center;width:100%;">No blog posts yet. Be the first to post!</p>';
      return;
    }

    // Build cards
    blogs.forEach((blog, i) => {
      const isNew      = (Date.now() - new Date(blog.createdAt)) < 7 * 24 * 60 * 60 * 1000;
      const isTrending = (blog.views || 0) >= 200;
      const badge = isTrending ? '<span class="blog-badge trending">🔥 Trending</span>'
                  : isNew      ? '<span class="blog-badge new-post">✨ New</span>'
                  :              '';

      const tagPills = (blog.tags || []).slice(0, 3)
        .map(t => `<span class="blog-tag-pill">${t}</span>`).join('');

      const card = document.createElement('div');
      card.className = 'blog-carousel-card' + (i === 0 ? ' active' : '');
      card.setAttribute('data-index', i);
      card.innerHTML = `
        ${badge}
        <div class="blog-card-meta">
          <span class="blog-card-category">${blog.category || 'Tech'}</span>
          <span class="blog-card-date">${window.BlogDB.formatDate(blog.createdAt)}</span>
        </div>
        <h3 class="blog-card-title"><a href="blog-view.html?id=${blog.id}" style="color:inherit;text-decoration:none;">${blog.title}</a></h3>
        <p class="blog-card-excerpt">${window.BlogDB.truncate(blog.content, 120)}</p>
        <div class="blog-card-tags">${tagPills}</div>
        <div class="blog-card-footer">
          <span class="blog-card-author"><i class="fa-solid fa-user-pen"></i> ${blog.author}</span>
          <a href="blog-view.html?id=${blog.id}" class="blog-read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      `;
      track.appendChild(card);

      // Dot indicator
      if (dotsWrap) {
        const dot = document.createElement('button');
        dot.className = 'blog-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to blog ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    });

    current = 0;
    startAuto();
  }

  function goTo(idx) {
    const cards = track.querySelectorAll('.blog-carousel-card');
    const dots  = dotsWrap ? dotsWrap.querySelectorAll('.blog-dot') : [];
    if (!cards.length) return;

    if (cards[current]) cards[current].classList.remove('active');
    if (dots[current])  dots[current].classList.remove('active');

    current = (idx + blogs.length) % blogs.length;

    if (cards[current]) cards[current].classList.add('active');
    if (dots[current])  dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    if (blogs.length > 1) {
      timer = setInterval(() => goTo(current + 1), 5000);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  renderCarousel();

  // Live reload on blog modifications
  window.addEventListener('storage', (e) => {
    if (e.key === 'srmvec_blogs' || e.key === 'srmvec_blogs_last_update') {
      renderCarousel();
    }
  });

  window.addEventListener('srmvec:blogs-updated', () => {
    renderCarousel();
  });
});

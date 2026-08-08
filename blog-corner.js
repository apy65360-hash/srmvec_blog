/* ===================================================
   BLOG CORNER CAROUSEL — blog-corner.js
   Home page sliding carousel — max 5 top blogs
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const track    = document.getElementById('blogCarouselTrack');
  const prevBtn  = document.getElementById('blogCarouselPrev');
  const nextBtn  = document.getElementById('blogCarouselNext');
  const dotsWrap = document.getElementById('blogCarouselDots');

  if (!track) return;

  BlogDB.init();
  const blogs = BlogDB.getTopBlogs(5);

  if (blogs.length === 0) {
    track.innerHTML = '<p style="color:#64748b;padding:2rem;text-align:center;">No blog posts yet. Be the first to post!</p>';
    return;
  }

  // Build cards
  blogs.forEach((blog, i) => {
    const isNew      = (Date.now() - new Date(blog.createdAt)) < 3 * 24 * 60 * 60 * 1000;
    const isTrending = blog.views >= 200;
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
        <span class="blog-card-category">${blog.category}</span>
        <span class="blog-card-date">${BlogDB.formatDate(blog.createdAt)}</span>
      </div>
      <h3 class="blog-card-title">${blog.title}</h3>
      <p class="blog-card-excerpt">${BlogDB.truncate(blog.content, 120)}</p>
      <div class="blog-card-tags">${tagPills}</div>
      <div class="blog-card-footer">
        <span class="blog-card-author"><i class="fa-solid fa-user-pen"></i> ${blog.author}</span>
        <a href="blog-view.html?id=${blog.id}" class="blog-read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    `;
    track.appendChild(card);

    // Dot indicator
    const dot = document.createElement('button');
    dot.className = 'blog-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to blog ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const cards = track.querySelectorAll('.blog-carousel-card');
  const dots  = dotsWrap.querySelectorAll('.blog-dot');
  let current = 0;
  let timer   = null;

  function goTo(idx) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + blogs.length) % blogs.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  startAuto();
});

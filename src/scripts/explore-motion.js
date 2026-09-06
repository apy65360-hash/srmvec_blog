/**
 * 3D Moving Motion Portal Explorer Showcase
 * Department of Computer Science & Engineering — SRMVEC
 */

export function initExploreMotion() {
  const modal = document.getElementById('exploreMotionModal');
  const closeBtn = document.getElementById('exploreCloseBtn');
  const toggleMotionBtn = document.getElementById('toggleMotionBtn');
  const canvas = document.getElementById('exploreBgCanvas');

  if (!modal) return;

  let isPaused = false;
  let animId = null;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const tracks = modal.querySelectorAll('.motion-track');
    tracks.forEach(t => {
      t.style.animationPlayState = 'running';
    });
    startCanvasAnimation();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Expose global helper for direct JS calls
  window.open3DExplorer = openModal;
  window.close3DExplorer = closeModal;

  // Delegated click handling for any explore button across the entire page
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-hero-gold, [data-action="explore-motion"], a[href="#explore-motion"], a[href="#3d-explorer"]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Toggle Motion Play / Pause
  if (toggleMotionBtn) {
    toggleMotionBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      const tracks = modal.querySelectorAll('.motion-track');
      tracks.forEach(track => {
        track.style.animationPlayState = isPaused ? 'paused' : 'running';
      });
      toggleMotionBtn.innerHTML = isPaused
        ? '<i class="fa-solid fa-play"></i> Resume Motion'
        : '<i class="fa-solid fa-pause"></i> Pause Motion';
    });
  }

  // ── Particle Canvas Background ──
  function startCanvasAnimation() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.6 + 0.2
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Golden particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.fill();
      });

      if (modal.classList.contains('open')) {
        animId = requestAnimationFrame(draw);
      }
    }

    draw();
  }
}

// Immediate & resilient execution logic
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExploreMotion);
} else {
  initExploreMotion();
}

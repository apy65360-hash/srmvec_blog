/* --- HIGH-TECH ANIMATED GRAPHICAL CANVAS & SLIDER ENGINE --- */
document.addEventListener('DOMContentLoaded', () => {
  // 1. ANIMATED TECH CANVAS ENGINE
  const canvas = document.getElementById('heroTechCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let activeMode = 0;
    let transitionProgress = 1;

    // Node Mesh Data (Mode 0)
    const nodeCount = Math.min(Math.floor(width / 18), 70);
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Grid Data (Mode 1)
    let gridOffset = 0;

    // Quantum Particles (Mode 2)
    const particleCount = 80;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * Math.min(width, height) * 0.4 + 50,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', handleResize);

    // Color palettes per mode
    const palettes = [
      { primary: 'rgba(14, 165, 233,', secondary: 'rgba(59, 130, 246,', bg: '#020B18' }, // Cyan / Blue
      { primary: 'rgba(168, 85, 247,', secondary: 'rgba(99, 102, 241,', bg: '#08051A' }, // Purple / Violet
      { primary: 'rgba(16, 185, 129,', secondary: 'rgba(6, 182, 212,', bg: '#021215' }   // Emerald / Cyan
    ];

    function drawMode0(time) {
      // Cyber Neural Mesh Animation
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += 0.03;
        const currentRadius = n.radius + Math.sin(n.pulse) * 0.8;

        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, 0.8)`;
        ctx.fill();

        // Connect nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            const alpha = (1 - dist / 130) * 0.45;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Light signal pulse along line
            if (Math.random() < 0.003) {
              const pX = n.x + (n2.x - n.x) * ((time * 0.001) % 1);
              const pY = n.y + (n2.y - n.y) * ((time * 0.001) % 1);
              ctx.beginPath();
              ctx.arc(pX, pY, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.fill();
            }
          }
        }
      }
    }

    function drawMode1(time) {
      // Perspective Cyber Grid & Waves
      gridOffset = (gridOffset + 1.2) % 40;
      const horizonY = height * 0.35;

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 1;

      // Perspective vertical lines
      const perspectiveLines = 24;
      const centerX = width / 2;
      for (let i = -perspectiveLines; i <= perspectiveLines; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * 20, horizonY);
        ctx.lineTo(centerX + i * 70, height);
        ctx.stroke();
      }

      // Horizontal grid lines moving forward
      for (let y = horizonY; y < height; y += 25 + (y - horizonY) * 0.1) {
        ctx.beginPath();
        ctx.moveTo(0, y + (gridOffset % 25));
        ctx.lineTo(width, y + (gridOffset % 25));
        ctx.stroke();
      }

      // Wave pulses
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const waveY = horizonY + Math.sin(x * 0.01 + time * 0.003) * 35;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function drawMode2(time) {
      // Quantum Particle Constellation Orbit
      const centerX = width * 0.65;
      const centerY = height * 0.5;

      particles.forEach((p) => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * (p.radius * 0.5);

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((p2) => {
          const x2 = centerX + Math.cos(p2.angle) * p2.radius;
          const y2 = centerY + Math.sin(p2.angle) * (p2.radius * 0.5);
          const dist = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        });
      });
    }

    function render(time) {
      const palette = palettes[activeMode] || palettes[0];
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      if (activeMode === 0) drawMode0(time);
      else if (activeMode === 1) drawMode1(time);
      else if (activeMode === 2) drawMode2(time);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    window.setHeroCanvasMode = function (modeIndex) {
      activeMode = modeIndex % palettes.length;
    };
  }

  // 2. HERO SLIDER CONTROLLER
  const slides = document.querySelectorAll('.hero-slide');
  const dashes = document.querySelectorAll('.hero-slider-dashes .dash');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideTimer = null;

    function showSlide(index) {
      slides.forEach((s) => s.classList.remove('active'));
      dashes.forEach((d) => d.classList.remove('active'));

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dashes[currentSlide]) {
        dashes[currentSlide].classList.add('active');
      }

      if (window.setHeroCanvasMode) {
        window.setHeroCanvasMode(currentSlide);
      }
    }

    function startAutoSlide() {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 7000);
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startAutoSlide();
      });

      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startAutoSlide();
      });
    }

    dashes.forEach((dash, idx) => {
      dash.addEventListener('click', () => {
        showSlide(idx);
        startAutoSlide();
      });
    });

    startAutoSlide();
  }

  // 3. STAT COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 40));

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
              } else {
                el.textContent = current + suffix;
              }
            }, 30);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    statNumbers.forEach((num) => observer.observe(num));
  }
});

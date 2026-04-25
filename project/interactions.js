/* ============================================================
   Page interactions — Lenis smooth scroll + scroll-driven anims
   ============================================================ */
(function () {
  // ---------- Smooth scroll ----------
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis.destroy();
      lenis = null;
    }
  }

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function onScroll(cb) {
    if (lenis) lenis.on('scroll', cb);
    else window.addEventListener('scroll', cb, { passive: true });
  }

  // ---------- Reveal-on-scroll (IntersectionObserver) ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        setTimeout(() => el.classList.add('in'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  $$('[data-reveal]').forEach((el) => revealObserver.observe(el));

  // Staggered children
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const items = $$('[data-stagger-item]', e.target);
        items.forEach((it, i) => setTimeout(() => it.classList.add('in'), i * 70));
        staggerObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-stagger]').forEach((el) => staggerObserver.observe(el));

  // Hero lines
  const hero = $('.hero h1.reveal-lines');
  if (hero) requestAnimationFrame(() => hero.classList.add('in'));

  // ---------- Parallax (background slower than foreground) ----------
  const parallaxEls = $$('[data-parallax]').map((el) => ({
    el, speed: parseFloat(el.dataset.parallax) || 0.2,
  }));

  // ---------- Bumblebee parable — word-by-word + bee path ----------
  const parable = $('#parable');
  const parableWords = parable ? $$('[data-word]', parable) : [];
  const bee = parable ? $('.parable-bee', parable) : null;

  // ---------- Horizontal work scroll ----------
  const hStage = $('.h-scroll-stage');
  const hTrack = $('#h-track');
  const hProgress = $('#h-progress');
  let hMaxTranslate = 0;
  function computeTrackWidth() {
    if (!hTrack || !hStage) return;
    const vw = window.innerWidth;
    hMaxTranslate = Math.max(0, hTrack.scrollWidth - vw);
  }
  computeTrackWidth();
  window.addEventListener('resize', computeTrackWidth);

  // ---------- Pinned Process — step reveals based on progress ----------
  const pinned = $('#process');
  const bigSteps = pinned ? $$('[data-step-reveal]', pinned) : [];

  // ---------- Nav hide on scroll down ----------
  const nav = $('.nav');
  let lastY = 0;
  // ---------- Scroll progress bar ----------
  const scrollBar = $('#scroll-progress');

  // ---------- Counters ----------
  const counters = $$('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.counter);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const t0 = performance.now();
      function tick(now) {
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = (target * eased).toFixed(dec);
        el.innerHTML = `${v}${suffix ? `<span style="color:var(--bone-400)">${suffix}</span>` : ''}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counterObserver.observe(c));

  // ---------- Master scroll handler ----------
  function update() {
    const y = window.scrollY || window.pageYOffset;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;

    // Scroll progress bar
    if (scrollBar) scrollBar.style.width = clamp(y / docH, 0, 1) * 100 + '%';

    // Nav auto-hide
    if (nav) {
      if (y > 120 && y > lastY + 6) nav.classList.add('nav-hidden');
      else if (y < lastY - 4 || y < 120) nav.classList.remove('nav-hidden');
      lastY = y;
    }

    // Parallax
    for (const p of parallaxEls) {
      const rect = p.el.getBoundingClientRect();
      const centerDelta = (rect.top + rect.height / 2) - vh / 2;
      const ty = -centerDelta * p.speed;
      p.el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
    }

    // Parable
    if (parable && bee) {
      const prect = parable.getBoundingClientRect();
      const total = parable.offsetHeight - vh;
      const p = clamp(-prect.top / total, 0, 1);

      // Word reveal based on progress
      const active = Math.floor(p * parableWords.length * 1.15);
      parableWords.forEach((w, i) => {
        w.classList.toggle('on', i < active);
      });

      // Bee drifts across — diagonal path with rotation
      const bx = lerp(-10, 110, p);   // % across viewport
      const by = lerp(10, 75, Math.sin(p * Math.PI)); // arc
      const rot = lerp(-8, 10, p);
      bee.style.transform = `translate(${bx}vw, ${by - 30}vh) rotate(${rot}deg) scale(${lerp(0.8, 1.2, p)})`;
    }

    // Horizontal scroll
    if (hStage && hTrack) {
      const rect = hStage.getBoundingClientRect();
      const total = hStage.offsetHeight - vh;
      const p = clamp(-rect.top / total, 0, 1);
      if (window.innerWidth > 760) {
        hTrack.style.transform = `translate3d(${(-hMaxTranslate * p).toFixed(2)}px, 0, 0)`;
      } else {
        hTrack.style.transform = '';
      }
      if (hProgress) hProgress.style.width = (p * 100).toFixed(1) + '%';
    }

    // Pinned process — reveal each step as its centerline crosses viewport mid
    if (bigSteps.length) {
      bigSteps.forEach((s) => {
        const r = s.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        if (mid < vh * 0.75 && r.bottom > vh * 0.1) s.classList.add('in');
      });
    }

    // Scroll-linked hero scale/blur
    const heroEl = $('.hero');
    if (heroEl) {
      const r = heroEl.getBoundingClientRect();
      const p = clamp(-r.top / vh, 0, 1);
      const h1 = heroEl.querySelector('h1');
      if (h1) {
        h1.style.transform = `scale(${lerp(1, 0.94, p)})`;
        h1.style.opacity = (1 - p * 0.8).toFixed(2);
        h1.style.filter = `blur(${(p * 4).toFixed(2)}px)`;
      }
    }
  }

  onScroll(update);
  window.addEventListener('resize', update);
  update();
  // Keep running via RAF too — handles non-lenis browsers more smoothly
  function tick() { update(); requestAnimationFrame(tick); }
  requestAnimationFrame(tick);

  // ---------- Email copy ----------
  $$('.email').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const mail = 'hello@divyansh.studio';
      if (navigator.clipboard) navigator.clipboard.writeText(mail).catch(() => {});
      const copy = el.querySelector('.copy');
      if (copy) {
        const prev = copy.textContent;
        copy.textContent = '✓';
        setTimeout(() => { copy.textContent = prev; }, 1600);
      }
    });
  });

  // ---------- Smooth anchor nav via Lenis ----------
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

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

  // ---------- Work card image swipes — active dot tracking ----------
  $$('[data-swipe]').forEach((swipe) => {
    const card = swipe.closest('.work-card');
    const dots = card ? $$('.work-dots span', card) : [];
    if (!dots.length) return;
    dots[0].classList.add('is-active');
    let raf = null;
    swipe.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const w = swipe.clientWidth;
        if (!w) return;
        const idx = Math.round(swipe.scrollLeft / w);
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      });
    }, { passive: true });
    // Click a dot to scroll
    dots.forEach((d, i) => {
      d.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        swipe.scrollTo({ left: swipe.clientWidth * i, behavior: 'smooth' });
      });
    });
  });

  // ---------- Pinned Process — step reveals based on progress ----------
  const pinned = $('#process');
  const bigSteps = pinned ? $$('[data-step-reveal]', pinned) : [];

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

    // (Nav stays static — no auto-hide)

    // Parallax
    for (const p of parallaxEls) {
      const rect = p.el.getBoundingClientRect();
      const centerDelta = (rect.top + rect.height / 2) - vh / 2;
      const ty = -centerDelta * p.speed;
      p.el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
    }

    // (Old horizontal-scroll work section removed; cards use per-card image swipe instead)

    // Pinned process — reveal each step as its centerline crosses viewport mid
    if (bigSteps.length) {
      bigSteps.forEach((s) => {
        const r = s.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        if (mid < vh * 0.75 && r.bottom > vh * 0.1) s.classList.add('in');
      });
    }

    // Scroll-linked hero scale/blur — lighter blur, gentler depth
    const heroEl = $('.hero');
    if (heroEl) {
      const r = heroEl.getBoundingClientRect();
      const p = clamp(-r.top / vh, 0, 1);
      const h1 = heroEl.querySelector('h1');
      if (h1) {
        h1.style.transform = `translateZ(0) scale(${lerp(1, 0.96, p)})`;
        h1.style.opacity = (1 - p * 0.55).toFixed(2);
        h1.style.filter = `blur(${(p * 1.5).toFixed(2)}px)`;
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

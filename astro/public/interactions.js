/* ============================================================
   Page interactions — parallax shadows + work card crossfade
   ============================================================ */
(function () {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Parallax shadows — cursor-driven depth (jaukia-style)
  if (!reduceMotion && !window.matchMedia('(hover: none)').matches) {
    let rafPS = null, mxPS = window.innerWidth / 2, myPS = window.innerHeight / 2;
    document.addEventListener('mousemove', function (e) {
      mxPS = e.clientX; myPS = e.clientY;
      if (rafPS) return;
      rafPS = requestAnimationFrame(function () {
        rafPS = null;
        var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        var dx = (mxPS - cx) / cx, dy = (myPS - cy) / cy;
        $$('[data-ps]').forEach(function (el) {
          var s = +(el.dataset.ps) || 12;
          el.style.setProperty('--ps-x', (-dx * s).toFixed(1) + 'px');
          el.style.setProperty('--ps-y', (-dy * s).toFixed(1) + 'px');
        });
      });
    });
  }

  // Work card image fades — auto-rotating crossfade
  $$('[data-fade]').forEach((fade, fadeIdx) => {
    const imgs = $$('img', fade);
    const card = fade.closest('.work-card');
    const dots = card ? $$('.work-dots span', card) : [];
    if (!imgs.length) return;
    let active = 0;
    imgs[0].classList.add('is-active');
    if (dots[0]) dots[0].classList.add('is-active');
    if (imgs.length < 2 || reduceMotion) return;

    const setActive = (i) => {
      imgs[active].classList.remove('is-active');
      if (dots[active]) dots[active].classList.remove('is-active');
      active = i;
      imgs[active].classList.add('is-active');
      if (dots[active]) dots[active].classList.add('is-active');
    };
    let timer = null;
    let started = false;
    const start = () => {
      if (timer) return;
      const begin = () => {
        timer = setInterval(() => setActive((active + 1) % imgs.length), 3200);
      };
      if (started) begin();
      else { started = true; setTimeout(begin, fadeIdx * 550); }
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.35 });
    io.observe(fade);

    dots.forEach((d, i) => {
      d.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        setActive(i);
      });
    });
  });
})();

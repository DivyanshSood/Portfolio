/* ============================================================
   Page interactions — work card crossfade + magnetic CTA
   ============================================================ */
(function () {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // Magnetic primary CTA — a single playful touch on the hero "See work" button.
  // Brutalism is otherwise static; one moving thing is enough.
  if (!reduceMotion && !window.matchMedia('(hover: none)').matches) {
    $$('.btn-pri').forEach((el) => {
      el.style.willChange = 'transform';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${(x * 0.15).toFixed(1)}px, ${(y * 0.18).toFixed(1)}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
})();

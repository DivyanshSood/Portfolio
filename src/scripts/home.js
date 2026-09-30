/* ===========================================================================
   Home motion — ported from Home.dc.html's component logic.
   - Intro sweep: red then ink chevron bands sweep left → right (1.5s), the
     hero clips open, the name lines rise. (Brandbook 06 Motion.)
   - Corner wedges: the diagonal is computed so it runs parallel to the
     chevron above — never a fixed % angle.
   - Pit lane: vertical scroll drives the horizontal project track, with the
     red progress bar and 01/07 counter.
   - Telemetry count-up: stats and gauges count from 0 on first view,
     1.7s exponential ease-out.
   Everything respects prefers-reduced-motion. The lap timer, start lights,
   cursor and lap bar from the design canvas are not shipped (brandbook: off
   by default / banned).
   =========================================================================== */

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function intro() {
  const d = document.documentElement;
  if (!d.classList.contains("intro")) return;
  d.classList.add("intro-run");
  const red = document.querySelector("[data-band-red]");
  const ink = document.querySelector("[data-band-ink]");
  const hr = document.querySelector("[data-hero-red]");
  const hb = document.querySelector("[data-hero-body]");
  const lines = [...document.querySelectorAll("[data-name-line]")];
  const show = () => d.classList.remove("intro");
  if (!red || !ink || !hr || !hb || !red.animate) return show();

  const D = 1500, ease = "cubic-bezier(.77,0,.18,1)";
  red.animate([{ transform: "translateX(-240vw)" }, { transform: "translateX(100vw)" }], { duration: D, easing: ease, fill: "forwards" });
  ink.animate([{ transform: "translateX(-46vw)" }, { transform: "translateX(100vw)" }], { duration: D * 0.8, delay: D * 0.32, easing: ease, fill: "forwards" });
  setTimeout(() => {
    lines.forEach((l) => { l.style.transform = "translateY(110%)"; });
    show();
    hr.animate(
      [{ clipPath: "polygon(0 0,100% 0,100% 0%,50% 0%,0 0%)" }, { clipPath: "polygon(0 0,100% 0,100% 72%,50% 100%,0 72%)" }],
      { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    lines.forEach((l, i) =>
      l.animate(
        [{ transform: "translateY(110%) skewX(-8deg)" }, { transform: "translateY(0) skewX(0)" }],
        { duration: 950, delay: 250 + i * 110, easing: "cubic-bezier(.2,.9,.1,1)", fill: "forwards" }
      ).finished.then(() => { l.style.transform = ""; l.getAnimations().forEach((a) => a.cancel()); })
    );
  }, D * 0.46);
}

function wedges() {
  const sec = document.querySelector("[data-sec-hero]");
  const r = document.querySelector("[data-hero-red]");
  const [a, b] = document.querySelectorAll("[data-wedge]");
  const lb = document.querySelector("[data-scroll-lbl]");
  if (!sec || !r || !a || !b) return;
  const k = (0.28 * r.offsetHeight) / Math.max(1, r.offsetWidth / 2);
  const hp = Math.round(a.offsetWidth * k);
  a.style.height = b.style.height = hp + "px";
  sec.style.paddingBottom = hp + 48 + "px";
  if (lb) lb.style.bottom = Math.round((lb.offsetWidth / 2 + 16) * k + 10) + "px";
}

function pitLane() {
  const o = document.querySelector("[data-work]");
  const t = document.querySelector("[data-work-track]");
  const bar = document.querySelector("[data-work-bar]");
  const count = document.querySelector("[data-work-count]");
  if (!o || !t) return { layout() {}, update() {} };
  const n = t.querySelectorAll(".wcard").length;
  o.classList.add("is-pinned");
  let dist = 0;
  return {
    layout() {
      dist = Math.max(0, t.scrollWidth - innerWidth);
      o.style.height = innerHeight + dist + "px";
    },
    update() {
      const top = o.getBoundingClientRect().top + scrollY;
      const span = Math.max(1, o.offsetHeight - innerHeight);
      const p = Math.min(1, Math.max(0, (scrollY - top) / span));
      t.style.transform = "translate3d(" + -p * dist + "px,0,0)";
      if (bar) bar.style.width = p * 100 + "%";
      if (count) count.textContent = String(1 + Math.round(p * (n - 1))).padStart(2, "0");
    },
  };
}

function telemetry() {
  const sec = document.querySelector("[data-sec-stats]");
  if (!sec || reduce() || !("IntersectionObserver" in window)) return;
  const nums = [...sec.querySelectorAll("[data-count]")];
  const gauges = [...sec.querySelectorAll("[data-gauge]")];
  nums.forEach((el) => { el.textContent = "0"; });
  gauges.forEach((g) => { g.style.width = "0%"; });
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    const t0 = performance.now(), dur = 1700;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), ez = 1 - Math.pow(2, -10 * k);
      nums.forEach((el) => {
        const v = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
        el.textContent = k === 1 ? el.dataset.count : (v * ez).toFixed(dec);
      });
      gauges.forEach((g) => { g.style.width = +g.dataset.gauge * ez + "%"; });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.3 });
  io.observe(sec);
}

export function initHome() {
  const lane = pitLane();
  const layout = () => { wedges(); lane.layout(); lane.update(); };
  let raf = 0;
  addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; lane.update(); });
  }, { passive: true });
  addEventListener("resize", layout);
  layout();
  setTimeout(layout, 400);
  document.fonts?.ready.then(layout);
  addEventListener("load", layout, { once: true });
  intro();
  telemetry();
}

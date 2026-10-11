/* ===========================================================================
   Home motion — ported from Home.dc.html's component logic.
   - No intro sweep. The hero used to sit at opacity:0 until this module ran
     (+690ms), which delayed LCP on every first visit — and every crawl and
     Lighthouse run is a first visit. The hero now paints with the HTML.
   - Corner wedges: the diagonal is computed so it runs parallel to the
     chevron above — never a fixed % angle.
   - Pit lane: vertical scroll drives the horizontal project track, with the
     red progress bar and 01/07 counter.
   - Telemetry count-up: stats and gauges count from 0 on first view,
     1.7s exponential ease-out — only when the stats start below the fold.
     If they're already on screen (a tall renderer viewport, a deep-linked
     reload) the real numbers in the HTML are left alone, so a rendered
     snapshot never captures "0".
   Everything respects prefers-reduced-motion. The lap timer, start lights,
   cursor and lap bar from the design canvas are not shipped (brandbook: off
   by default / banned).
   =========================================================================== */

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function wedges() {
  const sec = document.querySelector("[data-sec-hero]");
  const r = document.querySelector("[data-hero-red]");
  const [a, b] = document.querySelectorAll("[data-wedge]");
  if (!sec || !r || !a || !b) return;
  const k = (0.28 * r.offsetHeight) / Math.max(1, r.offsetWidth / 2);
  const hp = Math.round(a.offsetWidth * k);
  a.style.height = b.style.height = hp + "px";
  sec.style.paddingBottom = hp + 48 + "px";
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
      // Measured from the last card's box, not t.scrollWidth: content that
      // overflows a clipped card would otherwise over-scroll the track.
      const last = t.lastElementChild;
      const end = last ? last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(t).paddingRight) : t.scrollWidth;
      dist = Math.max(0, end - innerWidth);
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
  const r = sec.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) return;
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
  telemetry();
}

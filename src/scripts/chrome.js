/* ===========================================================================
   Site chrome — every page. Ported from the Home design's component logic:
   - header turns ink after 40px of scroll (or while the menu is open)
   - full-screen menu under 900px
   - IST clocks + the "Online now / Replies from 9 AM IST" availability state
   - FAQ accordions (one open at a time, the first open by default)
   =========================================================================== */

function initHeader() {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const btn = document.querySelector("[data-menu-btn]");
  const close = document.querySelector("[data-menu-close]");
  if (!header) return;

  let open = false;
  const paint = () => header.classList.toggle("is-solid", open || scrollY > 40);

  let raf = 0;
  addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; paint(); });
  }, { passive: true });
  paint();

  if (!menu || !btn) return;
  const setOpen = (v) => {
    open = v;
    menu.hidden = !v;
    btn.setAttribute("aria-expanded", String(v));
    document.body.style.overflow = v ? "hidden" : "";
    paint();
    if (v) close?.focus();
    else btn.focus({ preventScroll: true });
  };
  btn.addEventListener("click", () => setOpen(!open));
  close?.addEventListener("click", () => setOpen(false));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && open) setOpen(false); });
  matchMedia("(min-width: 900px)").addEventListener("change", (m) => { if (m.matches && open) setOpen(false); });
}

/* IST clock. [data-clock="full"] shows HH:MM:SS, [data-clock="short"] HH:MM.
   Online 9 AM–9 PM IST — the reply window the site promises. */
function initClock() {
  const full = document.querySelectorAll('[data-clock="full"]');
  const short = document.querySelectorAll('[data-clock="short"]');
  const avail = document.querySelectorAll("[data-avail]");
  const dots = document.querySelectorAll("[data-avail-dot]");
  if (!full.length && !short.length && !avail.length) return;
  const tick = () => {
    const t = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    full.forEach((el) => { el.textContent = t; });
    short.forEach((el) => { el.textContent = t.slice(0, 5); });
    const h = parseInt(t.slice(0, 2), 10);
    const online = h >= 9 && h < 21;
    avail.forEach((el) => { el.textContent = online ? "Online now" : "Replies from 9 AM IST"; });
    dots.forEach((el) => { el.style.background = online ? "#E4151F" : "#8A8A8A"; });
  };
  tick();
  setInterval(tick, 1000);
}

/* FAQ accordion — markup in src/components/brand/Faq.astro. Server-rendered
   with the first answer open, so it reads fine without JS. */
function initFaq() {
  document.querySelectorAll("[data-faq]").forEach((list) => {
    const items = [...list.querySelectorAll("[data-faq-item]")];
    const set = (item, v) => {
      const b = item.querySelector("button");
      b.setAttribute("aria-expanded", String(v));
      item.querySelector("[data-faq-a]").hidden = !v;
      const icon = item.querySelector("[data-faq-icon]");
      icon.textContent = v ? "−" : "+";
      icon.classList.toggle("is-open", v);
    };
    items.forEach((item) => {
      item.querySelector("button").addEventListener("click", () => {
        const wasOpen = item.querySelector("button").getAttribute("aria-expanded") === "true";
        items.forEach((i) => set(i, false));
        if (!wasOpen) set(item, true);
      });
    });
  });
}

export function initChrome() {
  initHeader();
  initClock();
  initFaq();
}

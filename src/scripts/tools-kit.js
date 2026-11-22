/* ===========================================================================
   Shared helpers for the free tools under /tools/ — QR codes, copy, download
   and the one analytics event the tools send.

   Imported from each tool page's bundled <script>, so Astro serves it from
   /_astro/ on our own origin (the enforced CSP allows 'self' scripts, not
   CDNs). Nothing a visitor types is sent anywhere: the only network call any
   tool makes is the GA4 `tool_use` event below, and that carries the tool's
   name and the action (copy / download / print), never the input.

   Don't render a visitor's own wa.me link as an <a href>: the delegated CTA
   tracker in BaseScripts.astro counts every wa.me click as one of the
   studio's leads (GA4 generate_lead + the Ads conversion). Open it from a
   button with openExternal() instead.
   =========================================================================== */
import qrcode from "qrcode-generator";

// The library's default turns each UTF-16 unit into one byte, which garbles
// anything outside Latin-1 (₹, Hindi). QR byte mode is read as UTF-8 by every
// phone camera, so encode as UTF-8.
const enc = new TextEncoder();
qrcode.stringToBytes = (s) => Array.from(enc.encode(s));

/** Build a QR matrix. ecl: L/M/Q/H. Throws if the text is too long. */
function make(text, ecl = "M") {
  const qr = qrcode(0, ecl);
  qr.addData(text, "Byte");
  qr.make();
  return qr;
}

/** Scalable SVG markup for `text` (4-module quiet zone, as the spec asks). */
export function qrSvg(text, { ecl = "M", dark = "#0A0A0A", light = "#FFFFFF", label = "QR code" } = {}) {
  const qr = make(text, ecl);
  const n = qr.getModuleCount();
  const q = 4;
  const size = n + q * 2;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c + q} ${r + q}h1v1h-1z`;
    }
  }
  const esc = String(label).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="${esc}"><rect width="${size}" height="${size}" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`;
}

/** Draw the QR onto a 2D context at (x, y), `px` wide, quiet zone included. */
export function drawQr(ctx, text, x, y, px, { ecl = "M", dark = "#0A0A0A", light = "#FFFFFF" } = {}) {
  const qr = make(text, ecl);
  const n = qr.getModuleCount();
  const q = 4;
  const cell = px / (n + q * 2);
  ctx.fillStyle = light;
  ctx.fillRect(x, y, px, px);
  ctx.fillStyle = dark;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      // +0.5px overlap hides hairline seams between modules when scaled.
      if (qr.isDark(r, c)) ctx.fillRect(x + (c + q) * cell, y + (r + q) * cell, cell + 0.5, cell + 0.5);
    }
  }
}

/** A standalone QR PNG (default 1024px — sharp enough to print at 8–9 cm). */
export function qrPngBlob(text, px = 1024, opts) {
  const c = document.createElement("canvas");
  c.width = c.height = px;
  drawQr(c.getContext("2d"), text, 0, 0, px, opts);
  return canvasBlob(c);
}

export function canvasBlob(canvas, type = "image/png", quality) {
  return new Promise((res) => canvas.toBlob(res, type, quality));
}

export function download(filename, blobOrText, type = "text/plain;charset=utf-8") {
  const blob = blobOrText instanceof Blob ? blobOrText : new Blob([blobOrText], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 200);
}

export function copyText(text, btn) {
  const label = btn ? btn.textContent : "";
  const done = () => {
    if (!btn) return;
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = label), 1600);
  };
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_e) { /* nothing more to try */ }
    ta.remove();
    done();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
  else fallback();
}

/** Open a visitor-built URL in a new tab without it counting as a site CTA. */
export function openExternal(url) {
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (w) w.opener = null;
}

/** GA4 `tool_use` — which tool and what was done. Never the visitor's input. */
export function track(tool, action) {
  try {
    if (typeof window.dsTrack === "function") window.dsTrack("tool_use", { tool, tool_action: action });
  } catch (_e) { /* analytics must never break a tool */ }
}

export const $ = (id) => document.getElementById(id);

/** Value of an input/select/textarea by id, trimmed. */
export const val = (id) => (($(id) && $(id).value) || "").trim();

/** Wait for the brand fonts before drawing text on a canvas. */
export async function fontsReady() {
  try { await document.fonts.ready; } catch (_e) { /* draw with fallbacks */ }
}

/** Word-wrap `text` to `maxW` px with the context's current font. */
export function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

export const escHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const slugify = (s, fallback = "file") =>
  String(s || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || fallback;

/** Lines of a textarea by id, trimmed, blanks dropped. */
export const lines = (id) => val(id).split("\n").map((s) => s.trim()).filter(Boolean);

/** Bind every input/select/textarea inside `form` to `fn`, then call it once. */
export function live(form, fn, tool) {
  let touched = false;
  const el = typeof form === "string" ? $(form) : form;
  el.addEventListener("input", () => {
    fn();
    if (tool && !touched) { touched = true; track(tool, "edit"); }
  });
  el.addEventListener("change", fn);
  fn();
}

/* ---- Minimal ZIP writer (store, no compression) ----------------------------
   Enough for a favicon pack or a batch of already-compressed images; avoids
   pulling a zip library into the bundle. files: [{ name, data: Uint8Array }] */
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(b) {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
export function zip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = f.data;
    const crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint16(8, 0, true); h.setUint32(14, crc, true);
    h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
    c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const size = central.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, size, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)], { type: "application/zip" });
}

/** Print only `node` (an element or an image data URL), then clean up. */
export function printOnly(node) {
  document.querySelectorAll(".tk-print").forEach((n) => n.remove());
  const holder = document.createElement("div");
  holder.className = "tk-print";
  holder.appendChild(node);
  document.body.appendChild(holder);
  document.body.classList.add("tk-printing");
  const cleanup = () => { document.body.classList.remove("tk-printing"); holder.remove(); window.removeEventListener("afterprint", cleanup); };
  window.addEventListener("afterprint", cleanup);
  const go = () => window.print();
  const img = node.tagName === "IMG" ? node : null;
  if (img && !img.complete) img.onload = go; else go();
}

/* ---- Printable A6 QR card (UPI, contact card) ------------------------------
   Same layout as the review card: colour band with the business name, a
   headline, a line under it, the QR centred in the space left, and an
   optional credit that never touches the QR's quiet zone. 1240×1748 = A6 at
   300 dpi. */
export function drawCard(canvas, { colour = "#0A0A0A", name = "", head = "", sub = "", qr = "", foot = "", credit = true, ecl = "Q" }) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const DISPLAY = (getComputedStyle(document.documentElement).getPropertyValue("--display") || "sans-serif").trim();
  const n = parseInt(colour.slice(1), 16);
  const lum = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = colour; ctx.fillRect(0, 0, W, 330);
  ctx.fillStyle = lum < 150 ? "#FFFFFF" : "#0A0A0A";
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.font = `800 72px ${DISPLAY}`;
  const nl = wrap(ctx, name || "Your business name", W - 160).slice(0, 2);
  nl.forEach((l, i) => ctx.fillText(l, W / 2, (nl.length > 1 ? 150 : 190) + i * 86));
  ctx.fillStyle = "#0A0A0A"; ctx.font = `900 96px ${DISPLAY}`;
  const hl = wrap(ctx, head, W - 160).slice(0, 2);
  hl.forEach((l, i) => ctx.fillText(l, W / 2, 470 + i * 104));
  ctx.fillStyle = "#3E3E3E"; ctx.font = `400 44px ${DISPLAY}`;
  const subTop = 470 + hl.length * 104 + 10;
  const sl = wrap(ctx, sub, W - 220).slice(0, 3);
  sl.forEach((l, i) => ctx.fillText(l, W / 2, subTop + i * 58));
  const footH = foot ? 70 : 0;
  const textBottom = subTop + sl.length * 58;
  const room = H - 90 - footH - textBottom;
  const px = Math.min(840, room - 40);
  const y = textBottom + (room - px) / 2;
  if (qr) drawQr(ctx, qr, (W - px) / 2, y, px, { ecl });
  else {
    ctx.strokeStyle = "#DADADA"; ctx.lineWidth = 6; ctx.setLineDash([24, 18]);
    ctx.strokeRect((W - px) / 2 + 30, y + 30, px - 60, px - 60); ctx.setLineDash([]);
    ctx.fillStyle = "#9A9A9A"; ctx.font = `400 40px ${DISPLAY}`; ctx.fillText("Your QR code", W / 2, y + px / 2);
  }
  if (foot) { ctx.fillStyle = "#0A0A0A"; ctx.font = `700 40px ${DISPLAY}`; ctx.fillText(foot, W / 2, H - 90 - 10); }
  if (credit) { ctx.fillStyle = "#8A8A8A"; ctx.font = `400 26px ${DISPLAY}`; ctx.fillText("Card made free at divyanshsood.com/tools", W / 2, H - 40); }
}

/** Print a canvas at A6 size. */
export function printCanvas(canvas, alt = "Printable card") {
  const img = new Image();
  img.alt = alt;
  img.style.cssText = "width:105mm;height:148mm;display:block;margin:0 auto";
  img.src = canvas.toDataURL("image/png");
  printOnly(img);
}

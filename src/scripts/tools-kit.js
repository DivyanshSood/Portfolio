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

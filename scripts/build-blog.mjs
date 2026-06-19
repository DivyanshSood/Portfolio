// Static blog generator for divyanshsood.com
// Builds /blog/index.html + /blog/<slug>/index.html for every post in
// content/blog/*.md, matching the homepage/case-study design language
// (dark #0b0b0c, accent #ff4612, Archivo + Space Mono).
//
//   node scripts/build-blog.mjs
//
// Posts are plain Markdown with YAML frontmatter (title, description,
// pubDate, tags). Self-contained: tiny Markdown renderer below (headings,
// lists, GFM tables, blockquotes, code, links, bold/italic, hr).

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "content", "blog");
const OUT = join(ROOT, "blog");
const SITE = "https://www.divyanshsood.com";
const A = "#ff4612";
const DEFAULT_OG =
  "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Caveat:wght@600;700&display=swap";

/* ----------------------------------------------------------------------- */
/* HELPERS                                                                  */
/* ----------------------------------------------------------------------- */

const escHtml = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s = "") => escHtml(s).replace(/"/g, "&quot;");
const slugify = (s = "") =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d) {
  const dt = new Date(d + "T00:00:00Z");
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}
const iso = (d) => new Date(d + "T00:00:00Z").toISOString();

/* ---- frontmatter ------------------------------------------------------- */
function parse(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if (key === "tags") {
      data.tags = [...val.matchAll(/"([^"]*)"|'([^']*)'/g)].map((x) => x[1] ?? x[2]);
    } else {
      data[key] = val.replace(/^["']|["']$/g, "");
    }
  }
  return { data, body: m[2] };
}

/* ---- inline markdown --------------------------------------------------- */
function inline(t) {
  const codes = [];
  t = t.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `${codes.length - 1}`;
  });
  t = escHtml(t);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => {
    const ext = /^https?:\/\//.test(url);
    const rel = ext ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${escAttr(url)}"${rel} data-cursor>${txt}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  t = t.replace(/(^|[^_\w])_([^_\n]+)_/g, "$1<em>$2</em>");
  t = t.replace(/(\d+)/g, (_, n) => `<code>${escHtml(codes[n])}</code>`);
  return t;
}

/* ---- block markdown ---------------------------------------------------- */
const isSep = (l) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes("-");
const splitRow = (r) =>
  r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

function renderMarkdown(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = Math.min(Math.max(h[1].length, 2), 6);
      out.push(`<h${lvl} id="${slugify(h[2])}">${inline(h[2].trim())}</h${lvl}>`);
      i++; continue;
    }

    if (/^```/.test(line)) {
      i++; const buf = [];
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; out.push(`<pre><code>${escHtml(buf.join("\n"))}</code></pre>`); continue;
    }

    if (line.includes("|") && i + 1 < lines.length && isSep(lines[i + 1])) {
      const headers = splitRow(line);
      i += 2; const rows = [];
      while (i < lines.length && lines[i].includes("|") && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i])); i++;
      }
      out.push(
        `<div class="post-table"><table><thead><tr>${headers
          .map((c) => `<th>${inline(c)}</th>`)
          .join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`
      );
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`); continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`); continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      out.push(`<ol>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ol>`); continue;
    }

    const buf = [line]; i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^\s*(#{1,6}\s|>|[-*]\s|\d+\.\s|```|\|)/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) { buf.push(lines[i]); i++; }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

const readingTime = (body) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));

/* deterministic gradient per slug, for cards / hero without a cover image */
function gradient(slug) {
  let n = 0;
  for (const c of slug) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  const palettes = [
    "linear-gradient(150deg,#ff4612 0%,#7a1e00 100%)",
    "linear-gradient(150deg,#1f1f23 0%,#0b0b0c 100%)",
    "linear-gradient(150deg,#3a2a1a 0%,#0b0b0c 100%)",
    "linear-gradient(150deg,#ff4612 0%,#1f1f23 100%)",
    "linear-gradient(150deg,#2a1206 0%,#0b0b0c 100%)",
  ];
  return palettes[n % palettes.length];
}

/* ----------------------------------------------------------------------- */
/* SHARED CHROME (matches build-projects.mjs)                               */
/* ----------------------------------------------------------------------- */

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230b0b0c'/%3E%3Ctext x='50' y='70' font-family='Arial,sans-serif' font-weight='900' font-size='56' fill='%23ffffff' text-anchor='middle'%3EDS%3C/text%3E%3Crect x='28' y='80' width='44' height='6' fill='%23ff4612'/%3E%3C/svg%3E";

const NAV = (kicker) => `  <nav id="ds-nav">
    <div style="display:flex;align-items:center;gap:14px;">
      <a href="/" class="brand">DIVYANSH&nbsp;SOOD<sup style="font-size:9px;top:-.7em;">®</sup></a>
      <span class="kicker">${kicker}</span>
    </div>
    <div style="display:flex;align-items:center;gap:30px;">
      <div class="nav-links">
        <a href="/#work">Works</a>
        <a href="/blog/">Blog</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </div>
      <a href="/#contact" data-cursor class="nav-cta">Start a project <span aria-hidden="true">↗</span></a>
    </div>
  </nav>`;

const FOOTER = `  <footer class="cs-foot">
    <div class="wrap">
      <div class="grid">
        <div>
          <div class="word">DIVYANSH SOOD<sup style="font-size:13px;top:-1em;">®</sup></div>
          <div class="sig">Divyansh Sood</div>
        </div>
        <div class="col">
          <div class="h">Navigate</div>
          <a href="/">Home</a>
          <a href="/#work">Works</a>
          <a href="/#contact">Contact</a>
          <a href="/blog/">Blog</a>
          <a href="https://www.divyanshsood.com" target="_blank" rel="noopener">divyanshsood.com ↗</a>
        </div>
        <div class="col">
          <div class="h">Studio</div>
          <span style="opacity:.82;">Himachal Pradesh,<br>India · Worldwide</span>
          <div style="margin-top:16px;display:flex;gap:16px;opacity:.82;">
            <a href="https://github.com/DivyanshSood" target="_blank" rel="noopener" style="display:inline;">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/divyansh-sood-023556151/" target="_blank" rel="noopener" style="display:inline;">LinkedIn ↗</a>
          </div>
        </div>
      </div>
      <div class="bar">
        <span>© 2026 Divyansh Sood Studio</span><span>Designed &amp; built with intent</span><a href="#" data-cursor style="color:#fff;text-decoration:none;">Back to top ↑</a>
      </div>
    </div>
  </footer>`;

const SCRIPT = `<script>
(function(){
  var root=document.getElementById('ds-root');if(!root)return;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  try{
    if(reduce){root.querySelectorAll('[data-reveal]').forEach(function(el){el.style.opacity='1';el.style.transform='none';});}
    else{var io=new IntersectionObserver(function(ents){ents.forEach(function(e){if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});root.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el);});}
  }catch(e){root.querySelectorAll('[data-reveal]').forEach(function(el){el.style.opacity='1';el.style.transform='none';});}
  var cur=document.getElementById('ds-cursor');
  var fine=window.matchMedia('(pointer:fine)').matches;
  if(cur&&!fine)cur.style.display='none';
  if(fine&&cur){
    root.querySelectorAll('a,button,[data-cursor]').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('big');});el.addEventListener('mouseleave',function(){cur.classList.remove('big');});});
    var tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
    (function tick(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';requestAnimationFrame(tick);})();
  }
  var nav=document.getElementById('ds-nav');
  function onScroll(){if(!nav)return;if(scrollY>40){nav.style.background='rgba(11,11,12,.82)';nav.style.backdropFilter='blur(10px)';nav.style.webkitBackdropFilter='blur(10px)';nav.style.borderBottomColor='rgba(255,255,255,.12)';}else{nav.style.background='transparent';nav.style.backdropFilter='none';nav.style.webkitBackdropFilter='none';nav.style.borderBottomColor='transparent';}}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
</script>`;

const STYLE = `<style>
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  html,body{margin:0;padding:0;}
  body{background:#0b0b0c;color:#fff;font-family:'Archivo',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  #ds-root{--accent:${A};position:relative;}
  ::selection{background:var(--accent);color:#fff;}
  a{color:inherit;}
  img{display:block;max-width:100%;}
  .mono{font-family:'Space Mono',monospace;}
  .wrap{max-width:1180px;margin:0 auto;padding:0 30px;}
  .narrow{max-width:760px;}
  #ds-cursor{position:fixed;top:0;left:0;width:34px;height:34px;border:1.5px solid #fff;border-radius:50%;pointer-events:none;z-index:9999;mix-blend-mode:difference;transition:width .25s ease,height .25s ease,background .25s ease;will-change:transform;}
  #ds-cursor.big{width:74px;height:74px;background:#fff;}
  #ds-nav{position:fixed;top:0;left:0;width:100%;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:16px 30px;transition:background .4s ease,border-color .4s ease,backdrop-filter .4s ease;border-bottom:1px solid transparent;}
  #ds-nav .brand{font-weight:900;font-size:19px;letter-spacing:-.04em;color:#fff;text-decoration:none;}
  #ds-nav .kicker{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;border-left:1px solid rgba(255,255,255,.25);padding-left:14px;}
  .nav-links{display:flex;gap:26px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;}
  .nav-links a{color:#fff;text-decoration:none;opacity:.85;}
  .nav-cta{display:inline-flex;align-items:center;gap:9px;background:var(--accent);color:#0b0b0c;text-decoration:none;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:11px 18px;border-radius:2px;font-weight:700;}
  .post-hero{position:relative;padding:150px 0 40px;overflow:hidden;}
  .post-hero-bg{position:absolute;inset:0;background:radial-gradient(90% 70% at 78% 12%,rgba(255,70,18,.20),transparent 55%),radial-gradient(60% 55% at 12% 96%,rgba(255,70,18,.09),transparent 60%),linear-gradient(180deg,#161618 0%,#0b0b0c 70%);}
  .post-hero .wrap{position:relative;z-index:2;}
  .eyebrow{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.66;border-bottom:1px solid rgba(255,255,255,.18);padding-bottom:14px;margin-bottom:30px;}
  .post-title{margin:0;font-weight:900;letter-spacing:-.035em;line-height:1.02;font-size:clamp(32px,5.4vw,68px);}
  .post-lead{margin:22px 0 0;font-size:clamp(16px,1.5vw,20px);line-height:1.6;max-width:62ch;opacity:.82;}
  .post-meta{margin-top:24px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.6;display:flex;gap:18px;flex-wrap:wrap;}
  .post-body{padding:30px 0 20px;font-size:17.5px;line-height:1.74;color:rgba(255,255,255,.86);}
  .post-body h2{font-weight:800;letter-spacing:-.02em;line-height:1.15;font-size:clamp(24px,3vw,36px);margin:54px 0 18px;color:#fff;}
  .post-body h3{font-weight:700;letter-spacing:-.01em;font-size:clamp(19px,2vw,24px);margin:38px 0 14px;color:#fff;}
  .post-body p{margin:0 0 22px;}
  .post-body a{color:var(--accent);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
  .post-body strong{color:#fff;font-weight:700;}
  .post-body ul,.post-body ol{margin:0 0 24px;padding-left:24px;}
  .post-body li{margin:0 0 10px;}
  .post-body li::marker{color:var(--accent);}
  .post-body blockquote{margin:28px 0;padding:6px 0 6px 22px;border-left:3px solid var(--accent);font-size:1.06em;font-style:italic;color:#fff;}
  .post-body hr{border:none;border-top:1px solid rgba(255,255,255,.14);margin:44px 0;}
  .post-body code{font-family:'Space Mono',monospace;font-size:.86em;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:.12em .4em;}
  .post-body pre{background:#161618;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:18px;overflow-x:auto;margin:0 0 24px;}
  .post-body pre code{background:none;border:none;padding:0;}
  .post-table{overflow-x:auto;margin:0 0 28px;border:1px solid rgba(255,255,255,.14);border-radius:8px;}
  .post-body table{border-collapse:collapse;width:100%;font-size:15.5px;}
  .post-body th,.post-body td{text-align:left;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.1);vertical-align:top;}
  .post-body th{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.7;background:rgba(255,255,255,.03);}
  .post-body tbody tr:last-child td{border-bottom:none;}
  .tags{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.04em;}
  .tags span,.tags a{border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:6px 12px;text-decoration:none;color:#fff;opacity:.85;}
  .post-foot-cta{border-top:1px solid rgba(255,255,255,.14);margin-top:30px;padding:54px 0 70px;text-align:center;}
  .post-foot-cta h2{font-weight:900;letter-spacing:-.03em;font-size:clamp(28px,4vw,52px);margin:0 0 14px;text-transform:uppercase;}
  .post-foot-cta p{opacity:.7;max-width:48ch;margin:0 auto 26px;}
  .btn{display:inline-flex;align-items:center;gap:9px;text-decoration:none;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:14px 22px;border-radius:2px;font-weight:700;}
  .btn-primary{background:var(--accent);color:#0b0b0c;}
  .btn-ghost{border:1px solid rgba(255,255,255,.3);color:#fff;}
  .cta-row{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;}
  .post-next{display:flex;align-items:center;justify-content:space-between;gap:20px;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:26px 28px;text-decoration:none;color:#fff;transition:border-color .3s ease,background .3s ease;}
  .post-next:hover{border-color:var(--accent);background:rgba(255,70,18,.06);}
  .post-next .label{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;}
  .post-next .name{font-weight:700;font-size:clamp(17px,2vw,22px);letter-spacing:-.01em;}
  .post-next .arrow{font-size:24px;color:var(--accent);}
  /* index */
  .blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;padding:34px 0 80px;}
  .blog-card{text-decoration:none;color:#fff;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;background:rgba(255,255,255,.02);transition:border-color .3s ease,transform .3s ease;}
  .blog-card:hover{border-color:var(--accent);transform:translateY(-3px);}
  .blog-card .thumb{aspect-ratio:16/10;}
  .blog-card .pad{padding:20px 20px 24px;display:flex;flex-direction:column;gap:10px;flex:1;}
  .blog-card .date{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.5;}
  .blog-card .ttl{font-weight:700;font-size:18px;line-height:1.28;letter-spacing:-.01em;}
  .blog-card .desc{font-size:14px;line-height:1.55;opacity:.62;}
  .blog-card .read{margin-top:auto;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);}
  .cs-foot{border-top:1px solid rgba(255,255,255,.14);padding:56px 0 0;margin-top:10px;}
  .cs-foot .grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px;padding-bottom:40px;}
  .cs-foot .word{font-weight:900;font-size:34px;letter-spacing:-.04em;margin-bottom:14px;}
  .cs-foot .sig{font-family:'Caveat',cursive;font-weight:700;font-size:40px;color:var(--accent);transform:rotate(-6deg);transform-origin:left;}
  .cs-foot .h{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.45;margin-bottom:10px;}
  .cs-foot .col{font-family:'Space Mono',monospace;font-size:13px;line-height:2;}
  .cs-foot .col a{color:#fff;text-decoration:none;display:block;opacity:.82;}
  .cs-foot .bar{border-top:1px solid rgba(255,255,255,.14);padding:20px 0;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.55;}
  @media (max-width:980px){.blog-grid{grid-template-columns:1fr 1fr;}}
  @media (max-width:860px){.nav-links{display:none;}.cs-foot .grid{grid-template-columns:1fr;}}
  @media (max-width:760px){#ds-cursor{display:none;}}
  @media (max-width:620px){.blog-grid{grid-template-columns:1fr;}.eyebrow{gap:4px 14px;font-size:9px;}.post-next{flex-direction:column;align-items:flex-start;}}
  @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto;}*{animation-duration:.001ms !important;transition-duration:.001ms !important;}[data-reveal]{opacity:1 !important;transform:none !important;}}
  [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1);}
</style>
<noscript><style>[data-reveal]{opacity:1 !important;transform:none !important;}</style></noscript>`;

function head({ title, description, canonical, ogType, ogTitle, ogImage, jsonld, published, modified, tags }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escAttr(title)}</title>
<meta name="description" content="${escAttr(description)}">
${tags ? `<meta name="keywords" content="${escAttr(tags.join(", "))}">\n` : ""}<meta name="author" content="Divyansh Sood">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0b0b0c">
<meta name="geo.region" content="IN-HP">
<meta name="geo.placename" content="Himachal Pradesh, India">
<meta name="apple-mobile-web-app-title" content="Divyansh Sood">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Divyansh Sood® Studio">
<meta property="og:title" content="${escAttr(ogTitle || title)}">
<meta property="og:description" content="${escAttr(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${escAttr(ogImage)}">
<meta property="og:image:width" content="1600">
<meta property="og:image:height" content="1000">
<meta property="og:locale" content="en_IN">
${published ? `<meta property="article:published_time" content="${published}">\n` : ""}${modified ? `<meta property="article:modified_time" content="${modified}">\n` : ""}${(tags || []).map((t) => `<meta property="article:tag" content="${escAttr(t)}">`).join("\n")}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(ogTitle || title)}">
<meta name="twitter:description" content="${escAttr(description)}">
<meta name="twitter:image" content="${escAttr(ogImage)}">
<link rel="icon" href="${FAVICON}">
<link rel="manifest" href="/site.webmanifest">
<link rel="apple-touch-icon" href="/icon.svg">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<script type="application/ld+json">
${jsonld}
</script>
${STYLE}
</head>`;
}

/* ----------------------------------------------------------------------- */
/* PAGE TEMPLATES                                                           */
/* ----------------------------------------------------------------------- */

function postPage(post, index, next) {
  const canonical = `${SITE}/blog/${post.slug}/`;
  const ogImage = post.coverImage || DEFAULT_OG;
  const primaryTag = post.tags[0] || "Notes";
  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#post`,
        headline: post.title,
        description: post.description,
        datePublished: iso(post.pubDate),
        dateModified: iso(post.updatedDate || post.pubDate),
        author: { "@type": "Person", name: "Divyansh Sood", url: `${SITE}/` },
        publisher: {
          "@type": "Organization",
          name: "Divyansh Sood® Studio",
          logo: { "@type": "ImageObject", url: `${SITE}/icon.svg` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        image: ogImage,
        keywords: post.tags.join(", "),
        inLanguage: "en",
        url: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog/` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  });

  return `${head({
    title: `${post.title} · Divyansh Sood`,
    description: post.description,
    canonical,
    ogType: "article",
    ogTitle: post.title,
    ogImage,
    jsonld,
    published: iso(post.pubDate),
    modified: iso(post.updatedDate || post.pubDate),
    tags: post.tags,
  })}
<body>
<div id="ds-root">
  <div id="ds-cursor" aria-hidden="true"></div>
${NAV("Journal")}
  <main>
    <header class="post-hero">
      <div class="post-hero-bg" aria-hidden="true"></div>
      <div class="wrap narrow">
        <div class="eyebrow">
          <span>${escHtml(primaryTag)}</span>
          <span>${escHtml(fmtDate(post.pubDate))}</span>
          <span>${post.readMins} min read</span>
        </div>
        <h1 class="post-title">${escHtml(post.title)}</h1>
        <p class="post-lead">${escHtml(post.description)}</p>
        <div class="post-meta"><span>By Divyansh Sood</span><span>${escHtml(fmtDate(post.pubDate))}</span><span>${post.readMins} min read</span></div>
      </div>
    </header>

    <article class="wrap narrow post-body">
      ${post.html}
      <div class="tags">${post.tags.map((t) => `<span>${escHtml(t)}</span>`).join("")}</div>
    </article>

    <section class="wrap narrow" aria-label="Keep reading">
      <a class="post-next" href="/blog/${next.slug}/" data-cursor>
        <span><span class="label">Read next</span><br><span class="name">${escHtml(next.title)}</span></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </section>

    <section class="post-foot-cta">
      <div class="wrap narrow">
        <h2>Want results like these?</h2>
        <p>Custom-coded, conversion-focused websites — live in about 14 days. Tell me what you're building.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="https://wa.me/919816091875" target="_blank" rel="noopener" data-cursor>Start on WhatsApp <span aria-hidden="true">↗</span></a>
          <a class="btn btn-ghost" href="/#work" data-cursor>See the work</a>
        </div>
      </div>
    </section>
  </main>
${FOOTER}
</div>
${SCRIPT}
</body>
</html>
`;
}

function indexPage(posts) {
  const canonical = `${SITE}/blog/`;
  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${canonical}#blog`,
        name: "Divyansh Sood® Studio — Journal",
        description:
          "Notes and case studies on building custom-coded, conversion-focused websites for businesses in India and worldwide.",
        url: canonical,
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#studio` },
      },
      {
        "@type": "ItemList",
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/blog/${p.slug}/`,
          name: p.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
        ],
      },
    ],
  });

  const cards = posts
    .map(
      (p) => `<a class="blog-card" href="/blog/${p.slug}/" data-cursor data-reveal>
        <div class="thumb" style="background:${gradient(p.slug)};"></div>
        <div class="pad">
          <span class="date">${escHtml(fmtDate(p.pubDate))} · ${escHtml(p.tags[0] || "Notes")}</span>
          <span class="ttl">${escHtml(p.title)}</span>
          <span class="desc">${escHtml(p.description)}</span>
          <span class="read">Read · ${p.readMins} min →</span>
        </div>
      </a>`
    )
    .join("\n        ");

  return `${head({
    title: "Journal — Notes & case studies · Divyansh Sood® Studio",
    description:
      "Notes and case studies on building custom-coded, conversion-focused websites that turn attention into outcomes — for businesses in India and worldwide.",
    canonical,
    ogType: "website",
    ogTitle: "Journal — Divyansh Sood® Studio",
    ogImage: DEFAULT_OG,
    jsonld,
  })}
<body>
<div id="ds-root">
  <div id="ds-cursor" aria-hidden="true"></div>
${NAV("Journal")}
  <main>
    <header class="post-hero">
      <div class="post-hero-bg" aria-hidden="true"></div>
      <div class="wrap">
        <div class="eyebrow">
          <span>(Journal — ${String(posts.length).padStart(2, "0")} posts)</span>
          <span>Notes &amp; case studies</span>
          <span>Divyansh Sood® Studio</span>
        </div>
        <h1 class="post-title">Notes on websites<br>that earn.</h1>
        <p class="post-lead">Practical writing on custom code, SEO, conversion and getting real businesses found — plus case studies from the work.</p>
      </div>
    </header>

    <section class="wrap" aria-label="All posts">
      <div class="blog-grid">
        ${cards}
      </div>
    </section>
  </main>
${FOOTER}
</div>
${SCRIPT}
</body>
</html>
`;
}

/* ----------------------------------------------------------------------- */
/* BUILD                                                                    */
/* ----------------------------------------------------------------------- */

const files = readdirSync(SRC).filter((f) => f.endsWith(".md"));
let posts = files.map((f) => {
  const { data, body } = parse(readFileSync(join(SRC, f), "utf8"));
  return {
    slug: f.replace(/\.md$/, ""),
    title: data.title || f,
    description: data.description || "",
    pubDate: data.pubDate,
    updatedDate: data.updatedDate,
    coverImage: data.coverImage,
    tags: data.tags || [],
    draft: data.draft === "true",
    readMins: readingTime(body),
    html: renderMarkdown(body),
  };
});

posts = posts
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), indexPage(posts), "utf8");
console.log(`✓ /blog/ (index, ${posts.length} posts)`);

posts.forEach((post, idx) => {
  const next = posts[(idx + 1) % posts.length];
  const dir = join(OUT, post.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), postPage(post, idx, next), "utf8");
  console.log(`✓ /blog/${post.slug}/`);
});

console.log(`\nDone — ${posts.length + 1} pages written to /blog/`);

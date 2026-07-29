#!/usr/bin/env node
/* ===========================================================================
   verify-seo.mjs — checks the crawlable surface of the built site.
   Run after `npm run build`:  npm run verify:seo

   Companion to verify-llms.mjs, which covers the machine-readable files. This
   one reads dist/client and vercel.json and asserts the things a July 2026
   audit proved were worth guarding. Every check below either caught a real
   defect or would have caught one that shipped:

   1. noindex + foreign canonical. /portfolio-pdf/ shipped as a live 200
      carrying BOTH noindex and canonical→/portfolio/. Google's guidance rules
      the combination out: the canonical says "consolidate into /portfolio/",
      the noindex says "drop me", and the noindex can carry across to the
      canonical target — risking deindexation of the real portfolio page.

   2. Orphans. Every indexable page needs ≥2 inbound internal links. A page
      reachable only from the sitemap is a page Google will crawl slowly and
      rank poorly, and the site has had orphans before (the fix was the footer
      service/location columns plus RelatedPosts).

   3. Redirect shadowing a real page. A vercel.json redirect whose source also
      exists as a built page silently hides that page — it can never be
      reached, and nothing in the build warns you.

   4. Redirect chains and dead ends. Every redirect destination must resolve to
      a real built page and must not itself be a redirect source. Chains bleed
      equity and burn crawl budget; a destination that 404s is worse than the
      404 the redirect was added to prevent.

   5. Sitemap lastmod coverage. 32 of 75 URLs shipped without one — including
      the homepage, every service page and every city page. lastmod is the main
      recrawl-scheduling signal for Bing and Google, so this guards the
      page-updated.mjs map from silently falling behind new pages.

   6. Generic anchor text. 19 links on the service pages said only "Read →".
      Anchor text is the strongest topical signal a page can pass, and service
      pages are among the most authoritative on the site.

   Plus the standing per-page hygiene checks (7): exactly one H1, a canonical,
   a title and meta description within sane lengths, and alt text on every
   non-decorative image.

   Exit code is non-zero if any check fails, so this can gate a deploy.
   =========================================================================== */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = "dist/client";
const SITE = "https://www.divyanshsood.com";

let failures = 0;
const pass = (m) => console.log(`  \x1b[32mPASS\x1b[0m  ${m}`);
const fail = (m) => {
  failures++;
  console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`);
};
const warn = (m) => console.log(`  \x1b[33mWARN\x1b[0m  ${m}`);

if (!existsSync(DIST)) {
  console.error(`${DIST} not found — run \`npm run build\` first.`);
  process.exit(1);
}

/* ── Collect every built HTML page ─────────────────────────────────────────
   Keyed by URL path with a trailing slash, matching trailingSlash:"always" —
   the same form the canonicals and the sitemap use, so all three can be
   compared without normalising at every call site. */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".html")) out.push(p);
  }
  return out;
}

const pages = new Map();
for (const file of walk(DIST)) {
  const rel = relative(DIST, file).split(sep).join("/");
  // "index.html" → "/", "blog/x/index.html" → "/blog/x/", "404.html" → "/404.html"
  const path = rel === "index.html" ? "/" : rel.endsWith("/index.html") ? `/${rel.slice(0, -"index.html".length)}` : `/${rel}`;
  pages.set(path, readFileSync(file, "utf8"));
}
console.log(`\nRead ${pages.size} built pages from ${DIST}`);

const attr = (html, re) => html.match(re)?.[1]?.trim();
const isNoindex = (html) => /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
const canonicalOf = (html) => attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
const toPath = (u) => {
  try {
    return new URL(u, SITE).pathname;
  } catch {
    return null;
  }
};

// Indexable = a real page we expect in the index. 404 is excluded by name
// because it is served as a 404 rather than linked to.
const indexable = [...pages].filter(([p, h]) => !isNoindex(h) && p !== "/404.html");

/* ── 1. noindex must never combine with a canonical pointing elsewhere ───── */
console.log("\n1. noindex + foreign canonical (would have caught /portfolio-pdf/)");
{
  const bad = [];
  for (const [path, html] of pages) {
    if (!isNoindex(html)) continue;
    const c = canonicalOf(html);
    if (!c) continue;
    const cp = toPath(c);
    if (cp && cp !== path) bad.push(`${path} is noindex but canonicals to ${cp}`);
  }
  if (bad.length) bad.forEach(fail);
  else pass(`no page combines noindex with a canonical pointing elsewhere`);
}

/* ── 2. Every indexable page needs ≥2 inbound internal links ─────────────── */
console.log("\n2. Orphan guard (≥2 inbound internal links per indexable page)");
{
  const inbound = new Map(indexable.map(([p]) => [p, 0]));
  for (const [from, html] of pages) {
    const seen = new Set();
    for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
      let to = toPath(m[1]);
      if (!to) continue;
      if (!to.endsWith("/") && !to.includes(".")) to += "/";
      // Self-links and repeat links from the same page count once.
      if (to === from || seen.has(to)) continue;
      seen.add(to);
      if (inbound.has(to)) inbound.set(to, inbound.get(to) + 1);
    }
  }
  const orphans = [...inbound].filter(([, n]) => n < 2);
  if (orphans.length) orphans.forEach(([p, n]) => fail(`${p} has ${n} inbound internal link(s), needs 2`));
  else pass(`all ${inbound.size} indexable pages have ≥2 inbound internal links`);
}

/* ── vercel.json redirects, shared by checks 3 and 4 ─────────────────────── */
const redirects = JSON.parse(readFileSync("vercel.json", "utf8")).redirects ?? [];
const slash = (p) => (p.endsWith("/") || p.includes(".") ? p : `${p}/`);
const sources = new Set(redirects.map((r) => slash(r.source)));

/* ── 3. A redirect source must not also exist as a built page ────────────── */
console.log("\n3. No redirect shadows a real page");
{
  const bad = redirects
    .map((r) => r.source)
    .filter((s) => pages.has(slash(s)) || pages.has(s))
    .map((s) => `redirect source ${s} also exists as a built page — the page is unreachable`);
  if (bad.length) bad.forEach(fail);
  else pass(`none of the ${redirects.length} redirect sources collide with a built page`);
}

/* ── 4. Destinations resolve, and are not themselves redirect sources ────── */
console.log("\n4. Redirect destinations resolve and don't chain");
{
  const bad = [];
  for (const r of redirects) {
    const d = slash(toPath(r.destination) ?? r.destination);
    if (sources.has(d)) bad.push(`${r.source} → ${r.destination}, which is itself a redirect source (chain)`);
    else if (!pages.has(d) && !existsSync(join(DIST, d.replace(/^\//, "")))) {
      bad.push(`${r.source} → ${r.destination}, which is not a built page`);
    }
  }
  if (bad.length) bad.forEach(fail);
  else pass(`all ${redirects.length} redirect destinations are single-hop and resolve`);
}

/* ── 5. Every sitemap URL carries a lastmod ──────────────────────────────── */
console.log("\n5. Sitemap lastmod coverage");
{
  const smPath = join(DIST, "sitemap-0.xml");
  if (!existsSync(smPath)) fail("sitemap-0.xml not found");
  else {
    const xml = readFileSync(smPath, "utf8");
    const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
    const missing = entries.filter((e) => !/<lastmod>/.test(e)).map((e) => e.match(/<loc>(.*?)<\/loc>/)?.[1]);
    if (missing.length) {
      missing.forEach((u) => fail(`no lastmod: ${u} — add it to PAGE_UPDATED in src/lib/page-updated.mjs`));
    } else pass(`all ${entries.length} sitemap URLs carry a lastmod`);
  }
}

/* ── 6. No internal anchor may use generic link text ─────────────────────── */
console.log("\n6. Descriptive anchor text");
{
  // "here"/"this" are the classic offenders; "read"/"read more"/"learn more"
  // are what the service pages actually shipped.
  const GENERIC = ["read", "read more", "read this", "click here", "here", "this", "learn more", "more", "link", "see more", "find out more"];
  const strip = (s) =>
    s
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/[→↗»›\-–—.!]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const bad = [];
  for (const [path, html] of pages) {
    for (const m of html.matchAll(/<a\b[^>]*\bhref=["'](\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const text = strip(m[2]);
      // Empty text is an icon/image link — alt text carries it, so skip.
      if (text && GENERIC.includes(text)) bad.push(`${path}: <a href="${m[1]}">${text}</a>`);
    }
  }
  if (bad.length) bad.forEach(fail);
  else pass("no internal link uses generic anchor text");
}

/* ── 7. Standing per-page hygiene ────────────────────────────────────────── */
console.log("\n7. Per-page hygiene (H1, canonical, title, description, alt text)");
{
  const problems = [];
  for (const [path, html] of indexable) {
    const h1s = [...html.matchAll(/<h1\b/gi)].length;
    if (h1s !== 1) problems.push(`${path}: ${h1s} <h1> elements, expected exactly 1`);

    if (!canonicalOf(html)) problems.push(`${path}: no <link rel="canonical">`);

    const title = attr(html, /<title>([\s\S]*?)<\/title>/i);
    if (!title) problems.push(`${path}: no <title>`);
    else if (title.length > 70) warn(`${path}: title is ${title.length} chars (>70 truncates in SERPs)`);

    const desc = attr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    if (!desc) problems.push(`${path}: no meta description`);
    else if (desc.length > 165) warn(`${path}: meta description is ${desc.length} chars (>165 truncates)`);

    // alt="" is valid and means "decorative" — only a missing alt is a defect.
    const noAlt = [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)].length;
    if (noAlt) problems.push(`${path}: ${noAlt} <img> without an alt attribute`);
  }
  if (problems.length) problems.forEach(fail);
  else pass(`all ${indexable.length} indexable pages pass H1 / canonical / title / description / alt`);
}

/* ── Summary ─────────────────────────────────────────────────────────────── */
console.log("");
if (failures) {
  console.log(`\x1b[31m${failures} check(s) failed.\x1b[0m\n`);
  process.exit(1);
}
console.log("\x1b[32mAll SEO checks passed.\x1b[0m\n");

#!/usr/bin/env node
/* ===========================================================================
   verify-llms.mjs — checks the machine-readable surface of the site.
   Run after `npm run build`:  node scripts/verify-llms.mjs

   Four checks, each of which caught a real defect when first written:

   1. llms.txt spec conformance. The spec (llmstxt.org) defines an H1, an
      optional blockquote, free-form body, then H2 sections that are *link
      lists*. The previous file put prose bullets under `## Services`,
      `## FAQ`, `## What clients say` and `## Contact` — content a strict
      parser walking H2 sections for links will drop on the floor.

   2. Link integrity. Every divyanshsood.com URL named in either file must
      correspond to a page that actually built. A dead link in the one document
      you hand to a model is worse than no document.

   3. @id resolution in the built JSON-LD. A node referenced as
      { "@id": "…/#person" } but never defined in the same document is a
      pointer to nothing for any parser that reads one page at a time — which
      is all of them that matter here. 33 pages were in that state.

   4. Self-containment. Retrieval returns fragments, so a line that opens with
      a bare pronoun ("He builds…", "It shipped in 7 days") is unusable once
      lifted out of its context. Flags them rather than failing, because a few
      are legitimate mid-paragraph prose.

   Exit code is non-zero if any of checks 1–3 fail, so this can gate a deploy.
   =========================================================================== */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist/client";
const FILES = ["public/llms.txt", "public/llms-full.txt"];

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

/* ── 1. llms.txt spec conformance ──────────────────────────────────────── */
console.log("\nllms.txt spec conformance");
{
  const lines = readFileSync("public/llms.txt", "utf8").split("\n");
  const firstContent = lines.findIndex((l) => l.trim());

  if (/^# \S/.test(lines[firstContent])) pass("H1 present and first");
  else fail("first content line must be an H1 naming the site");

  const afterH1 = lines.slice(firstContent + 1).find((l) => l.trim());
  if (afterH1?.startsWith(">")) pass("blockquote summary follows the H1");
  else fail("expected a blockquote summary directly after the H1");

  // Inside an H2 section every list item must be a markdown link. Prose
  // paragraphs are tolerated (the spec is silent) but bare bullets are not.
  let section = null;
  const sections = [];
  const bad = [];
  lines.forEach((l, i) => {
    if (/^## /.test(l)) {
      section = l.slice(3).trim();
      sections.push(section);
      return;
    }
    if (/^# /.test(l) || section === null) return;
    const s = l.trim();
    if (!s || !/^[-*]\s/.test(s)) return;
    if (!/^[-*]\s\[[^\]]+\]\((?:https?|mailto):[^)]+\)/.test(s)) {
      bad.push(`line ${i + 1} [## ${section}] ${s.slice(0, 60)}`);
    }
  });

  if (bad.length === 0) pass(`${sections.length} H2 sections, all list items are links`);
  else {
    fail(`${bad.length} non-link list items inside H2 sections`);
    bad.slice(0, 8).forEach((b) => console.log(`          ${b}`));
  }

  if (sections.some((s) => /^optional$/i.test(s))) pass("`## Optional` section present (short-context degradation)");
  else warn("no `## Optional` section — nothing marked skippable under short context");
}

/* ── 2. link integrity ─────────────────────────────────────────────────── */
console.log("\nLink integrity");
for (const file of FILES) {
  const text = readFileSync(file, "utf8");
  const urls = [...new Set([...text.matchAll(/https:\/\/www\.divyanshsood\.com([^)\s"']*)/g)].map((m) => m[1]))];
  const missing = urls.filter((u) => {
    if (u === "" || u === "/") return false;
    return !existsSync(join(DIST, u.endsWith("/") ? `${u}index.html` : u));
  });
  if (missing.length === 0) pass(`${file}: all ${urls.length} internal URLs resolve`);
  else {
    fail(`${file}: ${missing.length} unresolved URL(s)`);
    missing.forEach((m) => console.log(`          ${m}`));
  }
}

/* ── 3. @id resolution in built JSON-LD ────────────────────────────────── */
console.log("\nJSON-LD @id resolution");
{
  const htmlFiles = [];
  (function walk(dir) {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith(".html")) htmlFiles.push(p);
    }
  })(DIST);

  const collect = (node, defs, refs) => {
    if (Array.isArray(node)) return node.forEach((n) => collect(n, defs, refs));
    if (!node || typeof node !== "object") return;
    const id = node["@id"];
    if (typeof id === "string") {
      if (node["@type"] || Object.keys(node).length > 1) defs.add(id);
      else refs.add(id);
    }
    for (const [k, v] of Object.entries(node)) if (k !== "@id") collect(v, defs, refs);
  };

  const dangling = [];
  const unparseable = [];
  let withSchema = 0;

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (!blocks.length) continue;
    withSchema++;

    const defs = new Set();
    const refs = new Set();
    for (const [, raw] of blocks) {
      try {
        collect(JSON.parse(raw), defs, refs);
      } catch (e) {
        unparseable.push(`${file.replace(DIST, "")}: ${e.message}`);
      }
    }
    const missing = [...refs].filter((r) => !defs.has(r));
    if (missing.length) dangling.push(`${file.replace(DIST, "")} → ${missing.join(", ")}`);
  }

  if (unparseable.length === 0) pass(`${withSchema} pages with JSON-LD, all parse`);
  else {
    fail(`${unparseable.length} unparseable JSON-LD block(s)`);
    unparseable.slice(0, 5).forEach((u) => console.log(`          ${u}`));
  }

  if (dangling.length === 0) pass("every referenced @id is defined in the same document");
  else {
    fail(`${dangling.length} page(s) with a dangling @id reference`);
    dangling.slice(0, 8).forEach((d) => console.log(`          ${d}`));
  }
}

/* ── 4. self-containment spot check ────────────────────────────────────── */
console.log("\nSelf-containment (advisory)");
{
  // Opens with a pronoun and no antecedent in the same line — unusable once a
  // retriever lifts it out on its own.
  const OPENER = /^[-*]?\s*(He|She|They|It|We|This|That|These|Those|His|Her|Their|Its)\b/;
  for (const file of FILES) {
    const hits = readFileSync(file, "utf8")
      .split("\n")
      .map((l, i) => [i + 1, l.trim()])
      .filter(([, l]) => l.length > 30 && OPENER.test(l));
    if (hits.length === 0) pass(`${file}: no lines open with an unanchored pronoun`);
    else {
      warn(`${file}: ${hits.length} line(s) open with a pronoun`);
      hits.slice(0, 5).forEach(([n, l]) => console.log(`          line ${n}: ${l.slice(0, 70)}`));
    }
  }
}

console.log(
  failures === 0
    ? "\n\x1b[32mAll blocking checks passed.\x1b[0m\n"
    : `\n\x1b[31m${failures} blocking check(s) failed.\x1b[0m\n`,
);
process.exit(failures === 0 ? 0 : 1);

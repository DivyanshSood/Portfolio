/* ===========================================================================
   Cross-post export - turns each published blog post into a Markdown file
   ready to paste into dev.to / Hashnode / Medium, WITH a `canonical_url`
   pointing back to the original on divyanshsood.com.

   Why canonical matters: you publish on your own domain first (you already do),
   then syndicate. The canonical tells Google the original is yours, so the SEO
   signal consolidates on your site instead of being split - you get the
   community reach + AI citations without a duplicate-content penalty. (Outbound
   links on those platforms are nofollow industry-wide, so this is a reach /
   citation play, not a dofollow-link play - set expectations accordingly.)

   Run it MANUALLY after a build:
       npm run build            (produces dist/client/blog/<slug>/index.html)
       npm run export:crossposts
   Output lands in ./crosspost-exports/<slug>.md (git-ignored; not shipped).

   Local-only utility - reads the fully-rendered HTML from dist/ (so there are
   no Astro-expression edge cases), extracts the <article class="post-body">
   region, and converts the known prose tag-set to Markdown.
   =========================================================================== */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://www.divyanshsood.com";
const OUT_DIR = join(ROOT, "crosspost-exports");
const SEP = "\n<<<BLOCK>>>\n"; // block delimiter, unlikely to appear in prose

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

// ---- decode the handful of HTML entities our prose actually uses ----
function decodeEntities(s) {
  const map = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
    "&apos;": "'", "&nbsp;": " ", "&mdash;": "—", "&ndash;": "–",
    "&hellip;": "…", "&rsquo;": "’", "&lsquo;": "‘",
    "&ldquo;": "“", "&rdquo;": "”",
  };
  return s.replace(/&[a-z#0-9]+;/gi, (m) => (m in map ? map[m] : m));
}

// ---- inline tags -> Markdown (run per block; placeholders untouched) ----
function inlineToMd(s) {
  return s
    .replace(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, txt) => {
      let h = href.trim();
      if (h.startsWith("/")) h = SITE + h; // site-relative -> absolute
      return `[${txt.replace(/<[^>]+>/g, "").trim()}](${h})`;
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${t.trim()}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${t.trim()}*`)
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => "`" + t.trim() + "`")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, ""); // strip anything else left inline
}

// Collapse whitespace in a block, but preserve line breaks inside lists.
function cleanBlock(b) {
  const isList = /^\s*(?:[-*]|\d+\.)\s/m.test(b);
  if (isList) return b.split("\n").map((l) => l.replace(/[ \t]+/g, " ").trim()).filter(Boolean).join("\n");
  return b.replace(/\s+/g, " ").trim();
}

// ---- full HTML block -> Markdown ----
function htmlToMarkdown(html) {
  const stash = []; // fenced code blocks, referenced by their index

  // 1. Protect <pre> code blocks (each becomes its own delimited block).
  //    Built HTML may syntax-highlight code into nested <span class="line">
  //    tokens, so strip ALL tags to recover the plain source — the literal
  //    newlines between highlighted lines are preserved.
  html = html.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
    const code = decodeEntities(inner.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
      .replace(/^\n+|\n+$/g, "");
    stash.push("```\n" + code + "\n```");
    return `${SEP}CODE${stash.length - 1}${SEP}`;
  });

  // 2. Lists -> one delimited block each (items on their own lines).
  html = html.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    const items = inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (__, t) => `\n${++n}. ${t.trim()}`);
    return `${SEP}${items}${SEP}`;
  });
  html = html.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (__, t) => `\n- ${t.trim()}`);
    return `${SEP}${items}${SEP}`;
  });

  // 3. Headings, blockquote, paragraphs -> delimited blocks.
  html = html.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `${SEP}## ${t.trim()}${SEP}`);
  html = html.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `${SEP}### ${t.trim()}${SEP}`);
  html = html.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `${SEP}#### ${t.trim()}${SEP}`);
  html = html.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) =>
    `${SEP}> ${t.replace(/<\/?p\b[^>]*>/gi, " ").replace(/\s+/g, " ").trim()}${SEP}`
  );
  html = html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `${SEP}${t.trim()}${SEP}`);

  // 4. Split on the delimiter, clean each block (restoring code verbatim).
  const blocks = html.split(SEP).map((raw) => {
    const code = raw.trim().match(/^CODE(\d+)$/);
    if (code) return stash[Number(code[1])];
    let b = inlineToMd(raw);
    b = decodeEntities(b);
    return cleanBlock(b);
  }).filter(Boolean);

  return blocks.join("\n\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

// dev.to tags: lowercase, alphanumeric only, max 4.
function devtoTags(tags) {
  return (tags || [])
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
}

async function main() {
  const distDir = join(ROOT, "dist", "client");
  if (!(await exists(distDir))) {
    console.log("dist/ not found. Run `npm run build` first, then re-run this.");
    process.exit(0);
  }

  const { POSTS } = await import("../src/lib/blog-posts.mjs");
  await mkdir(OUT_DIR, { recursive: true });

  let done = 0;
  for (const p of POSTS) {
    const htmlPath = join(distDir, "blog", p.slug, "index.html");
    if (!(await exists(htmlPath))) { console.log(`   skip ${p.slug} (no built HTML)`); continue; }

    const page = await readFile(htmlPath, "utf8");
    const m = page.match(/<article[^>]*class="[^"]*post-body[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
    if (!m) { console.log(`   skip ${p.slug} (post-body not found)`); continue; }

    const body = htmlToMarkdown(m[1]);
    const canonical = `${SITE}/blog/${p.slug}/`;
    const cover = p.coverImage ? (p.coverImage.startsWith("http") ? p.coverImage : SITE + p.coverImage) : "";

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(p.title)}`,
      "published: false",
      `description: ${JSON.stringify(p.description || "")}`,
      `tags: ${devtoTags(p.tags)}`,
      `canonical_url: ${canonical}`,
      cover ? `cover_image: ${cover}` : null,
      "---",
      "",
    ].filter((l) => l !== null).join("\n");

    await writeFile(join(OUT_DIR, `${p.slug}.md`), frontmatter + "\n" + body, "utf8");
    done++;
  }

  console.log(`\nExported ${done} post(s) to crosspost-exports/`);
  console.log("  Paste one into dev.to (it reads the front-matter incl. canonical_url),");
  console.log("  or Hashnode (set the original/canonical URL field to the same link).");
  console.log("  Keep `published: false` until you have reviewed it.\n");
}

main().catch((e) => { console.error("export-crossposts failed:", e); process.exit(1); });

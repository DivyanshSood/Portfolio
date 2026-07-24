/* ===========================================================================
   Project case-study renderer + JSON-LD.
   Produces the <main> body of a case study byte-for-byte; chrome
   (head/nav/footer/cursor/base script) is supplied by the shared Astro Layout.
   Data lives in ./data.mjs.
   =========================================================================== */

import { SITE } from "./data.mjs";

/* --------------------------------------------------------------------------- */
/* HELPERS                                                                      */
/* --------------------------------------------------------------------------- */

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// ImageKit URLs resize via a `?tr=` query; self-hosted `/images/**` files can't,
// so they ship pre-generated width variants (`<name>-<w>.webp`) alongside the
// 1920px base. `tr`/`srcset` pick the right form so a phone never pulls a
// desktop-sized image. Keep LOCAL_WIDTHS in sync with scripts/gen-work-variants.mjs.
const isLocal = (src) => src.startsWith("/");
const LOCAL_WIDTHS = [480, 768, 1080, 1440];
const localVariant = (src, w) => {
  const W = LOCAL_WIDTHS.find((x) => x >= w);
  return W ? src.replace(/\.webp$/, `-${W}.webp`) : src; // wider than 1440 → the base 1920px file
};
const tr = (src, w) => (isLocal(src) ? localVariant(src, w) : `${src}?tr=w-${w},q-70`);
const srcset = (src) =>
  isLocal(src)
    ? [...LOCAL_WIDTHS.map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`), `${src} 1920w`].join(", ")
    : [420, 560, 760, 1040, 1400].map((w) => `${tr(src, w)} ${w}w`).join(", ");

const FEATURE_SIZES = "(max-width:1100px) 90vw, 1040px";
const GALLERY_SIZES = "(max-width:860px) 90vw, 540px";

function imgFigure(item, { lcp = false, ratio = "16 / 10", cls = "" } = {}) {
  const sizes = lcp ? FEATURE_SIZES : GALLERY_SIZES;
  return `<figure class="cs-shot ${cls}" style="aspect-ratio:${ratio};">
        <img src="${esc(tr(item.src, lcp ? 1040 : 540))}" srcset="${esc(srcset(item.src))}" sizes="${sizes}"
             width="1600" height="1000" alt="${esc(item.alt)}"
             ${lcp ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
      </figure>`;
}

// Phone-framed screenshot (only used when a project supplies `mobileShots`).
function mobileFigure(item) {
  return `<figure style="margin:0;flex:none;width:clamp(170px,42vw,250px);aspect-ratio:9 / 19.5;border:9px solid #16161a;border-radius:32px;overflow:hidden;background:#16161a;box-shadow:0 28px 60px -34px rgba(0,0,0,.7);">
        <img src="${esc(tr(item.src, 420))}" srcset="${esc(srcset(item.src))}" sizes="(max-width:860px) 50vw, 250px"
             width="420" height="910" alt="${esc(item.alt)}" loading="lazy" decoding="async"
             style="width:100%;height:100%;object-fit:cover;display:block;">
      </figure>`;
}

function bodyCard(w) {
  if (w.type === "quote") {
    // Optional `gloss` renders an English translation right under a non-English
    // quote so a foreign prospect isn't stranded on a Hindi/Hinglish line.
    // Set `glossLabel` to override the default "Translation:".
    const gloss = w.gloss
      ? `<p class="cs-quote-gloss"><span class="cs-quote-gloss-l">${esc(w.glossLabel || "Translation")}:</span> <span class="cs-quote-gloss-t">${esc(w.gloss)}</span></p>`
      : "";
    return `<figure class="cs-card cs-quote${w.span2 ? " span2" : ""}">
          <span class="cs-tag">${esc(w.tag)}</span>
          <blockquote lang="${esc(w.lang || "en")}">${esc(w.quote)}</blockquote>
          ${gloss}
          ${w.attribution ? `<figcaption>${esc(w.attribution)}</figcaption>` : ""}
        </figure>`;
  }
  if (w.type === "list") {
    const items = w.items.map((i) => `<li>${esc(i)}</li>`).join("");
    return `<div class="cs-card${w.span2 ? " span2" : ""}">
          <span class="cs-tag">${esc(w.tag)}</span>
          <ul class="cs-list${w.oneCol ? " one" : ""}">${items}</ul>
        </div>`;
  }
  return `<div class="cs-card${w.span2 ? " span2" : ""}">
          <span class="cs-tag">${esc(w.tag)}</span>
          ${w.title ? `<h2 class="cs-card-h2">${w.title}</h2>` : ""}
          <p>${w.html}</p>
        </div>`;
}

export function jsonLd(p) {
  const canonical = `${SITE}/projects/${p.slug}/`;
  const clientOrgId = `${canonical}#client`;
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: p.ogTitle,
      description: p.ogDescription,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE}/#website` },
      primaryImageOfPage: { "@type": "ImageObject", url: p.ogImage },
      datePublished: `${p.year}-01-01`,
      dateModified: "2026-06-19",
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
      about: { "@id": clientOrgId },
      mainEntity: { "@id": `${canonical}#project` },
      author: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/#work` },
        { "@type": "ListItem", position: 3, name: p.name, item: canonical },
      ],
    },
    {
      "@type": "CreativeWork",
      "@id": `${canonical}#project`,
      name: `${p.name} — ${p.headlineTail.replace(/^—\s*/, "")}`,
      headline: p.ogTitle,
      description: p.description.replace(/<[^>]+>/g, ""),
      url: canonical,
      image: p.ogImage,
      inLanguage: "en",
      dateCreated: `${p.year}-01-01`,
      keywords: p.stackLine.replace(/\s*·\s*/g, ", "),
      creator: { "@id": `${SITE}/#person` },
      author: { "@id": `${SITE}/#person` },
      about: { "@id": clientOrgId },
    },
    {
      "@type": "Organization",
      "@id": clientOrgId,
      name: p.name,
      url: p.liveUrl,
      sameAs: [p.liveUrl],
    },
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Divyansh Sood",
      url: `${SITE}/`,
      jobTitle: "Web Developer",
    },
    {
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: p.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const quoteWidget = p.body.find((w) => w.type === "quote" && w.attribution);
  if (quoteWidget) {
    graph.push({
      "@type": "Review",
      "@id": `${canonical}#review`,
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5", worstRating: "1" },
      author: { "@type": "Organization", name: p.name },
      itemReviewed: { "@id": `${SITE}/#studio` },
      reviewBody: quoteWidget.quote.replace(/^"|"$/g, ""),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

/** Head/meta props for the shared Layout. */
export function projectHead(p) {
  const canonical = `${SITE}/projects/${p.slug}/`;
  return {
    title: p.title,
    description: p.description.replace(/<[^>]+>/g, ""),
    canonical,
    keywords: p.keywords,
    ogType: "article",
    ogTitle: p.ogTitle,
    ogDescription: p.ogDescription,
    ogImage: p.ogImage,
    ogImageW: 1600,
    ogImageH: 1000,
    ogLocale: "en_IN",
    imageAlt: p.feature.alt,
    articlePublished: `${p.year}-01-01`,
    jsonld: jsonLd(p),
    preloadImage: { href: tr(p.feature.src, 1040), srcset: srcset(p.feature.src), sizes: FEATURE_SIZES },
  };
}

/** The <main> body of a case study (chrome is supplied by the Layout). */
export function renderProjectMain(p) {
  const metrics = p.metrics
    .map((m) => `<div class="cs-metric"><span class="cs-metric-v">${esc(m.v)}</span><span class="cs-metric-l">${esc(m.l)}</span></div>`)
    .join("");
  const bodyCards = p.body.map(bodyCard).join("\n        ");
  const gallery = p.gallery.map((g) => imgFigure(g, { ratio: "16 / 10" })).join("\n        ");
  const faq = p.faq
    .map(
      (f, i) => `<div class="cs-faq-row">
          <button class="cs-faq-q" data-faqtog="${i}" aria-expanded="false" aria-controls="faq-${p.slug}-${i}">
            <span>${esc(f.q)}</span><span class="cs-faq-icon" data-faqicon="${i}" aria-hidden="true">+</span>
          </button>
          <div class="cs-faq-a" id="faq-${p.slug}-${i}" data-faqbody="${i}"><p>${esc(f.a)}</p></div>
        </div>`
    )
    .join("\n        ");

  return `<main>
    <header class="cs-hero">
      <div class="cs-hero-bg" aria-hidden="true"></div>
      <div class="wrap">
        <div class="cs-eyebrow">
          <span>Case study — ${esc(p.num)}</span>
          <span>${esc(p.name)} · ${esc(p.category)}</span>
          <span>${esc(p.year)}</span>
        </div>
        <a class="cs-domain" href="${esc(p.liveUrl)}" target="_blank" rel="noopener">${esc(p.domain)}<span class="arrow" aria-hidden="true">↗</span></a>
        <h1 class="cs-h1">${esc(p.headline)} <span class="tail">${esc(p.headlineTail)}</span></h1>
        <p class="cs-lead">${p.lead}</p>
        <div class="cs-cta-row">
          <a class="btn btn-primary" href="${esc(p.liveUrl)}" target="_blank" rel="noopener">Open live site <span aria-hidden="true">↗</span></a>
          <a class="btn btn-ghost" href="${esc(p.waHref)}" target="_blank" rel="noopener">Build something similar</a>
        </div>
        <div class="cs-meta">
          <span>${esc(p.role)}</span><span>${esc(p.stackLine)}</span>
        </div>
      </div>
    </header>

    <div class="wrap cs-feature">
      ${imgFigure(p.feature, { lcp: true, ratio: "16 / 10" })}
    </div>

    <section class="cs-sec" aria-labelledby="glance-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="glance-h">At a glance</h2>
          <span class="mono">Project summary</span>
        </div>
        <dl class="cs-glance">
          <div><dt>Client</dt><dd>${esc(p.name)}</dd></div>
          <div><dt>Live site</dt><dd><a href="${esc(p.liveUrl)}" target="_blank" rel="noopener">${esc(p.domain)} ↗</a></dd></div>
          <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
          <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
          <div><dt>Stack</dt><dd>${esc(p.stackLine)}</dd></div>
          <div><dt>Outcome</dt><dd>${esc(p.outcome)}</dd></div>
        </dl>
      </div>
    </section>

    <section class="cs-sec" aria-labelledby="results-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="results-h">By the numbers</h2>
          <span class="mono">Results</span>
        </div>
        <div class="cs-metrics" data-reveal>${metrics}</div>
      </div>
    </section>

    <section class="cs-sec" aria-labelledby="story-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="story-h">Inside the build</h2>
          <span class="mono">The story</span>
        </div>
        <div class="cs-body" data-reveal>
        ${bodyCards}
        </div>
      </div>
    </section>

    <section class="cs-sec" aria-labelledby="gallery-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="gallery-h">Gallery</h2>
          <span class="mono">${esc(p.galleryLabel)}</span>
        </div>
        <div class="cs-gallery${p.gallery.length === 1 ? " single" : ""}">
        ${gallery}
        </div>
      </div>
    </section>

    ${
      p.mobileShots && p.mobileShots.length
        ? `<section class="cs-sec" aria-labelledby="mobile-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="mobile-h">On mobile</h2>
          <span class="mono">Where most visitors land</span>
        </div>
        <div data-reveal style="display:flex;gap:22px;overflow-x:auto;padding:6px 0 12px;-webkit-overflow-scrolling:touch;">
        ${p.mobileShots.map(mobileFigure).join("\n        ")}
        </div>
      </div>
    </section>`
        : ""
    }

    <section class="cs-sec" aria-labelledby="faq-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="faq-h">Frequently asked</h2>
          <span class="mono">About this project</span>
        </div>
        <div class="cs-faq">
        ${faq}
        </div>
      </div>
    </section>

    <section class="cs-sec" aria-label="Project navigation">
      <div class="wrap">
        <a class="cs-next" href="/projects/${esc(p.next.slug)}">
          <span><span class="label">${esc(p.next.label)}</span><br><span class="name">${esc(p.next.name)}</span></span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <section class="cs-endcta">
      <div class="wrap">
        <h2>Want one like this?</h2>
        <p>Same brief, different scale. Tell me what you're building and I'll tell you within a day if it's a fit.</p>
        <div class="cs-cta-row" style="justify-content:center;">
          <a class="btn btn-primary" href="${esc(p.waHref)}" target="_blank" rel="noopener">Build something similar <span aria-hidden="true">↗</span></a>
          <a class="btn btn-ghost" href="/#work">See all work</a>
        </div>
      </div>
    </section>
  </main>`;
}

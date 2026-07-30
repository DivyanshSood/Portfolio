/* ===========================================================================
   entity.mjs — the site's identity nodes (Person · Organization · WebSite).

   Why this file exists
   --------------------
   JSON-LD lets you reference a node by `@id` instead of repeating it, and that
   is correct when the whole graph sits in one document. But nearly every
   consumer that matters here — Google's parser, and every AI answer engine —
   reads ONE PAGE at a time. So a blog post that said

       author: { "@type": "Person", name: "Divyansh Sood", "@id": ".../#person" }

   handed the parser a name and a dangling pointer. The node carrying the job
   title, the photo, the verified profiles and the topics of expertise is
   defined only on the homepage, and nothing fetches the homepage to resolve
   it. All 42 posts carried that stub — so the site's strongest E-E-A-T signal
   (who wrote this, and why would they know) was missing from exactly the 42
   pages most likely to be retrieved and quoted.

   These builders emit nodes that stand on their own inside a single document
   while keeping the same stable `@id`. Per-page parsers get the whole entity;
   graph-merging parsers fold the duplicates back into one. Nothing drifts,
   because every page now derives its identity from this file.

   Everything here must already be substantiated elsewhere on the site. No
   ratings, no prices — see the standing notes in site.mjs.
   =========================================================================== */

import { FOUNDER_PHOTO, GOOGLE_KG_MID, GOOGLE_MAPS_CID_URL, SAME_AS, SITE } from "./site.mjs";

/* Topics of demonstrated expertise. Consumed by both the full Person node on
   the homepage and the compact author node on every post, so the two can't
   disagree about what this person actually knows. Each entry is backed by
   shipped work or published writing — this is a claim, not a wishlist. */
export const KNOWS_ABOUT = [
  "Web design",
  "Web development",
  "Custom website development",
  "React",
  "Next.js",
  "Astro",
  "Angular",
  "E-commerce development",
  "Web application development",
  "SEO",
  "Generative Engine Optimization",
  "Answer Engine Optimization",
  "Conversion rate optimization",
  "Core Web Vitals",
  "AI-assisted software development",
  "Large language model integration",
];

export const JOB_TITLE = "Freelance Web Developer & Designer";

export const PERSON_DESCRIPTION =
  "Freelance web designer and developer running a one-person studio (Divyansh Sood® Studio) from Himachal Pradesh, India — building custom-coded, conversion-focused websites, stores and web apps for founders worldwide.";

export const STUDIO_DESCRIPTION =
  "Independent one-person web design and development studio building custom-coded, conversion-focused websites, e-commerce storefronts and web apps for founders worldwide. Marketing sites and MVPs go live in 3–4 weeks; larger builds run 6–10 weeks.";

/**
 * The author node for articles and case studies.
 *
 * Deliberately smaller than `personNode()` — it repeats on 42 pages, so it
 * carries the properties that establish authority for a reader or a model
 * (title, expertise, verified profiles) and leaves the rest to the canonical
 * definition on the homepage, which shares this `@id`.
 *
 * `worksFor` points at `#studio`, which `publisherNode()` defines in the same
 * graph — so the Person→Organization link resolves without leaving the page.
 */
export function authorNode(SITE) {
  return {
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: "Divyansh Sood",
    url: `${SITE}/about/`,
    jobTitle: JOB_TITLE,
    description: PERSON_DESCRIPTION,
    image: `${SITE}${FOUNDER_PHOTO}`,
    worksFor: { "@id": `${SITE}/#studio` },
    knowsAbout: KNOWS_ABOUT,
    sameAs: [...SAME_AS],
  };
}

/**
 * The publisher node for articles and case studies.
 *
 * `logo` stays an ImageObject because Google's article guidance asks for one.
 * `sameAs` includes the Google Business Profile so an assistant can tie the
 * byline to a real, independently verifiable listing.
 */
export function publisherNode(SITE) {
  return {
    "@type": "Organization",
    "@id": `${SITE}/#studio`,
    name: "Divyansh Sood® Studio",
    alternateName: "Divyansh Sood Studio",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/icon.svg` },
    image: `${SITE}${FOUNDER_PHOTO}`,
    description: STUDIO_DESCRIPTION,
    foundingDate: "2022",
    founder: { "@id": `${SITE}/#person` },
    address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
    sameAs: [...SAME_AS, GOOGLE_MAPS_CID_URL],
    // Google Knowledge Graph MID for this business — states which existing
    // entity the page is about rather than asking a parser to infer it. See the
    // note on GOOGLE_KG_MID in site.mjs for why this is `identifier` and not
    // another `sameAs` entry.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Google Knowledge Graph MID",
      value: GOOGLE_KG_MID,
    },
  };
}

/**
 * The WebSite node, for `isPartOf`. Previously a bare `@id` reference on every
 * post, which told a per-page parser nothing about which site the post belongs
 * to — the one thing `isPartOf` exists to say.
 */
export function websiteNode(SITE) {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: "Divyansh Sood® Studio",
    inLanguage: "en",
    publisher: { "@id": `${SITE}/#studio` },
  };
}

/* ---------------------------------------------------------------------------
   completeGraph — the safety net that makes the dangling-@id bug unfixable-by-
   forgetting.

   Pages hand-write their own `@graph` and routinely point at the identity nodes
   by reference: `provider: { "@id": ".../#studio" }`, `about: { "@id":
   ".../#person" }`, `isPartOf: { "@id": ".../#website" }`. Those three nodes
   were only ever *defined* on the homepage, so on 33 other pages the reference
   resolved to nothing — a parser reading that page alone saw a pointer with no
   target.

   Fixing those 33 graphs by hand would work exactly once; page 34 would
   reintroduce it. So Studio.astro runs every page's JSON-LD through here
   instead, and any identity node that is referenced but not defined gets
   appended. The loop runs to a fixpoint because the nodes reference each other
   (Person worksFor Studio, Studio founder Person, WebSite publisher Studio) —
   appending one can introduce the next.

   Deliberately conservative: unparseable input is returned untouched rather
   than throwing, because a malformed graph should degrade to "no enhancement",
   never to a broken build.
--------------------------------------------------------------------------- */

/** Walk a JSON-LD value, recording which `@id`s are defined vs merely referenced. */
function collectIds(node, defs, refs) {
  if (Array.isArray(node)) {
    for (const n of node) collectIds(n, defs, refs);
    return;
  }
  if (!node || typeof node !== "object") return;

  const id = node["@id"];
  if (typeof id === "string") {
    // A node that carries anything beyond its @id is a definition; a bare
    // { "@id": … } is a pointer to one.
    if (node["@type"] || Object.keys(node).length > 1) defs.add(id);
    else refs.add(id);
  }
  for (const [k, v] of Object.entries(node)) {
    if (k !== "@id") collectIds(v, defs, refs);
  }
}

/* Page types whose presence means the document already has a node standing for
   "this page". Blog posts qualify via their `mainEntityOfPage`.

   FAQPage is deliberately NOT in this list even though it is a WebPage
   subclass. Across this site an FAQPage node is a *component* — the Q&A list
   sitting inside a service page — not a claim that the URL is a FAQ page.
   Counting it suppressed the WebPage node on every page carrying an FAQ, which
   is precisely the set of pages that needed one: all six service pages, all
   four city pages, and the homepage. */
const PAGE_TYPES = new Set([
  "WebPage", "CollectionPage", "AboutPage", "ProfilePage", "ContactPage", "ItemPage", "QAPage",
]);

function hasPageNode(node) {
  if (Array.isArray(node)) return node.some(hasPageNode);
  if (!node || typeof node !== "object") return false;
  const t = node["@type"];
  if (typeof t === "string" && PAGE_TYPES.has(t)) return true;
  if (Array.isArray(t) && t.some((x) => PAGE_TYPES.has(x))) return true;
  return Object.entries(node).some(([k, v]) => k !== "@type" && hasPageNode(v));
}

export function completeGraph(jsonldString, page) {
  if (!jsonldString) return jsonldString;

  let doc;
  try {
    doc = JSON.parse(jsonldString);
  } catch {
    return jsonldString;
  }

  /* A page with only a Service node and a BreadcrumbList has nothing that
     represents the page itself — so there is nowhere to say what the page is
     *about*. (`about` is a CreativeWork property; Service can't carry it.) Ten
     of the site's most commercial URLs — every service page and every city
     page — were in exactly that state. */
  const pageNodes = [];
  if (page?.canonical && !hasPageNode(doc)) {
    pageNodes.push({
      "@type": "WebPage",
      "@id": `${page.canonical}#webpage`,
      url: page.canonical,
      name: page.name,
      ...(page.description ? { description: page.description } : {}),
      isPartOf: { "@id": `${SITE}/#website` },
      ...(page.topics?.length ? { about: page.topics } : {}),
      inLanguage: "en",
    });
  }

  const builders = {
    [`${SITE}/#person`]: authorNode,
    [`${SITE}/#studio`]: publisherNode,
    [`${SITE}/#website`]: websiteNode,
  };

  // Seeded with the WebPage node (if one was needed) so its own `isPartOf`
  // reference is resolved by the same pass that resolves everyone else's.
  const added = [...pageNodes];
  // Three identity nodes, so three passes is the most that can ever be needed;
  // the guard is a belt-and-braces stop, the `break` below is what ends it.
  for (let pass = 0; pass < 3; pass++) {
    const defs = new Set();
    const refs = new Set();
    collectIds(doc, defs, refs);
    collectIds(added, defs, refs);

    const missing = [...refs].filter((r) => !defs.has(r) && builders[r]);
    if (!missing.length) break;
    for (const id of missing) added.push(builders[id](SITE));
  }

  if (!added.length) return jsonldString;

  if (Array.isArray(doc["@graph"])) {
    doc["@graph"].push(...added);
  } else {
    // A page that emitted a single top-level node rather than a @graph. Wrap it
    // so the appended nodes are siblings, not nested children.
    const { "@context": ctx, ...rest } = doc;
    doc = { "@context": ctx ?? "https://schema.org", "@graph": [rest, ...added] };
  }
  return JSON.stringify(doc);
}

/* ---------------------------------------------------------------------------
   breadcrumbTrail — pull the visible trail out of the page's own JSON-LD.

   All 76 pages already emit a BreadcrumbList, but nothing rendered it. Schema
   describing a trail the visitor can't see is the weaker form: Google's
   guidance pairs the markup with a visible trail, and a visible trail is also
   the only thing giving a deep page a crawlable link back to its parent.

   Reading the trail back out of the JSON-LD each page already built — rather
   than asking pages to declare it a second time for the UI — is deliberate.
   Sixty-seven pages hand-roll that BreadcrumbList; a second source would drift
   from the first on the day someone edits one and forgets the other. Here the
   two are the same array by construction, and a page that adds breadcrumb
   markup gets the rendered trail for free.

   The last item is the current page: returned so the caller can mark it up as
   the non-link end of the trail.
   --------------------------------------------------------------------------- */
export function breadcrumbTrail(jsonldString) {
  if (!jsonldString) return [];

  let doc;
  try {
    doc = JSON.parse(jsonldString);
  } catch {
    return [];
  }

  const nodes = Array.isArray(doc["@graph"]) ? doc["@graph"] : [doc];
  const list = nodes.find((n) => {
    const t = n?.["@type"];
    return t === "BreadcrumbList" || (Array.isArray(t) && t.includes("BreadcrumbList"));
  });
  if (!list || !Array.isArray(list.itemListElement)) return [];

  return list.itemListElement
    .slice()
    .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
    .map((el) => ({
      name: el?.name ?? "",
      // `item` is a bare URL string on every page here, but schema.org also
      // allows a nested node — handle both rather than rendering "[object Object]".
      url: typeof el?.item === "string" ? el.item : (el?.item?.["@id"] ?? el?.item?.url ?? ""),
    }))
    .filter((c) => c.name);
}

/* ---------------------------------------------------------------------------
   Topic anchors.

   `about` and `mentions` accept a Thing with a `sameAs` pointing at a
   well-known identifier. That resolves an ambiguous English phrase to a
   specific concept: "Astro" is a static-site framework here, not the Marvel
   character or the Houston baseball team. Wikipedia URLs are used because they
   are the identifiers knowledge-graph consumers already index.

   Only add an entry when a page is genuinely *about* that concept. A long list
   of loosely-related topics is the schema equivalent of keyword stuffing and
   is treated the same way — which is why topicsForTags() caps the result.

   Every `sameAs` below was checked to return 200. That matters: `sameAs` is an
   identity claim, so pointing one at a URL that doesn't exist is worse than
   omitting it, exactly as the SAME_AS note in site.mjs argues. (The check
   caught `Astro_(web_framework)`, which 404s — so Astro isn't listed here even
   though it's the site's own framework.)
--------------------------------------------------------------------------- */
export const TOPICS = {
  webDevelopment: { "@type": "Thing", name: "Web development", sameAs: "https://en.wikipedia.org/wiki/Web_development" },
  webDesign: { "@type": "Thing", name: "Web design", sameAs: "https://en.wikipedia.org/wiki/Web_design" },
  website: { "@type": "Thing", name: "Website", sameAs: "https://en.wikipedia.org/wiki/Website" },
  webApp: { "@type": "Thing", name: "Web application", sameAs: "https://en.wikipedia.org/wiki/Web_application" },
  seo: { "@type": "Thing", name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ai: { "@type": "Thing", name: "Artificial intelligence", sameAs: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
  llm: { "@type": "Thing", name: "Large language model", sameAs: "https://en.wikipedia.org/wiki/Large_language_model" },
  rag: { "@type": "Thing", name: "Retrieval-augmented generation", sameAs: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" },
  chatbot: { "@type": "Thing", name: "Chatbot", sameAs: "https://en.wikipedia.org/wiki/Chatbot" },
  automation: { "@type": "Thing", name: "Automation", sameAs: "https://en.wikipedia.org/wiki/Automation" },
  security: { "@type": "Thing", name: "Computer security", sameAs: "https://en.wikipedia.org/wiki/Computer_security" },
  ecommerce: { "@type": "Thing", name: "E-commerce", sameAs: "https://en.wikipedia.org/wiki/E-commerce" },
  react: { "@type": "Thing", name: "React", sameAs: "https://en.wikipedia.org/wiki/React_(software)" },
  nextjs: { "@type": "Thing", name: "Next.js", sameAs: "https://en.wikipedia.org/wiki/Next.js" },
  wordpress: { "@type": "Thing", name: "WordPress", sameAs: "https://en.wikipedia.org/wiki/WordPress" },
  shopify: { "@type": "Thing", name: "Shopify", sameAs: "https://en.wikipedia.org/wiki/Shopify" },
  noCode: { "@type": "Thing", name: "No-code development platform", sameAs: "https://en.wikipedia.org/wiki/No-code_development_platform" },
  cro: { "@type": "Thing", name: "Conversion rate optimization", sameAs: "https://en.wikipedia.org/wiki/Conversion_rate_optimization" },
  cwv: { "@type": "Thing", name: "Web performance", sameAs: "https://en.wikipedia.org/wiki/Web_performance" },
  freelance: { "@type": "Thing", name: "Freelancer", sameAs: "https://en.wikipedia.org/wiki/Freelancer" },
  startup: { "@type": "Thing", name: "Startup company", sameAs: "https://en.wikipedia.org/wiki/Startup_company" },
  tourism: { "@type": "Thing", name: "Tourism", sameAs: "https://en.wikipedia.org/wiki/Tourism" },
  hotel: { "@type": "Thing", name: "Hotel", sameAs: "https://en.wikipedia.org/wiki/Hotel" },
  education: { "@type": "Thing", name: "Education", sameAs: "https://en.wikipedia.org/wiki/Education" },
  socialMedia: { "@type": "Thing", name: "Social media", sameAs: "https://en.wikipedia.org/wiki/Social_media" },
  himachal: { "@type": "Place", name: "Himachal Pradesh", sameAs: "https://en.wikipedia.org/wiki/Himachal_Pradesh" },
  india: { "@type": "Place", name: "India", sameAs: "https://en.wikipedia.org/wiki/India" },
};

/* Tag → concept. The blog manifest already carries hand-written `tags` ordered
   most-relevant-first, so deriving `about` from them keeps 42 posts anchored
   without 42 separate judgement calls — and a new post gets anchored the moment
   it's tagged. Tags with no sensible public concept ("case study", "process",
   "ownership") are deliberately absent; a missing anchor is fine, a wrong one
   is not. */
const TAG_TOPIC = {
  "web development": "webDevelopment", "custom code": "webDevelopment", "developers": "webDevelopment",
  "developer workflow": "webDevelopment", "code quality": "webDevelopment", "technical debt": "webDevelopment",
  design: "webDesign", brand: "webDesign",
  "web apps": "webApp", "admissions portal": "webApp", "school website": "webApp", SaaS: "webApp",
  seo: "seo", SEO: "seo", "local SEO": "seo", "structured data": "seo", search: "seo",
  GEO: "seo", "AI search": "ai", "llms.txt": "ai", ChatGPT: "llm",
  AI: "ai", "AI development": "ai", "AI-assisted development": "ai", "AI features": "ai",
  "AI limitations": "ai", "future of work": "ai",
  LLM: "llm", Claude: "llm", GPT: "llm", Gemini: "llm", "Claude Code": "llm",
  RAG: "rag", retrieval: "rag",
  chatbot: "chatbot", WhatsApp: "chatbot",
  automation: "automation", productivity: "automation",
  security: "security",
  "e-commerce": "ecommerce", D2C: "ecommerce", drops: "ecommerce", "creator economy": "ecommerce",
  "Shopify alternatives": "shopify", "Shopify alternative": "shopify", Shopify: "shopify",
  WordPress: "wordpress",
  "Next.js": "nextjs", headless: "react",
  "no-code": "noCode", "website builders": "noCode", Webflow: "noCode", Squarespace: "noCode", Framer: "noCode",
  conversion: "cro", CRO: "cro", "landing page": "cro", "lead generation": "cro",
  performance: "cwv", "Core Web Vitals": "cwv",
  freelancer: "freelance", freelancing: "freelance", "agency vs freelancer": "freelance",
  hiring: "freelance", "hire developer India": "freelance", "offshore development": "freelance",
  "client acquisition": "freelance", career: "freelance", careers: "freelance",
  startups: "startup", business: "startup", "small business": "startup", "local business": "startup",
  travel: "tourism", "direct bookings": "tourism", taxi: "tourism",
  hotels: "hotel", homestay: "hotel",
  school: "education", education: "education",
  Instagram: "socialMedia",
  "Himachal Pradesh": "himachal", Himachal: "himachal", "himalayan businesses": "himachal",
  India: "india",
};

/**
 * Concepts a page is genuinely about, derived from its tags.
 *
 * Capped at `limit` because `about` is a claim about the subject of the page,
 * not a keyword field — a post tagged with nine things is still mainly about
 * two of them, and tags[0] is already the primary.
 */
export function topicsForTags(tags = [], limit = 4) {
  const seen = new Set();
  const out = [];
  for (const tag of tags) {
    const key = TAG_TOPIC[tag] ?? TAG_TOPIC[tag.toLowerCase()];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(TOPICS[key]);
    if (out.length >= limit) break;
  }
  return out;
}

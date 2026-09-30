/* ===========================================================================
   Case-study <head> props + JSON-LD. The page markup itself is
   src/pages/projects/[slug].astro; content lives in ./data.mjs.
   =========================================================================== */

import { SITE } from "./data.mjs";
import { localSrcset, localVariant } from "../images.mjs";

/** `sizes` for the case-study feature image (the framed 1280px shot). */
export const FEATURE_SIZES = "(max-width: 1360px) calc(100vw - 32px), 1280px";

function jsonLd(p) {
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
      // Was hardcoded to one date across all nine case studies, so every page
      // claimed the same edit day and the claim went stale the moment any one
      // of them changed. Now per-project (data.mjs `updated`), falling back to
      // the publish year rather than asserting an edit that didn't happen.
      dateModified: p.updated || `${p.year}-01-01`,
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
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/portfolio/` },
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
      // Typed inline, not a bare @id — the #studio node is only defined in the
      // homepage graph, so a reference alone gives Search Console no type to
      // validate ("Invalid object type for field itemReviewed").
      itemReviewed: {
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${SITE}/#studio`,
        name: "Divyansh Sood® Studio",
        url: `${SITE}/`,
      },
      reviewBody: quoteWidget.quote.replace(/^"|"$/g, ""),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

/** Head/meta props for the Base layout. */
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
    preloadImage: { href: localVariant(p.feature.src, 1440), srcset: localSrcset(p.feature.src), sizes: FEATURE_SIZES },
  };
}

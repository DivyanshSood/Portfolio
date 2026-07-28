/* ===========================================================================
   Homepage JSON-LD (WebSite · Person · ProfessionalService · ItemList · FAQ).
   Extracted from index.astro so the page front-matter stays lean. Returns the
   same serialised string as before.
   =========================================================================== */

import { FOUNDER_PHOTO, GOOGLE_MAPS_CID_URL, SAME_AS } from "./site.mjs";
import { projects } from "./projects/data.mjs";

export function homeJsonLd(SITE) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "Divyansh Sood® Studio",
        description:
          "Divyansh Sood® Studio is an independent web design & development studio in Himachal Pradesh, India, building custom-coded, conversion-focused websites, e-commerce stores and web apps for founders worldwide. Live in 3–4 weeks; fastest full site shipped in 7 days.",
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Divyansh Sood",
        url: `${SITE}/`,
        jobTitle: "Freelance Web Developer & Designer",
        description:
          "Freelance web designer and developer running a one-person studio (Divyansh Sood® Studio) from Himachal Pradesh, India — building custom-coded, conversion-focused websites, stores and web apps for founders worldwide.",
        // The Person's image must be the person. This pointed at a WebSeek
        // product screenshot, so every consumer of the entity graph — Google's
        // knowledge panel included — was handed a UI mockup as the founder's
        // photo.
        image: `${SITE}${FOUNDER_PHOTO}`,
        email: "hello@divyanshsood.com",
        telephone: "+91-98160-91875",
        worksFor: { "@id": `${SITE}/#studio` },
        address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
        nationality: { "@type": "Country", name: "India" },
        knowsLanguage: ["English", "Hindi"],
        hasOccupation: {
          "@type": "Occupation",
          name: "Freelance Web Developer",
          occupationLocation: { "@type": "Country", name: "India" },
          skills:
            "Web design, front-end and full-stack development, React, Next.js, Astro, e-commerce, SEO, conversion rate optimization",
        },
        knowsAbout: [
          "Web design",
          "Web development",
          "React",
          "Next.js",
          "Astro",
          "Angular",
          "SEO",
          "Generative Engine Optimization",
          "Conversion rate optimization",
          "E-commerce",
        ],
        sameAs: [...SAME_AS],
      },
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${SITE}/#studio`,
        name: "Divyansh Sood® Studio",
        alternateName: "Divyansh Sood Studio",
        slogan: "Built from the Himalayas. Shipping for the world.",
        foundingDate: "2022",
        numberOfEmployees: { "@type": "QuantitativeValue", value: 1 },
        knowsLanguage: ["English", "Hindi"],
        url: `${SITE}/`,
        image: `${SITE}${FOUNDER_PHOTO}`,
        logo: `${SITE}/icon.svg`,
        description:
          "Built from the Himalayas. Shipping for the world. Independent 1-person web design & development studio building custom-coded, conversion-focused websites, stores and web apps for founders worldwide. Marketing sites & MVPs in 3–4 weeks; larger builds, 6–10.",
        founder: { "@id": `${SITE}/#person` },
        employee: { "@id": `${SITE}/#person` },
        email: "hello@divyanshsood.com",
        telephone: "+91-98160-91875",
        serviceType: [
          "Custom website design and development",
          "E-commerce store development",
          "Web application and MVP development",
          "SEO, AEO and Generative Engine Optimization",
          "Conversion rate optimization",
          "White-label web development for agencies",
        ],
        keywords:
          "freelance web developer, freelance web designer, custom web development, conversion-focused websites, Next.js developer, Astro developer, e-commerce development, web app MVP, SEO, GEO, AEO, Himachal Pradesh, India",
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
          { "@type": "City", name: "Dharamshala", containedInPlace: { "@type": "State", name: "Himachal Pradesh" } },
          { "@type": "City", name: "Kangra", containedInPlace: { "@type": "State", name: "Himachal Pradesh" } },
          { "@type": "City", name: "Shimla", containedInPlace: { "@type": "State", name: "Himachal Pradesh" } },
          { "@type": "City", name: "Manali", containedInPlace: { "@type": "State", name: "Himachal Pradesh" } },
        ],
        address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
        hasMap: GOOGLE_MAPS_CID_URL,
        sameAs: [...SAME_AS, GOOGLE_MAPS_CID_URL],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-98160-91875",
          email: "hello@divyanshsood.com",
          contactType: "sales",
          availableLanguage: ["en", "hi"],
        },
        makesOffer: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Strategy & Research", description: "Customer-journey audit and a clear path from first click to conversion, grounded in real behaviour." } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Design & Prototyping", description: "High-fidelity interface design and clickable prototypes before a line of code is written." } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Development", description: "Fast, accessible, search-friendly front-ends — React, Next.js, Astro or headless." } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Support & Growth", description: "Ongoing iteration, A/B tests, performance tuning and monthly reporting." } },
          { "@type": "Offer", url: `${SITE}/services/ecommerce-website-development/`, itemOffered: { "@type": "Service", name: "Ecommerce website development", description: "Custom-coded D2C storefronts — Razorpay/Stripe payments, drop mechanics, full code ownership, no platform rent." } },
          { "@type": "Offer", url: `${SITE}/services/web-app-development/`, itemOffered: { "@type": "Service", name: "Web app & MVP development", description: "Portals, dashboards, admin panels and AI products — full-stack React/Next.js/Astro, live in weeks." } },
          { "@type": "Offer", url: `${SITE}/services/landing-page-design/`, itemOffered: { "@type": "Service", name: "Landing page design", description: "High-converting landing pages — copy, design and code as one argument, with tracking built in." } },
          { "@type": "Offer", url: `${SITE}/services/seo-geo-services/`, itemOffered: { "@type": "Service", name: "SEO & Generative Engine Optimization", description: "Technical and on-page SEO plus GEO — structured data, llms.txt and AI-crawler strategy so Google ranks you and AI assistants cite you." } },
        ],
        // No aggregateRating or Review entries here on purpose: per
        // src/lib/site.mjs we only link out to the real Google reviews URL
        // and never publish star counts we can't independently verify.
        // (Was previously emitting an AggregateRating — removed 2026-06.)
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/#work`,
        name: "Selected work — Divyansh Sood® Studio",
        // Derived from the single project source (projects/data.mjs), ordered by
        // the canonical num so the list can never drift from the case studies.
        itemListElement: [...projects]
          .sort((a, b) => a.num.localeCompare(b.num))
          .map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/projects/${p.slug}/`,
            name: `${p.name} ${p.headlineTail}`,
          })),
      },
      // FAQPage schema removed 2026-07-04: the FAQ section left the homepage
      // in the "show, don't tell" pass, and Google requires FAQ markup to
      // match content visible on the page. Restore alongside the Faq
      // component if it's ever remounted.
    ],
  });
}

/* ===========================================================================
   Homepage JSON-LD (WebSite · Person · ProfessionalService · ItemList · FAQ).
   Extracted from index.astro so the page front-matter stays lean. Returns the
   same serialised string as before.
   =========================================================================== */

import { GOOGLE_MAPS_CID_URL } from "./site.mjs";
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
          "Built from the Himalayas. Shipping for the world. Independent web design & development studio — custom-coded, conversion-focused websites, stores and web apps. 7 days vs 6 months quoted. Marketing sites & MVPs in 3–4 weeks.",
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Divyansh Sood",
        url: `${SITE}/`,
        jobTitle: "Web Developer",
        description:
          "Independent web designer and developer running a one-person studio from Himachal Pradesh, India, building custom-coded, conversion-focused websites, stores and web apps for founders worldwide.",
        image:
          "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
        email: "hello@divyanshsood.com",
        telephone: "+91-98160-91875",
        worksFor: { "@id": `${SITE}/#studio` },
        address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
        nationality: { "@type": "Country", name: "India" },
        knowsLanguage: ["English", "Hindi"],
        hasOccupation: {
          "@type": "Occupation",
          name: "Web Developer",
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
        sameAs: [
          "https://github.com/DivyanshSood",
          "https://www.linkedin.com/in/divyansh-sood-023556151/",
        ],
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
        image:
          "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
        logo: `${SITE}/icon.svg`,
        description:
          "Built from the Himalayas. Shipping for the world. Independent 1-person web design & development studio building custom-coded, conversion-focused websites, stores and web apps for founders worldwide. Marketing sites & MVPs in 3–4 weeks; larger builds, 6–10. From $3,000.",
        founder: { "@id": `${SITE}/#person` },
        employee: { "@id": `${SITE}/#person` },
        email: "hello@divyanshsood.com",
        telephone: "+91-98160-91875",
        priceRange: "$$$",
        serviceType: [
          "Custom website design and development",
          "E-commerce store development",
          "Web application and MVP development",
          "SEO, AEO and Generative Engine Optimization",
          "Conversion rate optimization",
          "White-label web development for agencies",
        ],
        keywords:
          "custom web development, conversion-focused websites, Next.js developer, Astro developer, e-commerce development, web app MVP, SEO, GEO, AEO, Himachal Pradesh, India",
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
        ],
        address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
        hasMap: GOOGLE_MAPS_CID_URL,
        sameAs: [
          "https://github.com/DivyanshSood",
          "https://www.linkedin.com/in/divyansh-sood-023556151/",
          GOOGLE_MAPS_CID_URL,
        ],
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
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO", description: "Technical and on-page SEO baked in from day one — clean markup, fast loads, structured data." } },
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
      {
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        mainEntity: [
          { "@type": "Question", name: "Do you write the copy, or do we?", acceptedAnswer: { "@type": "Answer", text: "Either works. I can write conversion-focused copy tailored to your brand and goals, or polish and structure content you provide. Most projects are a collaboration." } },
          { "@type": "Question", name: "What happens after launch?", acceptedAnswer: { "@type": "Answer", text: "You get a tidy handover, documentation, and 30 days of free support. From there we can set up an ongoing retainer to keep improving results." } },
          { "@type": "Question", name: "How long does a project take?", acceptedAnswer: { "@type": "Answer", text: "Marketing sites and MVPs typically go live in 3–4 weeks. Larger builds (custom dashboards, web apps, multi-page redesigns) run 6–10 weeks. I take on a limited number at once so yours always has my full attention." } },
          { "@type": "Question", name: "What if I'm not happy with the result?", acceptedAnswer: { "@type": "Answer", text: "We work in clear milestones with revision rounds at each. You always know where things stand, and nothing ships until you're genuinely happy with it." } },
        ],
      },
    ],
  });
}

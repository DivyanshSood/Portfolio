/* ===========================================================================
   Homepage JSON-LD (WebSite · Person · ProfessionalService · ItemList · FAQ).
   Extracted from index.astro so the page front-matter stays lean. Returns the
   same serialised string as before.
   =========================================================================== */

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
          "Independent web design & development studio — custom-coded, conversion-focused websites and web apps.",
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Divyansh Sood",
        url: `${SITE}/`,
        jobTitle: "Web Designer & Developer",
        image:
          "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
        email: "hello@divyanshsood.com",
        telephone: "+91-98160-91875",
        worksFor: { "@id": `${SITE}/#studio` },
        address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
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
        url: `${SITE}/`,
        image:
          "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
        logo: `${SITE}/icon.svg`,
        description:
          "Independent web design & development studio building custom-coded, conversion-focused websites, stores and web apps. Strategy, design and engineering under one roof. Live in 3–4 weeks.",
        founder: { "@id": `${SITE}/#person` },
        email: "hello@divyanshsood.com",
        telephone: "+91-98160-91875",
        priceRange: "₹₹₹",
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
        ],
        address: { "@type": "PostalAddress", addressRegion: "Himachal Pradesh", addressCountry: "IN" },
        sameAs: [
          "https://github.com/DivyanshSood",
          "https://www.linkedin.com/in/divyansh-sood-023556151/",
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
        aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "6", bestRating: "5", worstRating: "1" },
        review: [
          { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, author: { "@type": "Organization", name: "Nandini Travels" }, reviewBody: "The website is so beautiful — looks 10 times more premium than our competitors. We started getting direct bookings instead of losing them to Google Maps." },
          { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, author: { "@type": "Organization", name: "InHimalayas" }, reviewBody: "Divyansh is amazing with his work. We are glad it worked out so fast and so well." },
          { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, author: { "@type": "Organization", name: "ChinkiZ Knitting Knife" }, reviewBody: "I did not think it could be achieved without going to e-commerce builders and only using custom code." },
          { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, author: { "@type": "Organization", name: "Modern K.B.S." }, reviewBody: "Every other agency said 6 months. Delivered in 7 days." },
          { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, author: { "@type": "Organization", name: "North Peak Power Systems" }, reviewBody: "Exactly what we wanted. I will refer Divyansh within my circle for life." },
          { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, author: { "@type": "Organization", name: "Redline Studios" }, reviewBody: "Incredible — no ordinary agency could have delivered this." },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/#work`,
        name: "Selected work — Divyansh Sood® Studio",
        itemListElement: [
          { "@type": "ListItem", position: 1, url: `${SITE}/projects/webseek`, name: "WebSeek.ai — AI website builder" },
          { "@type": "ListItem", position: 2, url: `${SITE}/projects/inhimalayas`, name: "InHimalayas — booking platform" },
          { "@type": "ListItem", position: 3, url: `${SITE}/projects/dharamshala-tours`, name: "Dharamshala Tours — WhatsApp-first travel" },
          { "@type": "ListItem", position: 4, url: `${SITE}/projects/redline`, name: "Redline Studios — apparel storefront" },
          { "@type": "ListItem", position: 5, url: `${SITE}/projects/chinkiz`, name: "ChinkiZ Knitting Knife — D2C storefront" },
          { "@type": "ListItem", position: 6, url: `${SITE}/projects/modernkbs`, name: "Modern K.B.S. — school site + admin panel" },
          { "@type": "ListItem", position: 7, url: `${SITE}/projects/nandini`, name: "Nandini Travels — Kangra taxi operator" },
          { "@type": "ListItem", position: 8, url: `${SITE}/projects/northpeak`, name: "North Peak Power Systems — solar contractor portal" },
          { "@type": "ListItem", position: 9, url: `${SITE}/projects/cultxberserk`, name: "CultXberserk — Berserk-inspired apparel brand" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        mainEntity: [
          { "@type": "Question", name: "Do you write the copy, or do we?", acceptedAnswer: { "@type": "Answer", text: "Either works. I can write conversion-focused copy tailored to your brand and goals, or polish and structure content you provide. Most projects are a collaboration." } },
          { "@type": "Question", name: "What happens after launch?", acceptedAnswer: { "@type": "Answer", text: "You get a tidy handover, documentation, and 30 days of free support. From there we can set up an ongoing retainer to keep improving results." } },
          { "@type": "Question", name: "How long does a project take?", acceptedAnswer: { "@type": "Answer", text: "Most projects go live in about 3–4 weeks. I take on a limited number at once so yours always has my full attention." } },
          { "@type": "Question", name: "What if I'm not happy with the result?", acceptedAnswer: { "@type": "Answer", text: "We work in clear milestones with revision rounds at each. You always know where things stand, and nothing ships until you're genuinely happy with it." } },
        ],
      },
    ],
  });
}

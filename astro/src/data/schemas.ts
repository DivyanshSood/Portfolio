// Per-page JSON-LD schema blocks. Stored as plain objects so they can be
// JSON.stringify'd into <script type="application/ld+json"> tags.

export const schemaLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.divyanshsood.com/#business",
  "name": "Divyansh Sood",
  "alternateName": "www.divyanshsood.com — Custom websites for Himalayan businesses",
  "url": "https://www.divyanshsood.com/",
  "image": "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/divyansh.webp",
  "logo": "https://www.divyanshsood.com/assets/og.jpg",
  "description": "Solo web design + development studio in the Kangra Valley, Himachal Pradesh. Custom-coded websites for Himalayan small businesses, schools, clinics, hotels and creators — and the rest of India. Delivered in 14 days, starting ₹13,000. GST invoice, 50% advance, full refund if not approved by Day 5.",
  "founder": { "@type": "Person", "name": "Divyansh Sood" },
  "telephone": "+919816091875",
  "email": "hello@divyanshsood.com",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kangra Valley",
    "addressRegion": "Himachal Pradesh",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "32.0998", "longitude": "76.2691" },
  "areaServed": [
    { "@type": "State", "name": "Himachal Pradesh" },
    { "@type": "State", "name": "Uttarakhand" },
    { "@type": "Country", "name": "India" },
    { "@type": "City", "name": "Dharamshala" },
    { "@type": "City", "name": "Kangra" },
    { "@type": "City", "name": "Shimla" },
    { "@type": "City", "name": "Manali" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "09:00", "closes": "21:00"
  },
  "sameAs": [
    "https://wa.me/919816091875",
    "https://ai-website-generator-tan.vercel.app"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Website packages",
    "itemListElement": [
      { "@type": "Offer", "name": "Landing page — single high-converting page", "priceCurrency": "INR", "priceSpecification": { "@type": "PriceSpecification", "minPrice": "7000", "maxPrice": "10000", "priceCurrency": "INR" }, "description": "Single page with hero, offer, social proof and lead form. Live in 5 days." },
      { "@type": "Offer", "name": "Starter — 5-page custom website", "priceCurrency": "INR", "priceSpecification": { "@type": "PriceSpecification", "minPrice": "13000", "maxPrice": "16000", "priceCurrency": "INR" }, "description": "Frontend + backend, mobile-perfect, delivered in 14 days. For SMEs, clinics, salons, CAs, photographers." },
      { "@type": "Offer", "name": "Business — 10–15 page website with CMS", "priceCurrency": "INR", "priceSpecification": { "@type": "PriceSpecification", "minPrice": "28000", "maxPrice": "32000", "priceCurrency": "INR" }, "description": "Larger sites with content editor. For boutique hotels, coaching centres, larger D2C brands." },
      { "@type": "Offer", "name": "Premium — School portal / E-commerce / Brand", "priceCurrency": "INR", "priceSpecification": { "@type": "PriceSpecification", "minPrice": "48000", "maxPrice": "55000", "priceCurrency": "INR" }, "description": "Custom admin panel, Razorpay, brand identity. For schools, custom storefronts, brand-from-scratch." },
      { "@type": "Offer", "name": "AMC — Annual maintenance contract", "price": "2500", "priceCurrency": "INR", "description": "Hosting, uptime monitoring, 2 hours of changes per month, domain + SSL renewals." }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "bestRating": "5",
    "ratingCount": "8",
    "reviewCount": "6"
  },
  "review": [
    { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Chinki" }, "reviewBody": "I did not think it could be achieved without going to e-commerce builders and only using custom code. Divyansh was amazing at his work and so transparent. They even produced a video gallery that looks just as good as our YouTube tutorials. I highly recommend Divyansh for any website building or maintenance project." },
    { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Admin, Modern K.B.S." }, "reviewBody": "Divyansh is an amazing developer. He understands the project and its scope, then proceeds with working his magic. He completed our website in under a week — every other agency we reached out to said it would take 6 months. Delivered in 7 days. Excited to work with him again." },
    { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Founder, InHimalayas" }, "reviewBody": "Divyansh is amazing with his work. We are glad it worked out so fast and so well. Would recommend him to anyone who wants to own a website and run their agency." },
    { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Founder, Redline Moto" }, "reviewBody": "Bhai bhai bhai! Ye kya banal cheez bana dia. Itne time mein pura backend, frontend, design diya — koi aam agency nahi de paati!" },
    { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Founder, Nandini Travels" }, "reviewBody": "The website is so beautiful — looks 10 times more premium than our competitors. We started getting direct bookings instead of losing them to Google Maps. Delighted to work with Divyansh." },
    { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Founder, North Peak Power Systems" }, "reviewBody": "Divyansh, exactly yahi chahiye tha. Humne pehle jisse karwaya tha vo sirf photos laga ke chala gaya. Mein apne circle mein lifetime zaroor refer karunga." }
  ]
};

export const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What exactly do I get for ₹13,000?", "acceptedAnswer": { "@type": "Answer", "text": "A custom-coded 5-page website (Home, About, Services, Gallery, Contact). Mobile-perfect. Lighthouse 90+. Contact form that sends every enquiry to your email AND your WhatsApp. Hosted free on Vercel for the first year. SEO basics (meta tags, sitemap, schema). 1 round of revisions. GST invoice. Delivered in 14 days from when you pay the advance." } },
    { "@type": "Question", "name": "How does payment work? What if I don't like it?", "acceptedAnswer": { "@type": "Answer", "text": "50% advance to start, 50% on delivery. UPI, NEFT, or Razorpay. GST invoice issued on first payment. If you don't like the design preview by Day 5 — full refund of advance, no questions, no friction." } },
    { "@type": "Question", "name": "Domain and hosting — who pays?", "acceptedAnswer": { "@type": "Answer", "text": "You buy your domain directly (₹600–1,200/yr on GoDaddy / Hostinger — I'll guide you, no markup). Hosting is included on Vercel free tier for year 1. After that, either pay ~₹2,000/yr for hosting OR enrol in the AMC at ₹2,500/month and I cover hosting + small updates." } },
    { "@type": "Question", "name": "Can the site be in Hindi or my regional language?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Hindi-English bilingual is a ₹3,000 add-on. Punjabi / Tamil / Marathi / Bengali / others — ₹5,000 each. You provide translations OR I work with a freelance translator at additional cost." } },
    { "@type": "Question", "name": "I already have a Wix / WordPress site. Can you migrate?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Migration from Wix / WordPress / Shopify to a custom site is included — no extra fee. I'll preserve your URLs and SEO so you don't lose Google ranking." } },
    { "@type": "Question", "name": "How do I know you're real?", "acceptedAnswer": { "@type": "Answer", "text": "Eight live client sites linked on the page (click each — they're real businesses). Four real founder testimonials, available on call. GST registration. Happy to do a 10-minute video call before you pay anything. WhatsApp +91-98160-91875." } }
  ]
};

export const schemaHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How a custom website is delivered in 14 days",
  "description": "The 4-stage process Divyansh Sood uses to ship a custom-coded website for an Indian small business or school in 14 days.",
  "totalTime": "P14D",
  "estimatedCost": { "@type": "MonetaryAmount", "currency": "INR", "value": "13000" },
  "tool": [
    { "@type": "HowToTool", "name": "Astro / Next.js" },
    { "@type": "HowToTool", "name": "Tailwind CSS" },
    { "@type": "HowToTool", "name": "Vercel hosting" },
    { "@type": "HowToTool", "name": "WhatsApp Business API" }
  ],
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Brief & quote (Day 1–2)", "text": "15-minute call to understand the business, lock the scope, and send a fixed quote. 50% advance payment starts the clock." },
    { "@type": "HowToStep", "position": 2, "name": "Design preview (Day 3–5)", "text": "By Day 5, a live preview URL of the homepage is sent on WhatsApp. If the client doesn't approve the design, full refund of advance — no questions." },
    { "@type": "HowToStep", "position": 3, "name": "Build (Day 6–12)", "text": "All pages built out, contact form connected to WhatsApp + email, mobile tested on multiple devices. New staging link sent every evening." },
    { "@type": "HowToStep", "position": 4, "name": "Launch (Day 13–14)", "text": "Site pointed to client's domain, GST invoice issued, 5-minute screen-record explaining how to update content. 30 days of free fixes after launch." }
  ]
};

export const schemaPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Divyansh Sood",
  "jobTitle": "Web Designer & Developer",
  "url": "https://www.divyanshsood.com/",
  "image": "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/divyansh.webp",
  "worksFor": { "@type": "Organization", "name": "Divyansh Sood", "url": "https://www.divyanshsood.com/" },
  "address": { "@type": "PostalAddress", "addressLocality": "Kangra Valley", "addressRegion": "Himachal Pradesh", "addressCountry": "IN" },
  "knowsAbout": ["Website Design", "Web Development", "Astro", "Next.js", "Tailwind CSS", "Razorpay", "WhatsApp Business API", "GEO Optimization", "LLM SEO", "School Website Development", "E-commerce Development"]
};

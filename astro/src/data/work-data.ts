// Homepage Work section — one entry per project card.
// Adding a project = adding one entry here.

export interface WorkImage { src: string; alt: string; }
export interface WorkKpi   { v: string; l: string; }
export interface WorkCard {
  href: string;
  images: WorkImage[];
  meta: string;
  pill: string;
  title: string;
  blurb: string;
  case: { problem: string; built: string; outcome: string; };
  kpis: WorkKpi[];
}

export const work: WorkCard[] = [
  {
    href: "/projects/webseek",
    images: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp", alt: "WebSeek.ai — generator surface" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-2.webp", alt: "WebSeek.ai — model picker" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-3.webp", alt: "WebSeek.ai — output preview" },
    ],
    meta: "01 · 2026 · AI PRODUCT",
    pill: "In active build",
    title: "WebSeek.ai",
    blurb: "AI website generator. Type a prompt → working site.",
    case: {
      problem: "As AI grows, web agencies need their own tooling — not someone else's API wrapper.",
      built: "Single prompt → site, in any language. Paired with Claude · GPT · Gemini for fallbacks.",
      outcome: "Live beta. 5 free credits per user, PRO plan when they run out.",
    },
    kpis: [
      { v: "3", l: "AI models" },
      { v: "5", l: "Free credits" },
      { v: "Any", l: "Language prompt" },
    ],
  },
  {
    href: "/projects/inhimalayas",
    images: [{ src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp", alt: "InHimalayas — booking homepage" }],
    meta: "02 · 2025 · TRAVEL · BOOKING",
    pill: "Revenue-share",
    title: "InHimalayas",
    blurb: "Booking platform for Himalayan stays. Tuned for AI-search traffic.",
    case: {
      problem: "Revenue-share travel brand needed a stays/resorts platform tuned for global travellers, not just India.",
      built: "Booking platform with llms.txt + GEO-optimisation built in from day one.",
      outcome: `Sudden surge in AI-referrer traffic post-launch. Founder: <em>"glad it worked out so fast and so well."</em>`,
    },
    kpis: [
      { v: "30+", l: "Stays listed" },
      { v: "↑", l: "AI-referred traffic" },
      { v: "2 wks", l: "Brief → live" },
    ],
  },
  {
    href: "/projects/dharamshala-tours",
    images: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-1.webp", alt: "Dharamshala Tours — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-2.webp", alt: "Dharamshala Tours — package page" },
    ],
    meta: "03 · 2025 · TRAVEL · CMS",
    pill: "~1,000 bookings/mo",
    title: "Dharamshala Tours",
    blurb: "WhatsApp-first booking. ~1,000 bookings/month.",
    case: {
      problem: "Joint venture of 3 school friends — treks, tours, spirituality. Listing-style competitors were stealing their leads.",
      built: "No accommodation listings. One-tap WhatsApp button on every package. Faster than the competition by design.",
      outcome: "~1,000 bookings/month flowing through this exact funnel.",
    },
    kpis: [
      { v: "~1,000", l: "Bookings/mo" },
      { v: "WhatsApp", l: "First flow" },
      { v: "Custom", l: "CMS" },
    ],
  },
  {
    href: "/projects/redline",
    images: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp", alt: "Redline Moto — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-2.webp", alt: "Redline Moto — collection grid" },
    ],
    meta: "04 · 2025 · BRAND · E-COMMERCE",
    pill: "Full sprint",
    title: "Redline Moto",
    blurb: "Brand identity + Razorpay store for a moto apparel label.",
    case: {
      problem: "F1-inspired moto-apparel brand born out of speed — needed identity, store, and a track-grade aesthetic, all at once.",
      built: "Brand + logo + product mockups + F1 track-loading animation + Razorpay store. Every element hand-tuned to racing geometry.",
      outcome: `Live storefront. Founder: <em>"Bhai bhai bhai! Koi aam agency nahi de paati."</em>`,
    },
    kpis: [
      { v: "Brand", l: "+ Storefront" },
      { v: "Razorpay", l: "Live checkout" },
      { v: "1 sprint", l: "End-to-end" },
    ],
  },
  {
    href: "/projects/chinkiz",
    images: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-1.webp", alt: "ChinkiZ — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-2.webp", alt: "ChinkiZ — desktop secondary view" },
    ],
    meta: "05 · 2024 · D2C · CREATOR",
    pill: "600K+ audience",
    title: "ChinkiZ Knitting Knife",
    blurb: "D2C store for a 600K-sub YouTuber. Custom video gallery — no Shopify themes.",
    case: {
      problem: "600K-sub YouTuber wanted to sell handmade products beyond YouTube — needed her own store, not someone else's builder.",
      built: "Custom-coded storefront with a native video gallery that matches her tutorials. Razorpay UPI · cards · COD.",
      outcome: `Live D2C. Chinki: <em>"didn't think it could be done without an e-commerce builder."</em>`,
    },
    kpis: [
      { v: "600K+", l: "YouTube subs" },
      { v: "Razorpay", l: "Cart + COD" },
      { v: "0", l: "Themes used" },
    ],
  },
  {
    href: "/projects/modernkbs",
    images: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-1.webp", alt: "Modern K.B.S. — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-2.webp", alt: "Modern K.B.S. — admissions" },
    ],
    meta: "06 · 2024 · INSTITUTIONAL",
    pill: "7-day delivery",
    title: "Modern K.B.S.",
    blurb: "School site + admissions panel. 7 days vs. 6 months.",
    case: {
      problem: "High school in Ladwara needed website + admissions portal at the same time — had to be lightweight and fully functional.",
      built: "5-page site + integrated admin panel so office staff can edit admissions content end-to-end without a developer.",
      outcome: `Delivered in 7 days. Other agencies quoted 6+ months. Admin: <em>"excited to work with him again."</em>`,
    },
    kpis: [
      { v: "7d", l: "vs. 6 months" },
      { v: "Admin", l: "For office staff" },
      { v: "I–XII", l: "Admissions live" },
    ],
  },
  {
    href: "/projects/nandini",
    images: [{ src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp", alt: "Nandini Travels — Kangra taxi operator homepage" }],
    meta: "07 · 2025 · TRAVEL · LOCAL",
    pill: "Direct bookings live",
    title: "Nandini Travels",
    blurb: "Kangra's most-reviewed taxi operator. Rebuilt site, rebuilt funnel.",
    case: {
      problem: "Most-positively-reviewed taxi op in Kangra — but their website was down. All clients came via Google Maps; zero direct bookings.",
      built: "Next.js rebuild with on-site booking form, WhatsApp CTA, outstation packages for North Indian states, airport pickup option.",
      outcome: `Direct bookings now flowing through site. Founder: <em>"looks 10× more premium than competitors."</em>`,
    },
    kpis: [
      { v: "Next.js", l: "Rebuild" },
      { v: "10×", l: '"More premium"' },
      { v: "Direct", l: "Bookings live" },
    ],
  },
  {
    href: "/projects/northpeak",
    images: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-1.webp", alt: "North Peak Power Systems — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-2.webp", alt: "North Peak Power Systems — project gallery" },
    ],
    meta: "08 · 2025 · INFRA · DASHBOARD",
    pill: "Govt → private pivot",
    title: "North Peak Power Systems",
    blurb: "Electrical & solar contractor. 15 pages + admin to publish project galleries themselves.",
    case: {
      problem: "HP electrical/solar contractor doing mostly government work — wanted to break into private sector dominated by digital + offline competitors.",
      built: "15-page Angular site + project gallery + work calendar + dashboard-cum-admin so they add new projects from their end, no dev involved.",
      outcome: `Founder, in Hindi: <em>"exactly yahi chahiye tha — mein apne circle mein lifetime zaroor refer karunga."</em>`,
    },
    kpis: [
      { v: "15", l: "Pages" },
      { v: "Admin", l: "Self-publish" },
      { v: "Angular", l: "Framework" },
    ],
  },
];

// One entry per case study. Order = case-study sequence (01 → 08).
// `body` is an array of widgets; the [slug].astro template renders them.

export type WidgetTag = "prose" | "list" | "quote";

export interface BodyWidget {
  span2?: boolean;
  tag: string;            // "The brief", "Stack", "In their words", etc.
  title?: string;         // Optional secondary head label
  type: WidgetTag;
  // For prose
  html?: string;
  // For list
  items?: string[];
  oneCol?: boolean;       // single-column list (used for WebSeek "Audience")
  // For quote
  quote?: string;
  attribution?: string;   // optional — Dharamshala's "result" widget has no attribution
}

export interface GalleryItem { src: string; alt: string; }

export interface Project {
  slug: string;
  // SEO
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  // Hero
  num: string;           // "01" .. "08"
  name: string;          // "WebSeek.ai"
  year: string;
  role: string;
  stackLine: string;
  titleHTML: string;     // markup with <em> accent
  lead: string;          // HTML string (may include <em>)
  primaryCtaHref: string;
  primaryCtaLabel: string;  // "Open live site" or "Build something similar"
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  // Feature image
  featureSrc: string;
  featureAlt: string;
  // Metrics
  metrics: { v: string; l: string }[];
  // Body
  body: BodyWidget[];
  // Gallery
  galleryLabel: string;          // "Gallery · 3 surfaces"
  gallerySingle?: boolean;       // adds class "single" to grid
  gallery: GalleryItem[];
  // Next
  nextLabel: string;             // "Next · 02" or "Back to · 01"
  nextSlug: string;
  nextName: string;              // "InHimalayas"
}

export const projects: Project[] = [
  {
    slug: "webseek",
    title: "WebSeek.ai — AI website builder · Case study · Divyansh Sood",
    description: "WebSeek.ai — our own bet on where agencies go next. One credit, one prompt, any language. Paired with Claude, GPT and Gemini.",
    ogTitle: "WebSeek.ai — AI website builder · Case study",
    ogDescription: "Our own bet on where agencies go next. One credit, one prompt, any language.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
    num: "01",
    name: "WebSeek.ai",
    year: "2026",
    role: "Solo · Design + Build",
    stackLine: "React · Tailwind · Anthropic / OpenAI / Google",
    titleHTML: `WebSeek<em>.ai</em>`,
    lead: `Our own bet on where agencies go next. One credit, one prompt, any language — paired with Claude, GPT or Gemini. Five free credits while we iterate.`,
    primaryCtaHref: "https://ai-website-generator-tan.vercel.app",
    primaryCtaLabel: "Open live site",
    secondaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20to%20build%20something%20like%20WebSeek.",
    secondaryCtaLabel: "Build something similar",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
    featureAlt: "WebSeek.ai — primary product surface",
    metrics: [
      { v: "3", l: "AI models, one app" },
      { v: "5", l: "Free credits" },
      { v: "1", l: "Prompt → site" },
      { v: "Any", l: "Language input" },
    ],
    body: [
      { span2: true, tag: "The bet", title: "Custom output, not block-assembled templates", type: "prose",
        html: `Most "AI website builders" produce identical, sectioned-template marketing pages. We built the opposite: <em>custom-coded output</em>, plus a model picker — Claude for taste, GPT for breadth, Gemini for speed.` },
      { tag: "Audience", type: "list", oneCol: true,
        items: ["SMEs without a developer", "Designers wanting a draft fast", "Our own studio — dog food"] },
      { tag: "Stack", type: "list",
        items: ["React + Tailwind", "Anthropic SDK", "OpenAI SDK", "Google AI"] },
      { span2: true, tag: "Status", title: "In active build · 5 free credits live", type: "prose",
        html: `The product is in active iteration. <strong>5 free credits</strong> for early users while we tune output quality. The output is <em>ownable HTML</em> — not stuck in a SaaS editor.` },
    ],
    galleryLabel: "Gallery · 3 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp", alt: "WebSeek.ai — generator surface" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-2.webp", alt: "WebSeek.ai — model picker" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-3.webp", alt: "WebSeek.ai — output preview" },
    ],
    nextLabel: "Next · 02",
    nextSlug: "inhimalayas",
    nextName: "InHimalayas",
  },
  {
    slug: "inhimalayas",
    title: "InHimalayas — booking platform · Case study · Divyansh Sood",
    description: "A revenue-share booking platform for resorts and stays across the Himalayas. Built for global travellers — LLM files + GEO optimisation drove a visible spike in AI-referred traffic.",
    ogTitle: "InHimalayas — booking platform · Case study",
    ogDescription: "Revenue-share booking platform tuned for global travellers and AI-search.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp",
    num: "02",
    name: "InHimalayas",
    year: "2025",
    role: "Solo · Design + Build",
    stackLine: "Astro · GEO · llms.txt",
    titleHTML: `In<em>Himalayas</em>`,
    lead: `A revenue-share booking platform for resorts and stays across the Himalayas. Built for global travellers, not domestic alone — LLM files + GEO optimisation drove a visible spike in AI-referred traffic.`,
    primaryCtaHref: "https://inhimalayas.vercel.app",
    primaryCtaLabel: "Open live site",
    secondaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20booking%20platform.",
    secondaryCtaLabel: "Build something similar",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp",
    featureAlt: "InHimalayas — homepage on desktop",
    metrics: [
      { v: "↑", l: "AI-referred traffic" },
      { v: "Global", l: "Audience reach" },
      { v: "Rev-share", l: "Business model" },
      { v: "2 wks", l: "Brief to live" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "A travel platform for the world, not just India", type: "prose",
        html: `The founder wanted a booking platform that <em>didn't</em> read like every other domestic OTA. The audience is global — backpackers, digital nomads, slow-travel families. The editorial voice had to match.` },
      { tag: "In their words", type: "quote",
        quote: `"Divyansh is amazing with his work. We are glad it worked out so fast and so well."`,
        attribution: "— Founder, InHimalayas" },
      { tag: "Stack", type: "list", items: ["Astro", "Vercel", "llms.txt + JSON-LD", "Revenue-share API"] },
      { span2: true, tag: "What we shipped", title: "Faster pages, AI-discoverable inventory", type: "prose",
        html: `Astro for content speed. <strong>llms.txt</strong> + structured data so AI assistants quote the inventory accurately. A revenue-share back-end the founder updates without touching code. AI-referred traffic showed a <strong>measurable lift</strong> within weeks.` },
    ],
    galleryLabel: "Gallery · 1 surface",
    gallerySingle: true,
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp", alt: "InHimalayas — desktop home" },
    ],
    nextLabel: "Next · 03",
    nextSlug: "dharamshala-tours",
    nextName: "Dharamshala Tours",
  },
  {
    slug: "dharamshala-tours",
    title: "Dharamshala Tours — WhatsApp-first travel · Case study · Divyansh Sood",
    description: "Three school friends in Kangra, one WhatsApp-first booking flow. Skipped the accommodation-listing pattern. ~1,000 packages booked monthly.",
    ogTitle: "Dharamshala Tours — Case study",
    ogDescription: "WhatsApp-first booking flow for a Kangra travel operator. ~1,000 packages a month.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-1.webp",
    num: "03",
    name: "Dharamshala Tours",
    year: "2025",
    role: "Solo · Design + Build",
    stackLine: "Astro · CMS · WhatsApp",
    titleHTML: `Dharamshala <em>Tours</em>`,
    lead: `Three school friends in Kangra, one WhatsApp-first booking flow. We skipped the accommodation-listing pattern the competition uses — the site is part of ~1,000 travel packages booked every month.`,
    primaryCtaHref: "https://dharamshalatours.in",
    primaryCtaLabel: "Open live site",
    secondaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20travel%20website.",
    secondaryCtaLabel: "Build something similar",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-1.webp",
    featureAlt: "Dharamshala Tours — homepage on desktop",
    metrics: [
      { v: "~1,000", l: "Bookings / month" },
      { v: "1-tap", l: "WhatsApp deep-link" },
      { v: "3", l: "Founders, Kangra" },
      { v: "CMS", l: "Self-serve editor" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "Sell packages, not hotel listings", type: "prose",
        html: `Every Kangra travel operator runs the same template — a list of hotels with prices, a contact form nobody fills. The founders wanted to be different: they sell <em>packages</em>, not rooms, and most of conversion happens on WhatsApp.` },
      { tag: "The result", type: "quote",
        quote: `~1,000 packages booked through the site every month.` },
      { tag: "Stack", type: "list", items: ["Astro", "WhatsApp deep-link", "Headless CMS", "Vercel"] },
      { span2: true, tag: "What we shipped", title: "Built around the WhatsApp moment", type: "prose",
        html: `Each package page ends in a <strong>one-tap WhatsApp deep link</strong> with the package pre-filled. The CMS lets the team push a new monsoon or winter itinerary without waiting on a developer. Mobile-first because 95%+ of their traffic is on phones.` },
    ],
    galleryLabel: "Gallery · 2 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-1.webp", alt: "Dharamshala Tours — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-2.webp", alt: "Dharamshala Tours — package page" },
    ],
    nextLabel: "Next · 04",
    nextSlug: "redline",
    nextName: "Redline Moto",
  },
  {
    slug: "redline",
    title: "Redline Moto — apparel brand storefront · Case study · Divyansh Sood",
    description: "A motorcycle apparel brand born out of speed. F1 track-styled loaders, race-car geometry, hand-picked racing colours. Nothing templated.",
    ogTitle: "Redline Moto — apparel storefront · Case study",
    ogDescription: "Motorcycle apparel brand born out of speed — F1-styled storefront, hand-built.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp",
    num: "04",
    name: "Redline Moto",
    year: "2025",
    role: "Solo · Brand + Build",
    stackLine: "Next.js · Razorpay · Custom storefront",
    titleHTML: `Redline <em>Moto</em>`,
    lead: `A brand born out of speed. F1 track-styled loaders, race-car geometry, hand-picked racing colours. Nothing templated — every element hand-selected.`,
    primaryCtaHref: "https://redlinestudios.in",
    primaryCtaLabel: "Open live site",
    secondaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20brand%20storefront.",
    secondaryCtaLabel: "Build something similar",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp",
    featureAlt: "Redline Moto — homepage on desktop",
    metrics: [
      { v: "1", l: "Sprint, end-to-end" },
      { v: "Brand", l: "From scratch" },
      { v: "Razorpay", l: "UPI · Card · COD" },
      { v: "0", l: "Shopify themes" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "A storefront that feels like a track", type: "prose",
        html: `Not a Shopify theme dressed up in red and black. Something where every easing curve, loading state and product reveal carries the brand's <em>racing DNA</em>.` },
      { tag: "Founder, in 3 words", type: "quote",
        quote: `"Bhai bhai bhai! Ye kya banal cheez bana dia."`,
        attribution: "— Founder, Redline Moto" },
      { tag: "Stack", type: "list", items: ["Next.js", "Razorpay", "Custom motion", "Brand identity"] },
      { span2: true, tag: "What we shipped", title: "Brand + backend + frontend, one sprint", type: "prose",
        html: `A custom Next.js storefront with <strong>Razorpay</strong> (UPI, cards, COD), <strong>F1-inspired motion</strong> language, and a colour system pulled from actual racing liveries. Backend, frontend, design — one sprint.` },
    ],
    galleryLabel: "Gallery · 2 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp", alt: "Redline Moto — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-2.webp", alt: "Redline Moto — collection grid" },
    ],
    nextLabel: "Next · 05",
    nextSlug: "chinkiz",
    nextName: "ChinkiZ Knitting Knife",
  },
  {
    slug: "chinkiz",
    title: "ChinkiZ Knitting Knife — D2C storefront · Case study · Divyansh Sood",
    description: "Chinki runs a 600K+ YouTube channel. We built her a direct-to-consumer storefront in custom code — no Shopify — with a video gallery that matches her tutorials.",
    ogTitle: "ChinkiZ Knitting Knife — Case study",
    ogDescription: "A custom D2C storefront for a 600K-subscriber YouTuber. No Shopify, no theme — fully owned.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-1.webp",
    num: "05",
    name: "ChinkiZ Knitting Knife",
    year: "2024",
    role: "Solo · Design + Build",
    stackLine: "Next.js · Razorpay · Custom video gallery",
    titleHTML: `ChinkiZ <em>Knitting Knife</em>`,
    lead: `Chinki runs a 600K+ YouTube channel. We built her a direct-to-consumer storefront in custom code — no Shopify, no theme marketplace — with a video gallery that matches the ritual of her tutorials.`,
    primaryCtaHref: "https://chinkizknittingknife.com",
    primaryCtaLabel: "Open live site",
    secondaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20creator%20storefront.",
    secondaryCtaLabel: "Build something similar",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-1.webp",
    featureAlt: "ChinkiZ Knitting Knife — homepage on desktop",
    metrics: [
      { v: "600K+", l: "YouTube subscribers" },
      { v: "0", l: "Themes used" },
      { v: "Razorpay", l: "UPI · Card · COD" },
      { v: "2 wks", l: "Brief to live" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "Where buy meets video", type: "prose",
        html: `Chinki tried two e-commerce builders. Both fought the way her audience shops — long tutorial videos, then a comment, then a DM. She wanted a site where the <em>video</em> sits next to the <em>buy button</em>, not buried under it.` },
      { tag: "In her words", type: "quote",
        quote: `"I did not think it could be achieved without going to e-commerce builders and only using custom code."`,
        attribution: "— Chinki, Founder" },
      { tag: "Stack", type: "list", items: ["Next.js", "Razorpay", "Custom video gallery", "Admin panel"] },
      { span2: true, tag: "What we shipped", title: "A storefront that feels like her tutorials", type: "prose",
        html: `A custom Next.js storefront with <strong>Razorpay</strong>, a <strong>video gallery</strong> mirroring her YouTube grid, and an <strong>admin panel</strong> where she adds products the way she'd add a video — title, thumbnail, done. Zero Shopify themes, zero builder lock-in, full code ownership.` },
    ],
    galleryLabel: "Gallery · 2 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-1.webp", alt: "ChinkiZ — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-2.webp", alt: "ChinkiZ — desktop secondary view" },
    ],
    nextLabel: "Next · 06",
    nextSlug: "modernkbs",
    nextName: "Modern K.B.S.",
  },
  {
    slug: "modernkbs",
    title: "Modern K.B.S. — school site + admin panel · Case study · Divyansh Sood",
    description: "A senior secondary school in Ladwara. Website + application portal shipped together with a live admin panel. Quoted at 6 months elsewhere — delivered in 7 days.",
    ogTitle: "Modern K.B.S. — school portal · Case study",
    ogDescription: "School site + admissions admin panel — 6 months elsewhere, 7 days here.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-1.webp",
    num: "06",
    name: "Modern K.B.S.",
    year: "2024",
    role: "Solo · Site + Admin Panel",
    stackLine: "Next.js · Supabase · Admin dashboard",
    titleHTML: `Modern <em>K.B.S.</em>`,
    lead: `A senior secondary school in Ladwara. Website + application portal shipped together, live admin panel threaded through every surface. Other agencies quoted 6 months; we delivered in <em>7 days</em>.`,
    primaryCtaHref: "https://modernkbs.com",
    primaryCtaLabel: "Open live site",
    secondaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20school%20website%20with%20admin%20panel.",
    secondaryCtaLabel: "Build something similar",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-1.webp",
    featureAlt: "Modern K.B.S. — homepage on desktop",
    metrics: [
      { v: "7 days", l: "vs. 6 months quoted" },
      { v: "Site + Admin", l: "Same sprint" },
      { v: "I–XII", l: "Admissions live" },
      { v: "0 SaaS", l: "Recurring fees" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "Admissions before the academic cycle", type: "prose",
        html: `The school had been quoted six months and a recurring SaaS fee for an admissions portal. They needed it before the next cycle — measured in <em>weeks</em>, not quarters. And the office staff (not developers) had to run it.` },
      { tag: "In their words", type: "quote",
        quote: `"Every other agency said 6 months. Delivered in 7 days."`,
        attribution: "— Admin, Modern K.B.S., Ladwara" },
      { tag: "Stack", type: "list", items: ["Next.js", "Supabase", "Custom admin", "Razorpay (fees)"] },
      { span2: true, tag: "What we shipped", title: "Public site + admin panel, one sprint", type: "prose",
        html: `Faculty pages, fee structure, an enquiry-to-admission pipeline, and a <strong>dashboard the office uses daily</strong>. Zero learning curve — designed so any office staffer can update content without calling a developer.` },
    ],
    galleryLabel: "Gallery · 2 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-1.webp", alt: "Modern K.B.S. — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-2.webp", alt: "Modern K.B.S. — admissions" },
    ],
    nextLabel: "Next · 07",
    nextSlug: "nandini",
    nextName: "Nandini Travels",
  },
  {
    slug: "nandini",
    title: "Nandini Travels — Kangra taxi operator · Case study · Divyansh Sood",
    description: "Most-positively-reviewed taxi operator in Kangra had a broken site and zero direct bookings — all clients came via Google Maps. Rebuilt in Next.js with on-site booking and WhatsApp CTA. Direct bookings now flowing through site.",
    ogTitle: "Nandini Travels — Kangra taxi operator · Case study",
    ogDescription: "Next.js rebuild for Kangra's most-reviewed taxi operator. Direct bookings now flow through the site instead of Google Maps.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp",
    num: "07",
    name: "Nandini Travels",
    year: "2025",
    role: "Solo · Design + Build",
    stackLine: "Next.js · WhatsApp · Booking form",
    titleHTML: `Nandini <em>Travels</em>`,
    lead: `Kangra's most-positively-reviewed taxi operator was losing every lead to Google Maps. Their old site was down. We rebuilt it in Next.js with an on-site booking form, WhatsApp CTA, outstation packages and an airport-pickup option. Direct bookings now flow through the site.`,
    primaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20travel%20%2F%20taxi%20website.",
    primaryCtaLabel: "Build something similar",
    secondaryCtaHref: "/#work",
    secondaryCtaLabel: "Back to all work",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp",
    featureAlt: "Nandini Travels — Kangra taxi operator homepage",
    metrics: [
      { v: "10×", l: '"More premium" — founder' },
      { v: "Direct", l: "Bookings (vs. only Maps)" },
      { v: "Next.js", l: "Full rebuild" },
      { v: "N. India", l: "Outstation coverage" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "Best reviews in Kangra. Worst funnel.", type: "prose",
        html: `Nandini Travels has the strongest review profile of any taxi operator in Kangra — but every booking arrived through Google Maps, and the old website was down. There was no funnel they owned. Margins shrank with every Maps-driven enquiry.` },
      { tag: "In their words", type: "quote",
        quote: `"The website is so beautiful — looks 10 times more premium than our competitors. We started getting direct bookings instead of losing them to Google Maps."`,
        attribution: "— Founder, Nandini Travels" },
      { tag: "Stack", type: "list", items: ["Next.js", "WhatsApp deep-link", "Booking form", "Vercel"] },
      { span2: true, tag: "What we shipped", title: "A funnel they own — built around the WhatsApp moment", type: "prose",
        html: `A Next.js rebuild with an <strong>on-site booking form</strong>, a one-tap WhatsApp CTA on every package, outstation routes across North Indian states, and an airport-pickup flow. Faster than the old site. Mobile-first because almost every booking starts on a phone.` },
    ],
    galleryLabel: "Gallery · 1 surface",
    gallerySingle: true,
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp", alt: "Nandini Travels — homepage" },
    ],
    nextLabel: "Next · 08",
    nextSlug: "northpeak",
    nextName: "North Peak Power Systems",
  },
  {
    slug: "northpeak",
    title: "North Peak Power Systems — solar contractor portal · Case study · Divyansh Sood",
    description: "Himachal electrical & solar contractor doing mostly government work, breaking into the private sector. 15-page Angular site + project gallery + work calendar + dashboard-cum-admin so they self-publish project case studies.",
    ogTitle: "North Peak Power Systems — solar contractor portal · Case study",
    ogDescription: "15-page Angular site + dashboard-cum-admin for a Himachal electrical/solar contractor breaking into the private sector.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-1.webp",
    num: "08",
    name: "North Peak Power Systems",
    year: "2025",
    role: "Solo · Site + Dashboard",
    stackLine: "Angular · Project gallery · Admin",
    titleHTML: `North Peak <em>Power Systems</em>`,
    lead: `Himachal electrical &amp; solar contractor doing mostly government work, breaking into the private sector dominated by digital + offline competitors. We shipped a 15-page Angular site, a project gallery, a work calendar and a dashboard-cum-admin — they publish new project case studies themselves.`,
    primaryCtaHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20site%20%2B%20admin%20panel%20for%20my%20business.",
    primaryCtaLabel: "Build something similar",
    secondaryCtaHref: "/#work",
    secondaryCtaLabel: "Back to all work",
    featureSrc: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-1.webp",
    featureAlt: "North Peak Power Systems — homepage on desktop",
    metrics: [
      { v: "15", l: "Pages shipped" },
      { v: "Admin", l: "Self-publish projects" },
      { v: "Govt → Pvt", l: "Pivot live" },
      { v: "Angular", l: "Framework" },
    ],
    body: [
      { span2: true, tag: "The brief", title: "Govt → private. With proof, not promises.", type: "prose",
        html: `The team was excellent at government tenders but invisible in the private market — where buyers want photos, recent projects and a clear pitch. The site had to <em>showcase work</em> credibly and let the team add new case studies themselves, not via a developer.` },
      { tag: "In their words", type: "quote",
        quote: `"Divyansh, exactly yahi chahiye tha. Humne pehle jisse karwaya tha vo sirf photos laga ke chala gaya. Mein apne circle mein lifetime zaroor refer karunga."`,
        attribution: "— Founder, North Peak Power Systems" },
      { tag: "Stack", type: "list", items: ["Angular", "Project gallery", "Work calendar", "Custom admin"] },
      { span2: true, tag: "What we shipped", title: "15 pages + a dashboard the team actually uses", type: "prose",
        html: `Service pages for solar, electrical and infra. A <strong>project gallery</strong> they update without dev help. A work calendar so prospects can see active engagements. A <strong>dashboard-cum-admin</strong> for new uploads — designed for a non-technical operator. Result: a private-sector pitch they can finally lead with.` },
    ],
    galleryLabel: "Gallery · 2 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-1.webp", alt: "North Peak — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-2.webp", alt: "North Peak — project gallery" },
    ],
    nextLabel: "Back to · 01",
    nextSlug: "webseek",
    nextName: "WebSeek.ai",
  },
];

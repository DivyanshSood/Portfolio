// Static case-study generator for divyanshsood.com
// Builds /projects/<slug>/index.html for every project below, matching the
// homepage redesign's design language (dark #0b0b0c, accent #ff4612, Archivo).
//
//   node scripts/build-projects.mjs
//
// Content is pulled verbatim from the live case studies (divyanshsood.com/projects/*).
// Per the brief: the company name shown is the project's full live URL.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.divyanshsood.com";

/* ----------------------------------------------------------------------- */
/* DATA — one entry per case study (01 → 08)                                */
/* ----------------------------------------------------------------------- */

const projects = [
  {
    slug: "webseek",
    num: "01", name: "WebSeek.ai", category: "AI Product", year: "2026",
    liveUrl: "https://ai-website-generator-tan.vercel.app",
    domain: "ai-website-generator-tan.vercel.app",
    headline: "WebSeek.ai", headlineTail: "— AI website builder",
    role: "Solo · Design + Build",
    stackLine: "React · Tailwind · Anthropic / OpenAI / Google",
    title: "WebSeek.ai — AI website builder · Case study · Divyansh Sood",
    description: "WebSeek.ai — our own bet on where agencies go next. One credit, one prompt, any language. Custom-coded output paired with Claude, GPT and Gemini.",
    ogTitle: "WebSeek.ai — AI website builder · Case study",
    ogDescription: "Our own bet on where agencies go next. One credit, one prompt, any language.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp",
    keywords: "AI website builder, AI website generator, prompt to website, Claude GPT Gemini website, custom-coded AI site, React Tailwind, Divyansh Sood",
    lead: `Our own bet on where agencies go next. One credit, one prompt, any language — paired with Claude, GPT or Gemini. Five free credits while we iterate.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20to%20build%20something%20like%20WebSeek.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/AiWebsitegenerator/AiWebsitegenerator-1.webp", alt: "WebSeek.ai — primary product surface" },
    metrics: [
      { v: "3", l: "AI models, one app" },
      { v: "5", l: "Free credits" },
      { v: "1", l: "Prompt → site" },
      { v: "Any", l: "Language input" },
    ],
    outcome: "One prompt to a custom-coded site, with a Claude / GPT / Gemini model picker.",
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
    faq: [
      { q: "What is WebSeek.ai?", a: "WebSeek.ai is an AI website generator built by Divyansh Sood Studio. You give it one prompt in any language and it returns a custom-coded website, with a model picker for Claude, GPT or Gemini." },
      { q: "Is WebSeek.ai free to try?", a: "Yes — every new user gets 5 free credits while the product is in active iteration. The output is ownable HTML, not locked inside a SaaS editor." },
      { q: "Which technologies power WebSeek.ai?", a: "React and Tailwind on the front end, with the Anthropic, OpenAI and Google AI SDKs powering the generation." },
    ],
    next: { slug: "inhimalayas", name: "InHimalayas", label: "Next · 02" },
  },
  {
    slug: "inhimalayas",
    num: "02", name: "InHimalayas", category: "Travel · Booking", year: "2025",
    liveUrl: "https://inhimalayas.vercel.app",
    domain: "inhimalayas.vercel.app",
    headline: "InHimalayas", headlineTail: "— booking platform",
    role: "Solo · Design + Build",
    stackLine: "Astro · GEO · llms.txt",
    title: "InHimalayas — booking platform · Case study · Divyansh Sood",
    description: "A revenue-share booking platform for resorts and stays across the Himalayas. Built for global travellers — LLM files + GEO optimisation drove a visible spike in AI-referred traffic.",
    ogTitle: "InHimalayas — booking platform · Case study",
    ogDescription: "Revenue-share booking platform tuned for global travellers and AI-search.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp",
    keywords: "Himalayas booking platform, resort booking website, travel platform India, GEO optimisation, llms.txt, AI search travel, Astro developer, Divyansh Sood",
    lead: `A revenue-share booking platform for resorts and stays across the Himalayas. Built for global travellers, not domestic alone — LLM files + GEO optimisation drove a visible spike in AI-referred traffic.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20booking%20platform.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp", alt: "InHimalayas — homepage on desktop" },
    metrics: [
      { v: "↑", l: "AI-referred traffic" },
      { v: "Global", l: "Audience reach" },
      { v: "Rev-share", l: "Business model" },
      { v: "2 wks", l: "Brief to live" },
    ],
    outcome: "A measurable lift in AI-referred traffic within weeks of launch.",
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
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/inhimalayas/inhimalayas-1.webp", alt: "InHimalayas — desktop home" },
    ],
    faq: [
      { q: "What is InHimalayas?", a: "InHimalayas is a revenue-share booking platform for resorts and stays across the Himalayas, built by Divyansh Sood Studio for a global travel audience." },
      { q: "How was it optimised for AI search?", a: "It ships with an llms.txt file and JSON-LD structured data so AI assistants can quote the inventory accurately — which drove a measurable lift in AI-referred traffic within weeks." },
      { q: "What stack does InHimalayas run on?", a: "Astro on Vercel, with llms.txt + JSON-LD for GEO and a revenue-share back-end the founder can update without touching code." },
    ],
    next: { slug: "dharamshala-tours", name: "Dharamshala Tours", label: "Next · 03" },
  },
  {
    slug: "dharamshala-tours",
    num: "03", name: "Dharamshala Tours", category: "Travel · CMS", year: "2025",
    liveUrl: "https://dharamshalatours.in",
    domain: "dharamshalatours.in",
    headline: "Dharamshala Tours", headlineTail: "— WhatsApp-first travel",
    role: "Solo · Design + Build",
    stackLine: "Astro · CMS · WhatsApp",
    title: "Dharamshala Tours — WhatsApp-first travel · Case study · Divyansh Sood",
    description: "Three school friends in Kangra, one WhatsApp-first booking flow. Skipped the accommodation-listing pattern. Part of ~1,000 packages booked monthly.",
    ogTitle: "Dharamshala Tours — Case study",
    ogDescription: "WhatsApp-first booking flow for a Kangra travel operator. ~1,000 packages a month.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-1.webp",
    keywords: "Dharamshala tours, Kangra travel website, WhatsApp booking, travel packages Himachal, Astro CMS website, travel operator website India, Divyansh Sood",
    lead: `Three school friends in Kangra, one WhatsApp-first booking flow. We skipped the accommodation-listing pattern the competition uses — the site is part of ~1,000 travel packages booked every month.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20travel%20website.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/DharamshalaTours/DharamshalaTours-1.webp", alt: "Dharamshala Tours — homepage on desktop" },
    metrics: [
      { v: "~1,000", l: "Bookings / month" },
      { v: "1-tap", l: "WhatsApp deep-link" },
      { v: "3", l: "Founders, Kangra" },
      { v: "CMS", l: "Self-serve editor" },
    ],
    outcome: "Part of ~1,000 travel packages booked through the site every month.",
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
    faq: [
      { q: "What is Dharamshala Tours?", a: "Dharamshala Tours is a WhatsApp-first travel booking site for a Kangra operator run by three school friends, built by Divyansh Sood Studio. It sells travel packages rather than hotel listings." },
      { q: "How do customers book a trip?", a: "Every package page ends in a one-tap WhatsApp deep link with the package pre-filled, because most conversion happens on WhatsApp. The site is part of roughly 1,000 packages booked each month." },
      { q: "Can the team add new packages themselves?", a: "Yes — a headless CMS lets the team publish a new monsoon or winter itinerary without waiting on a developer." },
    ],
    next: { slug: "redline", name: "Redline Studios", label: "Next · 04" },
  },
  {
    slug: "redline",
    num: "04", name: "Redline Studios", category: "Brand · E-commerce", year: "2025",
    liveUrl: "https://redlinestudios.in",
    domain: "redlinestudios.in",
    headline: "Redline Studios", headlineTail: "— apparel storefront",
    role: "Solo · Brand + Build",
    stackLine: "Next.js · Razorpay · Custom storefront",
    title: "Redline Studios — apparel brand storefront · Case study · Divyansh Sood",
    description: "A motorcycle apparel brand born out of speed. F1 track-styled loaders, race-car geometry, hand-picked racing colours. Nothing templated — custom Next.js + Razorpay.",
    ogTitle: "Redline Studios — apparel storefront · Case study",
    ogDescription: "Motorcycle apparel brand born out of speed — F1-styled storefront, hand-built.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp",
    keywords: "motorcycle apparel storefront, custom e-commerce India, Next.js storefront, Razorpay store, brand identity, F1 styled website, no Shopify, Divyansh Sood",
    lead: `A brand born out of speed. F1 track-styled loaders, race-car geometry, hand-picked racing colours. Nothing templated — every element hand-selected.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20brand%20storefront.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp", alt: "Redline Studios — homepage on desktop" },
    metrics: [
      { v: "1", l: "Sprint, end-to-end" },
      { v: "Brand", l: "From scratch" },
      { v: "Razorpay", l: "UPI · Card · COD" },
      { v: "0", l: "Shopify themes" },
    ],
    outcome: "Brand identity + storefront + payments, hand-built end-to-end in one sprint.",
    body: [
      { span2: true, tag: "The brief", title: "A storefront that feels like a track", type: "prose",
        html: `Not a Shopify theme dressed up in red and black. Something where every easing curve, loading state and product reveal carries the brand's <em>racing DNA</em>.` },
      { tag: "Founder, in 3 words", type: "quote",
        quote: `"Bhai bhai bhai! Ye kya banal cheez bana dia."`,
        attribution: "— Founder, Redline Studios" },
      { tag: "Stack", type: "list", items: ["Next.js", "Razorpay", "Custom motion", "Brand identity"] },
      { span2: true, tag: "What we shipped", title: "Brand + backend + frontend, one sprint", type: "prose",
        html: `A custom Next.js storefront with <strong>Razorpay</strong> (UPI, cards, COD), <strong>F1-inspired motion</strong> language, and a colour system pulled from actual racing liveries. Backend, frontend, design — one sprint.` },
    ],
    galleryLabel: "Gallery · 2 surfaces",
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-1.webp", alt: "Redline Studios — desktop home" },
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/redlinestudios/redlinestudios-2.webp", alt: "Redline Studios — collection grid" },
    ],
    faq: [
      { q: "What is Redline Studios?", a: "Redline Studios is a motorcycle-apparel brand whose identity and storefront were built end-to-end by Divyansh Sood Studio — F1-styled motion, race-car geometry and a colour system pulled from real racing liveries." },
      { q: "Was the store built on Shopify?", a: "No. It is a custom Next.js storefront with zero Shopify themes, integrated with Razorpay for UPI, cards and cash on delivery." },
      { q: "How long did it take?", a: "Brand identity, backend, frontend and design were all delivered in a single sprint." },
    ],
    next: { slug: "chinkiz", name: "ChinkiZ Knitting Knife", label: "Next · 05" },
  },
  {
    slug: "chinkiz",
    num: "05", name: "ChinkiZ Knitting Knife", category: "D2C · Creator", year: "2024",
    liveUrl: "https://chinkizknittingknife.com",
    domain: "chinkizknittingknife.com",
    headline: "ChinkiZ Knitting Knife", headlineTail: "— D2C storefront",
    role: "Solo · Design + Build",
    stackLine: "Next.js · Razorpay · Custom video gallery",
    title: "ChinkiZ Knitting Knife — D2C storefront · Case study · Divyansh Sood",
    description: "Chinki runs a 600K+ YouTube channel. We built her a direct-to-consumer storefront in custom code — no Shopify — with a video gallery that matches her tutorials.",
    ogTitle: "ChinkiZ Knitting Knife — Case study",
    ogDescription: "A custom D2C storefront for a 600K-subscriber YouTuber. No Shopify, no theme — fully owned.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-1.webp",
    keywords: "creator storefront, YouTuber e-commerce, D2C website India, custom Next.js store, Razorpay storefront, video commerce, no Shopify, Divyansh Sood",
    lead: `Chinki runs a 600K+ YouTube channel. We built her a direct-to-consumer storefront in custom code — no Shopify, no theme marketplace — with a video gallery that matches the ritual of her tutorials.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20creator%20storefront.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/ChinkizKnittingKnife/ChinkizKnittingKnife-1.webp", alt: "ChinkiZ Knitting Knife — homepage on desktop" },
    metrics: [
      { v: "600K+", l: "YouTube subscribers" },
      { v: "0", l: "Themes used" },
      { v: "Razorpay", l: "UPI · Card · COD" },
      { v: "2 wks", l: "Brief to live" },
    ],
    outcome: "A custom-coded storefront with a native video gallery — full code ownership, no builder lock-in.",
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
    faq: [
      { q: "What is ChinkiZ Knitting Knife?", a: "ChinkiZ Knitting Knife is a direct-to-consumer storefront built by Divyansh Sood Studio for Chinki, a creator with a 600K+ subscriber YouTube channel. The site puts her tutorial videos next to the buy button." },
      { q: "Does the store use Shopify or a website builder?", a: "No. It is fully custom-coded in Next.js with Razorpay payments — zero Shopify themes and zero builder lock-in, so the owner keeps full code ownership." },
      { q: "How does the owner add products?", a: "A custom admin panel lets her add a product the way she'd add a video — title, thumbnail, done — with a video gallery that mirrors her YouTube grid." },
    ],
    next: { slug: "modernkbs", name: "Modern K.B.S.", label: "Next · 06" },
  },
  {
    slug: "modernkbs",
    num: "06", name: "Modern K.B.S.", category: "Institutional", year: "2024",
    liveUrl: "https://modernkbs.com",
    domain: "modernkbs.com",
    headline: "Modern K.B.S.", headlineTail: "— school site + admin panel",
    role: "Solo · Site + Admin Panel",
    stackLine: "Next.js · Supabase · Admin dashboard",
    title: "Modern K.B.S. — school site + admin panel · Case study · Divyansh Sood",
    description: "A senior secondary school in Ladwara. Website + application portal shipped together with a live admin panel. Quoted at 6 months elsewhere — delivered in 7 days.",
    ogTitle: "Modern K.B.S. — school portal · Case study",
    ogDescription: "School site + admissions admin panel — 6 months elsewhere, 7 days here.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-1.webp",
    keywords: "school website India, admissions portal, school admin panel, Next.js Supabase, education website developer, fast website delivery, Divyansh Sood",
    lead: `A senior secondary school in Ladwara. Website + application portal shipped together, live admin panel threaded through every surface. Other agencies quoted 6 months; we delivered in <em>7 days</em>.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20school%20website%20with%20admin%20panel.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/modernkbs/modernkbs-1.webp", alt: "Modern K.B.S. — homepage on desktop" },
    metrics: [
      { v: "7 days", l: "vs. 6 months quoted" },
      { v: "Site + Admin", l: "Same sprint" },
      { v: "I–XII", l: "Admissions live" },
      { v: "0 SaaS", l: "Recurring fees" },
    ],
    outcome: "Public site + admissions admin panel delivered in 7 days, where other agencies quoted 6 months.",
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
    faq: [
      { q: "What is Modern K.B.S.?", a: "Modern K.B.S. is a senior secondary school in Ladwara. Divyansh Sood Studio built its public website plus an admissions application portal and a live admin panel, all in one sprint." },
      { q: "How long did the build take?", a: "Seven days — where other agencies had quoted six months and a recurring SaaS fee." },
      { q: "Who runs the admin panel?", a: "Office staff, not developers. The dashboard was designed with zero learning curve so any staffer can update content and process admissions without calling a developer." },
    ],
    next: { slug: "nandini", name: "Nandini Travels", label: "Next · 07" },
  },
  {
    slug: "nandini",
    num: "07", name: "Nandini Travels", category: "Travel · Local", year: "2025",
    liveUrl: "https://www.nandinitravel.com/",
    domain: "nandinitravel.com",
    headline: "Nandini Travels", headlineTail: "— Kangra taxi operator",
    role: "Solo · Design + Build",
    stackLine: "Next.js · WhatsApp · Booking form",
    title: "Nandini Travels — Kangra taxi operator · Case study · Divyansh Sood",
    description: "Kangra's most-positively-reviewed taxi operator had a broken site and zero direct bookings — all leads came via Google Maps. Rebuilt in Next.js with on-site booking and a WhatsApp CTA. Direct bookings now flow through the site.",
    ogTitle: "Nandini Travels — Kangra taxi operator · Case study",
    ogDescription: "Next.js rebuild for Kangra's most-reviewed taxi operator. Direct bookings now flow through the site instead of Google Maps.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp",
    keywords: "Kangra taxi website, taxi operator website India, travel booking form, WhatsApp booking, Next.js travel site, direct bookings, Google Maps alternative, Divyansh Sood",
    lead: `Kangra's most-positively-reviewed taxi operator was losing every lead to Google Maps. Their old site was down. We rebuilt it in Next.js with an on-site booking form, WhatsApp CTA, outstation packages and an airport-pickup option. Direct bookings now flow through the site.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20travel%20%2F%20taxi%20website.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp", alt: "Nandini Travels — Kangra taxi operator homepage" },
    metrics: [
      { v: "10×", l: '"More premium" — founder' },
      { v: "Direct", l: "Bookings (vs. only Maps)" },
      { v: "Next.js", l: "Full rebuild" },
      { v: "N. India", l: "Outstation coverage" },
    ],
    outcome: "Direct bookings now flow through a site the operator owns, instead of leaking to Google Maps.",
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
    gallery: [
      { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/nandinitravels/nandinitravels-1.webp", alt: "Nandini Travels — homepage" },
    ],
    faq: [
      { q: "What is Nandini Travels?", a: "Nandini Travels is Kangra's most-positively-reviewed taxi operator. Divyansh Sood Studio rebuilt their website in Next.js with an on-site booking form, a WhatsApp CTA, outstation packages and airport pickup." },
      { q: "Why did the site need rebuilding?", a: "Every booking used to arrive through Google Maps and the old site was down, so the operator owned no funnel. After the rebuild, direct bookings now flow through the site." },
      { q: "What did the founder say about the result?", a: "“The website is so beautiful — looks 10 times more premium than our competitors. We started getting direct bookings instead of losing them to Google Maps.”" },
    ],
    next: { slug: "northpeak", name: "North Peak Power Systems", label: "Next · 08" },
  },
  {
    slug: "northpeak",
    num: "08", name: "North Peak Power Systems", category: "Infra · Dashboard", year: "2025",
    liveUrl: "https://northpeakpowersystems.vercel.app/",
    domain: "northpeakpowersystems.vercel.app",
    headline: "North Peak Power Systems", headlineTail: "— solar contractor portal",
    role: "Solo · Site + Dashboard",
    stackLine: "Angular · Project gallery · Admin",
    title: "North Peak Power Systems — solar contractor portal · Case study · Divyansh Sood",
    description: "Himachal electrical & solar contractor doing mostly government work, breaking into the private sector. 15-page Angular site + project gallery + work calendar + dashboard-cum-admin so they self-publish project case studies.",
    ogTitle: "North Peak Power Systems — solar contractor portal · Case study",
    ogDescription: "15-page Angular site + dashboard-cum-admin for a Himachal electrical/solar contractor breaking into the private sector.",
    ogImage: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-1.webp",
    keywords: "solar contractor website, electrical contractor portal, Angular website, project gallery, admin dashboard, Himachal solar, government to private, Divyansh Sood",
    lead: `Himachal electrical &amp; solar contractor doing mostly government work, breaking into the private sector dominated by digital + offline competitors. We shipped a 15-page Angular site, a project gallery, a work calendar and a dashboard-cum-admin — they publish new project case studies themselves.`,
    waHref: "https://wa.me/919816091875?text=Hi%20Divyansh,%20I%20want%20a%20site%20%2B%20admin%20panel%20for%20my%20business.",
    feature: { src: "https://ik.imagekit.io/dn2zdxiu3/Portfolioprojectimages/NorthPeakPowerSystems/NorthPeakPowerSystems-1.webp", alt: "North Peak Power Systems — homepage on desktop" },
    metrics: [
      { v: "15", l: "Pages shipped" },
      { v: "Admin", l: "Self-publish projects" },
      { v: "Govt → Pvt", l: "Pivot live" },
      { v: "Angular", l: "Framework" },
    ],
    outcome: "A 15-page portal + self-serve admin that finally lets the team lead with a private-sector pitch.",
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
    faq: [
      { q: "What is North Peak Power Systems?", a: "North Peak Power Systems is a Himachal electrical and solar contractor. Divyansh Sood Studio built a 15-page Angular site with a project gallery, work calendar and a dashboard-cum-admin to help them break into the private sector." },
      { q: "Can the team publish new projects without a developer?", a: "Yes — a dashboard-cum-admin, designed for a non-technical operator, lets the team upload new project case studies and update the gallery themselves." },
      { q: "What framework was used?", a: "Angular, across all 15 pages, with a custom admin dashboard." },
    ],
    next: { slug: "webseek", name: "WebSeek.ai", label: "Back to · 01" },
  },
];

/* ----------------------------------------------------------------------- */
/* HELPERS                                                                  */
/* ----------------------------------------------------------------------- */

const A = "#ff4612";
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tr = (src, w) => `${src}?tr=w-${w},q-70`;
const srcset = (src) => [420, 560, 760, 1040, 1400].map((w) => `${tr(src, w)} ${w}w`).join(", ");

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

function bodyCard(w) {
  if (w.type === "quote") {
    return `<figure class="cs-card cs-quote${w.span2 ? " span2" : ""}">
          <span class="cs-tag">${esc(w.tag)}</span>
          <blockquote>${esc(w.quote)}</blockquote>
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
  // prose
  return `<div class="cs-card${w.span2 ? " span2" : ""}">
          <span class="cs-tag">${esc(w.tag)}</span>
          ${w.title ? `<h3>${w.title}</h3>` : ""}
          <p>${w.html}</p>
        </div>`;
}

function jsonLd(p, canonical) {
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
      jobTitle: "Web Designer & Developer",
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

  // testimonial → Review of the studio, authored by the client
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

/* ----------------------------------------------------------------------- */
/* TEMPLATE                                                                 */
/* ----------------------------------------------------------------------- */

function page(p) {
  const canonical = `${SITE}/projects/${p.slug}`;
  const metrics = p.metrics
    .map((m) => `<div class="cs-metric"><span class="cs-metric-v">${esc(m.v)}</span><span class="cs-metric-l">${esc(m.l)}</span></div>`)
    .join("");
  const bodyCards = p.body.map(bodyCard).join("\n        ");
  const gallery = p.gallery
    .map((g) => imgFigure(g, { ratio: "16 / 10" }))
    .join("\n        ");
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description.replace(/<[^>]+>/g, ""))}">
<meta name="keywords" content="${esc(p.keywords)}">
<meta name="author" content="Divyansh Sood">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0b0b0c">
<meta name="geo.region" content="IN-HP">
<meta name="geo.placename" content="Himachal Pradesh, India">
<meta name="geo.position" content="32.0998;76.2691">
<meta name="ICBM" content="32.0998, 76.2691">
<meta name="apple-mobile-web-app-title" content="Divyansh Sood">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Divyansh Sood® Studio">
<meta property="og:title" content="${esc(p.ogTitle)}">
<meta property="og:description" content="${esc(p.ogDescription)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${esc(p.ogImage)}">
<meta property="og:image:width" content="1600">
<meta property="og:image:height" content="1000">
<meta property="og:locale" content="en_IN">
<meta property="article:author" content="Divyansh Sood">
<meta property="article:published_time" content="${p.year}-01-01">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.ogTitle)}">
<meta name="twitter:description" content="${esc(p.ogDescription)}">
<meta name="twitter:image" content="${esc(p.ogImage)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230b0b0c'/%3E%3Ctext x='50' y='70' font-family='Arial,sans-serif' font-weight='900' font-size='56' fill='%23ffffff' text-anchor='middle'%3EDS%3C/text%3E%3Crect x='28' y='80' width='44' height='6' fill='%23ff4612'/%3E%3C/svg%3E">
<link rel="manifest" href="/site.webmanifest">
<link rel="apple-touch-icon" href="/icon.svg">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://ik.imagekit.io" crossorigin>
<link rel="preload" as="image" href="${esc(tr(p.feature.src, 1040))}" imagesrcset="${esc(srcset(p.feature.src))}" imagesizes="${FEATURE_SIZES}" fetchpriority="high">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Caveat:wght@600;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Caveat:wght@600;700&display=swap"></noscript>
<script type="application/ld+json">
${jsonLd(p, canonical)}
</script>
<style>
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  html,body{margin:0;padding:0;}
  body{background:#0b0b0c;color:#fff;font-family:'Archivo',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  #ds-root{--accent:${A};position:relative;}
  ::selection{background:var(--accent);color:#fff;}
  a{color:inherit;}
  img{display:block;max-width:100%;}
  .mono{font-family:'Space Mono',monospace;}
  .wrap{max-width:1180px;margin:0 auto;padding:0 30px;}
  #ds-cursor{position:fixed;top:0;left:0;width:34px;height:34px;border:1.5px solid #fff;border-radius:50%;pointer-events:none;z-index:9999;mix-blend-mode:difference;transition:width .25s ease,height .25s ease,background .25s ease;will-change:transform;}
  #ds-cursor.big{width:74px;height:74px;background:#fff;}

  /* nav */
  #ds-nav{position:fixed;top:0;left:0;width:100%;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:16px 30px;transition:background .4s ease,border-color .4s ease,backdrop-filter .4s ease;border-bottom:1px solid transparent;}
  #ds-nav .brand{font-weight:900;font-size:19px;letter-spacing:-.04em;color:#fff;text-decoration:none;}
  #ds-nav .kicker{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;border-left:1px solid rgba(255,255,255,.25);padding-left:14px;}
  .nav-links{display:flex;gap:26px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;}
  .nav-links a{color:#fff;text-decoration:none;opacity:.85;}
  .nav-cta{display:inline-flex;align-items:center;gap:9px;background:var(--accent);color:#0b0b0c;text-decoration:none;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:11px 18px;border-radius:2px;font-weight:700;}

  /* hero */
  .cs-hero{position:relative;padding:150px 0 56px;overflow:hidden;}
  .cs-hero-bg{position:absolute;inset:0;background:radial-gradient(90% 70% at 78% 12%,rgba(255,70,18,.20),transparent 55%),radial-gradient(60% 55% at 12% 96%,rgba(255,70,18,.09),transparent 60%),linear-gradient(180deg,#161618 0%,#0b0b0c 70%);}
  .cs-hero .wrap{position:relative;z-index:2;}
  .cs-eyebrow{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.66;border-bottom:1px solid rgba(255,255,255,.18);padding-bottom:14px;margin-bottom:30px;}
  .cs-domain{display:inline-flex;align-items:baseline;gap:.35em;font-weight:900;letter-spacing:-.03em;font-size:clamp(30px,6.4vw,82px);line-height:1.02;color:#fff;text-decoration:none;word-break:break-word;}
  .cs-domain .arrow{font-size:.45em;color:var(--accent);transform:translateY(-.12em);}
  .cs-domain:hover{color:var(--accent);}
  .cs-h1{margin:18px 0 0;font-weight:700;font-size:clamp(22px,3vw,40px);line-height:1.12;letter-spacing:-.02em;max-width:18ch;}
  .cs-h1 .tail{color:var(--accent);}
  .cs-lead{margin:22px 0 0;font-size:clamp(16px,1.5vw,19px);line-height:1.62;max-width:60ch;opacity:.9;}
  .cs-lead em{font-style:normal;color:var(--accent);}
  .cs-cta-row{display:flex;flex-wrap:wrap;gap:14px;margin-top:32px;}
  .btn{display:inline-flex;align-items:center;gap:9px;text-decoration:none;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:14px 22px;border-radius:2px;font-weight:700;}
  .btn-primary{background:var(--accent);color:#0b0b0c;}
  .btn-ghost{border:1px solid rgba(255,255,255,.3);color:#fff;}
  .cs-meta{display:flex;flex-wrap:wrap;gap:8px 26px;margin-top:30px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;opacity:.62;}

  /* feature image */
  .cs-feature{margin-top:46px;}
  .cs-shot{margin:0;border:1px solid rgba(255,255,255,.14);border-radius:8px;overflow:hidden;background:#161618;}
  .cs-shot img{width:100%;height:100%;object-fit:cover;}

  /* section scaffolding */
  section{position:relative;}
  .cs-sec{padding:64px 0;border-top:1px solid rgba(255,255,255,.14);}
  .cs-sec-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:34px;}
  .cs-sec-head h2{margin:0;font-weight:800;font-size:clamp(24px,3.2vw,42px);letter-spacing:-.02em;}
  .cs-sec-head .mono{font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.55;}

  /* at-a-glance */
  .cs-glance{display:grid;grid-template-columns:repeat(2,1fr);gap:0;border:1px solid rgba(255,255,255,.14);border-radius:8px;overflow:hidden;}
  .cs-glance div{padding:20px 22px;border-bottom:1px solid rgba(255,255,255,.1);border-right:1px solid rgba(255,255,255,.1);}
  .cs-glance dt{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin:0 0 7px;}
  .cs-glance dd{margin:0;font-size:16px;font-weight:600;line-height:1.4;}
  .cs-glance dd a{color:var(--accent);text-decoration:none;word-break:break-word;}

  /* metrics */
  .cs-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
  .cs-metric{border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:26px 22px;background:linear-gradient(180deg,rgba(255,255,255,.03),transparent);}
  .cs-metric-v{display:block;font-weight:900;font-size:clamp(30px,4vw,52px);letter-spacing:-.03em;color:var(--accent);}
  .cs-metric-l{display:block;margin-top:8px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;opacity:.72;line-height:1.4;}

  /* body cards */
  .cs-body{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
  .cs-card{border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:28px 26px;background:linear-gradient(180deg,rgba(255,255,255,.03),transparent);}
  .cs-card.span2{grid-column:span 2;}
  .cs-tag{display:inline-block;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;}
  .cs-card h3{margin:0 0 12px;font-weight:700;font-size:clamp(18px,2vw,24px);letter-spacing:-.01em;}
  .cs-card p{margin:0;font-size:16px;line-height:1.66;opacity:.86;}
  .cs-card p em{font-style:normal;color:var(--accent);}
  .cs-card p strong{color:#fff;}
  .cs-list{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;}
  .cs-list.one{grid-template-columns:1fr;}
  .cs-list li{position:relative;padding-left:20px;font-size:15px;line-height:1.5;opacity:.86;}
  .cs-list li::before{content:"";position:absolute;left:0;top:.62em;width:7px;height:7px;background:var(--accent);border-radius:1px;}
  .cs-quote blockquote{margin:0;font-size:clamp(18px,2.1vw,26px);line-height:1.42;font-weight:600;letter-spacing:-.01em;}
  .cs-quote figcaption{margin-top:16px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.06em;opacity:.66;}

  /* gallery */
  .cs-gallery{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
  .cs-gallery.single{grid-template-columns:1fr;}

  /* faq */
  .cs-faq{max-width:820px;}
  .cs-faq-row{border-top:1px solid rgba(255,255,255,.14);}
  .cs-faq-row:last-child{border-bottom:1px solid rgba(255,255,255,.14);}
  .cs-faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 2px;background:none;border:0;color:#fff;cursor:pointer;text-align:left;font-family:inherit;font-weight:700;font-size:17px;letter-spacing:-.01em;}
  .cs-faq-icon{font-size:24px;color:var(--accent);transition:transform .35s cubic-bezier(.2,.8,.2,1);line-height:1;}
  .cs-faq-a{overflow:hidden;max-height:0;opacity:0;transition:max-height .5s cubic-bezier(.2,.8,.2,1),opacity .4s ease;}
  .cs-faq-a p{margin:0;padding:0 2px 24px;font-size:15px;line-height:1.66;opacity:.8;max-width:70ch;}

  /* next + cta */
  .cs-next{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;text-decoration:none;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:30px 30px;transition:border-color .3s ease,background .3s ease;}
  .cs-next:hover{border-color:var(--accent);background:rgba(255,70,18,.06);}
  .cs-next .label{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;}
  .cs-next .name{font-weight:800;font-size:clamp(24px,3.4vw,44px);letter-spacing:-.02em;text-transform:uppercase;}
  .cs-next .arrow{font-size:30px;color:var(--accent);}

  .cs-endcta{text-align:center;padding:80px 0;border-top:1px solid rgba(255,255,255,.14);background:radial-gradient(70% 120% at 50% 0%,rgba(255,70,18,.12),transparent 60%);}
  .cs-endcta h2{margin:0 0 10px;font-weight:800;font-size:clamp(26px,4vw,52px);letter-spacing:-.02em;}
  .cs-endcta p{margin:0 auto 28px;max-width:46ch;opacity:.8;font-size:16px;line-height:1.6;}

  /* footer */
  .cs-foot{border-top:1px solid rgba(255,255,255,.14);}
  .cs-foot .grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px;padding:46px 0;}
  .cs-foot .word{font-weight:900;font-size:34px;letter-spacing:-.04em;}
  .cs-foot .sig{font-family:'Caveat',cursive;font-weight:700;font-size:40px;color:var(--accent);transform:rotate(-6deg);transform-origin:left;}
  .cs-foot .col{font-family:'Space Mono',monospace;font-size:13px;line-height:2;}
  .cs-foot .col .h{font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.5;margin-bottom:10px;}
  .cs-foot .col a{color:#fff;text-decoration:none;display:block;opacity:.82;}
  .cs-foot .bar{border-top:1px solid rgba(255,255,255,.14);padding:20px 0;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.55;}

  @media (max-width:860px){
    .nav-links{display:none;}
    .cs-body,.cs-glance,.cs-gallery,.cs-gallery.single,.cs-foot .grid{grid-template-columns:1fr;}
    .cs-card.span2{grid-column:auto;}
    .cs-metrics{grid-template-columns:1fr 1fr;}
    .cs-list{grid-template-columns:1fr;}
  }
  @media (max-width:760px){#ds-cursor{display:none;}}
  @media (max-width:560px){
    .cs-hero{padding-top:120px;}
    .cs-eyebrow{gap:4px 14px;font-size:9px;}
    .cs-eyebrow span{flex:1 1 auto;word-break:break-word;}
    .cs-cta-row{flex-direction:column;align-items:stretch;}
    .cs-endcta .cs-cta-row{align-items:stretch;}
    .btn{justify-content:center;}
    .cs-next{padding:24px 22px;}
  }
  @media (prefers-reduced-motion:reduce){
    html{scroll-behavior:auto;}
    *{animation-duration:.001ms !important;transition-duration:.001ms !important;}
    [data-reveal]{opacity:1 !important;transform:none !important;}
  }
  [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1);}
</style>
<noscript><style>[data-reveal]{opacity:1 !important;transform:none !important;}</style></noscript>
</head>
<body>
<div id="ds-root">
  <div id="ds-cursor" aria-hidden="true"></div>

  <!-- NAV -->
  <nav id="ds-nav">
    <div style="display:flex;align-items:center;gap:14px;">
      <a href="/" class="brand">DIVYANSH&nbsp;SOOD<sup style="font-size:9px;top:-.7em;">®</sup></a>
      <span class="kicker">Case study</span>
    </div>
    <div style="display:flex;align-items:center;gap:30px;">
      <div class="nav-links">
        <a href="/#work">Works</a>
        <a href="/blog/">Blog</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </div>
      <a href="/#contact" data-cursor class="nav-cta">Start a project <span aria-hidden="true">↗</span></a>
    </div>
  </nav>

  <main>
    <!-- HERO -->
    <header class="cs-hero">
      <div class="cs-hero-bg" aria-hidden="true"></div>
      <div class="wrap">
        <div class="cs-eyebrow">
          <span>Case study — ${esc(p.num)}</span>
          <span>${esc(p.name)} · ${esc(p.category)}</span>
          <span>${esc(p.year)}</span>
        </div>
        <a class="cs-domain" href="${esc(p.liveUrl)}" target="_blank" rel="noopener" data-cursor>${esc(p.domain)}<span class="arrow" aria-hidden="true">↗</span></a>
        <h1 class="cs-h1">${esc(p.headline)} <span class="tail">${esc(p.headlineTail)}</span></h1>
        <p class="cs-lead">${p.lead}</p>
        <div class="cs-cta-row">
          <a class="btn btn-primary" href="${esc(p.liveUrl)}" target="_blank" rel="noopener" data-cursor>Open live site <span aria-hidden="true">↗</span></a>
          <a class="btn btn-ghost" href="${esc(p.waHref)}" target="_blank" rel="noopener" data-cursor>Build something similar</a>
        </div>
        <div class="cs-meta">
          <span>${esc(p.role)}</span><span>${esc(p.stackLine)}</span>
        </div>
      </div>
    </header>

    <!-- FEATURE -->
    <div class="wrap cs-feature">
      ${imgFigure(p.feature, { lcp: true, ratio: "16 / 10" })}
    </div>

    <!-- AT A GLANCE -->
    <section class="cs-sec" aria-labelledby="glance-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="glance-h">At a glance</h2>
          <span class="mono">Project summary</span>
        </div>
        <dl class="cs-glance">
          <div><dt>Client</dt><dd>${esc(p.name)}</dd></div>
          <div><dt>Live site</dt><dd><a href="${esc(p.liveUrl)}" target="_blank" rel="noopener" data-cursor>${esc(p.domain)} ↗</a></dd></div>
          <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
          <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
          <div><dt>Stack</dt><dd>${esc(p.stackLine)}</dd></div>
          <div><dt>Outcome</dt><dd>${esc(p.outcome)}</dd></div>
        </dl>
      </div>
    </section>

    <!-- RESULTS -->
    <section class="cs-sec" aria-labelledby="results-h">
      <div class="wrap">
        <div class="cs-sec-head">
          <h2 id="results-h">By the numbers</h2>
          <span class="mono">Results</span>
        </div>
        <div class="cs-metrics" data-reveal>${metrics}</div>
      </div>
    </section>

    <!-- BODY -->
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

    <!-- GALLERY -->
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

    <!-- FAQ -->
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

    <!-- NEXT -->
    <section class="cs-sec" aria-label="Project navigation">
      <div class="wrap">
        <a class="cs-next" href="/projects/${esc(p.next.slug)}" data-cursor>
          <span><span class="label">${esc(p.next.label)}</span><br><span class="name">${esc(p.next.name)}</span></span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <!-- END CTA -->
    <section class="cs-endcta">
      <div class="wrap">
        <h2>Want one like this?</h2>
        <p>Custom-coded, conversion-focused, live in about 14 days. Tell me what you're building.</p>
        <div class="cs-cta-row" style="justify-content:center;">
          <a class="btn btn-primary" href="${esc(p.waHref)}" target="_blank" rel="noopener" data-cursor>Build something similar <span aria-hidden="true">↗</span></a>
          <a class="btn btn-ghost" href="/#work" data-cursor>See all work</a>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="cs-foot">
    <div class="wrap">
      <div class="grid">
        <div>
          <div class="word">DIVYANSH SOOD<sup style="font-size:13px;top:-1em;">®</sup></div>
          <div class="sig">Divyansh Sood</div>
        </div>
        <div class="col">
          <div class="h">Navigate</div>
          <a href="/">Home</a>
          <a href="/#work">Works</a>
          <a href="/#contact">Contact</a>
          <a href="/blog/">Blog</a>
          <a href="https://www.divyanshsood.com" target="_blank" rel="noopener">divyanshsood.com ↗</a>
        </div>
        <div class="col">
          <div class="h">Studio</div>
          <span style="opacity:.82;">Himachal Pradesh,<br>India · Worldwide</span>
          <div style="margin-top:16px;display:flex;gap:16px;opacity:.82;">
            <a href="https://github.com/DivyanshSood" target="_blank" rel="noopener" style="display:inline;">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/divyansh-sood-023556151/" target="_blank" rel="noopener" style="display:inline;">LinkedIn ↗</a>
          </div>
        </div>
      </div>
      <div class="bar">
        <span>© 2026 Divyansh Sood Studio</span><span>Designed &amp; built with intent</span><a href="#" data-cursor style="color:#fff;text-decoration:none;">Back to top ↑</a>
      </div>
    </div>
  </footer>
</div>

<script>
(function(){
  var root=document.getElementById('ds-root');if(!root)return;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* scroll reveal */
  try{
    if(reduce){root.querySelectorAll('[data-reveal]').forEach(function(el){el.style.opacity='1';el.style.transform='none';});}
    else{
      var io=new IntersectionObserver(function(ents){ents.forEach(function(e){if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
      root.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el);});
    }
  }catch(e){root.querySelectorAll('[data-reveal]').forEach(function(el){el.style.opacity='1';el.style.transform='none';});}

  /* custom cursor — fine pointers only */
  var cur=document.getElementById('ds-cursor');
  var fine=window.matchMedia('(pointer:fine)').matches;
  if(cur&&!fine)cur.style.display='none';
  if(fine&&cur){
    root.querySelectorAll('a,button,[data-cursor]').forEach(function(el){
      el.addEventListener('mouseenter',function(){cur.classList.add('big');});
      el.addEventListener('mouseleave',function(){cur.classList.remove('big');});
    });
    var tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
    (function tick(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';requestAnimationFrame(tick);})();
  }

  /* nav scroll state */
  var nav=document.getElementById('ds-nav');
  function onScroll(){if(!nav)return;if(scrollY>40){nav.style.background='rgba(11,11,12,.82)';nav.style.backdropFilter='blur(10px)';nav.style.webkitBackdropFilter='blur(10px)';nav.style.borderBottomColor='rgba(255,255,255,.12)';}else{nav.style.background='transparent';nav.style.backdropFilter='none';nav.style.webkitBackdropFilter='none';nav.style.borderBottomColor='transparent';}}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* FAQ accordion */
  var faq=-1;
  function sync(){
    root.querySelectorAll('[data-faqbody]').forEach(function(el){var open=Number(el.getAttribute('data-faqbody'))===faq;el.style.maxHeight=open?'360px':'0px';el.style.opacity=open?'1':'0';});
    root.querySelectorAll('[data-faqicon]').forEach(function(el){el.style.transform=Number(el.getAttribute('data-faqicon'))===faq?'rotate(45deg)':'rotate(0deg)';});
    root.querySelectorAll('[data-faqtog]').forEach(function(el){el.setAttribute('aria-expanded',Number(el.getAttribute('data-faqtog'))===faq?'true':'false');});
  }
  root.querySelectorAll('[data-faqtog]').forEach(function(el){el.addEventListener('click',function(){var i=Number(el.getAttribute('data-faqtog'));faq=(faq===i)?-1:i;sync();});});
  sync();
})();
</script>
</body>
</html>
`;
}

/* ----------------------------------------------------------------------- */
/* WRITE                                                                    */
/* ----------------------------------------------------------------------- */

let count = 0;
for (const p of projects) {
  const dir = join(ROOT, "projects", p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(p), "utf8");
  count++;
  console.log("✓ /projects/" + p.slug);
}
console.log("\nGenerated " + count + " project pages.");

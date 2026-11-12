/* ===========================================================================
   Location pages — /web-developer-<slug>/.
   Content only; src/layouts/Location.astro renders it.

   WHY THESE PAGES EXIST: Search Console (8 Oct–4 Nov 2026) showed "near me"
   queries already ranking 1–6 — Google shows them by distance, and Kangra is
   a small market — while town and state queries ("website devloper in solan",
   "best web design company in hamirpur", "website development company in
   himachal") sat at positions 49–90 with no page to answer them.

   RULES (Google's doorway-page policy + the owner's brand rules):
   - Every page must say something the others don't: the town's own trades,
     towns and seasons. A page that only swaps the city name is a doorway page.
     scripts/verify-seo.mjs fails the build if two location pages share an H1,
     a title or a lead.
   - Proof is real case studies only, looked up by slug in projects/data.mjs.
     No invented local clients, no local office. Punjab and Chandigarh pages
     say plainly the work is done from Kangra.
   - "Company" searches are answered honestly (owner decision 2026-11-07):
     the phrase appears in a question, the answer says it is one developer.
     Never call the studio a company, agency or team.
   - Prices only from STARTING_PRICES. No ratings or review counts.

   `LOCATIONS` also lists the four hand-written city pages (handmade: true) so
   the hub, NearbyAreas, the footer and the homepage can link every location
   from one list. Those four keep their own .astro files.
   =========================================================================== */

import { STARTING_PRICES as P, inr } from "./site.mjs";

const wa = (city) =>
  `https://wa.me/919816091875?text=${encodeURIComponent(`Hi Divyansh, I run a business in ${city} and need a website.`)}`;

/** The honest answer to "<x> company in <city>" searches. `why` is the
    town-specific half, so no two pages carry the same answer. */
const companyFaq = (city, why) => ({
  q: `Are you a web development company in ${city}?`,
  a: `No — and that's the point. I'm one web developer, Divyansh Sood, working from Kangra in Himachal Pradesh. No sales team, no account manager, no junior who inherits your project after the call. The person you message on WhatsApp is the person who designs and codes your site. ${why}`,
});

export const LOCATIONS = [
  /* ── The four hand-written pages (own .astro files) ────────────────────── */
  { slug: "kangra", city: "Kangra", region: "hp", handmade: true, featured: true, near: ["palampur", "dharamshala", "pathankot", "hamirpur", "chamba", "una"] },
  { slug: "dharamshala", city: "Dharamshala", region: "hp", handmade: true, featured: true, near: ["kangra", "palampur", "chamba", "pathankot", "mandi", "hamirpur"] },
  { slug: "shimla", city: "Shimla", region: "hp", handmade: true, featured: true, near: ["solan", "baddi", "nahan", "bilaspur", "mandi", "chandigarh"] },
  { slug: "manali", city: "Manali", region: "hp", handmade: true, featured: true, near: ["kullu", "mandi", "bilaspur", "palampur", "dharamshala", "shimla"] },

  /* ── Himachal Pradesh ──────────────────────────────────────────────────── */
  {
    slug: "palampur",
    city: "Palampur",
    region: "hp",
    district: "Kangra district",
    featured: true,
    tier: "local",
    title: "Web Developer in Palampur — Websites for Homestays, Tea & Bir",
    description:
      "Web developer and website designer in Palampur — sites for homestays, Bir Billing paragliding operators, tea estates and shops. Fixed quote, live in 1–3 weeks.",
    keywords:
      "web developer Palampur, website designer Palampur, website design Palampur, website development Bir Billing, homestay website Palampur, paragliding website Bir",
    ogDescription: "Homestays, Bir Billing operators, tea estates and shops — websites built down the road in Kangra district.",
    kicker: "Himachal Pradesh · Kangra district · Palampur",
    lead: `Palampur sells three things to people who are not here yet: a room with a view of the Dhauladhars, a tandem flight off Billing, and the tea grown on the slopes between them. All three are researched on a phone weeks before the trip. I build from Kangra, about an hour down the road, and I make the websites that turn those searches into WhatsApp enquiries you own — not commission you hand to an aggregator.`,
    offersHead: "Built for how Palampur earns",
    offers: [
      { t: "Homestay & boutique-stay websites", d: "Room pages with real photographs, a WhatsApp enquiry that arrives with the dates already filled in, and the “near Palampur” pages guests search before booking: Bir, Andretta, Baijnath, Neugal Khad." },
      { t: "Paragliding & adventure operators in Bir", d: "Tandem flights, courses and stays, priced and bookable on a page that loads on a weak mountain signal. Operators lose bookings to whoever answers first; the site answers first." },
      { t: "Tea estates & local produce", d: "A story page for the estate, a simple order-on-WhatsApp catalogue for Kangra tea and pickles, and tour-booking for visitors who want to walk the garden." },
      { t: "Shops, clinics & coaching on the bazaar", d: "Phone-first sites for the businesses Palampur town runs on, built to show up when someone nearby searches for “web developer near me” — or for what you sell." },
    ],
    proof: ["dharamshala-tours", "yash-rock-hotel", "sunny-himachal-travels"],
    proofNote: `Nothing here is a Palampur client yet — these are the closest neighbours: a trekking and paragliding outfit above Dharamshala, a Kangra hotel that takes every booking on WhatsApp, and a Kangra valley tour operator with a page for every trip.`,
    coverage: "Palampur town, Bir and Billing, Baijnath, Panchrukhi, Bhawarna, Andretta, Sullah and Thural.",
    howWeWork: "Palampur is close enough that we can sit down over chai when that helps — at your homestay, your shop or the estate office. The rest runs on WhatsApp and calls.",
    faqs: [
      { q: "What does a website cost for a Palampur homestay or shop?", a: `A homestay or hotel site starts at ${inr(P.hotel)}, and a shop or service business site at ${inr(P.basic)}. You get a fixed quote in writing after one conversation — and if a Google Business Profile alone will do the job for now, I'll tell you that instead.` },
      { q: "Can my homestay take bookings without paying Booking.com or MakeMyTrip commission?", a: "Yes, for the guests who find you directly. Your site sends every enquiry to your WhatsApp with the dates and guest count written out, so you confirm and collect payment yourself. Aggregators still bring new guests; the site stops you paying them for the ones who already knew your name." },
      { q: "Do you build websites for paragliding operators in Bir Billing?", a: "Yes. The pages that matter are the flight and course prices, the season, the safety and licensing details, and a booking that reaches you on WhatsApp. I built the site for a trekking and paragliding outfit above Dharamshala, so the structure is already worked out." },
      companyFaq("Palampur", "For a homestay or a Bir operator that means the decisions get made in one conversation, and the site is live in one to three weeks."),
      { q: "I searched “web developer near me” in Palampur. Are you actually nearby?", a: "Yes. I live and work in Kangra district — Palampur is about an hour away. You can meet me in person, but most Palampur clients never need to: the brief, the drafts and the changes all happen over WhatsApp." },
    ],
    near: ["kangra", "dharamshala", "mandi", "hamirpur", "chamba", "kullu"],
  },
  {
    slug: "mandi",
    city: "Mandi",
    region: "hp",
    district: "Mandi district",
    featured: true,
    tier: "local",
    title: "Web Developer in Mandi, HP — Website Design for Local Business",
    description:
      "Website designer and web developer for Mandi, Sundernagar and Jogindernagar — sites for hotels, coaching institutes, yatra taxis and shops. Fixed quotes.",
    keywords:
      "web developer Mandi, website designer Mandi Himachal, website design Mandi, website development Sundernagar, website developer Jogindernagar, coaching institute website Mandi",
    ogDescription: "Hotels, coaching centres, yatra operators and shops in Mandi district — custom-coded sites with a fixed quote.",
    kicker: "Himachal Pradesh · Mandi district · Chhoti Kashi",
    lead: `Mandi sits where the Kiratpur–Manali highway meets the road to Kangra, and its businesses live off that traffic: hotels for the night halt, taxis to Rewalsar and Prashar, coaching for the students of a district that takes exams seriously. Most of them still rely on a Google Maps pin. I build from Kangra and make the sites that turn a pin into a phone call — one developer, a fixed quote, and a site you own.`,
    offersHead: "Built for Mandi's businesses",
    offers: [
      { t: "Highway hotels & night-halt stays", d: "Travellers heading to Manali decide on the road, on a phone. A fast page with rooms, parking, food and a one-tap call wins the booking the Maps listing only introduced." },
      { t: "Coaching institutes & schools", d: "Course pages, results, batch timings and an admissions enquiry that reaches the office's WhatsApp — for coaching centres in Mandi and Sundernagar and schools across the district." },
      { t: "Taxi & yatra operators", d: "Fare pages for Rewalsar, Prashar Lake, Shikari Devi, Janjehli and the Kullu–Manali run, each a page of its own so it can rank for the route people actually search." },
      { t: "Shops, clinics and professionals", d: "Doctors, CAs, hardware and electronics dealers: a credible site that shows up for the town's “near me” searches and answers the questions people phone to ask." },
    ],
    proof: ["baglamukhi-travels", "modernkbs", "himalayan-brothers"],
    proofNote: `Closest work to what Mandi needs: a Kangra taxi operator with a page per route, a school with online admissions and an admin panel, and a travel desk built to sit beside its hotel group's site.`,
    coverage: "Mandi town, Sundernagar, Jogindernagar, Sarkaghat, Karsog, Gohar, Rewalsar, Padhar and Kotli.",
    howWeWork: "Mandi is a drive from Kangra, not a flight, so meeting in person is possible when it matters. Most of the work runs on WhatsApp and calls in Hindi or English.",
    faqs: [
      { q: "How much does a website cost in Mandi?", a: `A business site starts at ${inr(P.basic)}, a hotel or taxi site at ${inr(P.hotel)}, and a school or coaching site with an admin panel at ${inr(P.school)}. I give you one fixed number in writing after a short call, before any work starts.` },
      { q: "Can a coaching institute in Mandi take admissions enquiries online?", a: "Yes. The simplest version is a form that lands in your office WhatsApp with the student's name, class and course already written. The fuller version is an application portal with an admin panel — the kind I built for Modern K.B.S., where the office processes admissions itself." },
      { q: "Will my hotel show up for people driving to Manali?", a: "That's a Google Maps and website job together: a Business Profile with the right category and photos, and a website that answers “hotel in Mandi with parking” and “stay near Mandi on the Manali highway” on pages of their own. I set up both." },
      companyFaq("Mandi", "You won't pay for a company's overheads, and you won't be passed between departments when you need a change."),
      { q: "Do you build sites for businesses in Sundernagar and Jogindernagar too?", a: "Yes — anywhere in Mandi district. The process and pricing are the same whether you're in Mandi town, Sundernagar, Jogindernagar, Sarkaghat or Karsog." },
    ],
    near: ["kullu", "bilaspur", "hamirpur", "palampur", "manali", "shimla"],
  },
  {
    slug: "hamirpur",
    city: "Hamirpur",
    region: "hp",
    district: "Hamirpur district",
    featured: true,
    tier: "local",
    title: "Web Developer in Hamirpur, HP — School & Business Websites",
    description:
      "Web developer and website designer in Hamirpur, HP — websites for schools, coaching institutes, clinics and shops in Hamirpur, Nadaun and Barsar.",
    keywords:
      "web developer Hamirpur, website designer Hamirpur HP, website design Hamirpur Himachal, school website Hamirpur, coaching institute website Hamirpur, web design company Hamirpur",
    ogDescription: "Schools, coaching institutes, clinics and shops in Hamirpur — custom-coded websites from a developer in the next district.",
    kicker: "Himachal Pradesh · Hamirpur district · Education hub",
    lead: `Hamirpur takes education seriously — the district is known across Himachal for its schools, its coaching centres and the engineering college that carries its name. That makes it a town where parents and students compare institutions online before they ever walk in. I'm one district over, in Kangra, and I build school and coaching websites that answer their questions properly: results, faculty, fees, admissions and the CBSE disclosures, in one place they can trust.`,
    offersHead: "What Hamirpur asks for most",
    offers: [
      { t: "School websites, CBSE-ready", d: "Mandatory Public Disclosure laid out the way CBSE asks, admissions that reach the office, notices and results the staff can update themselves." },
      { t: "Coaching & competitive-exam institutes", d: "Course and batch pages, results with names and years, a demo-class booking and an enquiry form that reaches the counsellor's WhatsApp — not an inbox nobody checks." },
      { t: "Clinics, labs and pharmacies", d: "Timings, doctors, tests and a call button: the four things patients look for, on a page that loads before they give up." },
      { t: "Shops & local services", d: "A credible, phone-first site that turns up when Hamirpur searches “near me” for what you sell, with your Google Business Profile wired in." },
    ],
    proof: ["pinnacle-world-school", "modernkbs"],
    proofNote: `Two school builds from Kangra district: a CBSE school site where every fact traces back to the affiliation record, and a school with online admissions and an admin panel the office runs itself.`,
    coverage: "Hamirpur town, Nadaun, Barsar, Sujanpur Tira, Bhoranj, Bijhar, Bhota and Tauni Devi.",
    howWeWork: "Hamirpur is next door to Kangra district, so a visit to your school or institute is easy to arrange. Content collection and reviews happen over WhatsApp.",
    faqs: [
      { q: "What does a school or coaching website cost in Hamirpur?", a: `A school or coaching site with an admin panel starts at ${inr(P.school)}, and a simple business or clinic site at ${inr(P.basic)}. Scope moves the number — a public site is not an admissions portal — so the quote comes fixed and in writing after one call.` },
      { q: "What must a CBSE school website in Hamirpur publish?", a: "CBSE's affiliation bye-laws require a Mandatory Public Disclosure page: general information, affiliation and recognition documents, safety certificates, results, staff and infrastructure. I lay it out as a page, not a PDF dump, and mark anything still missing instead of linking to nothing." },
      { q: "Can students pay fees or apply online?", a: "Yes, when the school wants it. Admissions can arrive as WhatsApp messages or through a full application portal with a status page; online fee payment is added through a payment gateway the school's bank supports." },
      companyFaq("Hamirpur", "Schools and institutes get one accountable person from the first call to the handover, and the code and domain are yours at the end."),
      { q: "Is there a website designer near me in Hamirpur?", a: "I'm in Kangra district, an easy drive from Hamirpur. I can visit your school or institute when it helps; most of the build runs on WhatsApp and calls, so distance never slows it down." },
    ],
    near: ["kangra", "una", "bilaspur", "mandi", "palampur", "dharamshala"],
  },
  {
    slug: "solan",
    city: "Solan",
    region: "hp",
    district: "Solan district",
    featured: true,
    tier: "local",
    title: "Web Developer in Solan — Schools, Hotels & Kasauli Stays",
    description:
      "Website developer and designer in Solan — sites for schools, Kasauli and Chail stays, highway hotels and local businesses. Fixed quote, you own the code.",
    keywords:
      "website developer Solan, web developer Solan, website designer Solan, website design Kasauli, hotel website Kasauli, school website Solan, web design company Solan",
    ogDescription: "Schools, Kasauli and Chail stays, highway hotels and shops in Solan district — custom-coded sites with a fixed quote.",
    kicker: "Himachal Pradesh · Solan district · Kasauli · Chail",
    lead: `Solan is Himachal's busiest corridor: the Kalka–Shimla highway, the boarding schools around Kasauli and Sanawar, weekend stays in Chail, and the factories of Parwanoo and Baddi. Its customers arrive from Chandigarh and Delhi already comparing options on their phones. I build custom-coded websites for Solan businesses from Kangra — one developer, one fixed quote, a site that loads fast on the highway and ranks for the town you're actually in.`,
    offersHead: "Built for the Solan corridor",
    offers: [
      { t: "Weekend stays in Kasauli, Chail & Barog", d: "Direct-booking sites for the stays Chandigarh and Delhi drive up to — rates, photos, the drive time, and an enquiry that reaches you on WhatsApp before the guest opens an aggregator." },
      { t: "Schools & universities", d: "Boarding and day schools, colleges and institutes: admissions, hostel and fee pages, notices, and a CBSE disclosure page done properly." },
      { t: "Highway hotels, dhabas & restaurants", d: "A menu, a map, parking and a call button, on a page that turns up for “hotel on Shimla highway” and “restaurant near Dharampur”." },
      { t: "Shops & services in Solan town", d: "The town's own businesses — clinics, dealers, professionals — with a site that answers the “near me” search and links to your Google reviews." },
    ],
    proof: ["hotel-himalayan-brothers", "pinnacle-world-school", "yash-rock-hotel"],
    proofNote: `No Solan client is on this list yet — these are the builds that match Solan's mix: a five-hotel group on one site, a CBSE school site built from the affiliation record, and a hotel that takes every booking on WhatsApp.`,
    coverage: "Solan town, Kasauli, Dharampur, Parwanoo, Chail, Barog, Kandaghat, Arki, Subathu and Nalagarh.",
    howWeWork: "Everything runs on WhatsApp, calls and screen-shares in Hindi or English, with drafts on a live link you can open on your phone. A visit can be planned when a project needs one.",
    faqs: [
      { q: "What does a website cost in Solan?", a: `A business site starts at ${inr(P.basic)}, a hotel or homestay site at ${inr(P.hotel)}, and a school site with an admin panel at ${inr(P.school)}. You get a fixed quote in writing after one call, and the number doesn't move unless the scope does.` },
      { q: "Can a Kasauli or Chail homestay get bookings without OTA commission?", a: "From the guests who search for you directly, yes. The site gives them rates, photos and directions, and sends the enquiry to your WhatsApp. You still list on the aggregators for discovery; you stop paying commission on guests who already knew your name." },
      { q: "Can you redesign our old school or hotel website without losing Google rankings?", a: "Yes. The old URLs are mapped one by one and redirected, the content Google already trusts is carried over, and the new site is faster. When Pinnacle World School moved domains, all 14 old URLs were redirected." },
      companyFaq("Solan", "Solan businesses usually compare me with agencies in Chandigarh; the difference is that you deal with the developer directly and the site goes live in weeks, not months."),
      { q: "Are you based in Solan?", a: "No — I'm in Kangra district. Solan clients work with me over WhatsApp and calls, and you see every draft on a live link. If a meeting in person matters for your project, tell me and we'll plan it." },
    ],
    near: ["shimla", "baddi", "nahan", "chandigarh", "bilaspur", "mandi"],
  },
  {
    slug: "una",
    city: "Una",
    region: "hp",
    district: "Una district",
    featured: true,
    tier: "local",
    title: "Web Developer in Una, HP — Yatra Taxi & Business Websites",
    description:
      "Web developer and website designer in Una, HP — sites for Chintpurni yatra taxis, hotels, industrial units in Mehatpur and Gagret, and local shops.",
    keywords:
      "web developer Una, website designer Una Himachal, website design Una HP, Chintpurni taxi website, hotel website Chintpurni, website developer Gagret, Mehatpur industrial website",
    ogDescription: "Yatra taxis, Chintpurni hotels, industrial units and shops in Una district — websites from a developer next door in Kangra.",
    kicker: "Himachal Pradesh · Una district · Chintpurni",
    lead: `Una is Himachal's front door from Punjab, and most of its visitors are on their way to Chintpurni. That traffic feeds taxis, dharamshalas and hotels — and every one of those visitors searches before they arrive. Una is also an industrial district, with units in Mehatpur, Gagret and Tahliwal selling to buyers who check a website before they call. I build both kinds of site from Kangra, next door.`,
    offersHead: "Two Unas, two kinds of website",
    offers: [
      { t: "Chintpurni yatra taxis", d: "Fare pages for the Devi Darshan circuit — Chintpurni, Jwalaji, Kangra, Chamunda, Naina Devi — and pickups from Una railway station, each on a page of its own that can rank for the route." },
      { t: "Hotels & stays near the temple", d: "Rooms, distance from the temple, parking and a WhatsApp enquiry for the families who plan the yatra a week out." },
      { t: "Industrial units & manufacturers", d: "A product catalogue, plant photographs, certifications and an RFQ form that reaches the sales desk — the site a buyer checks before shortlisting a supplier." },
      { t: "Shops, schools and clinics", d: "Local businesses in Una town, Amb and Gagret, with a site that turns up for “near me” searches and a Google Business Profile that matches it." },
    ],
    proof: ["baglamukhi-travels", "shiva-tour-and-travel", "nandini"],
    proofNote: `Three Kangra taxi operators who sell the temple circuit: one with a page per route, one beside Kangra Airport rebuilt so its reviews can't be invented, and one whose direct bookings now come through its own site.`,
    coverage: "Una town, Amb, Gagret, Mehatpur, Haroli, Bangana, Chintpurni, Daulatpur Chowk and Tahliwal.",
    howWeWork: "Una is close to Kangra, so meeting in person is easy to arrange. Most work happens on WhatsApp and calls in Hindi or English.",
    faqs: [
      { q: "What does a taxi or hotel website cost in Una?", a: `A taxi, travel or hotel site starts at ${inr(P.travel)}, and a simple business site at ${inr(P.basic)}. Manufacturers' catalogue sites are quoted on scope. Every quote is fixed and in writing after one call.` },
      { q: "Can my taxi service rank for Chintpurni and Devi Darshan searches?", a: "That's the build I do most. Each route — Una to Chintpurni, Chintpurni to Jwalaji, the full Devi Darshan circuit — gets its own page with the distance and what's included, so Google has something specific to rank. The fares come from one data file, so they never contradict each other." },
      { q: "Do you build websites for factories in Mehatpur and Gagret?", a: "Yes. A manufacturer's site needs product pages with specifications, certifications, plant photographs and a request-for-quote form — not a template's stock photos. It's built so a buyer in another state can shortlist you without a phone call." },
      companyFaq("Una", "For a taxi owner or a plant manager, that means a direct line to the developer and no account manager in between."),
      { q: "Is there a web developer near me in Una?", a: "I'm in Kangra district, a short drive from Una. You can meet me, but you won't need to: the brief, the drafts and the changes all happen over WhatsApp." },
    ],
    near: ["hamirpur", "kangra", "bilaspur", "pathankot", "jalandhar", "chandigarh"],
  },
  {
    slug: "kullu",
    city: "Kullu",
    region: "hp",
    district: "Kullu district",
    featured: false,
    tier: "local",
    title: "Web Developer in Kullu — Websites for Kasol, Tirthan & Rafting",
    description:
      "Web developer and website designer in Kullu — sites for Kasol stays, Tirthan homestays, rafting and trekking operators, and Kullu shawl makers.",
    keywords:
      "web developer Kullu, website designer Kullu, website design Kasol, homestay website Tirthan valley, rafting website Kullu, trekking company website Kullu, Kullu shawl website",
    ogDescription: "Kasol cafés, Tirthan homestays, rafting and trekking operators — websites for the Kullu valley beyond Manali.",
    kicker: "Himachal Pradesh · Kullu district · Parvati · Tirthan",
    lead: `Most of the Kullu valley isn't Manali, and its businesses don't want to be found as if they were. Kasol and the Parvati valley sell treks and cafés to backpackers, Tirthan and Banjar sell quiet homestays near the national park, and rafting in Kullu itself sells by the stretch of river. Each has its own searches. I build sites from Kangra that rank for the place you actually are — and turn the visitor into a WhatsApp booking.`,
    offersHead: "For the valley beyond Manali",
    offers: [
      { t: "Kasol & Parvati valley stays", d: "Cafés, hostels and camps in Kasol, Tosh and Chalal: photographs, prices, the trek list and a WhatsApp booking for travellers who plan on the bus up." },
      { t: "Tirthan & Banjar homestays", d: "Quiet stays near the Great Himalayan National Park, with the trout, the trails and the drive explained, and booking that doesn't pay an aggregator." },
      { t: "Rafting, trekking & camping operators", d: "A page per trip — Kheerganga, Bhrigu Lake, the Beas rafting stretch — with the season, the grade and what's included, so each one can rank on its own." },
      { t: "Kullu shawls, apples & local makers", d: "A made-to-order catalogue where each piece can be ordered on WhatsApp — the same pattern I used for a 585K-subscriber knitting teacher." },
    ],
    proof: ["leisure-himachal", "dharamshala-tours", "chinkiz"],
    proofNote: `A Manali travel agency's 2011 site rebuilt into 77 pages, a trekking and paragliding outfit above Dharamshala, and a made-to-order knitting site where every order starts as a WhatsApp message.`,
    coverage: "Kullu town, Bhuntar, Kasol, Manikaran, Tosh, Banjar, Tirthan valley, Jibhi, Naggar, Anni and Nirmand.",
    howWeWork: "Most of the season you'll be busier than I am, so everything runs on WhatsApp voice notes and a live draft link. A visit can be planned in the off-season.",
    faqs: [
      { q: "What does a website cost for a Kullu homestay or operator?", a: `A homestay, camp or adventure operator's site starts at ${inr(P.hotel)}, and a maker's or shop site at ${inr(P.basic)}. The quote is fixed and in writing after one conversation.` },
      { q: "How is this different from your Manali page?", a: "Manali's searches are about hotels and snow; Kasol's are about treks and cafés, Tirthan's about homestays and the national park, Kullu's about rafting. I structure each site around the searches of its own valley — the same principle, built for a different place." },
      { q: "Can I update prices and dates myself for the season?", a: "Yes. Seasonal prices, open dates and trip departures sit in a simple data file or admin panel you can edit, so the site doesn't go stale when the season changes." },
      companyFaq("Kullu", "Operators here run on thin seasons — you get one person who understands that, and a site that's live before the season starts."),
      { q: "Do you know the Kullu tourism market?", a: "It's my home state. I rebuilt a Manali travel agency's 15-year-old site without losing an old URL, and I built a trekking operator's site on data files their team edits. The WhatsApp-first guest and the weak mountain signal are designed in." },
    ],
    near: ["manali", "mandi", "bilaspur", "palampur", "shimla", "dharamshala"],
  },
  {
    slug: "bilaspur",
    city: "Bilaspur",
    region: "hp",
    district: "Bilaspur district",
    featured: false,
    tier: "local",
    title: "Web Developer in Bilaspur, HP — Hotel, Clinic & Taxi Websites",
    description:
      "Web developer and website designer in Bilaspur, HP — sites for highway hotels, clinics near AIIMS, Naina Devi taxis and shops in Ghumarwin.",
    keywords:
      "web developer Bilaspur Himachal, website designer Bilaspur HP, website design Ghumarwin, Naina Devi taxi website, hotel website Bilaspur, clinic website Bilaspur",
    ogDescription: "Highway hotels, clinics near AIIMS, Naina Devi taxis and shops — websites for Bilaspur, Himachal.",
    kicker: "Himachal Pradesh · Bilaspur district · Gobind Sagar",
    lead: `Bilaspur sits on the four-lane from Kiratpur to Manali, on the shore of the Gobind Sagar, with AIIMS Bilaspur drawing patients and families from across the state and Naina Devi drawing pilgrims from Punjab. That's a lot of people arriving in a town they don't know, searching on a phone for a room, a clinic or a taxi. I build the websites that answer them — from Kangra, with a fixed quote and code you own.`,
    offersHead: "For a town people pass through",
    offers: [
      { t: "Hotels & guest houses on the four-lane", d: "Rooms, parking, distance to AIIMS or Naina Devi, and a call button — the five facts a traveller needs, on a page that loads before they reach the next town." },
      { t: "Clinics, labs and pharmacies", d: "Doctors, timings, tests and directions for the families who come to Bilaspur for treatment and need help finding everything around it." },
      { t: "Naina Devi & yatra taxis", d: "Route pages for Naina Devi, the Devi Darshan circuit and the Kiratpur and Chandigarh pickups, each with its distance and what's included." },
      { t: "Shops & services in Ghumarwin and Bilaspur", d: "Phone-first sites that turn up for “near me” searches, with your Google Business Profile and reviews linked in." },
    ],
    proof: ["yash-rock-hotel", "kangra-valley-travels", "baglamukhi-travels"],
    proofNote: `A hotel with 14 “near” pages for guests heading to a medical college and the airport, and two Kangra taxi operators with a page for every route they drive.`,
    coverage: "Bilaspur town, Ghumarwin, Swarghat, Naina Devi, Jhandutta, Barmana, Berthin and Namhol.",
    howWeWork: "Bilaspur is within driving distance of Kangra; most of the work runs on WhatsApp and calls, and a visit can be planned when it helps.",
    faqs: [
      { q: "What does a website cost in Bilaspur?", a: `A hotel, guest house or taxi site starts at ${inr(P.hotel)}, and a clinic or shop site at ${inr(P.basic)}. You get a fixed, written quote after one call.` },
      { q: "Can my guest house rank for people visiting AIIMS Bilaspur?", a: "Yes, and it's one of the clearest local searches there is. A page for “stay near AIIMS Bilaspur” with the real distance, parking and how to reach the hospital is the same approach I used for a Kangra hotel's 14 “near” pages for guests heading to a medical college and the airport." },
      { q: "Do you build sites for Naina Devi taxi services?", a: "Yes. Each route gets its own page — Naina Devi from Kiratpur, from Chandigarh, the full Devi Darshan circuit — with the distance and what's included, and the fares come from one data file so no two pages disagree." },
      companyFaq("Bilaspur", "That means one fixed quote, one person answering your messages, and a site that's live in weeks."),
      { q: "Do you also work in Ghumarwin?", a: "Yes — anywhere in Bilaspur district, at the same prices and with the same process." },
    ],
    near: ["hamirpur", "mandi", "una", "solan", "shimla", "chandigarh"],
  },
  {
    slug: "chamba",
    city: "Chamba",
    region: "hp",
    district: "Chamba district",
    featured: false,
    tier: "local",
    title: "Web Developer in Chamba — Dalhousie, Khajjiar & Bharmour",
    description:
      "Web developer in Chamba — websites for Dalhousie and Khajjiar hotels, Manimahesh yatra operators, Pangi and Sach Pass stays, and local makers.",
    keywords:
      "web developer Chamba, website designer Chamba, website design Dalhousie, hotel website Dalhousie, Khajjiar hotel website, Manimahesh yatra website, Sach Pass website",
    ogDescription: "Dalhousie hotels, Khajjiar stays, Manimahesh operators and Sach Pass — websites for Chamba, from someone who's already built here.",
    kicker: "Himachal Pradesh · Chamba district · Dalhousie · Pangi",
    lead: `Chamba is where I've already built: sachpass.com lists every stay on the road over Sach Pass with the latest official road notice, and the Himalayan Brothers hotel group runs a property in the district on a site I rebuilt. Chamba's visitors — Dalhousie weekenders, Khajjiar day-trippers, Manimahesh pilgrims, bikers heading for Pangi — all plan on a phone, often on the last bar of signal. I build sites that work there.`,
    offersHead: "Built for Chamba's roads and seasons",
    offers: [
      { t: "Dalhousie & Khajjiar hotels", d: "Direct-booking sites for the hill-station hotels Punjab and Delhi drive up to, with rooms, rates, the drive from Pathankot and an enquiry that reaches your WhatsApp." },
      { t: "Bharmour & Manimahesh yatra operators", d: "Yatra dates, registration, helicopter and trek options and stays, on pages that are updated when the yatra dates are announced, not a season late." },
      { t: "Pangi, Killar & Sach Pass stays", d: "Small stays on roads that open and close — sites that say plainly whether the pass is open, with a source and a date, the way sachpass.com does." },
      { t: "Chamba rumal, chappal & local makers", d: "A made-to-order catalogue that tells the craft's story and takes orders on WhatsApp, without paying a marketplace a cut." },
    ],
    proof: ["sach-pass", "hotel-himalayan-brothers"],
    proofNote: `Both built for Chamba: sachpass.com, with every stay on the road over the pass and a dated source for every road status, and the Himalayan Brothers hotel group, five family-run hotels from Dharamshala to Spiti on one site.`,
    coverage: "Chamba town, Dalhousie, Banikhet, Khajjiar, Bharmour, Tissa, Salooni, Bairagarh, Killar and Pangi.",
    howWeWork: "Chamba is a drive from Kangra, and I've been on its roads for the work I've already done here. Most projects run on WhatsApp; a visit can be planned when it helps.",
    faqs: [
      { q: "What does a hotel website cost in Dalhousie or Chamba?", a: `A hotel or homestay site starts at ${inr(P.hotel)}, and a maker's or shop site at ${inr(P.basic)}. The quote is fixed and in writing after one call.` },
      { q: "Have you built websites in Chamba before?", a: "Yes. sachpass.com covers every place to stay on the road over Sach Pass and the pass's status, with a source for every date and an admin that publishes through GitHub. And the Himalayan Brothers hotel group, which has a hotel in Chamba district, runs on a site I rebuilt from an audit." },
      { q: "Can my site show whether the road or pass is open?", a: "Yes, as long as there's a real source. On sachpass.com every road status carries the date and where it came from — no guessing. Your team updates it from a simple admin, and the site never shows a status it can't back up." },
      companyFaq("Chamba", "In a district this size, it means you get a developer who already knows its roads, not an agency's account manager reading about them."),
      { q: "Do you build for Dalhousie businesses as well as Chamba town?", a: "Yes — Dalhousie, Banikhet, Khajjiar, Bharmour, Pangi and the rest of the district, with the same prices and process." },
    ],
    near: ["dharamshala", "pathankot", "kangra", "palampur", "amritsar", "manali"],
  },
  {
    slug: "nahan",
    city: "Nahan",
    region: "hp",
    district: "Sirmaur district",
    featured: false,
    tier: "local",
    title: "Web Developer in Nahan & Paonta Sahib — Sirmaur Website Design",
    description:
      "Web developer and website designer for Nahan, Paonta Sahib and Kala Amb in Sirmaur — sites for manufacturers, schools, hotels near Renuka Ji and local shops.",
    keywords:
      "web developer Nahan, website designer Paonta Sahib, website design Sirmaur, website developer Kala Amb, school website Nahan, hotel website Renuka Ji",
    ogDescription: "Manufacturers in Kala Amb, schools in Nahan, hotels near Renuka Ji and shops in Paonta Sahib — websites for Sirmaur.",
    kicker: "Himachal Pradesh · Sirmaur district · Paonta Sahib",
    lead: `Sirmaur faces three ways at once: Nahan, the old princely capital, looks to Himachal; Paonta Sahib and its gurdwara look to Uttarakhand across the Yamuna; Kala Amb's factories look to Haryana. Its businesses sell to all three, and their buyers, parents and pilgrims check a website before they make the trip. I build those sites from Kangra — custom-coded, quoted once, and handed over as code you own.`,
    offersHead: "Built for Sirmaur's three markets",
    offers: [
      { t: "Manufacturers in Kala Amb", d: "Product catalogues with specifications, certifications, plant photographs and a request-for-quote form, so a buyer can shortlist you without a call." },
      { t: "Schools & colleges in Nahan", d: "Admissions, notices, results and a CBSE Mandatory Public Disclosure page laid out properly — with an admin panel the office can run." },
      { t: "Hotels near Renuka Ji & Paonta Sahib", d: "Rooms, distance to the lake or the gurdwara, parking and a WhatsApp enquiry, for families planning a visit." },
      { t: "Shops & services across the district", d: "Phone-first sites that show up for “near me” searches in Nahan, Paonta Sahib and Rajgarh, with your Google Business Profile linked." },
    ],
    proof: ["pinnacle-world-school", "modernkbs", "yash-rock-hotel"],
    proofNote: `No Sirmaur client is on the list yet. These are the closest matches: two school builds — one CBSE-disclosure-first, one with online admissions — and a hotel that takes every booking on WhatsApp.`,
    coverage: "Nahan, Paonta Sahib, Kala Amb, Rajgarh, Sangrah, Shillai, Dadahu, Renuka Ji and Trilokpur.",
    howWeWork: "Sirmaur projects run on WhatsApp, calls and screen-shares with drafts on a live link; a visit can be planned when a project needs one.",
    faqs: [
      { q: "What does a website cost in Nahan or Paonta Sahib?", a: `A business site starts at ${inr(P.basic)}, a hotel site at ${inr(P.hotel)}, and a school site with an admin panel at ${inr(P.school)}. Manufacturers' catalogue sites are quoted on scope. Every quote is fixed and in writing.` },
      { q: "Do you build websites for factories in Kala Amb?", a: "Yes. The pages that matter to a buyer are the products with specifications, the certifications, the plant and capacity, and a request-for-quote form that reaches the sales desk. I build those custom, not from a template with stock photos." },
      { q: "Can a Nahan school manage notices and admissions itself?", a: "Yes. The office gets an admin panel for notices, results and admissions, the same way Modern K.B.S. runs its admissions and Pinnacle World School its content." },
      companyFaq("Sirmaur", "You deal with the developer directly, the quote doesn't change after you sign, and the code is yours at handover."),
      { q: "Are you based in Sirmaur?", a: "No — I'm in Kangra district. Sirmaur clients work with me over WhatsApp and calls, and see every draft on a live link. If a meeting in person matters, tell me and we'll plan it." },
    ],
    near: ["solan", "baddi", "shimla", "chandigarh", "bilaspur", "mandi"],
  },
  {
    slug: "baddi",
    city: "Baddi",
    region: "hp",
    district: "Solan district (BBN)",
    featured: false,
    tier: "local",
    title: "Web Developer in Baddi — Pharma & Manufacturing Websites",
    description:
      "Web developer for Baddi, Barotiwala and Nalagarh — B2B websites for pharma and manufacturing units: product catalogues, certifications and RFQ forms.",
    keywords:
      "web developer Baddi, website designer Baddi, pharma company website Baddi, manufacturing website BBN, website developer Nalagarh, B2B website Himachal, product catalogue website",
    ogDescription: "Pharma and manufacturing units in Baddi–Barotiwala–Nalagarh — B2B websites a buyer can shortlist you from.",
    kicker: "Himachal Pradesh · Baddi–Barotiwala–Nalagarh",
    lead: `Baddi–Barotiwala–Nalagarh is one of the biggest pharmaceutical manufacturing belts in Asia, and most of its units are sold to buyers who never visit: distributors, third-party marketing companies and importers who shortlist suppliers from a website. Too many BBN sites are a template, a stock photo and a dead contact form. I build B2B sites that show the products, the approvals and the plant — and route every enquiry to someone who answers.`,
    offersHead: "What a BBN buyer looks for",
    offers: [
      { t: "Product catalogues that buyers can search", d: "Every formulation or product with its composition, pack sizes and dosage form, searchable and filterable — not a 40-page PDF." },
      { t: "Approvals, certifications and the plant", d: "WHO-GMP, ISO and other certificates shown with their numbers and validity, plant and capacity pages, and photographs of your own facility." },
      { t: "RFQ and third-party manufacturing enquiries", d: "Forms that ask the right questions — product, quantity, market — and reach the sales desk by email and WhatsApp, so no lead sits unread." },
      { t: "Careers and compliance pages", d: "Openings for the plant, and the policy and compliance pages buyers and auditors expect to find." },
    ],
    proof: ["modernkbs", "chinkiz", "hotel-himalayan-brothers"],
    proofNote: `There's no BBN unit on this list yet. What's here is the closest engineering: a web app with an admin panel an office runs itself, a 96-piece catalogue ordered by WhatsApp, and five hotels' facts kept consistent on one site.`,
    coverage: "Baddi, Barotiwala, Nalagarh, Jharmajri, Manpura, Kishanpura and the Parwanoo industrial area.",
    howWeWork: "B2B projects run on calls, screen-shares and a shared document of every product and certificate. A plant visit for photographs can be planned.",
    faqs: [
      { q: "What does a manufacturing or pharma website cost?", a: `B2B catalogue sites are quoted on scope — mostly the number of products and whether you need search, filters or an admin to manage them. A simple company site starts at ${inr(P.basic)}. The quote is fixed and in writing after one call.` },
      { q: "Can we manage our own product list?", a: "Yes. Products live in an admin panel or a structured data file your team edits; add a product and its page, its place in the catalogue and its search entry all update together." },
      { q: "Will the site help us get third-party manufacturing enquiries?", a: "It's built to. Each product and dosage form gets a page Google can rank, the certifications are visible, and the enquiry form asks what a sales team needs to quote. What moves the needle after that is being findable for the exact products you make." },
      companyFaq("Baddi", "For a manufacturing unit, that means one technical person who builds the catalogue, the forms and the SEO, without an agency's layers in between."),
      { q: "Do you work with units in Nalagarh and Barotiwala too?", a: "Yes — across the BBN belt and the Parwanoo industrial area, at the same prices and with the same process." },
    ],
    near: ["solan", "chandigarh", "nahan", "shimla", "bilaspur", "ludhiana"],
  },

  /* ── Punjab & Chandigarh — remote work, said plainly ───────────────────── */
  {
    slug: "pathankot",
    city: "Pathankot",
    region: "pb",
    district: "Pathankot district, Punjab",
    featured: true,
    tier: "near",
    title: "Web Developer in Pathankot — Websites for Taxis, Hotels & Shops",
    description:
      "Web developer and website designer for Pathankot — sites for taxis to Dalhousie, Dharamshala and Jammu, hotels near the stations, schools and shops.",
    keywords:
      "web developer Pathankot, website designer Pathankot, website design Pathankot, taxi website Pathankot, hotel website Pathankot, website developer near Pathankot",
    ogDescription: "Taxi operators, hotels, schools and shops in Pathankot — websites from a developer just across the border in Kangra.",
    kicker: "Punjab · Pathankot · Gateway to Himachal and J&K",
    lead: `Pathankot is where the trains stop and the hills start. Travellers arrive at Pathankot and Chakki Bank stations bound for Dalhousie, Dharamshala, McLeod Ganj, Katra and Jammu, and most of them book a taxi or a room on the platform, on a phone. I'm just across the border in Kangra district, and I build the sites that win those bookings — for Pathankot's taxi operators, hotels, schools and shops.`,
    offersHead: "Built for a gateway town",
    offers: [
      { t: "Taxi & travel operators", d: "Route pages for Pathankot to Dalhousie, Dharamshala, McLeod Ganj, Katra and Jammu, with distance, time and what's included — and a booking that reaches your WhatsApp." },
      { t: "Hotels near the stations", d: "Rooms, distance from Pathankot and Chakki Bank, parking and a call button, for travellers who need a bed tonight." },
      { t: "Schools & coaching", d: "Admissions, notices and results, with a CBSE disclosure page and an admin panel the office runs." },
      { t: "Shops & services", d: "Phone-first sites for Pathankot's dealers, clinics and professionals, wired to a Google Business Profile so “near me” searches find you." },
    ],
    proof: ["shiva-tour-and-travel", "kangra-valley-travels", "nandini"],
    proofNote: `Three taxi operators on the Kangra side of the same roads: one beside Kangra Airport, one with 558 map-measured road distances, and one whose direct bookings now come through its own site.`,
    coverage: "Pathankot city, Chakki Bank, Sujanpur, Dhar Kalan, Mamun and Madhopur — and Nurpur and Jassur on the Himachal side.",
    howWeWork: "Pathankot is close to Kangra, so meeting in person is easy to arrange. Most of the work runs on WhatsApp and calls in Hindi or English.",
    faqs: [
      { q: "What does a taxi or hotel website cost in Pathankot?", a: `A taxi, travel or hotel site starts at ${inr(P.travel)}, a shop or service business site at ${inr(P.basic)}, and a school site with an admin panel at ${inr(P.school)}. Every quote is fixed and in writing after one call.` },
      { q: "Can my taxi service rank for “Pathankot to Dalhousie taxi”?", a: "That's exactly how I build taxi sites: one page per route, with the real distance and time, what the fare includes, and a booking button — so Google has a specific page to rank for each route people search." },
      { q: "You're in Himachal — do you work with Punjab businesses?", a: "Yes. I'm in Kangra district, close to Pathankot. The Pathankot taxi and hotel market runs on the same tourists as Kangra's, and the sites I've built for Kangra operators are exactly what a Pathankot operator needs." },
      companyFaq("Pathankot", "You get the developer directly, a fixed quote, and a site that's live in one to three weeks."),
      { q: "Is there a web developer near me in Pathankot?", a: "I'm across the border in Kangra district. Meeting in person is easy to arrange, though most Pathankot clients do everything over WhatsApp." },
    ],
    near: ["kangra", "dharamshala", "chamba", "amritsar", "jalandhar", "palampur"],
  },
  {
    slug: "chandigarh",
    city: "Chandigarh",
    region: "pb",
    district: "Chandigarh tricity",
    featured: true,
    tier: "remote",
    title: "Web Developer for Chandigarh, Mohali & Panchkula",
    description:
      "Freelance web developer for Chandigarh, Mohali and Panchkula — custom-coded sites and web apps for startups, clinics, coaching and real estate. Fixed quotes.",
    keywords:
      "web developer Chandigarh, website designer Chandigarh, freelance web developer Mohali, website development Panchkula, Next.js developer Chandigarh, web design company Chandigarh",
    ogDescription: "Startups, clinics, coaching institutes and real-estate firms in the tricity — custom-coded websites and web apps, quoted once.",
    kicker: "Chandigarh · Mohali · Panchkula · Remote from Kangra",
    lead: `Chandigarh has no shortage of web agencies — Mohali's IT parks are full of them. What the tricity is short of is a developer who quotes once, writes every line of the code and hands you the repository at the end. I work from Kangra, a few hours up the road, for tricity startups, clinics, coaching institutes and builders who want a custom-coded site or web app without an agency's layers. Everything runs remotely, and I say so up front.`,
    offersHead: "For tricity businesses that want it built properly",
    offers: [
      { t: "Startup sites & MVPs", d: "Next.js, Astro or React — a marketing site in 3–4 weeks, an MVP in 3–4 weeks and a larger web app in 6–10, with a repo and README the next developer can pick up clean." },
      { t: "Clinics & healthcare", d: "Doctors, specialities, timings and appointment requests that reach the front desk, on a site that's fast on a phone and clear to a worried patient." },
      { t: "Coaching institutes", d: "Course and batch pages, results, demo-class bookings and enquiries routed to a counsellor's WhatsApp — the funnel Sector 34's institutes compete on." },
      { t: "Real estate & builders", d: "Project pages with RERA details, floor plans, location and an enquiry form that doesn't vanish into a shared inbox." },
    ],
    proof: ["modernkbs", "chinkiz", "hotel-himalayan-brothers"],
    proofNote: `None of these are tricity clients — they show the kind of build: a web app with online admissions and an admin panel, a made-to-order site for a 585K-subscriber creator, and five hotels on one fast site.`,
    coverage: "Chandigarh, Mohali (SAS Nagar), Panchkula, Zirakpur, Kharar, New Chandigarh and Derabassi.",
    howWeWork: "Chandigarh work is remote: WhatsApp, calls and screen-shares, with every draft on a live link. Most projects never need a meeting; if yours does, we'll plan it.",
    faqs: [
      { q: "How much does a website cost in Chandigarh?", a: `Business sites start at ${inr(P.basic)}, and online stores and school or coaching sites with an admin panel at ${inr(P.store)}. Web apps and MVPs are quoted on scope. Every quote is fixed and in writing after one call — no hourly billing.` },
      { q: "Why hire a developer in Himachal instead of an agency in Mohali?", a: "Because you deal with the person writing the code. No account manager, no handoff to a junior, no six-month timeline. You get a fixed quote, milestones you can see on a live link, and the repository, documentation and IP transfer at the end." },
      { q: "Can you build a web app or SaaS MVP, not just a website?", a: "Yes. I build web apps and MVPs in Next.js and React with Supabase or a Node backend — admissions systems, dashboards, booking tools. I also run my own AI product, Websitekind.ai." },
      companyFaq("Chandigarh", "That's the trade: you give up the agency's office and get a developer who answers your messages directly and quotes once."),
      { q: "Do you meet clients in Chandigarh?", a: "Most tricity projects run entirely on calls and WhatsApp, and you see every change on a live link. If a meeting in person matters for your project, tell me and we'll plan it." },
    ],
    near: ["baddi", "solan", "shimla", "ludhiana", "una", "nahan"],
  },
  {
    slug: "ludhiana",
    city: "Ludhiana",
    region: "pb",
    district: "Ludhiana, Punjab",
    featured: false,
    tier: "remote",
    title: "Web Developer for Ludhiana — Manufacturer & Exporter Websites",
    description:
      "Web developer for Ludhiana manufacturers, hosiery and knitwear brands and exporters — product catalogues, WhatsApp ordering and B2B enquiry sites.",
    keywords:
      "web developer Ludhiana, website designer Ludhiana, hosiery website Ludhiana, knitwear brand website, manufacturer website Ludhiana, exporter website Punjab, web design company Ludhiana",
    ogDescription: "Hosiery and knitwear brands, manufacturers and exporters in Ludhiana — catalogue sites built to turn buyers into enquiries.",
    kicker: "Punjab · Ludhiana · Remote from Kangra",
    lead: `Ludhiana makes things — knitwear and hosiery, bicycle and machine parts, tools and fasteners — and sells them to buyers in other states and other countries who meet the business first on its website. Most of those sites were built once and left. I build custom catalogue and B2B sites for Ludhiana manufacturers and brands from Kangra: products buyers can browse, enquiries that reach a person, and a site fast enough to work on a buyer's phone.`,
    offersHead: "For a city that makes things",
    offers: [
      { t: "Hosiery & knitwear brands", d: "A collection site where each design is a page, with sizes, colours and wholesale or made-to-order enquiries on WhatsApp — the pattern I built for a 585K-subscriber knitting creator." },
      { t: "Manufacturers & parts makers", d: "Products with specifications and drawings, capacity, certifications and a request-for-quote form that reaches the sales desk." },
      { t: "Exporters", d: "English-first catalogues for overseas buyers, with the facts they check — certifications, MOQ, lead times — and an enquiry form that asks the right questions." },
      { t: "Retail & local services", d: "Shops, clinics and institutes in Ludhiana that need a credible, fast site and a Google Business Profile that matches it." },
    ],
    proof: ["chinkiz", "modernkbs"],
    proofNote: `Not Ludhiana clients — the closest builds: a made-to-order knitting site with 96 pieces, every order starting as a pre-written WhatsApp message, and a web app with an admin panel an office runs itself.`,
    coverage: "Ludhiana city, Khanna, Jagraon, Doraha, Samrala, Raikot and the Focal Point industrial areas.",
    howWeWork: "Ludhiana work is remote: calls, WhatsApp and screen-shares, with a shared sheet for every product. If a factory visit for photographs matters, we'll plan it.",
    faqs: [
      { q: "What does a manufacturer's website cost?", a: `It depends mostly on the number of products and whether you need search, filters or an admin to manage them, so B2B catalogues are quoted on scope. A simple business site starts at ${inr(P.basic)} and an online store at ${inr(P.store)}. The quote is fixed and in writing.` },
      { q: "Can buyers order or enquire on WhatsApp from the site?", a: "Yes. Each product's button opens WhatsApp with the product, size and quantity already written, so the buyer sends one message and your team replies with a price. That's how every ChinkiZ order starts." },
      { q: "Can we add products ourselves?", a: "Yes. Products live in an admin panel or a structured data file; add one and its page, catalogue listing and search entry all update together." },
      companyFaq("Ludhiana", "You work with the developer directly from the first call to the handover, and the code, domain and hosting are in your name."),
      { q: "You're in Himachal — does distance matter?", a: "Not for this kind of work. Briefs, product lists and reviews happen over calls and WhatsApp, and every draft is on a live link. I say plainly that I'm in Kangra, not Ludhiana; most clients find that faster, not slower." },
    ],
    near: ["jalandhar", "chandigarh", "amritsar", "baddi", "pathankot", "una"],
  },
  {
    slug: "jalandhar",
    city: "Jalandhar",
    region: "pb",
    district: "Jalandhar, Punjab",
    featured: false,
    tier: "remote",
    title: "Web Developer for Jalandhar — Sports Goods & Business Sites",
    description:
      "Web developer for Jalandhar sports-goods and leather manufacturers, education consultants, clinics and local businesses — custom-coded sites with fixed quotes.",
    keywords:
      "web developer Jalandhar, website designer Jalandhar, sports goods website Jalandhar, manufacturer website Jalandhar, website design Phagwara, web design company Jalandhar",
    ogDescription: "Sports goods and leather makers, education consultants and clinics in Jalandhar — custom-coded sites, quoted once.",
    kicker: "Punjab · Jalandhar · Remote from Kangra",
    lead: `Jalandhar's sports-goods makers ship cricket bats, balls and gear around the world, its leather units sell to buyers abroad, and the Doaba's families keep the city's education and visa consultants busy. All of them are judged on a website before anyone calls. I build those sites from Kangra — product catalogues for manufacturers, clear service pages for consultants and clinics — custom-coded, quoted once, and handed over with the code.`,
    offersHead: "For Jalandhar's makers and services",
    offers: [
      { t: "Sports goods & leather manufacturers", d: "A catalogue where each product has its own page, specifications and wholesale enquiry, built for overseas and domestic buyers." },
      { t: "Education & study-abroad consultants", d: "Clear service pages, country and course guides, results and a counselling booking that reaches your team on WhatsApp — without claims you can't stand behind." },
      { t: "Clinics, hospitals and labs", d: "Doctors, specialities, timings and appointment requests, on a site that loads fast and reads clearly on a phone." },
      { t: "Shops & services in Jalandhar and Phagwara", d: "Phone-first sites with your Google Business Profile wired in, so “near me” searches find you first." },
    ],
    proof: ["chinkiz", "modernkbs", "pinnacle-world-school"],
    proofNote: `None of these are Jalandhar clients. They show the builds Jalandhar asks for: a made-to-order catalogue with WhatsApp ordering, an admissions web app, and an education site where every published fact traces to a record.`,
    coverage: "Jalandhar city, Phagwara, Kapurthala, Nakodar, Kartarpur, Adampur and Hoshiarpur.",
    howWeWork: "Jalandhar projects run remotely on calls, WhatsApp and screen-shares, with every draft on a live link. If a meeting in person matters, we'll plan it.",
    faqs: [
      { q: "What does a website cost in Jalandhar?", a: `Business sites start at ${inr(P.basic)}, and online stores at ${inr(P.store)}. Manufacturers' catalogues and web apps are quoted on scope. Every quote is fixed and in writing after one call.` },
      { q: "Can you build an export catalogue for a sports-goods maker?", a: "Yes. Each product gets a page with specifications, materials, sizes and photographs, the catalogue is searchable, and the enquiry form asks for quantity and market so your team can quote straight away." },
      { q: "Do you build websites for immigration and study-abroad consultants?", a: "Yes — with one rule: the site only states what you can back up. No invented success rates or guarantees. Clear services, real results, and a counselling booking that reaches your team." },
      companyFaq("Jalandhar", "You talk to the developer, not a sales rep, and the price you're quoted is the price you pay."),
      { q: "Is a developer in Himachal a problem for a Jalandhar business?", a: "No. The work runs on calls and WhatsApp, and you see every change on a live link. I'm upfront that I work from Kangra, not Jalandhar." },
    ],
    near: ["ludhiana", "amritsar", "pathankot", "una", "chandigarh", "kangra"],
  },
  {
    slug: "amritsar",
    city: "Amritsar",
    region: "pb",
    district: "Amritsar, Punjab",
    featured: false,
    tier: "remote",
    title: "Web Developer for Amritsar — Hotel, Travel & Restaurant Websites",
    description:
      "Web developer for Amritsar hotels near the Golden Temple, taxi and tour operators, restaurants and textile businesses — direct-booking sites, fixed quotes.",
    keywords:
      "web developer Amritsar, website designer Amritsar, hotel website Amritsar, Golden Temple hotel website, travel agency website Amritsar, restaurant website Amritsar",
    ogDescription: "Hotels near the Golden Temple, taxi and tour operators and restaurants — direct-booking websites for Amritsar.",
    kicker: "Punjab · Amritsar · Remote from Kangra",
    lead: `Amritsar runs on visitors — to the Golden Temple, to the Attari–Wagah ceremony, to the city's food — and most of them book a hotel, a taxi or a table on a phone. That makes it a city where aggregators take a cut of almost everything. I build direct-booking websites for Amritsar's hotels, taxi and tour operators and restaurants from Kangra, the same kind I've built for Himachal's tourism businesses.`,
    offersHead: "For a city that hosts the world",
    offers: [
      { t: "Hotels near the Golden Temple", d: "Rooms, walking distance to Harmandir Sahib, parking and an enquiry that reaches your WhatsApp — so guests who already know your name don't book through an OTA." },
      { t: "Taxi & tour operators", d: "Route pages for Wagah border, the airport, Dalhousie, Dharamshala, Katra and Jammu, each with its distance and what's included." },
      { t: "Restaurants & sweet shops", d: "Menu, location, timings and a call or order button — fast, simple, and findable when someone searches for food nearby." },
      { t: "Phulkari, textiles & local makers", d: "A made-to-order catalogue with WhatsApp ordering, without a marketplace's cut." },
    ],
    proof: ["hotel-himalayan-brothers", "baglamukhi-travels", "chinkiz"],
    proofNote: `Not Amritsar clients — the closest builds: five family-run hotels on one site, a Kangra taxi operator with 41.8K Google impressions in 28 days, and a made-to-order catalogue ordered over WhatsApp.`,
    coverage: "Amritsar city, the walled city around Harmandir Sahib, Attari, Tarn Taran, Ajnala and Batala.",
    howWeWork: "Amritsar work is remote: WhatsApp, calls and screen-shares, with every draft on a live link. If a meeting in person matters, tell me and we'll plan it.",
    faqs: [
      { q: "What does a hotel or taxi website cost in Amritsar?", a: `A hotel, travel or taxi site starts at ${inr(P.hotel)}, and a restaurant or shop site at ${inr(P.basic)}. The quote is fixed and in writing after one call.` },
      { q: "Can my hotel get direct bookings instead of paying OTAs?", a: "For the guests who search for your name or your street, yes. The site shows them rooms, the walk to the Golden Temple and your rates, and sends the enquiry to your WhatsApp. OTAs still bring new guests; you stop paying them for the ones who already found you." },
      { q: "Can a taxi operator rank for “Amritsar to Wagah border taxi”?", a: "Yes — with a page of its own for that route, and one for each other route you drive. That's how I build taxi sites: specific pages Google can rank, with fares from one data file so they never disagree." },
      companyFaq("Amritsar", "A hotel or taxi owner gets one person who builds the site and the SEO, and keeps answering after launch."),
      { q: "You're in Himachal — why hire you for an Amritsar business?", a: "Because Amritsar's tourism looks a lot like Himachal's: WhatsApp-first guests, aggregators taking a cut, and taxis running to the same hills. I've built that kind of site many times. I'm upfront that the work is remote." },
    ],
    near: ["pathankot", "jalandhar", "ludhiana", "chamba", "dharamshala", "kangra"],
  },
];

/** Generated pages only (the four handmade ones keep their own .astro). */
export const GENERATED_LOCATIONS = LOCATIONS.filter((l) => !l.handmade);

export const locationHref = (slug) => `/web-developer-${slug}/`;
export const locationBySlug = (slug) => LOCATIONS.find((l) => l.slug === slug);
export const locationWa = (l) => wa(l.city);

export const HUB = { href: "/web-developer-himachal-pradesh/", label: "Web developer in Himachal Pradesh" };

/** Short list for the footer and homepage chips: featured, in list order. */
export const FEATURED_LOCATIONS = LOCATIONS.filter((l) => l.featured);
export const HP_LOCATIONS = LOCATIONS.filter((l) => l.region === "hp");
export const PB_LOCATIONS = LOCATIONS.filter((l) => l.region === "pb");

/* ===========================================================================
   Industry service pages — /services/<vertical>-website-development/.
   Content only; src/components/VerticalService.astro renders it.

   These are the commercial pages for the three verticals the client work
   actually sits in (schools, hotels, travel). Proof is pulled from
   projects/data.mjs by slug, so a case study's name, image and URL can't drift
   from its own page. Starting prices come from STARTING_PRICES in site.mjs.
   =========================================================================== */

import { STARTING_PRICES as P, inr } from "./site.mjs";

const wa = (text) => `https://wa.me/919816091875?text=${encodeURIComponent(text)}`;

export const VERTICALS = {
  school: {
    slug: "school-website-development",
    name: "School website development",
    title: "School Website Development in Himachal & India — CBSE-Ready",
    description:
      "CBSE-ready school websites for Himachal and India: Mandatory Public Disclosure, admissions over WhatsApp or a portal, notices and fees. Custom-coded, no SaaS fees.",
    keywords:
      "school website development, school website design Himachal, CBSE school website, school website developer India, mandatory public disclosure page, school admissions portal, school website Kangra",
    ogTitle: "School website development — CBSE-ready",
    ogDescription: "Websites parents can use and CBSE can inspect, built for schools in Himachal and across India.",
    eyebrow: ["Education", "CBSE & state boards", "Himachal · India"],
    h1: ["School website", "development."],
    lead: `A school website has two readers who want different things. Parents want admissions, fees, transport and proof the school is real. CBSE wants the Mandatory Public Disclosure in its format, with the documents attached. I build sites that serve both, for schools in Himachal Pradesh and across India, and give the office a way to keep them current without calling a developer.`,
    waText: "Hi Divyansh, I want a website for our school.",
    topics: ["education", "webDevelopment", "himachal"],
    mustHead: "What a school website has to do",
    must: [
      { t: "Mandatory Public Disclosure, done properly", d: "Appendix IX of the CBSE affiliation bye-laws, laid out as a page and not dumped as a PDF: general information, documents, results, staff and infrastructure. A row whose document hasn't arrived says so, instead of a download button that leads nowhere." },
      { t: "Admissions that reach the office", d: "An enquiry form that lands in the school office's WhatsApp with the message already written, or, when the school processes applications online, a full application portal with an admin panel." },
      { t: "Notices, results and the calendar", d: "The pages parents check every week. Office staff can update them without a developer, and the homepage always shows the latest notices." },
      { t: "Facts that match the record", d: "The affiliation number, school code, principal and trust are identical everywhere they appear, in the footer and the School schema alike, and they match the school's CBSE SARAS record." },
      { t: "Fast on a parent's phone", d: "Most parents open the site from a WhatsApp link on mobile data. The school's own photographs are served as AVIF and WebP, and the first load stays around half a megabyte." },
      { t: "Found for the school's name and town", d: "School structured data, a claimed Google Business Profile and clean URLs, so “<school name>” and “CBSE school in <town>” lead to the school's own site and not a directory." },
    ],
    proof: ["pinnacle-world-school", "modernkbs"],
    steps: [
      { t: "One call", d: "What exists, what CBSE requires, and what the office will realistically maintain." },
      { t: "A facts sheet", d: "Every figure with its source. Gaps become a plain-language list for the school instead of guesses on the site." },
      { t: "Design and build", d: "Prerendered pages, tested on phones, with old URLs redirected so no existing link breaks." },
      { t: "Handover", d: "An admin panel or simple edits, plus a checklist of the documents still to be published." },
    ],
    faqs: [
      { q: "What must a CBSE school website include?", a: "CBSE's affiliation bye-laws require a Mandatory Public Disclosure on the school's website (Appendix IX). It covers general information, documents and certificates such as affiliation, NOC, recognition and safety certificates, Class X and XII results, staff details and infrastructure. Beyond compliance, parents look for admissions, fees, transport, notices and the academic calendar." },
      { q: "How much does a school website cost?", a: `From ${inr(P.school)} for a school website with an admin panel. A public site with the CBSE pages is a different build from one with a full online admissions portal, so I quote fixed and in writing after one call, and neither comes with a recurring software fee.` },
      { q: "How long does a school website take?", a: "Modern K.B.S.'s public site and admissions portal went live in 7 days, where other agencies had quoted six months. Most of the timeline for a school depends on how quickly the documents and facts can be confirmed, not on the build." },
      { q: "Can office staff update notices and results themselves?", a: "Yes. Pinnacle World School's content lives in collections behind an admin panel, and Modern K.B.S.'s office processes admissions in its own dashboard. Neither needs a developer for day-to-day updates." },
      { q: "Can you move our school off an old ERP or CMS website without breaking links?", a: "Yes. When Pinnacle World School moved to its own domain, all 14 of the old site's URLs were 308-redirected to their new pages, so bookmarks, WhatsApp forwards and search results kept working." },
      { q: "Do you build school websites outside Himachal Pradesh?", a: "Yes. The work runs over WhatsApp, calls and screen-shares, so a school anywhere in India gets the same process. Schools in Kangra and nearby districts can also meet in person." },
    ],
    reading: [
      { href: "/blog/cbse-mandatory-public-disclosure-school-website/", t: "CBSE Mandatory Public Disclosure: what your school website must publish" },
      { href: "/blog/school-website-admissions-portal-india/", t: "School website cost and features in India" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  hotel: {
    slug: "hotel-website-development",
    name: "Hotel & homestay website development",
    title: "Hotel & Homestay Website Design in Himachal — Direct Bookings",
    description:
      "Hotel and homestay websites in Himachal that win direct bookings: WhatsApp enquiries, honest rooms and rates, “near” pages for local search, fast on hill networks.",
    keywords:
      "hotel website design Himachal, hotel website development India, homestay website designer, resort website Himachal, direct booking hotel website, hotel website Kangra, hotel website Dharamshala",
    ogTitle: "Hotel & homestay websites — built for direct bookings",
    ogDescription: "Photography first, WhatsApp at the end, no commission on the guests who were already looking for you.",
    eyebrow: ["Hospitality", "Hotels · homestays · resorts", "Himachal · India"],
    h1: ["Hotel website", "design & development."],
    lead: `Every booking that comes through an online travel agency pays it a commission, typically somewhere between 15 and 30 percent. A hotel or homestay's own website is how you keep the guests who were already looking for you: repeat visitors, referrals, people who found you on Maps. I build those sites for properties in Himachal and across India, designed to end with the guest in your WhatsApp or on the phone with you.`,
    waText: "Hi Divyansh, I want a website for my hotel / homestay.",
    topics: ["hotel", "tourism", "himachal"],
    mustHead: "What a hotel website has to do",
    must: [
      { t: "Show the place before the price", d: "Guests decide on the view, the room and the pool. The layout is led by photography, and the photographs are the property's own." },
      { t: "Book the way you actually book", d: "A small property that confirms every stay personally is best served by WhatsApp and a phone number. Yash Rock Hotel has no booking engine at all. A booking engine earns its place when there's enough inventory to manage online." },
      { t: "Rooms and rates, stated honestly", d: "One room type if one is what you have. A “message us for the best price” line where rates move. Nothing a guest will find untrue at check-in." },
      { t: "Pages for where guests are going", d: "Guests search for a stay near the airport, the college, the temple or the stadium, not for your village. Yash Rock's 14 “near” pages are each written about the place itself." },
      { t: "Schema and Google Business Profile that agree", d: "Hotel structured data with amenities, check-in times and the same name, address and phone as your Business Profile, so Google treats them as one property." },
      { t: "Light on mountain networks", d: "AVIF and WebP images and no autoplay video. Yash Rock cut about 3 MB of video from every homepage load for guests on patchy hill data." },
    ],
    proof: ["yash-rock-hotel"],
    steps: [
      { t: "One call", d: "How bookings arrive today, how you confirm them, and which places your guests are actually travelling to." },
      { t: "Verified facts", d: "Rooms, rates, check-in, amenities and policies, each confirmed by you before it's published." },
      { t: "Design and build", d: "Photography-led pages, WhatsApp and call buttons on every screen, and a “near” page for each place guests are heading." },
      { t: "Launch", d: "Hotel schema, a matching Business Profile, and a short list of the off-site work that moves local rankings." },
    ],
    faqs: [
      { q: "Do I need a booking engine on my hotel website?", a: "Not always. With a handful of rooms and rates you confirm personally, a WhatsApp button and a phone number convert well and cost nothing per booking. A booking engine makes sense once you have enough inventory that managing availability online saves real work." },
      { q: "Will a website replace Booking.com or MakeMyTrip?", a: "No, and it shouldn't try to. Online travel agencies are good at reaching people who have never heard of you. Your own site keeps repeat guests, referrals and anyone searching for you by name from paying their commission." },
      { q: "How does a small hotel rank on Google?", a: "Mostly through its Google Business Profile and reviews, backed by a website with the same name, address and phone, Hotel structured data, and pages that match what guests search for, such as a stay near a landmark they're visiting." },
      { q: "How much does a hotel website cost?", a: `From ${inr(P.hotel)}. The final number depends on the number of pages, the photography and whether you need a booking engine; I quote fixed and in writing after one conversation, with no commission and no monthly platform fee.` },
      { q: "Can I change rates, photos and offers later?", a: "Yes. Rates and facts are kept in one place, so a change shows up everywhere it belongs: the room page, the homepage and the structured data Google reads." },
      { q: "Do you build websites for homestays outside Himachal?", a: "Yes. The process runs over WhatsApp and calls, so a homestay anywhere in India gets the same build. Properties in the Kangra valley can also meet in person." },
    ],
    reading: [
      { href: "/blog/hotel-near-me-landing-pages/", t: "“Near” pages for a small hotel: ranking for where guests are going" },
      { href: "/blog/hotel-homestay-website-himachal-direct-bookings/", t: "How to get more direct hotel bookings in Himachal" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  travel: {
    slug: "travel-website-development",
    name: "Travel & taxi website development",
    title: "Travel Agency & Taxi Website Development in Himachal",
    description:
      "Websites for tour operators, travel agencies and taxi services in Himachal and India: a page per trip, route and town, WhatsApp booking, local SEO. Custom-coded.",
    keywords:
      "travel agency website development, taxi website developer, tour operator website Himachal, travel website design India, taxi service website Kangra, tour package website, travel website Dharamshala",
    ogTitle: "Travel & taxi websites — a page for every trip, route and town",
    ogDescription: "Built for four operators in Kangra and Dharamshala. WhatsApp at the end of every page.",
    eyebrow: ["Travel", "Tours · taxis · agencies", "Himachal · India"],
    h1: ["Travel & taxi", "website development."],
    lead: `Travellers don't search for “travel agency”. They search for a route, a trip or a town: “Delhi to Dharamshala taxi”, “Spiti tour package”, “taxi service in Palampur”. A travel site wins by having an honest page for each of those searches, with WhatsApp at the end of it. I've built travel sites for four operators in Kangra and Dharamshala.`,
    waText: "Hi Divyansh, I want a travel / taxi website.",
    topics: ["tourism", "webDevelopment", "himachal"],
    mustHead: "What a travel website has to do",
    must: [
      { t: "A page for every route and trip", d: "Each transfer and tour gets its own URL, with the distance, the road and what's included, because that's the level at which people search." },
      { t: "Town pages for “taxi service in <town>”", d: "Local taxi searches are town by town. Sunny Himachal Travels has nine of these pages, each written from what the business is actually booked for in that town." },
      { t: "Prices before anyone has to ask", d: "Where the operator can commit to them, published all-in fares for the common routes. Baglamukhi Travels lists 27 point-to-point routes this way." },
      { t: "WhatsApp at the end of every page", d: "The message arrives pre-filled with the trip, and a sticky bar keeps WhatsApp and Call one tap away on a phone. That's where these bookings close anyway." },
      { t: "Local business schema that holds up", d: "Geo-coordinates, opening hours, services and ratings in structured data, with the same name, address and phone as the Google Business Profile." },
      { t: "No thin pages", d: "Growing to a hundred pages is exactly where travel sites go thin. Sunny's build fails if any two pages read too alike, so pages that would overlap are dropped rather than published." },
    ],
    proof: ["sunny-himachal-travels", "baglamukhi-travels", "nandini", "dharamshala-tours"],
    steps: [
      { t: "One call", d: "The routes, trips and towns that actually make money, and how bookings arrive today." },
      { t: "A page map", d: "One page per real search, checked against Search Console and Maps data where the business has any." },
      { t: "Design and build", d: "Fast static pages, WhatsApp on every screen, local business schema and an llms.txt for AI assistants." },
      { t: "Grow it", d: "New routes and seasonal trips added as demand shows up, without duplicating what's already there." },
    ],
    faqs: [
      { q: "What pages should a taxi or travel website have?", a: "One for each route people book, one for each trip or package, one for each town people search “taxi service in” for, plus the fleet, the FAQ and a contact page. The homepage can't rank for all of those searches by itself." },
      { q: "Do travel websites need online payment?", a: "Usually not in Himachal. Most trips are confirmed on WhatsApp and paid at or after the trip, and a payment gateway adds friction for no gain. It can be added where advance booking genuinely needs a deposit." },
      { q: "How long before a new travel website ranks on Google?", a: "Expect weeks to months, depending on competition and on the Google Business Profile. Baglamukhi Travels now averages position 5.7 on Google against aggregators and call centres." },
      { q: "How much does a travel or taxi website cost?", a: `From ${inr(P.travel)}. The final number depends on how many routes, trips and towns need their own pages; I quote fixed and in writing after one call, and the operator owns the code.` },
      { q: "Can I add new packages and routes myself?", a: "Yes. Dharamshala Tours' team publishes seasonal itineraries themselves, and Sunny Himachal Travels' trips and routes are plain content files that can be added without touching the design." },
      { q: "Do you only build travel websites in Himachal?", a: "No. The four travel sites so far are in Kangra and Dharamshala, but the same approach works for any operator in India whose customers search by route and town." },
    ],
    reading: [
      { href: "/blog/taxi-tour-operator-website-pages/", t: "Taxi and tour operator websites: why every route and town needs its own page" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },
};

export const VERTICAL_LIST = Object.values(VERTICALS);
export const verticalWa = (v) => wa(v.waText);

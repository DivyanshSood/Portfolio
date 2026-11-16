/* ===========================================================================
   Industry service pages — /services/<vertical>-website-development/.
   Content only; src/layouts/Vertical.astro renders it.

   These are the commercial pages for the verticals the client work actually
   sits in. Three pairs, each split so the two pages don't compete for the same
   searches (16 Nov 2026 audit), and each page links its sibling via `see`:
     school (admissions portal, admin, state boards) ↔ cbse (Mandatory Public
       Disclosure, Appendix IX, SARAS)
     hotel (hotels and hotel groups) ↔ homestay (family homes and guesthouses)
     travel (tour operators and agencies: packages, treks) ↔ taxi (airport
       pickups, route pages, published fares)
   Proof is pulled from projects/data.mjs by slug, so a case study's name,
   image and URL can't drift from its own page. Every number below comes from a
   case study; starting prices come from STARTING_PRICES in site.mjs.
   =========================================================================== */

import { STARTING_PRICES as P, inr } from "./site.mjs";

const wa = (text) => `https://wa.me/919816091875?text=${encodeURIComponent(text)}`;

export const VERTICALS = {
  school: {
    slug: "school-website-development",
    name: "School website development",
    title: "School Website Development — Admissions Portal & Admin",
    description:
      "School websites for Himachal and India with online admissions, an application-status page and an admin panel the office runs. CBSE or state board. No SaaS fees.",
    keywords:
      "school website development, school website design Himachal, school admissions portal, school website with admin panel, school website developer India, HPBOSE school website, school website Kangra",
    ogTitle: "School website development — admissions and an admin the office runs",
    ogDescription: "Admissions, notices, fees and results that the school office updates itself, with no recurring software fee.",
    eyebrow: ["Education", "CBSE & state boards", "Himachal · India"],
    h1: ["School website", "development."],
    lead: `A school website has two readers who want different things. Parents want admissions, fees, transport and proof the school is real; the office wants fewer phone calls and a way to publish a notice without ringing a developer. I build school websites for Himachal Pradesh and across India with online admissions, an application-status page and an admin panel the office runs itself, whatever the board.`,
    waText: "Hi Divyansh, I want a website for our school.",
    topics: ["education", "webDevelopment", "himachal"],
    mustHead: "What a school website has to do",
    must: [
      { t: "Admissions that reach the office", d: "An enquiry form that lands in the school office's WhatsApp with the message already written, or, when the school processes applications online, a full application form for every class, with the documents attached." },
      { t: "A status page for parents", d: "After applying, a parent can check where the application stands instead of calling the office. At Modern K.B.S., applications for classes I to XII run through one form and one status page." },
      { t: "An admin panel the office runs", d: "Admissions, document requests, notices, fees, staff, toppers and the gallery, edited by office staff in their own dashboard. No developer on call for day-to-day changes." },
      { t: "Notices, results and the calendar", d: "The pages parents check every week. The homepage always shows the latest notices." },
      { t: "Fast on a parent's phone", d: "Most parents open the site from a WhatsApp link on mobile data. The school's own photographs are served as AVIF and WebP, and the first load stays around half a megabyte." },
      { t: "The board's requirements, met", d: `A CBSE school also has to publish its Mandatory Public Disclosure in the Appendix IX format; that has <a href="/services/cbse-school-website-development/">its own page</a>. A state-board school, like the HPBOSE-affiliated Modern K.B.S., gets the same admissions and admin without it.` },
    ],
    see: [
      { lead: "A CBSE school that needs the Mandatory Public Disclosure done properly?", href: "/services/cbse-school-website-development/", t: "CBSE school website development" },
    ],
    proof: ["modernkbs", "pinnacle-world-school"],
    steps: [
      { t: "One call", d: "How admissions work today, who in the office will run the panel, and what parents ask most." },
      { t: "A facts sheet", d: "Every figure with its source. Gaps become a plain-language list for the school instead of guesses on the site." },
      { t: "Design and build", d: "Prerendered public pages, the admissions flow and the admin panel, tested on phones, with old URLs redirected so no existing link breaks." },
      { t: "Handover", d: "The office is walked through the admin panel, with a written guide to keep." },
    ],
    faqs: [
      { q: "Can parents apply for admission online?", a: "Yes. Modern K.B.S. takes applications for classes I to XII through one online form, and parents check the application's progress on a status page. Office staff process each one in the admin panel. A smaller school can start with an enquiry form that opens WhatsApp with the message already written to the office." },
      { q: "How much does a school website cost?", a: `From ${inr(P.school)} for a school website with an admin panel. A public site with an enquiry form is a different build from one with a full online admissions portal, so I quote fixed and in writing after one call, and neither comes with a recurring software fee.` },
      { q: "How long does a school website take?", a: "A school website in Himachal typically goes live in 1–3 weeks; Modern K.B.S.'s admin says theirs went live in 7 days. Most of the timeline for a school depends on how quickly the documents and facts can be confirmed, not on the build." },
      { q: "Can office staff update notices and results themselves?", a: "Yes. Pinnacle World School's staff publish notices, events, fees, documents and photos from an admin panel, and Modern K.B.S.'s office processes admissions in its own dashboard. Neither needs a developer for day-to-day updates." },
      { q: "Do you build websites for state-board schools?", a: "Yes. Modern K.B.S. in Ladwara is affiliated to the Himachal Pradesh Board of School Education (HPBOSE), and its site has the same admissions portal and admin panel a CBSE school would get. Only the Mandatory Public Disclosure is CBSE-specific." },
      { q: "Can you move our school off an old ERP or CMS website without breaking links?", a: "Yes. When Pinnacle World School moved to its own domain, all 14 of the old site's URLs were 308-redirected to their new pages, so bookmarks, WhatsApp forwards and search results kept working." },
      { q: "Do you build school websites outside Himachal Pradesh?", a: "Yes. The work runs over WhatsApp, calls and screen-shares, so a school anywhere in India gets the same process. Schools in Kangra and nearby districts can also meet in person." },
    ],
    reading: [
      { href: "/blog/school-website-admissions-portal-india/", t: "School website cost and features in India" },
      { href: "/blog/cbse-mandatory-public-disclosure-school-website/", t: "CBSE Mandatory Public Disclosure: what your school website must publish" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  cbse: {
    slug: "cbse-school-website-development",
    name: "CBSE school website development",
    title: "CBSE School Website Development — Mandatory Disclosure",
    description:
      "CBSE school websites with the Mandatory Public Disclosure laid out per Appendix IX, facts that match SARAS, and documents staff can publish themselves.",
    keywords:
      "CBSE school website development, CBSE mandatory public disclosure, Appendix IX school website, CBSE school website design, mandatory disclosure page, CBSE affiliated school website, SARAS school details",
    ogTitle: "CBSE school websites — the Mandatory Public Disclosure, done properly",
    ogDescription: "Appendix IX laid out as a page, every fact matching SARAS, and each document a row of its own.",
    eyebrow: ["Education", "CBSE-affiliated schools", "Himachal · India"],
    h1: ["CBSE school website", "development."],
    lead: `Every CBSE-affiliated school has to publish a Mandatory Public Disclosure on its own website, in the format of Appendix IX of the Affiliation Bye-Laws. Most do it as one scanned PDF behind a button: unreadable on a phone, unsearchable, and silent about what's missing. I build CBSE school websites where the disclosure is a real page, every value matches the school's SARAS record, and the office can publish each document the day it's signed.`,
    waText: "Hi Divyansh, I want a website for our CBSE school.",
    topics: ["education", "webDevelopment", "himachal"],
    mustHead: "What a CBSE school website has to get right",
    must: [
      { t: "Appendix IX, in CBSE's order", d: "Five sections with CBSE's own letters and labels: general information, documents, results and academics, teaching staff, and infrastructure. Parents skim for a heading; an inspector looks for the section letter." },
      { t: "Facts that match SARAS", d: "The affiliation number, school code, address, principal and contact details are identical in the header, the footer, the contact page and the School schema, and they match the school's record on SARAS, CBSE's affiliation portal, character for character." },
      { t: "A row for every document", d: "The affiliation letter, the NOC, RTE recognition, building and fire safety and the rest each get their own row and their own link, as self-attested copies. Not one merged scan that nobody can find anything in." },
      { t: "Honest about what's missing", d: "No school has every certificate scanned on day one. A row whose document hasn't arrived says “Document awaited” instead of showing a download button that leads nowhere, and a figure nobody has confirmed reads “To be updated”." },
      { t: "Documents the office publishes", d: "Staff upload a PDF from an admin panel and the row turns into a “View PDF” link. At Pinnacle World School, PDFs up to 10 MB upload in pieces and nothing needs a developer." },
      { t: "Everything else parents want", d: "Admissions, fees, transport, notices and the academic calendar sit alongside the disclosure, because a parent comparing schools reads those first and the disclosure second." },
    ],
    see: [
      { lead: "Need online admissions with a status page, or building for a state-board school?", href: "/services/school-website-development/", t: "School website development" },
    ],
    deepHead: "The disclosure, section by section",
    deepNote: "Appendix IX",
    deep: [
      { tag: "A", t: "General information", d: "The school's name, affiliation number and school code, complete address with pin code, the principal's name and qualification, and the school's email and phone. Written on the page as text, not inside an image, so search engines, parents and SARAS all read the same values." },
      { tag: "B", t: "Documents and information", d: "The affiliation or upgradation letter and its latest extension; the trust, society or company registration and renewal; the state NOC; RTE recognition and renewal; building safety and fire safety certificates; the DEO certificate or self-certification; and the water, health and sanitation certificates. Eight rows, eight links." },
      { tag: "C", t: "Result and academics", d: "The fee structure, the annual academic calendar, the School Management Committee and Parent Teacher Association lists, and board results for the last three years, Class X and Class XII as applicable. The fee page and the calendar are also what parents look for outside the disclosure, so they're linked from the main menu too." },
      { tag: "D", t: "Staff (teaching)", d: "The principal; the total number of teachers split into PGT, TGT and PRT; the teacher–section ratio; and the details of the special educator and the counsellor and wellness teacher. Kept in the same admin panel as the staff page, so the two never disagree." },
      { tag: "E", t: "School infrastructure", d: "Campus area and the number and size of classrooms and laboratories, in square metres; whether there's internet; the number of girls' and boys' toilets; and a link to a YouTube video of the school inspection covering the infrastructure." },
      { tag: "Format", t: "A page, not a PDF", d: `Each item is a row. Where it's a value, the value is written on the page; where it's a document, the row links to that document's own PDF. The full checklist, with the mistakes that make a disclosure fail, is in <a href="/blog/cbse-mandatory-public-disclosure-school-website/">CBSE Mandatory Public Disclosure: what your school website must publish</a>.` },
    ],
    proofHead: "Built and live",
    proofNote: `Pinnacle World School in Baroh, Kangra, is the CBSE build. On 16 November 2026 its disclosure still shows “Document awaited” for all 8 documents in section B and all 5 in section C: they are the school's to supply, and the page says so instead of linking to nothing. Modern K.B.S. is HPBOSE-affiliated, so it's on the <a href="/services/school-website-development/">school website page</a> instead.`,
    proof: ["pinnacle-world-school"],
    steps: [
      { t: "One call", d: "Which documents exist, which are being renewed, and who in the office will publish them." },
      { t: "Check against SARAS", d: "Every general-information value is checked against the school's SARAS record; anything that differs goes back to the school as a question, not onto the page." },
      { t: "Build", d: "The disclosure as five sections of rows, the public site around it, and an admin panel for documents, notices and fees." },
      { t: "Handover", d: "A list of every row still awaiting its document, and a guide for publishing each one." },
    ],
    faqs: [
      { q: "What must a CBSE school website include?", a: "CBSE's affiliation bye-laws require a Mandatory Public Disclosure on the school's own website in the format of Appendix IX. It has five sections: general information, documents and certificates, results and academics, teaching staff, and school infrastructure. Beyond compliance, parents look for admissions, fees, transport, notices and the academic calendar." },
      { q: "Can a school upload the disclosure as one PDF?", a: "A single scanned PDF technically puts the information online, but it's hard to read on a phone, can't be searched, and hides which items are missing. A disclosure laid out as a web page, with each document linked from its own row, serves parents and inspectors far better." },
      { q: "What if some of our CBSE documents aren't ready?", a: "Then the page says so. Each missing document's row reads “Document awaited” until the PDF is published, and a figure nobody has confirmed reads “To be updated”. Nothing is guessed, and nothing links to an empty file." },
      { q: "Can our staff upload the disclosure documents themselves?", a: "Yes. At Pinnacle World School, staff publish documents, notices, events, fees and photos from an admin panel. Every change is saved as a draft, published in one step, and committed to the school's own repository, with no database to maintain." },
      { q: "How much does a CBSE school website cost?", a: `From ${inr(P.school)} for a school website with an admin panel, the disclosure included. I quote fixed and in writing after one call, with no recurring software fee.` },
      { q: "How long does it take?", a: "The build itself usually takes 1–3 weeks. What decides the date is how quickly the school can confirm its facts and send its documents, so the disclosure can go live with honest “Document awaited” rows and fill in afterwards." },
    ],
    reading: [
      { href: "/blog/cbse-mandatory-public-disclosure-school-website/", t: "CBSE Mandatory Public Disclosure: what your school website must publish" },
      { href: "/blog/school-website-admissions-portal-india/", t: "School website cost and features in India" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  hotel: {
    slug: "hotel-website-development",
    name: "Hotel website development",
    title: "Hotel Website Design in Himachal — Direct Bookings",
    description:
      "Hotel websites in Himachal that win direct bookings: WhatsApp or a booking engine, honest rooms and rates, “near” pages, and one site for a hotel group.",
    keywords:
      "hotel website design Himachal, hotel website development India, resort website Himachal, hotel group website, direct booking hotel website, hotel website Kangra, hotel website Dharamshala",
    ogTitle: "Hotel websites — built for direct bookings",
    ogDescription: "Photography first, the booking where you actually take it, no commission on the guests who were already looking for you.",
    eyebrow: ["Hospitality", "Hotels · resorts · hotel groups", "Himachal · India"],
    h1: ["Hotel website", "design & development."],
    lead: `Every booking that comes through an online travel agency pays it a commission, typically somewhere between 15 and 30 percent. A hotel's own website is how you keep the guests who were already looking for you: repeat visitors, referrals, people who found you on Maps. I build those sites for hotels and hotel groups in Himachal and across India, ending wherever you actually take bookings: WhatsApp, the phone, or your booking engine.`,
    waText: "Hi Divyansh, I want a website for my hotel.",
    topics: ["hotel", "tourism", "himachal"],
    mustHead: "What a hotel website has to do",
    must: [
      { t: "Show the place before the price", d: "Guests decide on the view, the room and the pool. The layout is led by photography, and the photographs are the property's own." },
      { t: "Book the way you actually book", d: "A small hotel that confirms every stay personally is best served by WhatsApp and a phone number; Yash Rock Hotel has no booking engine at all. Where a hotel runs an engine, the site hands the guest straight to it." },
      { t: "Rooms and rates, stated honestly", d: "Every room type with its real size, beds and occupancy. A “message us for the best price” line where rates move. Nothing a guest will find untrue at check-in." },
      { t: "Pages for where guests are going", d: "Guests search for a stay near the airport, the college, the temple or the stadium, not for your village. Yash Rock's 14 “near” pages are each written about the place itself." },
      { t: "One site for a hotel group", d: "Himalayan Brothers' five hotels and 20 room types live in one data file. One booking form opens the booking engine for two hotels and a pre-written WhatsApp message for the other three." },
      { t: "Schema and Google Business Profile that agree", d: "Hotel and HotelRoom structured data with the same name, address and phone as each Business Profile, so Google treats every property as one place, not two." },
    ],
    see: [
      { lead: "Running a family home or a small guesthouse rather than a hotel?", href: "/services/homestay-website-development/", t: "Homestay website development" },
    ],
    proof: ["yash-rock-hotel", "hotel-himalayan-brothers"],
    steps: [
      { t: "One call", d: "How bookings arrive today, how you confirm them, and which places your guests are actually travelling to." },
      { t: "Verified facts", d: "Rooms, rates, check-in, amenities and policies, each confirmed by you before it's published." },
      { t: "Design and build", d: "Photography-led pages, the booking on every screen, and a “near” page for each place guests are heading." },
      { t: "Launch", d: "Hotel schema, a matching Business Profile, and a short list of the off-site work that moves local rankings." },
    ],
    faqs: [
      { q: "Do I need a booking engine on my hotel website?", a: "Not always. With a handful of rooms and rates you confirm personally, a WhatsApp button and a phone number convert well and cost nothing per booking. A booking engine makes sense once you have enough inventory that managing availability online saves real work." },
      { q: "Will a website replace Booking.com or MakeMyTrip?", a: "No, and it shouldn't try to. Online travel agencies are good at reaching people who have never heard of you. Your own site keeps repeat guests, referrals and anyone searching for you by name from paying their commission." },
      { q: "How does a small hotel rank on Google?", a: "Mostly through its Google Business Profile and reviews, backed by a website with the same name, address and phone, Hotel structured data, and pages that match what guests search for, such as a stay near a landmark they're visiting." },
      { q: "How much does a hotel website cost?", a: `From ${inr(P.hotel)}. The final number depends on the number of pages, the photography and whether you need a booking engine; I quote fixed and in writing after one conversation, with no commission and no monthly platform fee.` },
      { q: "Can one website cover several hotels?", a: "Yes. The Himalayan Brothers group runs five hotels from Dharamshala to Spiti on one site: every hotel and its 20 room types sit in one data file, so the pages, the structured data and the booking form can't disagree, and each hotel kept its old URL." },
      { q: "Can I change rates, photos and offers later?", a: "Yes. Rates and facts are kept in one place, so a change shows up everywhere it belongs: the room page, the homepage and the structured data Google reads." },
    ],
    reading: [
      { href: "/blog/hotel-near-me-landing-pages/", t: "“Near” pages for a small hotel: ranking for where guests are going" },
      { href: "/blog/hotel-homestay-website-himachal-direct-bookings/", t: "How to get more direct hotel bookings in Himachal" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  homestay: {
    slug: "homestay-website-development",
    name: "Homestay website development",
    title: "Homestay Website Design in Himachal — Bir, Tirthan, Spiti",
    description:
      "Homestay websites for Himachal — Bir, Tirthan, Spiti, Dharamkot: the host, the food and the road, honest seasonal rates, and WhatsApp with the dates filled in.",
    keywords:
      "homestay website design, homestay website Himachal, homestay website developer, guesthouse website Himachal, homestay website Bir, homestay website Tirthan, homestay website Spiti, Dharamkot homestay website",
    ogTitle: "Homestay websites — the host, the house and the road",
    ogDescription: "For family homestays and guesthouses in Bir, Tirthan, Spiti and Dharamkot. Enquiries land in your WhatsApp with the dates filled in.",
    eyebrow: ["Hospitality", "Homestays · guesthouses · farm stays", "Himachal · India"],
    h1: ["Homestay website", "development."],
    lead: `A homestay in Bir, Tirthan, Spiti or Dharamkot is usually found on Instagram, on Google Maps or in a friend's WhatsApp forward. Then the guest looks for something they can check before they send money to a stranger: the rooms, the food, the family, and whether a car can reach the door. Your own website is that thing. I build homestay websites for Himachal that answer those questions honestly and end in your WhatsApp, with no commission on the booking.`,
    waText: "Hi Divyansh, I want a website for my homestay.",
    topics: ["hotel", "tourism", "himachal"],
    mustHead: "What a homestay website has to do",
    must: [
      { t: "The host, the house, the food", d: "People choose a homestay for the family running it. The site shows who you are, what the house looks like, what's cooked and when, and which room has the view, in your own photographs." },
      { t: "Directions for the last kilometre", d: "Where the road ends, where to park, whether a taxi can reach the door, and how far it is from the bus stand, all as road distances. Guests heading up a valley in the dark read this page twice." },
      { t: "Seasons stated plainly", d: "When the house is open, what the weather does in each month, and what the season is for: paragliding at Bir, trout and the national park in Tirthan, the short summer in Spiti. A closed season says so, instead of taking an enquiry you can't honour." },
      { t: "WhatsApp with the dates filled in", d: "A short form asks for dates, guests and rooms, then opens WhatsApp with the message already written to you. You reply with a price the way you do now; nothing is stored on a server." },
      { t: "Works on one bar of signal", d: "Light pages, AVIF and WebP photographs, no autoplay video. A guest checking the route from a bus on a hill road should still see your phone number in seconds." },
      { t: "Found for the valley, not just the village", d: "Pages for what guests search, such as “homestay in Tirthan valley” or a stay near the Billing take-off, plus a Google Business Profile with the same name, phone and pin as the site." },
    ],
    see: [
      { lead: "Running a hotel, a resort or several properties?", href: "/services/hotel-website-development/", t: "Hotel website development" },
      { lead: "Also arranging pickups and drops for your guests?", href: "/services/taxi-website-development/", t: "Taxi website development" },
    ],
    deepHead: "Four valleys, four kinds of guest",
    deepNote: "Where homestays are",
    deep: [
      { tag: "Bir & Billing", t: "Flyers, students, long stays", d: `Bir's guests come for paragliding from the Billing take-off, the Tibetan colony and its monasteries, and the cafés, and many stay a week or more. A Bir homestay site needs the distance to the landing site, a monthly rate if you offer one, and honest Wi-Fi details. Bir is covered on the <a href="/web-developer-palampur/">Palampur and Bir page</a> too.` },
      { tag: "Tirthan & Jibhi", t: "Rivers, trout and the national park", d: `Tirthan sits at the edge of the Great Himalayan National Park, a UNESCO World Heritage site, and guests come for the river, trout fishing, treks and the drive up to Jalori Pass. What they need first is the road: where to leave the car and how far the walk is. More on the valley on the <a href="/web-developer-kullu/">Kullu page</a>.` },
      { tag: "Spiti", t: "A short season and a long road", d: `Spiti's guests plan weeks ahead around road openings, altitude and the cold. A Spiti homestay site needs the open months, what heating there is, the oxygen and acclimatisation advice guests ask about, and a clear answer on how bookings work when your phone is out of signal. The Himalayan Brothers group's <a href="/projects/hotel-himalayan-brothers/">Spiti Villa, on the Kibber road near Kaza</a>, is on a site I rebuilt.` },
      { tag: "Dharamkot & McLeod Ganj", t: "Backpackers, yoga and Triund", d: `Above McLeod Ganj, Dharamkot's guests stay for courses, cafés and the Triund trek, often booking a few nights and extending. They want the walk from the taxi stand, the room with the kitchen, and a weekly rate. The <a href="/web-developer-dharamshala/">Dharamshala page</a> covers the rest of the area.` },
    ],
    proofHead: "The closest builds",
    proofNote: `There's no single-family homestay in my portfolio yet. These are the builds closest to one: a seven-room hotel whose owner confirms every booking personally on WhatsApp; a five-hotel family group, from Dharamshala to Spiti, where three of the hotels confirm stays on WhatsApp; and a road guide listing 14 stays across five villages on the way over Sach Pass, from a PWD rest house to a seasonal camp.`,
    proof: ["yash-rock-hotel", "hotel-himalayan-brothers", "sach-pass"],
    steps: [
      { t: "One call", d: "How guests find you now, how you confirm a booking, and what they always ask before they come." },
      { t: "Your facts", d: "Rooms, meals, rates by season, the route and the rules of the house, each confirmed by you before it goes up." },
      { t: "Design and build", d: "Your photographs, your family, the road in, and WhatsApp on every screen." },
      { t: "Launch", d: "A Google Business Profile that matches the site, and a short list of what gets a homestay found on Maps." },
    ],
    faqs: [
      { q: "Does a homestay need its own website if it's already on Airbnb or Booking.com?", a: "Yes, if any of your guests find you by name, from a friend, Instagram or Google Maps. Those guests can book you directly with no commission, but only if there's somewhere to check you're real and a way to message you. The listing sites still bring strangers; your site keeps the guests who were already looking for you." },
      { q: "How much does a homestay website cost?", a: `From ${inr(P.hotel)}, the same starting price as a hotel website. The final number depends on the number of rooms and pages and on the photography; I quote fixed and in writing after one call, with no commission and no monthly platform fee.` },
      { q: "Should I put my room rates on the website?", a: "Yes, as a starting rate per season, with “message us for your dates” beside it. A visible price answers the first question a guest has, and saying the price moves with the season and the length of stay is honest. A rate you can't honour does more harm than no rate." },
      { q: "Do I need online payment or a booking engine?", a: "Usually not. With a few rooms that you confirm yourself, WhatsApp is how the booking happens anyway, and an advance can be paid by UPI once you've agreed the dates. A booking engine makes sense when you're managing enough rooms that availability gets confusing." },
      { q: "Can my homestay show up on Google Maps?", a: "Yes, through a Google Business Profile with your homestay's name, pin and phone, backed by a website that says exactly the same things. Reviews from real guests do the rest. I set the site's details and structured data to match your profile so Google treats them as one place." },
      { q: "Can I update photos and rates myself?", a: "Yes. Rates, seasons and rooms sit in one place, so a change shows up on every page that mentions it. If you'd rather not touch it, send the change on WhatsApp." },
    ],
    reading: [
      { href: "/blog/hotel-homestay-website-himachal-direct-bookings/", t: "How to get more direct hotel and homestay bookings in Himachal" },
      { href: "/blog/hotel-near-me-landing-pages/", t: "“Near” pages for a small hotel: ranking for where guests are going" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  travel: {
    slug: "travel-website-development",
    name: "Travel & tour operator website development",
    title: "Travel Agency & Tour Operator Websites in Himachal",
    description:
      "Websites for tour operators and travel agencies in Himachal and India: a page per package, trek and destination, honest prices, and WhatsApp enquiries.",
    keywords:
      "travel agency website development, tour operator website Himachal, travel website design India, tour package website, trekking company website, travel website Dharamshala, travel website Manali",
    ogTitle: "Travel & tour operator websites — a page for every trip",
    ogDescription: "Packages, treks and destinations, each with its own page and an honest price. WhatsApp at the end of every page.",
    eyebrow: ["Travel", "Tour operators · agencies · treks", "Himachal · India"],
    h1: ["Travel website", "development."],
    lead: `Travellers don't search for “travel agency”. They search for a trip: “Spiti tour package”, “Triund trek with guide”, “Himachal honeymoon package”. A travel site wins by having an honest page for each of those searches, with what's included, what it costs and WhatsApp at the end. I've built travel sites for tour operators and agencies from Manali to the Kangra valley, from a 74-page trek and paragliding site to a 158-page tour and taxi site.`,
    waText: "Hi Divyansh, I want a website for my travel business.",
    topics: ["tourism", "webDevelopment", "himachal"],
    mustHead: "What a travel website has to do",
    must: [
      { t: "A page for every package and trek", d: "Each trip gets its own URL, with the days, the route, what's included and what isn't, because that's the level at which people search. Kangra Valley Travels runs 35 tour and yatra packages this way." },
      { t: "Prices you can stand behind", d: "A per-person price on every trek where the operator can commit to one. Dharamshala Tours publishes a price on each of its 12 guided treks, written once and filled in at build time." },
      { t: "Destination guides that sell the trip", d: "Pages for the places themselves, written from what the operator knows on the ground, each linking to the trips that go there." },
      { t: "WhatsApp at the end of every page", d: "The message arrives pre-filled with the trip, and a sticky bar keeps WhatsApp and Call one tap away on a phone. That's where these bookings close anyway." },
      { t: "A redesign that keeps the old links", d: "Leisure Himachal's 2011 site was rebuilt with 71 redirects, worked out from the old sitemap, a live crawl and 74 Wayback captures, so no old link broke." },
      { t: "No thin pages", d: "Growing to a hundred pages is exactly where travel sites go thin. Sunny Himachal Travels' build fails if any two pages read too alike, so pages that would overlap are dropped rather than published." },
    ],
    see: [
      { lead: "Mostly airport pickups and point-to-point taxi routes?", href: "/services/taxi-website-development/", t: "Taxi website development" },
    ],
    proof: ["leisure-himachal", "dharamshala-tours", "himalayan-brothers", "kangra-valley-travels", "sunny-himachal-travels", "sach-pass"],
    steps: [
      { t: "One call", d: "The trips and destinations that actually make money, and how bookings arrive today." },
      { t: "A page map", d: "One page per real search, checked against Search Console and Maps data where the business has any." },
      { t: "Design and build", d: "Fast static pages, WhatsApp on every screen, local business schema and an llms.txt for AI assistants." },
      { t: "Grow it", d: "New trips and seasonal packages added as demand shows up, without duplicating what's already there." },
    ],
    faqs: [
      { q: "What pages should a travel agency website have?", a: "One for each package or trek people book, one for each destination they search for, plus the about page, the FAQ and a contact page. The homepage can't rank for all of those searches by itself." },
      { q: "Do travel websites need online payment?", a: "Usually not in Himachal. Most trips are confirmed on WhatsApp and paid at or after the trip, and a payment gateway adds friction for no gain. It can be added where advance booking genuinely needs a deposit." },
      { q: "How long before a new travel website ranks on Google?", a: "Expect weeks to months, depending on competition and on the Google Business Profile. Sunny Himachal Travels drew 8,695 Google impressions in its first month; Baglamukhi Travels, competing against aggregators and call centres, drew 41.8K impressions and 246 clicks in the 28 days to 3 November 2026." },
      { q: "How much does a travel website cost?", a: `From ${inr(P.travel)}. The final number depends on how many packages, treks and destinations need their own pages; I quote fixed and in writing after one call, and the operator owns the code.` },
      { q: "Can I add new packages myself?", a: "Yes. Sach Pass's family publishes packages, stays and road updates from its own admin, and Nandini Travels' owner adds and edits tour packages behind a password. On Sunny Himachal Travels, trips are plain content files that can be added without touching the design." },
      { q: "Do you only build travel websites in Himachal?", a: "No. The travel sites so far are in Himachal, from Manali to Kangra and the road over Sach Pass, but the same approach works for any operator in India whose customers search by trip and destination." },
    ],
    reading: [
      { href: "/blog/taxi-tour-operator-website-pages/", t: "Taxi and tour operator websites: why every route and town needs its own page" },
      { href: "/blog/rank-on-google-maps-himachal/", t: "How to rank a Himachal taxi or travel business on Google Maps" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },

  taxi: {
    slug: "taxi-website-development",
    name: "Taxi website development",
    title: "Taxi Website Development in Himachal — Routes & Fares",
    description:
      "Taxi websites for Himachal operators: airport pickups, a page per route with the all-in fare, town pages, and WhatsApp booking. Built for five Kangra operators.",
    keywords:
      "taxi website development, taxi website design, taxi service website Himachal, cab booking website, taxi website Kangra, airport taxi website, taxi route pages, Gaggal airport taxi website",
    ogTitle: "Taxi websites — a page for every route, with the fare on it",
    ogDescription: "Airport pickups, route pages with all-in fares, and WhatsApp booking. Built for five taxi operators in the Kangra valley.",
    eyebrow: ["Travel", "Taxi operators · owner-drivers", "Himachal · India"],
    h1: ["Taxi website", "development."],
    lead: `Nobody searches for a taxi company. They search for a route and a price: “Gaggal airport to Dharamshala taxi fare”, “Pathankot to Kangra cab”, “taxi service in Palampur”. A taxi website wins by answering each of those on its own page, with the fare written down, and ending in WhatsApp. I've built taxi websites for five operators in the Kangra valley, most of them owner-drivers up against commission agents and call centres.`,
    waText: "Hi Divyansh, I want a website for my taxi service.",
    topics: ["tourism", "webDevelopment", "himachal"],
    mustHead: "What a taxi website has to do",
    must: [
      { t: "A page for every route you drive", d: "Each route gets its own URL with the road distance, the car and the fare, because that's what people type. Kangra Valley Travels has 49 taxi route pages; Baglamukhi Travels has 67." },
      { t: "The all-in fare, written down", d: "Car, driver, fuel and tolls in one figure, as text on the page, not “call for quote”. Nandini Travels publishes an all-in fare on 15 of its 18 route pages, and the long hauls say “Fare on WhatsApp” until the operator settles them." },
      { t: "Airport and station pickups", d: "Kangra Airport at Gaggal, Pathankot and the railway stations get pages of their own, because flyers search before they land. Shiva Tour and Travel runs from beside the airport." },
      { t: "Town pages for “taxi service in <town>”", d: "Local taxi searches are town by town. Sunny Himachal Travels has nine town pages, each written from what the business is actually booked for in that town." },
      { t: "One fares file", d: "Fares are written once and fill the route cards, the FAQs, the structured data and llms.txt, so the page and Google can never show different prices. On Sunny's site, a build test fails if they ever disagree." },
      { t: "Only facts the driver gave", d: "No fleet that doesn't exist, no ratings nobody gave, no “only 2 cars left” badges. Shiva's build bans fake stats and reviews outright, and Kangra Valley Travels' build fails on any claim the driver hasn't confirmed." },
    ],
    see: [
      { lead: "Selling tour packages, treks and multi-day trips more than transfers?", href: "/services/travel-website-development/", t: "Travel & tour operator websites" },
    ],
    deepHead: "What five taxi sites taught me",
    deepNote: "From the builds",
    deep: [
      { tag: "Publish the fare", t: "The number is what ranks", d: `Baglamukhi Travels launched with ten pages and 27 point-to-point routes, each with an all-in fare on the page, because people type “gaggal airport to dharamshala taxi fare” and a page that says “call for quote” has no number to match. It has since grown to 67 taxi-route pages and 139 in all, and drew 41,829 Google impressions and 246 clicks in the 28 days to 3 November 2026 (client's Search Console). <a href="/projects/baglamukhi-travels/">Read the case study →</a>` },
      { tag: "Visibility isn't bookings", t: "Distance pages and fare pages do different jobs", d: `At least 13,100 of those impressions came from searches like “chandigarh to baglamukhi distance”, which Google answers on the results page, so few people click. Searches with taxi intent were about 650. Distance pages earn visibility; route-and-fare pages earn bookings, so the fare pages get the attention.` },
      { tag: "Fewer, better routes", t: "Fold the routes you don't really drive", d: `After Google's September 2026 spam update, Sunny Himachal Travels folded six routes that never touch the Kangra valley, such as Delhi to Manali, into plain lines on one taxi page with 301 redirects, and kept pages only for the eight that end in or near the valley. <a href="/projects/sunny-himachal-travels/">Read the case study →</a>` },
      { tag: "Measured, not guessed", t: "Road distances from map data", d: `Kangra Valley Travels gives one road distance per route, measured from map data. Drive times vary with the season and the traffic, so the distance is the fact and the time is an estimate. <a href="/projects/kangra-valley-travels/">Read the case study →</a>` },
    ],
    proof: ["baglamukhi-travels", "kangra-valley-travels", "shiva-tour-and-travel", "sunny-himachal-travels", "nandini"],
    steps: [
      { t: "One call", d: "The routes you actually drive, the cars, the fares you'll commit to, and where bookings come from today." },
      { t: "A route map", d: "One page per route people search for, checked against your Google Business Profile and Search Console data where you have any." },
      { t: "Design and build", d: "Route, town and airport pages from one fares file, WhatsApp on every screen, and local business schema." },
      { t: "Grow it", d: "New routes added when you start driving them, and routes that bring nothing folded rather than left thin." },
    ],
    faqs: [
      { q: "What pages should a taxi website have?", a: "One for each route people book, the airport and station pickups, one for each town people search “taxi service in” for, the cars, the FAQ and a contact page. The homepage can't rank for all of those searches by itself." },
      { q: "Should I publish my taxi fares when diesel prices change?", a: "Yes. Publish an all-in fare for the common routes and keep it in one fares file, so a change is one edit that updates every page, the FAQs and the structured data together. A route whose fare you can't commit to can say “Fare on WhatsApp” instead of a guess." },
      { q: "Do I need online booking or payment on a taxi website?", a: "Usually not. Most taxi trips in Himachal are confirmed on WhatsApp and paid to the driver, so a form that writes the trip into a WhatsApp message converts better than a payment page. An advance can be taken by UPI where you need one." },
      { q: "How much does a taxi website cost?", a: `From ${inr(P.travel)}. The final number depends on how many routes, towns and pickups need their own pages; I quote fixed and in writing after one call, and you own the code.` },
      { q: "Will a website help me compete with commission agents?", a: "It gives you a channel you own. Baglamukhi Travels' owners had been on the road since 2018 with no channel they controlled; their site drew 41.8K Google impressions in the 28 days to 3 November 2026, and a traveller who finds it books them directly, not through an agent." },
      { q: "Can I add a new route myself?", a: "A route is one entry in the fares file plus a few lines about the road, so it can be added without touching the design. If you'd rather not edit anything, send the route and fare on WhatsApp." },
    ],
    reading: [
      { href: "/blog/taxi-tour-operator-website-pages/", t: "Taxi and tour operator websites: why every route and town needs its own page" },
      { href: "/blog/rank-on-google-maps-himachal/", t: "How to rank a Himachal taxi or travel business on Google Maps" },
      { href: "/blog/google-business-profile-vs-website-himachal/", t: "Google Business Profile vs a website for Himachal businesses" },
    ],
  },
};

export const VERTICAL_LIST = Object.values(VERTICALS);
export const verticalWa = (v) => wa(v.waText);

/* ===========================================================================
   Contact links: the booking, WhatsApp and email targets. Re-exported by
   site.mjs; imported directly by browser scripts (src/scripts/contact-form.js)
   and the API routes so the client bundle doesn't pull in all of site.mjs.
   This is the ONE place to change them: when the Calendly slug is renamed,
   change CALENDLY_URL here and in public/llms.txt + public/llms-full.txt.
   =========================================================================== */

/* The booked event is 30 minutes (owner, 2026-11-16): every CTA reads
   "Book a 30-min call". The slug stays until the owner renames it. */
export const CALENDLY_URL = "https://calendly.com/sood-divyansh007/30min";

export const WHATSAPP_URL = "https://wa.me/919816091875";

export const CONTACT_EMAIL = "hello@divyanshsood.com";

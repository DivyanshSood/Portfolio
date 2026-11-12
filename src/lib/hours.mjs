/* ===========================================================================
   Studio opening hours. Re-exported by site.mjs; imported directly by the
   browser scripts (chrome.js, ChatWidget) so their bundles stay small.
   =========================================================================== */

/* Opening hours — the SINGLE source for the JSON-LD openingHoursSpecification,
   the footer line, the "Online now" indicator (src/scripts/chrome.js) and the
   reply-window wording. They must match the Business Profile exactly: every
   day, 6 AM to 1 AM IST (owner, 2026-11-13). `closes` past midnight is written
   as the next morning's time, as Google's LocalBusiness docs do.
   If the Business Profile hours change, change them here and in public/llms*.txt. */
export const STUDIO_HOURS = {
  opens: "06:00",
  closes: "01:00",
  openHour: 6, // first hour that counts as online (IST)
  closeHour: 1, // first hour that counts as offline (IST); < openHour means past midnight
  label: "6 AM–1 AM IST",
  opensLabel: "6 AM", // shown after hours: "Replies from 6 AM IST"
  labelLong: "every day, 6 AM to 1 AM IST",
};

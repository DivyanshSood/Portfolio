/* ===========================================================================
   The optional "Phone / WhatsApp" field on the brief forms. One rule, used in
   three places so they can't drift:
     - PHONE_PATTERN  the input's HTML `pattern` (checked by the browser even
                      when JavaScript never loads, i.e. on the no-JS POST path)
     - cleanPhone()   src/scripts/contact-form.js before sending, and
                      src/pages/api/contact.ts before the number goes in an email
   Accepts what people actually type: "+91 98160 91875", "098160-91875",
   "(01892) 26 5000". Digits, spaces, + ( ) . - only; 6 to 15 digits (the
   E.164 maximum); 30 characters at most.
   =========================================================================== */

// Escaped so it compiles under the `v` flag browsers now use for `pattern`.
export const PHONE_PATTERN = "\\+?[0-9 \\(\\)\\.\\-]{6,30}";

const PHONE_RE = /^\+?[0-9 ().-]{6,30}$/;

/**
 * "" for an empty field, the trimmed number when it passes, or null when it
 * doesn't (wrong characters, too long, too few or too many digits).
 * @param {unknown} raw
 * @returns {string | null}
 */
export function cleanPhone(raw) {
  const s = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (!PHONE_RE.test(s)) return null;
  const digits = s.replace(/\D/g, "").length;
  return digits >= 6 && digits <= 15 ? s : null;
}

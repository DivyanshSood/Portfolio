import type { APIRoute } from "astro";

// Serverless lead capture. Runs on demand on Vercel (not prerendered).
// Env vars (set in Vercel project settings):
//   RESEND_API_KEY  — required to actually send mail
//   CONTACT_TO      — where leads are delivered (default hello@divyanshsood.com)
//   CONTACT_FROM    — verified Resend sender (default onboarding@resend.dev for testing)
//
// Every form on the site POSTs here via src/scripts/contact-form.js; when
// RESEND_API_KEY is unset we return {ok:false, reason:"not_configured"} and the
// client falls back to opening the visitor's mail client (mailto:).
export const prerender = false;

import { clientIp, json, originAllowed, rateLimiter } from "../../lib/api-guard";

// Five sends per ten minutes and twenty a day per IP: generous for a person
// fixing a typo, useless for flooding the inbox or the Resend quota.
const allow = rateLimiter(5, 10 * 60_000, 20);

// Subjects per form id, so an audit request and a project brief can be told
// apart in the inbox. Unknown ids get the generic subject.
const SUBJECTS: Record<string, string> = {
  "ds-audit-form": "Free website audit request",
  "ds-start-form": "New project enquiry",
};

const EMAIL_RE = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;
// Line breaks and control characters out of anything that lands in a header.
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  // Only our own pages may post here (see src/lib/api-guard.ts), and only as
  // JSON: a text/plain body is what a cross-site form post without a CORS
  // preflight would send.
  if (!originAllowed(request)) return json({ ok: false, error: "forbidden" }, 403);
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }
  if (!allow(clientIp(request, ctx))) return json({ ok: false, error: "rate_limited" }, 429);

  let data: Record<string, unknown> = {};
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  // Honeypot — real visitors never see the field, so any value means a bot.
  // Answer ok:true so the bot believes it succeeded and moves on, and log it,
  // so a real lead lost to browser autofill would at least leave a trace.
  if (String(data.hp ?? "").trim()) {
    console.warn("[contact] Honeypot filled; send skipped");
    return json({ ok: true }, 200);
  }

  const name = oneLine(String(data.name ?? "")).slice(0, 200);
  const rawEmail = oneLine(String(data.email ?? "")).slice(0, 320);
  // An address that won't validate still reaches the inbox in the body, but
  // isn't used as reply_to, where Resend would reject the whole send.
  const email = EMAIL_RE.test(rawEmail) ? rawEmail : "";
  const message = String(data.message ?? "").trim().slice(0, 5000);
  const subjectBase = SUBJECTS[String(data.form ?? "")] ?? "New enquiry";

  if (!rawEmail && !message) {
    return json({ ok: false, error: "empty" }, 422);
  }

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — caller should fall back to WhatsApp.
    return json({ ok: false, reason: "not_configured" }, 200);
  }

  const to = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? "hello@divyanshsood.com";
  const from =
    import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? "Studio <onboarding@resend.dev>";

  const text = [
    "New project enquiry — divyanshsood.com",
    name && `Name: ${name}`,
    rawEmail && `Email: ${rawEmail}${email ? "" : " (did not validate)"}`,
    message && `Project: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `${subjectBase}${name ? ` — ${name}` : ""}`,
        reply_to: email || undefined,
        text,
      }),
    });
    if (!res.ok) {
      // Resend explains every rejection in the response body ("domain is not
      // verified", "invalid api key", …). This used to be discarded, which made
      // a failed send indistinguishable from any other and left no way to tell
      // a bad key from an unverified sender without guessing.
      //
      // Full detail goes to the server log (Vercel → the function's Logs tab).
      // The browser gets the HTTP status only: enough to diagnose (401 key,
      // 403 permission, 422 sender/validation) without putting a provider's
      // internals in front of a visitor.
      const detail = await res.text().catch(() => "");
      console.error(`[contact] Resend rejected the send: ${res.status} ${detail}`);
      return json({ ok: false, error: "send_failed", status: res.status }, 502);
    }
    return json({ ok: true }, 200);
  } catch (e) {
    console.error("[contact] Could not reach Resend:", e);
    return json({ ok: false, error: "send_error" }, 502);
  }
};

// Only POST is meaningful here. Without a catch-all, a crawler's GET or HEAD
// hit an unexported method and the function crashed with a 500
// (FUNCTION_INVOCATION_FAILED) — a server error that slows crawl rate. ALL
// covers every method not exported above, so those now get a clean 405.
export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });

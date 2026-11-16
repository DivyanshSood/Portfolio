import type { APIRoute } from "astro";

// Serverless lead capture. Runs on demand on Vercel (not prerendered).
// Env vars (set in Vercel project settings):
//   RESEND_API_KEY  — required to actually send mail
//   CONTACT_TO      — where leads are delivered (default hello@divyanshsood.com)
//   CONTACT_FROM    — verified Resend sender (default onboarding@resend.dev for testing)
//
// Two ways in, one set of guards (origin, rate limit, honeypot):
//
// 1. JSON, from src/scripts/contact-form.js — the normal path. Answers JSON;
//    when RESEND_API_KEY is unset it returns {ok:false, reason:"not_configured"}
//    and the script falls back to opening the visitor's mail client (mailto:).
//
// 2. A plain HTML form post (application/x-www-form-urlencoded or
//    multipart/form-data), when the script never loaded: slow 3G, a blocker,
//    JS off. Answers with a 303 to /thanks/ on success, or to
//    /thanks/?status=error (which offers email and WhatsApp) on any failure.
//    A successful send also sets a short-lived HttpOnly cookie that /thanks/
//    reads once to count the lead (generate_lead, source form_fallback), so a
//    reload or a hand-typed /thanks/ URL counts nothing. The JSON path never
//    redirects, so a lead is never counted twice.
export const prerender = false;

import { clientIp, json, originAllowed, rateLimiter } from "../../lib/api-guard";
import { cleanPhone } from "../../lib/phone.mjs";
import { CONTACT_EMAIL } from "../../lib/contact-links.mjs";

// Five sends per ten minutes and twenty a day per IP: generous for a person
// fixing a typo, useless for flooding the inbox or the Resend quota.
const allow = rateLimiter(5, 10 * 60_000, 20);

// Subjects per form id, so an audit request and a project brief can be told
// apart in the inbox. Unknown ids get the generic subject.
const SUBJECTS: Record<string, string> = {
  "ds-audit-form": "Free website audit request",
  "ds-start-form": "New project enquiry",
};

// Field names a plain form post may carry besides name/email/phone, in the
// order they're written into the email. The `name` attributes in
// src/pages/index.astro and src/pages/website-audit.astro must match.
const FORM_FIELDS: [string, string][] = [
  ["url", "Site URL"],
  ["company", "Company / site"],
  ["need", "Need"],
  ["stage", "Stage"],
  ["timeline", "Timeline"],
  ["goal", "Goal"],
  ["brief", "Details"],
];

// Read once by src/pages/thanks.astro (same name there).
const SENT_COOKIE = "ds_sent";

const EMAIL_RE = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;
// Line breaks and control characters out of anything that lands in a header.
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

type Enquiry = { name: string; email: string; phone: string; message: string; hp: string; form: string; via: "json" | "form" };
type Outcome = { status: number; body: Record<string, unknown> };

async function readJson(request: Request): Promise<Enquiry | null> {
  try {
    const d = (await request.json()) as Record<string, unknown>;
    if (!d || typeof d !== "object") return null;
    return {
      name: String(d.name ?? ""),
      email: String(d.email ?? ""),
      phone: String(d.phone ?? ""),
      message: String(d.message ?? ""),
      hp: String(d.hp ?? ""),
      form: String(d.form ?? ""),
      via: "json",
    };
  } catch {
    return null;
  }
}

async function readForm(request: Request): Promise<Enquiry | null> {
  try {
    const fd = await request.formData();
    // Strings only: a File (from a crafted multipart body) is ignored.
    const get = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v.trim().slice(0, 2000) : "";
    };
    const message = FORM_FIELDS.map(([k, label]) => (get(k) ? `${label}: ${get(k)}` : ""))
      .filter(Boolean)
      .join("\n");
    return { name: get("name"), email: get("email"), phone: get("phone"), message, hp: get("hp_x"), form: get("form"), via: "form" };
  } catch {
    return null;
  }
}

async function send(e: Enquiry): Promise<Outcome> {
  const name = oneLine(e.name).slice(0, 200);
  const rawEmail = oneLine(e.email).slice(0, 320);
  // An address that won't validate still reaches the inbox in the body, but
  // isn't used as reply_to, where Resend would reject the whole send.
  const email = EMAIL_RE.test(rawEmail) ? rawEmail : "";
  // Optional. Same rule as the input's `pattern` and the client script.
  const phone = cleanPhone(oneLine(e.phone));
  if (phone === null) return { status: 422, body: { ok: false, error: "invalid_phone" } };
  const message = e.message.trim().slice(0, 5000);
  const subjectBase = SUBJECTS[e.form] ?? "New enquiry";

  if (!rawEmail && !message && !phone) return { status: 422, body: { ok: false, error: "empty" } };

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  // Not configured yet — the caller falls back to mailto / WhatsApp.
  if (!apiKey) return { status: 200, body: { ok: false, reason: "not_configured" } };

  const to = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? CONTACT_EMAIL;
  const from =
    import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? "Studio <onboarding@resend.dev>";

  const text = [
    "New project enquiry — divyanshsood.com",
    name && `Name: ${name}`,
    rawEmail && `Email: ${rawEmail}${email ? "" : " (did not validate)"}`,
    phone && `Phone / WhatsApp: ${phone}`,
    message && `Project: ${message}`,
    e.via === "form" && "(Sent without JavaScript, through the form fallback.)",
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
      return { status: 502, body: { ok: false, error: "send_failed", status: res.status } };
    }
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error("[contact] Could not reach Resend:", err);
    return { status: 502, body: { ok: false, error: "send_error" } };
  }
}

/** The no-JS answer: a 303 (POST → GET) to the thank-you or the error page. */
function redirect(request: Request, ok: boolean, form = "") {
  const headers = new Headers({ Location: ok ? "/thanks/" : "/thanks/?status=error", "Cache-Control": "no-store" });
  if (ok && form) {
    const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
    const value = form.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "form";
    headers.append("Set-Cookie", `${SENT_COOKIE}=${value}; Path=/thanks/; Max-Age=300; HttpOnly; SameSite=Lax${secure}`);
  }
  return new Response(null, { status: 303, headers });
}

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  const type = (request.headers.get("content-type") ?? "").toLowerCase();
  const isJson = type.startsWith("application/json");
  const isForm = type.startsWith("application/x-www-form-urlencoded") || type.startsWith("multipart/form-data");

  // Only our own pages may post here (see src/lib/api-guard.ts). Browsers
  // attach Origin to form posts as well as fetches, so a form on another site
  // is refused exactly like a cross-site fetch. text/plain, which no page of
  // ours sends, stays refused.
  if (!originAllowed(request)) {
    return isForm
      ? new Response("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } })
      : json({ ok: false, error: "forbidden" }, 403);
  }
  if (!isJson && !isForm) return json({ ok: false, error: "unsupported_media_type" }, 415);
  if (!allow(clientIp(request, ctx))) {
    return isForm ? redirect(request, false) : json({ ok: false, error: "rate_limited" }, 429);
  }

  const enquiry = isJson ? await readJson(request) : await readForm(request);
  if (!enquiry) return isForm ? redirect(request, false) : json({ ok: false, error: "invalid_body" }, 400);

  // Honeypot — real visitors never see the field, so any value means a bot.
  // Answer as a success so the bot believes it worked and moves on (with no
  // lead cookie, so nothing is counted), and log it, so a real lead lost to
  // browser autofill would at least leave a trace.
  if (enquiry.hp.trim()) {
    console.warn("[contact] Honeypot filled; send skipped");
    return isForm ? redirect(request, true) : json({ ok: true }, 200);
  }

  const outcome = await send(enquiry);
  if (isForm) return redirect(request, outcome.body.ok === true, enquiry.form);
  return json(outcome.body, outcome.status);
};

// Only POST is meaningful here. Without a catch-all, a crawler's GET or HEAD
// hit an unexported method and the function crashed with a 500
// (FUNCTION_INVOCATION_FAILED) — a server error that slows crawl rate. ALL
// covers every method not exported above, so those now get a clean 405.
export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } });

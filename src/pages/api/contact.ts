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

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown> = {};
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  // Honeypot — real visitors never see the field, so any value means a bot.
  // Answer ok:true so the bot believes it succeeded and moves on.
  if (String(data.hp ?? "").trim()) {
    return json({ ok: true }, 200);
  }

  const name = String(data.name ?? "").trim().slice(0, 200);
  const email = String(data.email ?? "").trim().slice(0, 320);
  const message = String(data.message ?? "").trim().slice(0, 5000);

  if (!email && !message) {
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
    email && `Email: ${email}`,
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
        subject: `New enquiry${name ? ` — ${name}` : ""}`,
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

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

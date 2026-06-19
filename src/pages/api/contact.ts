import type { APIRoute } from "astro";

// Serverless lead capture. Runs on demand on Vercel (not prerendered).
// Env vars (set in Vercel project settings):
//   RESEND_API_KEY  — required to actually send mail
//   CONTACT_TO      — where leads are delivered (default hello@divyanshsood.com)
//   CONTACT_FROM    — verified Resend sender (default onboarding@resend.dev for testing)
//
// NOTE: the homepage form currently submits via WhatsApp. This endpoint is wired
// and ready; flip the form to POST here once the Resend domain is verified.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown> = {};
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  const newSite = Boolean(data.newSite);

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
    newSite ? "Wants a brand-new website." : "",
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
      return json({ ok: false, error: "send_failed" }, 502);
    }
    return json({ ok: true }, 200);
  } catch {
    return json({ ok: false, error: "send_error" }, 502);
  }
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

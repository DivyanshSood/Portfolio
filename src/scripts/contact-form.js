/* ===========================================================================
   Contact-form handler — used by every form on the site (homepage contact,
   /website-audit, /start). Submits to /api/contact (Resend-backed); falls
   back to opening the user's mail client with the same payload if Resend
   isn't configured yet, so the form never goes dead during setup.
   =========================================================================== */

const CONTACT_EMAIL = "hello@divyanshsood.com";
const WHATSAPP_URL = "https://wa.me/919816091875";
const CALENDLY_URL = "https://calendly.com/divyanshsood/intro-call";

// Field definitions per form. Label is shown in the email body; id is the
// input element id. Set `isEmail: true` to require + validate. `type` defaults
// to text; set `type: 'checkbox'` for boolean fields.
const FORMS = {
  "ds-contact-form": {
    subject: "New project enquiry — divyanshsood.com",
    success: "Thanks — message sent. I'll reply personally within a couple of hours.",
    fields: [
      { id: "cf-name", label: "Name" },
      { id: "cf-email", label: "Email", isEmail: true },
      { id: "cf-msg", label: "Project" },
      { id: "cf-new", label: "Needs a brand-new website", type: "checkbox" },
    ],
  },
  "ds-audit-form": {
    subject: "Free website audit request",
    success: "Got it — I'll record your free audit and email it back within 3–4 days.",
    fields: [
      { id: "au-url", label: "Site URL" },
      { id: "au-email", label: "Email", isEmail: true },
      { id: "au-goal", label: "Goal" },
    ],
  },
  "ds-start-form": {
    subject: "New project enquiry (start form)",
    success: "Sent. I'll reply within a couple of hours with a clear next step.",
    fields: [
      { id: "st-name", label: "Name" },
      { id: "st-email", label: "Email", isEmail: true },
      { id: "st-company", label: "Company / site" },
      { id: "st-type", label: "Need" },
      { id: "st-budget", label: "Budget (USD)" },
      { id: "st-timeline", label: "Timeline" },
      { id: "st-msg", label: "Details" },
    ],
  },
};

function val(id) {
  const el = document.getElementById(id);
  if (!el) return "";
  if (el.type === "checkbox") return el.checked;
  return el.value.trim();
}

function collect(config) {
  const data = {};
  for (const f of config.fields) data[f.id] = val(f.id);
  return data;
}

function buildMessage(data, config) {
  const lines = [];
  for (const f of config.fields) {
    const v = data[f.id];
    if (f.type === "checkbox") {
      if (v) lines.push(f.label + ": yes");
    } else if (v) {
      lines.push(`${f.label}: ${v}`);
    }
  }
  return lines.join("\n");
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

function openMailto(data, config) {
  const nameField = config.fields.find((f) => /name/i.test(f.label) && f.type !== "checkbox");
  const name = nameField ? data[nameField.id] : "";
  const subject = encodeURIComponent(config.subject + (name ? " — " + name : ""));
  const body = encodeURIComponent(buildMessage(data, config) + "\n\n— sent from the website contact form");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function showSuccess(form, msg, usedFallback) {
  form.style.display = "none";
  const wrap = document.createElement("div");
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  wrap.style.cssText =
    "padding:26px 24px;border:1px solid rgba(255,255,255,.18);border-radius:10px;" +
    "background:linear-gradient(180deg,rgba(255,70,18,.12),transparent);margin-top:16px;";
  wrap.innerHTML =
    `<div style="font-weight:800;font-size:18px;margin:0 0 8px;color:var(--accent,#ff4612);">✓ ${msg}</div>` +
    (usedFallback
      ? `<p style="margin:8px 0 0;font-family:'Space Mono',monospace;font-size:12px;line-height:1.6;opacity:.78;">Didn't open? Email me directly: <a href="mailto:${CONTACT_EMAIL}" style="color:var(--accent,#ff4612);text-decoration:underline;">${CONTACT_EMAIL}</a></p>`
      : `<p style="margin:8px 0 0;font-family:'Space Mono',monospace;font-size:12px;line-height:1.6;opacity:.78;">Prefer to talk now? <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color:var(--accent,#ff4612);text-decoration:underline;">WhatsApp me ↗</a> · <a href="${CALENDLY_URL}" target="_blank" rel="noopener" style="color:var(--accent,#ff4612);text-decoration:underline;">book a 15-min call ↗</a></p>`);
  form.parentNode.insertBefore(wrap, form.nextSibling);
}

function showError(form, msg) {
  // Inline error — doesn't hide the form so the user can retry.
  let err = form.parentNode.querySelector(".ds-form-error");
  if (!err) {
    err = document.createElement("div");
    err.className = "ds-form-error";
    err.style.cssText =
      "margin-top:14px;padding:12px 14px;border:1px solid rgba(255,70,18,.35);" +
      "border-radius:6px;font-family:'Space Mono',monospace;font-size:12px;" +
      "color:var(--accent,#ff4612);background:rgba(255,70,18,.06);";
    form.appendChild(err);
  }
  err.textContent = msg;
}

async function submit(form, config) {
  const data = collect(config);

  // Client-side validation.
  const emailField = config.fields.find((f) => f.isEmail);
  if (emailField && !isValidEmail(data[emailField.id])) {
    showError(form, "Please enter a valid email so I can reply.");
    return;
  }
  const msg = buildMessage(data, config);
  if (!msg) {
    showError(form, "Tell me a bit about your project first.");
    return;
  }

  // Best-effort: POST to /api/contact. If Resend isn't configured, the
  // endpoint returns 200 with {ok:false, reason:'not_configured'} — we then
  // fall back to opening the user's mail client with the same payload.
  const nameField = config.fields.find((f) => /name/i.test(f.label) && f.type !== "checkbox");
  const name = nameField ? data[nameField.id] : "";

  let usedFallback = false;
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "Website enquiry",
        email: emailField ? data[emailField.id] : "",
        message: msg,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (json && json.ok) {
      showSuccess(form, config.success, false);
      return;
    }
    if (json && json.reason === "not_configured") {
      usedFallback = true;
    } else {
      usedFallback = true;
    }
  } catch (_e) {
    usedFallback = true;
  }

  // Fallback: open the user's mail client.
  openMailto(data, config);
  showSuccess(
    form,
    usedFallback
      ? "Opening your email client — if nothing happens, email me at " + CONTACT_EMAIL + "."
      : config.success,
    usedFallback
  );
}

export default function initContactForms() {
  for (const formId of Object.keys(FORMS)) {
    const form = document.getElementById(formId);
    if (!form) continue;
    const config = FORMS[formId];
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submit(form, config);
    });
  }
}

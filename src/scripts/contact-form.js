/* ===========================================================================
   Contact-form handler — used by every form on the site (/website-audit's
   free-audit + start-a-project forms). Submits to /api/contact (Resend-backed);
   falls back to opening the user's mail client with the same payload if Resend
   isn't configured yet, so the form never goes dead during setup.
   =========================================================================== */

const CONTACT_EMAIL = "hello@divyanshsood.com";
const WHATSAPP_URL = "https://wa.me/919816091875";
const CALENDLY_URL = "https://calendly.com/sood-divyansh007/30min";

// Field definitions per form. Label is shown in the email body; id is the
// input element id. Set `isEmail: true` to require + validate. `type` defaults
// to text; set `type: 'checkbox'` for boolean fields. `hp` is the form's hidden
// honeypot input — humans never see it, so a value means a bot.
const FORMS = {
  "ds-audit-form": {
    subject: "Free website audit request",
    success: "Got it — I'll record your free audit and email it back within 3–4 days.",
    hp: "au-hp",
    fields: [
      { id: "au-url", label: "Site URL" },
      { id: "au-email", label: "Email", isEmail: true },
      { id: "au-goal", label: "Goal" },
    ],
  },
  "ds-start-form": {
    subject: "New project enquiry (start form)",
    success: "Brief received. Expect a personal reply within two hours, 9 AM–9 PM IST.",
    hp: "st-hp",
    fields: [
      { id: "st-name", label: "Name" },
      { id: "st-email", label: "Email", isEmail: true },
      { id: "st-company", label: "Company / site" },
      { id: "st-type", label: "Need" },
      { id: "st-stage", label: "Stage" },
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

// Fires a conversion event via window.dsTrack (BaseScripts.astro); a silent
// no-op when analytics are blocked or on localhost.
function track(name, params) {
  try {
    if (typeof window.dsTrack === "function") window.dsTrack(name, params);
  } catch (_e) {}
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Success state — the Home design's "Box, box." block (.form-done in
// src/styles/brand.css).
function showSuccess(form, msg, usedFallback) {
  // On the mailto fallback keep the form visible so the visitor can retry or
  // copy their message — mailto silently fails on machines with no mail app.
  if (!usedFallback) form.hidden = true;
  form.parentNode.querySelector(".form-done")?.remove();
  form.querySelector(".form-err")?.remove();
  const wrap = document.createElement("div");
  wrap.className = "form-done";
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  wrap.innerHTML = usedFallback
    ? `<p>${esc(msg)}</p>`
    : `<div class="form-done-h">Box, box.</div><p>${esc(msg)}</p>` +
      `<p class="form-done-alt"><a href="${WHATSAPP_URL}">WhatsApp ↗</a> <a href="${CALENDLY_URL}">Book a 15-min call ↗</a></p>`;
  form.parentNode.insertBefore(wrap, form.nextSibling);
}

function showError(form, msg) {
  // Inline error — doesn't hide the form so the user can retry.
  let err = form.querySelector(".form-err");
  if (!err) {
    err = document.createElement("p");
    err.className = "form-err";
    err.setAttribute("role", "alert");
    form.appendChild(err);
  }
  err.textContent = msg;
}

async function submit(form, config) {
  const data = collect(config);

  // Honeypot: hidden field only bots fill in. Pretend success, send nothing.
  if (config.hp && val(config.hp)) {
    showSuccess(form, config.success, false);
    return;
  }

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

  try {
    // Trailing slash is required: site-wide trailingSlash:"always" means the
    // bare "/api/contact" 308s here anyway — posting straight to the canonical
    // path saves every submission a redirect round-trip.
    const res = await fetch("/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "Website enquiry",
        email: emailField ? data[emailField.id] : "",
        message: msg,
        hp: config.hp ? val(config.hp) : "",
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (json && json.ok) {
      track("form_submit", { form: form.id });
      try {
        if (typeof window.dsLead === "function") window.dsLead("form", { form: form.id, page_path: location.pathname });
      } catch (_e) {}
      showSuccess(form, config.success, false);
      return;
    }
  } catch (_e) {
    /* fall through to mailto */
  }

  // Fallback: open the user's mail client.
  track("form_mailto_fallback", { form: form.id });
  openMailto(data, config);
  showSuccess(
    form,
    "Opening your email client — if nothing happens, email me at " + CONTACT_EMAIL + ".",
    true
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

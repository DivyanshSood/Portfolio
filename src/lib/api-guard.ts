/* ===========================================================================
   Shared guards for the two serverless endpoints (src/pages/api/contact.ts and
   src/pages/api/chat.ts).

   1. Origin check. Browsers attach an Origin header to every POST, including
      same-origin fetches, so a POST without one, or from another site, is not
      our own page calling. That stops other websites from making their
      visitors' browsers post to our endpoints. A script can forge the header;
      the rate limit below and a Vercel Firewall rule are what handle scripts.
      Preview deployments are allowed by exact host, read from the Vercel
      system variables at runtime, not by trusting all of *.vercel.app (any
      Vercel customer's site lives there).

   2. Per-IP rate limit, in memory. Vercel runs several instances and recycles
      them, so this is best effort: it stops one tab hammering an endpoint,
      not a determined attacker. For a hard limit, add a Vercel Firewall
      rate-limit rule on /api/chat and /api/contact.
   =========================================================================== */

const OWN_HOSTS = /(^|\.)divyanshsood\.com$|^localhost$|^127\.0\.0\.1$/;

function hostAllowed(host: string) {
  if (OWN_HOSTS.test(host)) return true;
  const deployHosts = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL];
  return deployHosts.some((h) => h && h === host);
}

/** True when the request's Origin header names one of our own hosts. */
export function originAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return hostAllowed(new URL(origin).hostname);
  } catch {
    return false;
  }
}

/** The caller's IP as Vercel reports it. */
export function clientIp(request: Request, ctx: { clientAddress: string }) {
  const fromHeaders =
    request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (fromHeaders) return fromHeaders;
  // Reading ctx.clientAddress throws when the adapter can't supply it.
  try {
    return ctx.clientAddress || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * A per-IP limiter: at most `perShort` hits per `shortMs` and `perDay` per day.
 * Old entries are pruned on every call, and only IPs with no hit in the last
 * day are evicted, so a long-lived instance can't grow without bound and a
 * flood of new IPs can't reset everyone else's count.
 */
export function rateLimiter(perShort: number, shortMs: number, perDay: number) {
  const hits = new Map<string, number[]>();
  const DAY = 86_400_000;
  return function allow(ip: string) {
    const now = Date.now();
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] >= DAY) hits.delete(k);
    }
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < DAY);
    if (recent.length >= perDay || recent.filter((t) => now - t < shortMs).length >= perShort) {
      hits.set(ip, recent);
      return false;
    }
    recent.push(now);
    hits.set(ip, recent);
    return true;
  };
}

export function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

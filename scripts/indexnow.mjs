/* ===========================================================================
   IndexNow ping — runs automatically after `astro build` (npm `postbuild`).
   Notifies Bing, Yandex, Seznam, Naver (and the engines that use Bing's index:
   DuckDuckGo, Yahoo, Ecosia) the instant a production deploy ships. Google does
   NOT use IndexNow — this is purely the "everything-but-Google" channel.

   KEY must match the file served at https://www.divyanshsood.com/<KEY>.txt
   (see public/72bab8f7901e77a9a97b73fafc974aa2.txt).

   Guarded so it ONLY fires on Vercel production builds — local builds and
   preview deploys are skipped. Failures never break the deploy.
   =========================================================================== */
import { readdir, readFile } from "node:fs/promises";

const KEY = "72bab8f7901e77a9a97b73fafc974aa2";
const HOST = "www.divyanshsood.com";
// IndexNow is a shared protocol — submitting to one participating endpoint is
// meant to fan out to the rest. In practice Bing's shared endpoint
// (api.indexnow.org) can return 403 UserForbiddedToAccessSite until the domain
// is verified for IndexNow in Bing Webmaster Tools, which would silently block
// the whole channel. So we hit Yandex directly too (it accepts today) — every
// submission is idempotent, so double-pinging is harmless.
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://yandex.com/indexnow",
];

if (process.env.VERCEL_ENV !== "production") {
  console.log("[indexnow] skipped — not a Vercel production build");
  process.exit(0);
}

try {
  const dir = new URL("../dist/client/", import.meta.url);
  const files = (await readdir(dir)).filter((f) => /^sitemap-\d+\.xml$/.test(f));

  const urls = [];
  for (const f of files) {
    const xml = await readFile(new URL(f, dir), "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
  }

  if (urls.length === 0) {
    console.log("[indexnow] no URLs found in sitemap — nothing to submit");
    process.exit(0);
  }

  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  });

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
      });
      const host = new URL(endpoint).host;
      // 200/202 = accepted. 403 from Bing usually means the domain isn't yet
      // verified for IndexNow in Bing Webmaster Tools — a one-time setup, not a
      // code bug. Log it clearly but keep going / never fail the build.
      const note = res.status === 403 ? " (verify the site for IndexNow in Bing Webmaster Tools)" : "";
      console.log(`[indexnow] ${host}: submitted ${urls.length} URLs → HTTP ${res.status}${note}`);
    } catch (err) {
      console.warn(`[indexnow] ${endpoint} ping failed (non-fatal): ${err?.message ?? err}`);
    }
  }
} catch (err) {
  // Never fail the build over a ping problem.
  console.warn(`[indexnow] ping failed (non-fatal): ${err?.message ?? err}`);
}

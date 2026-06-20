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
const ENDPOINT = "https://api.indexnow.org/indexnow";

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

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  console.log(`[indexnow] submitted ${urls.length} URLs → HTTP ${res.status}`);
} catch (err) {
  // Never fail the build over a ping problem.
  console.warn(`[indexnow] ping failed (non-fatal): ${err?.message ?? err}`);
}

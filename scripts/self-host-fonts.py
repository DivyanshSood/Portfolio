#!/usr/bin/env python3
"""Self-host Google Fonts: parse the latin subset URLs and download WOFF2 files
using the system curl (urllib's cert chain is broken on some macOS Pythons).

Why: removes a render-blocking third-party request and a privacy leak
(IP address sent to fonts.googleapis.com before page paint).

VARIABLE FONTS: for a variable family, Google returns the SAME woff2 file for
every weight you request — it just varies the `font-weight` in the CSS. Asking
for Archivo at 400/500/600/700/800/900 therefore downloaded six byte-identical
34KB files, and JetBrains Mono at 400/500 downloaded two. That was 206KB of
pure duplication shipped to every visitor.

So each entry below declares whether the family is variable. Variable families
download once to `<stem>.woff2` and get a single @font-face with a weight
RANGE; static families keep the per-weight `<stem>-<w>.woff2` form.
"""

import re
import subprocess
import sys
from pathlib import Path

OUT_DIR = Path("public/fonts")
OUT_DIR.mkdir(parents=True, exist_ok=True)

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/120.0.0.0 Safari/537.36")

# (URL-safe family, CSS display name, filename stem, weights we use, variable?)
# `variable=True` means one file serves every weight in the list — see the
# module docstring. Only add a family here if the site actually uses it.
FONTS = [
    ("Archivo", "Archivo", "archivo", [400, 500, 600, 700, 800, 900], True),
    ("Anton", "Anton", "anton", [400], False),
    ("JetBrains+Mono", "JetBrains Mono", "jetbrains-mono", [400, 500], True),
]

parts = ["family=" + urlfam + ":wght@" + ";".join(str(w) for w in ws)
         for urlfam, _, _, ws, _var in FONTS]
url = "https://fonts.googleapis.com/css2?" + "&".join(parts) + "&display=swap"
print("Fetching:", url)

css_path = Path("/tmp/ds-gfonts.css")
subprocess.run(
    ["curl", "-sS", "-A", UA, url, "-o", str(css_path)],
    check=True,
)
css = css_path.read_text("utf-8")

blocks = re.split(r"@font-face\s*\{", css)[1:]
keep = {}
for b in blocks:
    fam = re.search(r"font-family:\s*'([^']+)'", b).group(1)
    wt = int(re.search(r"font-weight:\s*(\d+)", b).group(1))
    rng = re.search(r"unicode-range:\s*([^;]+);", b).group(1).strip()
    src = re.search(r"src:\s*url\(([^)]+)\)", b).group(1)
    if rng.startswith("U+0000-00FF"):
        keep[(fam, wt)] = src

def fetch(font_url, out):
    subprocess.run(["curl", "-sS", "-A", UA, font_url, "-o", str(out)], check=True)
    return (str(out), out.stat().st_size)


def url_for(fam_disp, w):
    if (fam_disp, w) not in keep:
        print(f"!! missing: {fam_disp} {w}", file=sys.stderr)
        sys.exit(1)
    return re.match(r"(https://fonts\.gstatic\.com/[^)]+\.woff2)",
                    keep[(fam_disp, w)]).group(1)


downloaded = []
for _, fam_disp, stem, weights, variable in FONTS:
    if variable:
        # One file covers the whole range. Sanity-check that Google really did
        # hand back the same URL for every weight — if it ever stops doing so
        # the family is no longer variable and this entry needs variable=False.
        urls = {url_for(fam_disp, w) for w in weights}
        if len(urls) != 1:
            print(f"!! {fam_disp} is marked variable but returned {len(urls)} "
                  f"distinct files — set variable=False for it.", file=sys.stderr)
            sys.exit(1)
        downloaded.append(fetch(urls.pop(), OUT_DIR / f"{stem}.woff2"))
    else:
        for w in weights:
            downloaded.append(fetch(url_for(fam_disp, w), OUT_DIR / f"{stem}-{w}.woff2"))

# Emit the @font-face block we should drop into our base CSS.
print("\n/* Self-hosted @font-face declarations — paste into base.css before `*` reset. */\n")
UNICODE = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
           "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
           "U+2212,U+2215,U+FEFF,U+FFFD")
for _, fam_disp, stem, weights, variable in FONTS:
    if variable:
        rng = f"{min(weights)} {max(weights)}" if len(weights) > 1 else str(weights[0])
        print(f"@font-face{{font-family:'{fam_disp}';font-style:normal;font-weight:{rng};"
              f"font-display:swap;src:url('/fonts/{stem}.woff2') format('woff2');"
              f"unicode-range:{UNICODE};}}")
    else:
        for w in weights:
            print(f"@font-face{{font-family:'{fam_disp}';font-style:normal;font-weight:{w};"
                  f"font-display:swap;src:url('/fonts/{stem}-{w}.woff2') format('woff2');"
                  f"unicode-range:{UNICODE};}}")

print(f"\nDownloaded {len(downloaded)} font files to {OUT_DIR}/")
for path, size in downloaded:
    print(f"  {path}: {size//1024} KB")

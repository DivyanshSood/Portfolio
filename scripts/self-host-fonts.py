#!/usr/bin/env python3
"""Self-host Google Fonts: parse the latin subset URLs and download WOFF2 files
using the system curl (urllib's cert chain is broken on some macOS Pythons).

Why: removes a render-blocking third-party request and a privacy leak
(IP address sent to fonts.googleapis.com before page paint).
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

# (URL-safe family, CSS display name, our filename stem, weights we keep)
FONTS = [
    ("Archivo", "Archivo", "archivo", [400, 500, 600, 700, 800, 900]),
    ("Space+Mono", "Space Mono", "space-mono", [400, 700]),
    ("Caveat", "Caveat", "caveat", [600, 700]),
    ("Anton", "Anton", "anton", [400]),
    ("JetBrains+Mono", "JetBrains Mono", "jetbrains-mono", [400, 500]),
]

parts = ["family=" + urlfam + ":wght@" + ";".join(str(w) for w in ws)
         for urlfam, _, _, ws in FONTS]
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

downloaded = []
for _, fam_disp, stem, weights in FONTS:
    for w in weights:
        if (fam_disp, w) not in keep:
            print(f"!! missing: {fam_disp} {w}", file=sys.stderr)
            sys.exit(1)
        m = re.match(r"(https://fonts\.gstatic\.com/[^)]+\.woff2)", keep[(fam_disp, w)])
        font_url = m.group(1)
        out = OUT_DIR / f"{stem}-{w}.woff2"
        subprocess.run(
            ["curl", "-sS", "-A", UA, font_url, "-o", str(out)],
            check=True,
        )
        downloaded.append((str(out), out.stat().st_size))

# Emit the @font-face block we should drop into our base CSS.
print("\n/* Self-hosted @font-face declarations — paste into base.css before `*` reset. */\n")
UNICODE = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
           "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
           "U+2212,U+2215,U+FEFF,U+FFFD")
for _, fam_disp, stem, weights in FONTS:
    for w in weights:
        print(f"@font-face{{font-family:'{fam_disp}';font-style:normal;font-weight:{w};"
              f"font-display:swap;src:url('/fonts/{stem}-{w}.woff2') format('woff2');"
              f"unicode-range:{UNICODE};}}")

print(f"\nDownloaded {len(downloaded)} font files to {OUT_DIR}/")
for path, size in downloaded:
    print(f"  {path}: {size//1024} KB")

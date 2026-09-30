#!/usr/bin/env python3
"""Self-host the two brandbook families from Google Fonts (latin subset only),
using the system curl (urllib's cert chain is broken on some macOS Pythons).

Why: removes a render-blocking third-party request and a privacy leak
(IP address sent to fonts.googleapis.com before page paint).

The brandbook specifies exactly this request:
  Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900
  Geist Mono:wght@400;500;700
Both are variable, so Google returns one file per family + style no matter
how many weights are asked for. Archivo needs the `wdth` axis — every display
line in the brandbook is set at font-stretch:125% — and an italic file.

Writes public/fonts/{archivo,archivo-italic,geist-mono}.woff2 and prints the
@font-face rules that src/styles/brand.css carries.
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

URL = ("https://fonts.googleapis.com/css2?"
       "family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900"
       "&family=Geist+Mono:wght@400;500;700&display=swap")

# (CSS family, style) -> filename stem
FILES = {
    ("Archivo", "normal"): "archivo",
    ("Archivo", "italic"): "archivo-italic",
    ("Geist Mono", "normal"): "geist-mono",
}

print("Fetching:", URL)
css = subprocess.run(["curl", "-sS", "-A", UA, URL], check=True,
                     capture_output=True, text=True).stdout

found = {}
for b in re.split(r"@font-face\s*\{", css)[1:]:
    fam = re.search(r"font-family:\s*'([^']+)'", b).group(1)
    style = re.search(r"font-style:\s*(\w+)", b).group(1)
    rng = re.search(r"unicode-range:\s*([^;]+);", b).group(1).strip()
    src = re.search(r"src:\s*url\((https://[^)]+\.woff2)\)", b).group(1)
    if not rng.startswith("U+0000-00FF"):
        continue
    key = (fam, style)
    if key in found and found[key] != src:
        print(f"!! {fam} {style}: more than one latin file — no longer variable?",
              file=sys.stderr)
        sys.exit(1)
    found[key] = src

for key, stem in FILES.items():
    if key not in found:
        print(f"!! missing: {key}", file=sys.stderr)
        sys.exit(1)
    out = OUT_DIR / f"{stem}.woff2"
    subprocess.run(["curl", "-sS", "-A", UA, found[key], "-o", str(out)], check=True)
    print(f"  {out}  {out.stat().st_size:,} B")

print("\n/* @font-face rules — these live at the top of src/styles/brand.css */")
UNICODE = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
           "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
           "U+2212,U+2215,U+FEFF,U+FFFD")
print(f"@font-face{{font-family:'Archivo';font-style:normal;font-weight:100 900;font-stretch:62% 125%;"
      f"font-display:swap;src:url('/fonts/archivo.woff2') format('woff2');unicode-range:{UNICODE}}}")
print(f"@font-face{{font-family:'Archivo';font-style:italic;font-weight:100 900;font-stretch:62% 125%;"
      f"font-display:swap;src:url('/fonts/archivo-italic.woff2') format('woff2');unicode-range:{UNICODE}}}")
print(f"@font-face{{font-family:'Geist Mono';font-style:normal;font-weight:400 700;"
      f"font-display:swap;src:url('/fonts/geist-mono.woff2') format('woff2');unicode-range:{UNICODE}}}")

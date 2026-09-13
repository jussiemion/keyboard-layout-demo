#!/usr/bin/env python3
"""Build the Arabic fallback after build-fonts.py using an explicit licensed source."""

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont

p = argparse.ArgumentParser()
p.add_argument('source', type=Path)
p.add_argument('license', type=Path)
a = p.parse_args()
r = Path(__file__).resolve().parents[1]
out = r / 'public/fonts'
manifest = out / 'fonts.json'
f = TTFont(a.source)
for item in f['name'].names:
    if item.nameID in (1, 3, 4, 6, 16):
        f['name'].setName(
            'LayoutArabic' if item.nameID == 6 else 'Layout Arabic',
            item.nameID,
            item.platformID,
            item.platEncID,
            item.langID,
        )
f.recalcTimestamp = False
with tempfile.TemporaryDirectory() as directory:
    path = Path(directory) / 'layout-arabic.ttf'
    f.save(path)
    subprocess.run(
        ['woff2_compress', str(path)], check=True, capture_output=True
    )
    shutil.copy2(path.with_suffix('.woff2'), out / 'layout-arabic.woff2')
shutil.copy2(a.license, out / 'NotoSansArabic-OFL.txt')
d = json.loads(manifest.read_text())
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
d['sources']['NotoSansArabic.ttf'] = {
    'url': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansarabic/NotoSansArabic%5Bwdth,wght%5D.ttf',
    'sha256': sha(a.source),
}
d['fonts'] = [row for row in d['fonts'] if row['file'] != 'layout-arabic.woff2']
d['fonts'].append(
    {
        'file': 'layout-arabic.woff2',
        'family': 'Layout Arabic',
        'source': 'NotoSansArabic.ttf',
        'license': 'NotoSansArabic-OFL.txt',
        'unicodeRange': 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF',
        'weight': '100 900',
        'modifications': 'Full coverage, shaping and variable axes retained; renamed family.',
        'sha256': sha(out / 'layout-arabic.woff2'),
        'bytes': (out / 'layout-arabic.woff2').stat().st_size,
    }
)
manifest.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')

"""Rebuild the offline palette from pinned Unicode 17 / CLDR 48 data."""

import concurrent.futures
import json
import subprocess
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = 'en ru pl fr de es pt it ro he ar tr vi nl'.split()
CLDR = 'https://raw.githubusercontent.com/unicode-org/cldr/release-48'
UCD = 'https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt'
RANGES = [
    (0x20, 0x24F),
    (0x300, 0x6FF),
    (0x1E00, 0x1EFF),
    (0x2000, 0x2BFF),
    (0x2E00, 0x2E7F),
    (0x3000, 0x303F),
    (0x1D000, 0x1D24F),
    (0x1D400, 0x1D7FF),
    (0x1F000, 0x1FAFF),
]


def download(url):
    with urllib.request.urlopen(url, timeout=60) as response:
        return response.read().decode('utf-8')


def category(code, name, kind):
    if kind == 'Sc':
        return 'currency'
    if kind.startswith('M') or kind == 'Sk':
        return 'diacritics'
    if 'ARROW' in name:
        return 'arrows'
    if kind == 'Sm' or kind.startswith('N'):
        return 'math'
    if kind.startswith('P') or kind.startswith('Z'):
        return 'punctuation'
    if kind.startswith('L'):
        return 'letters'
    if 0x2300 <= code <= 0x23FF:
        return 'keyboard'
    return 'other'


def annotations(locale):
    records = {}
    for directory in ['annotations', 'annotationsDerived']:
        root = ET.fromstring(
            download(f'{CLDR}/common/{directory}/{locale}.xml')
        )
        for entry in root.iter('annotation'):
            symbol = entry.attrib['cp']
            value = entry.text or ''
            if value in ('↑↑↑', '∅∅∅', '') or len(symbol) > 16:
                continue
            record = records.setdefault(symbol, ['', ''])
            record[0 if entry.get('type') == 'tts' else 1] = value
    return locale, records


def main():
    records = {}
    for line in download(UCD).splitlines():
        fields = line.split(';')
        code, name, kind = int(fields[0], 16), fields[1], fields[2]
        if kind.startswith('C') or not any(a <= code <= b for a, b in RANGES):
            continue
        records[chr(code)] = [category(code, name, kind), name.lower(), {}]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        for locale, localized in executor.map(annotations, LOCALES):
            for symbol, labels in localized.items():
                record = records.setdefault(symbol, ['other', '', {}])
                record[2][locale] = labels
    # Stable ordering makes future data updates reviewable.
    records = dict(sorted(records.items()))
    subprocess.run(
        [
            'node',
            '--input-type=module',
            '-e',
            "import { writeSymbolData } from './tools/symbol-data-files.mjs'; "
            "let input = ''; for await (const chunk of process.stdin) input += chunk; "
            "writeSymbolData('symbol-catalog-data', JSON.parse(input), value => value[0]);",
        ],
        input=json.dumps(records, ensure_ascii=False),
        text=True,
        cwd=ROOT,
        check=True,
    )
    license_text = download(f'{CLDR}/LICENSE')
    (ROOT / 'public/unicode-license.txt').write_text(license_text)
    print(f'Wrote {len(records)} symbols to lib/symbol-catalog-data')


if __name__ == '__main__':
    main()

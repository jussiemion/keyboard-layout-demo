"""Build small, licensed palette mark fonts from explicit local Noto sources."""

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
JOBS = [
    ('Math', 'notosansmath', 'NotoSansMath-Regular.ttf'),
    ('Symbols', 'notosanssymbols', 'NotoSansSymbols[wght].ttf'),
    ('Symbols2', 'notosanssymbols2', 'NotoSansSymbols2-Regular.ttf'),
]


def build(sources):
    output = ROOT / 'public/fonts'
    manifest_path = output / 'fonts.json'
    manifest = json.loads(manifest_path.read_text())
    for name, folder, upstream in JOBS:
        source = sources / (name + '.ttf')
        font = TTFont(source)
        if 'fvar' in font:
            font = instantiateVariableFont(font, {'wght': 400}, inplace=True)
        family = 'Palette ' + name
        for record in list(font['name'].names):
            if record.nameID in (1, 3, 4, 6, 16):
                font['name'].setName(
                    family.replace(' ', '') if record.nameID == 6 else family,
                    record.nameID,
                    record.platformID,
                    record.platEncID,
                    record.langID,
                )
        options = subset.Options()
        options.layout_features = ['*']
        options.recalc_timestamp = False
        cutter = subset.Subsetter(options=options)
        cutter.populate(unicodes=list(range(0x20D0, 0x20F0)) + [0x25CC])
        cutter.subset(font)
        font.recalcTimestamp = False
        filename = 'palette-' + name.lower() + '.woff2'
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / filename.replace('.woff2', '.ttf')
            font.save(path)
            subprocess.run(
                ['woff2_compress', str(path)], check=True, capture_output=True
            )
            shutil.copy2(path.with_suffix('.woff2'), output / filename)
        license_name = 'Palette' + name + '-OFL.txt'
        (output / license_name).write_text(
            '\n'.join(
                line.rstrip()
                for line in (sources / (name + '-OFL.txt'))
                .read_text()
                .splitlines()
            )
            + '\n'
        )
        source_name = 'Palette' + name + '.ttf'
        manifest['sources'][source_name] = {
            'url': 'https://raw.githubusercontent.com/google/fonts/main/ofl/'
            + folder
            + '/'
            + upstream.replace('[', '%5B').replace(']', '%5D'),
            'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        }
        manifest['fonts'] = [
            item for item in manifest['fonts'] if item['file'] != filename
        ]
        manifest['fonts'].append(
            {
                'file': filename,
                'family': family,
                'source': source_name,
                'license': license_name,
                'unicodeRange': 'U+20D0-20EF, U+25CC',
                'weight': '400',
                'modifications': 'Static combining-symbol subset with dotted circle; renamed family; shaping retained.',
                'sha256': hashlib.sha256(
                    (output / filename).read_bytes()
                ).hexdigest(),
                'bytes': (output / filename).stat().st_size,
            }
        )
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n'
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sources', type=Path)
    build(parser.parse_args().sources)

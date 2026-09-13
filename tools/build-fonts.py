#!/usr/bin/env python3
"""Rebuild local fallbacks from the licensed sources listed in fonts.json.

Requires fontTools and the woff2_compress/woff2_decompress commands. Source paths are supplied
explicitly; rebuilding does not download or silently update upstream fonts.
"""

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


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rename(font, family):
    names = {
        1: family,
        2: 'Regular',
        3: family + ' 1.0',
        4: family,
        6: family.replace(' ', '') + '-Regular',
        16: family,
        17: 'Regular',
    }
    for entry in list(font['name'].names):
        if entry.nameID in names:
            font['name'].setName(
                names[entry.nameID],
                entry.nameID,
                entry.platformID,
                entry.platEncID,
                entry.langID,
            )


def build(source_dir, output_dir):
    output_dir.mkdir(parents=True, exist_ok=True)
    sources = {
        'NotoSansMono.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansmono/NotoSansMono%5Bwdth%2Cwght%5D.ttf',
        'NotoSansSymbols.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssymbols/NotoSansSymbols%5Bwght%5D.ttf',
        'NotoSansSymbols2.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssymbols2/NotoSansSymbols2-Regular.ttf',
        'NotoSansRunic.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansrunic/NotoSansRunic-Regular.ttf',
        'FontAwesomeBrands.woff2': 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.x/webfonts/fa-brands-400.woff2',
    }
    licenses = [
        'NotoSansMono-OFL.txt',
        'NotoSansSymbols-OFL.txt',
        'NotoSansSymbols2-OFL.txt',
        'NotoSansRunic-OFL.txt',
        'FontAwesome-LICENSE.txt',
    ]
    for name in licenses:
        shutil.copy2(source_dir / name, output_dir / name)
    fonts = [
        {
            'file': 'layout-mono.woff2',
            'family': 'Layout Mono',
            'source': 'NotoSansMono.ttf',
            'license': 'NotoSansMono-OFL.txt',
            'unicodeRange': None,
            'weight': '100 900',
            'modifications': 'Width axis instantiated at normal width (100); renamed family. Full character coverage and variable weight axis retained.',
        }
    ]
    jobs = [
        (
            'NotoSansSymbols.ttf',
            'layout-symbols',
            'Layout Symbols',
            {0x2300, 0x2303},
            'U+2300, U+2303',
            'NotoSansSymbols-OFL.txt',
        ),
        (
            'NotoSansSymbols2.ttf',
            'layout-symbols-2',
            'Layout Symbols',
            {0x21E7, 0x2318, 0x2325, 0x237D, 0x2713},
            'U+21E7, U+2318, U+2325, U+237D, U+2713',
            'NotoSansSymbols2-OFL.txt',
        ),
        (
            'NotoSansRunic.ttf',
            'layout-runic',
            'Layout Runic',
            {0x16C9},
            'U+16C9',
            'NotoSansRunic-OFL.txt',
        ),
        (
            'FontAwesomeBrands.woff2',
            'layout-apple',
            'Layout Apple Symbol',
            {0xF8FF},
            'U+F8FF',
            'FontAwesome-LICENSE.txt',
        ),
    ]
    with tempfile.TemporaryDirectory(prefix='layout-font-build-') as temp:
        original = Path(temp) / 'layout-mono.ttf'
        main_font = TTFont(source_dir / 'NotoSansMono.ttf')
        main_font = instantiateVariableFont(
            main_font, {'wdth': 100}, inplace=True
        )
        rename(main_font, 'Layout Mono')
        main_font.recalcTimestamp = False
        main_font.save(original)
        subprocess.run(
            ['woff2_compress', str(original)], check=True, capture_output=True
        )
        shutil.copy2(
            original.with_suffix('.woff2'), output_dir / 'layout-mono.woff2'
        )
        for (
            source,
            filename,
            family,
            points,
            unicode_range,
            license_file,
        ) in jobs:
            source_path = source_dir / source
            if source_path.suffix == '.woff2':
                compressed = Path(temp) / source
                shutil.copy2(source_path, compressed)
                subprocess.run(
                    ['woff2_decompress', str(compressed)],
                    check=True,
                    capture_output=True,
                )
                source_path = compressed.with_suffix('.ttf')
            font = TTFont(source_path)
            if 'fvar' in font:
                axes = {
                    axis.axisTag: 400
                    if axis.axisTag == 'wght'
                    else axis.defaultValue
                    for axis in font['fvar'].axes
                }
                font = instantiateVariableFont(font, axes, inplace=True)
            if source == 'FontAwesomeBrands.woff2':
                apple = font.getBestCmap()[0xF179]
                for table in font['cmap'].tables:
                    if table.isUnicode():
                        table.cmap[0xF8FF] = apple
            options = subset.Options()
            options.layout_features = ['*']
            options.name_IDs = ['*']
            options.name_legacy = True
            options.name_languages = ['*']
            options.notdef_glyph = True
            options.notdef_outline = True
            options.recalc_timestamp = False
            cutter = subset.Subsetter(options=options)
            cutter.populate(unicodes=points)
            cutter.subset(font)
            rename(font, family)
            font.recalcTimestamp = False
            output = Path(temp) / (filename + '.ttf')
            font.save(output)
            subprocess.run(
                ['woff2_compress', str(output)], check=True, capture_output=True
            )
            shutil.copy2(
                output.with_suffix('.woff2'), output_dir / (filename + '.woff2')
            )
            fonts.append(
                {
                    'file': filename + '.woff2',
                    'family': family,
                    'source': source,
                    'license': license_file,
                    'unicodeRange': unicode_range,
                    'weight': '400',
                    'modifications': 'Static subset; renamed family; original outlines and shaping retained.'
                    + (
                        ' Apple glyph mapped from U+F179 to U+F8FF; typed Unicode is unchanged.'
                        if source == 'FontAwesomeBrands.woff2'
                        else ''
                    ),
                }
            )
    for record in fonts:
        record['sha256'] = sha256(output_dir / record['file'])
        record['bytes'] = (output_dir / record['file']).stat().st_size
    manifest = {
        'schema': 1,
        'description': 'Fonts for the supported typography map and Russian, Polish, English text.',
        'sources': {
            name: {'url': url, 'sha256': sha256(source_dir / name)}
            for name, url in sources.items()
        },
        'fonts': fonts,
    }
    (output_dir / 'fonts.json').write_text(
        json.dumps(manifest, indent=2) + '\n'
    )
    print(
        'Built',
        len(fonts),
        'font files;',
        sum(font['bytes'] for font in fonts),
        'bytes total.',
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sources', type=Path)
    parser.add_argument(
        '--output',
        type=Path,
        default=Path(__file__).resolve().parents[1] / 'public/fonts',
    )
    args = parser.parse_args()
    build(args.sources, args.output)

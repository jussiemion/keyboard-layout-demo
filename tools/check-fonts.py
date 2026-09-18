#!/usr/bin/env python3
"""Verify shipped WOFF2 coverage and shaping without installed fallback fonts.

Requires fontTools, woff2_decompress, and libharfbuzz. No browser or network is
used. Every grapheme must be shapeable by a bundled font, including accents.
"""

import argparse
import ctypes
import ctypes.util
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import unicodedata
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

ALPHABET = 'ăâîșțĂÂÎȘȚàâæçèéêëîïôœùûüÿäößẞáíñóúãõÀÂÆÇÈÉÊËÎÏÔŒÙÛÜŸÄÖÁÍÑÓÚÃÕabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZąćęłńóśźżĄĆĘŁŃÓŚŹŻабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'


def clusters(text):
    result = []
    for char in text:
        if unicodedata.combining(char) and result:
            result[-1] += char
        else:
            result.append(char)
    return result


class GlyphInfo(ctypes.Structure):
    _fields_ = [
        ('codepoint', ctypes.c_uint32),
        ('mask', ctypes.c_uint32),
        ('cluster', ctypes.c_uint32),
        ('var1', ctypes.c_uint32),
        ('var2', ctypes.c_uint32),
    ]


def harfbuzz():
    lib = ctypes.CDLL(ctypes.util.find_library('harfbuzz'))
    declarations = {
        'hb_blob_create_from_file_or_fail': (
            [ctypes.c_char_p],
            ctypes.c_void_p,
        ),
        'hb_face_create': ([ctypes.c_void_p, ctypes.c_uint], ctypes.c_void_p),
        'hb_font_create': ([ctypes.c_void_p], ctypes.c_void_p),
        'hb_ot_font_set_funcs': ([ctypes.c_void_p], None),
        'hb_buffer_create': ([], ctypes.c_void_p),
        'hb_buffer_add_utf8': (
            [
                ctypes.c_void_p,
                ctypes.c_char_p,
                ctypes.c_int,
                ctypes.c_uint,
                ctypes.c_int,
            ],
            None,
        ),
        'hb_buffer_guess_segment_properties': ([ctypes.c_void_p], None),
        'hb_shape': (
            [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_void_p, ctypes.c_uint],
            None,
        ),
        'hb_buffer_get_glyph_infos': (
            [ctypes.c_void_p, ctypes.POINTER(ctypes.c_uint)],
            ctypes.POINTER(GlyphInfo),
        ),
    }
    for name in ['blob', 'face', 'font', 'buffer']:
        declarations['hb_' + name + '_destroy'] = ([ctypes.c_void_p], None)
    for name, (args, result) in declarations.items():
        fn = getattr(lib, name)
        fn.argtypes = args
        fn.restype = result
    return lib


def verify(project):
    manifest = json.loads((project / 'public/fonts/fonts.json').read_text())
    layout = json.loads((project / 'lib/layout.json').read_text())
    css = '\n'.join(
        path.read_text() for path in sorted((project / 'app').rglob('*.css'))
    )
    engine = (project / 'lib/typing-engine.ts').read_text()
    accents = re.findall(
        r"(\w+): \{ mark: '\\u([0-9a-f]{4})', label: '[^']+', spacing: '([^']+)'",
        engine,
    )
    used_accents = {
        action['dead']
        for key in layout['keys']
        for action in [key['primary'], key['secondary']]
        if 'dead' in action
    }
    assert used_accents <= {name for name, _, _ in accents}, (
        'Accent definitions must match the map'
    )
    samples = [
        'ᛉ',
        '⍽',
        '◌',
        ALPHABET,
        ''.join(chr(cp) for cp in range(0x20, 0x7F)),
    ]
    samples += [
        'العَرَبِيَّة',
        'لا',
        'لأ',
        'لإ',
        'لآ',
        'İıĞğŞş',
        'Tiếng Việt ắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữự',
        'שָׁלוֹם',
        'בּ',
        'שָׁ',
        'שָׂ',
        'בְּ',
    ]
    samples += [spacing for _, _, spacing in accents]
    for path in [
        (project / 'lib/keyboard.ts'),
        (project / 'lib/messages.ts'),
        (project / 'lib/help-messages.ts'),
        (project / 'lib/national-layouts.json'),
        *sorted((project / 'lib/locales').glob('*.ts')),
        *sorted((project / 'lib/locales').glob('*.json')),
    ]:
        samples.extend(char for char in path.read_text() if ord(char) > 127)
    for folder in ['app', 'components']:
        for path in (project / folder).glob('*.tsx'):
            # DevTools uses browser fonts, not the application's bundled stack.
            if path.name == 'local-console-message.tsx':
                continue
            samples.extend(char for char in path.read_text() if ord(char) > 127)
    for entry in layout['keys']:
        for action in [entry['primary'], entry['secondary']]:
            if action.get('text'):
                samples.append(action['text'])
    for _, codepoint, _ in accents:
        mark = chr(int(codepoint, 16))
        samples.append('◌' + mark)
        for letter in ALPHABET:
            samples += [
                letter + mark,
                unicodedata.normalize('NFC', letter + mark),
            ]
    samples += ['◌' + chr(code) for code in range(0x20D0, 0x20F0)]
    graphemes = sorted(
        {cluster for text in samples for cluster in clusters(text)}
    )
    required_points = {ord(char) for cluster in graphemes for char in cluster}
    lib = harfbuzz()
    with tempfile.TemporaryDirectory(prefix='layout-font-check-') as temp:
        fonts = []
        handles = []
        for record in manifest['fonts']:
            blocks = [
                block
                for block in re.findall(r'@font-face\s*\{([^}]+)\}', css)
                if '/fonts/' + record['file'] in block
            ]
            assert len(blocks) == 1, (
                'Missing or duplicate font face: ' + record['file']
            )
            block = blocks[0]
            assert (
                f"font-family: '{record['family']}'" in block
                and f'font-weight: {record["weight"]}' in block
            ), record['file']
            assert 'local(' not in block and 'http' not in block, (
                'Only bundled fonts are allowed'
            )
            actual_range = re.search(r'unicode-range:\s*([^;]+);', block)
            normalize = lambda value: re.sub(r'\s+', '', value).upper()
            assert (normalize(actual_range[1]) if actual_range else None) == (
                normalize(record['unicodeRange'])
                if record['unicodeRange']
                else None
            ), record['file']
            source = project / 'public/fonts' / record['file']
            assert (
                hashlib.sha256(source.read_bytes()).hexdigest()
                == record['sha256']
            ), source
            file = Path(temp) / record['file']
            shutil.copy2(source, file)
            subprocess.run(
                ['woff2_decompress', str(file)], check=True, capture_output=True
            )
            ttf = file.with_suffix('.ttf')
            font = TTFont(ttf)
            cmap = font.getBestCmap()
            points = set(cmap)
            if record['unicodeRange']:
                ranges = [
                    part.strip()[2:].split('-')
                    for part in record['unicodeRange'].split(',')
                ]
                points &= {
                    cp
                    for bounds in ranges
                    for cp in range(int(bounds[0], 16), int(bounds[-1], 16) + 1)
                }
            glyphs = font.getGlyphSet()
            for cp in points:
                if cp not in required_points:
                    continue
                if chr(cp).isspace() or unicodedata.category(chr(cp)) in (
                    'Cc',
                    'Cf',
                ):
                    continue
                pen = BoundsPen(glyphs)
                glyphs[cmap[cp]].draw(pen)
                assert (
                    font.getGlyphID(cmap[cp]) != 0 and pen.bounds is not None
                ), (record['file'], hex(cp))
            blob = lib.hb_blob_create_from_file_or_fail(str(ttf).encode())
            face = lib.hb_face_create(blob, 0)
            hbfont = lib.hb_font_create(face)
            lib.hb_ot_font_set_funcs(hbfont)
            fonts.append((record['family'], points, hbfont))
            handles.append((blob, face, hbfont))
        for cluster in graphemes:
            if all(unicodedata.category(char) == 'Cf' for char in cluster):
                continue
            candidate = next(
                (font for font in fonts if set(map(ord, cluster)) <= font[1]),
                None,
            )
            assert candidate, 'Missing complete grapheme: ' + repr(cluster)
            data = cluster.encode('utf8')
            buffer = lib.hb_buffer_create()
            lib.hb_buffer_add_utf8(buffer, data, len(data), 0, len(data))
            lib.hb_buffer_guess_segment_properties(buffer)
            lib.hb_shape(candidate[2], buffer, None, 0)
            length = ctypes.c_uint()
            infos = lib.hb_buffer_get_glyph_infos(buffer, ctypes.byref(length))
            assert length.value and all(
                infos[i].codepoint != 0 for i in range(length.value)
            ), (candidate[0], cluster)
            lib.hb_buffer_destroy(buffer)
        for blob, face, font in handles:
            lib.hb_font_destroy(font)
            lib.hb_face_destroy(face)
            lib.hb_blob_destroy(blob)
    print(
        f'Font coverage and HarfBuzz shaping passed for {len(graphemes)} graphemes, all layout outputs, all {len(accents)} accents and all supported language letters (NFC and combining forms). CSS font declarations and file checksums also passed.'
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--project', type=Path, default=Path(__file__).resolve().parents[1]
    )
    verify(parser.parse_args().project)

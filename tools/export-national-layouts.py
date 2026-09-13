#!/usr/bin/env python3
"""Export national key data from local XKB definitions; never changes OS configuration.

Requires libxkbcommon and xkeyboard-config. Review generated changes before use.
"""

import ctypes as C
import ctypes.util
import json
import unicodedata
from pathlib import Path

x = C.CDLL(ctypes.util.find_library('xkbcommon'))


class Names(C.Structure):
    _fields_ = [
        (n, C.c_char_p)
        for n in ['rules', 'model', 'layout', 'variant', 'options']
    ]


for n, args, result in [
    ('xkb_context_new', [C.c_int], C.c_void_p),
    (
        'xkb_keymap_new_from_names',
        [C.c_void_p, C.POINTER(Names), C.c_int],
        C.c_void_p,
    ),
    ('xkb_keymap_key_by_name', [C.c_void_p, C.c_char_p], C.c_uint),
    (
        'xkb_keymap_key_get_syms_by_level',
        [
            C.c_void_p,
            C.c_uint,
            C.c_uint,
            C.c_uint,
            C.POINTER(C.POINTER(C.c_uint)),
        ],
        C.c_int,
    ),
    ('xkb_keysym_to_utf32', [C.c_uint], C.c_uint),
    ('xkb_keysym_get_name', [C.c_uint, C.c_char_p, C.c_size_t], C.c_int),
    ('xkb_keymap_unref', [C.c_void_p], None),
    ('xkb_context_unref', [C.c_void_p], None),
    ('xkb_state_new', [C.c_void_p], C.c_void_p),
    ('xkb_state_update_mask', [C.c_void_p] + [C.c_uint] * 6, C.c_int),
    ('xkb_state_key_get_one_sym', [C.c_void_p, C.c_uint], C.c_uint),
    ('xkb_keymap_mod_get_index', [C.c_void_p, C.c_char_p], C.c_uint),
    ('xkb_state_unref', [C.c_void_p], None),
    (
        'xkb_keymap_num_levels_for_key',
        [C.c_void_p, C.c_uint, C.c_uint],
        C.c_uint,
    ),
]:
    f = getattr(x, n)
    f.argtypes = args
    f.restype = result
ctx = x.xkb_context_new(0)
physical = {
    'TLDE': 'Backquote',
    'AE11': 'Minus',
    'AE12': 'Equal',
    'AD11': 'BracketLeft',
    'AD12': 'BracketRight',
    'AC10': 'Semicolon',
    'AC11': 'Quote',
    'AB08': 'Comma',
    'AB09': 'Period',
    'AB10': 'Slash',
    'SPCE': 'Space',
    'BKSL': 'Backslash',
    'LSGT': 'IntlBackslash',
    'AB11': 'IntlRo',
}
for i in range(1, 11):
    physical[f'AE{i:02}'] = f'Digit{i % 10}'
for row, letters in [
    ('AD', 'QWERTYUIOP'),
    ('AC', 'ASDFGHJKL'),
    ('AB', 'ZXCVBNM'),
]:
    for i, l in enumerate(letters, 1):
        physical[f'{row}{i:02}'] = 'Key' + l
maps = {}
dead = set()
specs = {
    lang: (lang, '')
    for lang in ['fr', 'de', 'es', 'pt', 'it', 'ro', 'tr', 'nl']
}
specs.update(
    {
        'he': ('il', ''),
        'ar': ('ara', ''),
        'vi': ('vn', ''),
        'es-MX': ('latam', ''),
        'pt-BR': ('br', 'abnt2'),
        'fr-CA': ('ca', 'fr'),
        'de-CH': ('ch', 'basic'),
    }
)
for lang, (layout, variant) in specs.items():
    km = x.xkb_keymap_new_from_names(
        ctx,
        C.byref(
            Names(b'evdev', b'pc105', layout.encode(), variant.encode(), b'')
        ),
        0,
    )
    assert km
    rows = {}
    state = x.xkb_state_new(km)
    mod = lambda n: 1 << x.xkb_keymap_mod_get_index(km, n.encode())
    for name, code in physical.items():
        if code == 'IntlRo' and lang != 'pt-BR':
            continue
        levels = []
        for level in range(8):
            depressed = (mod('Shift') if level & 1 else 0) | (
                mod('Mod5') if level & 2 else 0
            )
            x.xkb_state_update_mask(
                state, depressed, 0, mod('Lock') if level & 4 else 0, 0, 0, 0
            )
            keycode = x.xkb_keymap_key_by_name(km, name.encode())
            symcode = (
                0
                if level & 2
                and x.xkb_keymap_num_levels_for_key(km, keycode, 0) < 3
                else x.xkb_state_key_get_one_sym(state, keycode)
            )
            a = {}
            if symcode:
                buf = C.create_string_buffer(128)
                x.xkb_keysym_get_name(symcode, buf, 128)
                sym = buf.value.decode()
                cp = x.xkb_keysym_to_utf32(symcode)
                if sym.startswith('dead_'):
                    a = {'dead': 'ring' if sym == 'dead_abovering' else sym[5:]}
                    dead.add(a['dead'])
                elif cp:
                    a = {
                        'text': unicodedata.normalize('NFKC', chr(cp))
                        if lang == 'ar'
                        else chr(cp)
                    }
            levels.append(a)
        rows[code] = levels
    maps[lang] = rows
    x.xkb_state_unref(state)
    x.xkb_keymap_unref(km)
x.xkb_context_unref(ctx)
(Path(__file__).resolve().parents[1] / 'lib/national-layouts.json').write_text(
    json.dumps(maps, ensure_ascii=False, indent=2) + '\n'
)
print('Dead keys:', sorted(dead))
print('Layouts:', {k: len(v) for k, v in maps.items()})

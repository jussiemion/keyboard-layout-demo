import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import {
  detectPlatform,
  getPlatform,
  getServerPlatform,
  parsePlatform,
  platformBootstrap,
  PLATFORM_STORAGE_KEY,
  PLATFORMS,
  setPlatform,
  subscribeToPlatform,
} from '../lib/platform.ts';
import {
  getKeyboardRows,
  modifierNames,
  moveSelection,
} from '../lib/keyboard.ts';
import { baseKey, keyMap, TypingEngine } from '../lib/typing-engine.ts';
import {
  preferencesBootstrap,
  revealInitialPreferences,
} from '../lib/preferences.ts';

const detectionCases = [
  {
    name: 'Windows client hints',
    signals: { userAgentData: { platform: 'Windows' }, platform: 'MacIntel' },
    expected: 'windows',
  },
  {
    name: 'macOS client hints',
    signals: { userAgentData: { platform: 'macOS' } },
    expected: 'macos',
  },
  {
    name: 'Linux client hints',
    signals: { userAgentData: { platform: 'Linux' } },
    expected: 'linux',
  },
  {
    name: 'legacy Win32 on 64-bit Windows',
    signals: { platform: 'Win32' },
    expected: 'windows',
  },
  {
    name: 'legacy MacIntel',
    signals: { platform: 'MacIntel' },
    expected: 'macos',
  },
  {
    name: 'legacy Linux',
    signals: { platform: 'Linux x86_64' },
    expected: 'linux',
  },
  {
    name: 'Windows user agent fallback',
    signals: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    expected: 'windows',
  },
  {
    name: 'Mac user agent fallback',
    signals: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
    expected: 'macos',
  },
  {
    name: 'iPhone is not macOS',
    signals: {
      platform: 'iPhone',
      userAgent: 'iPhone; CPU iPhone OS 18 like Mac OS X',
    },
    expected: 'linux',
  },
  {
    name: 'desktop-mode iPad is not macOS',
    signals: { platform: 'MacIntel', maxTouchPoints: 5 },
    expected: 'linux',
  },
  {
    name: 'missing signals use the default PC layout',
    signals: {},
    expected: 'linux',
  },
] as const;

function browserFixture(
  signals: Parameters<typeof detectPlatform>[0],
  saved?: string,
  blocked = false,
) {
  const values = new Map<string, string>();
  if (saved) {
    values.set(PLATFORM_STORAGE_KEY, saved);
  }
  const root = {
    dataset: {} as Record<string, string>,
    lang: 'en',
    classList: { toggle() {} },
  };
  const browser = {
    navigator: { languages: ['en-GB'], language: 'en', ...signals },
    document: {
      documentElement: root,
      title: '',
      querySelector: () => ({ setAttribute() {} }),
    },
    window: Object.assign(new EventTarget(), {
      matchMedia: () => ({ matches: false }),
    }),
    matchMedia: () => ({ matches: false }),
    localStorage: {
      getItem(key: string) {
        if (blocked) {
          throw new Error('Blocked');
        }
        return values.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        if (blocked) {
          throw new Error('Blocked');
        }
        values.set(key, value);
      },
    },
  };
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [key, value] of Object.entries(browser)) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, value });
  }
  return {
    ...browser,
    root,
    values,
    bootstrap: () => runInNewContext(platformBootstrap, browser),
    bootstrapPreferences: () => runInNewContext(preferencesBootstrap, browser),
    storage(key: string | null, newValue: string | null) {
      if (key === null) {
        values.clear();
      } else if (newValue === null) {
        values.delete(key);
      } else {
        values.set(key, newValue);
      }
      const event = new Event('storage');
      Object.defineProperties(event, {
        key: { value: key },
        newValue: { value: newValue },
      });
      browser.window.dispatchEvent(event);
    },
    restore() {
      for (const [key, descriptor] of originals) {
        if (descriptor) {
          Object.defineProperty(globalThis, key, descriptor);
        } else {
          Reflect.deleteProperty(globalThis, key);
        }
      }
    },
  };
}

for (const { name, signals, expected } of detectionCases) {
  await test(`platform detection: ${name}`, () => {
    assert.equal(detectPlatform(signals), expected);
    const browser = browserFixture(signals);
    try {
      browser.bootstrap();
      assert.equal(getPlatform(), expected);
      assert.equal(browser.root.dataset.platformPreference, 'auto');
    } finally {
      browser.restore();
    }
  });
}

await test('manual platform persists, synchronizes and ignores unrelated preferences', () => {
  const browser = browserFixture({ platform: 'MacIntel' });
  try {
    browser.bootstrap();
    let changes = 0;
    const unsubscribe = subscribeToPlatform(() => {
      changes++;
    });
    setPlatform('windows');
    assert.equal(getPlatform(), 'windows');
    assert.equal(browser.values.get(PLATFORM_STORAGE_KEY), 'windows');
    browser.root.dataset = {};
    browser.bootstrap();
    assert.equal(getPlatform(), 'windows');
    browser.storage('keyboard-layout-demo.ui-locale', 'pl');
    assert.equal(getPlatform(), 'windows');
    browser.storage(PLATFORM_STORAGE_KEY, 'linux');
    assert.equal(getPlatform(), 'linux');
    browser.storage(PLATFORM_STORAGE_KEY, null);
    assert.equal(getPlatform(), 'macos');
    setPlatform('unknown');
    assert.equal(getPlatform(), 'macos');
    const before = changes;
    unsubscribe();
    browser.storage(PLATFORM_STORAGE_KEY, 'windows');
    assert.equal(changes, before);
  } finally {
    browser.restore();
  }
});

await test('invalid or blocked platform storage does not block automatic or manual selection', () => {
  assert.equal(parsePlatform('invalid'), null);
  assert.equal(getServerPlatform(), 'linux');
  for (const blocked of [false, true]) {
    const browser = browserFixture({ platform: 'Win32' }, 'invalid', blocked);
    try {
      browser.bootstrap();
      assert.equal(getPlatform(), 'windows');
      const unsubscribe = subscribeToPlatform(() => {});
      setPlatform('macos');
      assert.equal(getPlatform(), 'macos');
      unsubscribe();
    } finally {
      browser.restore();
    }
  }
});

for (const platform of PLATFORMS) {
  await test(`${platform} is applied before exposing the initial keyboard`, () => {
    const browser = browserFixture({ platform: 'Linux x86_64' }, platform);
    try {
      browser.bootstrapPreferences();
      assert.equal(
        Boolean(browser.root.dataset.preferencesPending),
        platform !== 'linux',
      );
      assert.equal(
        revealInitialPreferences('en', 'vesper_light', 'linux'),
        platform === 'linux',
      );
      assert.equal(
        revealInitialPreferences('en', 'vesper_light', platform),
        true,
      );
      assert.equal(browser.root.dataset.preferencesPending, undefined);
    } finally {
      browser.restore();
    }
  });

  await test(`${platform} preserves every canonical symbol position and both Alt keys`, () => {
    const rows = getKeyboardRows(platform);
    const keys = rows.flatMap((row) =>
      row.flatMap((key) => ('keys' in key ? key.keys : [key])),
    );
    assert.equal(rows.length, 5);
    assert.equal(new Set(keys.map((key) => key.code)).size, keys.length);
    assert.deepEqual(
      keys
        .filter((key) => keyMap.has(key.code))
        .map((key) => key.code)
        .sort(),
      [...keyMap.keys()].sort(),
    );
    assert.ok(keys.some((key) => key.code === 'AltLeft'));
    assert.ok(keys.some((key) => key.code === 'AltRight'));
    for (const row of rows) {
      assert.equal(
        row.reduce((sum, key) => sum + (key.width ?? 1), 0),
        15,
      );
    }
    for (const locale of ['ru', 'en', 'pl'] as const) {
      const engine = new TypingEngine();
      engine.handle({ code: 'AltLeft', down: true }, locale);
      engine.handle({ code: 'AltLeft', down: false }, locale);
      assert.equal(
        engine.handle(
          { code: 'KeyC', key: baseKey('KeyC', locale), down: true },
          locale,
        ).text,
        '©',
      );
      engine.reset();
      engine.handle({ code: 'AltLeft', down: true }, locale);
      engine.handle({ code: 'AltLeft', down: false }, locale);
      engine.handle({ code: 'MetaLeft', down: true }, locale);
      assert.equal(engine.mode, 0);
    }
  });
}

await test('Windows only changes Super legends; macOS has its own modifier order and arrow cluster', () => {
  const linux = getKeyboardRows('linux');
  const windows = getKeyboardRows('windows');
  assert.deepEqual(
    windows,
    linux.map((row) =>
      row.map((key) =>
        key.code.startsWith('Meta') ? { ...key, label: 'win' } : key,
      ),
    ),
  );
  const mac = getKeyboardRows('macos');
  assert.deepEqual(
    mac[4].map((key) => key.code),
    [
      'Fn',
      'ControlLeft',
      'AltLeft',
      'MetaLeft',
      'Space',
      'MetaRight',
      'AltRight',
      'Arrows',
    ],
  );
  assert.equal(modifierNames('macos').alt, 'Option');
  assert.equal(modifierNames('macos').meta, 'Command');
  assert.equal(modifierNames('windows').meta, 'Win');
});

await test('screen arrows navigate complete graphemes and extend or collapse selections', () => {
  const text = 'aо́👩‍💻b';
  assert.equal(moveSelection(text, 8, 8, 'none', 'ArrowLeft', false).start, 3);
  assert.equal(moveSelection(text, 3, 3, 'none', 'ArrowRight', false).start, 8);
  assert.equal(
    moveSelection(text, 1, 8, 'forward', 'ArrowLeft', false).start,
    1,
  );
  assert.equal(
    moveSelection(text, 1, 8, 'forward', 'ArrowRight', false).start,
    8,
  );
  assert.deepEqual(moveSelection(text, 3, 3, 'none', 'ArrowLeft', true), {
    start: 1,
    end: 3,
    direction: 'backward',
  });
  assert.deepEqual(moveSelection(text, 1, 3, 'backward', 'ArrowLeft', true), {
    start: 0,
    end: 3,
    direction: 'backward',
  });
  assert.equal(moveSelection(text, 3, 3, 'none', 'ArrowUp', false).start, 0);
  assert.equal(
    moveSelection(text, 3, 3, 'none', 'ArrowDown', false).start,
    text.length,
  );
});

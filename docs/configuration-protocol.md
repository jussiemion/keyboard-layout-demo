# Configuration links · version 1

A configuration link transfers settings as data. It does not download a profile,
execute commands, contact a subscription service or install an OS layout.

```text
https://jussiemion.github.io/keyboard-layout-demo/en/#config=<base64url>
```

The fragment is **UTF-8 JSON encoded with unpadded Base64url** (RFC 4648). It is
not encrypted. Anyone with the link can read the settings. A URL fragment is not
included in an HTTP request. No account or server-side storage is used.

## Payload

```json
{
  "format": "yushkevich-layout",
  "version": 1,
  "base": "birman-3.9",
  "settings": {
    "version": 1,
    "languageMapping": {
      "order": ["en", "ru"],
      "slots": ["pl", "pt", "es", "de"]
    },
    "symbolMap": {
      "AB03": {
        "primary": { "text": "★" },
        "secondary": { "dead": "acute" },
        "quick": true
      }
    }
  },
  "preferences": {
    "uiLocale": "en",
    "keyboardLocale": "pl",
    "theme": "system",
    "platform": "linux"
  }
}
```

`symbolMap` uses **physical XKB positions**, not translated letters or operating
system scan codes. `AB03`, for example, is the QWERTY C position. The baseline
positions are listed in [layout.json](../lib/layout.json).

- Missing keys and missing fields inherit the pinned `birman-3.9` baseline.
- `primary` is M1, `secondary` is M2.
- An action is exactly one of `{ "text": "…" }`, `{ "dead": "acute" }`, or `{}`.
  The empty object explicitly clears an assignment.
- Text contains 1–16 Unicode code points, including combining marks and emoji.
  Control characters, unpaired surrogates and bidi embedding/isolation controls
  are rejected. A space, non-breaking space and emoji joiner remain valid.
- Supported dead accents: `grave`, `circumflex`, `breve`, `ring`, `doubleacute`,
  `diaeresis`, `cedilla`, `caron`, `tilde`, `acute`.
- `quick` enables the existing held-Alt quick-entry gesture for the M1 action.
  National AltGr exceptions retain their normal precedence.
- M0 national maps, language-switch gestures and Shift cycles are not remapped.

The export resolves default S0/S1–S4 assignments explicitly. It includes the
current UI language, keyboard option, theme preference and platform. Transient
text, held keys, pending accents, current typing mode, tour progress and
waitlist form data are not settings and are not exported.

## Import contract for desktop clients

1. Accept an HTTP(S) URL no longer than 32,768 characters. Do not fetch it.
2. Require exactly `#config=` followed by Base64url data. Reject malformed
   encoding and invalid UTF-8 before parsing JSON.
3. Verify the format, version and baseline. Reject unsupported versions and
   unknown fields, positions, languages, actions or invalid value types.
4. Require two distinct S0 languages and four S1–S4 assignments. Slots may
   repeat.
5. Validate the whole configuration before changing anything. Show a preview and
   require the user to apply it; a clicked link must not silently remap keys.
6. Preserve platform-neutral physical positions. Check that the desktop engine
   implements the baseline, selected languages and gestures before applying.
7. Save atomically, retain the previous working profile and offer rollback.
   UI-only preferences may be reported as not applicable; do not silently drop
   unsupported keyboard behavior or pretend an import was complete.

This change implements **export and import in the web demo**, plus this shared
contract. Existing desktop installations do not yet consume these links. Their
importer must be implemented against the same contract and tested separately;
the demo does not modify system settings.

The reference codec and validator are
[configuration-link.ts](../lib/configuration-link.ts); integration and rejection
cases are covered by [configuration.test.ts](../tests/configuration.test.ts).
The web importer reads a link from the clipboard on **Import from clipboard**,
or accepts a link opened in the browser. It loads it into a draft and applies it
only on **Save**. **Cancel** leaves current settings intact. Export copies the
current draft, including unsaved edits.

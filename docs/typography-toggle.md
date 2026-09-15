# Typography on/off

Typography starts enabled on every page load. Press Left <kbd>Ctrl</kbd> and
Right <kbd>Ctrl</kbd> together, then release both to toggle it once. Either
order works; there is no timer. Repeat, other keys, mouse interaction, focus
loss and session interruption must not create accidental toggles. A
<kbd>Ctrl</kbd> already used in a shortcut is ineligible.

Turning typography off clears pending symbols, accents and <kbd>Shift</kbd>
cycles without changing the text or keyboard language. Ordinary input and Caps
language switching remain available. This describes the web demo only; native
adapters may bind Caps behavior to their own enabled state. The demo does not
modify OS configuration.

The demo dims all keycaps except the two Controls. Control keycaps retain their
normal pressed state. When typography is off, a state notification below the
keyboard explains how to re-enable it.

When the native-layout warning is visible, a trusted physical
two-<kbd>Ctrl</kbd> gesture is reserved for the system adapter: the demo
dismisses the warning and does not toggle its own typography. This does not
confirm the system state. See
[system-layout detection](browser-adapter.md#system-layout-detection).

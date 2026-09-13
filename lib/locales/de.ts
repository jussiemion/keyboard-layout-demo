import type { Messages } from '../messages.ts';

export const de = {
  productName: 'Typografische Tastaturbelegung von Semyon Yushkevich',
  pageTitle: 'Typografische Tastaturbelegung von Semyon Yushkevich',
  pageDescription: 'Typografische Zeichen, Diakritika und Sprachwechsel.',
  brandTitle: 'typografische Tastaturbelegung',
  headerActions: 'Darstellung, Oberflächensprache und Projektinformationen',
  sourceLabel: 'Quellcode auf GitHub',
  sourceTooltip: 'Quellcode',
  helpLabel: 'Anleitung zur Tastaturbelegung',
  helpTooltip: 'So funktioniert es',
  closeHelp: 'Hilfe schließen',
  helpTitle: 'Eine Taste {modifier}. Mehr Möglichkeiten.',
  helpIntro:
    'Die Belegung ist bereits aktiv. Beginnen Sie mit einem beliebigen Zeichen.',
  helpPrimaryTitle: 'Symbolmodus: {modifier} drücken',
  helpPrimaryBody:
    'Drücken Sie danach eine Taste: {alt} {arrow} {key} ergibt {symbol}. Zwischen den Tastendrücken besteht kein Zeitlimit.',
  helpSecondaryTitle: 'Erweiterter Modus: {modifier} erneut drücken',
  helpSecondaryBody:
    '{alt} {alt} {arrow} {key} ergibt {symbol}. Beim zweiten Drücken darf {modifier} noch gehalten werden.',
  helpBasicTitle: 'Basismodus: eine Tastenkombination',
  helpBasicBody:
    'Halten Sie eine der beiden {alt}-Tasten zusammen mit {minus}, {slash}, {comma} oder {period}, um {symbols} einzugeben.',
  helpAccentTitle: 'Erst der Akzent, dann der Buchstabe',
  helpAccentBody:
    'Für ein Betonungszeichen drücke {alt} {alt} {slash} und danach den Buchstaben: {letter} → {result}. Auch Buchstaben mit diakritischen Zeichen können betont werden. Beispiel für {language}: {variant}.',
  helpLocaleNote:
    'Die Tastatursprache bestimmt Beschriftung und Bildschirmeingabe. Für die physische Tastatur ändern Sie die Systemsprache der Tastatur. Nationale Zeichen mit {modifier} hängen von der gewählten Belegung ab.',
  helpScopeNote:
    'Sie können überall im Übungsfenster tippen: Text oder {modifier} setzt den Fokus zurück ins Eingabefeld. Suche, Dialoge und Navigation funktionieren wie gewohnt. Das System kann Tastenkombinationen abfangen; nutzen Sie dann die Bildschirmtasten. Esc, {cancelModifiers} und das Verlassen des Feldes verwerfen das ausstehende Zeichen. Shift bleibt eine normale Zusatztaste.',
  inputSection: 'Typografische Tastaturbelegung ausprobieren',
  inputLabel: 'Text zum Ausprobieren der Belegung',
  inputPlaceholder: 'Schreiben Sie etwas…',
  resetLabel: 'Eingabefeld leeren',
  resetTooltip: 'Neu beginnen',
  keyboardTitle: 'Birman',
  keyHint: 'Taste {key}:',
  capsInstantHint: 'Taste {key}, sofortiger Sprachwechsel:',
  capsQuickHint: 'Taste {key}, schneller Sprachwechsel:',
  modeLabel: 'Modus:',
  languageSlotHint:
    'Wähle {slot} — {language}: Halte {caps} gedrückt und drücke {key}.',
  symbolEntryHint: 'Drücke {alt}, um den Symbolmodus zu aktivieren {mode}.',
  extendedEntryHint:
    'Drücke {alt} zweimal, um den erweiterten Modus zu aktivieren {mode}.',
  extendedNextHint:
    'Drücke {alt} erneut, um den erweiterten Modus zu aktivieren {mode}.',
  basicOutputHint:
    'Halte im Basismodus {mode} {alt} gedrückt und drücke {key}, um {symbol} einzugeben.',
  symbolOutputHint: 'Im Symbolmodus {mode} erzeugt sie {symbol}.',
  extendedOutputHint: 'Im erweiterten Modus {mode} erzeugt sie {symbol}.',
  chooseMode: 'Eingabemodus für die nächste Taste wählen',
  basicMode: 'Basis',
  primaryMode: 'Symbole',
  secondaryMode: 'erweitert',
  typingModes: 'Eingabemodi',
  keyboardScroll: 'Bildschirmtastatur. Bei Bedarf horizontal scrollen.',
  space: 'Leerzeichen',
  nonBreakingSpace: 'geschütztes Leerzeichen',
  primarySymbol: 'Symbolmodus, {modifier} einmal: {symbol}',
  secondarySymbol: 'Erweiterter Modus, {modifier} zweimal: {symbol}',
  emptyPrimary: 'Symbolmodus unbelegt',
  emptySecondary: 'Erweiterter Modus unbelegt',
  diacriticCycleHint:
    'Drücke Shift, um die diakritischen Varianten des eingegebenen Buchstabens durchzugehen.',
  languageSlotsHint:
    'Halte {caps} gedrückt und drücke {j} — {l1}, {k} — {l2}, {l} — {l3} oder {semicolon} — {l4}, um eine Sprache auszuwählen.',
  hintLabel: 'Hinweis:',
  hintsLabel: 'Hinweise:',
  typographyToggleHint:
    'Drücke beide {ctrl}-Tasten gleichzeitig und lasse sie los, um das Layout aus- oder einzuschalten.',
  typographyDisabledWarning:
    'Achtung: Das Layout ist ausgeschaltet. Drücke beide {ctrl}-Tasten gleichzeitig und lasse sie los, um es einzuschalten.',
  accentModeWarning:
    'Achtung: Der Betonungsmodus ist aktiv. Geben Sie einen Vokal ein.',
  keyDetailHelp:
    'Für den Symbolmodus {alt} drücken. Für den erweiterten Modus {alt} zweimal drücken.',
  resetMode: 'Mit {esc} den Modus zurücksetzen.',
  entered: 'Eingegeben: {symbol}',
  themeLight: 'Hell',
  themeDark: 'Dunkel',
  chooseTheme: 'Design wechseln zu: {theme}',
  themeMenu: 'Farbschema',
  themeTooltip: 'Design: {theme}',
  interfaceLanguage: 'Oberflächensprache',
  interfaceLanguageDescription:
    'Wähle die Oberflächensprache und ihre Basisbelegung.',
  closeInterfaceLanguage: 'Auswahl der Oberflächensprache schließen',
  chooseInterfaceLanguage: 'Oberflächensprache: {language}',
  keyboardLanguage: 'Tastatursprache',
  chooseKeyboardLanguage: 'Tastatursprache wählen: {language}',
  experimental: 'Experimentell',
  experimentalLanguageSupport:
    'Die Unterstützung außereuropäischer Sprachen ist experimentell. Zeichenumfang und Eingabeverfahren decken möglicherweise nicht alle sprachlichen Konventionen ab.',
  keyboardLanguageDescription: 'Für Beschriftung und Bildschirmeingabe.',
  closeKeyboardLanguage: 'Sprachauswahl schließen',
  keyboardLanguageList: 'Tastatursprachen',
  findLanguage: 'Sprache suchen…',
  languageNotFound: 'Keine Sprache gefunden',
  languageRu: 'Russisch',
  languageEn: 'Englisch',
  languagePl: 'Polnisch',
  languageFr: 'Französisch (Frankreich)',
  languageDe: 'Deutsch (Deutschland)',
  languageEs: 'Spanisch (Spanien)',
  languagePt: 'Portugiesisch (Portugal)',
  languageIt: 'Italienisch (Italien)',
  languageRo: 'Rumänisch (Rumänien)',
  languageHe: 'Hebräisch (Israel)',
  hebrewInputNote:
    'Hebräisch: Halten Sie die rechte {altKey}-Taste ({altGr}) für Niqqud und nationale Zeichen: {hebrewExamples}. Die linke {altKey}-Taste dient den typografischen Basisakkorden. {shiftKey}-Zyklen und Akut ersetzen keine hebräische Vokalisierung.',
  accentGrave: 'Gravis',
  accentCircumflex: 'Zirkumflex',
  accentBreve: 'Breve',
  accentRing: 'Ringakzent',
  accentDoubleacute: 'Doppelakut',
  accentDiaeresis: 'Trema',
  accentCedilla: 'Cedille',
  accentCaron: 'Hatschek',
  accentTilde: 'Tilde',
  accentAcute: 'Akut',
  keyBackspace: 'Rücktaste',
  keyTab: 'Tabulator',
  keyCapsLock: 'Feststelltaste',
  keyEnter: 'Eingabe',
  keyShift: 'Umschalt',
  keyCtrl: 'Ctrl',
  keyMeta: 'Super',
  keyAlt: 'Alt',
  keyMenu: 'Kontextmenü',
  platform: 'Plattform',
  choosePlatform: 'Plattform wählen: {platform}',
  fnKeyInfo: 'Fn wird von macOS verwaltet',
  tabInputHint:
    'Fügt einen Tabulator ein; keine zusätzlichen typografischen Funktionen.',
  backspaceInputHint:
    'Löscht die Auswahl oder das vorherige Zeichen; keine zusätzlichen typografischen Funktionen.',
  enterInputHint:
    'Fügt einen Zeilenumbruch ein; keine zusätzlichen typografischen Funktionen.',
  standardCharacterHint:
    'Gibt normale Zeichen ein; keine zusätzlichen typografischen Funktionen.',
  unusedKeyHint:
    'Die Taste {key} behält ihre Standardfunktion und ist nicht Teil des typografischen Layouts.',
  shiftUsageHint:
    'Halte {shift} für Großbuchstaben und obere Tastensymbole. Drücke und löse {shift} nach einem Buchstaben, um verfügbare diakritische Varianten durchzugehen.',
  altUsageHint:
    'Die Haupttaste für typografische Eingaben: ermöglicht zusätzliche Symbole und bei gedrückter Taste die Eingabe schneller Symbole.',
  keyArrowLeft: 'Pfeil nach links',
  keyArrowRight: 'Pfeil nach rechts',
  keyArrowUp: 'Pfeil nach oben',
  keyArrowDown: 'Pfeil nach unten',
} satisfies Messages;

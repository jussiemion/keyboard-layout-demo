import type { UiLocale } from './messages';

export const keyTerminology: Record<
  UiLocale,
  { switcher: string; modifier: string }
> = {
  en: {
    switcher: '{key} — Switcher: language switcher (S0–S4).',
    modifier: '{key} — Modifier: typing-mode modifier (M0–M2).',
  },
  ru: {
    switcher: '{key} — Switcher: переключатель языка (S0–S4).',
    modifier:
      '{key} — Modifier: модификатор, переключающий режимы ввода (M0–M2).',
  },
  pl: {
    switcher: '{key} — Switcher: przełącznik języka (S0–S4).',
    modifier:
      '{key} — Modifier: modyfikator przełączający tryby pisania (M0–M2).',
  },
  de: {
    switcher: '{key} — Switcher: Sprachumschalter (S0–S4).',
    modifier:
      '{key} — Modifier: Modifikator zum Wechseln des Eingabemodus (M0–M2).',
  },
  fr: {
    switcher: '{key} — Switcher: commutateur de langue (S0–S4).',
    modifier: '{key} — Modifier: modificateur du mode de saisie (M0–M2).',
  },
  es: {
    switcher: '{key} — Switcher: selector de idioma (S0–S4).',
    modifier: '{key} — Modifier: modificador del modo de escritura (M0–M2).',
  },
  pt: {
    switcher: '{key} — Switcher: seletor de idioma (S0–S4).',
    modifier: '{key} — Modifier: modificador do modo de escrita (M0–M2).',
  },
  it: {
    switcher: '{key} — Switcher: selettore della lingua (S0–S4).',
    modifier:
      '{key} — Modifier: modificatore della modalità di digitazione (M0–M2).',
  },
  ro: {
    switcher: '{key} — Switcher: comutator de limbă (S0–S4).',
    modifier: '{key} — Modifier: modificator al modului de tastare (M0–M2).',
  },
  nl: {
    switcher: '{key} — Switcher: taalschakelaar (S0–S4).',
    modifier: '{key} — Modifier: modificatietoets voor de invoermodus (M0–M2).',
  },
  tr: {
    switcher: '{key} — Switcher: dil değiştirici (S0–S4).',
    modifier: '{key} — Modifier: yazım modunu değiştiren değiştirici (M0–M2).',
  },
  vi: {
    switcher: '{key} — Switcher: bộ chuyển đổi ngôn ngữ (S0–S4).',
    modifier: '{key} — Modifier: phím bổ trợ chuyển chế độ nhập (M0–M2).',
  },
  ar: {
    switcher: '{key} — Switcher: مبدّل اللغة (S0–S4).',
    modifier: '{key} — Modifier: معدِّل يغيّر وضع الكتابة (M0–M2).',
  },
  he: {
    switcher: '{key} — Switcher: מחליף שפה (S0–S4).',
    modifier: '{key} — Modifier: מקש משנה להחלפת מצב ההקלדה (M0–M2).',
  },
};

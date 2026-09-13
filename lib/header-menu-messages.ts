import type { UiLocale } from './messages';

type MenuMessages = {
  menu: string;
  language: string;
  theme: string;
  help: string;
  source: string;
  settings: string;
  soon: string;
};

export const headerMenuMessages: Record<UiLocale, MenuMessages> = {
  tr: {
    menu: 'Menü',
    language: 'Arayüz dili',
    theme: 'Görünüm',
    help: 'Kısa başvuru',
    source: 'Kaynak kodu',
    settings: 'Ayarlar',
    soon: 'Yakında',
  },
  nl: {
    menu: 'Menu',
    language: 'Interfacetaal',
    theme: 'Weergave',
    help: 'Spiekbrief',
    source: 'Broncode',
    settings: 'Instellingen',
    soon: 'Binnenkort',
  },
  vi: {
    menu: 'Menu',
    language: 'Ngôn ngữ giao diện',
    theme: 'Giao diện',
    help: 'Bảng tra nhanh',
    source: 'Mã nguồn',
    settings: 'Cài đặt',
    soon: 'Sắp ra mắt',
  },
  ar: {
    menu: 'القائمة',
    language: 'لغة الواجهة',
    theme: 'المظهر',
    help: 'ورقة مرجعية',
    source: 'الكود المصدري',
    settings: 'الإعدادات',
    soon: 'قريبًا',
  },

  en: {
    menu: 'Menu',
    language: 'Language',
    theme: 'Appearance',
    help: 'Cheat sheet',
    source: 'Source code',
    settings: 'Settings',
    soon: 'Coming soon',
  },
  ru: {
    menu: 'Меню',
    language: 'Язык интерфейса',
    theme: 'Оформление',
    help: 'Шпаргалка',
    source: 'Исходный код',
    settings: 'Настройки',
    soon: 'Скоро',
  },
  he: {
    menu: 'תפריט',
    language: 'שפת הממשק',
    theme: 'מראה',
    help: 'דף עזר',
    source: 'קוד המקור',
    settings: 'הגדרות',
    soon: 'בקרוב',
  },
  de: {
    menu: 'Menü',
    language: 'Sprache',
    theme: 'Darstellung',
    help: 'Spickzettel',
    source: 'Quellcode',
    settings: 'Einstellungen',
    soon: 'Demnächst',
  },
  fr: {
    menu: 'Menu',
    language: 'Langue',
    theme: 'Apparence',
    help: 'Aide-mémoire',
    source: 'Code source',
    settings: 'Paramètres',
    soon: 'Bientôt',
  },
  es: {
    menu: 'Menú',
    language: 'Idioma',
    theme: 'Apariencia',
    help: 'Guía rápida',
    source: 'Código fuente',
    settings: 'Ajustes',
    soon: 'Próximamente',
  },
  it: {
    menu: 'Menu',
    language: 'Lingua',
    theme: 'Aspetto',
    help: 'Promemoria',
    source: 'Codice sorgente',
    settings: 'Impostazioni',
    soon: 'Prossimamente',
  },
  pl: {
    menu: 'Menu',
    language: 'Język',
    theme: 'Wygląd',
    help: 'Ściągawka',
    source: 'Kod źródłowy',
    settings: 'Ustawienia',
    soon: 'Wkrótce',
  },
  pt: {
    menu: 'Menu',
    language: 'Idioma',
    theme: 'Aparência',
    help: 'Guia rápido',
    source: 'Código-fonte',
    settings: 'Definições',
    soon: 'Em breve',
  },
  ro: {
    menu: 'Meniu',
    language: 'Limbă',
    theme: 'Aspect',
    help: 'Fișă de referință',
    source: 'Cod sursă',
    settings: 'Setări',
    soon: 'În curând',
  },
};

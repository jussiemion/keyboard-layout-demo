import type { UiLocale } from './messages';

type SettingsMessages = {
  title: string;
  map: string;
  pairHint: string;
  slotsHint: string;
  first: string;
  second: string;
  swap: string;
  reset: string;
  cancel: string;
  save: string;
  close: string;
  sessionOnly: string;
};

export const settingsMessages: Record<UiLocale, SettingsMessages> = {
  tr: {
    title: 'Ayarlar',
    map: 'Dil haritası',
    pairHint: 'Bu iki dil arasında geçmek için Caps Lock tuşuna basın.',
    slotsHint: 'Dil seçmek için Caps Lock basılıyken belirtilen tuşa basın.',
    first: 'Birinci dil',
    second: 'İkinci dil',
    swap: 'Dilleri yer değiştir',
    reset: 'Varsayılanları geri yükle',
    cancel: 'İptal',
    save: 'Kaydet',
    close: 'Kapat',
    sessionOnly:
      'Bu sekmede uygulandı. Tarayıcı depolaması kullanılamıyor; yenilemede ayarlar kaybolur.',
  },
  nl: {
    title: 'Instellingen',
    map: 'Taalindeling',
    pairHint: 'Druk op Caps Lock om tussen deze twee talen te wisselen.',
    slotsHint:
      'Houd Caps Lock vast en druk op de aangegeven toets om een taal te kiezen.',
    first: 'Eerste taal',
    second: 'Tweede taal',
    swap: 'Talen omwisselen',
    reset: 'Standaardwaarden herstellen',
    cancel: 'Annuleren',
    save: 'Opslaan',
    close: 'Sluiten',
    sessionOnly:
      'Toegepast in dit tabblad. Browseropslag is niet beschikbaar; bij herladen gaan de instellingen verloren.',
  },
  vi: {
    title: 'Cài đặt',
    map: 'Bản đồ ngôn ngữ',
    pairHint: 'Nhấn Caps Lock để đổi qua lại giữa hai ngôn ngữ này.',
    slotsHint: 'Giữ Caps Lock và nhấn phím chỉ định để chọn ngôn ngữ.',
    first: 'Ngôn ngữ thứ nhất',
    second: 'Ngôn ngữ thứ hai',
    swap: 'Đổi chỗ ngôn ngữ',
    reset: 'Khôi phục mặc định',
    cancel: 'Hủy',
    save: 'Lưu',
    close: 'Đóng',
    sessionOnly:
      'Đã áp dụng trong thẻ này. Bộ nhớ trình duyệt không khả dụng; cài đặt sẽ mất khi tải lại.',
  },
  ar: {
    title: 'الإعدادات',
    map: 'خريطة اللغات',
    pairHint: 'اضغط Caps Lock للتبديل بين هاتين اللغتين.',
    slotsHint: 'أبقِ Caps Lock مضغوطًا واضغط المفتاح المحدد لاختيار اللغة.',
    first: 'اللغة الأولى',
    second: 'اللغة الثانية',
    swap: 'تبديل ترتيب اللغتين',
    reset: 'استعادة الافتراضيات',
    cancel: 'إلغاء',
    save: 'حفظ',
    close: 'إغلاق',
    sessionOnly:
      'طُبّقت في علامة التبويب هذه. تخزين المتصفح غير متاح؛ ستُفقد الإعدادات عند إعادة التحميل.',
  },

  en: {
    title: 'Settings',
    map: 'Language map',
    pairHint: 'Tap Caps Lock to switch between these two languages.',
    slotsHint:
      'Hold Caps Lock and press the indicated key to select a language.',
    first: 'First language',
    second: 'Second language',
    swap: 'Swap languages',
    reset: 'Restore defaults',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    sessionOnly:
      'Applied for this tab. Browser storage is unavailable; these settings will not survive a reload.',
  },
  ru: {
    title: 'Настройки',
    map: 'Карта языков',
    pairHint: 'Нажимайте Caps Lock для переключения между этими двумя языками.',
    slotsHint:
      'Удерживайте Caps Lock и нажмите указанную клавишу для выбора языка.',
    first: 'Первый язык',
    second: 'Второй язык',
    swap: 'Поменять языки местами',
    reset: 'По умолчанию',
    cancel: 'Отмена',
    save: 'Сохранить',
    close: 'Закрыть',
    sessionOnly:
      'Применено в этой вкладке. Хранилище браузера недоступно: после перезагрузки настройки сбросятся.',
  },
  he: {
    title: 'הגדרות',
    map: 'מפת שפות',
    pairHint: 'לחצו על Caps Lock כדי לעבור בין שתי השפות האלה.',
    slotsHint: 'החזיקו Caps Lock ולחצו על המקש המצוין כדי לבחור שפה.',
    first: 'שפה ראשונה',
    second: 'שפה שנייה',
    swap: 'החלפת סדר השפות',
    reset: 'ברירת מחדל',
    cancel: 'ביטול',
    save: 'שמירה',
    close: 'סגירה',
    sessionOnly:
      'ההגדרות הוחלו בכרטיסייה זו. אחסון הדפדפן אינו זמין והן יאבדו ברענון.',
  },
  de: {
    title: 'Einstellungen',
    map: 'Sprachbelegung',
    pairHint: 'Mit Caps Lock zwischen diesen beiden Sprachen wechseln.',
    slotsHint:
      'Caps Lock halten und die angegebene Taste drücken, um eine Sprache auszuwählen.',
    first: 'Erste Sprache',
    second: 'Zweite Sprache',
    swap: 'Sprachen tauschen',
    reset: 'Standardwerte',
    cancel: 'Abbrechen',
    save: 'Speichern',
    close: 'Schließen',
    sessionOnly:
      'Für diesen Tab übernommen. Browserspeicher nicht verfügbar; nach dem Neuladen gehen die Einstellungen verloren.',
  },
  fr: {
    title: 'Paramètres',
    map: 'Affectation des langues',
    pairHint: 'Appuyez sur Caps Lock pour alterner entre ces deux langues.',
    slotsHint:
      'Maintenez Caps Lock et appuyez sur la touche indiquée pour choisir une langue.',
    first: 'Première langue',
    second: 'Deuxième langue',
    swap: 'Inverser les langues',
    reset: 'Valeurs par défaut',
    cancel: 'Annuler',
    save: 'Enregistrer',
    close: 'Fermer',
    sessionOnly:
      'Appliqué à cet onglet. Le stockage est indisponible ; les réglages seront perdus au rechargement.',
  },
  es: {
    title: 'Ajustes',
    map: 'Mapa de idiomas',
    pairHint: 'Pulsa Caps Lock para alternar entre estos dos idiomas.',
    slotsHint:
      'Mantén Caps Lock y pulsa la tecla indicada para elegir un idioma.',
    first: 'Primer idioma',
    second: 'Segundo idioma',
    swap: 'Intercambiar idiomas',
    reset: 'Restablecer valores',
    cancel: 'Cancelar',
    save: 'Guardar',
    close: 'Cerrar',
    sessionOnly:
      'Aplicado en esta pestaña. El almacenamiento no está disponible; los ajustes se perderán al recargar.',
  },
  it: {
    title: 'Impostazioni',
    map: 'Mappa delle lingue',
    pairHint: 'Premi Caps Lock per alternare queste due lingue.',
    slotsHint:
      'Tieni premuto Caps Lock e premi il tasto indicato per scegliere una lingua.',
    first: 'Prima lingua',
    second: 'Seconda lingua',
    swap: 'Scambia lingue',
    reset: 'Ripristina predefiniti',
    cancel: 'Annulla',
    save: 'Salva',
    close: 'Chiudi',
    sessionOnly:
      'Applicato in questa scheda. Archivio non disponibile; le impostazioni andranno perse al ricaricamento.',
  },
  pl: {
    title: 'Ustawienia',
    map: 'Mapa języków',
    pairHint: 'Naciśnij Caps Lock, aby przełączać te dwa języki.',
    slotsHint:
      'Przytrzymaj Caps Lock i naciśnij wskazany klawisz, aby wybrać język.',
    first: 'Pierwszy język',
    second: 'Drugi język',
    swap: 'Zamień języki',
    reset: 'Przywróć domyślne',
    cancel: 'Anuluj',
    save: 'Zapisz',
    close: 'Zamknij',
    sessionOnly:
      'Zastosowano w tej karcie. Pamięć przeglądarki jest niedostępna; ustawienia znikną po odświeżeniu.',
  },
  pt: {
    title: 'Definições',
    map: 'Mapa de idiomas',
    pairHint: 'Prima Caps Lock para alternar entre estes dois idiomas.',
    slotsHint:
      'Mantenha Caps Lock premido e prima a tecla indicada para escolher um idioma.',
    first: 'Primeiro idioma',
    second: 'Segundo idioma',
    swap: 'Trocar idiomas',
    reset: 'Repor predefinições',
    cancel: 'Cancelar',
    save: 'Guardar',
    close: 'Fechar',
    sessionOnly:
      'Aplicado neste separador. O armazenamento não está disponível; as definições perdem-se ao recarregar.',
  },
  ro: {
    title: 'Setări',
    map: 'Harta limbilor',
    pairHint: 'Apăsați Caps Lock pentru a alterna între aceste două limbi.',
    slotsHint:
      'Țineți apăsat Caps Lock și apăsați tasta indicată pentru a alege o limbă.',
    first: 'Prima limbă',
    second: 'A doua limbă',
    swap: 'Inversează limbile',
    reset: 'Valori implicite',
    cancel: 'Anulează',
    save: 'Salvează',
    close: 'Închide',
    sessionOnly:
      'Aplicat în această filă. Stocarea nu este disponibilă; setările se pierd la reîncărcare.',
  },
};

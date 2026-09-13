import type { UiLocale } from './messages';

type HelpMessages = {
  title: string;
  notes: string;
  symbols: string;
  accents: string;
  languages: string;
  actions: string;
  quickSymbols: string;
  hold: string;
  tap: string;
  twice: string;
  variants: string;
  stress: string;
  search: string;
  cancel: string;
  toggle: string;
  toggleKeys: string;
  pairNote: string;
  mappingNote: string;
  cycleBody: string;
  scopeInput: string;
  scopeUi: string;
};

export const helpMessages: Record<UiLocale, HelpMessages> = {
  tr: {
    notes: 'Notlar',
    toggleKeys: 'İki {ctrl} → bırak',
    title: 'Kısa başvuru',
    symbols: 'Simgeler ve modlar',
    accents: 'Aksanlar ve vurgu',
    languages: 'Dil haritası',
    actions: 'Hızlı işlemler',
    quickSymbols: 'Hızlı simgeler',
    hold: '{alt} basılıyken bir tuşa basın',
    tap: '{alt} tuşuna basıp bırakın, ardından bir tuşa basın',
    twice: '{alt} tuşuna iki kez, ardından bir tuşa basın',
    variants: 'Harften sonra: Shift varyantları dolaşır',
    stress: 'Vurgu: önce işaret, sonra ünlü',
    search: 'Simge bul',
    cancel: 'Bekleyen girişi iptal et',
    toggle: 'Düzeni aç / kapat',
    pairNote:
      '{s0} dil çiftini değiştirir; başka bir dilden çiftteki son kullanılan dile döner.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; fiziksel QWERTY konumlarıdır. Haritayı düzenleme: Menü → Ayarlar.',
    cycleBody: '{cycle} arasında geçiş için {caps} tuşuna basın.',
    scopeInput: 'Fiziksel yazım da seçilen klavye haritasını kullanır.',
    scopeUi:
      'Arayüz dili klavyeyi de seçer; klavye seçimi arayüzü veya işletim sistemini değiştirmez.',
  },
  nl: {
    notes: 'Opmerkingen',
    toggleKeys: 'Beide {ctrl} → loslaten',
    title: 'Spiekbrief',
    symbols: 'Symbolen en modi',
    accents: 'Diakritische tekens en klemtoon',
    languages: 'Taalindeling',
    actions: 'Snelle acties',
    quickSymbols: 'Snelle symbolen',
    hold: 'Houd {alt} vast en druk op een toets',
    tap: 'Druk op {alt}, laat los en druk op een toets',
    twice: 'Druk tweemaal op {alt} en daarna op een toets',
    variants: 'Na een letter: Shift doorloopt de varianten',
    stress: 'Klemtoon: eerst teken, dan klinker',
    search: 'Symbool zoeken',
    cancel: 'Wachtende invoer annuleren',
    toggle: 'Indeling aan / uit',
    pairNote:
      '{s0} wisselt het paar; vanuit een andere taal keert het terug naar de laatst gebruikte taal van het paar.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; zijn fysieke QWERTY-posities. Wijzigen: Menu → Instellingen.',
    cycleBody: 'Druk op {caps} voor {cycle}.',
    scopeInput: 'Ook fysiek typen gebruikt de gekozen toetsenbordkaart.',
    scopeUi:
      'De interfacetaal kiest ook het toetsenbord; een toetsenbordkeuze verandert de interface of het systeem niet.',
  },
  vi: {
    notes: 'Ghi chú',
    toggleKeys: 'Cả hai {ctrl} → thả',
    title: 'Bảng tra nhanh',
    symbols: 'Ký hiệu và chế độ',
    accents: 'Dấu và trọng âm',
    languages: 'Bản đồ ngôn ngữ',
    actions: 'Thao tác nhanh',
    quickSymbols: 'Ký hiệu nhanh',
    hold: 'Giữ {alt} và nhấn một phím',
    tap: 'Nhấn rồi thả {alt}, sau đó nhấn một phím',
    twice: 'Nhấn {alt} hai lần, sau đó nhấn một phím',
    variants: 'Sau chữ: Shift chuyển qua các biến thể',
    stress: 'Dấu nhấn: dấu trước, nguyên âm sau',
    search: 'Tìm ký hiệu',
    cancel: 'Hủy nhập đang chờ',
    toggle: 'Bật / tắt bố cục',
    pairNote:
      '{s0} đổi giữa cặp ngôn ngữ; từ ngôn ngữ khác sẽ trở về ngôn ngữ dùng gần nhất trong cặp.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; là vị trí vật lý QWERTY. Sửa bản đồ: Menu → Cài đặt.',
    cycleBody: 'Nhấn {caps} để chuyển qua {cycle}.',
    scopeInput: 'Nhập bằng bàn phím thật cũng dùng bản đồ phím đã chọn.',
    scopeUi:
      'Đổi ngôn ngữ giao diện cũng chọn bàn phím; đổi bàn phím không đổi giao diện hay hệ điều hành.',
  },
  ar: {
    notes: 'ملاحظات',
    toggleKeys: 'مفتاحا {ctrl} → اتركهما',
    title: 'ورقة مرجعية',
    symbols: 'الرموز والأوضاع',
    accents: 'العلامات والنبر',
    languages: 'خريطة اللغات',
    actions: 'إجراءات سريعة',
    quickSymbols: 'رموز سريعة',
    hold: 'أبقِ {alt} مضغوطًا واضغط مفتاحًا',
    tap: 'اضغط {alt} واتركه، ثم اضغط مفتاحًا',
    twice: 'اضغط {alt} مرتين، ثم اضغط مفتاحًا',
    variants: 'بعد الحرف: Shift يتنقل بين المتغيرات',
    stress: 'النبر: العلامة أولًا، ثم حرف العلة',
    search: 'البحث عن رمز',
    cancel: 'إلغاء الإدخال المنتظر',
    toggle: 'تشغيل / إيقاف التخطيط',
    pairNote:
      'يبدّل {s0} بين اللغتين؛ ومن لغة أخرى يعود إلى آخر لغة استُخدمت في الزوج.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; مواضع فعلية على QWERTY. تعديل الخريطة: القائمة ← الإعدادات.',
    cycleBody: 'اضغط {caps} للتنقل بين {cycle}.',
    scopeInput: 'تستخدم الكتابة الفعلية خريطة المفاتيح المختارة أيضًا.',
    scopeUi:
      'يختار تغيير لغة الواجهة لوحة المفاتيح أيضًا؛ تغيير لوحة المفاتيح لا يغيّر الواجهة أو النظام.',
  },

  ru: {
    notes: 'Примечания',
    toggleKeys: 'Оба {ctrl} → отпустить',
    title: 'Шпаргалка',
    symbols: 'Символы и режимы',
    accents: 'Диакритика и ударение',
    languages: 'Карта языков',
    actions: 'Быстрые действия',
    quickSymbols: 'Быстрые символы',
    hold: 'Удерживайте {alt} и нажмите клавишу',
    tap: 'Нажмите и отпустите {alt}, затем нажмите клавишу',
    twice: 'Дважды нажмите {alt}, затем нажмите клавишу',
    variants: 'После буквы: Shift перебирает варианты',
    stress: 'Ударение: сначала знак, затем гласная',
    search: 'Найти символ',
    cancel: 'Сбросить ожидающий ввод',
    toggle: 'Включить / выключить раскладку',
    pairNote:
      '{s0} переключает пару; из другого языка — возвращает последний язык пары.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; — физические позиции QWERTY. Изменить карту: Меню → Настройки.',
    cycleBody: 'Нажмите {caps} для переключения по кругу: {cycle}.',
    scopeInput:
      'При физическом вводе демо использует выбранную карту клавиатуры.',
    scopeUi: 'Язык интерфейса независим; язык клавиатуры ОС не меняется.',
  },
  en: {
    notes: 'Notes',
    toggleKeys: 'Both {ctrl} → release',
    title: 'Cheat sheet',
    symbols: 'Symbols & modes',
    accents: 'Diacritics & stress',
    languages: 'Language map',
    actions: 'Quick actions',
    quickSymbols: 'Quick symbols',
    hold: 'Hold {alt} and press a key',
    tap: 'Press and release {alt}, then press a key',
    twice: 'Press {alt} twice, then press a key',
    variants: 'After a letter: Shift cycles variants',
    stress: 'Stress: mark first, then a vowel',
    search: 'Find a symbol',
    cancel: 'Cancel pending input',
    toggle: 'Turn the layout on / off',
    pairNote:
      '{s0} switches the pair; from another language it returns to the last-used member.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; are physical QWERTY positions. Edit the map: Menu → Settings.',
    cycleBody: 'Press {caps} to cycle {cycle}.',
    scopeInput: 'The demo uses the selected keyboard map for physical typing.',
    scopeUi:
      'The interface language is independent; the OS input source is unchanged.',
  },
  he: {
    notes: 'הערות',
    toggleKeys: 'שני מקשי {ctrl} ← שחרור',
    title: 'דף עזר',
    symbols: 'סמלים ומצבים',
    accents: 'סימנים דיאקריטיים והטעמה',
    languages: 'מפת שפות',
    actions: 'פעולות מהירות',
    quickSymbols: 'סמלים מהירים',
    hold: 'החזיקו {alt} ולחצו על מקש',
    tap: 'לחצו ושחררו {alt}, ואז לחצו על מקש',
    twice: 'לחצו פעמיים על {alt}, ואז לחצו על מקש',
    variants: 'אחרי אות: Shift עובר בין הגרסאות',
    stress: 'הטעמה: קודם סימן, ואז תנועה',
    search: 'חיפוש סמל',
    cancel: 'ביטול קלט ממתין',
    toggle: 'הפעלה / כיבוי של הפריסה',
    pairNote: '{s0} מחליף בין שתי השפות; משפה אחרת הוא חוזר לשפה האחרונה בזוג.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; הם מיקומים פיזיים ב־QWERTY. עריכת המפה: תפריט ← הגדרות.',
    cycleBody: 'לחצו על {caps} להחלפה בין {cycle}.',
    scopeInput: 'ההדגמה משתמשת במפת המקלדת שנבחרה גם בהקלדה פיזית.',
    scopeUi: 'שפת הממשק עצמאית; שפת הקלט של מערכת ההפעלה אינה משתנה.',
  },
  de: {
    notes: 'Hinweise',
    toggleKeys: 'Beide {ctrl} → loslassen',
    title: 'Spickzettel',
    symbols: 'Symbole & Modi',
    accents: 'Diakritika & Betonung',
    languages: 'Sprachbelegung',
    actions: 'Schnellaktionen',
    quickSymbols: 'Schnelle Symbole',
    hold: '{alt} halten und eine Taste drücken',
    tap: '{alt} drücken und loslassen, dann eine Taste drücken',
    twice: '{alt} zweimal drücken, dann eine Taste drücken',
    variants: 'Nach dem Buchstaben: Shift wechselt Varianten',
    stress: 'Betonung: erst Zeichen, dann Vokal',
    search: 'Symbol suchen',
    cancel: 'Ausstehende Eingabe verwerfen',
    toggle: 'Layout ein- / ausschalten',
    pairNote:
      '{s0} wechselt das Paar; aus einer anderen Sprache kehrt es zur zuletzt verwendeten zurück.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; sind physische QWERTY-Positionen. Belegung ändern: Menü → Einstellungen.',
    cycleBody: '{caps} drücken: {cycle}.',
    scopeInput:
      'Die Demo verwendet die gewählte Belegung beim Tippen auf der physischen Tastatur.',
    scopeUi:
      'Die Oberflächensprache ist unabhängig; die Eingabequelle des Systems bleibt unverändert.',
  },
  fr: {
    notes: 'Remarques',
    toggleKeys: 'Les deux {ctrl} → relâcher',
    title: 'Aide-mémoire',
    symbols: 'Symboles et modes',
    accents: 'Diacritiques et accent',
    languages: 'Affectation des langues',
    actions: 'Actions rapides',
    quickSymbols: 'Symboles rapides',
    hold: 'Maintenez {alt} et appuyez sur une touche',
    tap: 'Appuyez sur {alt}, relâchez, puis appuyez sur une touche',
    twice: 'Appuyez deux fois sur {alt}, puis sur une touche',
    variants: 'Après la lettre : Shift parcourt les variantes',
    stress: 'Accent : le signe, puis une voyelle',
    search: 'Chercher un symbole',
    cancel: 'Annuler la saisie en attente',
    toggle: 'Activer / désactiver la disposition',
    pairNote:
      '{s0} alterne la paire ; depuis une autre langue, il revient à la dernière utilisée de la paire.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; sont les positions physiques QWERTY. Modifier : Menu → Paramètres.',
    cycleBody: 'Appuyez sur {caps} pour parcourir {cycle}.',
    scopeInput:
      'La démo utilise la disposition sélectionnée pour la saisie physique.',
    scopeUi:
      'La langue de l’interface est indépendante ; la source de saisie du système ne change pas.',
  },
  es: {
    notes: 'Notas',
    toggleKeys: 'Ambos {ctrl} → soltar',
    title: 'Guía rápida',
    symbols: 'Símbolos y modos',
    accents: 'Diacríticos y acento',
    languages: 'Mapa de idiomas',
    actions: 'Acciones rápidas',
    quickSymbols: 'Símbolos rápidos',
    hold: 'Mantén {alt} y pulsa una tecla',
    tap: 'Pulsa y suelta {alt}, luego pulsa una tecla',
    twice: 'Pulsa {alt} dos veces, luego pulsa una tecla',
    variants: 'Tras la letra: Shift recorre las variantes',
    stress: 'Acento: primero el signo, luego una vocal',
    search: 'Buscar un símbolo',
    cancel: 'Cancelar entrada pendiente',
    toggle: 'Activar / desactivar la distribución',
    pairNote:
      '{s0} alterna el par; desde otro idioma vuelve al último usado del par.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; son posiciones físicas QWERTY. Editar: Menú → Ajustes.',
    cycleBody: 'Pulsa {caps} para recorrer {cycle}.',
    scopeInput:
      'La demo usa el mapa seleccionado para escribir con el teclado físico.',
    scopeUi:
      'El idioma de la interfaz es independiente; no cambia la fuente de entrada del sistema.',
  },
  it: {
    notes: 'Note',
    toggleKeys: 'Entrambi i {ctrl} → rilasciare',
    title: 'Promemoria',
    symbols: 'Simboli e modalità',
    accents: 'Diacritici e accento',
    languages: 'Mappa delle lingue',
    actions: 'Azioni rapide',
    quickSymbols: 'Simboli rapidi',
    hold: 'Tieni premuto {alt} e premi un tasto',
    tap: 'Premi e rilascia {alt}, poi premi un tasto',
    twice: 'Premi {alt} due volte, poi premi un tasto',
    variants: 'Dopo la lettera: Shift scorre le varianti',
    stress: 'Accento: prima il segno, poi una vocale',
    search: 'Cercare un simbolo',
    cancel: 'Annullare input in attesa',
    toggle: 'Attivare / disattivare la disposizione',
    pairNote:
      '{s0} alterna la coppia; da un’altra lingua torna all’ultima usata della coppia.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; sono posizioni fisiche QWERTY. Modifica: Menu → Impostazioni.',
    cycleBody: 'Premi {caps} per scorrere {cycle}.',
    scopeInput: 'La demo usa la mappa selezionata per la digitazione fisica.',
    scopeUi:
      'La lingua dell’interfaccia è indipendente; la sorgente di input del sistema non cambia.',
  },
  pl: {
    notes: 'Uwagi',
    toggleKeys: 'Oba {ctrl} → zwolnij',
    title: 'Ściągawka',
    symbols: 'Symbole i tryby',
    accents: 'Diakrytyka i akcent',
    languages: 'Mapa języków',
    actions: 'Szybkie działania',
    quickSymbols: 'Szybkie symbole',
    hold: 'Przytrzymaj {alt} i naciśnij klawisz',
    tap: 'Naciśnij i zwolnij {alt}, potem naciśnij klawisz',
    twice: 'Naciśnij {alt} dwa razy, potem naciśnij klawisz',
    variants: 'Po literze: Shift przełącza warianty',
    stress: 'Akcent: najpierw znak, potem samogłoska',
    search: 'Znajdź symbol',
    cancel: 'Anuluj oczekujący znak',
    toggle: 'Włącz / wyłącz układ',
    pairNote:
      '{s0} przełącza parę; z innego języka wraca do ostatnio używanego z pary.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; to fizyczne pozycje QWERTY. Zmień mapę: Menu → Ustawienia.',
    cycleBody: 'Naciśnij {caps}, aby przełączać kolejno {cycle}.',
    scopeInput: 'Demo używa wybranej mapy do pisania na fizycznej klawiaturze.',
    scopeUi:
      'Język interfejsu jest niezależny; źródło wprowadzania systemu się nie zmienia.',
  },
  pt: {
    notes: 'Notas',
    toggleKeys: 'Ambos os {ctrl} → soltar',
    title: 'Guia rápido',
    symbols: 'Símbolos e modos',
    accents: 'Diacríticos e acento',
    languages: 'Mapa de idiomas',
    actions: 'Ações rápidas',
    quickSymbols: 'Símbolos rápidos',
    hold: 'Mantém {alt} premido e prime uma tecla',
    tap: 'Prime e solta {alt}, depois prime uma tecla',
    twice: 'Prime {alt} duas vezes, depois prime uma tecla',
    variants: 'Após a letra: Shift percorre as variantes',
    stress: 'Acento: primeiro o sinal, depois uma vogal',
    search: 'Procurar símbolo',
    cancel: 'Cancelar entrada pendente',
    toggle: 'Ativar / desativar a disposição',
    pairNote:
      '{s0} alterna o par; de outro idioma regressa ao último utilizado do par.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; são posições físicas QWERTY. Editar: Menu → Definições.',
    cycleBody: 'Prima {caps} para percorrer {cycle}.',
    scopeInput:
      'A demonstração usa o mapa selecionado para escrever no teclado físico.',
    scopeUi:
      'O idioma da interface é independente; a fonte de entrada do sistema não muda.',
  },
  ro: {
    notes: 'Note',
    toggleKeys: 'Ambele {ctrl} → eliberează',
    title: 'Fișă de referință',
    symbols: 'Simboluri și moduri',
    accents: 'Diacritice și accent',
    languages: 'Harta limbilor',
    actions: 'Acțiuni rapide',
    quickSymbols: 'Simboluri rapide',
    hold: 'Ține apăsat {alt} și apasă o tastă',
    tap: 'Apasă și eliberează {alt}, apoi apasă o tastă',
    twice: 'Apasă {alt} de două ori, apoi apasă o tastă',
    variants: 'După literă: Shift parcurge variantele',
    stress: 'Accent: întâi semnul, apoi vocala',
    search: 'Caută un simbol',
    cancel: 'Anulează introducerea în așteptare',
    toggle: 'Activează / dezactivează dispunerea',
    pairNote:
      '{s0} alternează perechea; din altă limbă revine la ultima utilizată din pereche.',
    mappingNote:
      '{s0} = Caps Lock. J K L ; sunt poziții fizice QWERTY. Modifică: Meniu → Setări.',
    cycleBody: 'Apasă {caps} pentru a parcurge {cycle}.',
    scopeInput:
      'Demo-ul folosește dispunerea selectată pentru tastarea fizică.',
    scopeUi:
      'Limba interfeței este independentă; sursa de introducere a sistemului nu se schimbă.',
  },
};

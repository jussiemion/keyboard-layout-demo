import type { UiLocale } from './messages';

type TourMessages = {
  menu: string;
  invite: string;
  inviteBody: string;
  start: string;
  decline: string;
  later: string;
  ack: string;
  question: string;
  questionBody: string;
  yes: string;
  no: string;
  exit: string;
  next: string;
  skip: string;
  back: string;
  retry: string;
  success: string;
  practice: string;
  type: string;
  switchTo: string;
  screenChord: string;
  optional: string;
  optionalBody: string;
  startTest: string;
  finish: string;
  done: string;
  doneBody: string;
  progress: string;
  error: string;
  spaceNote: string;
  storageNote: string;
  steps: Record<
    | 'birman'
    | 'extended'
    | 'accent'
    | 'quick'
    | 'modes'
    | 'stress'
    | 'postfix'
    | 'hebrew'
    | 'pair'
    | 'slot'
    | 'off'
    | 'on'
    | 'search'
    | 'settings'
    | 'help',
    string
  >;
};
export const tourMessages: Record<UiLocale, TourMessages> = {
  tr: {
    menu: 'Öğretici tur',
    invite: 'Düzeni keşfetmek ister misiniz?',
    inviteBody: 'Klavyede birkaç kısa görev. İstediğiniz zaman çıkabilirsiniz.',
    start: 'Turu başlat',
    decline: 'Şimdi değil',
    later: 'Tur her zaman menüde bulunur.',
    ack: 'Anladım',
    question: 'Birman düzenini biliyor musunuz?',
    questionBody: 'Biliyorsanız simgeleri atlayıp yeni özelliklere geçeceğiz.',
    yes: 'Evet, biliyorum',
    no: 'Hayır, gösterin',
    exit: 'Turu bitir',
    next: 'İleri',
    skip: 'Atla',
    back: 'Geri',
    retry: 'Yeniden dene',
    success: 'Oldu!',
    practice:
      'Yazın veya ekran tuşlarına tıklayın. Turdan sonra metniniz ve diliniz geri yüklenir.',
    type: 'Yazın',
    switchTo: 'Şuna geçin',
    screenChord: 'Birleşimi ekranda uygula',
    optional: 'Son görev — isteğe bağlı',
    optionalBody:
      'Bağımsız aksanlar ve bölünemez boşluk dahil tüm Birman simgelerini içeren örneği yazın. Süre sınırı yok; istediğiniz zaman durabilirsiniz.',
    startTest: 'Testi başlat',
    finish: 'Bitir',
    done: 'Tur tamamlandı',
    doneBody: 'Denemeye devam edin. Kısa başvuru üst çubukta, tur menüde.',
    progress: 'Adım {current} / {total}',
    error: 'Eşleşmeyen bir karakter var. Düzeltin veya yeniden başlayın.',
    spaceNote:
      '{nbsp}, bölünemez boşluktur. Bağımsız aksan için {m2} içinde seçip {space} tuşuna basın.',
    storageNote:
      'Tarayıcı seçimi kaydedemedi. Bu oturumda davet gizli kalacak.',
    steps: {
      birman:
        'Birman simgeleriyle başlayalım. {alt} tuşuna basıp bırakın, sonra fiziksel {keyC}: {copyright} yazılır. Ekrandaki aynı tuşları da kullanabilirsiniz.',
      extended:
        'İkinci katman: {alt} tuşuna iki kez, ardından {key2} tuşuna basın: {fraction}.',
      accent:
        'Önce işaret: {alt}, {alt}, {key6}, sonra {lowerA}. Düzeltme işareti harfle birleşir: {circumflex}.',
      quick:
        'Hızlı giriş: {alt} basılıyken {minus} tuşuna basın. Ekranda önce {alt}, sonra {minus} tıklayın.',
      modes:
        'Klavyenin üstünden {m2} seçin veya {alt} tuşuna iki kez basın. Mod bir sonraki simge içindir.',
      stress:
        'Önce vurgu, sonra ünlü: {alt}, {alt}, {slash}, {lowerA} → {stressed}. {esc} bekleyen işareti iptal eder.',
      postfix:
        'Şimdi Lehçe seçili. {lowerA} yazıp {shift} tuşuna basıp bırakın: {plainA}, {ogonek} olur. Tekrar basmak döngüyü sürdürür. Ekranda {shift} tuşuna iki kez tıklayın: bas ve bırak. Altı çizili harfi hâlâ {shift} ile değiştirebilirsiniz.',
      hebrew:
        'Şimdi İbranice seçili; bir harf hazır. Şeva eklemek için sağ {alt} ({altGr}) basılıyken fiziksel {keyA} tuşuna basın. Sol {alt} tipografi içindir.',
      pair: 'Çiftinizdeki ikinci dile geçmek için {s0} ({capsLock}) tuşuna basın. Tekrar basmak geri döner.',
      slot: '{s0} basılıyken fiziksel {key} tuşuna basın: bu {slot}. Dil ayarlarınızdan gelir. Aşağıdaki ekran birleşimini de kullanabilirsiniz.',
      off: 'Tipografiyi kapatmak için iki {ctrl} tuşuna birlikte basıp bırakın. Normal yazım devam eder.',
      on: 'Tipografiyi açmak için iki {ctrl} birleşimini tekrarlayın.',
      search:
        'Aramayı {capsLock} + {keyF} ile açın. {copyright} işaretini bulun, kısayoluna bakın, aramayı kapatıp simgeyi yazın.',
      settings:
        "Menüden Ayarlar'ı açın: {s0} çifti, {slots} dilleri burada. Açmak yeterli; kaydetmeniz gerekmez.",
      help: '{capsLock} + {keyH} ile kısayol rehberini açın. Kombinasyonlara bakın, ardından devam etmek için kapatın.',
    },
  },
  nl: {
    menu: 'Rondleiding',
    invite: 'De indeling ontdekken?',
    inviteBody: 'Een paar korte toetsenbordopdrachten. Stop wanneer je wilt.',
    start: 'Rondleiding starten',
    decline: 'Nu niet',
    later: 'De rondleiding staat altijd in het menu.',
    ack: 'Begrepen',
    question: 'Ken je de Birman-indeling al?',
    questionBody:
      'Dan slaan we de symbolen over en gaan we naar de nieuwe functies.',
    yes: 'Ja, die ken ik',
    no: 'Nee, laat maar zien',
    exit: 'Rondleiding beëindigen',
    next: 'Volgende',
    skip: 'Overslaan',
    back: 'Vorige',
    retry: 'Opnieuw proberen',
    success: 'Gelukt!',
    practice:
      'Typ of klik op de schermtoetsen. Je tekst en taal worden na de rondleiding hersteld.',
    type: 'Typ',
    switchTo: 'Schakel naar',
    screenChord: 'Combinatie op het scherm indrukken',
    optional: 'Een laatste uitdaging — optioneel',
    optionalBody:
      'Typ een voorbeeld met alle Birman-symbolen, losse accenten en een vaste spatie. Geen tijdslimiet; je kunt altijd stoppen.',
    startTest: 'Test starten',
    finish: 'Afronden',
    done: 'Rondleiding voltooid',
    doneBody:
      'Experimenteer gerust verder. De spiekbrief staat bovenaan, de rondleiding in het menu.',
    progress: 'Stap {current} van {total}',
    error: 'Er is een afwijking. Verbeter die of probeer opnieuw.',
    spaceNote:
      '{nbsp} staat voor een vaste spatie. Kies voor een los accent het teken in {m2} en druk op {space}.',
    storageNote:
      'Je browser kon deze keuze niet opslaan. De uitnodiging blijft deze sessie verborgen.',
    steps: {
      birman:
        'Begin met Birman-symbolen. Druk op {alt}, laat los en druk op fysieke {keyC} voor {copyright}. Je kunt ook de schermtoetsen gebruiken.',
      extended:
        'Tweede laag: druk tweemaal op {alt} en daarna op {key2} voor de breuk {fraction}.',
      accent:
        'Eerst het accent: {alt}, {alt}, {key6}, dan {lowerA}. De circumflex vormt {circumflex}.',
      quick:
        'Snel typen: houd {alt} vast en druk op {minus}. Klik op het scherm op {alt} en dan op {minus}.',
      modes:
        'Kies {m2} boven het toetsenbord of druk tweemaal op {alt}. De modus geldt voor het volgende symbool.',
      stress:
        'Eerst klemtoon: {alt}, {alt}, {slash}, {lowerA} → {stressed}. {esc} annuleert het wachtende accent.',
      postfix:
        'Pools is nu geselecteerd. Typ {lowerA} en druk op {shift}, laat los: {plainA} wordt {ogonek}. Herhaal voor de volgende variant. Klik op het scherm tweemaal op {shift}: indrukken en loslaten. De onderstreepte letter kun je nog met {shift} wijzigen.',
      hebrew:
        'Hebreeuws is geselecteerd; er staat al een letter. Houd rechter {alt} ({altGr}) vast en druk op fysieke {keyA} voor sjwa. Linker {alt} is voor typografie.',
      pair: 'Druk op {s0} ({capsLock}) voor de tweede taal van je paar. Druk nogmaals om terug te gaan.',
      slot: 'Houd {s0} vast en druk op fysieke {key}: dit is {slot}. De taal komt uit je instellingen. De combinatieknop hieronder werkt ook.',
      off: 'Druk beide {ctrl}-toetsen samen in en laat los om typografie uit te zetten. Gewoon typen blijft werken.',
      on: 'Herhaal de combinatie met beide {ctrl}-toetsen om typografie aan te zetten.',
      search:
        'Open zoeken met {capsLock} + {keyF}. Zoek {copyright}, bekijk de combinatie, sluit zoeken en typ het symbool.',
      settings:
        'Open Instellingen in het menu voor het {s0}-paar, {slots}-talen. Alleen openen is voldoende; wijzigen hoeft niet.',
      help: 'Open het spiekbriefje met {capsLock} + {keyH}. Bekijk de combinaties en sluit het om verder te gaan.',
    },
  },
  vi: {
    menu: 'Hướng dẫn từng bước',
    invite: 'Khám phá bố cục?',
    inviteBody: 'Vài bài tập ngắn trên bàn phím. Có thể thoát bất cứ lúc nào.',
    start: 'Bắt đầu hướng dẫn',
    decline: 'Để sau',
    later: 'Hướng dẫn luôn có trong menu.',
    ack: 'Đã hiểu',
    question: 'Bạn đã biết bố cục Birman chưa?',
    questionBody:
      'Nếu có, ta sẽ bỏ qua phần ký hiệu và đến thẳng tính năng mới.',
    yes: 'Có, tôi biết rồi',
    no: 'Chưa, hãy chỉ cho tôi',
    exit: 'Kết thúc hướng dẫn',
    next: 'Tiếp',
    skip: 'Bỏ qua',
    back: 'Quay lại',
    retry: 'Thử lại',
    success: 'Thành công!',
    practice:
      'Gõ hoặc nhấn phím màn hình. Văn bản và ngôn ngữ ban đầu sẽ được khôi phục sau hướng dẫn.',
    type: 'Nhập',
    switchTo: 'Chuyển sang',
    screenChord: 'Nhấn tổ hợp trên màn hình',
    optional: 'Thử thách cuối — không bắt buộc',
    optionalBody:
      'Nhập đoạn mẫu có tất cả ký hiệu Birman, gồm dấu đứng riêng và dấu cách không ngắt. Không giới hạn thời gian; dừng lúc nào cũng được.',
    startTest: 'Bắt đầu thử thách',
    finish: 'Hoàn tất',
    done: 'Đã hoàn thành hướng dẫn',
    doneBody:
      'Hãy tiếp tục khám phá. Bảng tra nhanh ở đầu trang, hướng dẫn ở trong menu.',
    progress: 'Bước {current} / {total}',
    error: 'Có ký tự không khớp. Hãy sửa hoặc thử lại.',
    spaceNote:
      '{nbsp} là dấu cách không ngắt. Để nhập dấu đứng riêng, chọn dấu trong {m2} rồi nhấn {space}.',
    storageNote:
      'Trình duyệt không lưu được lựa chọn. Lời mời sẽ ẩn trong phiên này.',
    steps: {
      birman:
        'Bắt đầu với ký hiệu Birman. Nhấn rồi thả {alt}, sau đó nhấn phím vật lý {keyC} để nhập {copyright}. Cũng có thể dùng phím màn hình.',
      extended:
        'Lớp thứ hai: nhấn {alt} hai lần, rồi {key2} để nhập phân số {fraction}.',
      accent:
        'Dấu trước: {alt}, {alt}, {key6}, rồi {lowerA}. Dấu mũ kết hợp với chữ: {circumflex}.',
      quick:
        'Nhập nhanh: giữ {alt} và nhấn {minus}. Trên màn hình, nhấn {alt} rồi {minus}.',
      modes:
        'Chọn {m2} phía trên bàn phím hoặc nhấn {alt} hai lần. Chế độ áp dụng cho ký hiệu tiếp theo.',
      stress:
        'Dấu nhấn trước: {alt}, {alt}, {slash}, {lowerA} → {stressed}. {esc} hủy dấu đang chờ.',
      postfix:
        'Đang chọn tiếng Ba Lan. Nhập {lowerA}, rồi nhấn và thả {shift}: {plainA} thành {ogonek}. Nhấn tiếp để chuyển biến thể. Trên màn hình, nhấn {shift} hai lần: giữ và thả. Bạn vẫn có thể đổi chữ được gạch chân bằng {shift}.',
      hebrew:
        'Đang chọn tiếng Hebrew; đã có sẵn một chữ. Giữ {alt} phải ({altGr}) và nhấn phím vật lý {keyA} để thêm sheva. {alt} trái dùng cho kiểu chữ.',
      pair: 'Nhấn {s0} ({capsLock}) để sang ngôn ngữ thứ hai trong cặp. Nhấn lại để quay về.',
      slot: 'Giữ {s0} và nhấn phím vật lý {key}: đây là {slot}. Ngôn ngữ lấy từ cài đặt của bạn. Có thể dùng nút tổ hợp bên dưới.',
      off: 'Nhấn đồng thời hai phím {ctrl}, rồi thả để tắt kiểu chữ. Vẫn nhập được văn bản thông thường.',
      on: 'Lặp lại tổ hợp hai phím {ctrl} để bật kiểu chữ.',
      search:
        'Mở tìm kiếm bằng {capsLock} + {keyF}. Tìm {copyright}, xem phím tắt, đóng tìm kiếm rồi nhập ký hiệu.',
      settings:
        'Mở Cài đặt trong menu để xem cặp {s0}, ngôn ngữ {slots}. Chỉ cần mở là hoàn thành; không cần lưu thay đổi.',
      help: 'Mở bảng phím tắt bằng {capsLock} + {keyH}. Xem các tổ hợp rồi đóng để tiếp tục.',
    },
  },
  ar: {
    menu: 'جولة تعليمية',
    invite: 'هل تريد التعرّف على التخطيط؟',
    inviteBody: 'بضع مهام قصيرة على لوحة المفاتيح. يمكنك المغادرة متى شئت.',
    start: 'بدء الجولة',
    decline: 'ليس الآن',
    later: 'الجولة متاحة دائمًا في القائمة.',
    ack: 'فهمت',
    question: 'هل تعرف تخطيط بيرمان؟',
    questionBody: 'إن كنت تعرفه، سنتجاوز رموزه وننتقل إلى الميزات الجديدة.',
    yes: 'نعم، أعرفه',
    no: 'لا، أرِني',
    exit: 'إنهاء الجولة',
    next: 'التالي',
    skip: 'تخطّي',
    back: 'السابق',
    retry: 'إعادة المحاولة',
    success: 'نجحت!',
    practice: 'اكتب أو انقر مفاتيح الشاشة. يُستعاد نصك ولغتك بعد الجولة.',
    type: 'اكتب',
    switchTo: 'انتقل إلى',
    screenChord: 'اضغط المجموعة على الشاشة',
    optional: 'تحدٍّ أخير — اختياري',
    optionalBody:
      'اكتب نموذجًا يحتوي جميع رموز بيرمان، بما فيها العلامات المستقلة والمسافة غير الفاصلة. دون مؤقت؛ يمكنك التوقف متى شئت.',
    startTest: 'بدء الاختبار',
    finish: 'إنهاء',
    done: 'اكتملت الجولة',
    doneBody: 'واصل التجربة. الورقة المرجعية في الترويسة والجولة في القائمة.',
    progress: 'الخطوة {current} من {total}',
    error: 'يوجد اختلاف. صحّحه أو حاول مجددًا.',
    spaceNote:
      'يمثّل {nbsp} مسافة غير فاصلة. لعلامة مستقلة، اخترها في {m2} واضغط {space}.',
    storageNote:
      'تعذّر على المتصفح حفظ الاختيار. ستبقى الدعوة مخفية في هذه الجلسة.',
    steps: {
      birman:
        'ابدأ برموز بيرمان. اضغط {alt} واتركه، ثم {keyC} الفعلي لكتابة {copyright}. يمكنك النقر على مفاتيح الشاشة أيضًا.',
      extended:
        'الطبقة الثانية: اضغط {alt} مرتين ثم {key2} لكتابة الكسر {fraction}.',
      accent:
        'العلامة أولًا: {alt}، {alt}، {key6}، ثم {lowerA}. تتصل العلامة بالحرف: {circumflex}.',
      quick:
        'إدخال سريع: اضغط {alt} مع {minus}. على الشاشة انقر {alt} ثم {minus}.',
      modes:
        'اختر {m2} فوق لوحة المفاتيح أو اضغط {alt} مرتين. ينطبق الوضع على الرمز التالي.',
      stress:
        'النبر أولًا ثم حرف العلة: {alt}، {alt}، {slash}، {lowerA} → {stressed}. يلغي {esc} العلامة المنتظرة.',
      postfix:
        'البولندية مختارة الآن. اكتب {lowerA} ثم اضغط {shift} واتركه: يصبح {plainA} هو {ogonek}. كرّر لمتابعة الدورة. على الشاشة انقر {shift} مرتين: ضغط ثم تحرير. يمكنك تغيير الحرف المسطّر باستخدام {shift}.',
      hebrew:
        'العبرية مختارة الآن وحرف مُدخل مسبقًا. اضغط {alt} الأيمن ({altGr}) مع {keyA} الفعلي لإضافة الشِّوا. {alt} الأيسر للرموز الطباعية.',
      pair: 'اضغط {s0} ({capsLock}) للانتقال إلى اللغة الثانية في زوجك. اضغط مجددًا للعودة.',
      slot: 'اضغط {s0} مع {key} الفعلي: هذا {slot}. تُؤخذ اللغة من إعداداتك. يمكنك استخدام زر المجموعة أدناه.',
      off: 'اضغط مفتاحَي {ctrl} معًا ثم اتركهما لإيقاف الطباعة الخاصة. تبقى الكتابة العادية متاحة.',
      on: 'كرّر مجموعة مفتاحَي {ctrl} لتشغيل الطباعة الخاصة.',
      search:
        'افتح البحث باستخدام {capsLock} + {keyF}. ابحث عن {copyright}، واقرأ اختصاره، ثم أغلق البحث واكتب الرمز.',
      settings:
        'افتح الإعدادات من القائمة: فيها زوج {s0} ولغات {slots}. يكفي فتحها؛ لا حاجة لحفظ تغييرات.',
      help: 'افتح دليل الاختصارات باستخدام {capsLock} + {keyH}. راجع الاختصارات ثم أغلقه للمتابعة.',
    },
  },

  ru: {
    menu: 'Обучающий тур',
    invite: 'Познакомиться с раскладкой?',
    inviteBody:
      'Несколько коротких заданий прямо на клавиатуре. Можно выйти в любой момент.',
    start: 'Начать тур',
    decline: 'Не сейчас',
    later: 'Тур всегда доступен в меню.',
    ack: 'Понятно',
    question: 'Знакомы ли вы с раскладкой Бирмана?',
    questionBody:
      'Если да, пропустим знакомство с её символами и перейдём к новым возможностям.',
    yes: 'Да, знаком',
    no: 'Нет, покажите',
    exit: 'Завершить тур',
    next: 'Далее',
    skip: 'Пропустить',
    back: 'Назад',
    retry: 'Заново',
    success: 'Получилось!',
    practice:
      'Печатайте с клавиатуры или нажимайте экранные клавиши. Исходный текст и язык восстановятся после тура.',
    type: 'Наберите',
    switchTo: 'Переключитесь на',
    screenChord: 'Нажать сочетание на экране',
    optional: 'Последний вызов — по желанию',
    optionalBody:
      'Наберите образец со всеми символами раскладки Бирмана, включая отдельные диакритические знаки и неразрывный пробел. Без таймера; можно передумать в любой момент.',
    startTest: 'Начать тест',
    finish: 'Завершить',
    done: 'Тур завершён',
    doneBody:
      'Дальше можно экспериментировать самостоятельно. Шпаргалка — в шапке, тур — в меню.',
    progress: 'Шаг {current} из {total}',
    error: 'Есть несовпадение. Исправьте его или начните заново.',
    spaceNote:
      'Знак {nbsp} обозначает неразрывный пробел. Диакритический знак отдельно: выберите его в {m2} и нажмите {space}.',
    storageNote:
      'Браузер не разрешил сохранить выбор. В этом сеансе приглашение больше не появится.',
    steps: {
      birman:
        'В основе — символы Бирмана. Нажмите и отпустите {alt}, затем физическую {keyC}: получится {copyright}. На экране можно нажимать те же клавиши.',
      extended:
        'Второй слой: дважды нажмите {alt}, затем {key2} — получите дробь {fraction}.',
      accent:
        'Знак перед буквой: {alt}, {alt}, {key6}, затем {lowerA}. Циркумфлекс соединится с буквой: {circumflex}.',
      quick:
        'Быстрый набор: удерживайте {alt} и нажмите {minus}. На экране нажмите {alt}, затем {minus}.',
      modes:
        'Выберите {m2} кнопкой над клавиатурой или дважды нажмите {alt}. Это режим для следующего символа.',
      stress:
        'Сначала ударение, затем гласная: {alt}, {alt}, {slash}, {lowerA} → {stressed}. {esc} отменяет ожидающий знак.',
      postfix:
        'Сейчас включён польский. Наберите {lowerA}, затем нажмите и отпустите {shift}: {plainA} превратится в {ogonek}. Следующее нажатие продолжает цикл. На экране нажмите {shift} дважды: зажать и отпустить. Подчёркнутую букву ещё можно изменить клавишей {shift}.',
      hebrew:
        'Сейчас включён иврит; буква уже введена. Удерживайте правый {alt} ({altGr}) и нажмите физическую {keyA}, чтобы добавить шва. Левый {alt} служит для типографики.',
      pair: 'Нажмите {s0} ({capsLock}), чтобы перейти ко второму языку вашей пары. Повторное нажатие вернёт первый.',
      slot: 'Удерживайте {s0} и нажмите физическую {key}: это {slot}. Назначение взято из ваших настроек. На экране можно использовать кнопку сочетания ниже.',
      off: 'Нажмите оба {ctrl} одновременно и отпустите: типографика выключится. Обычный ввод останется доступен.',
      on: 'Повторите сочетание обоих {ctrl}, чтобы снова включить типографику.',
      search:
        'Удерживайте {capsLock} и нажмите {keyF}, чтобы открыть поиск. Найдите {copyright}, посмотрите сочетание, закройте поиск и наберите символ.',
      settings:
        'Откройте «Настройки» в меню: здесь меняются пара {s0}, языки {slots}. Для задания достаточно открыть окно; сохранять изменения не нужно.',
      help: 'Удерживайте {capsLock} и нажмите {keyH}, чтобы открыть шпаргалку. Посмотрите сочетания и закройте её, чтобы продолжить.',
    },
  },
  en: {
    menu: 'Guided tour',
    invite: 'Explore the layout?',
    inviteBody: 'A few short tasks on the keyboard. Leave whenever you like.',
    start: 'Start tour',
    decline: 'Not now',
    later: 'The tour is always available in the menu.',
    ack: 'Got it',
    question: 'Are you familiar with the Birman layout?',
    questionBody:
      'If so, we will skip its symbols and go straight to the new features.',
    yes: 'Yes, I am',
    no: 'No, show me',
    exit: 'End tour',
    next: 'Next',
    skip: 'Skip',
    back: 'Back',
    retry: 'Try again',
    success: 'Well done!',
    practice:
      'Type or click the on-screen keys. Your original text and language return after the tour.',
    type: 'Type',
    switchTo: 'Switch to',
    screenChord: 'Press the chord on screen',
    optional: 'One last challenge — optional',
    optionalBody:
      'Type a sample containing every Birman symbol, including standalone accent marks and a non-breaking space. No timer; you can stop at any time.',
    startTest: 'Start test',
    finish: 'Finish',
    done: 'Tour complete',
    doneBody:
      'Keep experimenting. The cheat sheet is in the header; the tour is in the menu.',
    progress: 'Step {current} of {total}',
    error: 'There is a mismatch. Correct it or try again.',
    spaceNote:
      '{nbsp} stands for a non-breaking space. For a standalone accent, select it in {m2} and press {space}.',
    storageNote:
      'Your browser could not save this choice. The invitation stays hidden for this session.',
    steps: {
      birman:
        'Start with Birman symbols. Press and release {alt}, then physical {keyC} to type {copyright}. You can also click the same on-screen keys.',
      extended:
        'The second layer: press {alt} twice, then {key2} to type the fraction {fraction}.',
      accent:
        'Mark before letter: {alt}, {alt}, {key6}, then {lowerA}. The circumflex combines with the letter: {circumflex}.',
      quick:
        'Quick entry: hold {alt} and press {minus}. On screen, click {alt}, then {minus}.',
      modes:
        'Choose {m2} above the keyboard or press {alt} twice. This mode applies to the next symbol.',
      stress:
        'Stress first, then vowel: {alt}, {alt}, {slash}, {lowerA} → {stressed}. {esc} cancels the pending mark.',
      postfix:
        'Polish is now selected. Type {lowerA}, then press and release {shift}: {plainA} becomes {ogonek}. Another press continues the cycle. On screen, click {shift} twice: press and release. The underlined letter can still be changed with {shift}.',
      hebrew:
        'Hebrew is now selected; a letter is already entered. Hold Right {alt} ({altGr}) and press physical {keyA} to add sheva. Left {alt} is for typography.',
      pair: 'Press {s0} ({capsLock}) to switch to the second language of your pair. Another press switches back.',
      slot: 'Hold {s0} and press physical {key}: this is {slot}. The language comes from your settings. You can use the on-screen chord button below.',
      off: 'Press both {ctrl} keys together and release them to turn typography off. Ordinary typing remains available.',
      on: 'Repeat the chord with both {ctrl} keys to turn typography back on.',
      search:
        'Hold {capsLock} and press {keyF} to open search. Find {copyright}, read its shortcut, close search and type the symbol.',
      settings:
        'Open Settings in the menu to find the {s0} pair, {slots} languages. Just opening it completes this task; no changes are needed.',
      help: 'Hold {capsLock} and press {keyH} to open the cheat sheet. Explore the shortcuts, then close it to continue.',
    },
  },
  he: {
    menu: 'סיור מודרך',
    invite: 'להכיר את הפריסה?',
    inviteBody: 'כמה משימות קצרות במקלדת. אפשר לצאת בכל רגע.',
    start: 'התחלת הסיור',
    decline: 'לא עכשיו',
    later: 'הסיור תמיד זמין בתפריט.',
    ack: 'הבנתי',
    question: 'האם פריסת בירמן מוכרת לכם?',
    questionBody: 'אם כן, נדלג על ההיכרות עם הסמלים ונעבור לתכונות החדשות.',
    yes: 'כן, מוכרת',
    no: 'לא, הראו לי',
    exit: 'סיום הסיור',
    next: 'הבא',
    skip: 'דילוג',
    back: 'חזרה',
    retry: 'מחדש',
    success: 'הצלחתם!',
    practice:
      'הקלידו או לחצו על מקשי המסך. הטקסט והשפה המקוריים יחזרו בסיום הסיור.',
    type: 'הקלידו',
    switchTo: 'עברו אל',
    screenChord: 'לחיצה על הצירוף במסך',
    optional: 'אתגר אחרון — לבחירה',
    optionalBody:
      'הקלידו דוגמה עם כל סמלי בירמן, כולל סימנים דיאקריטיים נפרדים ורווח קשיח. ללא שעון; אפשר להפסיק בכל רגע.',
    startTest: 'התחלת המבחן',
    finish: 'סיום',
    done: 'הסיור הסתיים',
    doneBody: 'אפשר להמשיך להתנסות. דף העזר נמצא בראש העמוד והסיור בתפריט.',
    progress: 'שלב {current} מתוך {total}',
    error: 'יש אי־התאמה. תקנו אותה או התחילו מחדש.',
    spaceNote:
      '{nbsp} מסמן רווח קשיח. לסימן דיאקריטי נפרד, בחרו אותו ב־{m2} ולחצו על {space}.',
    storageNote:
      'הדפדפן לא הצליח לשמור את הבחירה. ההזמנה תישאר מוסתרת במפגש הזה.',
    steps: {
      birman:
        'נתחיל בסמלי בירמן. לחצו ושחררו {alt}, ואז על {keyC} הפיזית כדי להקליד {copyright}. אפשר גם ללחוץ על מקשי המסך.',
      extended:
        'השכבה השנייה: לחצו פעמיים על {alt}, ואז על {key2} לקבלת {fraction}.',
      accent:
        'סימן לפני אות: {alt}, {alt}, {key6} ואז {lowerA}. הסימן מתחבר לאות: {circumflex}.',
      quick:
        'הקלדה מהירה: החזיקו {alt} ולחצו על {minus}. במסך: {alt} ואז {minus}.',
      modes:
        'בחרו {m2} מעל המקלדת או לחצו פעמיים על {alt}. המצב חל על הסמל הבא.',
      stress:
        'הטעמה ואז תנועה: {alt}, {alt}, {slash}, {lowerA} → {stressed}. {esc} מבטל סימן ממתין.',
      postfix:
        'פולנית נבחרה. הקלידו {lowerA} ואז לחצו ושחררו {shift}: האות {plainA} תהפוך ל־{ogonek}. לחיצה נוספת ממשיכה במחזור. במסך לחצו על {shift} פעמיים: לחיצה ושחרור. אפשר עדיין לשנות את האות המסומנת בקו תחתון באמצעות {shift}.',
      hebrew:
        'עברית נבחרה; אות כבר הוזנה. החזיקו {alt} ימני ({altGr}) ולחצו על {keyA} הפיזית להוספת שווא. {alt} שמאלי משמש לטיפוגרפיה.',
      pair: 'לחצו על {s0} ({capsLock}) למעבר לשפה השנייה בזוג. לחיצה נוספת מחזירה לראשונה.',
      slot: 'החזיקו {s0} ולחצו על {key} הפיזי: זהו {slot}. השפה נלקחת מההגדרות שלכם. אפשר להשתמש בכפתור הצירוף למטה.',
      off: 'לחצו על שני מקשי {ctrl} יחד ושחררו כדי לכבות טיפוגרפיה. הקלדה רגילה נשארת זמינה.',
      on: 'חזרו על הצירוף של שני מקשי {ctrl} להפעלת הטיפוגרפיה.',
      search:
        'פתחו חיפוש עם {capsLock} + {keyF}. מצאו {copyright}, קראו את הצירוף, סגרו את החיפוש והקלידו את הסמל.',
      settings:
        'פתחו הגדרות בתפריט: זוג {s0}, שפות {slots}. די לפתוח את החלון; אין צורך לשמור שינויים.',
      help: 'פתחו את דף העזר עם {capsLock} + {keyH}. עיינו בצירופים וסגרו אותו כדי להמשיך.',
    },
  },
  de: {
    menu: 'Einführung',
    invite: 'Das Layout kennenlernen?',
    inviteBody: 'Kurze Aufgaben direkt auf der Tastatur. Jederzeit beenden.',
    start: 'Tour starten',
    decline: 'Nicht jetzt',
    later: 'Die Tour ist jederzeit im Menü verfügbar.',
    ack: 'Verstanden',
    question: 'Kennst du das Birman-Layout?',
    questionBody:
      'Dann überspringen wir seine Symbole und beginnen mit den neuen Funktionen.',
    yes: 'Ja',
    no: 'Nein, zeig es mir',
    exit: 'Tour beenden',
    next: 'Weiter',
    skip: 'Überspringen',
    back: 'Zurück',
    retry: 'Neu versuchen',
    success: 'Geschafft!',
    practice:
      'Tippe oder klicke auf Bildschirmtasten. Dein Text und deine Sprache werden danach wiederhergestellt.',
    type: 'Tippe',
    switchTo: 'Wechsle zu',
    screenChord: 'Tastenkombination am Bildschirm',
    optional: 'Eine letzte Aufgabe — freiwillig',
    optionalBody:
      'Tippe alle Birman-Symbole einschließlich einzelner Akzentzeichen und geschütztem Leerzeichen. Ohne Zeitlimit, jederzeit abbrechbar.',
    startTest: 'Test starten',
    finish: 'Fertig',
    done: 'Tour abgeschlossen',
    doneBody: 'Probiere weiter aus. Spickzettel oben, Tour im Menü.',
    progress: 'Schritt {current} von {total}',
    error: 'Eine Abweichung: korrigiere sie oder beginne neu.',
    spaceNote:
      '{nbsp} bedeutet geschütztes Leerzeichen. Für einen einzelnen Akzent: in {m2} wählen, dann {space}.',
    storageNote:
      'Der Browser konnte die Wahl nicht speichern. Die Einladung bleibt für diese Sitzung verborgen.',
    steps: {
      birman:
        '{alt} drücken und loslassen, dann {keyC}: {copyright}. Auch die Bildschirmtasten funktionieren.',
      extended: '{alt} zweimal, dann {key2}: {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA}: {circumflex}. Erst Akzent, dann Buchstabe.',
      quick:
        '{alt} halten und {minus} drücken. Am Bildschirm: {alt}, dann {minus}.',
      modes:
        '{m2} oberhalb der Tastatur wählen oder {alt} zweimal drücken. Gilt für das nächste Symbol.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA}: {stressed}. {esc} verwirft den wartenden Akzent.',
      postfix:
        'Polnisch: {lowerA} tippen, dann {shift} drücken und loslassen: {ogonek}. Weitere Betätigungen wechseln die Variante. Am Bildschirm {shift} zweimal anklicken: drücken und loslassen. Den unterstrichenen Buchstaben kannst du noch mit {shift} ändern.',
      hebrew:
        'Hebräisch: Rechts-{alt} ({altGr}) halten und die physische {keyA}-Taste drücken. So erhält der vorbereitete Buchstabe ein Schwa. Links-{alt} dient der Typografie.',
      pair: '{s0} ({capsLock}) wechselt zur zweiten Sprache deines Paars. Erneut drücken wechselt zurück.',
      slot: '{s0} halten und die physische Taste {key} drücken: {slot}. Die Sprache stammt aus deinen Einstellungen. Alternativ die Kombination unten anklicken.',
      off: 'Beide {ctrl} zusammen drücken und loslassen: Typografie aus, normales Tippen bleibt möglich.',
      on: 'Beide {ctrl} erneut zusammen drücken und loslassen: Typografie an.',
      search:
        'Suche mit {capsLock} + {keyF} öffnen. {copyright} suchen, Tastenkürzel ansehen, Suche schließen und das Symbol tippen.',
      settings:
        'Einstellungen im Menü öffnen: {s0}, {slots}. Öffnen genügt; nichts speichern.',
      help: 'Den Spickzettel mit {capsLock} + {keyH} öffnen. Tastenkürzel ansehen und zum Fortfahren schließen.',
    },
  },
  fr: {
    menu: 'Visite guidée',
    invite: 'Découvrir la disposition ?',
    inviteBody:
      'Quelques exercices courts au clavier. Arrêtez quand vous voulez.',
    start: 'Commencer',
    decline: 'Pas maintenant',
    later: 'La visite reste disponible dans le menu.',
    ack: 'Compris',
    question: 'Connaissez-vous la disposition Birman ?',
    questionBody:
      'Si oui, passons directement de ses symboles aux nouvelles fonctions.',
    yes: 'Oui',
    no: 'Non, montrez-moi',
    exit: 'Quitter la visite',
    next: 'Suivant',
    skip: 'Passer',
    back: 'Retour',
    retry: 'Recommencer',
    success: 'Réussi !',
    practice:
      'Tapez ou cliquez sur les touches à l’écran. Votre texte et votre langue seront restaurés après la visite.',
    type: 'Tapez',
    switchTo: 'Passez à',
    screenChord: 'Jouer la combinaison à l’écran',
    optional: 'Un dernier défi — facultatif',
    optionalBody:
      'Tapez tous les symboles Birman, y compris les accents isolés et une espace insécable. Sans chronomètre ; arrêtez à tout moment.',
    startTest: 'Commencer le test',
    finish: 'Terminer',
    done: 'Visite terminée',
    doneBody:
      'Continuez à explorer. Aide-mémoire en haut, visite dans le menu.',
    progress: 'Étape {current} sur {total}',
    error: 'Une différence : corrigez-la ou recommencez.',
    spaceNote:
      '{nbsp} indique une espace insécable. Pour un accent isolé : sélectionnez-le en {m2}, puis {space}.',
    storageNote:
      'Le navigateur n’a pas pu enregistrer ce choix. L’invitation reste masquée pour cette session.',
    steps: {
      birman:
        'Appuyez sur {alt}, relâchez, puis {keyC} : {copyright}. Les touches à l’écran fonctionnent aussi.',
      extended: 'Deux fois {alt}, puis {key2} : {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA} : {circumflex}. Le signe précède la lettre.',
      quick:
        'Maintenez {alt} et appuyez sur {minus}. À l’écran : {alt}, puis {minus}.',
      modes:
        'Choisissez {m2} au-dessus du clavier ou appuyez deux fois sur {alt}. Pour le prochain symbole.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA} : {stressed}. {esc} annule le signe en attente.',
      postfix:
        'Polonais : tapez {lowerA}, puis appuyez et relâchez {shift} : {ogonek}. Répétez pour parcourir les variantes. À l’écran, cliquez deux fois sur {shift} : appuyer et relâcher. La lettre soulignée peut encore être modifiée avec {shift}.',
      hebrew:
        'Hébreu : maintenez {alt} droit ({altGr}) et appuyez sur {keyA} physique pour ajouter un sheva à la lettre préparée. {alt} gauche sert à la typographie.',
      pair: '{s0} ({capsLock}) passe à la seconde langue de votre paire. Répétez pour revenir.',
      slot: 'Maintenez {s0} et appuyez sur {key} physique : {slot}. Langue issue de vos réglages. Le bouton ci-dessous joue aussi la combinaison.',
      off: 'Appuyez sur les deux {ctrl} ensemble, puis relâchez : typographie désactivée, saisie normale disponible.',
      on: 'Répétez avec les deux {ctrl} pour réactiver la typographie.',
      search:
        'Ouvrez la recherche avec {capsLock} + {keyF}. Cherchez {copyright}, lisez son raccourci, fermez la recherche et tapez le symbole.',
      settings:
        'Ouvrez les paramètres du menu : {s0}, {slots}. Il suffit d’ouvrir ; inutile d’enregistrer.',
      help: 'Ouvrez le mémo avec {capsLock} + {keyH}. Consultez les raccourcis, puis fermez-le pour continuer.',
    },
  },
  es: {
    menu: 'Visita guiada',
    invite: '¿Conocer la distribución?',
    inviteBody:
      'Unos ejercicios breves en el teclado. Puedes salir cuando quieras.',
    start: 'Empezar',
    decline: 'Ahora no',
    later: 'La visita siempre está disponible en el menú.',
    ack: 'Entendido',
    question: '¿Conoces la distribución Birman?',
    questionBody:
      'Si la conoces, saltaremos sus símbolos y veremos las nuevas funciones.',
    yes: 'Sí',
    no: 'No, enséñamela',
    exit: 'Salir de la visita',
    next: 'Siguiente',
    skip: 'Saltar',
    back: 'Atrás',
    retry: 'Reintentar',
    success: '¡Correcto!',
    practice:
      'Escribe o pulsa las teclas en pantalla. Al salir se restauran tu texto y tu idioma.',
    type: 'Escribe',
    switchTo: 'Cambia a',
    screenChord: 'Pulsar combinación en pantalla',
    optional: 'Un último reto — opcional',
    optionalBody:
      'Escribe todos los símbolos Birman, incluidos acentos aislados y un espacio inseparable. Sin tiempo límite; puedes salir cuando quieras.',
    startTest: 'Empezar prueba',
    finish: 'Terminar',
    done: 'Visita terminada',
    doneBody: 'Sigue explorando. Guía rápida arriba, visita en el menú.',
    progress: 'Paso {current} de {total}',
    error: 'Hay una diferencia. Corrígela o empieza de nuevo.',
    spaceNote:
      '{nbsp} indica un espacio inseparable. Para un acento aislado: elígelo en {m2} y pulsa {space}.',
    storageNote:
      'El navegador no pudo guardar tu elección. La invitación queda oculta durante esta sesión.',
    steps: {
      birman:
        'Pulsa y suelta {alt}, luego {keyC}: {copyright}. También puedes usar las teclas en pantalla.',
      extended: 'Dos veces {alt}, luego {key2}: {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA}: {circumflex}. Primero el signo, luego la letra.',
      quick: 'Mantén {alt} y pulsa {minus}. En pantalla: {alt}, luego {minus}.',
      modes:
        'Elige {m2} sobre el teclado o pulsa {alt} dos veces. Se aplica al próximo símbolo.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA}: {stressed}. {esc} cancela el acento pendiente.',
      postfix:
        'Polaco: escribe {lowerA}, pulsa y suelta {shift}: {ogonek}. Repite para recorrer las variantes. En pantalla, pulsa {shift} dos veces: pulsar y soltar. La letra subrayada todavía se puede cambiar con {shift}.',
      hebrew:
        'Hebreo: mantén {alt} derecho ({altGr}) y pulsa {keyA} física para añadir sheva a la letra preparada. {alt} izquierdo sirve para tipografía.',
      pair: '{s0} ({capsLock}) pasa al segundo idioma de tu par. Repite para volver.',
      slot: 'Mantén {s0} y pulsa {key} física: {slot}. El idioma viene de tus ajustes. También puedes usar el botón de combinación inferior.',
      off: 'Pulsa ambos {ctrl} juntos y suéltalos: se desactiva la tipografía y sigue la escritura normal.',
      on: 'Repite con ambos {ctrl} para activar de nuevo la tipografía.',
      search:
        'Abre la búsqueda con {capsLock} + {keyF}. Busca {copyright}, mira su atajo, cierra la búsqueda y escribe el símbolo.',
      settings:
        'Abre Ajustes en el menú: {s0}, {slots}. Basta con abrir; no guardes cambios.',
      help: 'Abre la chuleta con {capsLock} + {keyH}. Consulta los atajos y ciérrala para continuar.',
    },
  },
  it: {
    menu: 'Tour guidato',
    invite: 'Scoprire la disposizione?',
    inviteBody:
      'Brevi esercizi sulla tastiera. Puoi uscire in qualsiasi momento.',
    start: 'Inizia il tour',
    decline: 'Non ora',
    later: 'Il tour è sempre disponibile nel menu.',
    ack: 'Capito',
    question: 'Conosci la disposizione Birman?',
    questionBody:
      'Se sì, saltiamo i suoi simboli e passiamo alle nuove funzioni.',
    yes: 'Sì',
    no: 'No, mostramela',
    exit: 'Esci dal tour',
    next: 'Avanti',
    skip: 'Salta',
    back: 'Indietro',
    retry: 'Riprova',
    success: 'Fatto!',
    practice:
      'Digita o premi i tasti sullo schermo. Al termine ripristiniamo il testo e la lingua originali.',
    type: 'Digita',
    switchTo: 'Passa a',
    screenChord: 'Premi la combinazione sullo schermo',
    optional: 'Un’ultima sfida — facoltativa',
    optionalBody:
      'Digita tutti i simboli Birman, inclusi accenti isolati e uno spazio non separabile. Senza timer; puoi fermarti quando vuoi.',
    startTest: 'Inizia il test',
    finish: 'Termina',
    done: 'Tour completato',
    doneBody: 'Continua a provare. Promemoria in alto, tour nel menu.',
    progress: 'Passaggio {current} di {total}',
    error: 'C’è una differenza. Correggila o ricomincia.',
    spaceNote:
      '{nbsp} indica uno spazio non separabile. Per un accento isolato: sceglilo in {m2} e premi {space}.',
    storageNote:
      'Il browser non ha salvato la scelta. L’invito resta nascosto per questa sessione.',
    steps: {
      birman:
        'Premi e rilascia {alt}, poi {keyC}: {copyright}. Funzionano anche i tasti sullo schermo.',
      extended: 'Due volte {alt}, poi {key2}: {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA}: {circumflex}. Prima il segno, poi la lettera.',
      quick: 'Tieni {alt} e premi {minus}. Sullo schermo: {alt}, poi {minus}.',
      modes:
        'Scegli {m2} sopra la tastiera o premi {alt} due volte. Vale per il prossimo simbolo.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA}: {stressed}. {esc} annulla l’accento in attesa.',
      postfix:
        'Polacco: digita {lowerA}, premi e rilascia {shift}: {ogonek}. Ripeti per scorrere le varianti. Sullo schermo, premi {shift} due volte: premere e rilasciare. La lettera sottolineata può ancora essere modificata con {shift}.',
      hebrew:
        'Ebraico: tieni {alt} destro ({altGr}) e premi {keyA} fisica per aggiungere sheva alla lettera preparata. {alt} sinistro serve alla tipografia.',
      pair: '{s0} ({capsLock}) passa alla seconda lingua della coppia. Ripeti per tornare.',
      slot: 'Tieni {s0} e premi {key} fisico: {slot}. La lingua viene dalle impostazioni. Puoi anche usare il pulsante qui sotto.',
      off: 'Premi entrambi i {ctrl} insieme e rilasciali: tipografia disattivata, digitazione normale disponibile.',
      on: 'Ripeti con entrambi i {ctrl} per riattivare la tipografia.',
      search:
        'Apri la ricerca con {capsLock} + {keyF}. Cerca {copyright}, leggi la scorciatoia, chiudi la ricerca e digita il simbolo.',
      settings:
        'Apri Impostazioni nel menu: {s0}, {slots}. Basta aprire; non occorre salvare.',
      help: 'Apri il promemoria con {capsLock} + {keyH}. Consulta le scorciatoie e chiudilo per continuare.',
    },
  },
  pl: {
    menu: 'Samouczek',
    invite: 'Poznać układ?',
    inviteBody:
      'Kilka krótkich ćwiczeń na klawiaturze. Możesz wyjść w każdej chwili.',
    start: 'Rozpocznij',
    decline: 'Nie teraz',
    later: 'Samouczek jest zawsze dostępny w menu.',
    ack: 'Rozumiem',
    question: 'Znasz układ Birmana?',
    questionBody:
      'Jeśli tak, pominiemy jego symbole i przejdziemy do nowych funkcji.',
    yes: 'Tak',
    no: 'Nie, pokaż',
    exit: 'Zakończ samouczek',
    next: 'Dalej',
    skip: 'Pomiń',
    back: 'Wstecz',
    retry: 'Od nowa',
    success: 'Udało się!',
    practice:
      'Pisz lub klikaj klawisze ekranowe. Po zakończeniu przywrócimy tekst i język.',
    type: 'Wpisz',
    switchTo: 'Przełącz na',
    screenChord: 'Naciśnij kombinację na ekranie',
    optional: 'Ostatnie wyzwanie — opcjonalne',
    optionalBody:
      'Wpisz wszystkie symbole Birmana, w tym osobne akcenty i spację nierozdzielającą. Bez limitu czasu; możesz przerwać.',
    startTest: 'Rozpocznij test',
    finish: 'Zakończ',
    done: 'Samouczek zakończony',
    doneBody: 'Eksperymentuj dalej. Ściągawka u góry, samouczek w menu.',
    progress: 'Krok {current} z {total}',
    error: 'Jest różnica. Popraw ją lub zacznij od nowa.',
    spaceNote:
      '{nbsp} oznacza spację nierozdzielającą. Osobny akcent: wybierz go w {m2} i naciśnij {space}.',
    storageNote:
      'Przeglądarka nie zapisała wyboru. Zaproszenie pozostanie ukryte w tej sesji.',
    steps: {
      birman:
        'Naciśnij i zwolnij {alt}, potem {keyC}: {copyright}. Możesz też klikać klawisze ekranowe.',
      extended: 'Dwa razy {alt}, potem {key2}: {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA}: {circumflex}. Najpierw znak, potem litera.',
      quick:
        'Przytrzymaj {alt} i naciśnij {minus}. Na ekranie: {alt}, potem {minus}.',
      modes:
        'Wybierz {m2} nad klawiaturą lub naciśnij {alt} dwa razy. Tryb dotyczy następnego symbolu.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA}: {stressed}. {esc} anuluje oczekujący akcent.',
      postfix:
        'Polski: wpisz {lowerA}, naciśnij i zwolnij {shift}: {ogonek}. Kolejne naciśnięcie zmienia wariant. Na ekranie kliknij {shift} dwa razy: naciśnij i zwolnij. Podkreśloną literę nadal można zmienić klawiszem {shift}.',
      hebrew:
        'Hebrajski: trzymaj prawy {alt} ({altGr}) i naciśnij fizyczne {keyA}, aby dodać szwa do przygotowanej litery. Lewy {alt} służy typografii.',
      pair: '{s0} ({capsLock}) wybiera drugi język pary. Kolejne naciśnięcie wraca do pierwszego.',
      slot: 'Trzymaj {s0} i naciśnij fizyczne {key}: {slot}. Język pochodzi z ustawień. Możesz użyć przycisku kombinacji poniżej.',
      off: 'Naciśnij oba {ctrl} razem i zwolnij: typografia wyłączona, zwykłe pisanie nadal działa.',
      on: 'Powtórz z oboma {ctrl}, aby włączyć typografię.',
      search:
        'Otwórz wyszukiwanie przez {capsLock} + {keyF}. Znajdź {copyright}, sprawdź skrót, zamknij wyszukiwanie i wpisz symbol.',
      settings:
        'Otwórz Ustawienia w menu: {s0}, {slots}. Wystarczy otworzyć, bez zapisywania.',
      help: 'Otwórz ściągawkę przez {capsLock} + {keyH}. Sprawdź skróty i zamknij ją, aby kontynuować.',
    },
  },
  pt: {
    menu: 'Visita guiada',
    invite: 'Conhecer a disposição?',
    inviteBody:
      'Alguns exercícios curtos no teclado. Podes sair a qualquer momento.',
    start: 'Começar',
    decline: 'Agora não',
    later: 'A visita está sempre disponível no menu.',
    ack: 'Entendido',
    question: 'Conheces a disposição Birman?',
    questionBody:
      'Se sim, saltamos os seus símbolos e passamos às novas funções.',
    yes: 'Sim',
    no: 'Não, mostra-me',
    exit: 'Sair da visita',
    next: 'Seguinte',
    skip: 'Saltar',
    back: 'Voltar',
    retry: 'Recomeçar',
    success: 'Conseguido!',
    practice:
      'Escreve ou clica nas teclas do ecrã. O texto e o idioma originais regressam no fim.',
    type: 'Escreve',
    switchTo: 'Muda para',
    screenChord: 'Premir combinação no ecrã',
    optional: 'Um último desafio — opcional',
    optionalBody:
      'Escreve todos os símbolos Birman, incluindo acentos isolados e um espaço inseparável. Sem cronómetro; podes desistir a qualquer momento.',
    startTest: 'Começar teste',
    finish: 'Terminar',
    done: 'Visita concluída',
    doneBody: 'Continua a explorar. Guia rápido em cima, visita no menu.',
    progress: 'Passo {current} de {total}',
    error: 'Há uma diferença. Corrige-a ou recomeça.',
    spaceNote:
      '{nbsp} indica um espaço inseparável. Para um acento isolado: escolhe-o em {m2} e prime {space}.',
    storageNote:
      'O navegador não guardou a escolha. O convite fica oculto nesta sessão.',
    steps: {
      birman:
        'Prime e solta {alt}, depois {keyC}: {copyright}. Também podes usar as teclas no ecrã.',
      extended: 'Duas vezes {alt}, depois {key2}: {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA}: {circumflex}. Primeiro o sinal, depois {lowerA} letra.',
      quick: 'Mantém {alt} e prime {minus}. No ecrã: {alt}, depois {minus}.',
      modes:
        'Escolhe {m2} acima do teclado ou prime {alt} duas vezes. Aplica-se ao próximo símbolo.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA}: {stressed}. {esc} cancela o acento pendente.',
      postfix:
        'Polaco: escreve {lowerA}, prime e solta {shift}: {ogonek}. Repete para percorrer variantes. No ecrã, prime {shift} duas vezes: premir e soltar. A letra sublinhada ainda pode ser alterada com {shift}.',
      hebrew:
        'Hebraico: mantém {alt} direito ({altGr}) e prime {keyA} físico para adicionar sheva à letra preparada. {alt} esquerdo serve para tipografia.',
      pair: '{s0} ({capsLock}) muda para o segundo idioma do par. Repete para voltar.',
      slot: 'Mantém {s0} e prime {key} físico: {slot}. O idioma vem das definições. Podes usar o botão de combinação abaixo.',
      off: 'Prime ambos os {ctrl} juntos e solta: tipografia desligada, escrita normal disponível.',
      on: 'Repete com ambos os {ctrl} para voltar a ligar a tipografia.',
      search:
        'Abre a pesquisa com {capsLock} + {keyF}. Procura {copyright}, vê o atalho, fecha a pesquisa e escreve o símbolo.',
      settings:
        'Abre Definições no menu: {s0}, {slots}. Basta abrir, sem guardar alterações.',
      help: 'Abre a cábula com {capsLock} + {keyH}. Consulta os atalhos e fecha-a para continuar.',
    },
  },
  ro: {
    menu: 'Tur ghidat',
    invite: 'Descoperi dispunerea?',
    inviteBody: 'Câteva exerciții scurte la tastatură. Poți ieși oricând.',
    start: 'Începe turul',
    decline: 'Nu acum',
    later: 'Turul este mereu disponibil în meniu.',
    ack: 'Am înțeles',
    question: 'Cunoști dispunerea Birman?',
    questionBody:
      'Dacă da, sărim peste simbolurile ei și trecem la funcțiile noi.',
    yes: 'Da',
    no: 'Nu, arată-mi',
    exit: 'Încheie turul',
    next: 'Înainte',
    skip: 'Omite',
    back: 'Înapoi',
    retry: 'Reîncearcă',
    success: 'Ai reușit!',
    practice:
      'Tastează sau apasă tastele de pe ecran. Textul și limba inițială revin după tur.',
    type: 'Tastează',
    switchTo: 'Schimbă la',
    screenChord: 'Apasă combinația pe ecran',
    optional: 'O ultimă provocare — opțională',
    optionalBody:
      'Tastează toate simbolurile Birman, inclusiv accente separate și un spațiu inseparabil. Fără cronometru; poți renunța oricând.',
    startTest: 'Începe testul',
    finish: 'Încheie',
    done: 'Tur încheiat',
    doneBody: 'Continuă să explorezi. Fișa este sus, turul în meniu.',
    progress: 'Pasul {current} din {total}',
    error: 'Există o diferență. Corecteaz-o sau reîncearcă.',
    spaceNote:
      '{nbsp} indică un spațiu inseparabil. Pentru un accent separat: selectează-l în {m2}, apoi apasă {space}.',
    storageNote:
      'Browserul nu a salvat alegerea. Invitația rămâne ascunsă în această sesiune.',
    steps: {
      birman:
        'Apasă și eliberează {alt}, apoi {keyC}: {copyright}. Poți folosi și tastele de pe ecran.',
      extended: 'De două ori {alt}, apoi {key2}: {fraction}.',
      accent:
        '{alt}, {alt}, {key6}, {lowerA}: {circumflex}. Întâi semnul, apoi litera.',
      quick: 'Ține {alt} și apasă {minus}. Pe ecran: {alt}, apoi {minus}.',
      modes:
        'Alege {m2} deasupra tastaturii sau apasă {alt} de două ori. Se aplică simbolului următor.',
      stress:
        '{alt}, {alt}, {slash}, {lowerA}: {stressed}. {esc} anulează accentul în așteptare.',
      postfix:
        'Poloneză: tastează {lowerA}, apasă și eliberează {shift}: {ogonek}. Repetă pentru alte variante. Pe ecran, apasă {shift} de două ori: apăsare și eliberare. Litera subliniată poate fi modificată în continuare cu {shift}.',
      hebrew:
        'Ebraică: ține {alt} dreapta ({altGr}) și apasă {keyA} fizic pentru a adăuga șva literei pregătite. {alt} stânga servește tipografiei.',
      pair: '{s0} ({capsLock}) trece la a doua limbă din pereche. Repetă pentru a reveni.',
      slot: 'Ține {s0} și apasă {key} fizic: {slot}. Limba vine din setări. Poți folosi butonul combinației de mai jos.',
      off: 'Apasă ambele {ctrl} împreună și eliberează: tipografia se oprește, tastarea obișnuită rămâne disponibilă.',
      on: 'Repetă cu ambele {ctrl} pentru a reporni tipografia.',
      search:
        'Deschide căutarea cu {capsLock} + {keyF}. Găsește {copyright}, citește combinația, închide căutarea și tastează simbolul.',
      settings:
        'Deschide Setări în meniu: {s0}, {slots}. Este suficient să deschizi, fără să salvezi.',
      help: 'Deschide fișa cu {capsLock} + {keyH}. Consultă combinațiile, apoi închide-o pentru a continua.',
    },
  },
};

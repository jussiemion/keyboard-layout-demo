import { symbolAssociationTerms } from './symbol-search-associations.ts';
import { accentMessageKeys, messages } from './messages.ts';
import {
  accents,
  layout,
  type Locale,
  type LayoutKey,
} from './typing-engine.ts';
export type { Locale } from './typing-engine.ts';
import {
  searchGroups,
  symbolDefinitions,
  accentSearchMetadata,
} from './symbol-search-metadata.ts';
import { enrichSymbolUsage } from './symbol-search-usage.ts';
import { symbolNames } from './symbol-names.ts';

export type SymbolSearchMode = 1 | 2;

export type SymbolSearchBinding = {
  mode: SymbolSearchMode;
  keyLabel: string;
  keyCode: string;
  quick: boolean;
  finishWithSpace?: boolean;
};

export type SymbolSearchItem = {
  symbol: string;
  standardName?: string;
  names: Record<Locale, string>;
  aliases: Partial<Record<Locale, readonly string[]>>;
  tags: Partial<Record<Locale, readonly string[]>>;
  description: Partial<Record<Locale, string>>;
  bindings: SymbolSearchBinding[];
};

type SearchMatch = {
  score: number;
  item: SymbolSearchItem;
};

const locales = [
  'ru',
  'en',
  'pl',
  'fr',
  'de',
  'es',
  'pt',
  'it',
  'ro',
  'he',
  'ar',
  'tr',
  'vi',
  'nl',
] satisfies readonly Locale[];

const metadata: Record<
  string,
  {
    aliases?: Partial<Record<Locale, readonly string[]>>;
    tags?: Partial<Record<Locale, readonly string[]>>;
    description?: Partial<Record<Locale, string>>;
  }
> = {
  $: {
    aliases: {
      en: [
        'dollar sign',
        'money',
        'bucks',
        'cash',
        'green',
        'greenback',
        'dollar',
      ],
      ru: ['доллар', 'деньги', 'баксы', 'cash', 'бакс', 'зелёные'],
      pl: ['dolar', 'gotówka', 'pieniądze'],
      de: ['dollar', 'geld', 'bucks'],
      fr: ['dollar', 'argent'],
      es: ['dólar', 'dinero'],
      pt: ['dólar', 'dinheiro'],
      it: ['dollaro', 'soldi'],
      ro: ['dolar', 'bani'],
      he: ['דולר', 'כסף'],
    },
    tags: {
      en: ['currency', 'money', 'finance'],
      ru: ['валюта', 'деньги'],
      pl: ['waluta', 'pieniądze'],
      de: ['währung', 'geld'],
      fr: ['monnaie', 'devise'],
      es: ['moneda', 'dinero'],
      pt: ['moeda', 'dinheiro'],
      it: ['valuta', 'soldi'],
      ro: ['valută', 'bani'],
      he: ['מטבע', 'כסף'],
    },
    description: {
      en: 'Dollar currency sign.',
      ru: 'Символ долларовой валюты.',
      pl: 'Znak waluty dolara.',
      de: 'Dollar-Währungszeichen.',
      fr: 'Symbole de la devise dollar.',
      es: 'Signo de moneda en dólares.',
      pt: 'Símbolo da moeda dólar.',
      it: 'Simbolo della valuta dollaro.',
      ro: 'Simbol monetar al dolarului.',
      he: 'סמל מטבע דולר.',
    },
  },
  '€': {
    aliases: {
      en: ['euro', 'euro sign', 'eur'],
      ru: ['евро', 'money', 'eur'],
      pl: ['euro', 'w euro'],
      de: ['euro', 'eurozeichen'],
      fr: ['euro', 'euro'],
      es: ['euro', 'moneda euro'],
      pt: ['euro', 'moeda euro'],
      it: ['euro', 'valuta europea'],
      ro: ['euro', 'euro'],
      he: ['יורו', 'euro'],
    },
    tags: {
      en: ['currency', 'money'],
      ru: ['валюта', 'деньги'],
      pl: ['waluta', 'pieniądze'],
      de: ['währung', 'geld'],
      fr: ['monnaie', 'finance'],
      es: ['moneda', 'dinero'],
      pt: ['moeda', 'finança'],
      it: ['valuta', 'soldi'],
      ro: ['valută', 'bani'],
      he: ['מטבע', 'כסף'],
    },
    description: {
      en: 'Euro currency sign.',
      ru: 'Символ евро.',
    },
  },
  '£': {
    aliases: {
      en: ['pound', 'sterling'],
      ru: ['фунт', 'стерлинг', 'британский фунт'],
      pl: ['funt', 'funt sterling'],
      de: ['pfund', 'sterling'],
      fr: ['livre', 'sterling'],
      es: ['libra', 'esterlina'],
      pt: ['libra', 'libra esterlina'],
      it: ['sterlina', 'libbra'],
      ro: ['liră', 'sterling'],
      he: ['לירה', 'sterling'],
    },
    tags: {
      en: ['currency', 'money'],
      ru: ['валюта', 'деньги'],
      pl: ['waluta', 'pieniądze'],
      de: ['währung', 'geld'],
      fr: ['monnaie', 'finance'],
      es: ['moneda', 'dinero'],
      pt: ['moeda', 'dinheiro'],
      it: ['valuta', 'soldi'],
      ro: ['valută', 'bani'],
      he: ['מטבע', 'כסף'],
    },
    description: {
      en: 'Pound sterling currency sign.',
      ru: 'Символ фунта стерлингов.',
    },
  },
  '₽': {
    aliases: {
      en: ['ruble', 'russian ruble', 'money'],
      ru: ['рубль', 'российский', 'деньги'],
      pl: ['rubel', 'ruski rubel'],
      de: ['rubel', 'russischer rubel'],
      fr: ['rouble', 'rouble russe'],
      es: ['rublo', 'ruso'],
      pt: ['rublo', 'rublo russo'],
      it: ['rublo', 'rublo russo'],
      ro: ['rublă', 'rublă rusă'],
      he: ['רובל', 'רובל רוסי'],
    },
    tags: {
      en: ['currency', 'money'],
      ru: ['валюта', 'деньги'],
      pl: ['waluta', 'pieniądze'],
      de: ['währung', 'geld'],
      fr: ['monnaie', 'finance'],
      es: ['moneda', 'dinero'],
      pt: ['moeda', 'dinheiro'],
      it: ['valuta', 'soldi'],
      ro: ['valută', 'bani'],
      he: ['מטבע', 'כסף'],
    },
    description: {
      en: 'Russian ruble symbol.',
      ru: 'Символ российского рубля.',
    },
  },
  '¢': {
    aliases: {
      en: ['cent', 'money'],
      ru: ['цент', 'денежка'],
      pl: ['cent', 'pieniądze'],
      de: ['cent', 'geld'],
      fr: ['cent', 'argent'],
      es: ['centavo', 'moneda'],
      pt: ['cêntimo', 'dinheiro'],
      it: ['centesimo', 'soldi'],
      ro: ['cent', 'bani'],
      he: ['סנט', 'כסף'],
    },
    tags: {
      en: ['currency'],
      ru: ['валюта'],
      pl: ['waluta'],
      de: ['währung'],
      fr: ['monnaie'],
      es: ['moneda'],
      pt: ['moeda'],
      it: ['valuta'],
      ro: ['valută'],
      he: ['מטבע'],
    },
    description: {
      en: 'Cent currency symbol.',
      ru: 'Символ цента.',
    },
  },
  '∞': {
    aliases: {
      en: ['infinity', 'infinite', 'unbounded'],
      ru: ['бесконечность', 'нескончаемость'],
      pl: ['nieskończoność'],
      de: ['unendlich'],
      fr: ['infini'],
      es: ['infinito'],
      pt: ['infinito'],
      it: ['infinito'],
      ro: ['infinit'],
      he: ['אינסוף', 'אין סוף'],
    },
    tags: {
      en: ['math', 'symbol'],
      ru: ['математика', 'символ'],
      pl: ['matematyka', 'symbol'],
      de: ['mathematik', 'symbol'],
      fr: ['math', 'symbole'],
      es: ['matemáticas', 'símbolo'],
      pt: ['matemática', 'símbolo'],
      it: ['matematica', 'simbolo'],
      ro: ['matematică', 'simbol'],
      he: ['מתמטיקה', 'סמל'],
    },
    description: {
      en: 'Represents an unbounded quantity.',
      ru: 'Обозначает бесконечную величину.',
      pl: 'Symbol oznacza wielkość bez końca.',
      de: 'Stellt eine unbegrenzte Menge dar.',
      fr: 'Représente une quantité illimitée.',
      es: 'Representa una cantidad sin límite.',
      pt: 'Representa uma quantidade ilimitada.',
      it: 'Rappresenta una quantità illimitata.',
      ro: 'Reprezintă o mărime fără limite.',
      he: 'מסמל כמות ללא גבול.',
    },
  },
  '✓': {
    aliases: {
      en: ['check', 'check mark', 'tick', 'correct'],
      ru: ['галочка', 'чек', 'верно', 'ok'],
      pl: ['sprawdź', 'tick'],
      de: ['häkchen', 'ok'],
      fr: ['check', 'ok', 'correct'],
      es: ['check', 'marca', 'correcto'],
      pt: ['checagem', 'correto'],
      it: ['segno', 'ok'],
      ro: ['bifat', 'corect'],
      he: ['סימון', 'אות', 'אישור'],
    },
    tags: {
      en: ['status', 'check', 'ui'],
      ru: ['статус', 'подтверждение'],
      pl: ['status', 'zgoda'],
      de: ['status', 'prüfen'],
      fr: ['statut', 'vérification'],
      es: ['estado', 'confirmación'],
      pt: ['status', 'confirmação'],
      it: ['stato', 'conferma'],
      ro: ['stare', 'confirmare'],
      he: ['סטטוס', 'אישור'],
    },
    description: {
      en: 'Mark indicating a correct answer or completion.',
      ru: 'Знак подтверждения или правильного ответа.',
      pl: 'Znak wskazujący poprawność.',
      de: 'Kennzeichen für eine korrekte Antwort.',
      fr: 'Marque indiquant une réponse correcte.',
      es: 'Marca que indica una respuesta correcta.',
      pt: 'Marca que indica uma resposta correta.',
      it: 'Segno che indica una risposta corretta.',
      ro: 'Semn care indică o soluție corectă.',
      he: 'סימן המציין תשובה נכונה.',
    },
  },
  '≠': {
    aliases: {
      en: ['not equal', 'difference', 'inequal'],
      ru: ['не равно', 'неэквивалентно'],
      pl: ['nierówne', 'nie równe'],
      de: ['ungleich'],
      fr: ['différent de', 'n’est pas'],
      es: ['no igual', 'diferente'],
      pt: ['diferente de'],
      it: ['diverso', 'non uguale'],
      ro: ['diferit de'],
      he: ['לא שווה'],
    },
    tags: {
      en: ['math', 'comparison', 'symbol'],
      ru: ['математика', 'сравнение'],
      pl: ['matematyka', 'porównanie'],
      de: ['mathematik', 'vergleich'],
      fr: ['math', 'comparaison'],
      es: ['matemáticas', 'comparación'],
      pt: ['matemática', 'comparação'],
      it: ['matematica', 'confronto'],
      ro: ['matematică', 'comparație'],
      he: ['מתמטיקה', 'השוואה'],
    },
    description: {
      en: 'Mathematical sign for inequality.',
      ru: 'Знак математического неравенства.',
    },
  },
  '≈': {
    aliases: {
      en: ['approx', 'about', 'almost equal', 'approximation'],
      ru: ['приблизительно', 'почти равно'],
      pl: ['około', 'niemal równy'],
      de: ['ungefähr', 'fast gleich'],
      fr: ['environ', 'presque égal'],
      es: ['aproximadamente'],
      pt: ['aproximadamente'],
      it: ['circa', 'quasi uguale'],
      ro: ['aproximativ'],
      he: ['בערך', 'כמעט שווה'],
    },
    tags: {
      en: ['math', 'comparison', 'symbol'],
      ru: ['математика', 'сравнение'],
      pl: ['matematyka', 'symbol'],
      de: ['mathematik', 'vergleich'],
      fr: ['math', 'comparaison'],
      es: ['matemáticas', 'comparación'],
      pt: ['matemática', 'comparação'],
      it: ['matematica', 'confronto'],
      ro: ['matematică', 'comparație'],
      he: ['מתמטיקה', 'השוואה'],
    },
  },
  '−': {
    aliases: {
      en: ['minus', 'dash', 'negative', 'hyphen minus'],
      ru: ['минус', 'минус-знак'],
      pl: ['minus', 'znak minus'],
      de: ['minus', 'strich'],
      fr: ['moins', 'signe moins'],
      es: ['menos', 'signo menos'],
      pt: ['menos', 'sinal menos'],
      it: ['meno', 'segno meno'],
      ro: ['minus', 'minus'],
      he: [' מינוס', 'סימן מינוס'],
    },
    tags: {
      en: ['math', 'symbol'],
      ru: ['математика', 'символ'],
      pl: ['matematyka', 'symbol'],
      de: ['mathematik', 'symbol'],
      fr: ['math', 'symbole'],
      es: ['matemáticas', 'símbolo'],
      pt: ['matemática', 'símbolo'],
      it: ['matematica', 'simbolo'],
      ro: ['matematică', 'simbol'],
      he: ['מתמטיקה', 'סמל'],
    },
  },
  '×': {
    aliases: {
      en: ['times', 'multiply', 'multiplication', 'x'],
      ru: ['умножить', 'знак умножения', 'х'],
      pl: ['razy', 'mnożenie'],
      de: ['mal', 'multiplizieren'],
      fr: ['fois', 'multiplication'],
      es: ['multiplicar'],
      pt: ['multiplicar'],
      it: ['moltiplicare'],
      ro: ['ori', 'înmulțire'],
      he: ['כפל'],
    },
    tags: {
      en: ['math', 'operation', 'symbol'],
      ru: ['математика', 'операция'],
      pl: ['matematyka', 'działanie'],
      de: ['mathematik', 'operation'],
      fr: ['math', 'opération'],
      es: ['matemáticas', 'operación'],
      pt: ['matemática', 'operação'],
      it: ['matematica', 'operazione'],
      ro: ['matematică', 'operație'],
      he: ['מתמטיקה', 'פעולה'],
    },
  },
  '→': {
    aliases: {
      en: ['arrow', 'right arrow', 'arrow right', 'rightarrow', 'go'],
      ru: ['стрелка', 'стрелка вправо'],
      pl: ['strzałka', 'w prawo'],
      de: ['pfeil', 'pfeil rechts'],
      fr: ['flèche', 'flèche droite'],
      es: ['flecha', 'flecha derecha'],
      pt: ['seta', 'seta para direita'],
      it: ['freccia', 'destra'],
      ro: ['săgeată', 'dreapta'],
      he: ['חץ', 'ימינה'],
    },
    tags: {
      en: ['arrow', 'direction', 'ui'],
      ru: ['стрелка', 'направление'],
      pl: ['strzałka', 'kierunek'],
      de: ['pfeil', 'richtung'],
      fr: ['flèche', 'direction'],
      es: ['flecha', 'dirección'],
      pt: ['seta', 'direção'],
      it: ['freccia', 'direzione'],
      ro: ['săgeată', 'direcție'],
      he: ['חץ', 'כיוון'],
    },
  },
  '←': {
    aliases: {
      en: ['left arrow', 'arrow left', 'leftarrow'],
      ru: ['стрелка влево', 'налево'],
      pl: ['strzałka', 'w lewo'],
      de: ['pfeil', 'links'],
      fr: ['flèche', 'gauche'],
      es: ['flecha', 'izquierda'],
      pt: ['seta', 'esquerda'],
      it: ['freccia', 'sinistra'],
      ro: ['săgeată', 'stânga'],
      he: ['חץ', 'שמאלה'],
    },
    tags: {
      en: ['arrow', 'direction', 'ui'],
      ru: ['стрелка', 'направление'],
      pl: ['strzałka', 'kierunek'],
      de: ['pfeil', 'richtung'],
      fr: ['flèche', 'direction'],
      es: ['flecha', 'dirección'],
      pt: ['seta', 'direção'],
      it: ['freccia', 'direzione'],
      ro: ['săgeată', 'direcție'],
      he: ['חץ', 'כיוון'],
    },
  },
  '↑': {
    aliases: {
      en: ['up', 'up arrow', 'arrow up', 'uparrow'],
      ru: ['вверх', 'стрелка вверх'],
      pl: ['góra', 'strzałka w górę'],
      de: ['hoch', 'pfeil oben'],
      fr: ['haut', 'flèche vers le haut'],
      es: ['arriba', 'flecha arriba'],
      pt: ['cima', 'seta para cima'],
      it: ['su', 'freccia su'],
      ro: ['sus', 'săgeată sus'],
      he: ['למעלה', 'חץ למעלה'],
    },
    tags: {
      en: ['arrow', 'direction', 'ui'],
      ru: ['стрелка', 'направление'],
      pl: ['strzałka', 'kierunek'],
      de: ['pfeil', 'richtung'],
      fr: ['flèche', 'direction'],
      es: ['flecha', 'dirección'],
      pt: ['seta', 'direção'],
      it: ['freccia', 'direzione'],
      ro: ['săgeată', 'direcție'],
      he: ['חץ', 'כיוון'],
    },
  },
  '↓': {
    aliases: {
      en: ['down', 'down arrow', 'arrow down', 'downarrow'],
      ru: ['вниз', 'стрелка вниз'],
      pl: ['dół', 'strzałka w dół'],
      de: ['runter', 'pfeil unten'],
      fr: ['bas', 'flèche vers le bas'],
      es: ['abajo', 'flecha abajo'],
      pt: ['baixo', 'seta para baixo'],
      it: ['giù', 'freccia giù'],
      ro: ['jos', 'săgeată jos'],
      he: ['למטה', 'חץ למטה'],
    },
    tags: {
      en: ['arrow', 'direction', 'ui'],
      ru: ['стрелка', 'направление'],
      pl: ['strzałka', 'kierunek'],
      de: ['pfeil', 'richtung'],
      fr: ['flèche', 'direction'],
      es: ['flecha', 'dirección'],
      pt: ['seta', 'direção'],
      it: ['freccia', 'direzione'],
      ro: ['săgeată', 'direcție'],
      he: ['חץ', 'כיוון'],
    },
  },
  '«': {
    aliases: {
      en: ['angle quote', 'left guillemet', 'double quote'],
      ru: ['косая кавычка', 'левая скобка'],
      pl: ['cudzysłów', 'guillemet'],
      de: ['eckige', 'linke'],
      fr: ['guillemet', 'guillemet gauche'],
      es: ['comilla angular', 'apertura'],
      pt: ['aspas angulares', 'esquerda'],
      it: ['virgolette caporali', 'sinistra'],
      ro: ['ghilimea', 'stânga'],
      he: ['מירכאות', 'שמאלה'],
    },
    tags: {
      en: ['quote', 'punctuation'],
      ru: ['кавычка', 'знаки препинания'],
      pl: ['cudzysłów', 'interpunkcja'],
      de: ['anführungszeichen', 'interpunktion'],
      fr: ['guillemet', 'ponctuation'],
      es: ['comillas', 'puntuación'],
      pt: ['aspas', 'pontuação'],
      it: ['virgolette', 'punteggiatura'],
      ro: ['ghilimele', 'punctuație'],
      he: ['גרש', 'סימן פיסוק'],
    },
  },
  '»': {
    aliases: {
      en: ['angle quote', 'right guillemet', 'double quote'],
      ru: ['косая кавычка', 'правая скобка'],
      pl: ['cudzysłów', 'guillemet'],
      de: ['eckige', 'rechte'],
      fr: ['guillemet', 'guillemet droit'],
      es: ['comilla angular', 'cierre'],
      pt: ['aspas angulares', 'direita'],
      it: ['virgolette caporali', 'destra'],
      ro: ['ghilimea', 'dreapta'],
      he: ['מירכאות', 'ימינה'],
    },
    tags: {
      en: ['quote', 'punctuation'],
      ru: ['кавычка', 'знаки препинания'],
      pl: ['cudzysłów', 'interpunkcja'],
      de: ['anführungszeichen', 'interpunktion'],
      fr: ['guillemet', 'ponctuation'],
      es: ['comillas', 'puntuación'],
      pt: ['aspas', 'pontuação'],
      it: ['virgolette', 'punteggiatura'],
      ro: ['ghilimele', 'punctuație'],
      he: ['גרש', 'סימן פיסוק'],
    },
  },
  '“': {
    aliases: {
      en: ['left double quotation mark'],
      ru: ['левая двойная кавычка'],
      pl: ['cudzysłów podwójny'],
      de: ['anfangs', 'doppeltes anführungszeichen'],
      fr: ['guillemet', 'double gauche'],
      es: ['comilla doble', 'inicio'],
      pt: ['aspas duplas', 'esquerda'],
      it: ['virgolette doppie', 'sinistra'],
      ro: ['ghilimea dublă', 'stânga'],
      he: ['מירכאות כפולות', 'פתיחת'],
    },
    tags: {
      en: ['quote', 'punctuation'],
      ru: ['кавычка', 'пунктуация'],
      pl: ['cudzysłów', 'interpunkcja'],
      de: ['anführungszeichen', 'interpunktion'],
      fr: ['guillemet', 'ponctuation'],
      es: ['comillas', 'puntuación'],
      pt: ['aspas', 'pontuação'],
      it: ['virgolette', 'punteggiatura'],
      ro: ['ghilimele', 'punctuație'],
      he: ['גרש', 'סימן פיסוק'],
    },
  },
  '”': {
    aliases: {
      en: ['right double quotation mark'],
      ru: ['правая двойная кавычка'],
      pl: ['cudzysłów podwójny'],
      de: ['schluss', 'doppeltes anführungszeichen'],
      fr: ['guillemet', 'double droit'],
      es: ['comilla doble', 'cierre'],
      pt: ['aspas duplas', 'direita'],
      it: ['virgolette doppie', 'destra'],
      ro: ['ghilimea dublă', 'dreapta'],
      he: ['מירכאות כפולות', 'סיום'],
    },
    tags: {
      en: ['quote', 'punctuation'],
      ru: ['кавычка', 'пунктуация'],
      pl: ['cudzysłów', 'interpunkcja'],
      de: ['anführungszeichen', 'interpunktion'],
      fr: ['guillemet', 'ponctuation'],
      es: ['comillas', 'puntuación'],
      pt: ['aspas', 'pontuação'],
      it: ['virgolette', 'punteggiatura'],
      ro: ['ghilimele', 'punctuație'],
      he: ['גרש', 'סימן פיסוק'],
    },
  },
  '‘': {
    aliases: {
      en: ['left single quotation mark'],
      ru: ['левая одинарная кавычка'],
      pl: ['cudzysłów pojedynczy'],
      de: ['einfach', 'anfangs'],
      fr: ['guillemet simple gauche'],
      es: ['comilla simple', 'inicio'],
      pt: ['aspas simples', 'esquerda'],
      it: ['virgolette singole', 'sinistra'],
      ro: ['ghilimea simplă', 'stânga'],
      he: ['מירכאה', 'פתיחה'],
    },
    tags: {
      en: ['quote', 'punctuation'],
      ru: ['кавычка', 'пунктуация'],
      pl: ['cudzysłów', 'interpunkcja'],
      de: ['anführungszeichen', 'interpunktion'],
      fr: ['guillemet', 'ponctuation'],
      es: ['comillas', 'puntuación'],
      pt: ['aspas', 'pontuação'],
      it: ['virgolette', 'punteggiatura'],
      ro: ['ghilimele', 'punctuație'],
      he: ['גרש', 'סימן פיסוק'],
    },
  },
  '’': {
    aliases: {
      en: ['right single quotation mark'],
      ru: ['правая одинарная кавычка'],
      pl: ['cudzysłów pojedynczy'],
      de: ['einfach', 'schluss'],
      fr: ['apostrophe', 'guillemet simple droit'],
      es: ['comilla simple', 'cierre'],
      pt: ['aspas simples', 'direita'],
      it: ['virgolette singole', 'destra'],
      ro: ['ghilimea simplă', 'dreapta'],
      he: ['מירכאה', 'סיום'],
    },
    tags: {
      en: ['quote', 'punctuation'],
      ru: ['кавычка', 'пунктуация'],
      pl: ['cudzysłów', 'interpunkcja'],
      de: ['anführungszeichen', 'interpunktion'],
      fr: ['guillemet', 'ponctuation'],
      es: ['comillas', 'puntuación'],
      pt: ['aspas', 'pontuação'],
      it: ['virgolette', 'punteggiatura'],
      ro: ['ghilimele', 'punctuație'],
      he: ['גרש', 'סימן פיסוק'],
    },
  },
  '§': {
    aliases: {
      en: ['section sign', 'section mark'],
      ru: ['знак параграфа', 'секция'],
      pl: ['znak paragrafu'],
      de: ['Abschnittszeichen'],
      fr: ['signe de section'],
      es: ['signo de sección'],
      pt: ['sinal de seção'],
      it: ['segno di sezione'],
      ro: ['paragraf'],
      he: ['סימן סעיף'],
    },
    tags: {
      en: ['text', 'legal'],
      ru: ['текст', 'право'],
      pl: ['tekst', 'prawo'],
      de: ['text', 'recht'],
      fr: ['texte', 'droit'],
      es: ['texto', 'derecho'],
      pt: ['texto', 'direito'],
      it: ['testo', 'diritto'],
      ro: ['text', 'drept'],
      he: ['טקסט', 'זכויות'],
    },
  },
  '•': {
    aliases: {
      en: ['bullet', 'list bullet', 'dot'],
      ru: ['буллет', 'точка'],
      pl: ['znak wypunktowania'],
      de: ['punkt', 'bullet'],
      fr: ['puce', 'point'],
      es: ['viñeta', 'punto'],
      pt: ['marcador', 'ponto'],
      it: ['punto elenco'],
      ro: ['bulină'],
      he: ['כותרת', 'נקודה'],
    },
    tags: {
      en: ['list', 'punctuation'],
      ru: ['список', 'пунктуация'],
      pl: ['lista', 'interpunkcja'],
      de: ['liste', 'interpunktion'],
      fr: ['liste', 'ponctuation'],
      es: ['lista', 'puntuación'],
      pt: ['lista', 'pontuação'],
      it: ['lista', 'punteggiatura'],
      ro: ['listă', 'punctuație'],
      he: ['רשימה', 'סימן פיסוק'],
    },
  },
  '…': {
    aliases: {
      en: ['ellipsis', 'three dots', 'dot dot dot'],
      ru: ['многоточие', 'три точки'],
      pl: ['wielokropek'],
      de: ['auslassungspunkte'],
      fr: ['points de suspension'],
      es: ['puntos suspensivos'],
      pt: ['reticências'],
      it: ['puntini di sospensione'],
      ro: ['puncte de suspensie'],
      he: ['שלוש נקודות', 'אליפסיס'],
    },
    tags: {
      en: ['punctuation', 'text'],
      ru: ['пунктуация', 'текст'],
      pl: ['interpunkcja', 'tekst'],
      de: ['interpunktion', 'text'],
      fr: ['ponctuation', 'texte'],
      es: ['puntuación', 'texto'],
      pt: ['pontuação', 'texto'],
      it: ['punteggiatura', 'testo'],
      ro: ['punctuație', 'text'],
      he: ['סימן פיסוק', 'טקסט'],
    },
  },
  '©': {
    aliases: {
      en: ['copyright', 'copyright symbol'],
      ru: ['копирайт', 'авторское право'],
      pl: ['prawo autorskie'],
      de: ['copyright', 'urheberrecht'],
      fr: ['copyright', 'droit d’auteur'],
      es: ['copyright', 'derechos de autor'],
      pt: ['copyright', 'direitos autorais'],
      it: ['copyright', 'copyright'],
      ro: ['copyright', 'drepturi de autor'],
      he: ['זכויות יוצרים', 'קופירייט'],
    },
    tags: {
      en: ['legal', 'brand'],
      ru: ['право', 'бренд'],
      pl: ['prawo', 'znak'],
      de: ['recht', 'marke'],
      fr: ['droit', 'marque'],
      es: ['derecho', 'marca'],
      pt: ['direito', 'marca'],
      it: ['diritto', 'marchio'],
      ro: ['drept', 'marcă'],
      he: ['זכויות', 'מותג'],
    },
  },
  '®': {
    aliases: {
      en: ['registered', 'registered trademark'],
      ru: ['зарегистрированный', 'товарный знак'],
      pl: ['znak zarejestrowany'],
      de: ['eingetragen', 'markenzeichen'],
      fr: ['déposé', 'marque déposée'],
      es: ['registrado', 'marca registrada'],
      pt: ['registrado', 'marca registada'],
      it: ['registrato', 'marchio registrato'],
      ro: ['înregistrat', 'marcă înregistrată'],
      he: ['רשום', 'מותג רשום'],
    },
    tags: {
      en: ['legal', 'brand'],
      ru: ['право', 'бренд'],
      pl: ['prawo', 'marka'],
      de: ['recht', 'marke'],
      fr: ['droit', 'marque'],
      es: ['derecho', 'marca'],
      pt: ['direito', 'marca'],
      it: ['diritto', 'marchio'],
      ro: ['drept', 'marcă'],
      he: ['זכויות', 'מותג'],
    },
  },
  '™': {
    aliases: {
      en: ['trademark', 'tm'],
      ru: ['тм', 'товарный знак'],
      pl: ['znak towarowy'],
      de: ['markenzeichen'],
      fr: ['marque commerciale'],
      es: ['marca comercial', 'tm'],
      pt: ['marca comercial', 'tm'],
      it: ['marchio'],
      ro: ['marcă comercială'],
      he: ['סימן מסחרי'],
    },
    tags: {
      en: ['legal', 'brand'],
      ru: ['право', 'бренд'],
      pl: ['prawo', 'marka'],
      de: ['recht', 'marke'],
      fr: ['droit', 'marque'],
      es: ['derecho', 'marca'],
      pt: ['direito', 'marca'],
      it: ['diritto', 'marchio'],
      ro: ['drept', 'marcă'],
      he: ['זכויות', 'מותג'],
    },
  },
  '#': {
    aliases: {
      en: ['hash', 'number sign', 'octothorpe', 'pound'],
      ru: ['решетка', 'номер', 'хэш'],
      pl: ['krzyżyk', 'hash'],
      de: ['gitter', 'nummernzeichen'],
      fr: ['dièse', 'hashtag'],
      es: ['almohadilla', 'hash'],
      pt: ['cerquilha', 'hash'],
      it: ['cancelletto', 'hash'],
      ro: ['#', 'număr'],
      he: ['סולמית', 'מספר'],
    },
    tags: {
      en: ['punctuation', 'social'],
      ru: ['знак', 'соцсеть'],
      pl: ['interpunkcja', 'media'],
      de: ['interpunktion', 'soziale'],
      fr: ['ponctuation', 'réseaux'],
      es: ['puntuación', 'social'],
      pt: ['pontuação', 'social'],
      it: ['punteggiatura', 'social'],
      ro: ['punctuație', 'social'],
      he: ['סימן פיסוק', 'רשתות'],
    },
  },
  '⌥': {
    aliases: {
      en: ['option', 'alt', 'modifier'],
      ru: ['option', 'alt', 'клавиша'],
      pl: ['option', 'alt'],
      de: ['option', 'alt'],
      fr: ['option', 'alt'],
      es: ['option', 'alt'],
      pt: ['option', 'alt'],
      it: ['opzione', 'alt'],
      ro: ['opțiune', 'alt'],
      he: ['option', 'alt'],
    },
    tags: {
      en: ['keyboard', 'modifier'],
      ru: ['клавиатура', 'модификатор'],
      pl: ['klawiatura', 'modyfikator'],
      de: ['tastatur', 'modifikator'],
      fr: ['clavier', 'modificateur'],
      es: ['teclado', 'modificador'],
      pt: ['teclado', 'modificador'],
      it: ['tastiera', 'modificatore'],
      ro: ['tastatură', 'modificator'],
      he: ['מקלדת', 'מקש'],
    },
  },
  '⌃': {
    aliases: {
      en: ['control', 'ctrl', 'modifier'],
      ru: ['control', 'ctrl', 'клавиша'],
      pl: ['control', 'ctrl'],
      de: ['control', 'strg'],
      fr: ['control', 'ctrl'],
      es: ['control', 'ctrl'],
      pt: ['control', 'ctrl'],
      it: ['control', 'ctrl'],
      ro: ['control', 'ctrl'],
      he: ['control', 'ctrl'],
    },
    tags: {
      en: ['keyboard', 'modifier'],
      ru: ['клавиатура', 'модификатор'],
      pl: ['klawiatura', 'modyfikator'],
      de: ['tastatur', 'modifikator'],
      fr: ['clavier', 'modificateur'],
      es: ['teclado', 'modificador'],
      pt: ['teclado', 'modificador'],
      it: ['tastiera', 'modificatore'],
      ro: ['tastatură', 'modificator'],
      he: ['מקלדת', 'מקש'],
    },
  },
  '⌘': {
    aliases: {
      en: ['command', 'cmd', 'super', 'apple'],
      ru: ['command', 'cmd', 'клавиша'],
      pl: ['command', 'cmd'],
      de: ['command', 'cmd'],
      fr: ['commande', 'cmd'],
      es: ['command', 'cmd'],
      pt: ['command', 'cmd'],
      it: ['command', 'cmd'],
      ro: ['command', 'cmd'],
      he: ['command', 'cmd'],
    },
    tags: {
      en: ['keyboard', 'modifier'],
      ru: ['клавиатура', 'модификатор'],
      pl: ['klawiatura', 'modyfikator'],
      de: ['tastatur', 'modifikator'],
      fr: ['clavier', 'modificateur'],
      es: ['teclado', 'modificador'],
      pt: ['teclado', 'modificador'],
      it: ['tastiera', 'modificatore'],
      ro: ['tastatură', 'modificator'],
      he: ['מקלדת', 'מקש'],
    },
  },
  '': {
    aliases: {
      en: ['apple logo', 'apple'],
      ru: ['яблоко', 'логотип apple'],
      pl: ['apple', 'logo apple'],
      de: ['apple', 'logo apple'],
      fr: ['apple', 'logo apple'],
      es: ['apple', 'logotipo apple'],
      pt: ['apple', 'logótipo apple'],
      it: ['apple', 'logo apple'],
      ro: ['apple', 'logo apple'],
      he: ['apple', 'סמל אפל'],
    },
    tags: {
      en: ['brand', 'keyboard'],
      ru: ['бренд', 'клавиатура'],
      pl: ['marka', 'klawiatura'],
      de: ['marke', 'tastatur'],
      fr: ['marque', 'clavier'],
      es: ['marca', 'teclado'],
      pt: ['marca', 'teclado'],
      it: ['marca', 'tastiera'],
      ro: ['marcă', 'tastatură'],
      he: ['מותג', 'מקלדת'],
    },
    description: {
      en: 'Apple logo, encoded in Unicode’s private-use area. Its appearance depends on the font.',
      ru: 'Логотип Apple в области частного использования Unicode. Отображение зависит от шрифта.',
    },
  },
};

function createItem(symbol: string): SymbolSearchItem {
  const baseNames =
    symbolNames[symbol] ??
    (symbol === '\u00a0'
      ? {
          en: 'non-breaking space',
          ru: 'неразрывный пробел',
          pl: 'spacja niełamliwa',
          fr: 'espace insécable',
          de: 'geschütztes Leerzeichen',
          es: 'espacio inseparable',
          pt: 'espaço inseparável',
          it: 'spazio unificatore',
          ro: 'spațiu inseparabil',
          he: 'רווח קשיח',
          tr: 'bölünemez boşluk',
          nl: 'vaste spatie',
          vi: 'dấu cách không ngắt',
          ar: 'مسافة غير فاصلة',
        }
      : undefined);
  const names: Record<Locale, string> = {
    ru: symbol,
    en: symbol,
    pl: symbol,
    fr: symbol,
    de: symbol,
    es: symbol,
    pt: symbol,
    it: symbol,
    ro: symbol,
    he: symbol,
    ar: symbol,
    tr: symbol,
    vi: symbol,
    nl: symbol,
  };

  for (const locale of locales) {
    const next = baseNames?.[locale];
    if (next) {
      names[locale] = next;
    }
  }

  const group = searchGroups.find((entry) => entry.symbols.includes(symbol));
  const aliases = Object.fromEntries(
    locales.map((locale) => [
      locale,
      [
        ...(metadata[symbol]?.aliases?.[locale] ?? []),
        ...(group?.terms[locale].split('|') ?? []),
      ],
    ]),
  );
  return {
    symbol,
    names,
    aliases,
    tags: metadata[symbol]?.tags ?? {},
    description: {
      ...group?.description,
      ...metadata[symbol]?.description,
      ...symbolDefinitions[symbol],
    },
    bindings: [],
  };
}

function buildSearchIndex(keys: readonly LayoutKey[]) {
  const searchIndexItems: SymbolSearchItem[] = [];
  const itemsBySymbol = new Map<string, SymbolSearchItem>(
    [...Object.keys(symbolNames), '\u00a0'].map((symbol) => [
      symbol,
      createItem(symbol),
    ]),
  );

  for (const entry of keys) {
    const addBinding = (
      mode: SymbolSearchMode,
      text: string | undefined,
      quick = false,
    ) => {
      if (!text) {
        return;
      }
      const record = itemsBySymbol.get(text) ?? createItem(text);
      itemsBySymbol.set(text, record);

      if (
        record.bindings.some(
          (item) => item.mode === mode && item.keyCode === entry.code,
        )
      ) {
        return;
      }

      record.bindings.push({
        mode,
        keyLabel: entry.label || entry.code,
        keyCode: entry.code,
        quick,
      });
    };

    addBinding(1, entry.primary.text, entry.quick);
    addBinding(2, entry.secondary.text);
    for (const [mode, action] of [
      [1, entry.primary],
      [2, entry.secondary],
    ] as const) {
      const dead = action.dead;
      if (dead && accents[dead]) {
        const symbol = accents[dead].spacing;
        const record = itemsBySymbol.get(symbol) ?? createItem(symbol);
        for (const locale of locales) {
          const name = messages[locale][accentMessageKeys[dead]];
          if (!itemsBySymbol.has(symbol)) {
            record.names[locale] = name;
          }
          record.aliases[locale] = [
            ...(record.aliases[locale] ?? []),
            name,
            ...accentSearchMetadata[locale][0].split('|'),
          ];
          record.description[locale] = accentSearchMetadata[locale][1];
        }
        record.bindings.push({
          mode,
          keyCode: entry.code,
          keyLabel: entry.label,
          quick: mode === 1 && entry.quick,
          finishWithSpace: true,
        });
        itemsBySymbol.set(symbol, record);
      }
    }
  }

  for (const record of itemsBySymbol.values()) {
    if (!record.bindings.length) {
      continue;
    }
    record.bindings.sort((left, right) => {
      if (left.mode !== right.mode) {
        return left.mode - right.mode;
      }
      return left.keyLabel.localeCompare(right.keyLabel);
    });
    enrichSymbolUsage(record);
    searchIndexItems.push(record);
  }

  return searchIndexItems;
}
const indexCache = new WeakMap<readonly LayoutKey[], SymbolSearchItem[]>();
/** Fold accents without collapsing distinct symbols such as superscript digits. */
export function normalizeSearchTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/ß/g, 'ss')
    .trim();
}

/** Bounded optimal-string-alignment distance; adjacent swaps count as one typo. */
function typoDistance(
  word: string,
  token: string,
  limit: number,
): number | null {
  if (Math.abs(word.length - token.length) > limit) {
    return null;
  }
  let older: number[] = [];
  let previous = Array.from({ length: token.length + 1 }, (_, i) => i);
  for (let i = 1; i <= word.length; i++) {
    const current = [i];
    for (let j = 1; j <= token.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + Number(word[i - 1] !== token[j - 1]),
      );
      if (
        i > 1 &&
        j > 1 &&
        word[i - 1] === token[j - 2] &&
        word[i - 2] === token[j - 1]
      ) {
        current[j] = Math.min(current[j], older[j - 2] + 1);
      }
    }
    older = previous;
    previous = current;
  }
  return previous[token.length] <= limit ? previous[token.length] : null;
}

// Exact > prefix > word start > substring > subsequence > spelling correction.
export function scoreSearchTerm(
  candidate: string,
  token: string,
): number | null {
  if (candidate === token) {
    return 0;
  }
  if (candidate.startsWith(token)) {
    return 100;
  }
  const at = candidate.indexOf(token);
  if (at >= 0) {
    // An earlier substring must not hide a later word prefix (строчная ять).
    let occurrence = at;
    while (occurrence >= 0) {
      if (/[^\p{L}\p{N}]/u.test(candidate[occurrence - 1])) {
        return 200 + Math.min(occurrence, 30);
      }
      occurrence = candidate.indexOf(token, occurrence + 1);
    }
    return 300 + Math.min(at, 30);
  }
  if (token.length < 2 || !/^[\p{L}\p{N}]+$/u.test(token)) {
    return null;
  }
  let previous = -1;
  let gaps = 0;
  let subsequence = true;
  for (const character of token) {
    const next = candidate.indexOf(character, previous + 1);
    if (next < 0) {
      subsequence = false;
      break;
    }
    gaps += next - previous - 1;
    previous = next;
  }
  if (subsequence) {
    return 400 + Math.min(gaps, 80);
  }
  // Never guess short abbreviations, literal symbols, numbers or Unicode codes.
  if (token.length < 4 || !/^\p{L}+$/u.test(token)) {
    return null;
  }
  let best = Infinity;
  for (const word of candidate.match(/\p{L}+/gu) ?? []) {
    if (word.length < 4) {
      continue;
    }
    const limit = Math.min(word.length, token.length) >= 8 ? 2 : 1;
    const distance = typoDistance(word, token, limit);
    if (distance !== null) {
      best = Math.min(best, 500 + distance * 20);
    }
  }
  return Number.isFinite(best) ? best : null;
}

const searchableFields = (items: readonly SymbolSearchItem[]) =>
  items.map((item) => ({
    item,
    fields: [
      ...symbolAssociationTerms(item.symbol).map((value) => ({
        value: normalizeSearchTerm(value),
        weight: 10,
      })),
      { value: normalizeSearchTerm(item.symbol), weight: 0 },
      ...Object.values(item.names).map((value) => ({
        value: normalizeSearchTerm(value),
        weight: 0,
      })),
      ...Object.values(metadata[item.symbol]?.aliases ?? {})
        .flat()
        .map((value) => ({ value: normalizeSearchTerm(value), weight: 5 })),
      ...Object.values(item.aliases)
        .flat()
        .map((value) => ({ value: normalizeSearchTerm(value), weight: 10 })),
      ...Object.values(item.tags)
        .flat()
        .map((value) => ({ value: normalizeSearchTerm(value), weight: 20 })),
      {
        value: item.symbol.codePointAt(0)!.toString(16).padStart(4, '0'),
        weight: 0,
      },
      {
        value: 'u+' + item.symbol.codePointAt(0)!.toString(16).padStart(4, '0'),
        weight: 0,
      },
    ],
  }));

export function getAllSymbolSearchItems(
  keys: readonly LayoutKey[] = layout,
): readonly SymbolSearchItem[] {
  let items = indexCache.get(keys);
  if (!items) {
    items = buildSearchIndex(keys);
    indexCache.set(keys, items);
  }
  return items;
}

export function searchSymbolItems(
  query: string,
  locale: Locale,
  keys: readonly LayoutKey[] = layout,
): SearchMatch[] {
  return searchSymbolCollection(query, locale, getAllSymbolSearchItems(keys));
}

const fieldsCache = new WeakMap<
  readonly SymbolSearchItem[],
  ReturnType<typeof searchableFields>
>();

/** Shared matching for the trainer and the configurable symbol palette. */
export function searchSymbolCollection(
  query: string,
  locale: Locale,
  searchIndexItems: readonly SymbolSearchItem[],
): SearchMatch[] {
  let searchable = fieldsCache.get(searchIndexItems);
  if (!searchable) {
    searchable = searchableFields(searchIndexItems);
    fieldsCache.set(searchIndexItems, searchable);
  }
  const collator = new Intl.Collator(locale);
  // Literal lookup happens before trimming: NBSP itself is a searchable symbol.
  const literal = searchIndexItems.find((item) => item.symbol === query);
  const tokens = normalizeSearchTerm(query).split(/\s+/u).filter(Boolean);
  if (literal && !tokens.length) {
    return [{ item: literal, score: -1 }];
  }
  const ranked: SearchMatch[] = [];
  const scoreCache = new Map<string, number | null>();
  for (const { item, fields } of searchable) {
    if (item === literal) {
      ranked.push({ item, score: -1 });
      continue;
    }
    const scores = tokens.map((token) =>
      Math.min(
        ...fields.map((field) => {
          const cacheKey = `${field.value}\0${token}`;
          if (!scoreCache.has(cacheKey)) {
            scoreCache.set(cacheKey, scoreSearchTerm(field.value, token));
          }
          const score = scoreCache.get(cacheKey)!;
          return score === null ? Infinity : score + field.weight;
        }),
      ),
    );
    if (scores.every(Number.isFinite)) {
      ranked.push({ item, score: scores.reduce((a, b) => a + b, 0) });
    }
  }
  return ranked.sort(
    (a, b) =>
      a.score - b.score ||
      collator.compare(a.item.names[locale], b.item.names[locale]) ||
      a.item.symbol.localeCompare(b.item.symbol),
  );
}

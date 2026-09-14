import type { Messages } from '../messages.ts';

export const fr = {
  productName: 'Disposition typographique de Semyon Yushkevich',
  pageTitle: 'Disposition typographique de Semyon Yushkevich',
  pageDescription:
    'Un clavier typographique, des exercices de saisie et un guide des symboles dans le navigateur. Passez du mode de symboles de base au mode étendu pour saisir la ponctuation, les devises et d’autres caractères spéciaux.',
  brandTitle: 'disposition typographique',
  headerActions:
    'Apparence, langue de l’interface et informations sur le projet',
  sourceLabel: 'Code source sur GitHub',
  sourceTooltip: 'code source',
  helpLabel: 'Comment utiliser la disposition du clavier',
  helpTooltip: 'mode d’emploi',
  closeHelp: 'Fermer l’aide',
  helpTitle: 'Une touche {modifier}. Plus de possibilités.',
  helpIntro:
    'La disposition est déjà active. Commencez par saisir un caractère.',
  helpPrimaryTitle: 'Mode symboles : appuyez sur {modifier}',
  helpPrimaryBody:
    'Appuyez ensuite sur une touche : {alt} {arrow} {key} donne {symbol}. Prenez le temps nécessaire entre les pressions.',
  helpSecondaryTitle: 'Mode étendu : appuyez encore sur {modifier}',
  helpSecondaryBody:
    '{alt} {alt} {arrow} {key} donne {symbol}. Vous pouvez encore maintenir {modifier} lors de la seconde pression.',
  helpBasicTitle: 'Mode de base : une combinaison',
  helpBasicBody:
    'Maintenez l’une des touches {alt} avec {minus}, {slash}, {comma} ou {period} pour saisir {symbols}.',
  helpAccentTitle: 'L’accent d’abord, puis la lettre',
  helpAccentBody:
    'Pour ajouter un accent tonique, appuyez sur {alt} {alt} {slash}, puis saisissez la lettre : {letter} → {result}. Vous pouvez aussi accentuer une lettre diacritée ; par exemple, en {language} : {variant}.',
  helpLocaleNote:
    'La langue du clavier détermine les libellés et la saisie à l’écran. Pour la saisie physique, changez la langue du système. Les caractères nationaux accessibles avec {modifier} dépendent de la disposition choisie.',
  helpScopeNote:
    'Saisissez du texte n’importe où dans la fenêtre : le texte ou {modifier} ramène le focus dans le champ de saisie. La recherche, les dialogues et la navigation fonctionnent normalement. Le système peut intercepter des raccourcis ; utilisez alors les touches à l’écran. Esc, {cancelModifiers} et la sortie du champ annulent le symbole en attente. Shift reste un modificateur ordinaire.',
  inputSection: 'Essayez la disposition typographique',
  inputLabel: 'Texte pour essayer la disposition',
  inputPlaceholder: 'Écrivez quelque chose…',
  resetLabel: 'Effacer le champ de saisie',
  resetTooltip: 'recommencer',
  keyboardTitle: 'Birman',
  keyHint: 'Touche {key} :',
  capsInstantHint: 'Touche {key}, changement instantané de langue :',
  capsQuickHint: 'Touche {key}, changement rapide de langue :',
  modeLabel: 'Mode :',
  languageSlotHint:
    'Choisissez {slot} — {language} : maintenez {caps} et appuyez sur {key}.',
  symbolEntryHint: 'Appuyez sur {alt} pour activer le mode symboles {mode}.',
  extendedEntryHint:
    'Appuyez sur {alt} deux fois pour activer le mode étendu {mode}.',
  extendedNextHint:
    'Appuyez sur {alt} encore une fois pour activer le mode étendu {mode}.',
  basicOutputHint:
    'En mode de base {mode}, maintenez {alt} et appuyez sur {key} pour saisir {symbol}.',
  symbolOutputHint: 'En mode symboles {mode}, elle produit {symbol}.',
  extendedOutputHint: 'En mode étendu {mode}, elle produit {symbol}.',
  chooseMode: 'Choisir le mode pour la prochaine touche',
  basicMode: 'de base',
  primaryMode: 'symboles',
  secondaryMode: 'étendu',
  typingModes: 'Modes de saisie',
  keyboardScroll:
    'Clavier à l’écran. Faites défiler horizontalement si nécessaire.',
  space: 'espace',
  nonBreakingSpace: 'espace insécable',
  primarySymbol: 'mode symboles, {modifier} une fois : {symbol}',
  secondarySymbol: 'mode étendu, {modifier} deux fois : {symbol}',
  emptyPrimary: 'mode symboles sans affectation',
  emptySecondary: 'mode étendu sans affectation',
  diacriticCycleHint:
    'Appuyez sur Shift pour parcourir les variantes diacritiques de la lettre saisie.',
  languageSlotsHint:
    'Maintenez {caps} et appuyez sur {j} — {l1}, {k} — {l2}, {l} — {l3} ou {semicolon} — {l4} pour choisir une langue.',
  hintLabel: 'Conseil :',
  hintsLabel: 'Conseils :',
  typographyToggleHint:
    'Appuyez sur les deux touches {ctrl} ensemble, puis relâchez-les pour désactiver ou activer la disposition.',
  typographyDisabledWarning:
    'Attention : la disposition est désactivée. Appuyez sur les deux touches {ctrl} ensemble, puis relâchez-les pour la réactiver.',
  accentModeWarning:
    'Attention : le mode accent tonique est activé. Saisissez une voyelle.',
  keyDetailHelp:
    'Appuyez sur {alt} pour le mode symboles. Appuyez deux fois sur {alt} pour le mode étendu.',
  resetMode: 'Appuyez sur {esc} pour réinitialiser le mode.',
  entered: 'Saisi : {symbol}',
  themeLight: 'Clair',
  themeDark: 'Sombre',
  chooseTheme: 'Passer au thème : {theme}',
  themeMenu: 'Thème de couleurs',
  themeTooltip: 'thème : {theme}',
  interfaceLanguage: 'Langue de l’interface',
  interfaceLanguageDescription:
    'Choisissez la langue de l’interface et sa carte de clavier de base.',
  closeInterfaceLanguage: 'Fermer le choix de la langue de l’interface',
  chooseInterfaceLanguage: 'Langue de l’interface : {language}',
  keyboardLanguage: 'Langue du clavier',
  chooseKeyboardLanguage: 'Choisir la langue du clavier : {language}',
  experimental: 'Expérimental',
  experimentalLanguageSupport:
    'La prise en charge des langues non européennes est expérimentale. Les caractères et les méthodes de saisie peuvent ne pas couvrir toutes les conventions linguistiques.',
  keyboardLanguageDescription: 'Pour les libellés et la saisie à l’écran.',
  closeKeyboardLanguage: 'Fermer le choix de la langue',
  keyboardLanguageList: 'Langues du clavier',
  findLanguage: 'Rechercher une langue…',
  languageNotFound: 'Aucune langue trouvée',
  languageRu: 'Russe',
  languageEn: 'Anglais',
  languagePl: 'Polonais',
  languageFr: 'Français (France)',
  languageDe: 'Allemand (Allemagne)',
  languageEs: 'Espagnol (Espagne)',
  languagePt: 'Portugais (Portugal)',
  languageIt: 'Italien (Italie)',
  languageRo: 'Roumain (Roumanie)',
  languageHe: 'Hébreu (Israël)',
  hebrewInputNote:
    'Hébreu : maintenez {altKey} droit ({altGr}) pour le niqqud et les signes nationaux : {hebrewExamples}. Utilisez {altKey} gauche pour les accords typographiques de base. Le cycle {shiftKey} et l’accent aigu ne remplacent pas la vocalisation hébraïque.',
  accentGrave: 'accent grave',
  accentCircumflex: 'accent circonflexe',
  accentBreve: 'brève',
  accentRing: 'rond en chef',
  accentDoubleacute: 'double accent aigu',
  accentDiaeresis: 'tréma',
  accentCedilla: 'cédille',
  accentCaron: 'caron',
  accentTilde: 'tilde',
  accentAcute: 'accent aigu',
  keyBackspace: 'Retour arrière',
  keyTab: 'Tabulation',
  keyCapsLock: 'Verr. maj.',
  keyEnter: 'Entrée',
  keyShift: 'Maj.',
  keyCtrl: 'Ctrl',
  keyMeta: 'Super',
  keyAlt: 'Alt',
  keyMenu: 'Menu contextuel',
  platform: 'Plateforme',
  choosePlatform: 'Choisir la plateforme : {platform}',
  fnKeyInfo: 'La touche Fn est gérée par macOS',
  tabInputHint:
    'Insère une tabulation; aucune fonction typographique supplémentaire.',
  backspaceInputHint:
    'Supprime la sélection ou le caractère précédent; aucune fonction typographique supplémentaire.',
  enterInputHint:
    'Insère un saut de ligne; aucune fonction typographique supplémentaire.',
  standardCharacterHint:
    'Saisit des caractères ordinaires ; aucune fonction typographique supplémentaire.',
  unusedKeyHint:
    'La touche {key} conserve son comportement standard et ne fait pas partie de la disposition typographique.',
  shiftUsageHint:
    'Maintenez {shift} pour les majuscules et les symboles supérieurs des touches. Après une lettre, appuyez puis relâchez {shift} pour parcourir ses variantes diacritiques disponibles.',
  altUsageHint:
    'La touche principale de saisie typographique : donne accès aux symboles supplémentaires et permet de saisir les symboles rapides lorsqu’elle est maintenue.',
  keyArrowLeft: 'Flèche gauche',
  keyArrowRight: 'Flèche droite',
  keyArrowUp: 'Flèche vers le haut',
  keyArrowDown: 'Flèche vers le bas',
} satisfies Messages;

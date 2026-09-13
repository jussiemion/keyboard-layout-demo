import type { Messages } from '../messages.ts';

export const pt = {
  productName: 'Disposição tipográfica de Semyon Yushkevich',
  pageTitle: 'Disposição tipográfica de Semyon Yushkevich',
  pageDescription:
    'Símbolos tipográficos, sinais diacríticos e mudança de idioma.',
  brandTitle: 'disposição tipográfica',
  headerActions: 'Aspeto, idioma da interface e informações do projeto',
  sourceLabel: 'Código-fonte no GitHub',
  sourceTooltip: 'código-fonte',
  helpLabel: 'Como utilizar a disposição do teclado',
  helpTooltip: 'como funciona',
  closeHelp: 'Fechar a ajuda',
  helpTitle: 'Uma tecla {modifier}. Mais possibilidades.',
  helpIntro:
    'A disposição já está ativa. Comece por escrever qualquer carácter.',
  helpPrimaryTitle: 'Modo de símbolos: prima {modifier}',
  helpPrimaryBody:
    'Depois prima uma tecla: {alt} {arrow} {key} produz {symbol}. Não há limite de tempo entre as pressões.',
  helpSecondaryTitle: 'Modo alargado: prima {modifier} novamente',
  helpSecondaryBody:
    '{alt} {alt} {arrow} {key} produz {symbol}. Pode manter {modifier} premida na segunda vez.',
  helpBasicTitle: 'Modo básico: uma combinação',
  helpBasicBody:
    'Mantenha uma das teclas {alt} premida com {minus}, {slash}, {comma} ou {period} para escrever {symbols}.',
  helpAccentTitle: 'Primeiro o acento, depois a letra',
  helpAccentBody:
    'Para adicionar um acento, prima {alt} {alt} {slash} e depois a letra: {letter} → {result}. Também pode acentuar uma letra com diacríticos; por exemplo, em {language}: {variant}.',
  helpLocaleNote:
    'O idioma do teclado altera as legendas e a escrita no ecrã. Para o teclado físico, altere o idioma no sistema. Os caracteres nacionais com {modifier} dependem da disposição escolhida.',
  helpScopeNote:
    'Escreva em qualquer lugar da janela: o texto ou {modifier} devolve o foco ao campo. A pesquisa, os diálogos e a navegação funcionam normalmente. O sistema pode intercetar atalhos; nesse caso, use as teclas no ecrã. Esc, {cancelModifiers} e sair do campo cancelam o símbolo pendente. Shift continua a ser um modificador normal.',
  inputSection: 'Experimente a disposição tipográfica',
  inputLabel: 'Texto para experimentar a disposição',
  inputPlaceholder: 'Escreva algo…',
  resetLabel: 'Limpar o campo de texto',
  resetTooltip: 'recomeçar',
  keyboardTitle: 'Birman',
  keyHint: 'Tecla {key}:',
  capsInstantHint: 'Tecla {key}, mudança instantânea de idioma:',
  capsQuickHint: 'Tecla {key}, mudança rápida de idioma:',
  modeLabel: 'Modo:',
  languageSlotHint:
    'Selecione {slot} — {language}: mantenha {caps} premido e prima {key}.',
  symbolEntryHint: 'Prima {alt} para ativar o modo de símbolos {mode}.',
  extendedEntryHint:
    'Prima {alt} duas vezes para ativar o modo alargado {mode}.',
  extendedNextHint:
    'Prima {alt} mais uma vez para ativar o modo alargado {mode}.',
  basicOutputHint:
    'No modo básico {mode}, mantenha {alt} premido e prima {key} para escrever {symbol}.',
  symbolOutputHint: 'No modo de símbolos {mode} produz {symbol}.',
  extendedOutputHint: 'No modo alargado {mode} produz {symbol}.',
  chooseMode: 'Escolher o modo para a próxima tecla',
  basicMode: 'básico',
  primaryMode: 'símbolos',
  secondaryMode: 'alargado',
  typingModes: 'Modos de escrita',
  keyboardScroll: 'Teclado no ecrã. Desloque horizontalmente se necessário.',
  space: 'espaço',
  nonBreakingSpace: 'espaço inseparável',
  primarySymbol: 'modo de símbolos, {modifier} uma vez: {symbol}',
  secondarySymbol: 'modo alargado, {modifier} duas vezes: {symbol}',
  emptyPrimary: 'modo de símbolos sem atribuição',
  emptySecondary: 'modo alargado sem atribuição',
  diacriticCycleHint:
    'Prima Shift para percorrer as variantes diacríticas da letra introduzida.',
  languageSlotsHint:
    'Mantenha {caps} premido e prima {j} — {l1}, {k} — {l2}, {l} — {l3} ou {semicolon} — {l4} para escolher um idioma.',
  hintLabel: 'Sugestão:',
  hintsLabel: 'Sugestões:',
  typographyToggleHint:
    'Prima as duas teclas {ctrl} ao mesmo tempo e solte-as para desativar ou ativar a disposição.',
  typographyDisabledWarning:
    'Atenção: a disposição está desativada. Prima as duas teclas {ctrl} ao mesmo tempo e solte-as para a ativar.',
  accentModeWarning:
    'Atenção: o modo de acento está ativo. Introduza uma vogal.',
  keyDetailHelp:
    'Prima {alt} para o modo de símbolos. Prima {alt} duas vezes para o modo alargado.',
  resetMode: 'Prima {esc} para repor o modo.',
  entered: 'Introduzido: {symbol}',
  themeLight: 'Claro',
  themeDark: 'Escuro',
  chooseTheme: 'Mudar para o tema: {theme}',
  themeMenu: 'Tema de cores',
  themeTooltip: 'tema: {theme}',
  interfaceLanguage: 'Idioma da interface',
  interfaceLanguageDescription:
    'Escolha o idioma da interface e o respetivo mapa de teclado base.',
  closeInterfaceLanguage: 'Fechar a seleção do idioma da interface',
  chooseInterfaceLanguage: 'Idioma da interface: {language}',
  keyboardLanguage: 'Idioma do teclado',
  chooseKeyboardLanguage: 'Escolher o idioma do teclado: {language}',
  keyboardLanguageDescription: 'Para as legendas e a escrita no ecrã.',
  closeKeyboardLanguage: 'Fechar a seleção do idioma',
  keyboardLanguageList: 'Idiomas do teclado',
  findLanguage: 'Procurar um idioma…',
  languageNotFound: 'Nenhum idioma encontrado',
  languageRu: 'Russo',
  languageEn: 'Inglês',
  languagePl: 'Polaco',
  languageFr: 'Francês (França)',
  languageDe: 'Alemão (Alemanha)',
  languageEs: 'Espanhol (Espanha)',
  languagePt: 'Português (Portugal)',
  languageIt: 'Italiano (Itália)',
  languageRo: 'Romeno (Roménia)',
  languageHe: 'Hebraico (Israel)',
  hebrewInputNote:
    'Hebraico: mantenha {altKey} direito ({altGr}) para niqqud e sinais nacionais: {hebrewExamples}. Use {altKey} esquerdo para os acordes tipográficos básicos. O ciclo com {shiftKey} e o acento agudo não substituem a vocalização hebraica.',
  accentGrave: 'acento grave',
  accentCircumflex: 'acento circunflexo',
  accentBreve: 'breve',
  accentRing: 'anel superior',
  accentDoubleacute: 'acento agudo duplo',
  accentDiaeresis: 'trema',
  accentCedilla: 'cedilha',
  accentCaron: 'caron',
  accentTilde: 'til',
  accentAcute: 'acento agudo',
  keyBackspace: 'Retrocesso',
  keyTab: 'Tabulação',
  keyCapsLock: 'Caps Lock',
  keyEnter: 'Enter',
  keyShift: 'Shift',
  keyCtrl: 'Ctrl',
  keyMeta: 'Super',
  keyAlt: 'Alt',
  keyMenu: 'Menu de contexto',
  platform: 'Plataforma',
  choosePlatform: 'Escolher plataforma: {platform}',
  fnKeyInfo: 'A tecla Fn é gerida pelo macOS',
  tabInputHint: 'Insere uma tabulação; sem funções tipográficas adicionais.',
  backspaceInputHint:
    'Apaga a seleção ou o caráter anterior; sem funções tipográficas adicionais.',
  enterInputHint:
    'Insere uma quebra de linha; sem funções tipográficas adicionais.',
  standardCharacterHint:
    'Introduz caracteres normais; não tem funções tipográficas adicionais.',
  unusedKeyHint:
    'A tecla {key} mantém o comportamento padrão e não faz parte da disposição tipográfica.',
  shiftUsageHint:
    'Mantém {shift} premido para maiúsculas e símbolos superiores das teclas. Depois de uma letra, prime e solta {shift} para percorrer as variantes diacríticas disponíveis.',
  altUsageHint:
    'A tecla principal de introdução tipográfica: dá acesso a símbolos adicionais e permite introduzir símbolos rápidos enquanto está premida.',
  keyArrowLeft: 'Seta para a esquerda',
  keyArrowRight: 'Seta para a direita',
  keyArrowUp: 'Seta para cima',
  keyArrowDown: 'Seta para baixo',
} satisfies Messages;

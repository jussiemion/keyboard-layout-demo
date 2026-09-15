// Static utility lists remain visible to Tailwind’s source scanner.
export const helpKeysClasses =
  'inline-flex items-center [flex-wrap:wrap] [gap:4px] [unicode-bidi:isolate] [vertical-align:middle]';

export const helpSymbolStripClasses =
  'grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:10px] [margin-top:16px] [font-size:12px]';

export const helpCaptionClasses =
  '[font-size:11px] text-(--sub) [line-height:1.7] [margin-top:12px]';

export const helpPairClasses =
  'flex [flex-wrap:wrap] [justify-content:flex-end]';

export const languageDialogClasses = [
  'max-w-[min(480px,calc(100%-32px))] sm:max-w-[min(480px,calc(100%-32px))]',
  'max-h-[calc(100dvh-32px)] overflow-y-auto p-5',
  'gap-3.5 border border-border rounded-[10px]',
].join(' ');

export const languageDialogHeaderClasses = 'pe-9';

export const languageDialogTitleClasses = 'text-lg font-medium leading-[1.4]';

export const languageDialogCloseClasses = 'absolute top-3 end-3 text-(--sub)';

export const languageCodeClasses =
  'ms-auto shrink-0 whitespace-nowrap text-xs opacity-70';

export const homeMarkClasses = [
  'absolute [width:10px] [height:2px]',
  '[background:var(--border)] [bottom:3px] [left:calc(50%_-_5px)]',
  '[border-radius:1px]',
].join(' ');

export const helpCloseClasses = 'absolute top-2.5 end-2.5 text-(--sub)';

export const helpTitleClasses = [
  'text-[21px] font-medium text-(--accent-ink)',
  'leading-normal pe-5',
].join(' ');

export const arrowClusterClasses = [
  '[flex:var(--units)_1_0] min-w-0 [height:57px] grid',
  '[grid-template-columns:repeat(3,_minmax(0,_1fr))]',
  '[grid-template-rows:repeat(2,_minmax(0,_1fr))] [gap:3px]',
].join(' ');

export const symbolSearchSectionClasses = 'flex shrink-0';

export const symbolSearchCommandClasses = 'p-0 bg-background';

export const symbolSearchCloseClasses = 'shrink-0 text-(--sub)';

export const symbolSearchCountClasses =
  '[padding:14px_18px_8px] text-(--sub) [font-size:12px] flex justify-between';

export const symbolSearchListClasses = [
  'px-2 pt-1 pb-3 max-h-none min-h-0 flex-1',
  'overflow-y-auto [scrollbar-width:thin]',
].join(' ');

export const symbolSearchItemMetaClasses =
  '[font-size:12px] text-(--sub) [overflow:hidden] [white-space:nowrap] [text-overflow:ellipsis]';

export const symbolSearchUnicodeClasses =
  '[margin-top:6px] [font-size:12px] text-(--sub) [overflow-wrap:anywhere]';

export const symbolSearchShortcutKeysClasses =
  'inline-flex items-center [gap:6px] [flex-wrap:wrap]';

export const symbolSearchFooterSeparatorClasses = '[margin-inline:6px]';

export const settingsFormClasses =
  'flex [flex-direction:column] [max-height:calc(100dvh_-_34px)] min-h-0';

export const settingsSlotsDescriptionClasses = '[margin-block:18px_12px]';

export const settingsSlotHeadingClasses =
  'flex [flex-wrap:wrap] items-center justify-between [gap:8px] [font-size:12px]';

export const settingsStorageNoteClasses = '[margin-top:16px]';

export const resultExamplesClasses =
  'inline-flex [align-items:baseline] [flex-wrap:wrap] [gap:4px]';

export const headerMenuClasses = [
  'w-[300px] max-w-[calc(100vw-32px)] p-1.5',
  'border border-border rounded-xl',
  'shadow-(--dialog-shadow)',
].join(' ');

export const headerMenuValueClasses =
  '[margin-inline-start:auto] shrink-0 text-(--sub) [font-size:12px]';

export const tourEyebrowClasses =
  'inline-flex items-center [gap:8px] [font-size:12px] text-(--sub)';

export const tourMutedClasses =
  'text-(--sub) [font-size:12px] [margin-top:8px]';

export const tourKeySequenceClasses = 'inline-flex [gap:4px]';

export const tourErrorClasses = '[color:var(--destructive)] [font-size:12px]';

// Static utility lists remain visible to Tailwind’s source scanner.
export const helpKeysClasses =
  'inline-flex items-center [flex-wrap:wrap] [gap:4px] [unicode-bidi:isolate] [vertical-align:middle]';

export const helpSymbolStripClasses =
  'grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:10px] [margin-top:16px] [font-size:12px]';

export const helpCaptionClasses =
  '[font-size:11px] [color:var(--sub)] [line-height:1.7] [margin-top:12px]';

export const helpPairClasses =
  'flex [flex-wrap:wrap] [justify-content:flex-end]';

export const hintListClasses =
  '[margin:0] [padding-inline-start:1.2em] min-w-0 grid [gap:8px] [list-style:disc]';

export const languageDialogClasses = [
  '[max-width:min(480px,_calc(100%_-_32px))]',
  '[max-height:calc(100dvh_-_32px)] [overflow-y:auto] [padding:20px]',
  '[gap:14px] [border:1px_solid_var(--border)] [border-radius:10px]',
].join(' ');

export const languageDialogHeaderClasses = '[padding-inline-end:36px]';

export const languageDialogTitleClasses =
  '[font-size:18px] [font-weight:500] [line-height:1.4]';

export const languageDialogCloseClasses =
  '[position:absolute] [top:12px] [inset-inline-end:12px] [color:var(--sub)]';

export const languageCodeClasses =
  '[margin-inline-start:auto] [font-size:12px] [opacity:0.7]';

export const homeMarkClasses = [
  '[position:absolute] [width:10px] [height:2px]',
  '[background:var(--border)] [bottom:3px] [left:calc(50%_-_5px)]',
  '[border-radius:1px]',
].join(' ');

export const keyDetailContentClasses = '[display:flow-root]';

export const detailKeyClasses = '[color:var(--foreground)]';

export const helpCloseClasses =
  '[position:absolute] [top:10px] [inset-inline-end:10px] [color:var(--sub)]';

export const helpTitleClasses = [
  '[font-size:21px] [font-weight:500] [color:var(--accent-ink)]',
  '[line-height:1.5] [padding-inline-end:20px]',
].join(' ');

export const arrowClusterClasses = [
  '[flex:var(--units)_1_0] min-w-0 [height:57px] grid',
  '[grid-template-columns:repeat(3,_minmax(0,_1fr))]',
  '[grid-template-rows:repeat(2,_minmax(0,_1fr))] [gap:3px]',
].join(' ');

export const symbolSearchSectionClasses = 'flex shrink-0';

export const symbolSearchCommandClasses =
  '[padding:0] [background:var(--background)]';

export const symbolSearchCloseClasses = 'shrink-0 [color:var(--sub)]';

export const symbolSearchCountClasses =
  '[padding:14px_18px_8px] [color:var(--sub)] [font-size:12px] flex justify-between';

export const symbolSearchListClasses = [
  '[padding:4px_8px_12px] [max-height:none] [min-height:0] [flex:1]',
  '[overflow-y:auto] [scrollbar-width:thin]',
].join(' ');

export const symbolSearchItemMetaClasses =
  '[font-size:12px] [color:var(--sub)] [overflow:hidden] [white-space:nowrap] [text-overflow:ellipsis]';

export const symbolSearchUnicodeClasses =
  '[margin-top:6px] [font-size:12px] [color:var(--sub)] [overflow-wrap:anywhere]';

export const symbolSearchShortcutKeysClasses =
  'inline-flex items-center [gap:6px] [flex-wrap:wrap]';

export const symbolSearchFooterSeparatorClasses = '[margin-inline:6px]';

export const settingsFormClasses =
  'flex [flex-direction:column] [max-height:calc(100dvh_-_34px)] [min-height:0]';

export const settingsSlotsDescriptionClasses = '[margin-block:18px_12px]';

export const settingsSlotHeadingClasses =
  'flex [flex-wrap:wrap] items-center justify-between [gap:8px] [font-size:12px]';

export const settingsStorageNoteClasses = '[margin-top:16px]';

export const resultExamplesClasses =
  'inline-flex [align-items:baseline] [flex-wrap:wrap] [gap:4px]';

export const headerMenuClasses = [
  '[width:300px] [max-width:calc(100vw_-_32px)] [padding:6px]',
  '[border:1px_solid_var(--border)] [border-radius:12px]',
  '[box-shadow:var(--dialog-shadow)]',
].join(' ');

export const headerMenuValueClasses =
  '[margin-inline-start:auto] shrink-0 [color:var(--sub)] [font-size:12px]';

export const tourEyebrowClasses =
  'inline-flex items-center [gap:8px] [font-size:12px] [color:var(--sub)]';

export const tourMutedClasses =
  '[color:var(--sub)] [font-size:12px] [margin-top:8px]';

export const tourKeySequenceClasses = 'inline-flex [gap:4px]';

export const tourErrorClasses = '[color:var(--destructive)] [font-size:12px]';

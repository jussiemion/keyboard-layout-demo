:HL["/keyboard-layout-demo/_next/static/css/index.Be29UtSn.css","style"     ]
:HL["/keyboard-layout-demo/fonts/layout-mono.woff2","font",{"crossOrigin":"anonymous","type":"font/woff2"}]
:HL["/keyboard-layout-demo/fonts/layout-symbols.woff2","font",{"crossOrigin":"anonymous","type":"font/woff2"}]
:HL["/keyboard-layout-demo/fonts/layout-symbols-2.woff2","font",{"crossOrigin":"anonymous","type":"font/woff2"}]
:HL["/keyboard-layout-demo/fonts/layout-runic.woff2","font",{"crossOrigin":"anonymous","type":"font/woff2"}]
:HL["/keyboard-layout-demo/fonts/layout-apple.woff2","font",{"crossOrigin":"anonymous","type":"font/woff2"}]
2:T119a,(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('keyboard-layout-demo.theme');
    if (saved === 'vesper' || saved === 'vesper_light') preference = saved;
  } catch {}
  const theme = preference === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'vesper' : 'vesper_light')
    : preference;
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'vesper');
})();
(() => {
  const supported = ["ru","en","pl","fr","de","es","pt","it","ro"];
  let preference = null;
  try {
    const saved = localStorage.getItem('keyboard-layout-demo.ui-locale');
    if (supported.includes(saved)) preference = saved;
  } catch {}
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const detected = languages.map(language => language.toLowerCase().split(/[-_]/)[0]).find(language => supported.includes(language)) || 'en';
  const locale = preference || detected;
  const root = document.documentElement;
  root.dataset.keyboardLocale = detected;
  root.dataset.uiLocalePreference = preference || 'auto';
  root.dataset.uiLocale = locale;
  root.lang = locale;
  const metadata = {"ru":{"title":"Типографская раскладка Юшкевича — попробовать онлайн","description":"Попробуйте типографскую раскладку Юшкевича: базовый режим, символьный режим, расширенный режим и ударения. Без установки."},"en":{"title":"Yushkevich Typographic Keyboard Layout — try online","description":"Try the Yushkevich Typographic Keyboard Layout: basic mode, symbol mode, extended mode and accents. No installation."},"pl":{"title":"Typograficzny układ klawiatury Juszkiewicza — wypróbuj online","description":"Wypróbuj typograficzny układ klawiatury Juszkiewicza: tryb podstawowy, symboli, rozszerzony i akcenty. Bez instalacji."},"fr":{"title":"Yushkevich Typographic Keyboard Layout — essayer en ligne","description":"Essayez la disposition typographique Yushkevich : modes de base, symboles et étendu, et accents. Sans installation."},"de":{"title":"Yushkevich Typographic Keyboard Layout — online ausprobieren","description":"Die typografische Tastaturbelegung Yushkevich ausprobieren: Basis-, Symbol- und erweiterter Modus sowie Akzente. Ohne Installation."},"es":{"title":"Yushkevich Typographic Keyboard Layout — probar en línea","description":"Prueba la distribución tipográfica Yushkevich: modos básico, de símbolos y ampliado, y acentos. Sin instalación."},"pt":{"title":"Yushkevich Typographic Keyboard Layout — experimentar online","description":"Experimente a disposição tipográfica Yushkevich: modos básico, de símbolos e alargado, e acentos. Sem instalação."},"it":{"title":"Yushkevich Typographic Keyboard Layout — prova online","description":"Prova il layout tipografico Yushkevich: modalità di base, simboli ed estesa, e accenti. Senza installazione."},"ro":{"title":"Yushkevich Typographic Keyboard Layout — încearcă online","description":"Încearcă dispunerea tipografică Yushkevich: modul de bază, simboluri, modul extins și accente. Fără instalare."}};
  document.title = metadata[locale].title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', metadata[locale].description);
})();
(() => {
  let preference = null;
  try {
    const saved = localStorage.getItem('keyboard-layout-demo.platform');
    if (["linux","windows","macos"].includes(saved)) preference = saved;
  } catch {}
  const root = document.documentElement;
  root.dataset.platformPreference = preference || 'auto';
  root.dataset.platform = preference || (function T_(e){let t=e.userAgent??``,n=e.platform??``;if(/Android|iPhone|iPad|iPod/i.test(t)||/Mac/i.test(n)&&(e.maxTouchPoints??0)>1)return`linux`;for(let t of[e.userAgentData?.platform??``,n]){if(/^win/i.test(t))return`windows`;if(/^mac/i.test(t))return`macos`;if(/^linux/i.test(t))return`linux`}return/Windows|Win32|Win64/i.test(t)?`windows`:/Macintosh|Mac OS X/i.test(t)?`macos`:`linux`})(navigator);
})();
(() => {
  const root = document.documentElement;
  if (root.dataset.keyboardLocale !== 'en' || root.dataset.uiLocale !== 'en' || root.dataset.theme !== 'vesper_light' || root.dataset.platform !== 'linux') {
    root.dataset.preferencesPending = 'true';
  }
})();0:{"page:/":"$L1","layout:/":[[["$","link","css:/keyboard-layout-demo/_next/static/css/index.Be29UtSn.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/keyboard-layout-demo/_next/static/css/index.Be29UtSn.css","data-rsc-css-href":"/keyboard-layout-demo/_next/static/css/index.Be29UtSn.css"}],"$undefined"],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[[["$","link","layout-mono.woff2",{"rel":"preload","href":"/keyboard-layout-demo/fonts/layout-mono.woff2","as":"font","type":"font/woff2","crossOrigin":"anonymous"}],["$","link","layout-symbols.woff2",{"rel":"preload","href":"/keyboard-layout-demo/fonts/layout-symbols.woff2","as":"font","type":"font/woff2","crossOrigin":"anonymous"}],["$","link","layout-symbols-2.woff2",{"rel":"preload","href":"/keyboard-layout-demo/fonts/layout-symbols-2.woff2","as":"font","type":"font/woff2","crossOrigin":"anonymous"}],["$","link","layout-runic.woff2",{"rel":"preload","href":"/keyboard-layout-demo/fonts/layout-runic.woff2","as":"font","type":"font/woff2","crossOrigin":"anonymous"}],["$","link","layout-apple.woff2",{"rel":"preload","href":"/keyboard-layout-demo/fonts/layout-apple.woff2","as":"font","type":"font/woff2","crossOrigin":"anonymous"}]],["$","style",null,{"children":"html[data-preferences-pending] .document-scroll-area { visibility: hidden; }"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]}],"$L3"]}]],"route:/":"$L4","__route":"route:/","__interceptionContext":null,"__layoutIds":["layout:/"],"__rootLayout":"/","__bfcacheSegmentIdentities":{"layout:/":"[\"layout\",\"layout:/\",\"root-boundary:/\",\"\"]","page:/":"[\"page\",\"page:/\",\"root-boundary:/\",\"\"]"},"__srcPage":["page"],"__layoutFlags":{"layout:/":"s"},"__artifactCompatibility":{"schemaVersion":1,"graphVersion":"app-route-graph:1177fd80f83fa7b0","deploymentVersion":"6dd13e87-5803-4c09-8058-f41972c6a560","appElementsSchemaVersion":1,"rscPayloadSchemaVersion":1,"rootBoundaryId":"/","renderEpoch":null}}
5:I["0de52af0ec6e",[],"LocaleProvider",1]
6:I["272a16f1043e",[],"ScrollArea",1]
7:I["8c0f216c4604",[],"Children",1]
8:I["593f344dc510",[],"GlobalErrorBoundary",1]
9:I["0b874ad30386",[],"default",1]
a:I["593f344dc510",[],"ErrorBoundary",1]
b:I["15c18cfaeeff",[],"LayoutSegmentProvider",1]
c:I["8c0f216c4604",[],"Slot",1]
d:I["593f344dc510",[],"NotFoundBoundary",1]
e:I["9276801271d6",[],"AppRouterScrollTarget",1]
f:I["593f344dc510",[],"RedirectBoundary",1]
3:["$","body",null,{"children":["$","$L5",null,{"children":["$","$L6",null,{"className":"document-scroll-area","children":["$","$L7",null,{}]}]}]}]
4:[[["$","meta",null,{"charSet":"utf-8"}],[["$","title","0",{"children":"Yushkevich Typographic Keyboard Layout — try online"}],["$","meta","1",{"name":"description","content":"Try the Yushkevich Typographic Keyboard Layout: basic mode, symbol mode, extended mode and accents. No installation."}],["$","link","2",{"data-vinext-streamed-icon":"$undefined","rel":"icon","href":"/keyboard-layout-demo/rune.svg","type":"$undefined","sizes":"$undefined","color":"$undefined","media":"$undefined","fetchPriority":"$undefined"}]],[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]],["$","$L8",null,{"fallback":"$9","children":["$","$La",null,{"fallback":"$9","children":["$","$Lb",null,{"providerId":"layout:/","segmentMap":{"children":[]},"children":["$","$Lc",null,{"id":"layout:/","parallelSlots":"$undefined","children":["$","$Ld",null,{"resetKey":"","fallback":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"children":["$","$Le",null,{"children":["$","$Lf",null,{"children":[["$","$Lb",null,{"providerId":"page:/","segmentMap":{"children":["__PAGE__"]},"children":["$","$Lc",null,{"id":"page:/"}]}],null]}]}]}]}]}]}]}],null,null]
10:I["6efdf509a785",[],"default",1]
1:["$","$L10",null,{"params":"$@11","searchParams":"$@12"}]
11:{}
12:{}

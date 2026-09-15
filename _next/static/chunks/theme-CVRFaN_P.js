var e=`keyboard-layout-demo.theme`,t=`keyboard-layout-demo:theme-change`,n=`(prefers-color-scheme: dark)`;function r(e){return e===`vesper`||e===`vesper_light`?e:`system`}function i(e,t){return e===`system`?t?`vesper`:`vesper_light`:e}var a=`(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('${e}');
    if (saved === 'vesper' || saved === 'vesper_light') preference = saved;
  } catch {}
  const theme = preference === 'system'
    ? (matchMedia('${n}').matches ? 'vesper' : 'vesper_light')
    : preference;
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'vesper');
})();`;function o(){let t=document.documentElement.dataset.themePreference;if(t)return r(t);try{return r(localStorage.getItem(e))}catch{return`system`}}function s(){return i(o(),window.matchMedia(n).matches)}function c(){return`vesper_light`}function l(e){let t=i(e,window.matchMedia(n).matches),r=document.documentElement;r.dataset.themePreference=e,r.dataset.theme=t,r.classList.toggle(`dark`,t===`vesper`)}function u(n){let i=r(n);l(i);try{i===`system`?localStorage.removeItem(e):localStorage.setItem(e,i)}catch{}window.dispatchEvent(new Event(t))}function d(e){let i=window.matchMedia(n),a=()=>{l(o()),e()},s=t=>{(t.key===`keyboard-layout-demo.theme`||t.key===null)&&(l(r(t.newValue)),e())};return i.addEventListener(`change`,a),window.addEventListener(t,a),window.addEventListener(`storage`,s),a(),()=>{i.removeEventListener(`change`,a),window.removeEventListener(t,a),window.removeEventListener(`storage`,s)}}export{a,d as i,c as n,u as r,s as t};
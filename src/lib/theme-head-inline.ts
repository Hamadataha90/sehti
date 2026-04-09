import type { ThemeProviderProps } from 'next-themes';

/**
 * Inline bootstrap for next-themes (v0.4.6 script.ts) — runs in <head> so it is not a client React <script>.
 * Keep in sync with props passed to {@link ThemeProvider} in root layout.
 */
export function buildThemeHeadScript(
  p: Pick<
    ThemeProviderProps,
    'attribute' | 'storageKey' | 'defaultTheme' | 'forcedTheme' | 'themes' | 'value' | 'enableSystem' | 'enableColorScheme'
  >,
): string {
  const body = `
var el=document.documentElement;
var systemThemes=['light','dark'];
function setColorScheme(theme){
  if(enableColorScheme&&systemThemes.indexOf(theme)!==-1)el.style.colorScheme=theme;
}
function updateDOM(theme){
  var attributes=Array.isArray(attribute)?attribute:[attribute];
  attributes.forEach(function(attr){
    var isClass=attr==='class';
    var classes=isClass&&value?themes.map(function(t){return value[t]||t;}):themes;
    if(isClass){
      el.classList.remove.apply(el.classList,classes);
      el.classList.add(value&&value[theme]?value[theme]:theme);
    }else{
      el.setAttribute(attr,theme);
    }
  });
  setColorScheme(theme);
}
function getSystemTheme(){
  return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}
if(forcedTheme){
  updateDOM(forcedTheme);
}else{
  try{
    var themeName=localStorage.getItem(storageKey)||defaultTheme;
    var isSystem=enableSystem&&themeName==='system';
    var th=isSystem?getSystemTheme():themeName;
    updateDOM(th);
  }catch(e){}
}`;

  const args = JSON.stringify([
    p.attribute,
    p.storageKey ?? 'theme',
    p.defaultTheme ?? 'light',
    p.forcedTheme ?? null,
    p.themes ?? ['light', 'dark'],
    p.value ?? null,
    p.enableSystem !== false,
    p.enableColorScheme !== false,
  ]).slice(1, -1);

  return `(function(attribute,storageKey,defaultTheme,forcedTheme,themes,value,enableSystem,enableColorScheme){${body}})(${args})`;
}

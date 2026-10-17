/**
 * Theme (§16.1, §16.4): light / dark follows ST (luminance of `--SmartThemeBodyColor`), the palette
 * comes from the active preset's `theme` and can be overridden by the user's colours (UI settings).
 * All AP shadow roots adopt the same static sheets plus one dynamic palette sheet.
 */
import { reactive, watchEffect } from 'vue';
import tokensCss from './styles/tokens.css?inline';
import baseCss from './styles/base.css?inline';
import messageCss from './styles/message.css?inline';
import panelCss from './styles/panel.css?inline';
import { settings } from '@/store/settings';
import { activePreset } from './state';

export type Mode = 'light' | 'dark';
export const theme = reactive({ mode: 'light' as Mode });

const staticSheet = new CSSStyleSheet();
staticSheet.replaceSync([tokensCss, baseCss, messageCss, panelCss].join('\n'));
const paletteSheet = new CSSStyleSheet();
export const sheets = [staticSheet, paletteSheet];

/** Shades derived from one base colour (500); lighter mix with white, darker with black. */
const SHADES: [number, string][] = [
  [50, 'white 92%'], [100, 'white 84%'], [200, 'white 68%'], [300, 'white 48%'], [400, 'white 24%'],
  [600, 'black 14%'], [700, 'black 28%'], [800, 'black 42%'], [900, 'black 54%'],
];
export function paletteVars(name: string, base: string): string {
  const lines = [`--ap-${name}-500: ${base};`];
  for (const [n, mix] of SHADES) lines.push(`--ap-${name}-${n}: color-mix(in oklab, ${base}, ${mix});`);
  return lines.join(' ');
}

function parseRgb(s: string): [number, number, number] | null {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(s);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s.trim());
  if (!h) return null;
  const x = h[1]!.length === 3 ? [...h[1]!].map((c) => c + c).join('') : h[1]!;
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)) as [number, number, number];
}

/** Light text on the page means a dark theme. */
export function detectMode(): Mode {
  const text = getComputedStyle(document.documentElement).getPropertyValue('--SmartThemeBodyColor') || getComputedStyle(document.body).color;
  const rgb = parseRgb(text);
  if (!rgb) return 'dark';
  const [r, g, b] = rgb.map((v) => v / 255) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? 'dark' : 'light';
}

const hosts = new Set<HTMLElement>();
export function registerThemed(el: HTMLElement): () => void {
  hosts.add(el);
  el.dataset.apTheme = theme.mode;
  return () => hosts.delete(el);
}

function refreshMode() {
  const mode = detectMode();
  if (mode === theme.mode) return;
  theme.mode = mode;
  for (const el of hosts) el.dataset.apTheme = mode;
}

export function installTheme(): void {
  theme.mode = detectMode();
  let h: number | undefined;
  const schedule = () => { cancelAnimationFrame(h!); h = requestAnimationFrame(refreshMode); };
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  new MutationObserver(schedule).observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
  document.addEventListener('visibilitychange', schedule);

  watchEffect(() => {
    const decl = activePreset.value?.theme?.[theme.mode] ?? {};
    const ui = settings().ui;
    const vars: string[] = [];
    for (const [k, v] of Object.entries(decl)) {
      if (k === 'primary' || k === 'accent') vars.push(paletteVars(k, v));
      else vars.push(`--ap-${k}: ${v};`);
    }
    if (ui.primary) vars.push(paletteVars('primary', ui.primary));
    if (ui.accent) vars.push(paletteVars('accent', ui.accent));
    paletteSheet.replaceSync(`:host { ${vars.join(' ')} }`);
  });
}

/** CSS colour for an actor: `primary` / `accent` map to the palette, anything else is used as is. */
export function actorColor(color: string | undefined, fallback: 'primary' | 'accent' = 'accent'): string {
  const c = color || fallback;
  if (c === 'primary' || c === 'accent') return `var(--ap-${c})`;
  return c;
}

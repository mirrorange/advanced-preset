/** Extension UI strings (`i18n/*.json`), following ST's locale; preset strings come from preset locales. */
import en from '../i18n/en.json';
import zhCN from '../i18n/zh-cn.json';
import type { APreset, LocaleTable } from '@advanced-preset/protocol';

type Table = Record<string, string>;
const tables: Record<string, Table> = { en, 'zh-cn': zhCN };

export function locale(): string {
  const l = (localStorage.getItem('language') || navigator.language || 'en').toLowerCase();
  if (l.startsWith('zh')) return l.includes('tw') || l.includes('hk') ? 'zh-tw' : 'zh-cn';
  return l.split('-')[0]!;
}

export function t(key: string, params: Record<string, string | number> = {}): string {
  const table = tables[locale()] ?? tables[locale().split('-')[0]!];
  const s = table?.[key] ?? en[key as keyof typeof en] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}

/** Preset-provided label for the current locale, falling back to the source text. */
export function presetLocale(preset: APreset): LocaleTable | undefined {
  return preset.locales?.[locale()] ?? preset.locales?.[locale().split('-')[0]!];
}

export function pt(preset: APreset, section: keyof LocaleTable, id: string, field: string, fallback: string): string {
  const table = presetLocale(preset);
  const entry = (table?.[section] as Record<string, Record<string, unknown>> | undefined)?.[id];
  const v = entry?.[field];
  return typeof v === 'string' && v ? v : fallback;
}

/** Preset display name / description for the current locale (`locales/<lang>.yaml#name|description`). */
export function presetName(preset: APreset): string {
  const v = presetLocale(preset)?.name;
  return typeof v === 'string' && v ? v : preset.name;
}

export function presetDescription(preset: APreset): string | undefined {
  const v = presetLocale(preset)?.description;
  return typeof v === 'string' && v ? v : preset.description;
}

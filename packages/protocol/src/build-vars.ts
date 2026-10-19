/**
 * Build variables: values a preset declares (`preset.yaml#vars`) and active modules update while
 * the prompt is assembled, read back with `{{ap::var::<id>}}`.
 *
 *   string  updates append (joined by the declaration's `separator`, default none)
 *   list    updates append items
 *   dict    updates set keys (`null` removes); a later module overrides an earlier one
 *
 * Nothing is sorted: values follow module order (preset modules, then user modules), and an
 * overridden key keeps its first position, so similar builds produce the same order.
 */
import type { BuildVarDecl, BuildVarUpdate, Module } from './types';

export type BuildVarValue = string | string[] | Map<string, string>;
export type BuildVars = Record<string, BuildVarValue>;

/** Selectors that format parts of a dict instead of looking up a key. */
export const VAR_SELECTORS = ['keys', 'values'] as const;

export function emptyVarValue(decl: BuildVarDecl): BuildVarValue {
  return decl.type === 'string' ? '' : decl.type === 'list' ? [] : new Map();
}

export function applyVarUpdate(value: BuildVarValue, update: BuildVarUpdate, decl: BuildVarDecl): BuildVarValue {
  if (update.type !== decl.type) return value;
  switch (update.type) {
    case 'string': {
      const cur = value as string;
      if (!update.text) return cur;
      return cur ? cur + (decl.separator ?? '') + update.text : update.text;
    }
    case 'list':
      return [...(value as string[]), ...update.items];
    case 'dict': {
      const map = new Map(value as Map<string, string>);
      for (const { key, value: v } of update.items) {
        if (v === null) map.delete(key);
        else map.set(key, v);
      }
      return map;
    }
  }
}

/** Values after applying the updates of `modules`, in order. Undeclared variables are ignored. */
export function computeBuildVars(decls: BuildVarDecl[], modules: Pick<Module, 'vars'>[]): BuildVars {
  const byId = new Map(decls.map((d) => [d.id, d]));
  const out: BuildVars = Object.fromEntries(decls.map((d) => [d.id, emptyVarValue(d)]));
  for (const m of modules) {
    for (const u of m.vars ?? []) {
      const decl = byId.get(u.var);
      if (decl) out[u.var] = applyVarUpdate(out[u.var]!, u, decl);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Readable YAML

const RESERVED = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;

/** Whether a single-line string reads back unchanged as a plain YAML scalar. */
function plainSafe(s: string): boolean {
  if (!s || s !== s.trim()) return false;
  if (/^[?:,[\]{}#&*!|>'"%@`]/.test(s) || /^-(?:\s|$)/.test(s)) return false;
  if (/:(?:\s|$)|\s#|\t/.test(s)) return false;
  return !RESERVED.test(s);
}

function scalar(s: string, indent: string): string {
  if (s.includes('\n')) {
    const body = s.replace(/\s+$/, '');
    if (/^\s/.test(body)) return JSON.stringify(s);
    return `|\n${body.split('\n').map((l) => (l ? indent + l : '')).join('\n')}`;
  }
  return plainSafe(s) ? s : JSON.stringify(s);
}

const keyText = (k: string) => (!k.includes('\n') && plainSafe(k) ? k : JSON.stringify(k));

export function yamlList(items: string[]): string {
  return items.map((v) => `- ${scalar(v, '  ')}`).join('\n');
}

export function yamlMap(map: Map<string, string>): string {
  return [...map].map(([k, v]) => `${keyText(k)}: ${scalar(v, '  ')}`).join('\n');
}

/**
 * Text of a variable for `{{ap::var::<id>[::selector]}}`. Whole lists and dicts become YAML;
 * `keys` / `values` list a dict's keys or values; any other selector reads one list item
 * (index, negative counts from the end) or dict value. Missing values read as ''.
 */
export function formatVar(value: BuildVarValue | undefined, selector?: string): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return selector === undefined ? value : '';
  if (Array.isArray(value)) {
    if (selector === undefined) return yamlList(value);
    if (!/^-?\d+$/.test(selector)) return '';
    const i = Number(selector);
    return value[i < 0 ? value.length + i : i] ?? '';
  }
  if (selector === undefined) return yamlMap(value);
  if (selector === 'keys') return yamlList([...value.keys()]);
  if (selector === 'values') return yamlList([...value.values()]);
  return value.get(selector) ?? '';
}

/** JSON-friendly copy (dicts as plain objects), for previews and the debug view. */
export function plainBuildVars(vars: BuildVars): Record<string, string | string[] | Record<string, string>> {
  return Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, v instanceof Map ? Object.fromEntries(v) : v]));
}

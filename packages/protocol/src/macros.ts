/**
 * `{{ap::…}}` macros. Arguments are separated by `::`, e.g. `{{ap::name::narrator}}`.
 * Expansion is recursive (a value may contain further macros) with a depth limit.
 */

export const MACRO_RE = /\{\{ap::([^{}]*?)\}\}/g;

/** Resolve macro arguments to text; return `undefined` to leave the macro untouched. */
export type MacroResolver = (args: string[]) => string | undefined;

export function expandMacros(text: string, resolve: MacroResolver, depth = 0): string {
  if (depth > 8 || !text.includes('{{ap::')) return text;
  let changed = false;
  const out = text.replace(MACRO_RE, (whole, body: string) => {
    const value = resolve(body.split('::').map((s) => s.trim()));
    if (value === undefined) return whole;
    changed = true;
    return value;
  });
  return changed ? expandMacros(out, resolve, depth + 1) : out;
}

/** Every macro (argument list) used in a text. */
export function listMacros(text: string): string[][] {
  return [...text.matchAll(MACRO_RE)].map((m) => m[1]!.split('::').map((s) => s.trim()));
}

/** Known macro heads and their argument arity, used by `ap check`. */
export const MACRO_HEADS: Record<string, { min: number; max: number }> = {
  name: { min: 1, max: 1 },
  prefix: { min: 1, max: 1 },
  param: { min: 1, max: 1 },
  structure: { min: 1, max: 2 },
  workflow: { min: 1, max: 1 },
  input: { min: 1, max: 1 },
  lang: { min: 0, max: 0 },
  memory: { min: 1, max: 1 },
  recap: { min: 0, max: 0 },
  recent_meta: { min: 0, max: 0 },
  var: { min: 1, max: 2 },
};

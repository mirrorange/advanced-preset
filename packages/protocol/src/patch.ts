/** Exact-string patches (D19): exact match first, then whitespace-normalised; 0 or many hits are skipped. */
import type { Patch } from './workflow';
import { escapeRe } from './tags';

export type PatchStatus = 'applied' | 'not-found' | 'ambiguous' | 'empty';
export interface PatchResult extends Patch {
  status: PatchStatus;
  /** Matched via whitespace normalisation. */
  fuzzy?: boolean;
}

function countOccurrences(hay: string, needle: string): number {
  let n = 0;
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + needle.length)) n++;
  return n;
}

export function applyPatch(text: string, patch: Patch): { text: string; result: PatchResult } {
  const old = patch.old_string ?? '';
  if (!old.trim()) return { text, result: { ...patch, status: 'empty' } };
  const exact = countOccurrences(text, old);
  if (exact === 1) return { text: text.replace(old, () => patch.new_string), result: { ...patch, status: 'applied' } };
  if (exact > 1) return { text, result: { ...patch, status: 'ambiguous' } };
  const parts = old.trim().split(/\s+/).map(escapeRe);
  const re = new RegExp(parts.join('\\s+'), 'g');
  const hits = [...text.matchAll(re)];
  if (hits.length === 1) {
    const h = hits[0]!;
    return { text: text.slice(0, h.index) + patch.new_string + text.slice(h.index! + h[0].length), result: { ...patch, status: 'applied', fuzzy: true } };
  }
  return { text, result: { ...patch, status: hits.length ? 'ambiguous' : 'not-found' } };
}

export function applyPatches(text: string, patches: Patch[]): { text: string; results: PatchResult[] } {
  const results: PatchResult[] = [];
  let cur = text;
  for (const p of patches) {
    const r = applyPatch(cur, p);
    cur = r.text;
    results.push(r.result);
  }
  return { text: cur, results };
}

/** Re-apply only the patches that were applied before (used when toggling draft ↔ patched). */
export function reapply(text: string, results: PatchResult[]): string {
  return applyPatches(text, results.filter((r) => r.status === 'applied')).text;
}

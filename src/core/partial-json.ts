/**
 * Tolerant JSON for streamed structured output / tool arguments: strips code fences and prose,
 * repairs truncated JSON with `jsonrepair`, and reports the key that is still being written.
 */
import { jsonrepair } from 'jsonrepair';

export interface PartialObject { value: Record<string, unknown> | null; openKey?: string }

function sliceObject(text: string): string {
  let s = text.trim();
  const fence = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(s);
  if (fence && !s.startsWith('{')) s = fence[1]!.trim();
  const start = s.indexOf('{');
  return start >= 0 ? s.slice(start) : '';
}

export function parsePartialObject(text: string, final: boolean): PartialObject {
  const s = sliceObject(text);
  if (!s) return { value: null };
  let value: unknown = null;
  try { value = JSON.parse(s); } catch {
    try { value = JSON.parse(jsonrepair(s)); } catch { value = null; }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { value: null };
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  return { value: obj, openKey: final ? undefined : keys[keys.length - 1] };
}

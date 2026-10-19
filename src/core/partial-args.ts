/**
 * Gemini streamed function-call arguments (`streamFunctionCallArguments`, Vertex AI). Instead of a
 * whole `args` object, each chunk carries `partialArgs`: values addressed by a JSONPath into the
 * arguments object (`$.story`, `$.questions[0].text`). A string value may arrive split over several
 * fragments of the same path; `willContinue` marks that more of it follows.
 */
export interface PartialArg {
  jsonPath?: string;
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
  nullValue?: unknown;
  willContinue?: boolean;
}

type Segment = string | number;
type Container = Record<string, unknown> | unknown[];

/** `$.a.b[0]['c d']` → `['a', 'b', 0, 'c d']`; `null` for anything else. */
export function parseJsonPath(path: string): Segment[] | null {
  if (!path.startsWith('$')) return null;
  const segments: Segment[] = [];
  const re = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
  re.lastIndex = 1;
  while (re.lastIndex < path.length) {
    const m = re.exec(path);
    if (!m) return null;
    if (m[1] !== undefined) segments.push(m[1]);
    else if (m[2] !== undefined) segments.push(Number(m[2]));
    else segments.push(m[4]!.replace(/\\(.)/g, '$1'));
  }
  return segments.length ? segments : null;
}

function valueOf(f: PartialArg): { value: unknown } | null {
  if (f.stringValue !== undefined) return { value: f.stringValue };
  if (f.numberValue !== undefined) return { value: f.numberValue };
  if (f.boolValue !== undefined) return { value: f.boolValue };
  if ('nullValue' in f) return { value: null };
  return null;
}

/** Arguments object of one streamed call, rebuilt fragment by fragment. */
export class PartialArgs {
  readonly value: Record<string, unknown> = {};
  /** Paths whose string value is still being streamed. */
  private open = new Set<string>();

  apply(fragments: readonly PartialArg[]): void {
    for (const f of fragments) {
      const path = f.jsonPath ?? '';
      const segments = parseJsonPath(path);
      if (!segments) { console.warn('[AP] ignoring a function-call fragment with an unsupported JSONPath', path); continue; }
      const v = valueOf(f);
      if (v) {
        const prev = this.open.has(path) ? get(this.value, segments) : undefined;
        set(this.value, segments, typeof prev === 'string' && typeof v.value === 'string' ? prev + v.value : v.value);
      }
      if (f.willContinue) this.open.add(path);
      else this.open.delete(path);
    }
  }
}

function get(root: Container, segments: Segment[]): unknown {
  let node: unknown = root;
  for (const s of segments) {
    if (!node || typeof node !== 'object') return undefined;
    node = (node as Record<Segment, unknown>)[s];
  }
  return node;
}

function set(root: Container, segments: Segment[], value: unknown): void {
  let node = root as Record<Segment, unknown>;
  segments.forEach((s, i) => {
    if (i === segments.length - 1) { node[s] = value; return; }
    const next = segments[i + 1];
    const child = node[s];
    const fits = typeof next === 'number' ? Array.isArray(child) : !!child && typeof child === 'object' && !Array.isArray(child);
    if (!fits) node[s] = typeof next === 'number' ? [] : {};
    node = node[s] as Record<Segment, unknown>;
  });
}

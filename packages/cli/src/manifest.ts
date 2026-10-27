/**
 * The manifest: `preset.yaml` plus optional fragments `manifest/**\/*.{yaml,yml}` (I-116 – I-118).
 *
 * Each fragment is a partial manifest with the same top-level keys as `preset.yaml`. Fragments
 * are merged into `preset.yaml` in path order: mappings merge key by key at any depth; a scalar or
 * array defined twice is an error (arrays belong to one file because their order is meaningful).
 * Metadata keys may only appear in `preset.yaml`. The merged object is what `compile()` reads, so
 * fragments need no other support; `locate()` maps a diagnostic's key path back to the file (and
 * line) that defined it.
 */
import { LineCounter, isMap, isScalar, isSeq, parseDocument, type Document } from 'yaml';
import type { Diagnostics, Where } from './diagnostics';

export const MANIFEST_FILE = 'preset.yaml';
/** Fragment paths: any depth under `manifest/`, no dot-files or dot-directories. */
export const FRAGMENT_RE = /^manifest\/(?:[^/.][^/]*\/)*[^/.][^/]*\.ya?ml$/;
/** Keys that identify the preset; they stay in `preset.yaml` so it alone tells what and which version it is. */
export const ROOT_ONLY_KEYS = ['formatVersion', 'id', 'name', 'version', 'author', 'description', 'minAdvancedPreset'];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const own = (o: Obj, k: string) => Object.prototype.hasOwnProperty.call(o, k);

interface SourceDoc {
  file: string;
  doc: Document.Parsed;
  lines: LineCounter;
}

export interface Manifest {
  raw: Obj;
  /** `preset.yaml` followed by the fragments that were merged, in merge order. */
  files: string[];
  /** Resolve `{ file: 'preset.yaml', path }` to the file (and line) that defined `path`. */
  locate(where: Where): Where;
}

/** `a.b[0].c` → `['a', 'b', 0, 'c']`. */
export function parsePath(path: string): (string | number)[] {
  const out: (string | number)[] = [];
  for (const m of path.matchAll(/([^.[\]]+)|\[(\d+)\]/g)) out.push(m[2] !== undefined ? Number(m[2]) : m[1]!);
  return out;
}

const keyOf = (segs: readonly (string | number)[]) => segs.join('\u0000');

/** Line of the deepest node along `segs` (the key of a mapping pair, the item of a sequence). */
function lineOf(src: SourceDoc, segs: readonly (string | number)[]): number | undefined {
  let node: unknown = src.doc.contents;
  let offset: number | undefined;
  for (const seg of segs) {
    if (isMap(node)) {
      const pair = node.items.find((p) => isScalar(p.key) && String(p.key.value) === String(seg));
      if (!pair) break;
      if (isScalar(pair.key) && pair.key.range) offset = pair.key.range[0];
      node = pair.value;
    } else if (isSeq(node) && typeof seg === 'number') {
      const item = node.items[seg] as { range?: [number, number, number] } | undefined;
      if (!item?.range) break;
      offset = item.range[0];
      node = item;
    } else break;
  }
  return offset === undefined ? undefined : src.lines.linePos(offset).line;
}

/** Parse and merge the manifest files of `tree`; `undefined` when `preset.yaml` is missing or any file is not valid YAML. */
export function loadManifest(tree: Map<string, string>, diag: Diagnostics): Manifest | undefined {
  const rootSrc = tree.get(MANIFEST_FILE);
  if (rootSrc === undefined) {
    diag.error(`${MANIFEST_FILE} not found`);
    return undefined;
  }
  const fragments = [...tree.keys()].filter((p) => FRAGMENT_RE.test(p)).sort();

  const docs: SourceDoc[] = [];
  let parsedOk = true;
  for (const file of [MANIFEST_FILE, ...fragments]) {
    const lines = new LineCounter();
    const doc = parseDocument(tree.get(file)!, { lineCounter: lines });
    if (doc.errors.length) {
      parsedOk = false;
      for (const e of doc.errors) diag.error(`invalid YAML: ${e.message}`, { file, ...(e.linePos ? { line: e.linePos[0].line } : {}) });
      continue;
    }
    docs.push({ file, doc, lines });
  }
  if (!parsedOk) return undefined;

  const origin = new Map<string, SourceDoc>();
  const owner = (segs: readonly (string | number)[]): SourceDoc | undefined => {
    for (let i = segs.length; i > 0; i--) {
      const src = origin.get(keyOf(segs.slice(0, i)));
      if (src) return src;
    }
    return undefined;
  };
  const at = (src: SourceDoc, segs: readonly (string | number)[]): Where => {
    const line = lineOf(src, segs);
    return { file: src.file, ...(line !== undefined ? { line } : {}), path: segs.join('.') };
  };

  const merge = (target: Obj, from: Obj, path: string[], src: SourceDoc) => {
    for (const [k, v] of Object.entries(from)) {
      const segs = [...path, k];
      if (!own(target, k)) {
        target[k] = v;
        origin.set(keyOf(segs), src);
      } else if (isObj(target[k]) && isObj(v)) merge(target[k] as Obj, v, segs, src);
      else {
        const prev = owner(segs);
        const prevLine = prev && lineOf(prev, segs);
        diag.error(`\`${segs.join('.')}\` is already defined in ${prev ? `${prev.file}${prevLine !== undefined ? `:${prevLine}` : ''}` : 'another file'}`, at(src, segs));
      }
    }
  };

  const raw: Obj = {};
  const files: string[] = [];
  for (const src of docs) {
    const value = src.doc.toJS() as unknown;
    if (src.file === MANIFEST_FILE) {
      if (!isObj(value)) {
        diag.error('invalid YAML: top level must be a mapping', { file: src.file });
        return undefined;
      }
    } else {
      if (value === null || value === undefined) continue; // empty fragment
      if (!isObj(value)) {
        diag.error('a manifest fragment must be a mapping of manifest keys', { file: src.file, line: 1 });
        continue;
      }
      for (const k of ROOT_ONLY_KEYS)
        if (own(value, k)) {
          diag.error(`\`${k}\` may only be set in ${MANIFEST_FILE}`, at(src, [k]));
          delete value[k];
        }
    }
    files.push(src.file);
    merge(raw, value as Obj, [], src);
  }

  const locate = (where: Where): Where => {
    if (where.file !== MANIFEST_FILE || where.path === undefined || where.line !== undefined) return where;
    const segs = parsePath(where.path);
    const src = owner(segs);
    if (!src) return where;
    const line = lineOf(src, segs);
    return { ...where, file: src.file, ...(line !== undefined ? { line } : {}) };
  };
  return { raw, files, locate };
}

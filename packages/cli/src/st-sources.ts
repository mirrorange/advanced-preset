/**
 * SillyTavern assets shipped by a preset, written as files in ST's own field names (an ST export
 * can be dropped in as is):
 *
 *   regex-scripts/<name>.yaml|yml|json   regex scripts: one script, or a list of scripts
 *   quick-replies/<id>.yaml|yml|json     Quick Reply sets: one set per file
 *
 * Regex scripts run in the order of their files (sorted by path), then of their lists. Each gets a
 * stable UUID derived from the preset id and its place. Quick Reply texts may use
 * `{{ap::name::<actor>}}` (expanded when AP writes the set); everything else is left to ST.
 */
import { createHash } from 'node:crypto';
import { parse as parseYaml } from 'yaml';
import {
  listMacros, regexFromString, QR_AUTO_EXECUTE, QR_TEXT_FIELDS, REGEX_PLACEMENTS, REGEX_SUBSTITUTE,
  type QuickReplyContextItem, type QuickReplyDecl, type QuickReplySetDecl, type RegexScript,
} from '@advanced-preset/protocol';
import type { Diagnostics, Where } from './diagnostics';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

export const REGEX_SCRIPT_FILE_RE = /^regex-scripts\/([^/]+)\.(?:ya?ml|json)$/;
export const QUICK_REPLY_FILE_RE = /^quick-replies\/([^/]+)\.(?:ya?ml|json)$/;
const KEBAB = /^[a-z0-9][a-z0-9-]*$/;

/** Source files of a directory, sorted by path. */
function files(tree: Map<string, string>, re: RegExp, diag: Diagnostics): { file: string; id: string; data: unknown }[] {
  const out: { file: string; id: string; data: unknown }[] = [];
  for (const file of [...tree.keys()].sort()) {
    const m = re.exec(file);
    if (!m) continue;
    try {
      out.push({ file, id: m[1]!, data: parseYaml(tree.get(file)!) });
    } catch (e) {
      diag.error(`invalid ${file.endsWith('.json') ? 'JSON' : 'YAML'}: ${(e as Error).message}`, { file });
    }
  }
  return out;
}

/** A UUID (v4 layout) that only depends on `seed`. */
export function stableUuid(seed: string): string {
  const h = createHash('sha256').update(seed).digest('hex');
  const variant = ((parseInt(h[16]!, 16) & 0x3) | 0x8).toString(16);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${variant}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** Typed field readers that report and fall back to the default. */
function reader(o: Obj, diag: Diagnostics, where: (key: string) => Where) {
  return {
    bool(key: string, fallback: boolean): boolean {
      const v = o[key];
      if (v === undefined || v === null) return fallback;
      if (typeof v !== 'boolean') { diag.error(`\`${key}\` must be true or false`, where(key)); return fallback; }
      return v;
    },
    text(key: string, fallback = ''): string {
      const v = o[key];
      if (v === undefined || v === null) return fallback;
      if (typeof v === 'number') return String(v);
      if (typeof v !== 'string') { diag.error(`\`${key}\` must be a string`, where(key)); return fallback; }
      return v;
    },
  };
}

function warnUnknown(o: Obj, known: readonly string[], diag: Diagnostics, where: (key: string) => Where, what: string) {
  for (const k of Object.keys(o)) if (!known.includes(k)) diag.warn(`unknown ${what} field \`${k}\` (ignored)`, where(k));
}

// ── regex scripts ─────────────────────────────────────────────────────────────

/** ST fields of a script (`id` of an ST export is accepted and replaced). */
const REGEX_FIELDS = ['id', 'scriptName', 'findRegex', 'replaceString', 'trimStrings', 'placement', 'disabled', 'markdownOnly', 'promptOnly', 'runOnEdit', 'substituteRegex', 'minDepth', 'maxDepth'] as const;
const PLACEMENT_NUMBERS = new Map<number, string>(Object.entries(REGEX_PLACEMENTS).map(([k, v]) => [v, k]));

function regexScript(src: unknown, seed: string, fallbackName: string, file: string, prefix: string, diag: Diagnostics): RegexScript | undefined {
  const where = (key?: string): Where => ({ file, ...(prefix || key ? { path: [prefix, key].filter(Boolean).join('.') } : {}) });
  if (!isObj(src)) { diag.error('a regex script must be a mapping', where()); return undefined; }
  warnUnknown(src, REGEX_FIELDS, diag, where, 'regex script');
  const r = reader(src, diag, where);

  const findRegex = r.text('findRegex');
  if (!findRegex) { diag.error('`findRegex` is required', where('findRegex')); return undefined; }

  let substituteRegex: number = REGEX_SUBSTITUTE.none;
  const sub = src.substituteRegex;
  if (typeof sub === 'string' && sub in REGEX_SUBSTITUTE) substituteRegex = REGEX_SUBSTITUTE[sub as keyof typeof REGEX_SUBSTITUTE];
  else if (typeof sub === 'number' && Object.values(REGEX_SUBSTITUTE).includes(sub as 0)) substituteRegex = sub;
  else if (sub !== undefined && sub !== null) diag.error(`\`substituteRegex\` must be ${Object.keys(REGEX_SUBSTITUTE).join(' | ')} (or 0 / 1 / 2)`, where('substituteRegex'));
  // With macro substitution the pattern is only known in ST.
  if (substituteRegex === REGEX_SUBSTITUTE.none && !regexFromString(findRegex)) diag.error(`\`findRegex\` is not a valid regular expression: ${findRegex}`, where('findRegex'));

  const trim = src.trimStrings;
  let trimStrings: string[] = [];
  if (typeof trim === 'string') trimStrings = trim.split('\n').filter(Boolean);
  else if (Array.isArray(trim) && trim.every((x) => typeof x === 'string')) trimStrings = trim.filter(Boolean);
  else if (trim !== undefined && trim !== null) diag.error('`trimStrings` must be a list of strings', where('trimStrings'));

  const placement: number[] = [];
  const pl = src.placement;
  for (const p of Array.isArray(pl) ? pl : pl === undefined || pl === null ? [] : [pl]) {
    const n = typeof p === 'number' ? (PLACEMENT_NUMBERS.has(p) ? p : undefined) : REGEX_PLACEMENTS[p as keyof typeof REGEX_PLACEMENTS];
    if (n === undefined) diag.error(`unknown placement \`${String(p)}\` (expected ${Object.keys(REGEX_PLACEMENTS).join(' | ')}, or ST's numbers)`, where('placement'));
    else if (!placement.includes(n)) placement.push(n);
  }
  if (!placement.length) diag.warn('no `placement`: the script never runs', where('placement'));

  const depth = (key: 'minDepth' | 'maxDepth'): number | null => {
    const v = src[key];
    if (v === undefined || v === null || v === '') return null;
    if (typeof v !== 'number' || !Number.isInteger(v) || v < -1) { diag.error(`\`${key}\` must be an integer ≥ -1 (or empty)`, where(key)); return null; }
    return v;
  };

  const script: RegexScript = {
    id: stableUuid(seed),
    scriptName: r.text('scriptName', fallbackName) || fallbackName,
    findRegex,
    replaceString: r.text('replaceString'),
    trimStrings,
    placement,
    disabled: r.bool('disabled', false),
    markdownOnly: r.bool('markdownOnly', false),
    promptOnly: r.bool('promptOnly', false),
    runOnEdit: r.bool('runOnEdit', true),
    substituteRegex,
    minDepth: depth('minDepth'),
    maxDepth: depth('maxDepth'),
  };
  if ([script.findRegex, script.replaceString, ...script.trimStrings].some((s) => s.includes('{{ap::')))
    diag.warn('`{{ap::…}}` macros are not expanded in regex scripts (ST runs them; use ST macros with `substituteRegex`)', where());
  return script;
}

export function compileRegexScripts(tree: Map<string, string>, presetId: string, diag: Diagnostics): RegexScript[] {
  const out: RegexScript[] = [];
  for (const { file, id, data } of files(tree, REGEX_SCRIPT_FILE_RE, diag)) {
    if (Array.isArray(data)) data.forEach((s, i) => { const x = regexScript(s, `${presetId}\0${file}\0${i}`, `${id} ${i + 1}`, file, `[${i}]`, diag); if (x) out.push(x); });
    else { const x = regexScript(data, `${presetId}\0${file}`, id, file, '', diag); if (x) out.push(x); }
  }
  const names = new Set<string>();
  for (const s of out) {
    if (names.has(s.scriptName)) diag.warn(`several regex scripts are named \`${s.scriptName}\``, { file: 'regex-scripts' });
    names.add(s.scriptName);
  }
  return out;
}

// ── quick replies ─────────────────────────────────────────────────────────────

/** ST fields of a set (`version` / `idIndex` of an ST export are accepted and ignored), plus AP's `global` / `visible`. */
const SET_FIELDS = ['name', 'global', 'visible', 'disableSend', 'placeBeforeInput', 'injectInput', 'color', 'onlyBorderColor', 'qrList', 'version', 'idIndex'] as const;
const QR_FIELDS = ['id', 'label', 'icon', 'showLabel', 'title', 'message', 'contextList', 'preventAutoExecute', 'isHidden', 'automationId', ...QR_AUTO_EXECUTE] as const;

/** Default ST name of a preset's set. */
export const defaultQuickReplySetName = (presetName: string) => `AP · ${presetName}`;

/** `{{ap::name::<actor>}}` is the only AP macro of a quick reply. */
export function checkQuickReplyText(text: string, actors: string[], diag: Diagnostics, where: Where): void {
  for (const [head, ...rest] of listMacros(text)) {
    const shown = `{{ap::${[head, ...rest].join('::')}}}`;
    if (head !== 'name' || rest.length !== 1) diag.error(`${shown}: quick replies only expand {{ap::name::<actor>}} (other macros: ST's own, e.g. {{user}} / {{input}})`, where);
    else if (!actors.includes(rest[0]!)) diag.error(`${shown}: unknown actor \`${rest[0]}\``, where);
  }
}

function quickReply(src: unknown, index: number, file: string, actors: string[], diag: Diagnostics): QuickReplyDecl | undefined {
  const prefix = `qrList[${index}]`;
  const where = (key?: string): Where => ({ file, path: key ? `${prefix}.${key}` : prefix });
  if (!isObj(src)) { diag.error('a quick reply must be a mapping', where()); return undefined; }
  warnUnknown(src, QR_FIELDS, diag, where, 'quick reply');
  const r = reader(src, diag, where);
  const icon = r.text('icon').trim();
  if (/\s/.test(icon)) diag.error('`icon` is one Font Awesome class, e.g. `fa-at` (ST adds `fa-solid` itself)', where('icon'));
  else if (icon && !icon.startsWith('fa-')) diag.warn('`icon` should be a Font Awesome class such as `fa-at`', where('icon'));

  const contextList: QuickReplyContextItem[] = [];
  const ctx = src.contextList;
  if (ctx !== undefined && ctx !== null && !Array.isArray(ctx)) diag.error('`contextList` must be a list of sets', where('contextList'));
  for (const [i, c] of (Array.isArray(ctx) ? ctx : []).entries()) {
    if (typeof c === 'string' && c) contextList.push({ set: c, isChained: false });
    else if (isObj(c) && typeof c.set === 'string' && c.set) contextList.push({ set: c.set, isChained: c.isChained === true });
    else diag.error('a context menu item is a set (`<set id or ST name>` or `{ set, isChained }`)', where(`contextList[${i}]`));
  }

  const id = src.id === undefined || src.id === null ? String(index + 1) : String(src.id);
  const qr: QuickReplyDecl = {
    id,
    label: r.text('label'),
    icon,
    showLabel: r.bool('showLabel', false),
    title: r.text('title'),
    message: r.text('message'),
    contextList,
    preventAutoExecute: r.bool('preventAutoExecute', true),
    isHidden: r.bool('isHidden', false),
    automationId: r.text('automationId'),
    ...(Object.fromEntries(QR_AUTO_EXECUTE.map((k) => [k, r.bool(k, false)])) as Record<(typeof QR_AUTO_EXECUTE)[number], boolean>),
  };
  if (!qr.label && !qr.icon) diag.warn('a quick reply without `label` or `icon` shows an empty button', where());
  for (const k of QR_TEXT_FIELDS) checkQuickReplyText(qr[k], actors, diag, where(k));
  return qr;
}

export function compileQuickReplySets(tree: Map<string, string>, presetName: string, actors: string[], diag: Diagnostics): QuickReplySetDecl[] {
  const sets: QuickReplySetDecl[] = [];
  const fileOf = new Map<string, string>();
  for (const { file, id, data } of files(tree, QUICK_REPLY_FILE_RE, diag)) {
    const where = (key?: string): Where => ({ file, ...(key ? { path: key } : {}) });
    if (!KEBAB.test(id)) { diag.error('a Quick Reply set file name must be lower-case kebab-case (it is the set id)', where()); continue; }
    if (!isObj(data)) { diag.error('a Quick Reply set must be a mapping', where()); continue; }
    warnUnknown(data, SET_FIELDS, diag, where, 'Quick Reply set');
    const r = reader(data, diag, where);
    if (!Array.isArray(data.qrList)) diag.error('`qrList` (the quick replies) must be a list', where('qrList'));
    const qrList = (Array.isArray(data.qrList) ? data.qrList : []).map((q, i) => quickReply(q, i, file, actors, diag)).filter((q): q is QuickReplyDecl => Boolean(q));
    const ids = new Set<string>();
    for (const [i, q] of qrList.entries()) {
      if (ids.has(q.id)) diag.error(`duplicate quick reply id \`${q.id}\``, where(`qrList[${i}].id`));
      ids.add(q.id);
    }
    const name = r.text('name', defaultQuickReplySetName(presetName)).trim() || defaultQuickReplySetName(presetName);
    fileOf.set(id, file);
    sets.push({
      id,
      name,
      global: r.bool('global', true),
      visible: r.bool('visible', true),
      disableSend: r.bool('disableSend', false),
      placeBeforeInput: r.bool('placeBeforeInput', false),
      injectInput: r.bool('injectInput', false),
      color: r.text('color', 'transparent') || 'transparent',
      onlyBorderColor: r.bool('onlyBorderColor', false),
      qrList,
    });
  }
  const byName = new Map<string, string>();
  for (const s of sets) {
    const other = byName.get(s.name);
    if (other) diag.error(`sets \`${other}\` and \`${s.id}\` are both named \`${s.name}\` in ST (give one a \`name\`)`, { file: fileOf.get(s.id), path: 'name' });
    byName.set(s.name, s.id);
  }
  // Context menus: a set of this preset by id, anything else is an ST set the user must have.
  for (const s of sets) for (const [i, q] of s.qrList.entries()) for (const c of q.contextList) {
    const own = sets.find((x) => x.id === c.set);
    if (own) c.set = own.name;
    else if (!byName.has(c.set)) diag.warn(`context menu set \`${c.set}\` is not one of the preset's sets (it must exist in the user's ST)`, { file: fileOf.get(s.id), path: `qrList[${i}].contextList` });
  }
  return sets;
}

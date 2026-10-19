/**
 * User modules: prompt snippets a user attaches to a preset, inserted at the preset's declared
 * insertion points. They live in user settings (not in the artifact), survive preset updates and
 * are merged into the preset in memory right before assembly.
 */
import { compileText, type DirectiveError } from './directives';
import { parseExpr, type Expr, type Literal } from './expr';
import { satisfies } from './semver';
import type { APreset, BuildVarDecl, BuildVarUpdate, Entry, InsertionPoint, Migration, Module, Role } from './types';

export type VarOp = 'on' | 'off' | '==' | '!=' | 'in' | 'notIn' | '>' | '>=' | '<' | '<=';

/** Compare a condition variable (`transport`, `params.x`, `modules.y`, …). */
export interface VarRule {
  kind: 'var';
  path: string;
  op: VarOp;
  /** Literal for comparisons, list for `in` / `notIn`, absent for `on` / `off`. */
  value?: Literal | Literal[];
}

/** Look for words in the user's input or recent messages. */
export interface KeywordRule {
  kind: 'keyword';
  target: 'input' | 'recent';
  /** Messages scanned for `recent` (newest first). */
  depth?: number;
  words: string[];
  /** Treat words as regular expressions (case-insensitive). */
  regex?: boolean;
  /** `any`: some word appears; `none`: no word appears. */
  op: 'any' | 'none';
}

/** Raw condition expression, for anything the visual rules cannot say. */
export interface ExprRule {
  kind: 'expr';
  source: string;
}

export type TriggerRule = VarRule | KeywordRule | ExprRule;

export interface Trigger {
  match: 'all' | 'any';
  /** No (complete) rules → always active. */
  rules: TriggerRule[];
}

export interface UserEntry {
  id: string;
  /** Insertion point id. */
  point: string;
  /** Role of the first message; absent → merged into the region like preset text. */
  role?: Role;
  /** Prompt text; supports `ap::` macros and `@if` / `@as` / `@style` directives. */
  text: string;
}

export interface UserModule {
  id: string;
  name: string;
  enabled: boolean;
  entries: UserEntry[];
  /**
   * Updates of the preset's build variables, applied after the preset's own modules. In dicts an
   * empty value removes the key (so a user can drop a built-in item).
   */
  vars: BuildVarUpdate[];
  trigger: Trigger;
}

/** Texts scanned by keyword rules. `recent` is newest first and starts with the input when there is one. */
export interface KeywordTexts {
  input: string;
  recent: string[];
}

export const USER_MODULE_PREFIX = 'user-';
export const DEFAULT_KEYWORD_DEPTH = 3;
export const USER_MODULES_FORMAT = 'advanced-preset.user-modules';

export const userModuleId = (id: string) => `${USER_MODULE_PREFIX}${id}`;

export function emptyTrigger(): Trigger {
  return { match: 'all', rules: [] };
}

// ---------------------------------------------------------------------------------------------
// Triggers

const VALUELESS: VarOp[] = ['on', 'off'];

/** Rules that are still being edited (no words, no value, empty expression) are ignored. */
export function ruleComplete(rule: TriggerRule): boolean {
  switch (rule.kind) {
    case 'keyword': return rule.words.some((w) => w.trim());
    case 'expr': return Boolean(rule.source.trim());
    case 'var':
      if (!rule.path) return false;
      if (VALUELESS.includes(rule.op)) return true;
      if (rule.op === 'in' || rule.op === 'notIn') return Array.isArray(rule.value) && rule.value.length > 0;
      return rule.value !== undefined && rule.value !== '';
  }
}

function wordMatcher(rule: KeywordRule): ((text: string) => boolean) | null {
  const words = rule.words.map((w) => w.trim()).filter(Boolean);
  if (rule.regex) {
    const res = words.flatMap((w) => {
      try { return [new RegExp(w, 'iu')]; } catch { return []; }
    });
    return res.length ? (text) => res.some((re) => re.test(text)) : null;
  }
  const lower = words.map((w) => w.toLocaleLowerCase());
  return lower.length ? (text) => { const t = text.toLocaleLowerCase(); return lower.some((w) => t.includes(w)); } : null;
}

export function keywordHit(rule: KeywordRule, texts: KeywordTexts): boolean {
  const match = wordMatcher(rule);
  if (!match) return rule.op === 'none';
  const scanned = rule.target === 'input' ? [texts.input] : texts.recent.slice(0, Math.max(1, rule.depth ?? DEFAULT_KEYWORD_DEPTH));
  const found = scanned.some((t) => t && match(t));
  return rule.op === 'any' ? found : !found;
}

const lit = (v: Literal): Expr => ({ t: 'lit', v });

function varExpr(rule: VarRule): Expr {
  const v: Expr = { t: 'var', path: rule.path };
  switch (rule.op) {
    case 'on': return v;
    case 'off': return { t: 'not', e: v };
    case 'in':
    case 'notIn': {
      const items = (Array.isArray(rule.value) ? rule.value : [rule.value ?? null]).map(lit);
      const e: Expr = { t: 'bin', op: 'in', l: v, r: { t: 'arr', items } };
      return rule.op === 'in' ? e : { t: 'not', e };
    }
    default:
      return { t: 'bin', op: rule.op, l: v, r: lit(Array.isArray(rule.value) ? (rule.value[0] ?? null) : (rule.value ?? null)) };
  }
}

/**
 * Compile a trigger to a module `when`. Keyword rules are decided now (they depend on chat text,
 * not on condition variables) and become literals. Invalid expressions never fire.
 */
export function compileTrigger(trigger: Trigger, texts: KeywordTexts = { input: '', recent: [] }): Expr | undefined {
  const parts = trigger.rules.filter(ruleComplete).map((rule): Expr => {
    if (rule.kind === 'keyword') return lit(keywordHit(rule, texts));
    if (rule.kind === 'var') return varExpr(rule);
    try { return parseExpr(rule.source); } catch { return lit(false); }
  });
  if (!parts.length) return undefined;
  const op = trigger.match === 'any' ? '||' : '&&';
  return parts.reduce((l, r) => ({ t: 'bin', op, l, r }));
}

/** Problems in a rule, for the editor. `null` when fine. */
export function ruleError(rule: TriggerRule): string | null {
  if (rule.kind === 'expr') {
    if (!rule.source.trim()) return null;
    try { parseExpr(rule.source); return null; } catch (e) { return (e as Error).message; }
  }
  if (rule.kind === 'keyword' && rule.regex) {
    for (const w of rule.words) {
      try { new RegExp(w, 'iu'); } catch (e) { return (e as Error).message; }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Merge into a preset

export interface SkippedEntry {
  module: string;
  entry: string;
  point: string;
}

export interface UserEntryCompiled {
  entry: Entry;
  errors: DirectiveError[];
}

export function findPoint(preset: APreset, id: string): InsertionPoint | undefined {
  return (preset.insertionPoints ?? []).find((p) => p.id === id);
}

/** Entries whose insertion point the preset no longer declares. */
export function missingPoints(preset: APreset, module: UserModule): UserEntry[] {
  return module.entries.filter((e) => !findPoint(preset, e.point));
}

export function findVar(preset: APreset, id: string): BuildVarDecl | undefined {
  return (preset.vars ?? []).find((v) => v.id === id);
}

/** Variable updates the preset no longer supports (variable removed or its type changed). */
export function missingVars(preset: APreset, module: UserModule): BuildVarUpdate[] {
  return (module.vars ?? []).filter((u) => findVar(preset, u.var)?.type !== u.type);
}

/** Ids of everything a module refers to that the preset no longer has (insertion points and variables). */
export function lostRefs(preset: APreset, module: UserModule): string[] {
  return [...new Set([...missingPoints(preset, module).map((e) => e.point), ...missingVars(preset, module).map((u) => u.var)])];
}

/** A user update as applied: blank items are dropped and blank dict values remove the key. */
export function effectiveUpdate(u: BuildVarUpdate): BuildVarUpdate | null {
  switch (u.type) {
    case 'string': return u.text.trim() ? u : null;
    case 'list': {
      const items = u.items.filter((x) => x.trim());
      return items.length ? { ...u, items } : null;
    }
    case 'dict': {
      const items = u.items.filter((x) => x.key.trim()).map((x) => ({ key: x.key.trim(), value: x.value?.trim() ? x.value : null }));
      return items.length ? { ...u, items } : null;
    }
  }
}

function insertEntry(entries: Entry[], entry: Entry): void {
  let at = -1;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    if (e.region !== entry.region) continue;
    if (e.order <= entry.order) at = i + 1;
    else if (at < 0) at = i;
  }
  if (at < 0) entries.push(entry);
  else entries.splice(at, 0, entry);
}

/**
 * The preset with enabled user modules added as `always` modules. Each user entry follows the
 * preset entries of the same region and order; user modules keep their list order.
 */
export function withUserModules(preset: APreset, modules: UserModule[], texts?: KeywordTexts): { preset: APreset; skipped: SkippedEntry[] } {
  const enabled = modules.filter((m) => m.enabled && (m.entries.length || m.vars?.length));
  if (!enabled.length) return { preset, skipped: [] };
  const skipped: SkippedEntry[] = [];
  const extraModules: Module[] = [];
  const entries = [...preset.entries];
  const regions = new Map(preset.regions.map((r) => [r.id, r]));
  for (const m of enabled) {
    const id = userModuleId(m.id);
    extraModules.push({
      id,
      name: m.name,
      toggle: 'always',
      default: true,
      when: compileTrigger(m.trigger, texts),
      structures: [],
      vars: (m.vars ?? []).filter((u) => findVar(preset, u.var)?.type === u.type).map(effectiveUpdate).filter((u): u is BuildVarUpdate => Boolean(u)),
    });
    for (const e of m.entries) {
      const point = findPoint(preset, e.point);
      const region = point && regions.get(point.region);
      if (!point || !region || region.native) { skipped.push({ module: m.id, entry: e.id, point: e.point }); continue; }
      if (!e.text.trim()) continue;
      insertEntry(entries, { id: `${id}/${e.id}`, module: id, region: point.region, order: point.order, content: compileText(e.text, e.role).content });
    }
  }
  return { preset: { ...preset, modules: [...preset.modules, ...extraModules], entries }, skipped };
}

// ---------------------------------------------------------------------------------------------
// Preset updates

function renamePath(path: string, maps: { modules?: Record<string, string>; params?: Record<string, string> }): string {
  const [head, key, ...rest] = path.split('.');
  const map = head === 'modules' ? maps.modules : head === 'params' ? maps.params : undefined;
  const to = key !== undefined ? map?.[key] : undefined;
  return to ? [head, to, ...rest].join('.') : path;
}

function renameInSource(source: string, maps: { modules?: Record<string, string>; params?: Record<string, string> }): string {
  return source.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (all, head: string, key: string) => {
    const to = (head === 'modules' ? maps.modules : maps.params)?.[key];
    return to ? `${head}.${to}` : all;
  });
}

/** Apply preset migrations (insertion point / module / param renames) to user modules. */
export function migrateUserModules(modules: UserModule[], migrations: Migration[], fromVersion: string): UserModule[] {
  const applicable = migrations.filter((m) => satisfies(fromVersion, m.from));
  if (!applicable.length) return modules;
  return modules.map((m) => {
    let entries = m.entries;
    let vars = m.vars ?? [];
    let rules = m.trigger.rules;
    for (const { rename } of applicable) {
      const points = rename.insertionPoints;
      if (points) entries = entries.map((e) => (points[e.point] ? { ...e, point: points[e.point]! } : e));
      const renamedVars = rename.vars;
      if (renamedVars) vars = vars.map((u) => (renamedVars[u.var] ? { ...u, var: renamedVars[u.var]! } : u));
      if (rename.modules || rename.params) {
        rules = rules.map((r) => {
          if (r.kind === 'var') return { ...r, path: renamePath(r.path, rename) };
          if (r.kind === 'expr') return { ...r, source: renameInSource(r.source, rename) };
          return r;
        });
      }
    }
    return { ...m, entries, vars, trigger: { ...m.trigger, rules } };
  });
}

// ---------------------------------------------------------------------------------------------
// Files

export interface UserModuleFile {
  format: typeof USER_MODULES_FORMAT;
  version: 1;
  preset?: { id: string; version: string };
  modules: UserModule[];
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);
const isLiteral = (v: unknown): v is Literal => v === null || ['string', 'number', 'boolean'].includes(typeof v);
const ROLES: Role[] = ['system', 'user', 'assistant'];
const VAR_OPS: VarOp[] = ['on', 'off', '==', '!=', 'in', 'notIn', '>', '>=', '<', '<='];

function normalizeRule(raw: unknown): TriggerRule | null {
  if (!isObj(raw)) return null;
  if (raw.kind === 'expr') return { kind: 'expr', source: str(raw.source) };
  if (raw.kind === 'keyword') {
    const rule: KeywordRule = {
      kind: 'keyword',
      target: raw.target === 'recent' ? 'recent' : 'input',
      words: Array.isArray(raw.words) ? raw.words.filter((w): w is string => typeof w === 'string') : [],
      op: raw.op === 'none' ? 'none' : 'any',
    };
    if (raw.regex === true) rule.regex = true;
    if (rule.target === 'recent' && typeof raw.depth === 'number' && raw.depth >= 1) rule.depth = Math.floor(raw.depth);
    return rule;
  }
  if (raw.kind === 'var' && typeof raw.path === 'string' && VAR_OPS.includes(raw.op as VarOp)) {
    const rule: VarRule = { kind: 'var', path: raw.path, op: raw.op as VarOp };
    if (Array.isArray(raw.value)) rule.value = raw.value.filter(isLiteral);
    else if (isLiteral(raw.value)) rule.value = raw.value;
    return rule;
  }
  return null;
}

function normalizeVarUpdate(raw: unknown): BuildVarUpdate[] {
  if (!isObj(raw) || typeof raw.var !== 'string') return [];
  const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
  if (raw.type === 'string') return [{ var: raw.var, type: 'string', text: str(raw.text) }];
  if (raw.type === 'list') return [{ var: raw.var, type: 'list', items: strings(raw.items) }];
  if (raw.type === 'dict' && Array.isArray(raw.items)) {
    const items = raw.items.filter(isObj).map((x) => ({ key: str(x.key), value: typeof x.value === 'string' ? x.value : null }));
    return [{ var: raw.var, type: 'dict', items }];
  }
  return [];
}

/** Coerce untrusted data (imported file, old settings) into a valid user module, or `null`. */
export function normalizeUserModule(raw: unknown): UserModule | null {
  if (!isObj(raw) || !Array.isArray(raw.entries)) return null;
  const trigger = isObj(raw.trigger) ? raw.trigger : {};
  const entries = raw.entries.flatMap((e, i): UserEntry[] => {
    if (!isObj(e)) return [];
    const entry: UserEntry = { id: str(e.id) || `e${i + 1}`, point: str(e.point), text: str(e.text) };
    if (ROLES.includes(e.role as Role)) entry.role = e.role as Role;
    return [entry];
  });
  return {
    id: str(raw.id),
    name: str(raw.name),
    enabled: raw.enabled !== false,
    entries,
    vars: Array.isArray(raw.vars) ? raw.vars.flatMap(normalizeVarUpdate) : [],
    trigger: {
      match: trigger.match === 'any' ? 'any' : 'all',
      rules: Array.isArray(trigger.rules) ? trigger.rules.map(normalizeRule).filter((r): r is TriggerRule => Boolean(r)) : [],
    },
  };
}

export function userModuleFile(modules: UserModule[], preset?: { id: string; version: string }): UserModuleFile {
  return { format: USER_MODULES_FORMAT, version: 1, ...(preset ? { preset: { id: preset.id, version: preset.version } } : {}), modules };
}

/** Parse an exported file (a single bare module is accepted too). Throws on anything else. */
export function parseUserModuleFile(raw: unknown): { preset?: { id: string; version: string }; modules: UserModule[] } {
  if (isObj(raw) && raw.format === USER_MODULES_FORMAT) {
    if (raw.version !== 1) throw new Error(`unsupported user module file version ${String(raw.version)}`);
    const modules = (Array.isArray(raw.modules) ? raw.modules : []).map(normalizeUserModule).filter((m): m is UserModule => Boolean(m));
    const preset = isObj(raw.preset) && typeof raw.preset.id === 'string' ? { id: raw.preset.id, version: str(raw.preset.version) } : undefined;
    return { preset, modules };
  }
  const single = normalizeUserModule(raw);
  if (single) return { modules: [single] };
  throw new Error('not a user module file');
}

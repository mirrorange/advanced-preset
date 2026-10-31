/**
 * What a trigger rule can look at. Variable rules map to condition variables (§6.7); the catalogue
 * gives each one a label, a value kind and (for enums) its options, so the editor can offer the
 * right control instead of free text.
 */
import {
  DEFAULT_KEYWORD_DEPTH, TRANSPORTS, ruleComplete,
  type APreset, type Literal, type Trigger, type TriggerRule, type VarOp, type VarRule,
} from '@advanced-preset/protocol';
import { presetLocale, pt, t } from '@/i18n';

/** `list`: a list param, tested for having items (`on`) or being empty (`off`). */
export type ValueKind = 'bool' | 'list' | 'enum' | 'number' | 'text';
export interface Option { value: string | number; label: string }
export interface VarInfo { kind: ValueKind; label: string; options?: Option[]; suggestions?: string[] }

/** Subject ids: fixed variable paths, plus `module` / `param` / `flag` (pick an id) and `keyword` / `expr`. */
export type SubjectId = string;
export interface Subject { id: SubjectId; label: string }
export interface SubjectGroup { label: string; subjects: Subject[] }

const GEN_TYPES = ['normal', 'regenerate', 'swipe', 'continue', 'quiet', 'impersonate'];

function fixed(preset: APreset): Record<string, VarInfo> {
  const opts = (values: (string | number)[], label: (v: string) => string): Option[] => values.map((v) => ({ value: v, label: label(String(v)) }));
  return {
    transport: { kind: 'enum', label: t('config.transport'), options: opts([...TRANSPORTS], (v) => t(`transport.${v}`)) },
    style: { kind: 'enum', label: t('um.var.style'), options: opts(['dialogue', 'imperative'], (v) => t(`um.style.${v}`)) },
    workflow: { kind: 'enum', label: t('config.workflow'), options: preset.workflows.map((w) => ({ value: w.id, label: pt(preset, 'workflows', w.id, 'name', w.name) })) },
    'gen.origin': { kind: 'enum', label: t('um.var.origin'), options: opts(['story', 'task'], (v) => t(`um.origin.${v}`)) },
    'gen.type': { kind: 'enum', label: t('um.var.genType'), options: opts(GEN_TYPES, (v) => t(`um.genType.${v}`)) },
    'meta.present': { kind: 'bool', label: t('um.var.metaPresent') },
    'meta.pure': { kind: 'bool', label: t('um.var.metaPure') },
    'features.tokenSaving': { kind: 'bool', label: t('writing.tokenSaving') },
    'chat.group': { kind: 'bool', label: t('um.var.group') },
    'memory.hasChat': { kind: 'bool', label: t('um.var.hasChat') },
    'memory.hasGlobal': { kind: 'bool', label: t('um.var.hasGlobal') },
    'recap.present': { kind: 'bool', label: t('um.var.recap') },
    // Only presets that shape the input have the signal worth offering.
    ...(preset.inputShaping ? { 'input.shaped': { kind: 'bool' as const, label: t('um.var.inputShaped') } } : {}),
  };
}

const userToggles = (preset: APreset) => preset.modules.filter((m) => m.toggle === 'user');

export function subjectGroups(preset: APreset): SubjectGroup[] {
  const f = fixed(preset);
  const pick = (ids: string[]) => ids.filter((id) => f[id]).map((id) => ({ id, label: f[id]!.label }));
  const presetSubjects: Subject[] = [];
  if (userToggles(preset).length) presetSubjects.push({ id: 'module', label: t('um.var.module') });
  if (preset.params.length) presetSubjects.push({ id: 'param', label: t('um.var.param') });
  return [
    { label: t('um.group.chat'), subjects: [{ id: 'keyword', label: t('um.keyword') }, ...pick(['chat.group', 'memory.hasChat', 'memory.hasGlobal', 'recap.present'])] },
    { label: t('um.group.generation'), subjects: pick(['gen.type', 'gen.origin', 'meta.present', 'meta.pure', 'input.shaped']) },
    { label: t('um.group.preset'), subjects: [...presetSubjects, ...pick(['transport', 'style', 'workflow', 'features.tokenSaving'])] },
    { label: t('um.group.advanced'), subjects: [...(preset.regex.length ? [{ id: 'flag', label: t('um.var.flag') }] : []), { id: 'expr', label: t('um.expr') }] },
  ].filter((g) => g.subjects.length);
}

export function subjectOf(rule: TriggerRule): SubjectId {
  if (rule.kind !== 'var') return rule.kind;
  const head = rule.path.split('.')[0];
  if (head === 'modules') return 'module';
  if (head === 'params') return 'param';
  if (head === 'flags') return 'flag';
  return rule.path;
}

/** Ids a `module` / `param` / `flag` subject can point at. */
export function targets(preset: APreset, subject: SubjectId): Option[] {
  if (subject === 'module') return userToggles(preset).map((m) => ({ value: m.id, label: pt(preset, 'modules', m.id, 'name', m.name) }));
  if (subject === 'param') return preset.params.map((p) => ({ value: p.id, label: pt(preset, 'params', p.id, 'label', p.label) }));
  if (subject === 'flag') return preset.regex.map((r) => ({ value: r.id, label: r.id }));
  return [];
}

export function varInfo(preset: APreset, path: string): VarInfo {
  const [head, id = ''] = path.split('.', 2);
  if (head === 'modules') return { kind: 'bool', label: targets(preset, 'module').find((o) => o.value === id)?.label ?? id };
  if (head === 'flags') return { kind: 'bool', label: id };
  if (head === 'params') {
    const p = preset.params.find((x) => x.id === id);
    const label = p ? pt(preset, 'params', p.id, 'label', p.label) : id;
    if (!p) return { kind: 'text', label };
    if (p.type === 'number') return { kind: 'number', label };
    if (p.type === 'list') return { kind: 'list', label };
    const options = (p.options ?? []).map((o) => ({ value: o.value, label: optionLabel(preset, p.id, o.value, o.label) }));
    if (p.type === 'select') return { kind: 'enum', label, options };
    return { kind: 'text', label, suggestions: options.map((o) => String(o.value)) };
  }
  return fixed(preset)[path] ?? { kind: 'text', label: path };
}

const optionLabel = (preset: APreset, param: string, value: string | number, fallback?: string) =>
  presetLocale(preset)?.params?.[param]?.options?.[String(value)] ?? fallback ?? String(value);

export const OPS: Record<ValueKind, VarOp[]> = {
  bool: ['on', 'off'],
  list: ['on', 'off'],
  enum: ['in', 'notIn'],
  number: ['==', '!=', '>', '>=', '<', '<='],
  text: ['==', '!='],
};

/** A fresh rule for a subject, with a sensible first value. */
export function newRule(preset: APreset, subject: SubjectId): TriggerRule {
  if (subject === 'keyword') return { kind: 'keyword', target: 'input', words: [], op: 'any' };
  if (subject === 'expr') return { kind: 'expr', source: '' };
  if (subject === 'module' || subject === 'param' || subject === 'flag') {
    const id = String(targets(preset, subject)[0]?.value ?? '');
    return retarget(preset, { kind: 'var', path: '', op: 'on' }, `${{ module: 'modules', param: 'params', flag: 'flags' }[subject]}.${id}`);
  }
  return retarget(preset, { kind: 'var', path: '', op: 'on' }, subject);
}

/** Point a variable rule at another path, resetting operator / value when the kind changes. */
export function retarget(preset: APreset, rule: VarRule, path: string): VarRule {
  const info = varInfo(preset, path);
  const keep = rule.path && varInfo(preset, rule.path).kind === info.kind && OPS[info.kind].includes(rule.op);
  if (keep && info.kind !== 'enum') return { ...rule, path };
  if (info.kind === 'bool' || info.kind === 'list') return { kind: 'var', path, op: 'on' };
  if (info.kind === 'enum') return { kind: 'var', path, op: 'in', value: [] };
  if (info.kind === 'number') return { kind: 'var', path, op: '>=', value: 0 };
  return { kind: 'var', path, op: '==', value: '' };
}

export function opLabel(kind: ValueKind, op: VarOp, path = ''): string {
  if (kind === 'bool') return t(path.startsWith('modules.') ? `um.op.module.${op}` : `um.op.${op}`);
  if (kind === 'list') return t(`um.op.list.${op}`);
  if (kind === 'enum') return t(`um.op.${op}`);
  return op === '==' ? '=' : op === '!=' ? '≠' : op === '>=' ? '≥' : op === '<=' ? '≤' : op;
}

const valueText = (info: VarInfo, v: Literal | Literal[] | undefined): string => {
  const one = (x: Literal) => info.options?.find((o) => String(o.value) === String(x))?.label ?? String(x);
  return Array.isArray(v) ? v.map(one).join(t('um.or')) : v === undefined ? '' : one(v);
};

/** One-line description of a rule, for list rows and tooltips. */
export function describeRule(preset: APreset, rule: TriggerRule): string {
  if (rule.kind === 'expr') return rule.source;
  if (rule.kind === 'keyword') {
    const where = rule.target === 'input' ? t('um.kw.input') : t('um.kw.recentN', { n: rule.depth ?? DEFAULT_KEYWORD_DEPTH });
    return `${where} ${t(`um.kw.${rule.op}`)} ${rule.words.join(t('um.or'))}`;
  }
  const info = varInfo(preset, rule.path);
  if (info.kind === 'bool' || info.kind === 'list') return t('um.boolDesc', { label: info.label, value: opLabel(info.kind, rule.op, rule.path) });
  return `${info.label} ${opLabel(info.kind, rule.op)} ${valueText(info, rule.value)}`;
}

export function describeTrigger(preset: APreset, trigger: Trigger): string {
  const rules = trigger.rules.filter(ruleComplete);
  if (!rules.length) return t('um.always');
  return rules.map((r) => describeRule(preset, r)).join(trigger.match === 'any' ? `\n${t('um.match.anyJoin')} ` : `\n${t('um.match.allJoin')} `);
}

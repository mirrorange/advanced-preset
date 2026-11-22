/**
 * User modules a preset ships, as sources compiled by the CLI:
 *
 *   user-modules/<id>.md             bundled user modules — installed into the user's own list
 *   user-module-templates/<id>.md    templates — offered when the user creates a module
 *
 * Both share one shape, with the same expressiveness as a module made in the panel (entries with
 * insertion point / role / raw text, build variable updates, trigger). Either way the user gets an
 * ordinary, fully editable user module; a whole file may be translated per UI locale.
 */
import { cloneData } from './clone';
import { emptyTrigger, normalizeVarUpdate, type Trigger, type UserEntry, type UserModule, type UserModuleGroup, type UserVarUpdate } from './user-modules';
import type { APreset } from './types';

/** An entry of a source: a user module entry without its id. */
export type UserModuleSourceEntry = Omit<UserEntry, 'id'>;

/** What a source turns into: a user module without ids. */
export interface UserModuleSourceBody {
  name: string;
  /** Templates: shown in the "new module" picker. */
  description?: string;
  /** Raw text as the user will edit it (author comments `<!--# … -->` included). */
  entries: UserModuleSourceEntry[];
  vars: UserVarUpdate[];
  trigger: Trigger;
}

export interface UserModuleSource extends UserModuleSourceBody {
  /** Kebab-case id, unique among the preset's bundled modules (or among its templates). */
  id: string;
  /** Bundled modules: whether the installed copy starts enabled (default `true`). */
  enabled?: boolean;
  /**
   * Id of one of the preset's `userModuleGroups`: bundled modules are installed into it, modules
   * made from a template are created in it (when the user has that group).
   */
  group?: string;
  /** Whole-file translations by locale (`<id>.<lang>.md`). */
  locales?: Record<string, UserModuleSourceBody>;
}

/** A user module template (`user-module-templates/`). */
export type UserModuleTemplate = UserModuleSource;

/** Locale labels (`locales/<lang>.yaml#userModules.<id>` / `#userModuleTemplates.<id>`). */
export interface UserModuleSourceLabels { name?: unknown; description?: unknown }

/** Locale labels of a user module group (`locales/<lang>.yaml#userModuleGroups.<id>`). */
export interface UserModuleGroupLabels { name?: unknown }

/** Groups of user modules the preset declares (`preset.yaml#userModuleGroups`; absent → none). */
export function presetUserModuleGroups(preset: Pick<APreset, 'userModuleGroups'>): UserModuleGroup[] {
  return Array.isArray(preset.userModuleGroups) ? preset.userModuleGroups : [];
}

/** A preset's group with its name for the UI language (from locale labels). */
export function localizeUserModuleGroup(group: UserModuleGroup, labels?: UserModuleGroupLabels): UserModuleGroup {
  return typeof labels?.name === 'string' && labels.name ? { ...cloneData(group), name: labels.name } : cloneData(group);
}

/** User modules the preset installs into the user's list (absent → none). */
export function presetUserModules(preset: Pick<APreset, 'userModules'>): UserModuleSource[] {
  return Array.isArray(preset.userModules) ? preset.userModules : [];
}

/** Templates offered when creating a user module (absent → none). */
export function presetUserModuleTemplates(preset: Pick<APreset, 'userModuleTemplates'>): UserModuleTemplate[] {
  return Array.isArray(preset.userModuleTemplates) ? preset.userModuleTemplates : [];
}

/**
 * The source as shown for `lang` (exact locale, then its base language, then the source). Names
 * and descriptions may also come from locale labels; a translated file wins over those.
 */
export function localizeUserModuleSource(src: UserModuleSource, lang?: string, labels?: UserModuleSourceLabels): UserModuleSourceBody {
  const l = lang?.toLowerCase();
  const body = (l && (src.locales?.[l] ?? src.locales?.[l.split('-')[0]!])) || undefined;
  if (body) return body;
  const name = typeof labels?.name === 'string' && labels.name ? labels.name : src.name;
  const description = typeof labels?.description === 'string' && labels.description ? labels.description : src.description;
  return { name, ...(description ? { description } : {}), entries: src.entries, vars: src.vars, trigger: src.trigger };
}

/** A new user module (entry ids `e1`, `e2`, …) copied from a source body. */
export function userModuleFromSource(body: UserModuleSourceBody, id: string, opts: { name?: string; enabled?: boolean; group?: string } = {}): UserModule {
  return {
    id,
    name: opts.name ?? body.name,
    enabled: opts.enabled ?? true,
    entries: body.entries.map((e, i) => ({ id: `e${i + 1}`, ...cloneData(e) })),
    vars: cloneData(body.vars ?? []),
    trigger: body.trigger ? cloneData(body.trigger) : emptyTrigger(),
    ...(opts.group ? { group: opts.group } : {}),
  };
}

/** A user module as a bundled source (preset export). Entry ids are dropped. */
export function userModuleToSource(m: UserModule): UserModuleSource {
  return {
    id: m.id,
    name: m.name,
    ...(m.enabled ? {} : { enabled: false }),
    ...(m.group !== undefined ? { group: m.group } : {}),
    entries: m.entries.map(({ point, role, text, enabled }) => ({ point, ...(role ? { role } : {}), text, ...(enabled === false ? { enabled } : {}) })),
    vars: cloneData(m.vars ?? []),
    trigger: cloneData(m.trigger),
  };
}

function stable(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v).sort()) if ((v as Record<string, unknown>)[k] !== undefined) out[k] = stable((v as Record<string, unknown>)[k]);
    return out;
  }
  return v;
}

/**
 * What a module says, independent of ids, the module's enabled state and description: name, entries
 * (point, role, text, switched off), variable updates (with switched-off parts) and trigger. Two modules with the same
 * fingerprint behave alike.
 */
export function userModuleFingerprint(m: UserModule | UserModuleSourceBody): string {
  return JSON.stringify(stable({
    name: m.name,
    entries: m.entries.map((e) => ({ point: e.point, role: e.role ?? null, text: e.text, ...(e.enabled === false ? { enabled: false } : {}) })),
    vars: (m.vars ?? []).flatMap(normalizeVarUpdate),
    trigger: m.trigger ?? emptyTrigger(),
  }));
}

/** Fingerprint of a whole source, translations included (detects any change between preset versions). */
export function userModuleSourceFingerprint(src: UserModuleSource): string {
  const locales = Object.keys(src.locales ?? {}).sort().map((l) => [l, userModuleFingerprint(src.locales![l]!)]);
  return JSON.stringify([userModuleFingerprint(src), src.description ?? null, locales]);
}


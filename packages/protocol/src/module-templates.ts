/**
 * Module templates: example user modules a preset ships. When creating a user module the user may
 * start from one; the template is copied into a regular, fully editable user module (later preset
 * updates do not touch the copy). Templates may be translated as a whole per UI locale.
 */
import { cloneData } from './clone';
import { emptyTrigger, type Trigger, type UserEntry, type UserModule } from './user-modules';
import type { APreset, BuildVarUpdate } from './types';

/** An entry of a template: a user module entry without its id. */
export type ModuleTemplateEntry = Omit<UserEntry, 'id'>;

/** What a template turns into: a user module without id / enabled state. */
export interface ModuleTemplateBody {
  name: string;
  /** Shown in the "new module" picker. */
  description?: string;
  /** Raw text as the user will edit it (author comments `<!--# … -->` included). */
  entries: ModuleTemplateEntry[];
  vars: BuildVarUpdate[];
  trigger: Trigger;
}

export interface ModuleTemplate extends ModuleTemplateBody {
  /** Kebab-case id, unique in the preset. */
  id: string;
  /** Whole-template translations by locale (`module-templates/<id>.<lang>.md`). */
  locales?: Record<string, ModuleTemplateBody>;
}

/** Templates of a preset (absent in older artifacts → none). */
export function moduleTemplates(preset: Pick<APreset, 'moduleTemplates'>): ModuleTemplate[] {
  return Array.isArray(preset.moduleTemplates) ? preset.moduleTemplates : [];
}

/**
 * The template as shown for `lang` (exact locale, then its base language, then the source). Names
 * and descriptions may also come from `locales/<lang>.yaml#moduleTemplates` (`labels`); a
 * translated template file wins over those.
 */
export function localizeModuleTemplate(
  tpl: ModuleTemplate,
  lang?: string,
  labels?: { name?: unknown; description?: unknown },
): ModuleTemplateBody {
  const l = lang?.toLowerCase();
  const body = (l && (tpl.locales?.[l] ?? tpl.locales?.[l.split('-')[0]!])) || undefined;
  if (body) return body;
  const name = typeof labels?.name === 'string' && labels.name ? labels.name : tpl.name;
  const description = typeof labels?.description === 'string' && labels.description ? labels.description : tpl.description;
  return { name, ...(description ? { description } : {}), entries: tpl.entries, vars: tpl.vars, trigger: tpl.trigger };
}

/** A new user module (enabled, entry ids `e1`, `e2`, …) copied from a template body. */
export function userModuleFromTemplate(body: ModuleTemplateBody, id: string, name = body.name): UserModule {
  return {
    id,
    name,
    enabled: true,
    entries: body.entries.map((e, i) => ({ id: `e${i + 1}`, ...cloneData(e) })),
    vars: cloneData(body.vars ?? []),
    trigger: body.trigger ? cloneData(body.trigger) : emptyTrigger(),
  };
}

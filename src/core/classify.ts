/**
 * Turn classification: meta-instruction parsing (D11), regex flags (§6.9), built-in meta task and
 * generation origin (§5.2, D17). Shared by the interceptor and the script path.
 */
import {
  actorName, expandMacros, parseMeta, resolverOf, test,
  type APreset, type Configuration, type MetaParse, type Vars, type Workflow,
} from '@advanced-preset/protocol';
import { st } from '@/st/host';
import type { Origin } from './context';

export type Classified = { meta: MetaParse & { task: 'summary' | 'impersonate' | null }; flags: Record<string, boolean>; origin: Origin };

/** Origin forced for the next generation (`AdvancedPreset.nextGeneration`). */
let override: { origin?: Origin } | null = null;
export const setNextGeneration = (o: { origin?: Origin } | null) => { override = o; };
export const takeOverride = () => { const o = override; override = null; return o; };

/** Whether meta instructions are handled (configuration switch, on by default). */
export const metaEnabled = (config: Configuration) => config.meta?.enabled !== false;

/** The meta trigger, or `''` when meta instructions are turned off (nothing is parsed or stripped). */
export function metaTrigger(preset: APreset, config: Configuration): string {
  if (!metaEnabled(config)) return '';
  const text = expandMacros(preset.meta.trigger, (args) => (args[0] === 'name' ? actorName(preset, config, args[1]!) : undefined));
  try { return st().substituteParams(text); } catch { return text; }
}

export function classify(preset: APreset, config: Configuration, input: string, stType: string, interceptorRan: boolean, recentTexts: string[] = [], consumeOverride = true): Classified {
  const meta = parseMeta(input, metaTrigger(preset, config), preset.meta.wrap);
  const partial = { meta: { ...meta, task: null as Classified['meta']['task'], recent: false }, flags: {} as Record<string, boolean> };
  const resolve = resolverOf(partial as unknown as Vars);
  for (const r of preset.regex) {
    let target = input;
    if (r.target === 'meta') target = meta.segments.join('\n\n');
    else if (r.target.startsWith('recent:')) target = recentTexts.slice(-Number(r.target.slice(7))).join('\n\n');
    let hit = false;
    try { hit = new RegExp(r.pattern, r.flags).test(target); } catch { hit = false; }
    partial.flags[r.id] = hit && test(r.requires, resolve);
  }
  let task: Classified['meta']['task'] = null;
  if (meta.pure) {
    if (preset.meta.tasks.summary && test(preset.meta.tasks.summary, resolve)) task = 'summary';
    else if (preset.meta.tasks.impersonate && test(preset.meta.tasks.impersonate, resolve)) task = 'impersonate';
  }
  const storyTypes = ['normal', 'regenerate', 'swipe', 'continue'];
  let origin: Origin = interceptorRan && storyTypes.includes(stType) && !meta.pure ? 'story' : 'task';
  const o = consumeOverride ? takeOverride() : null;
  if (o?.origin) origin = o.origin;
  return { meta: { ...meta, task }, flags: partial.flags, origin };
}

export function pickWorkflow(preset: APreset, config: Configuration, origin: Origin): Workflow | undefined {
  if (origin === 'task') return preset.workflows.find((w) => w.kind === 'task') ?? preset.workflows.find((w) => w.id === 'task');
  return preset.workflows.find((w) => w.id === config.connection.workflow) ?? preset.workflows.find((w) => w.kind === 'story');
}

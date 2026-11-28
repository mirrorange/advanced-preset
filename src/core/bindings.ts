/**
 * Connection bindings (1.13): model / transport pairings a turn can run on. The default binding is
 * the connection's own fields (`ConnectionConfig`), so configurations from before 1.13 run exactly as
 * they did. Extra bindings point at a SillyTavern Connection Manager profile or replace the model
 * name; with multi-model on (presets that declare `multiModel`), each actor runs on its own binding.
 */
import {
  BINDING_TRANSPORT_KEYS, DEFAULT_BINDING, cloneData,
  type ActorId, type APreset, type BindingTarget, type BindingTransport, type Configuration, type ConnectionBinding, type ConnectionConfig,
} from '@advanced-preset/protocol';
import { chatCompletionModel, connectionProfiles, generationParameters, profileSource, proxyPreset, st, toolCallingIssue, type ConnectionProfile } from '@/st/host';
import { t } from '@/i18n';

export interface ResolvedBinding extends ConnectionBinding { id: string }

const CURRENT: BindingTarget = { type: 'current' };

function transportOf(src: Partial<BindingTransport>, fallback: BindingTransport): BindingTransport {
  const out = {} as Record<string, unknown>;
  for (const k of BINDING_TRANSPORT_KEYS) out[k] = src[k] !== undefined ? src[k] : fallback[k];
  return out as unknown as BindingTransport;
}

function validTarget(target: unknown): BindingTarget {
  const x = target as Partial<Record<string, unknown>> | undefined;
  if (x?.type === 'profile' && typeof x.profile === 'string') return { type: 'profile', profile: x.profile };
  if (x?.type === 'model' && typeof x.model === 'string') return { type: 'model', model: x.model };
  return CURRENT;
}

/** The default binding: the connection's own transport fields and `connection.target`. */
function defaultBinding(conn: ConnectionConfig): ResolvedBinding {
  return { id: DEFAULT_BINDING, name: '', target: validTarget(conn.target), ...transportOf(conn, conn) };
}

/** Every binding of a configuration, the default one first. Missing transport fields come from the default binding. */
export function listBindings(config: Configuration): ResolvedBinding[] {
  const def = defaultBinding(config.connection);
  const extra = Object.entries(config.connection.bindings ?? {})
    .filter(([id, b]) => id !== DEFAULT_BINDING && b && typeof b === 'object')
    .map(([id, b]) => ({ id, name: typeof b.name === 'string' ? b.name : id, target: validTarget(b.target), ...transportOf(b, def) }));
  return [def, ...extra];
}

/** A binding by id; an unknown id (e.g. a deleted binding) is the default binding, with a warning. */
export function bindingById(config: Configuration, id: string | undefined, warnings?: string[]): ResolvedBinding {
  const all = listBindings(config);
  if (!id || id === DEFAULT_BINDING) return all[0]!;
  const found = all.find((b) => b.id === id);
  if (!found) warnings?.push(`binding \`${id}\` does not exist: the default binding is used`);
  return found ?? all[0]!;
}

/** Multi-model is on: the preset declares it and the configuration switches it on. */
export const multiModelOn = (preset: APreset, config: Configuration): boolean =>
  Boolean(preset.multiModel) && config.multiModel?.enabled === true;

/** Binding that executes an actor's stages (multi-model on), or the selected binding (off). */
export function bindingForActor(preset: APreset, config: Configuration, actor: ActorId, warnings?: string[]): ResolvedBinding {
  if (multiModelOn(preset, config)) return bindingById(config, config.multiModel?.actors?.[actor], warnings);
  return bindingById(config, config.connection.binding, warnings);
}

/** Binding of turns that run in one request (multi-model off, task / script generations). */
export const selectedBinding = (config: Configuration, warnings?: string[]): ResolvedBinding =>
  bindingById(config, config.connection.binding, warnings);

/**
 * The configuration with a binding's transport settings in `connection`, so code reading
 * `config.connection.*` (transports, tool options) follows the binding. Same object for the default binding.
 */
export function withBinding(config: Configuration, binding: ResolvedBinding): Configuration {
  if (binding.id === DEFAULT_BINDING) return config;
  return { ...config, connection: { ...config.connection, ...transportOf(binding, binding) } };
}

/** A binding target that cannot be used (missing profile, Text Completion profile, …). */
export class BindingError extends Error {
  override name = 'BindingError';
}

/** Fields ST sets per source that are not AP's business (the prompt, tools and streaming stay as AP built them). */
const KEEP = new Set(['messages', 'tools', 'tool_choice', 'type', 'stream', 'json_schema']);

/** Endpoint settings a profile's `api-url` fills (as ST's Connection Manager requests do). */
const API_URL_FIELDS = ['custom_url', 'vertexai_region', 'zai_endpoint', 'siliconflow_endpoint', 'minimax_endpoint', 'pollinations_endpoint'];

/** Connection Manager profile of a target, checked: it exists and is a plain Chat Completion profile. */
export function targetProfile(id: string): ConnectionProfile {
  const p = connectionProfiles().find((x) => x.id === id);
  if (!p) throw new BindingError(t('error.binding.profileMissing'));
  const name = p.name || p.id;
  if (p.mode && p.mode !== 'cc') throw new BindingError(t('error.binding.textCompletion', { name }));
  if (Object.hasOwn(p, 'custom-connection')) throw new BindingError(t('error.binding.customConnection', { name }));
  if (p.api && !profileSource(p.api)) throw new BindingError(t('error.binding.textCompletion', { name }));
  return p;
}

/** ST's Chat Completion settings with a profile's connection fields applied (sampling untouched). */
function profileSettings(live: Record<string, any>, p: ConnectionProfile): { settings: Record<string, any>; model: string } {
  const s = cloneData(live);
  const source = p.api ? profileSource(p.api)! : String(s.chat_completion_source ?? '');
  if (source !== s.chat_completion_source) delete s.custom_provider_state;
  s.chat_completion_source = source;
  if (typeof p['api-url'] === 'string' && p['api-url']) for (const f of API_URL_FIELDS) s[f] = p['api-url'];
  if (typeof p.proxy === 'string' && p.proxy) {
    const preset = proxyPreset(p.proxy);
    s.reverse_proxy = preset?.url ?? '';
    s.proxy_password = preset?.password ?? '';
  }
  if (typeof p['prompt-post-processing'] === 'string') s.custom_prompt_post_processing = p['prompt-post-processing'];
  const model = typeof p.model === 'string' && p.model ? p.model : chatCompletionModel(s, true);
  return { settings: s, model };
}

/** `base` with what differs between two ST request bodies (`undefined` fields removed). */
function overlay(base: Record<string, any>, from: Record<string, any>, to: Record<string, any>): Record<string, any> {
  const out = { ...base };
  for (const k of new Set([...Object.keys(from), ...Object.keys(to)])) {
    if (KEEP.has(k) || JSON.stringify(from[k]) === JSON.stringify(to[k])) continue;
    if (to[k] === undefined) delete out[k];
    else out[k] = cloneData(to[k]);
  }
  return out;
}

/** Without ST's body builder (openai.js not importable): the fields ST's Connection Manager requests set. */
function staticProfileBody(base: Record<string, any>, p: ConnectionProfile, settings: Record<string, any>, model: string): Record<string, any> {
  const out: Record<string, any> = { ...base, chat_completion_source: settings.chat_completion_source, model };
  for (const f of API_URL_FIELDS) if (settings[f] !== undefined && (f === 'custom_url' || base[f] !== undefined || p['api-url'])) out[f] = settings[f];
  if (settings.reverse_proxy) { out.reverse_proxy = settings.reverse_proxy; out.proxy_password = settings.proxy_password; } else { delete out.reverse_proxy; delete out.proxy_password; }
  out.custom_prompt_post_processing = settings.custom_prompt_post_processing;
  return out;
}

/**
 * ST's generate body rewritten for a binding target. `current` returns `base` itself. Otherwise ST
 * builds the body for the current settings and for the target's (same sampling, other source / model /
 * endpoint / proxy / post-processing), and the fields that differ are carried over to `base`, so
 * source-specific fields follow as ST would set them while AP's prompt, tools and changes made by
 * other extensions stay. The profile's API key is the one ST stores for its source (or its `secret-id`);
 * its completion preset (sampling, prompts) is not applied.
 */
export async function applyTarget(base: Record<string, any>, target: BindingTarget): Promise<Record<string, any>> {
  if (target.type === 'current') return base;
  const live = st().chatCompletionSettings ?? {};
  const type = String(base.type ?? 'normal');
  const curModel = String(base.model ?? chatCompletionModel(live));
  let settings = live;
  let model: string;
  let profile: ConnectionProfile | undefined;
  if (target.type === 'model') {
    model = target.model.trim();
    if (!model) throw new BindingError(t('error.binding.noModel'));
  } else {
    profile = targetProfile(target.profile);
    ({ settings, model } = profileSettings(live, profile));
  }
  const [from, to] = await Promise.all([generationParameters(cloneData(live), curModel, type), generationParameters(cloneData(settings), model, type)]);
  let out = from && to ? overlay(base, from, to) : profile ? staticProfileBody(base, profile, settings, model) : { ...base };
  out.model = model;
  if (profile?.['secret-id']) out.secret_id = profile['secret-id'];
  return out;
}

/** Why a binding's tool transport cannot run on the body it sends (`null`: it can). Today's check, per binding. */
export function bindingCapabilityError(binding: ResolvedBinding, body: Record<string, any>): string | null {
  if (binding.transport !== 'tool-single' && binding.transport !== 'tool-multi') return null;
  const target = binding.target.type === 'current' ? undefined : {
    source: String(body.chat_completion_source ?? ''),
    model: String(body.model ?? ''),
    postProcessing: String(body.custom_prompt_post_processing ?? ''),
  };
  const issue = toolCallingIssue(binding.assumeToolSupport, target);
  if (!issue) return null;
  switch (issue.reason) {
    case 'postProcessing': return t('error.toolsUnsupported.postProcessing', { value: issue.label });
    case 'model': return t('error.toolsUnsupported.model', { target: issue.model ? `${issue.source} / ${issue.model}` : issue.source });
    default: return t(`error.toolsUnsupported.${issue.reason}`);
  }
}

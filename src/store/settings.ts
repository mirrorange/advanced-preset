/**
 * Persistent extension state in `extension_settings.advancedPreset` (wrapped in a Vue reactive proxy
 * so the panel updates live; writes go through to the plain object ST serialises).
 */
import { reactive } from 'vue';
import type { APreset, SparseDiff, UserModule, UserModuleGroup } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import { setLanguage } from '@/i18n';
import type { MemoryEvent } from './eventlog';
import type { BundledRecord } from './bundled-modules';

export type ConfigRef = { kind: 'recommended' | 'saved'; id: string };

export interface SavedConfig {
  id: string;
  name: string;
  /** Sparse diff relative to `configurationDefaults`. */
  diff: SparseDiff;
}

export interface PresetState {
  active: { ref: ConfigRef; diff: SparseDiff };
  saved: SavedConfig[];
  globalMemory: { log: MemoryEvent[]; cursor: number };
  /** Version / hash of the artifact the configuration was last migrated to. */
  version?: string;
  hash?: string;
  /** Hash of the Carrier content AP generated last (detects manual edits). */
  carrierHash?: string;
  /**
   * The user's own modules for this preset, in insertion order, which is also display order:
   * ungrouped first, then each group of `userModuleGroups` in turn.
   */
  userModules?: UserModule[];
  /** Groups of user modules, in display order (`UserModule.group` refers to them). */
  userModuleGroups?: UserModuleGroup[];
  /** Bundled user modules last synced, by id (see `bundled-modules.ts`). */
  bundledModules?: Record<string, BundledRecord>;
  /** Ids of the preset's user module groups synced so far (a deleted one is not added again). */
  bundledGroups?: string[];
  /**
   * Custom structure components (I-137): whether the user enabled them, and the code fingerprint
   * (`structureUiHash`) they trusted. A different fingerprint counts as not enabled.
   */
  customUi?: { enabled: boolean; hash: string };
}

export interface APSettings {
  formatVersion: 1;
  enabled: boolean;
  presets: Record<string, PresetState>;
  /** User-installed artifacts (built-ins are shipped in dist/presets). */
  installed: Record<string, APreset>;
  /** Where installed artifacts came from (URL), for updates (others update from their `updateUrl`). */
  sources: Record<string, string>;
  ui: {
    primary?: string;
    accent?: string;
    collapseStages: boolean;
    /** Interface language (`en` / `zh-cn` / `zh-tw`); unset follows SillyTavern. */
    language?: string;
    /** Inline annotations (I-86): shown by default; underline colour defaults to the accent. */
    annotations?: { show: boolean; color?: string };
  };
  dev: { url: string; enabled: boolean };
  debug: { keepRequests: number };
  /** Quick Reply sets AP wrote, by ST set name: the preset they belong to and the fingerprint of what was written. */
  quickReplies?: Record<string, { presetId: string; hash: string }>;
  /** Preset files in ST's list whose preset the user declined to install (I-171): ST preset name → artifact hash. */
  declinedPresetFiles?: Record<string, string>;
  /** Updates found at startup whose preset the user declined to trust: preset id → artifact hash. */
  declinedUpdates?: Record<string, string>;
}

const defaults = (): APSettings => ({
  formatVersion: 1,
  enabled: true,
  presets: {},
  installed: {},
  sources: {},
  ui: { collapseStages: true, annotations: { show: true } },
  dev: { url: 'http://localhost:4747', enabled: false },
  debug: { keepRequests: 20 },
});

let state: APSettings | null = null;

export function settings(): APSettings {
  if (state) return state;
  const all = st().extensionSettings;
  const raw = (all.advancedPreset ??= {});
  const d = defaults();
  for (const [k, v] of Object.entries(d)) {
    if (raw[k] === undefined) raw[k] = v;
    else if (v && typeof v === 'object' && !Array.isArray(v)) raw[k] = { ...v, ...raw[k] };
  }
  state = reactive(raw) as APSettings;
  setLanguage(state.ui.language);
  return state;
}

export const save = () => st().saveSettingsDebounced();

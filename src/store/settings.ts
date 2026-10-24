/**
 * Persistent extension state in `extension_settings.advancedPreset` (wrapped in a Vue reactive proxy
 * so the panel updates live; writes go through to the plain object ST serialises).
 */
import { reactive } from 'vue';
import type { APreset, SparseDiff, UserModule } from '@advanced-preset/protocol';
import { st } from '@/st/host';
import type { MemoryEvent } from './eventlog';

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
  /** The user's own modules for this preset, in insertion order. */
  userModules?: UserModule[];
}

export interface APSettings {
  formatVersion: 1;
  enabled: boolean;
  presets: Record<string, PresetState>;
  /** User-installed artifacts (built-ins are shipped in dist/presets). */
  installed: Record<string, APreset>;
  /** Where installed artifacts came from (URL), for one-click updates. */
  sources: Record<string, string>;
  ui: {
    primary?: string;
    accent?: string;
    collapseStages: boolean;
    /** Inline annotations (I-86): shown by default; underline colour defaults to the accent. */
    annotations?: { show: boolean; color?: string };
  };
  dev: { url: string; enabled: boolean };
  debug: { keepRequests: number };
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
  return state;
}

export const save = () => st().saveSettingsDebounced();

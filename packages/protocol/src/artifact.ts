/**
 * Artifact format upgrades. Older artifacts (installed copies, dev servers running an older CLI)
 * are upgraded in memory when loaded, so the runtime only ever deals with the current format.
 */
import { CONNECTION_DEFAULTS } from './config';
import { FORMAT_VERSION, type APreset, type ToolsDecl } from './types';
import { DEFAULT_TOOLS } from './workflow';

type Obj = Record<string, any>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/**
 * Format 1 → 2: tool names were fixed by the extension (`ap_submit_turn`, `ap_stage_<id>`,
 * `ap_turn`) and the preset supplied a few strings. Keep that exact behaviour.
 */
function v1Tools(old: unknown): ToolsDecl {
  const o = isObj(old) ? old : {};
  const s = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
  return {
    ...DEFAULT_TOOLS,
    turn: { ...DEFAULT_TOOLS.turn },
    submit: { name: 'ap_submit_turn', description: s(o.submit, DEFAULT_TOOLS.submit.description!) },
    stage: { ...DEFAULT_TOOLS.stage, name: `${s(o.stagePrefix, 'ap_stage_')}{{stage}}` },
    results: { ...DEFAULT_TOOLS.results, next: s(o.stageResult, DEFAULT_TOOLS.results.next), nudge: s(o.nudge, DEFAULT_TOOLS.results.nudge) },
  };
}

/**
 * Connection options added without a format bump (e.g. `streamToolArguments`) are missing from older
 * artifacts. Fill them so they resolve to the default and user diffs touching them are not pruned.
 */
function withConnectionDefaults(p: APreset): APreset {
  const conn = p.configurationDefaults?.connection;
  if (!isObj(conn) || Object.keys(CONNECTION_DEFAULTS).every((k) => k in conn)) return p;
  return { ...p, configurationDefaults: { ...p.configurationDefaults, connection: { ...CONNECTION_DEFAULTS, ...conn } } };
}

/** Fields added without a format bump get their empty defaults. */
function withOptionalDefaults(p: APreset): APreset {
  const out = withConnectionDefaults(p);
  return Array.isArray(out.insertionPoints) ? out : { ...out, insertionPoints: [] };
}

/** Upgrade a parsed artifact to the current format. Returns `null` for anything that is not a known artifact. */
export function upgradeArtifact(raw: unknown): APreset | null {
  if (!isObj(raw) || typeof raw.id !== 'string' || !Array.isArray(raw.entries)) return null;
  if (raw.formatVersion === FORMAT_VERSION) return withOptionalDefaults(raw as APreset);
  if (raw.formatVersion === 1) return withOptionalDefaults({ ...raw, formatVersion: FORMAT_VERSION, tools: v1Tools(raw.tools) } as APreset);
  return null;
}

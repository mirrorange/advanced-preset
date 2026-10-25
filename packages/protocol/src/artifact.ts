/**
 * Artifact loading. Only the current format is accepted (an installed copy in an older format is
 * ignored, and the built-in copy of that preset is used instead); fields added without a format
 * bump get their defaults in memory.
 */
import { CACHE_DEFAULTS, CONNECTION_DEFAULTS } from './config';
import { FORMAT_VERSION, type APreset } from './types';

type Obj = Record<string, any>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/**
 * Connection options added without a format bump (e.g. `streamToolArguments`) are missing from older
 * artifacts. Fill them so they resolve to the default and user diffs touching them are not pruned.
 */
function withConnectionDefaults(p: APreset): APreset {
  const conn = p.configurationDefaults?.connection;
  if (!isObj(conn) || Object.keys(CONNECTION_DEFAULTS).every((k) => k in conn)) return p;
  return { ...p, configurationDefaults: { ...p.configurationDefaults, connection: { ...CONNECTION_DEFAULTS, ...conn } } };
}

/**
 * Token saving's `userInput` mode was added without a format bump. Older artifacts always truncated
 * (when `truncateUserAfter` > 0), so they resolve to `truncate`.
 */
function withTokenSavingDefaults(p: APreset): APreset {
  const decl = p.tokenSaving;
  const conf = p.configurationDefaults?.tokenSaving;
  if ((!isObj(decl) || 'userInput' in decl) && (!isObj(conf) || 'userInput' in conf)) return p;
  const userInput = (isObj(decl) && decl.userInput) || 'truncate';
  return {
    ...p,
    tokenSaving: isObj(decl) ? { ...decl, userInput } : decl,
    configurationDefaults: isObj(conf) ? { ...p.configurationDefaults, tokenSaving: { ...conf, userInput: 'userInput' in conf ? conf.userInput : userInput } } : p.configurationDefaults,
  };
}

/** Cache optimization was added without a format bump: older artifacts get the built-in defaults. */
function withCacheDefaults(p: APreset): APreset {
  const conf = p.configurationDefaults as APreset['configurationDefaults'] | undefined;
  if (!isObj(conf)) return p;
  const cache = (conf as Obj).cache;
  if (isObj(cache) && Object.keys(CACHE_DEFAULTS).every((k) => k in cache)) return p;
  return { ...p, configurationDefaults: { ...conf, cache: { ...CACHE_DEFAULTS, ...(isObj(cache) ? cache : {}) } } };
}

/** Fields added without a format bump get their empty defaults. */
function withOptionalDefaults(p: APreset): APreset {
  const out = withCacheDefaults(withTokenSavingDefaults(withConnectionDefaults(p)));
  return Array.isArray(out.insertionPoints) ? out : { ...out, insertionPoints: [] };
}

/** A parsed artifact in the current format, or `null` for anything else. */
export function upgradeArtifact(raw: unknown): APreset | null {
  if (!isObj(raw) || typeof raw.id !== 'string' || !Array.isArray(raw.entries)) return null;
  return raw.formatVersion === FORMAT_VERSION ? withOptionalDefaults(raw as APreset) : null;
}

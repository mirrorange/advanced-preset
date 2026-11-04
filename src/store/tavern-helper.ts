/**
 * Tavern Helper data of a Carrier (`extensions.tavern_helper`): the preset's scripts, merged with
 * what Tavern Helper and the user keep there. AP writes data only; Tavern Helper reads it when the
 * Carrier is selected, and asks the user before running the scripts.
 *
 * When the Carrier is rebuilt (preset installed again or updated):
 * - the preset's scripts and folders are written anew, but keep their `enabled` switch, and scripts
 *   keep their `data` (Tavern Helper script variables) over the preset's defaults, matched by id;
 * - scripts and folders the user added (ids AP did not write last time) are kept, also inside the
 *   preset's folders; the ones the preset dropped are removed;
 * - preset variables and any other Tavern Helper fields are kept as they are.
 */
import { cloneData, tavernHelperIds, type TavernHelperScriptTree } from '@advanced-preset/protocol';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

export interface CarrierTavernHelper {
  /** The Carrier's `extensions.tavern_helper` (absent: nothing to write). */
  data?: Obj;
  /** Ids written from the preset (kept in the Carrier metadata for the next rebuild). */
  owned: string[];
}

export function carrierTavernHelper(scripts: readonly TavernHelperScriptTree[] | undefined, current: unknown, ownedBefore: readonly string[] = []): CarrierTavernHelper {
  const cur = isObj(current) ? current : {};
  const curTrees = (Array.isArray(cur.scripts) ? cur.scripts : []).filter(isObj);
  const fresh = cloneData(scripts ?? []);
  const owned = tavernHelperIds(fresh);
  const ours = new Set([...owned, ...ownedBefore]);
  const userItem = (x: Obj) => typeof x.id !== 'string' || !ours.has(x.id);

  const old = new Map<string, Obj>();
  for (const t of curTrees) {
    if (typeof t.id === 'string') old.set(t.id, t);
    for (const s of Array.isArray(t.scripts) ? t.scripts.filter(isObj) : []) if (typeof s.id === 'string') old.set(s.id, s);
  }
  const keepState = (node: { id: string; type: string; enabled: boolean; data?: Obj }) => {
    const prev = old.get(node.id);
    if (!prev || prev.type !== node.type) return;
    if (typeof prev.enabled === 'boolean') node.enabled = prev.enabled;
    if (node.data && isObj(prev.data)) node.data = { ...node.data, ...cloneData(prev.data) };
  };
  for (const t of fresh) {
    keepState(t);
    if (t.type !== 'folder') continue;
    for (const s of t.scripts) keepState(s);
    const prev = old.get(t.id);
    const added = isObj(prev) && Array.isArray(prev.scripts) ? prev.scripts.filter(isObj).filter(userItem) : [];
    t.scripts.push(...(cloneData(added) as never[]));
  }

  const trees: unknown[] = [...fresh, ...cloneData(curTrees.filter(userItem))];
  const variables = isObj(cur.variables) ? cloneData(cur.variables) : {};
  const rest = Object.keys(cur).some((k) => k !== 'scripts' && k !== 'variables');
  if (!trees.length && !Object.keys(variables).length && !rest) return { owned };
  return { data: { ...cloneData(cur), scripts: trees, variables }, owned };
}

/** Whether the scripts Tavern Helper would load differ (ignoring the data scripts keep). */
export function tavernHelperScriptsChanged(before: unknown, after: unknown): boolean {
  const scripts = (x: unknown) => JSON.stringify(isObj(x) && Array.isArray(x.scripts)
    ? x.scripts.map((t) => (isObj(t) ? { ...t, data: undefined, scripts: Array.isArray(t.scripts) ? t.scripts.map((s) => (isObj(s) ? { ...s, data: undefined } : s)) : undefined } : t))
    : []);
  return scripts(before) !== scripts(after);
}

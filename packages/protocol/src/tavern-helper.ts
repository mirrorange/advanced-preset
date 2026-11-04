/**
 * Tavern Helper (JS-Slash-Runner) scripts a preset ships (`tavern-helper-scripts/`). They are stored
 * in Tavern Helper's own shape and written into the Carrier's `extensions.tavern_helper.scripts`,
 * where Tavern Helper finds them as preset scripts. Trusting and enabling them is left to Tavern
 * Helper (it asks when it first sees a preset with scripts); AP never runs or enables them itself.
 * AP only writes data: it does not call into Tavern Helper.
 */

/** First Advanced Preset version that writes the preset's Tavern Helper scripts into the Carrier. */
export const TAVERN_HELPER_SINCE = '1.10.0';

/** Key of the Carrier's `extensions` that Tavern Helper reads preset scripts and variables from. */
export const TAVERN_HELPER_FIELD = 'tavern_helper';

export interface TavernHelperButton { name: string; visible: boolean }

export interface TavernHelperScript {
  type: 'script';
  enabled: boolean;
  name: string;
  /** UUID (stable per preset and source file, so the script keeps its state across updates). */
  id: string;
  /** JavaScript run by Tavern Helper. */
  content: string;
  /** Author's notes shown in Tavern Helper. */
  info: string;
  button: { enabled: boolean; buttons: TavernHelperButton[] };
  /** The script's own data (Tavern Helper script variables). */
  data: Record<string, unknown>;
  export_with: { data: boolean; button: boolean };
}

export interface TavernHelperFolder {
  type: 'folder';
  enabled: boolean;
  name: string;
  id: string;
  icon: string;
  /** Absent: Tavern Helper picks its default (the theme's quote color). */
  color?: string;
  scripts: TavernHelperScript[];
}

export type TavernHelperScriptTree = TavernHelperScript | TavernHelperFolder;

/** The folder and the scripts of a tree item, in order (ids AP owns in a Carrier). */
export function tavernHelperIds(trees: readonly TavernHelperScriptTree[]): string[] {
  return trees.flatMap((t) => (t.type === 'folder' ? [t.id, ...t.scripts.map((s) => s.id)] : [t.id]));
}

/** Number of scripts (folders not counted). */
export function tavernHelperScriptCount(trees: readonly TavernHelperScriptTree[]): number {
  return trees.reduce((n, t) => n + (t.type === 'folder' ? t.scripts.length : 1), 0);
}

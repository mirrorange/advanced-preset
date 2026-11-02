/**
 * Storylines: side stories and "if" lines within one chat. A story input ending with a tag
 * `#<name>` continues (or starts) the storyline `<name>`; untagged input belongs to the main
 * storyline. `#!<name>` makes `<name>` the main storyline. Names starting with `if` are if-lines
 * (alternate timelines the other storylines never see); the user may switch this per storyline.
 *
 * A preset opts in with `storylines` (separators placed before each storyline's group of history
 * messages); users have a switch in the configuration (`Configuration.storylines.enabled`).
 * `freezeVariables`: turns on storylines other than the main one leave the variables of variable
 * systems (MVU, Tavern Helper chat / message variables) as they were.
 */

export interface StorylinesDecl {
  /** System message before the history of a storyline other than the main one. `{{storyline}}` = its name. */
  separator: string;
  /** System message before the history of the main storyline. `{{storyline}}` = the main storyline's name (may be empty). */
  mainSeparator: string;
}

export const DEFAULT_STORYLINES: StorylinesDecl = {
  separator: '<!-- Start of Storyline {{storyline}} -->',
  mainSeparator: '<!-- Start of the main storyline -->',
};

/** User switch (configuration layer). */
export interface StorylineConfig {
  enabled: boolean;
  /** Turns on other storylines do not update MVU / Tavern Helper variables (I-154). */
  freezeVariables: boolean;
}

export const STORYLINE_CONFIG_DEFAULTS: StorylineConfig = { enabled: true, freezeVariables: true };

/** First Advanced Preset version with storylines (older versions ignore `storylines` and leave the tags in the text). */
export const STORYLINES_SINCE = '1.10.0';

/** Longest storyline name recognised in a tag. */
export const MAX_STORYLINE_NAME = 64;

/** `storyline.*` condition variables of a generation. */
export interface StorylineVars {
  /** Name of the current storyline (the main storyline's name, possibly empty, on the main storyline). */
  name: string;
  /** The current storyline is the main storyline. */
  main: boolean;
  /** The current storyline is an if-line. */
  if: boolean;
  /** The current storyline has no earlier message (this turn starts it). */
  new: boolean;
  /** The history holds more than one storyline: it is grouped by storyline, with separators. */
  grouped: boolean;
}

export const MAIN_STORYLINE_VARS: StorylineVars = { name: '', main: true, if: false, new: false, grouped: false };

export interface StorylineTag {
  /** Storyline name as written. */
  name: string;
  /** `#!<name>`: make this storyline the main one. */
  switchMain: boolean;
  /** Offset of the tag (including the whitespace before it) in the text. */
  at: number;
  /** The text without the tag (trailing whitespace removed). */
  text: string;
}

const TAG_RE = /(^|\s)#(!?)([^\s#]+)\s*$/u;

/** The storyline tag at the end of a message, if any. */
export function parseStorylineTag(text: string): StorylineTag | null {
  const m = TAG_RE.exec(text);
  if (!m) return null;
  const name = m[3]!;
  if ([...name].length > MAX_STORYLINE_NAME) return null;
  const at = m.index;
  return { name, switchMain: m[2] === '!', at, text: text.slice(0, at).trimEnd() };
}

/** Text without its trailing storyline tag. */
export function stripStorylineTag(text: string): string {
  return parseStorylineTag(text)?.text ?? text;
}

/** Text with `name` as its storyline tag (replacing an existing tag; `''` removes it). */
export function withStorylineTag(text: string, name: string, switchMain = false): string {
  const base = stripStorylineTag(text);
  if (!name) return base;
  return `${base}${base ? ' ' : ''}#${switchMain ? '!' : ''}${name}`;
}

/** Names starting with `if` are if-lines unless the user decided otherwise. */
export const isIfName = (name: string): boolean => /^if/i.test(name);

/** Separator text of a storyline group: `{{storyline}}` is replaced after macro expansion (names are literal). */
export function storylineSeparator(template: string, name: string, expand: (s: string) => string = (s) => s): string {
  const SLOT = '\u0000ap-storyline\u0000';
  return expand(template.replaceAll('{{storyline}}', SLOT)).replaceAll(SLOT, () => name);
}

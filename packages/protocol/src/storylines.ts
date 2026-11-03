/**
 * Storylines: side stories and "if" lines within one chat. A story input ending with a tag
 * `#<name>` continues (or starts) the storyline `<name>`; untagged input belongs to the main
 * storyline. `#!<name>` makes `<name>` the main storyline. `#?` / `#!?` start a new storyline (a new
 * main storyline) the AI names; `#` / `#!` without a name mean the most recent other storyline. Names starting with `if` are if-lines
 * (alternate timelines the other storylines never see); the user may switch this per storyline.
 *
 * A preset opts in with `storylines` (separators placed before each storyline's group of history
 * messages); users have a switch in the configuration (`Configuration.storylines.enabled`).
 * `freezeVariables`: which turns leave the variables of variable systems (MVU, Tavern Helper chat /
 * message variables) as they were — every storyline other than the main one, only if-lines, or none.
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

/**
 * Turns that do not update variables (I-154, I-163): `all` — every storyline other than the main one;
 * `if` — only if-lines; `off` — none.
 */
export type StorylineFreeze = 'all' | 'if' | 'off';
export const STORYLINE_FREEZE_MODES: readonly StorylineFreeze[] = ['all', 'if', 'off'];

/** User switches (configuration layer). */
export interface StorylineConfig {
  enabled: boolean;
  /** Which turns do not update MVU / Tavern Helper variables. */
  freezeVariables: StorylineFreeze;
}

export const STORYLINE_CONFIG_DEFAULTS: StorylineConfig = { enabled: true, freezeVariables: 'all' };

/** The freeze mode of a configuration (unknown values: the default). */
export const freezeMode = (c: Partial<StorylineConfig> | undefined): StorylineFreeze =>
  STORYLINE_FREEZE_MODES.includes(c?.freezeVariables as StorylineFreeze) ? c!.freezeVariables! : STORYLINE_CONFIG_DEFAULTS.freezeVariables;

/** A turn on a storyline (`main` / `if` as in {@link StorylineVars}) leaves the variables as they were under `mode`. */
export const freezesStoryline = (mode: StorylineFreeze, line: { main: boolean; if: boolean }): boolean =>
  mode === 'all' ? !line.main : mode === 'if' ? line.if : false;

/** First Advanced Preset version with storylines (older versions ignore `storylines` and leave the tags in the text). */
export const STORYLINES_SINCE = '1.10.0';

/** Longest storyline name recognised in a tag. */
export const MAX_STORYLINE_NAME = 64;

/** `storyline.*` condition variables of a generation. */
export interface StorylineVars {
  /** Name of the current storyline (the main storyline's name, possibly empty, on the main storyline; empty while the AI names it). */
  name: string;
  /** The current storyline is the main storyline (also on a turn that makes it the main one). */
  main: boolean;
  /** The current storyline is an if-line. */
  if: boolean;
  /** The current storyline has no earlier message (this turn starts it). */
  new: boolean;
  /** The history holds more than one storyline: it is grouped by storyline, with separators. */
  grouped: boolean;
  /** The AI names the current storyline this turn (`#?`, `#!?`; a swipe of a `#!?` turn names it again). */
  naming: boolean;
  /** The AI names the previous main storyline, which has no name yet (a `#!` switch). */
  namingMain: boolean;
  /** This turn makes the current storyline the main one (`#!name`, `#!?`); the previous main storyline is history. */
  switching: boolean;
  /** Variable updates of this turn are blocked (`storylines.freezeVariables`, I-163): the preset can tell the AI not to update state. */
  frozen: boolean;
}

export const MAIN_STORYLINE_VARS: StorylineVars = { name: '', main: true, if: false, new: false, grouped: false, naming: false, namingMain: false, switching: false, frozen: false };

/**
 * What a tag asks for (I-157):
 * - `name`: `#name` / `#!name`;
 * - `new`: `#?` / `#!?`, a new storyline the AI names;
 * - `recent`: `#` / `#!` without a name, the most recent storyline other than the main one.
 *
 * `#@…` (`#@name`, `#@`, `#@?`, `#@if?`) also makes the storyline invisible to the other storylines
 * (I-161); `#if?` is a new storyline that is an if-line (I-162). `!` and `@` exclude each other, and a
 * main storyline is never an if-line (`#!if?` is not a tag).
 */
export type StorylineTagForm = 'name' | 'new' | 'recent';

export interface StorylineTag {
  form: StorylineTagForm;
  /** Storyline name as written (`''` for `new` / `recent`). */
  name: string;
  /** `#!…`: make this storyline the main one. */
  switchMain: boolean;
  /** `#@…`: the storyline is invisible to the other storylines. */
  hide: boolean;
  /** `#if?` / `#@if?`: the new storyline is an if-line. */
  ifLine: boolean;
  /** Offset of the `#` in the text. */
  at: number;
  /** The text without the tag (trailing whitespace removed). */
  text: string;
}

/**
 * A trailing `#…`. Whitespace before the `#` is optional (`好的#地下室`), but a `#` right after an
 * ASCII letter, digit or `_ # & / =` is text (`C#`, `issue#42`, `page#anchor`, `&#39`).
 */
const TAG_RE = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u;

/** A name usable in a `#tag`: no whitespace or `#`, not starting with `!` / `?` / `@`, not `if?`, at most {@link MAX_STORYLINE_NAME} characters. */
export const validStorylineName = (name: string): boolean => /^[^\s#!?@][^\s#]*$/u.test(name) && !/^if\?$/iu.test(name) && [...name].length <= MAX_STORYLINE_NAME;

/** The storyline tag at the end of a message, if any. */
export function parseStorylineTag(text: string): StorylineTag | null {
  const m = TAG_RE.exec(text);
  if (!m) return null;
  const raw = m[2]!;
  const ifLine = /^if\?$/iu.test(raw);
  const form: StorylineTagForm = raw === '' ? 'recent' : raw === '?' || ifLine ? 'new' : 'name';
  if (form === 'name' && !validStorylineName(raw)) return null;
  const switchMain = m[1] === '!';
  if (switchMain && ifLine) return null;
  const at = m.index;
  return { form, name: form === 'name' ? raw : '', switchMain, hide: m[1] === '@', ifLine, at, text: text.slice(0, at).trimEnd() };
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

/** Replaces the written tag in place (`#` → `#name`, `#@` → `#@name`, keeping the text and spacing before it); `''` removes it. */
export function replaceStorylineTag(text: string, tag: StorylineTag, name: string): string {
  if (!name) return tag.text;
  return `${text.slice(0, tag.at)}#${tag.switchMain ? '!' : tag.hide ? '@' : ''}${name}`;
}

/**
 * A storyline name from free text (a name the AI chose): trimmed, leading `#` `!` `?` and quotes
 * dropped, whitespace → `_`, `#` removed, at most {@link MAX_STORYLINE_NAME} characters. `''` if nothing is left.
 */
export function storylineNameFrom(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  let s = raw.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, '').trim();
  s = s.replace(/^[#!?@\s]+/u, '').replace(/#/g, '').replace(/\s+/gu, '_').replace(/_+$/u, '');
  const out = [...s].slice(0, MAX_STORYLINE_NAME).join('');
  return validStorylineName(out) ? out : '';
}

/** `name`, or `name-2`, `name-3` … — the first one not in `taken`. */
export function uniqueStorylineName(name: string, taken: ReadonlySet<string>): string {
  if (!taken.has(name)) return name;
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const cut = [...name].slice(0, MAX_STORYLINE_NAME - suffix.length).join('');
    if (!taken.has(cut + suffix)) return cut + suffix;
  }
}

/** Sub-fields of the `storyline` structure the AI fills this turn (none: the structure is not requested). */
export function storylineNamingFields(v: Pick<StorylineVars, 'naming' | 'namingMain'> | undefined): ('name' | 'previous_main')[] {
  if (!v) return [];
  return [...(v.naming ? (['name'] as const) : []), ...(v.namingMain ? (['previous_main'] as const) : [])];
}

/** Names starting with `if` are if-lines unless the user decided otherwise. */
export const isIfName = (name: string): boolean => /^if/i.test(name);

/** Separator text of a storyline group: `{{storyline}}` is replaced after macro expansion (names are literal). */
export function storylineSeparator(template: string, name: string, expand: (s: string) => string = (s) => s): string {
  const SLOT = '\u0000ap-storyline\u0000';
  return expand(template.replaceAll('{{storyline}}', SLOT)).replaceAll(SLOT, () => name);
}

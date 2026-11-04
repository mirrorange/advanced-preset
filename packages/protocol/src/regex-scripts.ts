/**
 * SillyTavern regex scripts a preset ships (`regex-scripts/`). They are stored exactly as ST's regex
 * extension stores them (`RegexScriptData`) and written into the Carrier's
 * `extensions.regex_scripts`, where ST runs them as preset-scoped scripts while the Carrier is
 * selected (after the user allows them, as for any preset with embedded scripts).
 */

/** First Advanced Preset version that writes the preset's regex scripts into the Carrier. */
export const REGEX_SCRIPTS_SINCE = '1.10.0';

/** Where a script applies (ST `regex_placement`); the source accepts the names or the numbers. */
export const REGEX_PLACEMENTS = {
  'user-input': 1,
  'ai-output': 2,
  'slash-command': 3,
  'world-info': 5,
  reasoning: 6,
} as const;
export type RegexPlacementName = keyof typeof REGEX_PLACEMENTS;

/** How macros are substituted in `findRegex` (ST `substitute_find_regex`). */
export const REGEX_SUBSTITUTE = { none: 0, raw: 1, escaped: 2 } as const;
export type RegexSubstituteName = keyof typeof REGEX_SUBSTITUTE;

/** ST's `RegexScriptData`. */
export interface RegexScript {
  /** UUID (stable per preset and source file, so ST's regex presets keep track of the script). */
  id: string;
  scriptName: string;
  /** `/pattern/flags` or a bare pattern, as in ST's editor. */
  findRegex: string;
  replaceString: string;
  trimStrings: string[];
  placement: number[];
  disabled: boolean;
  /** Only alter the chat display. */
  markdownOnly: boolean;
  /** Only alter the outgoing prompt. */
  promptOnly: boolean;
  runOnEdit: boolean;
  substituteRegex: number;
  minDepth: number | null;
  maxDepth: number | null;
}

/** ST's `regexFromString`: `/pattern/flags` or a bare pattern; `undefined` when it does not compile. */
export function regexFromString(input: string): RegExp | undefined {
  try {
    const m = /(\/?)(.+)\1([a-z]*)/i.exec(input);
    if (!m) return new RegExp(input);
    if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) return new RegExp(input);
    return new RegExp(m[2]!, m[3]);
  } catch {
    return undefined;
  }
}

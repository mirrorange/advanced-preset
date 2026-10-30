/**
 * Input shaping (I-128 – I-131): a preset-level prompt-structure feature. When the last message of
 * the chat history is the user's, the preset either wraps that message in place (`wrap`, e.g. in an
 * `<input>` tag that post-history instructions can refer to) or takes it out of the history
 * (`extract`) so that `{{ap::input::text}}` can place it elsewhere. Users have no switch for it.
 */

export type InputShapingMode = 'wrap' | 'extract';
export const INPUT_SHAPING_MODES: readonly InputShapingMode[] = ['wrap', 'extract'];

export interface InputShaping {
  mode: InputShapingMode;
  /** `wrap`: replacement of the input text in the history; `{{content}}` is the text, macros are expanded. */
  template: string;
}

/** Default `wrap` template. */
export const DEFAULT_INPUT_TEMPLATE = '<input>\n{{content}}\n</input>';

/** First Advanced Preset version that shapes the input (older versions ignore `inputShaping`). */
export const INPUT_SHAPING_SINCE = '1.9.0';

/**
 * The wrapped input: `{{content}}` is replaced by the input text *after* `expand` (macro expansion),
 * so the user's text reaches the model as written.
 */
export function wrapInput(template: string, text: string, expand: (s: string) => string = (s) => s): string {
  const SLOT = '\u0000ap-input\u0000';
  return expand(template.replaceAll('{{content}}', SLOT)).replaceAll(SLOT, () => text);
}

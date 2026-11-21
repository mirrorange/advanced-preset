/** Speech provider registry. */
import { DEFAULT_SPEECH_TAGS } from '@advanced-preset/protocol';
import type { SpeechApi, SpeechProvider } from '../types';
import { deepseek } from './deepseek';
import { elevenlabs } from './elevenlabs';
import { fish } from './fish';
import { gemini } from './gemini';
import { minimax } from './minimax';
import { openai } from './openai';

const PROVIDERS: Partial<Record<SpeechApi, SpeechProvider>> = { fish, elevenlabs, minimax, gemini, openai, deepseek };

export const SPEECH_APIS: SpeechApi[] = ['fish', 'elevenlabs', 'minimax', 'gemini', 'openai', 'deepseek'];

export function speechProvider(api: SpeechApi): SpeechProvider | undefined {
  return PROVIDERS[api];
}

/** `{{ap::speech::format}}` for an endpoint type ('' when it has no inline tags). */
export const speechFormat = (api: SpeechApi | '') => (api && PROVIDERS[api]?.format) || '';

/** Inline markup removed from speech text for display (null: nothing to remove). */
export const speechTags = (api: SpeechApi | '') => (api && PROVIDERS[api]?.tags) || null;

const global = (re: RegExp) => (re.global ? re : new RegExp(re.source, `${re.flags}g`));

/**
 * A line as `api` should speak it: the provider's own tags are kept, tags of other providers (the
 * line may have been written for another API) are removed; without a tag syntax, the clean line.
 */
export function speakableLine(api: SpeechApi, text: string, quote: string): string {
  const own = speechTags(api);
  if (!own || text === quote) return own ? text : quote;
  const mine = new RegExp(`^(?:${own.source})$`, own.flags.replace('g', ''));
  let out = text;
  for (const re of [DEFAULT_SPEECH_TAGS, ...Object.values(PROVIDERS).map((p) => p.tags)]) {
    if (!re || re === own) continue;
    out = out.replace(global(re), (m) => (mine.test(m) ? m : ''));
  }
  return out === text ? text : out.replace(/[ \t]{2,}/g, ' ').trim();
}

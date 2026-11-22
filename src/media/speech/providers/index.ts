/** Speech provider registry. */
import { DEFAULT_SPEECH_TAGS } from '@advanced-preset/protocol';
import type { SpeechApi, SpeechConnection, SpeechProvider } from '../types';
import { deepseek } from './deepseek';
import { elevenlabs } from './elevenlabs';
import { fish } from './fish';
import { gemini } from './gemini';
import { minimax } from './minimax';
import { openai } from './openai';
import { openrouter } from './openrouter';

const PROVIDERS: Partial<Record<SpeechApi, SpeechProvider>> = { fish, elevenlabs, minimax, gemini, openai, deepseek, openrouter };

export function speechProvider(api: SpeechApi): SpeechProvider | undefined {
  return PROVIDERS[api];
}

/** The model a connection uses. */
export type SpeechModelRef = Pick<SpeechConnection, 'api' | 'model'>;

/** The provider of a connection, with the capabilities of its model (format, tags, voices, cloning). */
export function providerFor(conn: SpeechModelRef): SpeechProvider | undefined {
  const p = PROVIDERS[conn.api];
  return p?.forModel ? { ...p, ...p.forModel(conn.model || p.defaults.model) } : p;
}

/** `{{ap::speech::format}}` for a connection ('' when its model has no inline tags). */
export const speechFormat = (conn: SpeechModelRef | undefined) => (conn && providerFor(conn)?.format) || '';

/** Inline markup removed from speech text for display (null: nothing to remove). */
export const speechTags = (conn: SpeechModelRef | undefined) => (conn && providerFor(conn)?.tags) || null;

const global = (re: RegExp) => (re.global ? re : new RegExp(re.source, `${re.flags}g`));

/**
 * A line as the connection's model should speak it: its own tags are kept, tags of other providers
 * (the line may have been written for another API) are removed; without a tag syntax, the clean line.
 */
export function speakableLine(conn: SpeechModelRef, text: string, quote: string): string {
  const own = speechTags(conn);
  if (!own || text === quote) return own ? text : quote;
  const mine = new RegExp(`^(?:${own.source})$`, own.flags.replace('g', ''));
  let out = text;
  for (const re of [DEFAULT_SPEECH_TAGS, ...Object.values(PROVIDERS).map((p) => p.tags)]) {
    if (!re || re === own) continue;
    out = out.replace(global(re), (m) => (mine.test(m) ? m : ''));
  }
  return out === text ? text : out.replace(/[ \t]{2,}/g, ' ').trim();
}

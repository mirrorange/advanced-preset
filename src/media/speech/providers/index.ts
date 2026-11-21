/** Speech provider registry. */
import type { SpeechApi, SpeechProvider } from '../types';
import { elevenlabs } from './elevenlabs';
import { fish } from './fish';
import { openai } from './openai';

const PROVIDERS: Partial<Record<SpeechApi, SpeechProvider>> = { fish, elevenlabs, openai };

export const SPEECH_APIS: SpeechApi[] = ['fish', 'elevenlabs', 'minimax', 'gemini', 'openai', 'deepseek'];

export function speechProvider(api: SpeechApi): SpeechProvider | undefined {
  return PROVIDERS[api];
}

/** `{{ap::speech::format}}` for an endpoint type ('' when it has no inline tags). */
export const speechFormat = (api: SpeechApi | '') => (api && PROVIDERS[api]?.format) || '';

/** Inline markup removed from speech text for display (null: nothing to remove). */
export const speechTags = (api: SpeechApi | '') => (api && PROVIDERS[api]?.tags) || null;

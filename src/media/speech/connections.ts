/** Speech connections: new ones and API switches (defaults come from the providers). */
import { newId } from '@/store/media';
import { speechProvider } from './providers';
import type { SpeechApi, SpeechConnection } from './types';

export function newSpeechConnection(api: SpeechApi, name: string): SpeechConnection {
  const d = speechProvider(api)?.defaults;
  return { id: newId(), name, api, baseUrl: d?.baseUrl ?? '', apiKey: '', model: d?.model ?? '', headers: {}, body: '', voice: null, narrator: null, bindings: [] };
}

/** Switch a speech connection to another API; voices belong to one API and are cleared (characters stay). */
export function changeSpeechApi(c: SpeechConnection, api: SpeechApi): void {
  if (c.api === api) return;
  const from = speechProvider(c.api)?.defaults;
  const to = speechProvider(api)?.defaults;
  if (!c.baseUrl || c.baseUrl === from?.baseUrl) c.baseUrl = to?.baseUrl ?? '';
  if (!c.model || c.model === from?.model) c.model = to?.model ?? '';
  c.api = api;
  c.voice = null;
  c.narrator = null;
  c.bindings = c.bindings.map((b) => ({ character: b.character, voice: null }));
}

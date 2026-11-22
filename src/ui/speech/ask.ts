/** The voice dialog: asked before synthesizing lines of a character without a voice (one request at a time). */
import { reactive } from 'vue';
import { setVoiceAsker, type VoiceAsker } from '@/media/speech/service';
import type { ChatCard } from '@/st/cards';
import type { SpeechConnection, VoiceRef } from '@/media/speech/types';
import { defineHost } from '../host';
import VoiceAsk from './VoiceAsk.vue';

export interface VoiceRequest {
  conn: SpeechConnection;
  character: string;
  cards: ChatCard[];
  done(answer: { voice: VoiceRef; card?: string } | null): void;
}

export const voiceAsk = reactive({ request: null as VoiceRequest | null });

const ask: VoiceAsker = (conn, character, cards) => {
  if (!document.querySelector('ap-voice-ask')) document.body.append(document.createElement('ap-voice-ask'));
  return new Promise((resolve) => {
    voiceAsk.request = { conn, character, cards, done: (a) => { voiceAsk.request = null; resolve(a); } };
  });
};

export function installVoiceAsk(): void {
  defineHost('ap-voice-ask', VoiceAsk);
  setVoiceAsker(ask);
}

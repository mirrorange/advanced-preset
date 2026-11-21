import { describe, expect, it } from 'vitest';
import { computed, effect } from 'vue';

(globalThis as any).SillyTavern = { getContext: () => ({ extensionSettings: { advancedPreset: { media: { cors: { mode: 'on' }, image: null } } }, saveSettingsDebounced: () => {} }) };
const { mediaSettings } = await import('@/store/media');

describe('media settings', () => {
  it('fills in defaults once and keeps the sections stable (no render loop)', () => {
    const m = mediaSettings();
    expect(m.cors).toEqual({ mode: 'on', proxy: 'host', customUrl: '' });
    expect(m.image.connections).toEqual([]);
    expect(mediaSettings().cors).toBe(mediaSettings().cors);
    const cors = computed(() => mediaSettings().cors);
    let runs = 0;
    effect(() => { void cors.value.mode; runs++; });
    void mediaSettings();
    void cors.value;
    expect(runs).toBe(1);
  });
});

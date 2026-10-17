/** Panel helpers: the active preset, its effective configuration and a single write path. */
import { computed } from 'vue';
import type { Configuration } from '@advanced-preset/protocol';
import { activeConfiguration, updateConfiguration } from '@/store/config';
import { pushSampling } from '@/store/carrier';
import { activePreset } from '../state';

let timer: ReturnType<typeof setTimeout> | undefined;

export function usePreset() {
  const preset = activePreset;
  const config = computed(() => (preset.value ? activeConfiguration(preset.value) : null));
  function update(mutate: (c: Configuration) => void, opts: { sampling?: boolean } = {}) {
    const p = preset.value;
    if (!p) return;
    updateConfiguration(p, mutate);
    if (opts.sampling) {
      clearTimeout(timer);
      timer = setTimeout(() => void pushSampling(p), 400);
    }
  }
  return { preset, config, update };
}

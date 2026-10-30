/**
 * `ap dev` source (§18.3): polls the dev server and hot-swaps its preset as a "dev" entry; the
 * Carrier is rebuilt whenever the artifact hash changes.
 */
import { reactive, watch } from 'vue';
import type { APreset } from '@advanced-preset/protocol';
import { nativeFetch } from '@/st/host';
import { settings } from '@/store/settings';
import { setDevPreset, toArtifact } from '@/store/presets';
import { migratePresetState } from '@/store/config';
import { ensureCarrier } from '@/store/carrier';
import { debugLog } from '@/core/debug';
import { syncBundledModules } from './bundled-modules';

export const devSource = reactive({
  status: 'off' as 'off' | 'connecting' | 'online' | 'error',
  presetId: '' as string,
  hash: '' as string,
  error: '' as string,
  at: 0,
});

const INTERVAL_MS = 1500;
let timer: ReturnType<typeof setTimeout> | null = null;

async function poll(): Promise<void> {
  const { url, enabled } = settings().dev;
  if (!enabled || !url) return;
  const base = url.replace(/\/+$/, '');
  try {
    const head = (await (await nativeFetch(`${base}/`, { cache: 'no-store' })).json()) as { id?: string; hash?: string; ok?: boolean; errors?: unknown };
    devSource.status = 'online';
    devSource.error = head.ok === false ? 'build failed' : '';
    devSource.at = Date.now();
    if (!head.hash || head.hash === devSource.hash) return;
    const artifact = toArtifact(await (await nativeFetch(`${base}/preset`, { cache: 'no-store' })).json());
    if (!artifact) throw new Error('not an Advanced Preset artifact');
    if (devSource.presetId && devSource.presetId !== artifact.id) setDevPreset(null, devSource.presetId);
    setDevPreset(artifact);
    devSource.presetId = artifact.id;
    devSource.hash = artifact.hash;
    migratePresetState(artifact);
    await ensureCarrier(artifact);
    void syncBundledModules(artifact, { auto: true });
    debugLog('dev', { id: artifact.id, version: artifact.version, hash: artifact.hash });
  } catch (e) {
    devSource.status = 'error';
    devSource.error = e instanceof Error ? e.message : String(e);
  }
}

function schedule(): void {
  if (timer) clearTimeout(timer);
  timer = null;
  if (!settings().dev.enabled) {
    if (devSource.presetId) setDevPreset(null, devSource.presetId);
    Object.assign(devSource, { status: 'off', presetId: '', hash: '', error: '' });
    return;
  }
  if (devSource.status === 'off') devSource.status = 'connecting';
  const loop = async () => { await poll(); if (settings().dev.enabled) timer = setTimeout(loop, INTERVAL_MS); };
  void loop();
}

export function startDevSource(): void {
  watch(() => [settings().dev.enabled, settings().dev.url], () => { devSource.hash = ''; schedule(); }, { immediate: true });
}

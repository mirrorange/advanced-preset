/**
 * Auto-apply updates (§17, I-16, I-35): the running bundle carries a content-derived build id; when the
 * `dist/build.json` on disk differs, reload once so the page never runs stale code. Checked at
 * APP_READY (stale browser cache), from ST's manifest `update` hook, which ST calls after updating
 * the extension from its Extensions panel (that path only toasts "Reload the page to apply updates"),
 * and after "Switch branch" in that panel, which has no hook — FetchGate reports it via
 * `onExtensionFetch`.
 *
 * A preset that needs a newer AP (`minAdvancedPreset`) makes AP update itself the same way
 * (`updateForPreset`).
 */
import { extensionBaseUrl, extensionId, nativeFetch, st, toast } from '@/st/host';
import { t } from '@/i18n';

const GUARD = 'advancedPreset.reloadedFor';

async function diskBuildId(): Promise<string | null> {
  try {
    const r = await nativeFetch(`${extensionBaseUrl()}dist/build.json?t=${Date.now()}`, { cache: 'no-store' });
    return r.ok ? ((await r.json()) as { id?: string }).id ?? null : null;
  } catch {
    return null;
  }
}

function reload(id: string) {
  sessionStorage.setItem(GUARD, id);
  toast('info', t('update.reloading'));
  setTimeout(() => location.reload(), 3000);
}

/** Called after APP_READY. */
export async function checkStaleBundle(): Promise<void> {
  const id = await diskBuildId();
  if (!id || id === __AP_BUILD_ID__ || sessionStorage.getItem(GUARD) === id) return;
  reload(id);
}

/**
 * ST manifest hook (`hooks.update`): ST imports `dist/index.js` — the already-running module — and
 * calls this after a successful git pull. Must settle within ST's 5 s hook timeout.
 */
export async function onExtensionUpdated(): Promise<void> {
  await checkStaleBundle();
}

const SWITCH_URL = '/api/extensions/switch';
const bareName = (name: string) => name.replace(/^third-party/, '').replace(/^\/+|\/+$/g, '');

/**
 * FetchGate pass-through observer: after ST's Extensions panel switched *this* extension's branch
 * (POST `/api/extensions/switch` → git checkout on the server), reload if the bundle changed.
 */
export function onExtensionFetch(url: string, init: RequestInit, response: Response): void {
  if (!response.ok || typeof init.body !== 'string') return;
  let name: unknown;
  try {
    if (new URL(url, location.href).pathname !== SWITCH_URL) return;
    name = (JSON.parse(init.body) as { extensionName?: unknown }).extensionName;
  } catch { return; }
  if (typeof name === 'string' && bareName(name) === bareName(extensionId())) void checkStaleBundle();
}

/** git pull through ST; reload when the bundle on disk changed (`reloading`). */
async function pull(): Promise<{ upToDate: boolean; reloading: boolean }> {
  const extensionName = extensionId().replace(/^third-party\//, '');
  // ST keeps the local/global type private; try the user folder first, then the global one.
  let r = await post(extensionName, false);
  if (r.status === 404) r = await post(extensionName, true);
  if (!r.ok) throw new Error((await r.text()) || r.statusText);
  const data = (await r.json()) as { isUpToDate?: boolean };
  const disk = await diskBuildId();
  if (disk && disk !== __AP_BUILD_ID__) { reload(disk); return { upToDate: false, reloading: true }; }
  return { upToDate: Boolean(data.isUpToDate), reloading: false };
}

/** Panel "check for updates": git pull through ST, then reload if the bundle changed. */
export async function updateExtension(): Promise<'updated' | 'current'> {
  const r = await pull();
  return r.reloading || !r.upToDate ? 'updated' : 'current';
}

const TRIED = 'advancedPreset.selfUpdateFor';

/**
 * A preset needs Advanced Preset `required` or newer: update AP (once per browser session for this
 * AP version and requirement, so a release that is still too old does not reload the page again and
 * again). `true` when the page reloads into the new bundle.
 */
export async function updateForPreset(required: string, preset: string): Promise<boolean> {
  const key = `${__AP_VERSION__}>${required}`;
  if (sessionStorage.getItem(TRIED) === key) return false;
  sessionStorage.setItem(TRIED, key);
  toast('info', t('update.forPreset', { name: preset, version: required }));
  try {
    return (await pull()).reloading;
  } catch (e) {
    console.warn('[AP] self-update failed', e);
    return false;
  }
}

const post = (extensionName: string, global: boolean) =>
  nativeFetch('/api/extensions/update', { method: 'POST', headers: st().getRequestHeaders(), body: JSON.stringify({ extensionName, global }) });

/**
 * Auto-apply updates (§17, I-16): the running bundle carries a content-derived build id; when the
 * `dist/build.json` on disk differs (ST updated the extension at startup or the user did manually),
 * reload once so the page never runs stale code.
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

/** Panel "check for updates": git pull through ST, then reload if the bundle changed. */
export async function updateExtension(): Promise<'updated' | 'current'> {
  const extensionName = extensionId().replace(/^third-party\//, '');
  // ST keeps the local/global type private; try the user folder first, then the global one.
  let r = await post(extensionName, false);
  if (r.status === 404) r = await post(extensionName, true);
  if (!r.ok) throw new Error((await r.text()) || r.statusText);
  const data = (await r.json()) as { isUpToDate?: boolean };
  const disk = await diskBuildId();
  if (disk && disk !== __AP_BUILD_ID__) { reload(disk); return 'updated'; }
  return data.isUpToDate ? 'current' : 'updated';
}

const post = (extensionName: string, global: boolean) =>
  nativeFetch('/api/extensions/update', { method: 'POST', headers: st().getRequestHeaders(), body: JSON.stringify({ extensionName, global }) });

/**
 * Preset file (`<id>.apreset.json`, I-170): a standard SillyTavern Chat Completion preset in the
 * shape of a Carrier, with the whole AP artifact in `extensions.advanced_preset_file`. ST imports it
 * as an ordinary preset whether or not Advanced Preset is installed:
 *
 * - without AP, its prompts are the Carrier's with the region anchors switched off, plus a notice
 *   that asks the model to guide the user to install AP; the optional installer is a Tavern Helper
 *   script that installs or updates AP from one of the mirrors;
 * - with AP, the file is installed as an AP preset (on import, or when AP finds it among ST's
 *   presets) and replaced by a Carrier built from the artifact, without the notice and installer.
 *
 * A bare artifact (the format before 1.10.0) is still accepted wherever a preset file is read.
 */
import { compareVersions } from './semver';
import { TAVERN_HELPER_FIELD, type TavernHelperScript } from './tavern-helper';
import type { APreset } from './types';

/** First Advanced Preset version that reads preset files (older ones only read bare artifacts). */
export const PRESET_FILE_SINCE = '1.10.0';
/** Key of the ST preset's `extensions` holding the AP data. */
export const PRESET_FILE_FIELD = 'advanced_preset_file';
export const PRESET_FILE_FORMAT = 1;

/** Where Advanced Preset can be installed from, tried in order. */
export const AP_MIRRORS = [
  'https://github.com/mirrorange/advanced-preset',
  'https://gitlab.com/mirrorange/advanced-preset',
  'https://codeberg.org/mirrorange/advanced-preset',
] as const;

/** A preset's `updateUrl`: an absolute http(s) URL. */
export const isUpdateUrl = (u: unknown): u is string => typeof u === 'string' && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(u.trim());

/** Identifier of the notice prompt; its content starts with the marker, which AP removes from prompts. */
export const INSTALL_NOTICE_ID = 'ap_install_notice';
export const INSTALL_NOTICE_MARK = '⟦ap:install-notice⟧';
/** Fixed id of the installer script, so AP can tell it from the preset's and the user's scripts. */
export const INSTALLER_SCRIPT_ID = '6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3';

export interface PresetFileData {
  format: number;
  artifact: APreset;
}

export interface PresetFileOptions {
  /** Add the Tavern Helper installer script (default true). */
  installer?: boolean;
  /** ST sampling fields of the preset (normally the default configuration's). */
  sampling?: Record<string, unknown>;
}

type Obj = Record<string, any>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/** The AP data of a preset file (`undefined` for anything else, including bare artifacts). */
export function presetFileData(raw: unknown): { format: unknown; artifact: unknown } | undefined {
  const data = isObj(raw) && isObj(raw.extensions) ? raw.extensions[PRESET_FILE_FIELD] : undefined;
  return isObj(data) && isObj(data.artifact) ? { format: data.format, artifact: data.artifact } : undefined;
}

export const isPresetFile = (raw: unknown): boolean => presetFileData(raw) !== undefined;

/** The artifact inside a preset file, or the value itself (a bare artifact or anything else). */
export function unwrapPresetFile(raw: unknown): unknown {
  return presetFileData(raw)?.artifact ?? raw;
}

/** Advanced Preset version the file needs: the preset's own requirement, and at least the one that reads preset files. */
export function requiredAdvancedPreset(artifact: Pick<APreset, 'minAdvancedPreset'>): string {
  const min = artifact.minAdvancedPreset;
  return min && compareVersions(min, PRESET_FILE_SINCE) > 0 ? min : PRESET_FILE_SINCE;
}

const anchor = (content: unknown) => typeof content === 'string' && content.includes('⟦ap:region:');

/** The prompt that stands in for the preset while AP is not installed. */
export function installNotice(artifact: Pick<APreset, 'name' | 'version'>): string {
  return `${INSTALL_NOTICE_MARK}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${artifact.name}" ${artifact.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${AP_MIRRORS.map((u) => `   - ${u}`).join('\n')}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}

/** Tavern Helper script that installs or updates Advanced Preset (see `installerSource`). */
export function installerScript(artifact: Pick<APreset, 'name' | 'minAdvancedPreset'>): TavernHelperScript {
  return {
    type: 'script',
    enabled: true,
    name: 'Advanced Preset Installer',
    id: INSTALLER_SCRIPT_ID,
    content: installerSource(artifact.name, requiredAdvancedPreset(artifact)),
    info: `This preset ("${artifact.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${AP_MIRRORS.join('\n')}\nIt does nothing once Advanced Preset ${requiredAdvancedPreset(artifact)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${requiredAdvancedPreset(artifact)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
    button: { enabled: false, buttons: [] },
    data: {},
    export_with: { data: true, button: true },
  };
}

/**
 * Build a preset file. The prompts are the Carrier's with AP's region anchors disabled (their
 * contents would only reach the model as markers) and the notice appended; AP rebuilds the Carrier
 * from the artifact when it takes the file over.
 */
export function presetFile(artifact: APreset, o: PresetFileOptions = {}): Record<string, unknown> {
  const prompts = artifact.carrier.prompts.map((p) => ({ ...p }));
  const regionIds = new Set(prompts.filter((p) => anchor(p.content)).map((p) => p.identifier));
  prompts.push({
    identifier: INSTALL_NOTICE_ID,
    name: 'Advanced Preset · install notice',
    role: 'system',
    content: installNotice(artifact),
    system_prompt: false,
    marker: false,
    injection_position: 0,
    injection_depth: 4,
    forbid_overrides: true,
  });
  const order = [
    ...artifact.carrier.prompt_order.map((x) => ({ ...x, enabled: x.enabled && !regionIds.has(x.identifier) })),
    { identifier: INSTALL_NOTICE_ID, enabled: true },
  ];
  const data: PresetFileData = { format: PRESET_FILE_FORMAT, artifact };
  return {
    ...(o.sampling ?? {}),
    prompts,
    prompt_order: [100000, 100001].map((character_id) => ({ character_id, order: order.map((x) => ({ ...x })) })),
    extensions: {
      ...(o.installer === false ? {} : { [TAVERN_HELPER_FIELD]: { scripts: [installerScript(artifact)], variables: {} } }),
      [PRESET_FILE_FIELD]: data,
    },
  };
}

/**
 * Source of the installer. It runs in Tavern Helper's script iframe (a module script) and works on
 * the page around it: SillyTavern's context, its extension endpoints and `window.AdvancedPreset`.
 *
 * 1. Advanced Preset `required` or newer is running: nothing to do (it takes the preset over).
 * 2. An older AP is running: offer `AdvancedPreset.update()` (it reloads when the bundle changed).
 * 3. AP is installed but not running: enable it when disabled, otherwise update it; then reload.
 * 4. Not installed: offer to install it, trying each mirror in turn; then offer to reload.
 * If every attempt fails, the user is asked to check the network or to install AP by hand.
 * A "later" answer is remembered for the browser session.
 */
export function installerSource(presetName: string, required: string): string {
  const json = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');
  return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${required} or newer is running.
const PRESET = ${json(presetName)};
const REQUIRED = ${json(required)};
const MIRRORS = ${json(AP_MIRRORS)};
const FOLDER = 'advanced-preset';
const EXTENSION = 'third-party/' + FOLDER;
const LATER_KEY = 'advancedPreset.installer.later';
const host = window.parent && window.parent.SillyTavern ? window.parent : window;
const ctx = () => host.SillyTavern.getContext();

const locale = String((ctx().getCurrentLocale && ctx().getCurrentLocale()) || host.localStorage.getItem('language') || host.navigator.language || '').toLowerCase();
const zh = locale.startsWith('zh');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const list = '<ul style="text-align:start;word-break:break-all">' + MIRRORS.map((u) => '<li><code>' + esc(u) + '</code></li>').join('') + '</ul>';
const T = zh ? {
  title: 'Advanced Preset',
  install: '<h3>需要 Advanced Preset 插件</h3><p>预设「' + esc(PRESET) + '」需要 Advanced Preset 插件才能使用，当前尚未安装。</p><p>是否现在安装？将依次尝试以下地址：</p>' + list,
  update: (v) => '<h3>需要更新 Advanced Preset</h3><p>预设「' + esc(PRESET) + '」需要 Advanced Preset ' + esc(REQUIRED) + ' 或更新版本' + (v ? '（当前为 ' + esc(v) + '）' : '') + '。</p><p>是否现在更新？</p>',
  enable: '<h3>Advanced Preset 已停用</h3><p>预设「' + esc(PRESET) + '」需要 Advanced Preset 插件，它已安装但处于停用状态。</p><p>是否启用并重新加载页面？</p>',
  installOk: '安装', updateOk: '更新', enableOk: '启用并重新加载', later: '稍后',
  trying: (u) => '正在从 ' + u + ' 安装 Advanced Preset……',
  updating: '正在更新 Advanced Preset……',
  done: '<h3>Advanced Preset 已就绪</h3><p>重新加载页面后插件即会生效，并自动接管预设「' + esc(PRESET) + '」。</p><p>是否现在重新加载？</p>',
  reloadOk: '重新加载',
  stillOld: (v) => '已是可获取的最新版本（' + esc(v) + '），但预设需要 ' + esc(REQUIRED) + ' 或更新版本。请稍后再试，或手动更新 Advanced Preset。',
  failed: '<h3>无法安装 Advanced Preset</h3><p>所有地址都安装失败。请检查网络连接后重新加载页面重试，或尝试手动安装 Advanced Preset 插件：</p><ol style="text-align:start"><li>打开「扩展」面板（顶栏的积木图标），点击「安装扩展」；</li><li>粘贴以下任一地址并安装：' + list + '</li><li>重新加载页面。</li></ol>',
} : {
  title: 'Advanced Preset',
  install: '<h3>Advanced Preset is required</h3><p>The preset "' + esc(PRESET) + '" needs the Advanced Preset extension, which is not installed.</p><p>Install it now? These addresses are tried in turn:</p>' + list,
  update: (v) => '<h3>Advanced Preset needs an update</h3><p>The preset "' + esc(PRESET) + '" needs Advanced Preset ' + esc(REQUIRED) + ' or newer' + (v ? ' (installed: ' + esc(v) + ')' : '') + '.</p><p>Update it now?</p>',
  enable: '<h3>Advanced Preset is disabled</h3><p>The preset "' + esc(PRESET) + '" needs the Advanced Preset extension, which is installed but disabled.</p><p>Enable it and reload the page?</p>',
  installOk: 'Install', updateOk: 'Update', enableOk: 'Enable and reload', later: 'Later',
  trying: (u) => 'Installing Advanced Preset from ' + u + '…',
  updating: 'Updating Advanced Preset…',
  done: '<h3>Advanced Preset is ready</h3><p>It starts once the page is reloaded and then sets up the preset "' + esc(PRESET) + '" by itself.</p><p>Reload now?</p>',
  reloadOk: 'Reload',
  stillOld: (v) => 'This is the newest version available (' + esc(v) + '), but the preset needs ' + esc(REQUIRED) + ' or newer. Try again later, or update Advanced Preset by hand.',
  failed: '<h3>Could not install Advanced Preset</h3><p>Installing failed from every address. Check your network connection and reload the page to try again, or install the Advanced Preset extension by hand:</p><ol style="text-align:start"><li>Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".</li><li>Paste one of these addresses and install:' + list + '</li><li>Reload the page.</li></ol>',
};

const toast = (kind, message) => (host.toastr || window.toastr)[kind](message, T.title);
const parse = (v) => String(v).split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
const atLeast = (v, min) => {
  const a = parse(v), b = parse(min);
  for (let i = 0; i < 3; i++) if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0);
  return true;
};
const sleep = (ms) => new Promise((r) => host.setTimeout(r, ms));
async function confirm(html, ok) {
  const c = ctx();
  return (await c.callGenericPopup(html, c.POPUP_TYPE.CONFIRM, '', { okButton: ok, cancelButton: T.later })) === c.POPUP_RESULT.AFFIRMATIVE;
}
const showFailure = () => ctx().callGenericPopup(T.failed, ctx().POPUP_TYPE.TEXT);
const post = (url, body) => host.fetch(url, { method: 'POST', headers: ctx().getRequestHeaders(), body: JSON.stringify(body) });
async function offerReload() {
  if (await confirm(T.done, T.reloadOk)) host.location.reload();
}

async function installFromMirrors() {
  for (const url of MIRRORS) {
    toast('info', T.trying(url));
    try {
      const r = await post('/api/extensions/install', { url, global: false });
      // 409: the folder exists (installed meanwhile, e.g. by another tab).
      if (r.ok || r.status === 409) return true;
      console.warn('[Advanced Preset installer]', url, r.status, await r.text().catch(() => ''));
    } catch (e) {
      console.warn('[Advanced Preset installer]', url, e);
    }
  }
  return false;
}

async function updateFolder() {
  toast('info', T.updating);
  for (const global of [false, true]) {
    try {
      const r = await post('/api/extensions/update', { extensionName: FOLDER, global });
      if (r.ok) return true;
    } catch (e) {
      console.warn('[Advanced Preset installer]', e);
    }
  }
  return false;
}

async function installedFolder() {
  try {
    const r = await host.fetch('/api/extensions/discover', { headers: ctx().getRequestHeaders() });
    const all = r.ok ? await r.json() : [];
    return Array.isArray(all) && all.some((e) => e && e.name === EXTENSION);
  } catch {
    return false;
  }
}

async function main() {
  // AP loads with the other extensions, before Tavern Helper runs scripts; wait a little anyway.
  for (let i = 0; i < 20 && !host.AdvancedPreset; i++) await sleep(250);
  const ap = host.AdvancedPreset;
  if (ap && atLeast(ap.version, REQUIRED)) return;
  if (host.sessionStorage.getItem(LATER_KEY) || host.__advancedPresetInstaller) return;
  host.__advancedPresetInstaller = true;
  const later = () => host.sessionStorage.setItem(LATER_KEY, '1');

  if (ap) {
    if (!(await confirm(T.update(ap.version), T.updateOk))) return later();
    toast('info', T.updating);
    try {
      // Reloads the page by itself when the extension changed.
      if ((await ap.update()) === 'current') toast('warning', T.stillOld(ap.version));
    } catch (e) {
      console.warn('[Advanced Preset installer]', e);
      await showFailure();
    }
    return;
  }

  if (await installedFolder()) {
    const disabled = ctx().extensionSettings && ctx().extensionSettings.disabledExtensions;
    if (Array.isArray(disabled) && disabled.includes(EXTENSION)) {
      if (!(await confirm(T.enable, T.enableOk))) return later();
      disabled.splice(disabled.indexOf(EXTENSION), 1);
      ctx().saveSettingsDebounced();
      await sleep(2000);
      host.location.reload();
      return;
    }
    // Installed but not running (too old for this SillyTavern, or broken): update it.
    if (!(await confirm(T.update(''), T.updateOk))) return later();
    if (await updateFolder()) return offerReload();
    await showFailure();
    return;
  }

  if (!(await confirm(T.install, T.installOk))) return later();
  if (await installFromMirrors()) return offerReload();
  await showFailure();
}

main().catch((e) => console.error('[Advanced Preset installer]', e));
`;
}

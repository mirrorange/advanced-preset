// Installing AP through a preset file (I-170, I-171). Needs a fresh ST *without* Advanced Preset,
// with Tavern Helper (JS-Slash-Runner) installed, the mock on :5055 and a preset file built by
// `ap build` (AP_PRESET_FILE, default /tmp/pf/petals.apreset.json). Run with AP_ABSENT=1.
//
// 1. ST imports the file as an ordinary preset; without AP the request carries the install notice
//    and no region anchors.
// 2. Tavern Helper asks to enable the preset's scripts; the installer asks to install AP and tries
//    the mirrors (GitHub is answered with 500 here, to see the next mirror used), then offers a reload.
// 3. The mirrors serve the released AP: when it is older than the file needs, the installer offers
//    the update (and reports that nothing newer is available).
// 4. AP_LOCAL (this working tree) then replaces the installed copy, as an update would: after a
//    reload AP takes the file over — its Carrier is selected, the file is gone, no notice is sent.
// AP_INSTALL_FAIL=1 answers every mirror with 500 instead and stops at the failure message.
import fs from 'node:fs';
import path from 'node:path';

const FILE = process.env.AP_PRESET_FILE || '/tmp/pf/petals.apreset.json';
const ST_DIR = process.env.ST_DIR || '/tmp/st';
const LOCAL = process.env.AP_LOCAL || new URL('../..', import.meta.url).pathname;
const MOCK_LOG = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const installed = path.join(ST_DIR, 'data/default-user/extensions/advanced-preset');

const ready = async (page, ap) => {
  await page.waitForSelector('#send_textarea', { timeout: 60000 });
  // Keep every toast (they fade out before the checks run).
  await page.evaluate(() => {
    window.__toasts = [];
    for (const k of ['info', 'success', 'warning', 'error']) {
      const f = window.toastr[k].bind(window.toastr);
      window.toastr[k] = (m, title, ...a) => { window.__toasts.push(`${k}: ${title ? `${title}: ` : ''}${m}`); return f(m, title, ...a); };
    }
  });
  await page.waitForFunction(() => SillyTavern.getContext().eventSource.autoFireLastArgs?.has('app_ready'), null, { timeout: 60000 });
  if (ap) await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 30000 });
  await page.waitForTimeout(3000);
};
const dialog = (page, re) => page.locator('dialog[open]', { hasText: re }).last();
const answer = async (page, re, ok, timeout = 20000) => {
  const d = dialog(page, re);
  await d.waitFor({ timeout });
  await d.locator(ok ? '.popup-button-ok' : '.popup-button-cancel').first().click();
  await page.waitForTimeout(800);
};
const lastRequest = () => JSON.parse(fs.readFileSync(MOCK_LOG, 'utf8').trim().split('\n').at(-1));
const send = async (page, text) => {
  const before = fs.existsSync(MOCK_LOG) ? fs.readFileSync(MOCK_LOG, 'utf8').length : 0;
  await page.fill('#send_textarea', text);
  await page.click('#send_but');
  for (let i = 0; i < 60 && (!fs.existsSync(MOCK_LOG) || fs.readFileSync(MOCK_LOG, 'utf8').length === before); i++) await page.waitForTimeout(500);
  await page.waitForTimeout(1500);
  const body = lastRequest().body;
  const all = JSON.stringify(body.messages);
  return { notice: all.includes('⟦ap:install-notice⟧'), anchors: all.includes('⟦ap:region:'), messages: body.messages.length };
};
const presets = (page) => page.evaluate(() => {
  const pm = SillyTavern.getContext().getPresetManager('openai');
  return { selected: pm.getSelectedPresetName(), names: Object.keys(pm.getPresetList().preset_names), ap: window.AdvancedPreset ? { version: window.AdvancedPreset.version, active: window.AdvancedPreset.activePresetId() } : null };
});

export default async function (page, shots) {
  const log = (k, v) => console.log(k, typeof v === 'string' ? v : JSON.stringify(v));
  fs.rmSync(installed, { recursive: true, force: true });
  // A fresh start: no preset file or Carrier from an earlier run, Tavern Helper asks again, no AP state.
  await page.evaluate(async (file) => {
    const ctx = SillyTavern.getContext();
    const pm = ctx.getPresetManager('openai');
    for (const n of Object.keys(pm.getPresetList().preset_names)) if (n === file || n.startsWith('AP ·')) await pm.deletePreset(n);
    const th = ctx.extensionSettings.tavern_helper?.script;
    if (th) for (const k of ['enabled', 'popuped']) th[k].presets = th[k].presets.filter((n) => n !== file && !n.startsWith('AP ·'));
    delete ctx.extensionSettings.advancedPreset;
    ctx.saveSettingsDebounced();
    await new Promise((r) => setTimeout(r, 1500));
  }, path.basename(FILE).replace(/\.json$/, ''));
  // Tavern Helper reads its settings at load.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, false);
  await page.evaluate(async () => {
    const $ = window.jQuery;
    $('#main_api').val('openai').trigger('change');
    $('#chat_completion_source').val('custom').trigger('change');
    $('#custom_api_url_text').val('http://127.0.0.1:5055/v1').trigger('input');
    $('#custom_model_id').val('mock-1').trigger('input');
    $('#stream_toggle').prop('checked', true).trigger('change');
    await new Promise((r) => setTimeout(r, 500));
    $('#api_button_openai').trigger('click');
    await new Promise((r) => setTimeout(r, 2000));
    document.querySelector('.character_select')?.click();
    await new Promise((r) => setTimeout(r, 2500));
    sessionStorage.removeItem('advancedPreset.installer.later');
  });
  log('AP before', await page.evaluate(() => Boolean(window.AdvancedPreset)));

  // 1. ST's own import.
  await page.setInputFiles('#openai_preset_import_file', FILE);
  await page.getByText(/嵌入式脚本|embedded scripts/i).first().waitFor({ timeout: 20000 });
  log('imported', await presets(page));
  await page.screenshot({ path: `${shots}/installer-th-ask.png` });

  // 2. Enable the scripts; answer "later" first to look at a generation without AP.
  await page.getByRole('button', { name: /^(确认|Confirm)$/ }).first().click();
  await answer(page, /Advanced Preset is required|需要 Advanced Preset 插件/, false);
  log('later remembered', await page.evaluate(() => sessionStorage.getItem('advancedPreset.installer.later')));
  log('request without AP', await send(page, 'Hello there.'));
  await page.screenshot({ path: `${shots}/installer-reply-without-ap.png` });

  // The installer runs again on reload (the "later" is cleared to ask again).
  await page.evaluate(() => sessionStorage.removeItem('advancedPreset.installer.later'));
  const tried = [];
  await page.route('**/api/extensions/install', async (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    tried.push(body.url);
    if (process.env.AP_INSTALL_FAIL || body.url.startsWith('https://github.com/')) return route.fulfill({ status: 500, body: 'simulated outage' });
    return route.continue();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, false);
  const ask = dialog(page, /Advanced Preset is required|需要 Advanced Preset 插件/);
  await ask.waitFor({ timeout: 30000 });
  await page.screenshot({ path: `${shots}/installer-ask.png` });
  await ask.locator('.popup-button-ok').click();
  const done = dialog(page, /Advanced Preset is ready|Advanced Preset 已就绪|Could not install|无法安装/);
  await done.waitFor({ timeout: 180000 });
  log('mirrors tried', tried);
  log('installed folder', fs.existsSync(path.join(installed, 'manifest.json')) && JSON.parse(fs.readFileSync(path.join(installed, 'manifest.json'), 'utf8')).version);
  await page.screenshot({ path: `${shots}/installer-done.png` });
  if (process.env.AP_INSTALL_FAIL) { log('failure shown', await dialog(page, /Could not install|无法安装/).count()); return; }
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), done.locator('.popup-button-ok').click()]);

  // 3. The released AP from the mirror.
  await ready(page, true);
  log('after install', await presets(page));
  const update = dialog(page, /needs an update|需要更新 Advanced Preset/);
  if (await update.waitFor({ timeout: 20000 }).then(() => true, () => false)) {
    log('update offered', true);
    await update.locator('.popup-button-ok').click();
    await page.waitForTimeout(8000);
    log('toasts', await page.evaluate(() => window.__toasts));
  } else log('update offered', false);

  // 4. This working tree as the update.
  fs.rmSync(installed, { recursive: true, force: true });
  fs.mkdirSync(installed);
  for (const f of ['manifest.json', 'dist', 'i18n', 'LICENSE']) fs.cpSync(path.join(LOCAL, f), path.join(installed, f), { recursive: true });
  await page.unroute('**/api/extensions/install');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page, true);
  await page.waitForTimeout(4000);
  log('Tavern Helper asks for the Carrier', await page.getByText(/嵌入式脚本|embedded scripts/i).count());
  const after = await presets(page);
  log('after update', after);
  log('file kept', after.names.includes(path.basename(FILE).replace(/\.json$/, '')));
  log('installer dialogs', await page.locator('dialog[open]', { hasText: /Advanced Preset is required|needs an update|需要 Advanced Preset|需要更新/ }).count());
  log('toasts', await page.evaluate(() => window.__toasts));
  log('Carrier Tavern Helper scripts', await page.evaluate(() => SillyTavern.getContext().chatCompletionSettings.extensions?.tavern_helper?.scripts?.map((s) => s.name) ?? null));
  await page.screenshot({ path: `${shots}/installer-adopted.png` });
  log('request with AP', await send(page, 'Mira walks to the lighthouse.'));
}

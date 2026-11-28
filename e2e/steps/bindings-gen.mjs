import fs from 'node:fs';
// Bindings on the wire: a model-name binding as the active binding sends its model (multi-model off,
// one request); AP_DEV=1 (a multiModel Petals copy on ap dev :4747): multi-model on, the editor on that
// binding with another transport — one request per phase, each with its binding's model.
// AP_BINDING_TARGET=profile: the binding targets a Connection Manager profile (custom source on the
// mock, model mock-profile) instead of a model name.
export default async function (page) {
  const dev = Boolean(process.env.AP_DEV);
  await page.evaluate(async (dev) => {
    const c = SillyTavern.getContext();
    const s = c.extensionSettings.advancedPreset;
    s.dev = dev ? { url: 'http://127.0.0.1:4747', enabled: true } : { ...s.dev, enabled: false };
    c.saveSettingsDebounced();
  }, dev);
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.AdvancedPreset && SillyTavern.getContext().eventSource.autoFireLastArgs?.has('app_ready'), null, { timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.jQuery('#api_button_openai').trigger('click'));
  await page.waitForFunction(() => SillyTavern.getContext().onlineStatus && SillyTavern.getContext().onlineStatus !== 'no_connection', null, { timeout: 15000 }).catch(() => {});
  const profile = process.env.AP_BINDING_TARGET === 'profile';
  const want = profile ? 'mock-profile' : 'mock-fast';
  await page.evaluate(({ dev, profile }) => {
    const c = SillyTavern.getContext();
    c.extensionSettings.connectionManager ??= { profiles: [], selectedProfile: null };
    if (!c.extensionSettings.connectionManager.profiles.some((p) => p.id === 'e2e-cc'))
      c.extensionSettings.connectionManager.profiles.push({ id: 'e2e-cc', name: 'E2E mock', mode: 'cc', api: 'custom', model: 'mock-profile', 'api-url': 'http://127.0.0.1:5055/v1' });
    const s = c.extensionSettings.advancedPreset;
    const id = window.AdvancedPreset.activePresetId();
    const fast = { name: 'Fast', target: profile ? { type: 'profile', profile: 'e2e-cc' } : { type: 'model', model: 'mock-fast' }, transport: 'structured' };
    s.presets[id].active.diff = dev
      ? { connection: { transport: 'plaintext', workflow: 'linear', bindings: { fast } }, multiModel: { enabled: true, actors: { editor: 'fast' } } }
      : { connection: { transport: 'structured', workflow: 'linear', bindings: { fast }, binding: 'fast' } };
  }, { dev, profile });
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 5 }));
  fs.writeFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, '');
  await page.fill('#send_textarea', 'Mira walks to the lighthouse.');
  await page.click('#send_but');
  await page.waitForTimeout(2500);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });
  await page.waitForTimeout(1500);
  const sc = await page.evaluate(() => { const c = SillyTavern.getContext().chat; const sc = c.at(-1).extra?.advanced_preset; return sc && { stages: sc.stages?.map((s) => s.id + ':' + s.status), warnings: sc.warnings, phases: sc.phases }; });
  console.log('sidecar', JSON.stringify(sc));
  const reqs = fs.readFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  console.log('requests', reqs.length, reqs.map((r) => JSON.stringify({ model: r.body.model, rf: r.body.response_format?.type ?? null, last: r.body.messages?.at(-1)?.role })).join(' '));
  if (!dev && (reqs.length !== 1 || reqs[0].body.model !== want)) throw new Error('active binding model not sent');
  if (dev && !(reqs.some((r) => r.body.model === want) && reqs.some((r) => r.body.model === 'mock-1'))) throw new Error('phases did not use their bindings');
  await page.evaluate(() => { const s = SillyTavern.getContext().extensionSettings.advancedPreset; s.presets[window.AdvancedPreset.activePresetId()].active.diff = {}; s.dev = { ...s.dev, enabled: false }; SillyTavern.getContext().saveSettingsDebounced(); });
  await page.waitForTimeout(1500);
}

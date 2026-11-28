// Connection bindings (Config → Connection): the default binding, add one with a model-name target,
// a connection profile target (a Chat Completion profile of ST's Connection Manager is listed, a Text
// Completion one is not), per-binding transport, the active binding; the Multi-model section only for
// presets that declare multiModel. AP_DEV=1: a Petals copy with `multiModel: true` served by
// `ap dev --port 4747` (the section shows, maps actors); without it the bundled preset (no section).
export default async function (page, shots) {
  const dev = Boolean(process.env.AP_DEV);
  await page.evaluate(async (dev) => {
    const c = SillyTavern.getContext();
    const s = c.extensionSettings.advancedPreset;
    s.dev = dev ? { url: 'http://127.0.0.1:4747', enabled: true } : { ...s.dev, enabled: false };
    for (const p of Object.values(s.presets ?? {})) p.active.diff = {}; // start from the recommended configuration
    c.extensionSettings.connectionManager ??= { profiles: [], selectedProfile: null };
    c.extensionSettings.connectionManager.profiles = [
      { id: 'e2e-cc', name: 'E2E mock', mode: 'cc', api: 'custom', model: 'mock-profile', 'api-url': 'http://127.0.0.1:5055/v1' },
      { id: 'e2e-tc', name: 'E2E kobold', mode: 'tc', api: 'koboldcpp' },
    ];
    c.saveSettingsDebounced();
  }, dev);
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.AdvancedPreset && SillyTavern.getContext().eventSource.autoFireLastArgs?.has('app_ready'), null, { timeout: 60000 });
  await page.waitForTimeout(4000);
  const presetId = await page.evaluate(() => window.AdvancedPreset.activePresetId());
  if (!presetId) throw new Error('no active preset (run carrier first)');

  await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(600);
  await page.locator('ap-panel .tab', { hasText: 'Config' }).click();
  await page.waitForTimeout(500);
  const conn = page.locator('ap-panel section.card', { has: page.locator('.card-title', { hasText: /^Connection$/ }) });
  const bindingSelect = conn.locator('select[aria-label="Binding"]');
  const options = () => bindingSelect.locator('option').allTextContents();
  const diff = () => page.evaluate((id) => JSON.parse(JSON.stringify(SillyTavern.getContext().extensionSettings.advancedPreset.presets[id].active.diff)), presetId);
  console.log('bindings', (await options()).join(' | '));
  if ((await options()).join() !== 'Default') throw new Error('expected only the default binding');
  const mmSection = page.locator('ap-panel section.card', { has: page.locator('.card-title', { hasText: /^Multi-model$/ }) });
  console.log('multi-model section', await mmSection.count());
  if (!dev && (await mmSection.count())) throw new Error('Multi-model shown for a preset without multiModel');
  if (dev && !(await mmSection.count())) throw new Error('Multi-model missing for a multiModel preset');
  await page.screenshot({ path: `${shots}/bindings-default.png` });

  // Add a binding: model-name target prefilled with the current model, then another model name.
  await conn.locator('button[aria-label="Add binding"]').click();
  await page.waitForTimeout(400);
  console.log('after add', (await options()).join(' | '), 'editing', await bindingSelect.inputValue());
  const modelInput = conn.locator('.field', { hasText: /^Model name/ }).locator('input');
  console.log('prefilled model', await modelInput.inputValue());
  await modelInput.fill('mock-fast');
  await modelInput.press('Tab');
  await conn.locator('.segmented button', { hasText: 'Plain text' }).first().click().catch(() => {});
  await page.waitForTimeout(400);
  let d = await diff();
  console.log('diff', JSON.stringify(d.connection));
  const id = Object.keys(d.connection?.bindings ?? {})[0];
  if (!id || d.connection.bindings[id].target.type !== 'model' || d.connection.bindings[id].target.model !== 'mock-fast') throw new Error('binding with a model target not stored');
  await page.screenshot({ path: `${shots}/bindings-model.png` });

  // Connection profile target: only the Chat Completion profile is offered.
  await conn.locator('.segmented button', { hasText: /^Profile$/ }).click();
  await page.waitForTimeout(400);
  const profiles = await conn.locator('.field', { hasText: /^Connection profile/ }).locator('option').allTextContents();
  console.log('profiles', profiles.join(' | '));
  if (profiles.join() !== 'E2E mock') throw new Error('profile list should hold only the Chat Completion profile');
  d = await diff();
  if (d.connection.bindings[id].target.profile !== 'e2e-cc') throw new Error('profile target not stored');
  await page.screenshot({ path: `${shots}/bindings-profile.png` });

  // Active binding (shown once there are two).
  const active = conn.locator('.field', { hasText: /^Active binding/ }).locator('select');
  await active.selectOption(id);
  await page.waitForTimeout(300);
  d = await diff();
  if (d.connection.binding !== id) throw new Error('active binding not stored');

  // Back to the default binding: its own transport is untouched.
  await bindingSelect.selectOption('default');
  await page.waitForTimeout(300);
  console.log('default target', await conn.locator('.segmented button[aria-checked="true"]').first().textContent());

  if (dev) {
    const mm = mmSection;
    await mm.locator('.card-head label.switch').click();
    await page.waitForTimeout(400);
    const rows = await mm.locator('.field .field-label').allTextContents();
    console.log('actors', rows.map((x) => x.trim()).join(' | '));
    if (rows.some((r) => r.includes('{{user}}') || r.trim() === 'user')) throw new Error('the user actor should not be listed');
    await mm.locator('select').last().selectOption(id);
    await page.waitForTimeout(300);
    d = await diff();
    console.log('multiModel', JSON.stringify(d.multiModel));
    if (!d.multiModel?.enabled || !Object.values(d.multiModel.actors ?? {}).includes(id)) throw new Error('multi-model mapping not stored');
    await page.screenshot({ path: `${shots}/bindings-multimodel.png` });
  }

  // Delete the binding: selection and mappings go back to the default.
  await bindingSelect.selectOption(id);
  await conn.locator('button[aria-label="Delete"]').click();
  await page.waitForTimeout(400);
  d = await diff();
  console.log('after delete', (await options()).join(' | '), JSON.stringify(d.connection ?? {}), JSON.stringify(d.multiModel ?? {}));
  if ((await options()).length !== 1) throw new Error('binding not deleted');
  if (d.connection?.binding && d.connection.binding !== 'default') throw new Error('active binding not reset');
  await page.screenshot({ path: `${shots}/bindings-deleted.png` });
  // Leave the configuration as it was.
  await page.evaluate((pid) => { const s = SillyTavern.getContext().extensionSettings.advancedPreset; s.presets[pid].active.diff = {}; s.dev = { ...s.dev, enabled: false }; SillyTavern.getContext().saveSettingsDebounced(); }, presetId);
  await page.waitForTimeout(1500);
}

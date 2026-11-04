// Regex scripts of a preset: served by `ap dev` on :4747 (a copy of Petals with regex-scripts/), they
// reach the Carrier as ST preset-scoped scripts and ST runs them once allowed.
export default async function (page, shots) {
  await page.evaluate(() => {
    const s = SillyTavern.getContext().extensionSettings.advancedPreset;
    s.dev = { url: 'http://127.0.0.1:4747', enabled: true };
    SillyTavern.getContext().saveSettingsDebounced();
  });
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.AdvancedPreset && SillyTavern.getContext().eventSource.autoFireLastArgs?.has('app_ready'), null, { timeout: 60000 });
  await page.waitForTimeout(4000);
  console.log('presets', JSON.stringify(await page.evaluate(() => window.AdvancedPreset.listPresets())));

  // Away from the Carrier and back, so ST sees a preset change with embedded scripts.
  await page.evaluate(async () => {
    const $ = window.jQuery;
    const opts = [...document.querySelectorAll('#settings_preset_openai option')];
    $('#settings_preset_openai').val(opts.find((o) => !o.textContent.startsWith('AP ·')).value).trigger('change');
    await new Promise((r) => setTimeout(r, 1500));
    $('#settings_preset_openai').val(opts.find((o) => o.textContent.startsWith('AP ·')).value).trigger('change');
  });
  await page.waitForTimeout(2000);
  const popup = page.locator('dialog .popup-button-ok:visible').first();
  console.log('allow popup', await popup.count());
  await page.screenshot({ path: `${shots}/regex-allow.png` });
  if (await popup.count()) await popup.click();
  await page.waitForTimeout(1500);

  const r = await page.evaluate(async () => {
    const engine = await import('/scripts/extensions/regex/engine.js');
    const preset = engine.getScriptsByType(engine.SCRIPT_TYPES.PRESET, { allowedOnly: true });
    return {
      active: window.AdvancedPreset.activePresetId(),
      carrier: SillyTavern.getContext().chatCompletionSettings.extensions?.regex_scripts?.map((s) => s.scriptName),
      allowed: preset.map((s) => [s.id, s.scriptName]),
      display: engine.getRegexedString('<thinking>plan</thinking>\nThe door opens.', engine.regex_placement.AI_OUTPUT, { isMarkdown: true }),
      prompt: engine.getRegexedString('<thinking>plan</thinking>\nThe door opens.', engine.regex_placement.AI_OUTPUT, { isPrompt: true }),
    };
  });
  console.log('regex', JSON.stringify(r, null, 1));

  await page.evaluate(() => {
    const s = SillyTavern.getContext().extensionSettings.advancedPreset;
    s.dev = { ...s.dev, enabled: false };
    SillyTavern.getContext().saveSettingsDebounced();
  });
  await page.waitForTimeout(1500);
}

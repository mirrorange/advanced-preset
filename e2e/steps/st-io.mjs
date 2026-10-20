// ST Chat Completion preset import / export with AP artifacts (I-70).
// AP_IO=import-ap | import-st | export
import fs from 'node:fs';
const dir = new URL('../shots/', import.meta.url).pathname;

export default async function (page, shots) {
  const mode = process.env.AP_IO || 'import-ap';
  await page.evaluate(() => { const t = document.querySelector('#leftNavDrawerIcon'); if (!document.getElementById('left-nav-panel').classList.contains('openDrawer')) t.click(); });
  await page.waitForTimeout(800);
  const state = () => page.evaluate(() => ({
    selected: SillyTavern.getContext().getPresetManager('openai').getSelectedPresetName(),
    active: window.AdvancedPreset.activePresetId(),
    panel: Boolean(document.querySelector('ap-panel')?.shadowRoot?.querySelector('.panel')),
    options: [...document.querySelectorAll('#settings_preset_openai option')].map((o) => o.textContent),
  }));
  if (mode === 'import-ap') {
    const art = JSON.parse(fs.readFileSync(new URL('../../dist/presets/petals.apreset.json', import.meta.url), 'utf8'));
    art.id = 'petals-copy'; art.name = 'Petals Copy';
    const file = `${dir}petals-copy.apreset.json`;
    fs.writeFileSync(file, JSON.stringify(art));
    await page.setInputFiles('#openai_preset_import_file', file);
    await page.waitForTimeout(3000);
    console.log(JSON.stringify(await state()));
  } else if (mode === 'import-st') {
    const file = `${dir}Plain Preset.json`;
    fs.writeFileSync(file, JSON.stringify({ temperature: 0.7, prompts: [], prompt_order: [] }));
    await page.setInputFiles('#openai_preset_import_file', file);
    await page.waitForTimeout(3000);
    console.log(JSON.stringify(await state()));
  } else if (mode === 'export') {
    for (const name of (process.env.AP_EXPORT || 'AP · Petals Preset').split('|')) {
      await page.evaluate(async (n) => { const m = SillyTavern.getContext().getPresetManager('openai'); await m.selectPreset(m.findPreset(n)); }, name);
      await page.waitForTimeout(1500);
      const dl = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      await page.click('#export_oai_preset');
      await page.waitForTimeout(800);
      // ST asks about connection data in a popup before downloading.
      const ok = page.locator('.popup .popup-button-ok:visible').first();
      if (await ok.count()) await ok.click();
      const d = await dl;
      let summary = null;
      if (d) { const p = `${dir}${d.suggestedFilename()}`; await d.saveAs(p); const j = JSON.parse(fs.readFileSync(p, 'utf8')); summary = { file: d.suggestedFilename(), id: j.id ?? null, formatVersion: j.formatVersion ?? null, prompts: Array.isArray(j.prompts) }; }
      console.log(name, '→', JSON.stringify(summary));
    }
  }
  await page.screenshot({ path: `${shots}/st-io-${mode}.png` });
}

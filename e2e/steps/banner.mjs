// Banner under ST's Chat Completion preset select (I-71) and Carrier-only buttons (I-72).
export default async function (page, shots) {
  const tag = `${process.env.AP_VIEWPORT || '1400x900'}${process.env.AP_LANG ? `-${process.env.AP_LANG}` : ''}`;
  if (process.env.AP_LANG) {
    await page.evaluate((l) => localStorage.setItem('language', l), process.env.AP_LANG);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 60000 });
    await page.waitForTimeout(3000);
  }
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(1000);
  await page.locator('#ai-config-button > .drawer-toggle').click();
  await page.waitForTimeout(800);
  const pick = (name) => page.evaluate(async (n) => {
    const m = SillyTavern.getContext().getPresetManager('openai');
    await m.selectPreset(m.findPreset(n));
    await new Promise((r) => setTimeout(r, 1200));
  }, name);
  const probe = () => page.evaluate(() => {
    const banner = document.querySelector('ap-preset-banner');
    const box = banner?.shadowRoot?.querySelector('.preset-banner');
    const vis = (sel) => { const e = document.querySelector(sel); return Boolean(e && e.offsetParent !== null); };
    return {
      banner: box ? box.textContent.trim() : null,
      afterRow: banner?.previousElementSibling?.contains(document.getElementById('settings_preset_openai')) ?? false,
      rename: vis('[data-preset-manager-rename="openai"]'), saveAs: vis('#new_oai_preset'), update: vis('#update_oai_preset'),
    };
  });
  const top = async (name) => {
    await page.evaluate(() => document.getElementById('openai_api-presets')?.scrollIntoView({ block: 'start' }));
    const el = page.locator('#openai_api-presets');
    await el.screenshot({ path: `${shots}/banner-${name}-${tag}.png` });
  };
  await pick('Default');
  console.log('default', JSON.stringify(await probe()));
  await top('plain');
  await pick('AP · Petals Preset');
  console.log('carrier', JSON.stringify(await probe()));
  await top('carrier');
  await page.locator('ap-preset-banner .btn').click();
  await page.waitForTimeout(600);
  console.log('panel open', await page.locator('ap-panel .panel-head').isVisible().catch(() => false));
  await page.screenshot({ path: `${shots}/banner-open-${tag}.png` });
}

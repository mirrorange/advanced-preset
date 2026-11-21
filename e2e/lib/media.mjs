// Shared setup of the media steps: default media settings, the dev source (a Petals copy that
// declares image / speech), its Carrier, a character, and panel helpers.
import fs from 'node:fs';

export const MOCK = new URL('../mock.json', import.meta.url).pathname;
export const LOG = new URL('../mock-requests.jsonl', import.meta.url).pathname;
export const DEV = process.env.AP_DEV_URL || 'http://127.0.0.1:4747';
export const mediaLog = () => fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.media);
export const chatLog = () => fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => !r.media);

export function helpers(page) {
  const panel = page.locator('ap-panel');
  return {
    panel,
    open: (on = true) => page.evaluate((v) => window.AdvancedPreset.togglePanel(v), on),
    tab: (title) => panel.locator(`.tab[title="${title}"]`).click(),
    section: (title) => panel.locator('.section', { has: page.locator('.card-title', { hasText: new RegExp(`^${title}$`) }) }).first(),
    field: (label, scope = panel) => scope.locator('.field', { has: page.locator('.field-label', { hasText: new RegExp(`^${label}$`) }) }).first(),
    /** Fill an input / textarea that saves on `change`. */
    async set(locator, value) { await locator.fill(value); await locator.dispatchEvent('change'); },
    async switchTo(locator, on) { if ((await locator.locator('input').isChecked()) !== on) await locator.click(); },
    waitIdle: () => page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 }),
    lastMes: () => page.locator('#chat .mes').last(),
  };
}

export async function setupMedia(page, mock = { delay: 5, media: true }) {
  fs.writeFileSync(LOG, '');
  fs.writeFileSync(MOCK, JSON.stringify(mock));
  const h = helpers(page);
  // Start from default media settings (earlier runs leave connections and switches behind).
  await page.evaluate(() => { delete SillyTavern.getContext().extensionSettings.advancedPreset.media; });
  await h.open();
  await page.waitForTimeout(400);
  if (!(await h.panel.locator('.panel-head input[role=switch]').isChecked())) await h.panel.locator('.panel-head .switch').click();
  await h.tab('Debug');
  await page.waitForTimeout(300);
  const dev = h.panel.locator('input[type=url]').first();
  if ((await dev.inputValue()) !== DEV) { await dev.fill(DEV); await dev.press('Enter'); }
  await h.switchTo(h.section('Dev source').locator('.switch').first(), true);
  await page.waitForFunction(() => window.AdvancedPreset.listPresets().some((p) => p.source === 'dev'), null, { timeout: 20000 });
  await page.evaluate(async () => {
    const $ = window.jQuery;
    const opt = [...document.querySelectorAll('#settings_preset_openai option')].find((o) => o.textContent.startsWith('AP ·'));
    $('#settings_preset_openai').val(opt.value).trigger('change');
    await new Promise((r) => setTimeout(r, 2000));
    document.querySelector('.character_select')?.click();
    await new Promise((r) => setTimeout(r, 2500));
  });
  console.log('presets', JSON.stringify(await page.evaluate(() => [window.AdvancedPreset.listPresets(), window.AdvancedPreset.activePresetId()])));
  return h;
}

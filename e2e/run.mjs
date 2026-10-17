import { chromium } from 'playwright';
const shots = new URL('shots', import.meta.url).pathname;
import fs from 'node:fs'; fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) || m.text().includes('[AP]') || m.text().includes('Advanced')) logs.push(`${m.type()}: ${m.text()}`); });
page.on('request', (r) => { if (r.url().includes('/api/presets') || r.url().includes('/api/extensions')) logs.push('REQ ' + r.method() + ' ' + r.url() + ' ' + (r.postData() || '').slice(0, 120)); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
const step = process.argv[2] || 'setup';
try {
  await page.goto(process.env.ST_URL || 'http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#send_textarea', { timeout: 60000 });
  await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 30000 });
  await page.waitForTimeout(2500);
  const onboard = page.locator('dialog .popup-button-ok:visible, .popup .popup-button-ok:visible').first();
  if (await onboard.count()) { await onboard.click(); await page.waitForTimeout(500); }
  await page.waitForFunction(() => SillyTavern.getContext().eventSource.autoFireLastArgs?.has('app_ready'), null, { timeout: 20000 });
  await page.waitForTimeout(1500);
  if (step !== 'setup') {
    await page.evaluate(() => window.jQuery('#api_button_openai').trigger('click'));
    await page.waitForFunction(() => SillyTavern.getContext().onlineStatus && SillyTavern.getContext().onlineStatus !== 'no_connection', null, { timeout: 15000 }).catch(() => {});
  }
  const mod = await import(`./steps/${step}.mjs?${Date.now()}`);
  await mod.default(page, shots);
} catch (e) { logs.push('RUN ERROR: ' + e.stack); await page.screenshot({ path: `${shots}/error.png` }).catch(() => {}); }
console.log(logs.join('\n'));
await page.close(); await browser.close(); process.exit(0);

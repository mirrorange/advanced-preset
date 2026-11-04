import { chromium } from 'playwright';
const shots = new URL('shots', import.meta.url).pathname;
import fs from 'node:fs'; fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--no-sandbox'] });
const [vw, vh] = (process.env.AP_VIEWPORT || '1400x900').split('x').map(Number);
const mobile = vw < 800;
const page = await browser.newPage({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) || m.text().includes('[AP]') || m.text().includes('Advanced')) logs.push(`${m.type()}: ${m.text()}`); });
page.on('request', (r) => { if (r.url().includes('/api/presets') || r.url().includes('/api/extensions')) logs.push('REQ ' + r.method() + ' ' + r.url() + ' ' + (r.postData() || '').slice(0, 120)); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
const step = process.argv[2] || 'setup';
// AP_CDN=<dir with node_modules>[,<Tavern Helper checkout>]: serve the jsDelivr files Tavern Helper
// loads from local copies (for sandboxes without access to the CDN).
if (process.env.AP_CDN) {
  const [modules, th] = process.env.AP_CDN.split(',');
  const { join } = await import('node:path');
  const file = (p) => [p, p.replace(/\.min\.(js|css)$/, '.$1'), p.replace(/\.prod\.min\.js$/, '.prod.js')].find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
  await page.route(/^https:\/\/(testingcf|cdn|fastly)\.jsdelivr\.net\//, (route) => {
    const u = decodeURIComponent(new URL(route.request().url()).pathname);
    let f;
    if (u.startsWith('/npm/')) {
      const rest = u.slice(5);
      const [pkg, sub] = rest.startsWith('@') ? [rest.split('/').slice(0, 2).join('/'), rest.split('/').slice(2).join('/')] : [rest.split('/')[0], rest.split('/').slice(1).join('/')];
      const dir = join(modules, 'node_modules', pkg.replace(/@[^/]*$/, ''));
      f = file(join(dir, sub || JSON.parse(fs.readFileSync(join(dir, 'package.json'), 'utf8')).main || 'index.js'));
    } else if (th && u.startsWith('/gh/N0VI028/JS-Slash-Runner/')) f = file(join(th, u.replace(/^\/gh\/N0VI028\/JS-Slash-Runner(@[^/]+)?\//, '')));
    if (!f) return route.fulfill({ status: 404, body: '' });
    route.fulfill({ status: 200, body: fs.readFileSync(f), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
  });
}
try {
  await page.goto(process.env.ST_URL || 'http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#send_textarea', { timeout: 60000 });
  // AP_ABSENT=1: steps that start without Advanced Preset installed (e.g. `installer`).
  if (!process.env.AP_ABSENT) await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 30000 });
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

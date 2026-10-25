// Cache optimization (sticky rendering): several story turns with token saving on, then compare
// consecutive requests. AP_CACHE=off sends the same turns without sticky rendering for comparison.
// Env: AP_TURNS (5), AP_KEEP (keepFullTurns, 1), AP_MAX_DEFERRED (2), AP_CACHE (on), AP_TRANSPORT (Structured), AP_REGEN (regenerate once at the end).
import fs from 'node:fs';
const MOCK = new URL('../mock.json', import.meta.url).pathname;
const LOG = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const idle = (page) => page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });

async function setNumber(page, label, value) {
  const input = page.locator('ap-panel .field', { has: page.locator('.field-label', { hasText: label }) }).locator('input').first();
  await input.fill(String(value));
  await input.dispatchEvent('change');
}
async function setSwitch(page, label, on) {
  const sw = page.locator(`ap-panel label.switch[aria-label="${label}"] input`).first();
  if ((await sw.isChecked()) !== on) await sw.click({ force: true });
}
async function cacheBadge(page, shots) {
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await page.locator('ap-panel .tab', { hasText: 'Debug' }).click();
  await page.waitForTimeout(300);
  if (!(await page.locator('ap-panel .badge', { hasText: /^Cache:/ }).count())) {
    await page.locator('ap-panel', { hasText: 'Last assembly' }).getByText('Last assembly', { exact: true }).click();
    await page.waitForTimeout(300);
  }
  const row = page.locator('ap-panel .row', { has: page.locator('.badge', { hasText: /^Cache:/ }) }).first();
  const text = (await row.count()) ? (await row.innerText()).replace(/\s+/g, ' ') : '(no cache report: ' + (await page.locator('ap-panel .badge').allInnerTexts()).join(',') + ')';
  await page.screenshot({ path: `${shots}/cache-badge.png` });
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));
  return text;
}

export default async function (page, shots) {
  const on = (process.env.AP_CACHE || 'on') !== 'off';
  const turns = Number(process.env.AP_TURNS || 5);
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(() => SillyTavern.getContext().executeSlashCommandsWithOptions('/newchat'));
  await page.waitForTimeout(2500);
  await page.evaluate(() => localStorage.removeItem('advanced-preset.cache.v1'));

  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await page.locator('ap-panel .tab', { hasText: 'Config' }).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel .segmented button', { hasText: new RegExp(`^${process.env.AP_TRANSPORT || 'Structured'}$`) }).first().click();
  await page.locator('ap-panel .tab', { hasText: 'Writing' }).click();
  await page.waitForTimeout(300);
  await setSwitch(page, 'Token saving', true);
  await page.waitForTimeout(200);
  await setNumber(page, 'Full turns kept', Number(process.env.AP_KEEP || 1));
  await setSwitch(page, 'Cache optimization', on);
  await page.waitForTimeout(200);
  if (on) {
    await setNumber(page, 'Max cache-protected turns', Number(process.env.AP_MAX_DEFERRED || 2));
    await setNumber(page, 'Cache TTL (minutes)', 5);
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${shots}/cache-settings-${on ? 'on' : 'off'}.png` });
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));

  fs.writeFileSync(MOCK, JSON.stringify({ delay: 1 }));
  fs.writeFileSync(LOG, '');
  const badges = [];
  for (let i = 0; i < turns; i++) {
    await page.fill('#send_textarea', `Turn ${i + 1}: Mira keeps walking.`);
    await page.click('#send_but');
    await page.waitForTimeout(800);
    await idle(page);
    await page.waitForTimeout(800);
    badges.push(await cacheBadge(page, shots));
  }
  if (process.env.AP_REGEN) {
    // Regenerate the last reply: same history as the previous request, the cache should still hit.
    await page.evaluate(() => { SillyTavern.getContext().generate('regenerate'); });
    await page.waitForTimeout(800);
    await idle(page);
    await page.waitForTimeout(800);
    badges.push('regenerate · ' + (await cacheBadge(page, shots)));
  }
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await page.screenshot({ path: `${shots}/cache-debug-${on ? 'on' : 'off'}.png` });
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));

  const reqs = fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l).body);
  const key = (m) => JSON.stringify([m.role, m.content, m.tool_calls ?? null]);
  const chars = (ms) => ms.reduce((n, m) => n + key(m).length, 0);
  const marks = reqs.flatMap((r) => r.messages).filter((m) => /[\uE000-\uF8FF]/.test(JSON.stringify(m.content))).length;
  console.log(`cache ${on ? 'on' : 'off'} · ${reqs.length} requests · leaked markers: ${marks}`);
  reqs.forEach((r, i) => {
    const ms = r.messages;
    let common = 0;
    if (i) { const p = reqs[i - 1].messages; while (common < Math.min(p.length, ms.length) && key(p[common]) === key(ms[common])) common++; }
    const shape = ms.map((m) => {
      const c = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      if (m.role === 'system') return '.';
      if (m.role === 'user') return 'u';
      return /^\[.*·.*\]/.test(c) ? 's' : /<synopsis>|synopsis/i.test(c) ? 'Y' : 'F';
    }).join('');
    console.log(`#${i + 1} msgs=${ms.length} commonPrefix=${common} (${i ? Math.round((100 * chars(ms.slice(0, common))) / chars(reqs[i - 1].messages)) : 0}% of previous) ${shape} | ${badges[i] ?? ''}`);
  });
}

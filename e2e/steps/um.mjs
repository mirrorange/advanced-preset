import fs from 'node:fs';
const reqFile = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const MARK = 'UM-MARKER-7f3';
const shot = async (page, shots, name) => {
  const box = await page.locator('ap-panel .panel-head').evaluate((h) => { const r = h.parentElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  await page.screenshot({ path: `${shots}/um-${name}.png`, clip: box });
};

async function openPanel(page) {
  if (!(await page.locator('ap-panel .panel-head').isVisible().catch(() => false))) {
    await page.evaluate(() => window.AdvancedPreset.togglePanel());
    await page.waitForTimeout(400);
  }
}
async function closePanel(page) {
  if (await page.locator('ap-panel .panel-head').isVisible().catch(() => false)) await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(400);
  await page.evaluate(() => { if (document.querySelector('#left-nav-panel.openDrawer')) document.getElementById('leftNavDrawerIcon')?.click(); });
  await page.waitForTimeout(600);
}
async function send(page, text) {
  fs.writeFileSync(reqFile, '');
  await page.fill('#send_textarea', text);
  await page.evaluate(() => document.getElementById('send_but').click());
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });
  await page.waitForTimeout(800);
  const reqs = fs.readFileSync(reqFile, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const msgs = reqs[0]?.body.messages ?? [];
  const i = msgs.findIndex((m) => String(m.content).includes(MARK));
  return { requests: reqs.length, hit: i, around: i >= 0 ? msgs.slice(Math.max(0, i - 1), i + 2).map((m) => `${m.role}: ${String(m.content).replace(/\s+/g, ' ').slice(-120)}`) : null };
}

export default async function (page, shots) {
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 5 }));
  if (process.env.AP_LANG) {
    await page.evaluate((l) => localStorage.setItem('language', l), process.env.AP_LANG);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 60000 });
    await page.waitForTimeout(3000);
  }
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  await openPanel(page);
  const head = page.locator('ap-panel .panel-head input[role=switch]');
  if (!(await head.isChecked())) await page.locator('ap-panel .panel-head .switch').click();
  // dev source → Petals with insertion points
  await page.locator('ap-panel .tab').nth(5).click();
  await page.waitForTimeout(300);
  const devUrl = page.locator('ap-panel input[type=text], ap-panel input[type=url]').first();
  await devUrl.fill('http://127.0.0.1:4747');
  const devSwitch = page.locator('ap-panel .panel-body input[role=switch]').first();
  if (!(await devSwitch.isChecked())) await page.locator('ap-panel .panel-body .switch').first().click();
  await page.waitForTimeout(3000);
  console.log('presets', JSON.stringify(await page.evaluate(() => window.AdvancedPreset.listPresets())));

  await page.locator('ap-panel .tab').nth(0).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel .panel-body [role=button][tabindex="0"]').first().click();
  await page.waitForTimeout(1500);
  await page.locator('ap-panel .tab').nth(2).click();
  await page.waitForTimeout(400);
  const section = page.locator('ap-panel .um-new, ap-panel .um-list').first();
  await section.scrollIntoViewIfNeeded();

  // start clean: delete leftovers from earlier runs
  while (await page.locator('ap-panel .um-list .um-open').count()) {
    await page.locator('ap-panel .um-list .um-open').first().click();
    await page.waitForTimeout(200);
    await page.locator('ap-panel .um-foot .danger').click();
    await page.locator('ap-panel .um-foot .danger').click();
    await page.waitForTimeout(300);
  }
  await shot(page, shots, '1-empty');
  await page.locator('ap-panel .um-new').click();
  await page.waitForTimeout(400);
  await page.locator('ap-panel .um-name').fill('Lighthouse lore');
  await page.locator('ap-panel .um-text').first().fill(`${MARK} The lighthouse keeper is named Oren; his lamp never goes out.`);
  await shot(page, shots, '2-editor');

  // trigger: keyword "lighthouse"
  await page.locator('ap-panel .trigger select').last().selectOption('keyword');
  await page.waitForTimeout(200);
  const chips = page.locator('ap-panel .chips-input input').first();
  await chips.fill('lighthouse');
  await chips.press('Enter');
  await chips.fill('beacon');
  await chips.press('Enter');
  await page.waitForTimeout(200);
  // second rule: transport
  await page.locator('ap-panel .trigger > label.picker select').selectOption('transport');
  await page.waitForTimeout(300);
  await page.locator('ap-panel .rule').nth(1).locator('.chip').nth(2).click();
  await page.locator('ap-panel .trigger > label.picker select').selectOption('module');
  await page.waitForTimeout(300);
  await shot(page, shots, '3-trigger');
  await page.locator('ap-panel .rule').nth(2).scrollIntoViewIfNeeded();
  await shot(page, shots, '3b-trigger');
  // remove the extra rules again
  for (const n of [2, 1]) await page.locator('ap-panel .rule').nth(n).locator('.rule-head button').last().click();
  await page.waitForTimeout(200);
  // add second entry
  await page.locator('ap-panel .um-editor button.add').first().click();
  await page.waitForTimeout(200);
  await page.locator('ap-panel .um-entry').nth(1).locator('select').first().selectOption('before-task');
  await page.locator('ap-panel .um-text').nth(1).fill('Remember the lamp.\n<!-- @if transport == "prefill" -->\nStay in prose.\n<!-- @nope -->');
  await page.waitForTimeout(300);
  await shot(page, shots, '4-two-entries');
  await page.locator('ap-panel .um-entry').nth(1).locator('.um-entry-head button').last().click();
  await page.waitForTimeout(200);
  await page.locator('ap-panel .um-head button').first().click();
  await page.waitForTimeout(400);
  await shot(page, shots, '5-list');
  console.log('stored', JSON.stringify(await page.evaluate(() => {
    const s = SillyTavern.getContext().extensionSettings.advancedPreset ?? SillyTavern.getContext().extensionSettings.advanced_preset;
    return s && Object.fromEntries(Object.entries(s.presets ?? {}).map(([k, v]) => [k, v.userModules]));
  })));
  await closePanel(page);

  console.log('with keyword', JSON.stringify(await send(page, 'Mira walks to the lighthouse.')));
  console.log('without keyword', JSON.stringify(await send(page, 'She sits down by the fire.')));
  await openPanel(page);
}

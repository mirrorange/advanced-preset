// User module updating a build variable: add a mandatory question, remove a built-in one, check the request.
import fs from 'node:fs';
const reqFile = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const MARK = 'BV-MARKER-51c';
const shot = async (page, shots, name) => {
  const box = await page.locator('ap-panel .panel-head').evaluate((h) => { const r = h.parentElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  await page.screenshot({ path: `${shots}/bv-${name}.png`, clip: box });
};
const toggle = () => document.getElementById('ap-preset-button').click();

export default async function (page, shots) {
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 5 }));
  if (process.env.AP_LANG) {
    await page.evaluate((l) => localStorage.setItem('language', l), process.env.AP_LANG);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.jQuery('#api_button_openai').trigger('click'));
    await page.waitForFunction(() => SillyTavern.getContext().onlineStatus && SillyTavern.getContext().onlineStatus !== 'no_connection', null, { timeout: 15000 }).catch(() => {});
  }
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(toggle);
  await page.waitForTimeout(400);
  const head = page.locator('ap-panel .panel-head input[role=switch]');
  if (!(await head.isChecked())) await page.locator('ap-panel .panel-head .switch').click();
  await page.locator('ap-panel .tab').nth(5).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel input[type=text], ap-panel input[type=url]').first().fill('http://127.0.0.1:4747');
  const devSwitch = page.locator('ap-panel .panel-body input[role=switch]').first();
  if (!(await devSwitch.isChecked())) await page.locator('ap-panel .panel-body .switch').first().click();
  await page.waitForTimeout(3000);
  await page.locator('ap-panel .tab').nth(0).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel .panel-body [role=button][tabindex="0"]').first().click();
  await page.waitForTimeout(1500);
  await page.locator('ap-panel .tab').nth(2).click();
  await page.waitForTimeout(400);
  while (await page.locator('ap-panel .um-list .um-open').count()) {
    await page.locator('ap-panel .um-list .um-open').first().click();
    await page.waitForTimeout(200);
    await page.locator('ap-panel .um-foot .danger').click();
    await page.locator('ap-panel .um-foot .danger').click();
    await page.waitForTimeout(300);
  }
  await page.locator('ap-panel .um-new').scrollIntoViewIfNeeded();
  await page.locator('ap-panel .um-new').click();
  await page.waitForTimeout(400);
  await page.locator('ap-panel .um-name').fill('Sharper questions');
  // drop the insertion entry: this module only updates variables
  await page.locator('ap-panel .um-editor label.picker select').first().selectOption('mandatoryQuestions');
  await page.waitForTimeout(200);
  await page.locator('ap-panel .um-entry').first().locator('.um-entry-head button').last().click();
  await page.waitForTimeout(200);
  const v = page.locator('ap-panel .um-entry').first();
  await v.locator('.um-var-key').first().fill('lamp');
  await v.locator('.um-var-value').first().fill(`${MARK} Does the lighthouse lamp still burn?`);
  await v.locator('.um-var-add').click();
  await v.locator('.um-var-key').nth(1).fill('guidelines');
  await v.locator('.um-var-key').nth(1).dispatchEvent('change');
  await page.waitForTimeout(200);
  console.log('prefilled', JSON.stringify((await v.locator('.um-var-value').nth(1).inputValue()).slice(0, 40)));
  await v.locator('.um-var-value').nth(1).fill('');
  await page.waitForTimeout(200);
  await shot(page, shots, '1-editor');
  await page.locator('ap-panel .um-editor label.picker select').first().selectOption('optionalQuestions');
  await page.waitForTimeout(200);
  await page.locator('ap-panel .um-entry').nth(1).locator('.um-var-key').first().fill('weather');
  await page.locator('ap-panel .um-entry').nth(1).locator('.um-var-value').first().fill('What is the weather doing?');
  await page.waitForTimeout(200);
  await shot(page, shots, '2-two');
  await page.locator('ap-panel .um-head button').first().click();
  await page.waitForTimeout(400);
  await shot(page, shots, '3-list');
  console.log('stored', JSON.stringify(await page.evaluate(() => {
    const s = SillyTavern.getContext().extensionSettings.advancedPreset ?? SillyTavern.getContext().extensionSettings.advanced_preset;
    return s && Object.fromEntries(Object.entries(s.presets ?? {}).map(([k, x]) => [k, x.userModules]));
  })));
  await page.evaluate(toggle);
  await page.waitForTimeout(600);
  await page.evaluate(() => { if (document.querySelector('#left-nav-panel.openDrawer')) document.getElementById('leftNavDrawerIcon')?.click(); });
  fs.writeFileSync(reqFile, '');
  await page.fill('#send_textarea', 'Mira walks to the lighthouse.');
  await page.evaluate(() => document.getElementById('send_but').click());
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${shots}/bv-4-sent.png` });
  const reqs = fs.readFileSync(reqFile, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const all = (reqs[0]?.body.messages ?? []).map((m) => String(m.content)).join('\n');
  const i = all.indexOf('### Mandatory questions');
  console.log('questions', JSON.stringify(all.slice(i, i + 900)));
  console.log('has marker', all.includes(MARK), 'guidelines q removed', !all.includes('based on the instructions in `<guidelines>`'), 'weather', all.includes('weather doing'));
}

import fs from 'node:fs';
export default async function (page, shots) {
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  // Use on impersonate card
  const use = page.locator('#chat .mes').nth(-1).locator('ap-cards button', { hasText: /Use/ });
  console.log('use buttons', await use.count());
  if (await use.count()) { await use.first().click(); await page.waitForTimeout(300); console.log('input after Use:', await page.inputValue('#send_textarea')); }
  await page.fill('#send_textarea', '');
  // option card on an earlier story message
  const opt = page.locator('#chat ap-cards .option').first();
  console.log('options', await page.locator('#chat ap-cards .option').count());
  if (await opt.count()) { await opt.click(); await page.waitForTimeout(300); console.log('input after option:', (await page.inputValue('#send_textarea')).slice(0, 100)); }
  await page.fill('#send_textarea', '');
  // swipe regenerate on last message
  fs.writeFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, '');
  const before = await page.evaluate(() => { const c = SillyTavern.getContext().chat; return c.at(-1).swipes?.length; });
  await page.locator('#chat .last_mes .swipe_right').click();
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => { const m = SillyTavern.getContext().chat.at(-1); return { swipes: m.swipes?.length, id: m.swipe_id, scPerSwipe: (m.swipe_info || []).map((i) => !!i?.extra?.advanced_preset), wf: m.extra?.advanced_preset?.workflow, gen: m.extra?.advanced_preset?.genId }; });
  console.log('before swipes', before, JSON.stringify(r));
  await page.locator('#chat .last_mes').screenshot({ path: `${shots}/swipe.png` });
  // swipe back
  await page.locator('#chat .last_mes .swipe_left').click();
  await page.waitForTimeout(800);
  const back = await page.evaluate(() => { const m = SillyTavern.getContext().chat.at(-1); return { id: m.swipe_id, wf: m.extra?.advanced_preset?.workflow, gen: m.extra?.advanced_preset?.genId }; });
  console.log('back', JSON.stringify(back));
  await page.locator('#chat .last_mes').screenshot({ path: `${shots}/swipe-back.png` });
}

import fs from 'node:fs';
export default async function (page, shots) {
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ mode: 'error' }));
  await page.fill('#send_textarea', 'Next scene.');
  await page.click('#send_but');
  await page.waitForTimeout(4000);
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 300 }));
  const r = await page.evaluate(() => { const c = SillyTavern.getContext().chat; return c.slice(-2).map((m) => ({ u: m.is_user, mes: m.mes.slice(0, 80) })); });
  console.log('after error', JSON.stringify(r), 'toasts:', await page.locator('#toast-container .toast-message').allInnerTexts());
  await page.screenshot({ path: `${shots}/err.png` });
  // stop mid-stream
  await page.evaluate(() => document.querySelector('#toast-container')?.remove());
  await page.locator('#chat .last_mes .swipe_right').click().catch(() => {});
  await page.waitForTimeout(500);
  const isUser = await page.evaluate(() => SillyTavern.getContext().chat.at(-1).is_user);
  if (isUser) { await page.click('#send_but').catch(() => {}); }
  await page.waitForTimeout(3500);
  await page.click('#mes_stop');
  await page.waitForTimeout(2000);
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 5 }));
  const r2 = await page.evaluate(() => { const m = SillyTavern.getContext().chat.at(-1); const sc = m.extra?.advanced_preset; return { u: m.is_user, mes: m.mes.slice(0, 80), stages: sc?.stages?.map((s) => s.id + ':' + s.status) }; });
  console.log('after stop', JSON.stringify(r2));
  await page.locator('#chat .last_mes').screenshot({ path: `${shots}/stopped.png` });
}

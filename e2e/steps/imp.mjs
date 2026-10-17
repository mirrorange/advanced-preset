import fs from 'node:fs';
export default async function (page, shots) {
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  fs.writeFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, '');
  await page.fill('#send_textarea', 'she opens the door');
  await page.click('#options_button');
  await page.waitForTimeout(300);
  await page.click('#option_impersonate');
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const c = SillyTavern.getContext().chat;
    return { input: document.querySelector('#send_textarea').value, tail: c.slice(-2).map((m) => ({ user: m.is_user, mes: m.mes.slice(0, 120), sc: m.extra?.advanced_preset && { wf: m.extra.advanced_preset.workflow, st: Object.keys(m.extra.advanced_preset.structures || {}) } })) };
  });
  console.log(JSON.stringify(r, null, 1));
  const reqs = fs.readFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  console.log('requests', reqs.length);
  await page.locator('#chat .mes').nth(-1).screenshot({ path: `${shots}/imp.png` });
}

/** Edit the synopsis of the last AI message from its card (needs a generated turn with a synopsis). */
import fs from 'node:fs';
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || 'desktop';
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  const last = await page.evaluate(() => SillyTavern.getContext().chat.length - 1);
  const card = page.locator(`#chat .mes[mesid="${last}"] ap-cards`);
  const line = card.locator('.synopsis');
  await line.scrollIntoViewIfNeeded();
  await card.screenshot({ path: `${shots}/syn-${tag}-0-line.png` });
  await line.hover();
  await page.waitForTimeout(300);
  await card.screenshot({ path: `${shots}/syn-${tag}-1-hover.png` });
  const before = await page.evaluate((i) => ({ syn: SillyTavern.getContext().chat[i].extra.advanced_preset.structures.synopsis, swipe: SillyTavern.getContext().chat[i].swipe_id }), last);
  console.log('before', JSON.stringify(before));

  // Esc cancels without changes
  await card.locator('.synopsis-edit button').click();
  await page.waitForTimeout(200);
  await card.locator('.synopsis-event-input').fill('Should not stick');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const afterEsc = await page.evaluate((i) => SillyTavern.getContext().chat[i].extra.advanced_preset.structures.synopsis.event, last);
  console.log('after esc', afterEsc, 'editor gone', (await card.locator('.synopsis-editor').count()) === 0);

  // Edit and save; arrow keys must not swipe, Ctrl+Enter must not regenerate
  await card.locator('.synopsis-edit button').click();
  await page.waitForTimeout(300);
  await card.screenshot({ path: `${shots}/syn-${tag}-2-editor.png` });
  await card.locator('.synopsis-field input').nth(0).fill('Day 2, 23:40');
  await card.locator('.synopsis-field input').nth(1).fill('Lighthouse lantern room');
  const ev = card.locator('.synopsis-event-input');
  await ev.fill('Mira finds the keeper’s log');
  await ev.press('ArrowLeft'); await ev.press('ArrowRight');
  await card.locator('textarea').fill('She climbs the spiral stairs.\nThe last entry is dated tomorrow.\nOutside, the lamp turns on by itself.');
  await page.waitForTimeout(200);
  await card.screenshot({ path: `${shots}/syn-${tag}-3-filled.png` });
  await card.locator('textarea').press('Control+Enter');
  await page.waitForTimeout(800);
  const after = await page.evaluate((i) => { const m = SillyTavern.getContext().chat[i]; return { syn: m.extra.advanced_preset.structures.synopsis, swipeSyn: m.swipe_info?.[m.swipe_id ?? 0]?.extra?.advanced_preset?.structures?.synopsis, swipe: m.swipe_id, len: SillyTavern.getContext().chat.length }; }, last);
  console.log('after', JSON.stringify(after));
  await line.click();
  await page.waitForTimeout(200);
  await card.screenshot({ path: `${shots}/syn-${tag}-4-saved-open.png` });

  // Next request carries the edited synopsis (Petals: history 3)
  fs.writeFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, '');
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 5 }));
  await page.fill('#send_textarea', 'She reads on.');
  await page.click('#send_but');
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });
  const reqs = fs.readFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const body = JSON.stringify(reqs[0]?.body?.messages ?? []);
  console.log('request has edited synopsis:', body.includes('Mira finds the keeper’s log') || body.includes('Mira finds the keeper\\u2019s log'), body.includes('Lighthouse lantern room'));
}

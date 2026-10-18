import fs from 'node:fs';
export default async function (page, shots) {
  const transport = process.env.AP_TRANSPORT || 'Structured';
  const workflow = process.env.AP_WORKFLOW || 'Linear';
  const tag = `${transport}-${workflow}`.replace(/\s+/g, '').toLowerCase();
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.getElementById('ap-preset-button').click());
  await page.waitForTimeout(400);
  await page.locator('ap-panel .tab').nth(1).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel .segmented button', { hasText: new RegExp(`^${transport}$`) }).first().click();
  await page.locator('ap-panel .segmented button', { hasText: new RegExp(`^${workflow}$`) }).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${shots}/cfg-${tag}.png` });
  await page.evaluate(() => document.getElementById('ap-preset-button').click());
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: Number(process.env.AP_DELAY || 60) }));
  fs.writeFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, '');
  await page.fill('#send_textarea', process.env.AP_INPUT || 'Mira walks to the lighthouse.');
  await page.click('#send_but');
  await page.waitForTimeout(Number(process.env.AP_SHOT_AT || 2500));
  await page.screenshot({ path: `${shots}/stream-${tag}.png` });
  fs.writeFileSync(new URL('../mock.json', import.meta.url).pathname, JSON.stringify({ delay: 5 }));
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => {
    const c = SillyTavern.getContext().chat;
    const last = c[c.length - 1];
    const sc = last.extra?.advanced_preset;
    return { len: c.length, mes: last.mes.slice(0, 160), sc: sc && { transport: sc.transport, workflow: sc.workflow, stages: sc.stages?.map((s) => `${s.id}:${s.status}:${(s.text || '').length}`), structures: Object.keys(sc.structures || {}), warnings: sc.warnings, events: sc.events?.length } };
  });
  console.log(JSON.stringify(after, null, 1));
  const reqs = fs.readFileSync(new URL('../mock-requests.jsonl', import.meta.url).pathname, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  console.log('requests:', reqs.length, reqs.map((r) => JSON.stringify({ tools: r.body.tools?.map((t) => t.function.name), choice: r.body.tool_choice, rf: r.body.response_format?.type, last: r.body.messages?.at(-1)?.role, lastText: String(r.body.messages?.at(-1)?.content).slice(0, 80), stop: r.body.stop, reply: JSON.stringify(r.reply).slice(0, 100) })).join('\n'));
  await page.screenshot({ path: `${shots}/done-${tag}.png` });
}

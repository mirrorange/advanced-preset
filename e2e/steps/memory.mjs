// Memory follows message versions (I-97 / I-98): swipe regeneration, swiping back, delete and regenerate.
// Run after `setup` + `carrier`. Uses the built-in Petals preset with the structured transport.
import fs from 'node:fs';
const mockCfg = new URL('../mock.json', import.meta.url).pathname;
const reqLog = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const ops = (v) => [
  { scope: 'global_memory', operation: 'replace', key: 'e2e-global', content: `global ${v}` },
  { scope: 'memory', operation: 'replace', key: 'e2e-chat', content: `chat ${v}` },
];
const setMock = (v) => fs.writeFileSync(mockCfg, JSON.stringify({ delay: 5, memoryOps: ops(v) }));
const lastRequestText = () => {
  const reqs = fs.readFileSync(reqLog, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  return JSON.stringify(reqs.at(-1)?.body?.messages ?? []);
};
const sent = (text) => ({ global: (text.match(/global v\d/g) ?? []).join(','), chat: (text.match(/chat v\d/g) ?? []).join(',') });

export default async function (page, shots) {
  const results = [];
  const check = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); results.push(`${ok ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(got)}${ok ? '' : ` (want ${JSON.stringify(want)})`}`); };
  const state = () => page.evaluate(() => {
    const ctx = SillyTavern.getContext();
    const g = ctx.extensionSettings.advancedPreset.presets.petals.globalMemory;
    const mem = {};
    for (const e of g.log.slice(0, g.cursor)) if (!e.inactive && e.key === 'e2e-global') { if (e.op === 'replace') mem[e.key] = e.content; else delete mem[e.key]; }
    const chat = {};
    for (const m of ctx.chat) for (const e of m.extra?.advanced_preset?.events ?? []) if (e.type === 'memory.replace' && e.key === 'e2e-chat') chat[e.key] = e.content;
    return { global: mem['e2e-global'] ?? null, chat: chat['e2e-chat'] ?? null, len: ctx.chat.length };
  });
  const idle = async () => {
    await page.waitForTimeout(400);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 60000 });
    await page.waitForTimeout(1200);
  };

  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(async () => { await SillyTavern.getContext().executeSlashCommandsWithOptions?.('/newchat'); });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await page.locator('ap-panel .tab').nth(1).click();
  await page.locator('ap-panel .segmented button', { hasText: /^Structured$/ }).first().click();
  await page.locator('ap-panel .segmented button', { hasText: /^Linear$/ }).first().click();
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));
  fs.writeFileSync(reqLog, '');
  // Global memory is shared across chats: start from an empty log so earlier runs do not leak in.
  await page.evaluate(() => {
    const ctx = SillyTavern.getContext();
    const g = ctx.extensionSettings.advancedPreset.presets.petals.globalMemory;
    g.log.splice(0);
    g.cursor = 0;
    ctx.saveSettingsDebounced();
  });

  // 1. A mixed meta turn writes chat + global memory (v1).
  setMock('v1');
  await page.fill('#send_textarea', 'Mira walks to the lighthouse. @Freesia please remember the lighthouse.');
  await page.click('#send_but');
  await idle();
  check('v1 written', await state(), { global: 'global v1', chat: 'chat v1', len: 3 });

  // 2. Swipe to regenerate: the request must no longer contain v1; afterwards v2 is current.
  setMock('v2');
  await page.locator('#chat .mes').last().locator('.swipe_right').click();
  await idle();
  check('swipe request without v1', sent(lastRequestText()), { global: '', chat: '' });
  check('v2 after swipe', await state(), { global: 'global v2', chat: 'chat v2', len: 3 });
  await page.screenshot({ path: `${shots}/memory-swipe.png` });

  // 3. Swipe back to the first version: v1 again (chat and global); then forward to v2.
  await page.locator('#chat .mes').last().locator('.swipe_left').click();
  await page.waitForTimeout(1500);
  check('swipe back restores v1', await state(), { global: 'global v1', chat: 'chat v1', len: 3 });
  await page.locator('#chat .mes').last().locator('.swipe_right').click();
  await page.waitForTimeout(1500);
  check('swipe forward restores v2', await state(), { global: 'global v2', chat: 'chat v2', len: 3 });

  // 4. Regenerate (deletes the last message, then generates): the request has no v2.
  setMock('v3');
  await page.evaluate(async () => { await SillyTavern.getContext().executeSlashCommandsWithOptions('/regenerate'); });
  await idle();
  check('regenerate request without v2', sent(lastRequestText()), { global: '', chat: '' });
  check('v3 after regenerate', await state(), { global: 'global v3', chat: 'chat v3', len: 3 });

  // 5. Delete the last message: its memory is revoked.
  await page.evaluate(async () => { await SillyTavern.getContext().executeSlashCommandsWithOptions('/del 1'); });
  await page.waitForTimeout(1500);
  check('delete revokes v3', await state(), { global: null, chat: null, len: 2 });

  // 6. Next turn's request carries no stale memory.
  setMock('v4');
  await page.fill('#send_textarea', 'She opens the door. @Freesia remember the door.');
  await page.click('#send_but');
  await idle();
  check('next request without stale memory', sent(lastRequestText()), { global: '', chat: '' });
  check('v4 written', await state(), { global: 'global v4', chat: 'chat v4', len: 4 });

  // 7. Control: memory that is current does reach the prompt.
  setMock('v5');
  await page.fill('#send_textarea', 'She steps inside.');
  await page.click('#send_but');
  await idle();
  check('current memory is sent', sent(lastRequestText()), { global: 'global v4', chat: 'chat v4' });

  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await page.locator('ap-panel .tab').nth(4).click().catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${shots}/memory-panel.png` });
  console.log(results.join('\n'));
}

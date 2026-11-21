// Speech synthesis end to end (after `setup`, with `ap dev --port 4747` on a Petals copy that declares `speech`):
// Media tab → OpenAI TTS connection on the mock with narration and two character voices → a story turn
// with <speech> lines: clean text, underlined lines, the message player; click a line, play the whole
// message, generate all; then Fish (reference_id per character) with automatic generation.
import { chatLog, helpers, mediaLog, setupMedia } from '../lib/media.mjs';

export default async function (page, shots) {
  const shot = (name) => page.screenshot({ path: `${shots}/media-speech-${name}.png` });
  const h = await setupMedia(page);
  const tts = () => mediaLog().filter((r) => /audio\/speech|\/v1\/tts/.test(r.url));
  const card = () => h.lastMes().locator('.speech-card');

  // Media tab: image generation off, speech on, an OpenAI connection with narration and character voices.
  await h.open();
  await h.tab('Media');
  await page.waitForTimeout(300);
  await h.switchTo(h.section('Image generation').locator('.card-head .switch'), false);
  const sec = h.section('Speech synthesis');
  await h.switchTo(sec.locator('.card-head .switch'), true);
  await h.switchTo(h.field('Generate automatically', sec).locator('.switch'), false);
  await h.switchTo(h.field('Voice narration', sec).locator('.switch'), true);
  if (!(await sec.locator('select[aria-label]').count())) await sec.locator('button[aria-label="Add connection"]').click();
  await page.waitForTimeout(200);
  await h.field('API', sec).locator('select').selectOption('openai');
  await h.set(h.field('Base URL', sec).locator('input'), 'http://127.0.0.1:5055/v1');
  await h.set(h.field('API key', sec).locator('input'), 'sk-mock');
  await h.set(h.field('Default voice', sec).locator('input').first(), 'alloy');
  const bindings = h.field('Character voices', sec);
  for (const [name, voice] of [['Mira', 'nova'], ['Keeper', 'onyx']]) {
    await bindings.locator('button', { hasText: 'Add character' }).click();
    const row = bindings.locator('.speech-binding').last();
    await h.set(row.locator('input').first(), name);
    await h.set(row.locator('input').nth(1), voice);
  }
  await page.waitForTimeout(300);
  await shot('1-settings');
  await h.open(false);

  // A story turn: speech lines are clean text, underlined, with the player above.
  await page.fill('#send_textarea', 'Mira walks to the lighthouse.');
  await page.click('#send_but');
  await h.waitIdle();
  await page.waitForTimeout(1200);
  const req = chatLog().at(-1);
  const sent = (req?.body.messages ?? []).map((m) => (typeof m.content === 'string' ? m.content : '')).join('\n');
  console.log('prompt mentions', JSON.stringify({ speechTag: sent.includes('<speech character='), characters: /Mira, Keeper|Keeper, Mira/.test(sent), fishFormat: /Fish Audio delivery cues/.test(sent) }));
  const turn = await page.evaluate(() => {
    const c = SillyTavern.getContext().chat;
    const m = c[c.length - 1];
    return { mes: m.mes, speech: m.extra?.advanced_preset?.speech, shown: [...document.querySelectorAll('#chat .mes')].at(-1)?.querySelector('.mes_text')?.textContent };
  });
  console.log('turn', JSON.stringify(turn, null, 1));
  await h.lastMes().scrollIntoViewIfNeeded();
  await shot('2-turn');
  console.log('tts before any click', tts().length);

  // Click the first speech line in the text: it is synthesised and played.
  const box = await page.evaluate(() => {
    const el = [...document.querySelectorAll('#chat .mes')].at(-1)?.querySelector('.mes_text');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const i = n.textContent.indexOf('Anyone there');
      if (i < 0) continue;
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 6);
      const b = r.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }
    return null;
  });
  if (box) {
    await page.mouse.move(box.x, box.y);
    await page.waitForTimeout(200);
    await page.mouse.click(box.x, box.y);
    await page.waitForTimeout(700);
    await shot('3-line-playing');
  }
  console.log('after line click', JSON.stringify(tts().map((r) => ({ url: r.url, input: r.body.input, voice: r.body.voice, format: r.body.response_format }))));

  // The message player: play everything (narration included), then generate all.
  await page.waitForTimeout(3000);
  const n1 = tts().length;
  await card().locator('button[aria-label="Play"]').click();
  await page.waitForTimeout(1500);
  await shot('4-message-playing');
  await page.waitForTimeout(6000);
  console.log('after play', JSON.stringify(tts().slice(n1).map((r) => ({ input: r.body.input, voice: r.body.voice }))));
  const stop = card().locator('button[aria-label="Stop"]');
  if (await stop.count()) await stop.click();
  const gen = card().locator('button[aria-label="Generate all"]');
  if (await gen.count()) { await gen.click(); await page.waitForTimeout(4000); }
  await shot('5-all-ready');
  console.log('segments', JSON.stringify(await card().locator('.speech-seg').evaluateAll((xs) => xs.map((x) => `${x.className} | ${x.getAttribute('aria-label')}`))));

  // Fish with automatic generation: a swipe is synthesised as soon as it arrives, with reference ids.
  await h.open();
  await h.tab('Media');
  await h.switchTo(h.field('Generate automatically', sec).locator('.switch'), true);
  await h.field('API', sec).locator('select').selectOption('fish');
  await h.set(h.field('Base URL', sec).locator('input'), 'http://127.0.0.1:5055');
  await h.set(h.field('Default voice', sec).locator('input').first(), 'ref-default');
  // Switching the API keeps the characters and clears their voices (voices are per provider).
  const kept = await bindings.locator('.speech-binding > input').evaluateAll((xs) => xs.map((x) => x.value));
  console.log('bindings after API switch', JSON.stringify(kept));
  for (const [name, voice] of [['Mira', 'ref-mira'], ['Keeper', 'ref-keeper']]) {
    let i = kept.indexOf(name);
    if (i < 0) {
      await bindings.locator('button', { hasText: 'Add character' }).click();
      i = (await bindings.locator('.speech-binding').count()) - 1;
      await h.set(bindings.locator('.speech-binding').nth(i).locator('input').first(), name);
    }
    await h.set(bindings.locator('.speech-binding').nth(i).locator('input').nth(1), voice);
  }
  await page.waitForTimeout(300);
  await shot('6-fish');
  await h.open(false);
  const n2 = tts().length;
  await h.lastMes().locator('.swipe_right').click();
  await h.waitIdle();
  await page.waitForTimeout(5000);
  await h.lastMes().scrollIntoViewIfNeeded();
  await shot('7-fish-auto');
  console.log('fish auto', JSON.stringify(tts().slice(n2).map((r) => ({ url: r.url, text: r.body.text, ref: r.body.reference_id, rate: r.body.sample_rate }))));
  const fishPrompt = chatLog().at(-1)?.body.messages?.map((m) => (typeof m.content === 'string' ? m.content : '')).join('\n') ?? '';
  console.log('fish format in prompt', /Fish Audio delivery cues/.test(fishPrompt), 'mes', JSON.stringify(await page.evaluate(() => SillyTavern.getContext().chat.at(-1).mes)));
}

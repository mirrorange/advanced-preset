// Card scopes and the voice dialog end to end (after `setup`, with `ap dev --port 4747` on a Petals copy
// that declares `image` and `speech`): reference images grouped as Global / the chat's card, a
// card-bound image offered only in that card's chat and moved to Global; a line of an unbound
// character asks for a voice (cancel skips it, a pick binds it to the chat's card); deleting and
// regenerating the audio of a message.
import fs from 'node:fs';
import { chatLog, mediaLog, setupMedia } from '../lib/media.mjs';

export default async function (page, shots) {
  const shot = (name) => page.screenshot({ path: `${shots}/media-scopes-${name}.png` });
  const h = await setupMedia(page);
  const tts = () => mediaLog().filter((r) => /audio\/speech/.test(r.url));
  const refsMacro = () => (chatLog().at(-1)?.body.messages ?? []).map((m) => (typeof m.content === 'string' ? m.content : '')).join('\n').match(/^- ref\d+:.*$/gm) ?? [];
  const settings = () => page.evaluate(() => {
    const m = SillyTavern.getContext().extensionSettings.advancedPreset.media;
    const i = m.image.connections[0];
    const s = m.speech.connections[0];
    return { card: SillyTavern.getContext().characters[SillyTavern.getContext().characterId]?.avatar, refs: i?.refs.map((r) => ({ id: r.id, card: r.card })), bindings: s?.bindings.map((b) => ({ character: b.character, voice: b.voice?.id, card: b.card })) };
  });
  const dialog = page.locator('ap-voice-ask dialog');

  // Image: OpenAI on the mock, manual generation; two reference images, one for the chat's card.
  await h.open();
  await h.tab('Media');
  await page.waitForTimeout(300);
  const img = h.section('Image generation');
  await h.switchTo(img.locator('.card-head .switch'), true);
  await h.switchTo(h.field('Generate automatically', img).locator('.switch'), false);
  if (!(await img.locator('select[aria-label]').count())) await img.locator('button[aria-label="Add connection"]').click();
  await page.waitForTimeout(200);
  await h.set(h.field('Base URL', img).locator('input'), 'http://127.0.0.1:5055/v1');
  await h.set(h.field('API key', img).locator('input'), 'sk-mock');
  console.log('prompt type', await img.locator('.segmented[role=radiogroup] button[aria-checked=true]').allTextContents());
  fs.writeFileSync('/tmp/ap-ref.png', (await import('../mock-media.mjs')).png(64, 64));
  const refs = h.field('Reference images', img);
  const groups = refs.locator('.media-ref-group');
  console.log('ref groups', JSON.stringify(await groups.locator('.media-ref-group-title').allTextContents()));
  // "Add images" of the card group, then of the global group (one shared file input).
  for (const g of [1, 0]) {
    const chooser = page.waitForEvent('filechooser');
    await groups.nth(g).locator('button', { hasText: 'Add images' }).click();
    await (await chooser).setFiles('/tmp/ap-ref.png');
    await page.waitForTimeout(400);
  }
  console.log('refs', JSON.stringify((await settings()).refs), 'card', (await settings()).card);

  // Speech: OpenAI TTS, manual, no narration; only Mira has a voice.
  const sp = h.section('Speech synthesis');
  await h.switchTo(sp.locator('.card-head .switch'), true);
  await h.switchTo(h.field('Generate automatically', sp).locator('.switch'), false);
  await h.switchTo(h.field('Voice narration', sp).locator('.switch'), false);
  if (!(await sp.locator('select[aria-label]').count())) await sp.locator('button[aria-label="Add connection"]').click();
  await page.waitForTimeout(200);
  await h.field('API', sp).locator('select').selectOption('openai');
  await h.set(h.field('Base URL', sp).locator('input'), 'http://127.0.0.1:5055/v1');
  await h.set(h.field('API key', sp).locator('input'), 'sk-mock');
  const bindings = h.field('Character voices', sp);
  await bindings.locator('button', { hasText: 'Add character' }).first().click();
  const row = bindings.locator('.speech-binding').last();
  await h.set(row.locator('input').first(), 'Mira');
  await h.set(row.locator('input').nth(1), 'nova');
  await page.waitForTimeout(300);
  await img.scrollIntoViewIfNeeded();
  await refs.scrollIntoViewIfNeeded();
  await shot('1-ref-groups');
  await bindings.scrollIntoViewIfNeeded();
  await shot('2-voice-groups');
  await h.open(false);

  // A story turn: both reference images are offered in this chat; the mock picks the first.
  await page.fill('#send_textarea', 'Mira walks to the lighthouse.');
  await page.click('#send_but');
  await h.waitIdle();
  await page.waitForTimeout(1200);
  console.log('refs offered', JSON.stringify(refsMacro()));

  // Play the message: Keeper has no voice, so the dialog asks. Cancel: only Mira's line is spoken.
  const card = () => h.lastMes().locator('.speech-card');
  await card().locator('button[aria-label="Play"]').click();
  await dialog.waitFor({ timeout: 10000 });
  await page.waitForTimeout(300);
  await shot('3-ask');
  console.log('ask', JSON.stringify({ title: await dialog.locator('strong').textContent(), scope: await dialog.locator('select').inputValue().catch(() => null), options: await dialog.locator('select option').allTextContents() }));
  await dialog.locator('button', { hasText: 'Cancel' }).click();
  await page.waitForTimeout(3000);
  console.log('after cancel', JSON.stringify(tts().map((r) => ({ input: r.body.input, voice: r.body.voice }))), 'dialog open', await dialog.count());

  // Generate all: asked again; pick a voice for the chat's card.
  const n1 = tts().length;
  await card().locator('button[aria-label="Generate all"]').click();
  await dialog.waitFor({ timeout: 10000 });
  await h.set(dialog.locator('input').first(), 'onyx');
  await dialog.locator('button', { hasText: 'Save' }).click();
  await page.waitForTimeout(3000);
  console.log('after pick', JSON.stringify(tts().slice(n1).map((r) => ({ input: r.body.input, voice: r.body.voice }))), JSON.stringify((await settings()).bindings));
  await shot('4-all-ready');

  // Delete the message's audio, then regenerate it: every line is synthesised again.
  await card().locator('button[aria-label="Delete audio"]').click();
  await page.waitForTimeout(500);
  console.log('after delete', JSON.stringify(await card().locator('.speech-seg').evaluateAll((xs) => xs.map((x) => x.className))));
  const n2 = tts().length;
  await card().locator('button[aria-label="Generate all"]').click();
  await page.waitForTimeout(3000);
  const n3 = tts().length;
  await card().locator('button[aria-label="Regenerate all"]').click();
  await page.waitForTimeout(3000);
  console.log('regenerate', JSON.stringify({ afterDelete: n3 - n2, afterRegenerate: tts().length - n3 }));

  // Move the card's reference image to Global; then a chat without that card only sees global ones.
  await h.open();
  await h.tab('Media');
  await page.waitForTimeout(300);
  const cardRef = groups.nth(1).locator('.media-ref').first();
  console.log('toggle', await cardRef.locator('.scope-toggle button').getAttribute('aria-label'));
  await cardRef.locator('.scope-toggle button').click();
  await page.waitForTimeout(300);
  console.log('after move', JSON.stringify((await settings()).refs));
  // The same toggle on a voice: Keeper (bound to the card by the dialog) to Global.
  const keeper = bindings.locator('.speech-binding', { has: page.locator('input[value="Keeper"]') });
  await keeper.locator('.scope-toggle button').click();
  await page.waitForTimeout(300);
  console.log('voice toggled', JSON.stringify((await settings()).bindings));
  await bindings.scrollIntoViewIfNeeded();
  await shot('5-toggles');
  await groups.nth(0).locator('.media-ref').first().locator('.scope-toggle button').click();
  await page.waitForTimeout(300);
  console.log('moved back', JSON.stringify((await settings()).refs));
  await h.open(false);
  await page.evaluate(async () => { await SillyTavern.getContext().executeSlashCommandsWithOptions?.('/newchat'); });
  await page.waitForTimeout(1500);
  // A new chat with the same card: still offered. Then with no character: only global.
  await page.fill('#send_textarea', 'Again.');
  await page.click('#send_but');
  await h.waitIdle();
  await page.waitForTimeout(800);
  console.log('same card, new chat', JSON.stringify(refsMacro()));
  await page.evaluate(() => window.jQuery('#option_close_chat').trigger('click'));
  await page.waitForTimeout(1500);
  await h.open();
  await h.tab('Media');
  await page.waitForTimeout(300);
  console.log('no character: groups', JSON.stringify(await groups.locator('.media-ref-group-title').allTextContents()), 'refs shown', await refs.locator('.media-ref').count(), 'scope controls', await refs.locator('.scope-toggle').count());
  await shot('6-no-character');
  await h.open(false);
}

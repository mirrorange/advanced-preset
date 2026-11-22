// Speech panel (after `media-speech`: Fish connection, the last message's audio generated): open it
// from the message player, segments with voice and state, edit what a line speaks (stored in the
// sidecar, old audio gone, the next synthesis sends the edit), generate / regenerate / delete one
// segment, play one, revert, Ctrl+Enter saves, Esc cancels an edit then closes the dialog.
import { helpers, mediaLog } from '../lib/media.mjs';

export default async function (page, shots) {
  const shot = (name) => page.screenshot({ path: `${shots}/media-speech-panel-${name}.png` });
  const h = helpers(page);
  const check = (ok, what) => console.log(ok ? 'ok  ' : 'FAIL', what);
  const tts = () => mediaLog().filter((r) => /audio\/speech|\/v1\/tts/.test(r.url));
  const dialog = page.locator('ap-media-dialog .media-dialog');
  const segs = dialog.locator('.speech-panel-seg');
  const seg = (i) => segs.nth(i);
  const state = (i) => seg(i).locator('.speech-panel-state').textContent();
  const edits = () => page.evaluate(() => SillyTavern.getContext().chat.at(-1).extra?.advanced_preset?.speechText);

  // The chat of media-speech (its last message has the speech lines).
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  await h.lastMes().scrollIntoViewIfNeeded();
  await h.lastMes().locator('.speech-card button[aria-label="Speech panel"]').click();
  await page.waitForTimeout(500);
  check(await dialog.isVisible(), 'dialog open');
  // Leftovers of an earlier run; a new browser profile has no cached audio: generate all first.
  while (await dialog.locator('.speech-panel-revert').count()) { await dialog.locator('.speech-panel-revert').first().click(); await page.waitForTimeout(300); }
  const gen = dialog.locator('button[aria-label="Generate all"]');
  if (await gen.count()) { await gen.click(); await page.waitForTimeout(3000); }
  const n = await segs.count();
  const rows = await segs.evaluateAll((xs) => xs.map((x) => [x.querySelector('.speech-panel-who').textContent, x.querySelector('.speech-panel-head .muted').textContent, x.querySelector('.speech-panel-state').textContent]));
  console.log('segments', JSON.stringify(rows));
  check(n === 4 && rows.every((r) => r[2] === 'Generated'), '4 segments, all generated');
  check(rows[1][0] === 'Mira' && rows[1][1] === 'ref-mira' && rows[0][0] === 'Narration', 'who and voice');
  check(await dialog.locator('.speech-panel-format').count() === 1, 'Fish tag notes shown');
  await shot('1-open');

  // Edit Mira's line: Save / Cancel appear; saving stores the edit and drops the old audio.
  const before = tts().length;
  const text = seg(1).locator('textarea');
  const original = await text.inputValue();
  await text.fill('[shouting] "Anyone there? Hello?"');
  check(await seg(1).locator('.speech-panel-save').isVisible(), 'save shown while dirty');
  await shot('2-editing');
  await seg(1).locator('.speech-panel-save').click();
  await page.waitForTimeout(400);
  const stored = await edits();
  check(Object.values(stored ?? {})[0] === '[shouting] "Anyone there? Hello?"', `stored in the sidecar: ${JSON.stringify(stored)}`);
  check(await state(1) === 'Not generated' && (await seg(1).getAttribute('class')).includes('edited'), 'edited segment: old audio gone, marked edited');
  check(tts().length === before, 'saving does not synthesize');

  // Generate it: the edit is what is sent.
  await seg(1).locator('.speech-panel-regen').click();
  await page.waitForTimeout(1500);
  check(tts().at(-1)?.body.text === '[shouting] "Anyone there? Hello?"' && await state(1) === 'Generated', `generated with the edit: ${tts().at(-1)?.body.text}`);

  // Regenerate the last segment, delete the first one's audio.
  const n1 = tts().length;
  await seg(3).locator('.speech-panel-regen').click();
  await page.waitForTimeout(1500);
  check(tts().length === n1 + 1 && tts().at(-1).body.text === await seg(3).locator('textarea').inputValue(), 'regenerated one segment');
  await seg(0).locator('.speech-panel-delete').click();
  await page.waitForTimeout(300);
  check(await state(0) === 'Not generated', 'deleted one segment\'s audio');

  // Play the third segment: shown as playing.
  await seg(2).locator('.speech-panel-play').click();
  await page.waitForTimeout(400);
  check(await state(2) === 'Playing', `playing: ${await state(2)}`);
  await shot('3-playing');
  await dialog.locator('button[aria-label="Stop"]').click().catch(() => {});

  // Revert Mira's line to the model's text.
  await seg(1).locator('.speech-panel-revert').click();
  await page.waitForTimeout(400);
  check(await edits() === undefined && await text.inputValue() === original, 'reverted');

  // Ctrl+Enter saves; Esc cancels an edit (the dialog stays), then Esc closes it.
  const narr = seg(2).locator('textarea');
  await narr.fill('She called out.');
  await narr.press('Control+Enter');
  await page.waitForTimeout(400);
  check(Object.values((await edits()) ?? {})[0] === 'She called out.', 'Ctrl+Enter saved');
  await narr.fill('Something else');
  await narr.press('Escape');
  await page.waitForTimeout(200);
  check(await dialog.isVisible() && await narr.inputValue() === 'She called out.', 'Esc cancelled the edit, dialog open');

  await shot('4-edited');
  // Whole message: delete all audio, then generate the missing audio (the edit is sent).
  await dialog.locator('button[aria-label="Delete audio"]').click();
  await page.waitForTimeout(300);
  let all = await segs.evaluateAll((xs) => xs.map((x) => x.querySelector('.speech-panel-state').textContent));
  check(all.every((s) => s === 'Not generated'), `delete all: ${all}`);
  const n2 = tts().length;
  await gen.click();
  await page.waitForTimeout(3000);
  all = await segs.evaluateAll((xs) => xs.map((x) => x.querySelector('.speech-panel-state').textContent));
  check(all.every((s) => s === 'Generated') && tts().slice(n2).some((r) => r.body.text === 'She called out.'), `generate all: ${all}; ${JSON.stringify(tts().slice(n2).map((r) => r.body.text))}`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check(!(await dialog.isVisible().catch(() => false)), 'Esc closed the dialog');
  // The player follows the edit (the edited narration is what plays).
  console.log('player', JSON.stringify(await h.lastMes().locator('.speech-seg').evaluateAll((xs) => xs.map((x) => x.className))));
}

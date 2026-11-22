// Image generation end to end (after `setup`, with `ap dev --port 4747` on a Petals copy that declares `image`):
// Media tab → OpenAI connection on the mock → a story turn with an illustration (auto), the large view,
// manual mode, the image panel (prompt edit + generate, versions, reference image picked by hand),
// a reference image (images/edits), Gemini and NovelAI, and the
// `auto` CORS mode falling back to ST's /proxy for an endpoint without CORS headers (mock :5056;
// needs `enableCorsProxy: true` in ST's config.yaml).
import fs from 'node:fs';

const MOCK = new URL('../mock.json', import.meta.url).pathname;
const LOG = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const DEV = process.env.AP_DEV_URL || 'http://127.0.0.1:4747';
const mediaLog = () => fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.media);

export default async function (page, shots) {
  const shot = (name) => page.screenshot({ path: `${shots}/media-image-${name}.png` });
  const panel = page.locator('ap-panel');
  const tab = (title) => panel.locator(`.tab[title="${title}"]`).click();
  const field = (label) => panel.locator('.field', { has: page.locator('.field-label', { hasText: new RegExp(`^${label}$`) }) }).first();
  const lastFigure = () => page.locator('#chat .mes').last().locator('.image-figure').first();
  const dialog = page.locator('ap-media-dialog .media-dialog');
  const imagePanel = dialog.locator('.image-panel');
  const waitIdle = () => page.waitForFunction(() => getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 90000 });
  // Cards live in shadow roots: Playwright locators pierce them, document.querySelector does not.
  const waitImage = () => lastFigure().locator('.image-open img, .image-error').first().waitFor({ timeout: 30000 });
  const proxied = [];
  page.on('request', (r) => { if (r.url().includes('/proxy/')) proxied.push(decodeURIComponent(r.url().split('/proxy/')[1])); });
  fs.writeFileSync(LOG, '');
  fs.writeFileSync(MOCK, JSON.stringify({ delay: 5, media: true }));

  // Start from default media settings (earlier runs leave connections and switches behind).
  await page.evaluate(() => { delete SillyTavern.getContext().extensionSettings.advancedPreset.media; });
  // Dev source: the Petals copy that declares image / speech; then its Carrier and a character.
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await page.waitForTimeout(400);
  if (!(await panel.locator('.panel-head input[role=switch]').isChecked())) await panel.locator('.panel-head .switch').click();
  await tab('Debug');
  await page.waitForTimeout(300);
  const dev = panel.locator('input[type=url]').first();
  if ((await dev.inputValue()) !== DEV) {
    await dev.fill(DEV);
    await dev.press('Enter');
  }
  const devSwitch = panel.locator('.section', { hasText: 'Dev source' }).locator('.switch').first();
  if (!(await devSwitch.locator('input').isChecked())) await devSwitch.click();
  await page.waitForFunction(() => window.AdvancedPreset.listPresets().some((p) => p.source === 'dev'), null, { timeout: 20000 });
  await page.evaluate(async () => {
    const $ = window.jQuery;
    const opt = [...document.querySelectorAll('#settings_preset_openai option')].find((o) => o.textContent.startsWith('AP ·'));
    $('#settings_preset_openai').val(opt.value).trigger('change');
    await new Promise((r) => setTimeout(r, 2000));
    document.querySelector('.character_select')?.click();
    await new Promise((r) => setTimeout(r, 2500));
  });
  console.log('presets', JSON.stringify(await page.evaluate(() => [window.AdvancedPreset.listPresets(), window.AdvancedPreset.activePresetId()])));

  // Media tab: image generation on, an OpenAI connection on the mock.
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await tab('Media');
  await page.waitForTimeout(300);
  await shot('1-tab');
  const imageSection = panel.locator('.section', { hasText: 'Image generation' }).first();
  const enable = imageSection.locator('.card-head .switch');
  if (!(await enable.locator('input').isChecked())) await enable.click();
  await page.waitForTimeout(200);
  if (!(await imageSection.locator('select[aria-label]').count())) await imageSection.locator('button[aria-label="Add connection"]').click();
  await page.waitForTimeout(200);
  await field('Base URL').locator('input').fill('http://127.0.0.1:5055/v1');
  await field('Base URL').locator('input').dispatchEvent('change');
  await field('API key').locator('input').fill('sk-mock');
  await field('API key').locator('input').dispatchEvent('change');
  await field('Style prompt').locator('textarea').fill('Soft watercolour, muted colours.').catch(() => {});
  await field('Style prompt').locator('textarea').dispatchEvent('change').catch(() => {});
  await page.waitForTimeout(300);
  await shot('2-connection');
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));

  // A story turn: the illustration is generated right away.
  await page.fill('#send_textarea', 'Mira walks to the lighthouse.');
  await page.click('#send_but');
  await waitIdle();
  await page.waitForTimeout(500);
  await shot('3-generating');
  await waitImage();
  await page.waitForTimeout(500);
  await lastFigure().scrollIntoViewIfNeeded();
  await shot('4-auto');
  const turn = await page.evaluate(() => {
    const c = SillyTavern.getContext().chat;
    const m = c[c.length - 1];
    const sc = m.extra?.advanced_preset;
    return { mes: m.mes.slice(0, 400), structures: sc?.structures, images: sc?.images, speech: sc?.speech?.length, warnings: sc?.diagnostics?.warnings };
  });
  console.log('turn', JSON.stringify(turn, null, 1));
  console.log('image requests', JSON.stringify(mediaLog().map((r) => ({ url: r.url, cors: r.cors, auth: r.headers.authorization, prompt: r.body.prompt, size: r.body.size, images: r.body.images?.length }))));

  // Large view.
  const open = lastFigure().locator('.image-open');
  if (await open.count()) {
    await open.click();
    await page.waitForTimeout(500);
    await shot('5-viewer');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // Manual mode: a swipe shows the prompt and a Generate button.
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await tab('Media');
  await field('Generate automatically').locator('.switch').click();
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));
  await page.locator('#chat .mes').last().locator('.swipe_right').click();
  await waitIdle();
  await page.waitForTimeout(800);
  await lastFigure().scrollIntoViewIfNeeded();
  await shot('6-manual');
  const before = mediaLog().length;
  await lastFigure().locator('button', { hasText: 'Generate' }).click();
  await waitImage();
  await page.waitForTimeout(400);
  await shot('7-manual-done');
  console.log('manual: requests after click', mediaLog().length - before);

  // The image panel: edit the prompt, ratio and caption, then save and generate (the panel stays open).
  await lastFigure().locator('button[aria-label="Edit in the image panel"]').click();
  await imagePanel.waitFor({ timeout: 5000 });
  await imagePanel.locator('textarea').fill('A lighthouse keeper on a spiral staircase, lantern in hand');
  await imagePanel.locator('.field', { hasText: 'Aspect ratio' }).locator('select').selectOption('16:9');
  await imagePanel.locator('.field', { hasText: 'Caption' }).locator('input').fill('The keeper');
  await shot('8-panel-edit');
  const beforeEdit = mediaLog().length;
  await imagePanel.locator('button', { hasText: 'Save and generate' }).click();
  await imagePanel.locator('.image-version').nth(1).waitFor({ timeout: 30000 });
  await page.waitForTimeout(400);
  await shot('9-panel-versions');
  const sent = mediaLog().slice(beforeEdit).at(-1)?.body;
  console.log('panel: edited prompt sent', JSON.stringify({ prompt: sent?.prompt, size: sent?.size, versions: await imagePanel.locator('.image-version').count() }));
  // Show the first version, then delete it; Esc closes the panel and the card shows the edit.
  await imagePanel.locator('.image-version-pick').first().click();
  await page.waitForTimeout(300);
  await imagePanel.locator('.image-version').first().locator('button[aria-label="Delete"]').click();
  await page.waitForTimeout(300);
  console.log('panel: versions after delete', await imagePanel.locator('.image-version').count());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  console.log('panel: closed', !(await dialog.isVisible().catch(() => false)), 'caption on card', JSON.stringify(await lastFigure().locator('.image-foot').textContent()));
  console.log('stored edit', JSON.stringify(await page.evaluate(() => { const c = SillyTavern.getContext().chat; return c[c.length - 1].extra?.advanced_preset?.images; })));

  // A reference image: the next request goes to images/edits.
  fs.writeFileSync('/tmp/ap-ref.png', (await import('../mock-media.mjs')).png(256, 256));
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await tab('Media');
  await panel.locator('.media-refs input[type=file]').setInputFiles('/tmp/ap-ref.png');
  await page.waitForTimeout(600);
  await shot('10-refs');
  await page.evaluate(() => window.AdvancedPreset.togglePanel(false));

  // Gemini, NovelAI, and the no-CORS endpoint, each on a fresh swipe with a click on Generate.
  const variants = [
    { name: 'gemini', api: 'Gemini', base: 'http://127.0.0.1:5055/v1beta' },
    { name: 'novelai', api: 'NovelAI', base: 'http://127.0.0.1:5055' },
    { name: 'proxy', api: 'OpenAI', base: 'http://127.0.0.1:5056/v1' },
  ];
  for (const v of [{ name: 'refs', api: 'OpenAI', base: 'http://127.0.0.1:5055/v1' }, ...variants]) {
    await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
    await tab('Media');
    await imageSection.locator('.segmented button', { hasText: new RegExp(`^${v.api}$`) }).click();
    await field('Base URL').locator('input').fill(v.base);
    await field('Base URL').locator('input').dispatchEvent('change');
    await page.waitForTimeout(200);
    await page.evaluate(() => window.AdvancedPreset.togglePanel(false));
    await page.locator('#chat .mes').last().locator('.swipe_right').click();
    await waitIdle();
    await page.waitForTimeout(600);
    const n = mediaLog().length;
    await lastFigure().locator('button', { hasText: 'Generate' }).click();
    await waitImage();
    await page.waitForTimeout(500);
    await lastFigure().scrollIntoViewIfNeeded();
    await shot(`11-${v.name}`);
    const got = mediaLog().slice(n);
    const err = await lastFigure().locator('.image-error').textContent().catch(() => null);
    console.log(v.name, JSON.stringify({ error: err, requests: got.map((r) => ({ url: r.url, cors: r.cors, images: r.body.images?.length, input: r.body.input?.length, keys: Object.keys(r.body) })) }));
    if (v.name === 'refs') {
      // Pick the reference image by hand in the panel (or drop it when the model picked it).
      await lastFigure().locator('button[aria-label="Edit in the image panel"]').click();
      await imagePanel.waitFor({ timeout: 5000 });
      const box = imagePanel.locator('.image-panel-ref[data-ref="ref1"] input[type=checkbox]');
      const was = await box.isChecked();
      await box.click();
      await shot('11-refs-panel');
      const m = mediaLog().length;
      await imagePanel.locator('button', { hasText: 'Save and generate' }).click();
      for (let i = 0; i < 60 && mediaLog().length === m; i++) await page.waitForTimeout(250);
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
      const r = mediaLog().slice(m).at(-1);
      console.log('panel refs', JSON.stringify({ was, url: r?.url, images: r?.body.images?.length ?? 0 }));
      const chatReq = fs.readFileSync(LOG, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => !r.media).at(-1);
      const schema = JSON.stringify(chatReq?.body.response_format?.json_schema?.schema ?? chatReq?.body.tools ?? {});
      console.log('refs in schema', /"refs"/.test(schema), 'refs macro', JSON.stringify(chatReq?.body.messages?.map((m) => m.content).join('\n').match(/^- ref\d+:.*$/m)?.[0]));
    }
  }
  console.log('through ST /proxy', JSON.stringify(proxied));
  fs.writeFileSync(MOCK, JSON.stringify({ delay: 15 }));
}

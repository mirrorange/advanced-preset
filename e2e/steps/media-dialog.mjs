// The media dialog shell (after `media-image` and `media-speech`, in their chat; best with
// AP_VIEWPORT=390x844 for a touch phone): the dialog starts under ST's top bar and leaves it
// clickable, no tooltip shows when it opens or after a tap, Esc closes it and gives the focus back,
// and a click on the top bar closes it. Both panels are shot.
export default async function (page, shots) {
  const shot = (name) => page.screenshot({ path: `${shots}/media-dialog-${name}.png` });
  const check = (ok, what) => console.log(ok ? 'ok  ' : 'FAIL', what);
  const touch = (page.viewportSize()?.width ?? 1400) < 800;
  const press = (locator) => (touch ? locator.tap() : locator.click());
  const dialog = page.locator('ap-media-dialog .media-dialog');
  const tips = page.locator('.tip-bubble');
  const bar = () => page.evaluate(() => document.querySelector('#top-settings-holder').getBoundingClientRect().bottom);

  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);

  async function opened(name) {
    await dialog.waitFor({ timeout: 5000 });
    await page.waitForTimeout(400);
    const box = await dialog.boundingBox();
    const top = await bar();
    check(box && box.y >= top - 1, `${name}: under the top bar (box ${box && Math.round(box.y)}, bar ${Math.round(top)})`);
    // The middle of the top bar is ST's, not the dialog's backdrop.
    const hit = await page.evaluate((y) => document.elementFromPoint(innerWidth / 2, y / 2)?.closest('ap-media-dialog') === null, top);
    check(hit, `${name}: top bar not covered`);
    check(await tips.count() === 0, `${name}: no tooltip on open`);
    await shot(`${name}`);
  }

  // Speech panel: open, a tap on a button shows no tooltip, Esc closes and gives the focus back.
  const mes = page.locator('#chat .mes').filter({ has: page.locator('.speech-card') }).last();
  await mes.scrollIntoViewIfNeeded();
  const opener = mes.locator('.speech-card button[aria-label="Speech panel"]');
  await press(opener);
  await opened('speech');
  const play = dialog.locator('.speech-panel-seg').first().locator('button').first();
  await press(play);
  await page.waitForTimeout(400);
  check(touch ? await tips.count() === 0 : true, 'speech: no tooltip after a tap');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check(!(await dialog.isVisible().catch(() => false)), 'speech: Esc closed');
  check(await opener.evaluate((b) => b.getRootNode().activeElement === b), 'speech: focus back on the opener');

  // Image panel: open, then a click on the top bar closes it.
  const fig = page.locator('#chat .image-figure').filter({ has: page.locator('button[aria-label="Edit"]') }).last();
  await fig.scrollIntoViewIfNeeded();
  await press(fig.locator('button[aria-label="Edit"]'));
  await opened('image');
  const top = await bar();
  if (touch) await page.touchscreen.tap(4, Math.round(top / 2));
  else await page.mouse.click(4, Math.round(top / 2));
  await page.waitForTimeout(400);
  check(!(await dialog.isVisible().catch(() => false)), 'image: a click on the top bar closed it');
  await shot('closed');
}

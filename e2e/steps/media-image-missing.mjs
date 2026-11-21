// Image cards whose images are gone from this device (IndexedDB cleared): after `media-image`.
// The card shows the prompt, a "not found" note and a Generate button; generating adds a new version.
import { helpers, mediaLog } from '../lib/media.mjs';

export default async function (page, shots) {
  const h = helpers(page);
  await page.evaluate(async () => {
    document.querySelector('.character_select')?.click();
    await new Promise((r) => setTimeout(r, 2500));
  });
  const fig = () => h.lastMes().locator('.image-figure').first();
  await fig().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${shots}/media-image-missing-1-before.png` });
  // Clear the media store, then reload the chat so the cards mount again.
  await page.evaluate(() => new Promise((r) => { const q = indexedDB.deleteDatabase('advanced-preset-media'); q.onsuccess = q.onerror = q.onblocked = () => r(); }));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.evaluate(async () => {
    document.querySelector('.character_select')?.click();
    await new Promise((r) => setTimeout(r, 3000));
  });
  await fig().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shots}/media-image-missing-2-gone.png` });
  console.log('figure text', JSON.stringify(await fig().innerText()));
  const n = mediaLog().length;
  await fig().locator('button', { hasText: 'Generate' }).click();
  await fig().locator('.image-open img, .image-error').first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${shots}/media-image-missing-3-regenerated.png` });
  console.log('requests', mediaLog().length - n, 'pager', JSON.stringify(await fig().locator('.image-pager').innerText().catch(() => '')));
}

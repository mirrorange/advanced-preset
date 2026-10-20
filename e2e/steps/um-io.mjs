// Run after `um`: export all user modules, import the file back, then delete the copy.
export default async function (page, shots) {
  await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(400);
  await page.locator('ap-panel .tab').nth(2).click();
  await page.waitForTimeout(400);
  const rows = page.locator('ap-panel .um-row');
  const before = await rows.count();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('ap-panel .section', { has: page.locator('.um-list') }).locator('button[aria-label]').nth(2).click()]);
  const file = `${shots}/um-export.json`;
  await dl.saveAs(file);
  console.log('exported', dl.suggestedFilename(), (await import('node:fs')).readFileSync(file, 'utf8').slice(0, 300));
  await page.locator('ap-panel input[type=file][accept*=json]').last().setInputFiles(file);
  await page.waitForTimeout(800);
  console.log('rows', before, '→', await rows.count(), await rows.locator('.um-row-name').allTextContents());
  console.log('toasts', await page.evaluate(() => [...document.querySelectorAll('#toast-container .toast')].map((t) => t.textContent).join(' | ')));
  await page.locator('ap-panel .um-list').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${shots}/um-io.png` });
  await rows.last().locator('.um-open').click();
  await page.locator('ap-panel .um-foot .danger').click();
  await page.locator('ap-panel .um-foot .danger').click();
  await page.waitForTimeout(300);
  console.log('after delete', await rows.count());
}

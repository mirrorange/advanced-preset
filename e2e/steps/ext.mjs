export default async function (page, shots) {
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2000);
  // open extensions drawer
  await page.locator('#extensions-settings-button .drawer-toggle').click();
  await page.waitForTimeout(800);
  const row = page.locator('ap-settings');
  console.log('settings row', await row.count());
  if (await row.count()) await row.first().screenshot({ path: `${shots}/ext-row.png` });
  await page.locator('#extensions-settings-button .drawer-toggle').click();
  await page.waitForTimeout(400);
  await page.locator('ap-topbar .topbar-btn').click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel .tab').nth(5).click();
  await page.waitForTimeout(300);
  for (const name of ['Last assembly', 'Requests']) {
    await page.locator('ap-panel .panel-body', { hasText: name }).locator(`text=${name}`).first().click();
    await page.waitForTimeout(400);
  }
  await page.locator('ap-panel .panel').screenshot({ path: `${shots}/debug-open.png` });
}

export default async function (page, shots) {
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2000);
  // open extensions drawer
  await page.locator('#extensions-settings-button .drawer-toggle').click();
  await page.waitForTimeout(800);
  const block = page.locator('#advanced_preset_settings');
  console.log('settings block', await block.count());
  await block.screenshot({ path: `${shots}/ext-collapsed.png` });
  await block.locator('.inline-drawer-toggle').click();
  await page.waitForTimeout(500);
  await page.locator('#extensions_settings2').screenshot({ path: `${shots}/ext-expanded.png` });
  // "Open panel" closes the extensions drawer and opens the AI Response Configuration drawer with AP on top.
  await block.locator('.menu_button').click();
  await page.waitForTimeout(800);
  console.log('drawer open', await page.evaluate(() => document.getElementById('left-nav-panel').classList.contains('openDrawer')), 'panel', await page.locator('ap-panel .panel').count());
  await page.locator('ap-panel .tab').nth(5).click();
  await page.waitForTimeout(300);
  for (const name of ['Last assembly', 'Requests']) {
    await page.locator('ap-panel .panel-body', { hasText: name }).locator(`text=${name}`).first().click();
    await page.waitForTimeout(400);
  }
  await page.locator('ap-panel .panel').screenshot({ path: `${shots}/debug-open.png` });
}

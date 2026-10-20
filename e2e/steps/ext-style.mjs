// Extension settings block next to a built-in one.
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || '1400x900';
  if (process.env.AP_LANG) {
    await page.evaluate((l) => localStorage.setItem('language', l), process.env.AP_LANG);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 60000 });
    await page.waitForTimeout(3000);
  }
  await page.locator('#extensions-settings-button .drawer-toggle').click();
  await page.waitForTimeout(800);
  for (const sel of ['.vectors_settings', '#advanced_preset_settings']) {
    const head = page.locator(`${sel} .inline-drawer-toggle`).first();
    await head.scrollIntoViewIfNeeded();
    await head.click();
    await page.waitForTimeout(400);
  }
  await page.locator('#advanced_preset_settings').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${shots}/ext-style-${tag}.png` });
}

import fs from 'node:fs';
export default async function (page, shots) {
  await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(300);
  const head = page.locator('ap-panel .panel-head input[role=switch]');
  if (!(await head.isChecked())) await page.locator('ap-panel .panel-head .switch').click();
  await page.locator('ap-panel .tab').nth(5).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel input[type=text], ap-panel input[type=url]').first().fill('http://127.0.0.1:4747');
  await page.locator('ap-panel .panel-body .switch').first().click();
  await page.waitForTimeout(3000);
  console.log('presets', JSON.stringify(await page.evaluate(() => window.AdvancedPreset.listPresets())));
  await page.screenshot({ path: `${shots}/dev-1.png` });
  const f = `${process.env.AP_PETALS || '../petals-preset'}/preset.yaml`;
  const src = fs.readFileSync(f, 'utf8');
  fs.writeFileSync(f, src.replace('name: Petals Preset', 'name: Petals Preset DEV'));
  await page.waitForTimeout(4000);
  console.log('after edit', JSON.stringify(await page.evaluate(() => window.AdvancedPreset.listPresets())));
  await page.screenshot({ path: `${shots}/dev-2.png` });
  fs.writeFileSync(f, src);
  await page.waitForTimeout(3000);
  // turn off
  await page.locator('ap-panel .panel-body .switch').first().click();
  await page.waitForTimeout(1000);
  console.log('off', JSON.stringify(await page.evaluate(() => window.AdvancedPreset.listPresets())));
}

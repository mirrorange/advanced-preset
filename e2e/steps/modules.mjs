// Modules tab: user modules on top; optional exclusive sets have a switch and show choices only while on.
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || '1400x900';
  await page.evaluate(() => document.getElementById('ap-preset-button').click());
  await page.waitForTimeout(800);
  const head = page.locator('ap-panel .panel-head input[role=switch]');
  if (!(await head.isChecked())) await page.locator('ap-panel .panel-head .switch').click();
  await page.waitForTimeout(1500);
  await page.locator('ap-panel .tab').nth(0).click();
  await page.waitForTimeout(300);
  await page.locator('ap-panel [role=button]', { hasText: /Petals|花瓣/ }).first().click();
  await page.waitForTimeout(1500);
  await page.locator('ap-panel .tab').nth(2).click();
  await page.waitForTimeout(400);
  const titles = () => page.evaluate(() => [...document.querySelector('ap-panel').shadowRoot.querySelectorAll('.section .card-title')].map((x) => x.textContent));
  const radios = (section) => section.locator('.choice').count();
  console.log('sections', JSON.stringify(await titles()));
  await page.locator('ap-panel .panel-body').screenshot({ path: `${shots}/modules-${tag}.png` });

  const guide = page.locator('ap-panel .section').filter({ has: page.locator('.card-title', { hasText: /^(Guidelines|写作指南)$/ }) });
  const narrativeRow = guide.locator('.module-row').first();
  console.log('narrative row', await narrativeRow.innerText(), 'radios', await radios(guide));
  await narrativeRow.locator('.switch').click();
  await page.waitForTimeout(300);
  console.log('after toggle radios', await radios(guide));
  await guide.screenshot({ path: `${shots}/modules-guidelines-a-${tag}.png` });
  if (await radios(guide)) { await guide.locator('.choice').nth(1).click(); await page.waitForTimeout(200); }
  await narrativeRow.locator('.switch').click(); await page.waitForTimeout(200);
  console.log('off radios', await radios(guide));
  await narrativeRow.locator('.switch').click(); await page.waitForTimeout(200);
  console.log('restored choice', await guide.locator('.choice.on').innerText().catch(() => '-'));
  await guide.screenshot({ path: `${shots}/modules-guidelines-b-${tag}.png` });

  const style = page.locator('ap-panel .section').filter({ has: page.locator('.card-title', { hasText: /^(Writing Style|文风)$/ }) });
  console.log('style radios', await radios(style), 'header switch', await style.locator('.card-head .switch').count());
  await style.screenshot({ path: `${shots}/modules-style-on-${tag}.png` });
  await style.locator('.card-head .switch').click(); await page.waitForTimeout(300);
  console.log('style off radios', await radios(style));
  await style.screenshot({ path: `${shots}/modules-style-off-${tag}.png` });
  const active = await page.evaluate(() => JSON.stringify(Object.entries(window.AdvancedPreset?.debug?.modules?.() ?? {}).length));
  console.log('debug', active);
  await style.locator('.card-head .switch').click(); await page.waitForTimeout(300);
}

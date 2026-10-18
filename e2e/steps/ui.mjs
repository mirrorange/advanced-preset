// Panel placement: entry in the Chat Completion presets header, panel overlaid on the drawer.
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || '1400x900';
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(1500);
  await page.locator('#ai-config-button > .drawer-toggle').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shots}/ui-drawer-${tag}.png` });
  await page.locator('#ap-preset-button').click();
  await page.waitForTimeout(600);
  const tabs = page.locator('ap-panel .tab');
  const n = await tabs.count();
  for (let i = 0; i < n; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${shots}/ui-panel-${i}-${tag}.png` });
  }
  const box = await page.evaluate(() => {
    const r = (s) => { const el = document.querySelector('ap-panel')?.shadowRoot?.querySelector(s) ?? document.querySelector(s); const b = el?.getBoundingClientRect(); return b && [b.x, b.y, b.width, b.height].map(Math.round); };
    return { drawer: r('#left-nav-panel'), panel: r('.panel'), head: r('.panel-head'), tabs: r('.tabs'), vw: innerWidth, vh: innerHeight };
  });
  console.log(JSON.stringify(box));
  await page.locator('ap-panel .panel-head .icon-btn').last().click();
  await page.waitForTimeout(400);
  console.log('closed:', await page.evaluate(() => !document.querySelector('ap-panel').shadowRoot.querySelector('.panel')));
}

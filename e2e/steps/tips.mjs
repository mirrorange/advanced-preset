// Tooltips: shown in the top layer, never clipped by the panel body or the drawer.
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || '1400x900';
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('ap-preset-button').click());
  await page.waitForTimeout(800);
  await page.locator('ap-panel .tab').nth(3).click();
  await page.waitForTimeout(400);
  const report = async (name) => {
    const r = await page.evaluate(() => {
      const root = document.querySelector('ap-panel').shadowRoot;
      const b = root.querySelector('.tip-bubble');
      if (!b) return null;
      const x = b.getBoundingClientRect();
      return { open: b.matches(':popover-open'), side: b.dataset.side, rect: [x.left, x.top, x.right, x.bottom].map(Math.round), vw: innerWidth, vh: innerHeight };
    });
    console.log(name, JSON.stringify(r));
    await page.screenshot({ path: `${shots}/tip-${name}-${tag}.png` });
  };
  await page.locator('ap-panel .section .help .icon-btn').first().hover();
  await page.waitForTimeout(300);
  await report('first-section');
  await page.locator('ap-panel .panel-head .icon-btn').last().hover();
  await page.waitForTimeout(300);
  await report('close');
  // Scroll to the bottom and use the last help icon.
  await page.locator('ap-panel .section .help .icon-btn').last().scrollIntoViewIfNeeded();
  await page.locator('ap-panel .section .help .icon-btn').last().hover();
  await page.waitForTimeout(300);
  await report('last-section');
}

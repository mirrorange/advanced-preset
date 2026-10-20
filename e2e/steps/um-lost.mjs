import fs from 'node:fs';
// Run after `um`: drops the `after-identity` point in the dev source and bumps the version.
export default async function (page, shots) {
  const f = `${process.env.AP_PETALS || '../petals-preset'}/preset.yaml`;
  const src = fs.readFileSync(f, 'utf8');
  const shot = async (name) => {
    const box = await page.locator('ap-panel .panel-head').evaluate((h) => { const r = h.parentElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await page.screenshot({ path: `${shots}/um-lost-${name}.png`, clip: box });
  };
  try {
    await page.waitForTimeout(3000);
    fs.writeFileSync(f, src.replace(/version: 7\.3\.0/, 'version: 7.3.1').replace(/  - id: after-identity\n(    .*\n){4}/, ''));
    await page.waitForTimeout(5000);
    console.log('toasts', await page.evaluate(() => [...document.querySelectorAll('#toast-container .toast')].map((t) => t.textContent).join(' | ')));
    await page.evaluate(() => window.AdvancedPreset.togglePanel());
    await page.waitForTimeout(400);
    await page.locator('ap-panel .tab').nth(2).click();
    await page.waitForTimeout(400);
    await page.locator('ap-panel .um-list').scrollIntoViewIfNeeded();
    await page.locator('ap-panel .um-flag').first().hover();
    await page.waitForTimeout(400);
    await shot('list');
    await page.locator('ap-panel .um-open').first().click();
    await page.waitForTimeout(400);
    await shot('editor');
  } finally { fs.writeFileSync(f, src); }
}

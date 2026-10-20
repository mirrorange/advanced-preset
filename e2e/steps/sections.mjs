// Section spacing: header-only sections (Token saving off) have equal top / bottom padding.
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || '1400x900';
  await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(800);
  await page.locator('ap-panel .tab').nth(3).click();
  await page.waitForTimeout(400);
  const measure = () => page.evaluate(() => {
    const root = document.querySelector('ap-panel').shadowRoot;
    return [...root.querySelectorAll('.section')].map((s) => {
      const a = s.getBoundingClientRect(); const h = s.querySelector('.card-head').getBoundingClientRect();
      const t = s.querySelector('.card-title').getBoundingClientRect();
      return { title: s.querySelector('.card-title').textContent, above: Math.round(t.top - a.top), below: Math.round(a.bottom - t.bottom), headH: Math.round(h.height), total: Math.round(a.height) };
    });
  });
  console.log(JSON.stringify(await measure()));
  const ts = page.locator('ap-panel .section', { hasText: /Token/ });
  await ts.screenshot({ path: `${shots}/section-token-off-${tag}.png` });
  await ts.locator('.switch').click();
  await page.waitForTimeout(300);
  await ts.screenshot({ path: `${shots}/section-token-on-${tag}.png` });
  await ts.locator('.switch').click();
}

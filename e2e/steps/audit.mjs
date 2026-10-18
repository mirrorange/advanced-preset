// Layout audit: every panel control is inside the panel horizontally and not covered by ST UI.
export default async function (page, shots) {
  const tag = process.env.AP_VIEWPORT || '1400x900';
  if (!process.env.AP_NOCHAR) {
    await page.evaluate(() => document.querySelector('.character_select')?.click());
    await page.waitForTimeout(1500);
  }
  await page.evaluate(() => document.getElementById('ap-preset-button').click());
  await page.waitForTimeout(800);
  const n = await page.locator('ap-panel .tab').count();
  for (let i = 0; i < n; i++) {
    await page.locator('ap-panel .tab').nth(i).click();
    await page.waitForTimeout(350);
    // expand collapsible sections so their content is audited too
    for (const h of await page.locator('ap-panel .section.closed .card-head.clickable').all()) await h.click().catch(() => {});
    await page.waitForTimeout(200);
    const res = await page.evaluate(() => {
      const host = document.querySelector('ap-panel');
      const root = host.shadowRoot;
      const panel = root.querySelector('.panel').getBoundingClientRect();
      const body = root.querySelector('.panel-body');
      const out = { overflowX: [], covered: [], hscroll: body.scrollWidth > body.clientWidth + 1 };
      const sel = '.panel-head *, .tab, .panel-body button, .panel-body input, .panel-body select, .panel-body textarea, .panel-body .card-title, .panel-body .chip';
      const br = body.getBoundingClientRect();
      for (const el of root.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.left < panel.left - 0.5 || r.right > panel.right + 0.5) out.overflowX.push(`${el.className || el.tagName} ${Math.round(r.left)}-${Math.round(r.right)}`);
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const inBody = el.closest('.panel-body');
        if (inBody && (cy < br.top || cy > br.bottom)) continue; // scrolled out of view
        if (cy > innerHeight || cx > innerWidth) { out.covered.push(`${el.className} offscreen`); continue; }
        const top = document.elementFromPoint(cx, cy);
        if (top !== host) out.covered.push(`${el.className || el.tagName} by ${top?.id || top?.className || top?.tagName}`);
      }
      out.overflowX = out.overflowX.slice(0, 6); out.covered = out.covered.slice(0, 6);
      return out;
    });
    const bad = res.overflowX.length || res.covered.length || res.hscroll;
    console.log(`${tag} tab${i}`, bad ? JSON.stringify(res) : 'ok');
    await page.screenshot({ path: `${shots}/audit-${i}-${tag}.png` });
  }
}

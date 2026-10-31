// Panel over ST themes (I-122): AP_THEMES=Azure,"Dark V 1.0",... screenshots the open panel per theme.
export default async function (page, shots) {
  const themes = (process.env.AP_THEMES || 'Azure').split(',');
  for (const theme of themes) {
    await page.evaluate((t) => window.jQuery('#themes').val(t).trigger('change'), theme);
    await page.waitForTimeout(800);
    await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
    await page.waitForTimeout(900);
    const info = await page.evaluate(() => {
      const d = document.getElementById('left-nav-panel');
      const p = document.querySelector('ap-panel')?.shadowRoot?.querySelector('.panel');
      const kids = [...d.children].filter((c) => c.localName !== 'ap-panel');
      return { covering: d.classList.contains('ap-panel-covering'), drawerBg: getComputedStyle(d).backgroundColor,
        panelBg: p && getComputedStyle(p).backgroundColor, visibleKids: kids.filter((c) => getComputedStyle(c).visibility !== 'hidden').length };
    });
    console.log(theme, JSON.stringify(info));
    await page.screenshot({ path: `${shots}/theme-${theme.replace(/\W+/g, '_')}.png` });
    await page.evaluate(() => window.AdvancedPreset.togglePanel(false));
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => document.getElementById('left-nav-panel').classList.contains('ap-panel-covering'));
    console.log(theme, 'after close covering =', after);
  }
}

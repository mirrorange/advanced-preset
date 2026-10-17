export default async function (page, shots) {
  const theme = process.env.AP_THEME;
  if (theme === 'light') {
    await page.evaluate(() => { document.documentElement.style.setProperty('--SmartThemeBodyColor', 'rgb(30,30,40)'); document.documentElement.style.setProperty('--SmartThemeBlurTintColor', 'rgba(245,245,250,0.95)'); document.documentElement.style.setProperty('--SmartThemeChatTintColor', 'rgba(250,250,252,0.95)'); document.documentElement.style.setProperty('--SmartThemeEmColor', 'rgb(90,90,100)'); document.documentElement.style.setProperty('--SmartThemeQuoteColor', 'rgb(200,90,20)'); document.body.style.background = '#f2f2f6'; window.SillyTavern.getContext().eventSource.emit('settings_updated'); });
  }
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(2500);
  // expand first stage chip
  const chip = page.locator('ap-stages .chip, ap-stages button').first();
  if (await chip.count()) { await chip.click(); await page.waitForTimeout(400); }
  await page.screenshot({ path: `${shots}/msg-${theme || 'dark'}.png` });
  await page.locator('ap-topbar .topbar-btn').click();
  await page.waitForTimeout(600);
  const tabs = page.locator('ap-panel .tab');
  const n = await tabs.count();
  for (let i = 0; i < n; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${shots}/panel-${i}-${theme || 'dark'}.png` });
  }
}

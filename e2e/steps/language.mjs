// Interface language (Presets → Appearance): pick 繁體中文 / English / follow SillyTavern; the open
// panel re-renders at once (tab labels, the select's own label) and the choice is saved in ui.language.
export default async function (page, shots) {
  const tabLabels = () => page.locator('ap-panel .tab span').allTextContents();
  const choose = async (value) => {
    await page.locator('ap-panel select:has(option[value="zh-tw"])').selectOption(value);
    await page.waitForTimeout(400);
  };
  await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(600);
  await page.locator('ap-panel .tab').first().click();
  const head = page.locator('ap-panel .card-head', { hasText: /Appearance|外观|外觀/ });
  await head.click();
  await page.waitForTimeout(400);
  const stored = () => page.evaluate(() => SillyTavern.getContext().extensionSettings.advancedPreset.ui.language ?? '');
  const st = await tabLabels();
  console.log('follow ST:', st.join(' | '), JSON.stringify(await stored()));

  await choose('zh-tw');
  const tw = await tabLabels();
  console.log('zh-tw:', tw.join(' | '), JSON.stringify(await stored()));
  if (!tw.includes('預設') || !tw.includes('模組')) throw new Error('zh-tw tabs not shown: ' + tw.join(','));
  if (!(await page.locator('ap-panel .card-head', { hasText: '外觀' }).count())) throw new Error('Appearance title not re-rendered');
  await page.screenshot({ path: `${shots}/language-zh-tw.png` });

  await choose('zh-cn');
  const cn = await tabLabels();
  console.log('zh-cn:', cn.join(' | '));
  if (!cn.includes('预设') || !cn.includes('模组')) throw new Error('zh-cn tabs not shown');
  // The preset's own panel translation (Petals ships locales/zh-cn.yaml) follows the same setting.
  if (!(await page.locator('ap-panel', { hasText: '花瓣预设' }).count())) throw new Error('preset locale not applied');

  await choose('en');
  const en = await tabLabels();
  console.log('en:', en.join(' | '), JSON.stringify(await stored()));
  if (!en.includes('Presets')) throw new Error('en tabs not shown');

  // Kept across a reload.
  await choose('zh-tw');
  await page.waitForTimeout(2500); // ST saves settings debounced
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.AdvancedPreset, null, { timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.AdvancedPreset.togglePanel());
  await page.waitForTimeout(600);
  const again = await tabLabels();
  console.log('after reload:', again.join(' | '));
  if (!again.includes('預設')) throw new Error('zh-tw not kept after reload');
  await page.locator('ap-panel .tab').first().click();
  if (!(await page.locator('ap-panel select:has(option[value="zh-tw"])').count())) await page.locator('ap-panel .card-head', { hasText: '外觀' }).click();
  await page.waitForTimeout(400);

  await choose('');
  console.log('back to ST:', (await tabLabels()).join(' | '), JSON.stringify(await stored()));
  if ((await stored()) !== '') throw new Error('ui.language not cleared');
  if ((await tabLabels()).join() !== st.join()) throw new Error('not back to the ST language');
}

export default async function (page, shots) {
  await page.evaluate(() => document.querySelector('.character_select')?.click());
  await page.waitForTimeout(3000);
  const n = Number(process.env.AP_NTH || 1);
  const mes = page.locator('#chat .mes').nth(-n);
  await mes.scrollIntoViewIfNeeded();
  if (process.env.AP_CLICK) { await mes.locator(process.env.AP_CLICK).first().click(); await page.waitForTimeout(400); }
  await mes.screenshot({ path: `${shots}/last.png` });
}

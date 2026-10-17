export default async function (page, shots) {
  const transport = process.env.AP_TRANSPORT || 'structured';
  const r = await page.evaluate(async (transport) => {
    const $ = window.jQuery;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const opt = [...document.querySelectorAll('#settings_preset_openai option')].find((o) => o.textContent.startsWith('AP ·'));
    if (!opt) return { err: 'no carrier', opts: [...document.querySelectorAll('#settings_preset_openai option')].map((o) => o.textContent) };
    $('#settings_preset_openai').val(opt.value).trigger('change');
    await sleep(1500);
    // open first character
    document.querySelector('.character_select')?.click();
    await sleep(2500);
    return { active: window.AdvancedPreset.activePresetId(), carrier: opt.textContent, chatLen: SillyTavern.getContext().chat.length };
  }, transport);
  console.log(JSON.stringify(r));
  if (r.err) return;
  if (process.env.AP_SETUP) await page.evaluate(new Function('return (' + process.env.AP_SETUP + ')()'));
  await page.fill('#send_textarea', 'Mira walks to the lighthouse.');
  await page.click('#send_but');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${shots}/chat-streaming-${transport}.png` });
  await page.waitForFunction(() => !document.querySelector('#mes_stop') || getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => {
    const c = SillyTavern.getContext().chat;
    const last = c[c.length - 1];
    return { len: c.length, last: { mes: last.mes, extra: Object.keys(last.extra || {}), ap: last.extra?.advanced_preset ? JSON.stringify(last.extra.advanced_preset).slice(0, 800) : null } };
  });
  console.log(JSON.stringify(after, null, 1));
  await page.screenshot({ path: `${shots}/chat-done-${transport}.png` });
}

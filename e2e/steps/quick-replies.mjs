// Quick Reply sets of the active preset: in the global list with the Carrier selected, gone with
// another preset; Petals' buttons append to / fill the input box. Fresh ST (or after setup).
export default async function (page, shots) {
  const select = async (match) => page.evaluate(async (match) => {
    const $ = window.jQuery;
    const opt = [...document.querySelectorAll('#settings_preset_openai option')].find((o) => (match ? o.textContent.startsWith('AP ·') : !o.textContent.startsWith('AP ·')));
    $('#settings_preset_openai').val(opt.value).trigger('change');
    await new Promise((r) => setTimeout(r, 2500));
    return opt.textContent;
  }, match);
  const state = () => page.evaluate(() => {
    const api = globalThis.quickReplyApi;
    const set = api.getSetByName('AP · Petals Preset');
    return {
      active: window.AdvancedPreset.activePresetId(),
      global: api.listGlobalSets(),
      set: set && { disableSend: set.disableSend, qr: set.qrList.map((q) => ({ id: q.id, label: q.label, icon: q.icon, title: q.title, message: q.message })) },
      buttons: [...document.querySelectorAll('#qr--bar .qr--button')].map((b) => ({ title: b.title, icon: b.querySelector('.qr--button-icon')?.className })),
      owned: SillyTavern.getContext().extensionSettings.advancedPreset.quickReplies,
    };
  });

  // Quick Replies are off by default in a fresh ST.
  await page.evaluate(() => { const s = SillyTavern.getContext().extensionSettings.quickReplyV2; if (s && !s.isEnabled) document.querySelector('#qr--isEnabled')?.click(); });
  await page.waitForTimeout(500);

  await select(true);
  const on = await state();
  console.log('with Petals', JSON.stringify(on, null, 1));
  await page.screenshot({ path: `${shots}/qr-on.png` });

  // Buttons: meta appends to the draft, branch appends #?.
  const click = async (icon) => page.evaluate(async (icon) => {
    document.querySelector(`#qr--bar .qr--button:has(.${icon})`).click();
    await new Promise((r) => setTimeout(r, 800));
    return document.querySelector('#send_textarea').value;
  }, icon);
  await page.fill('#send_textarea', 'She opens the door.');
  console.log('meta →', JSON.stringify(await click('fa-at')));
  await page.fill('#send_textarea', 'Meanwhile in the cellar');
  console.log('branch →', JSON.stringify(await click('fa-code-branch')));
  await page.fill('#send_textarea', '');
  console.log('storyline (empty) →', JSON.stringify(await click('fa-hashtag')));
  // Summary sends its meta instruction with the draft as a hint (the send button is held here).
  await page.evaluate(() => document.querySelector('#send_but').addEventListener('click', (e) => { e.stopImmediatePropagation(); window.__apSent = document.querySelector('#send_textarea').value; }, { capture: true, once: true }));
  await page.fill('#send_textarea', 'Keep it short. #cellar');
  await click('fa-scroll');
  console.log('summary sends', JSON.stringify(await page.evaluate(() => window.__apSent)));
  await page.fill('#send_textarea', '');

  await select(false);
  const off = await state();
  console.log('with another preset', JSON.stringify({ active: off.active, global: off.global, set: Boolean(off.set), buttons: off.buttons.length }));

  await select(true);
  const back = await state();
  console.log('back to Petals', JSON.stringify({ global: back.global, replies: back.set?.qr.length, buttons: back.buttons.length }));
}

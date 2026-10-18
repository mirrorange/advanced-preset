// Select the built-in AP Carrier in ST's Chat Completion preset list.
export default async function (page) {
  const r = await page.evaluate(async () => {
    const sel = document.getElementById('settings_preset_openai');
    const opt = [...sel.options].find((o) => o.textContent.startsWith('AP · '));
    window.jQuery(sel).val(opt.value).trigger('change');
    await new Promise((res) => setTimeout(res, 2000));
    return window.AdvancedPreset.activePresetId();
  });
  console.log('active:', r);
}

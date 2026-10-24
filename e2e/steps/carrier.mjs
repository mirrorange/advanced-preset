export default async function (page) {
  const r = await page.evaluate(async () => {
    const $ = window.jQuery;
    const opt = [...document.querySelectorAll('#settings_preset_openai option')].find((o) => o.textContent.startsWith('AP ·'));
    $('#settings_preset_openai').val(opt.value).trigger('change');
    await new Promise((r) => setTimeout(r, 2500));
    return window.AdvancedPreset.activePresetId();
  });
  console.log('active', r);
}

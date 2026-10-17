export default async function (page, shots) {
  const info = await page.evaluate(async () => {
    const $ = window.jQuery;
    $('#main_api').val('openai').trigger('change');
    $('#chat_completion_source').val('custom').trigger('change');
    $('#custom_api_url_text').val('http://127.0.0.1:5055/v1').trigger('input');
    $('#custom_model_id').val('mock-1').trigger('input');
    $('#stream_toggle').prop('checked', true).trigger('change');
    await new Promise((r) => setTimeout(r, 500));
    $('#api_button_openai').trigger('click');
    await new Promise((r) => setTimeout(r, 2000));
    const opts = [...document.querySelectorAll('#settings_preset_openai option')].map((o) => o.textContent);
    return { ap: { v: window.AdvancedPreset.version, presets: window.AdvancedPreset.listPresets().map((p) => p.id ?? p), active: window.AdvancedPreset.activePresetId() }, opts };
  });
  console.log(JSON.stringify(info, null, 1));
  await page.screenshot({ path: `${shots}/setup.png` });
}

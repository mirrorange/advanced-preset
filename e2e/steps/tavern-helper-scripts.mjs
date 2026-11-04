// Tavern Helper scripts of a preset: needs Tavern Helper (JS-Slash-Runner) installed in ST and
// `ap dev --port 4747` on a Petals copy with tavern-helper-scripts/ (AP_TH_DIR, default /tmp/petals-th):
//   tavern-helper-scripts/e2e.yaml  { name: AP e2e, content: ./tavern-helper-scripts/e2e.js, data: { greeting: hi } }
//   tavern-helper-scripts/e2e.js    window.parent.document.body.dataset.apThE2e = 'v1';
// The scripts reach the Carrier; Tavern Helper (not AP) asks before running them; a rebuild of the
// Carrier in use keeps the switches and data and offers a reload, after which the new code runs.
import fs from 'node:fs';

const dir = process.env.AP_TH_DIR || '/tmp/petals-th';
const code = (v) => fs.writeFileSync(`${dir}/tavern-helper-scripts/e2e.js`, `window.parent.document.body.dataset.apThE2e = '${v}';\n`);

const ready = async (page) => {
  await page.waitForFunction(() => window.AdvancedPreset && SillyTavern.getContext().eventSource.autoFireLastArgs?.has('app_ready'), null, { timeout: 60000 });
  await page.waitForTimeout(4000);
};
const state = (page) => page.evaluate(() => {
  const ctx = SillyTavern.getContext();
  const th = ctx.chatCompletionSettings.extensions?.tavern_helper;
  return {
    active: window.AdvancedPreset.activePresetId(),
    selected: ctx.getPresetManager('openai').getSelectedPresetName(),
    scripts: th?.scripts?.map((s) => ({ name: s.name, enabled: s.enabled, content: s.content, data: s.data })),
    variables: th?.variables,
    saved: (() => { const pm = ctx.getPresetManager('openai'); const t = pm.getCompletionPresetByName(pm.getSelectedPresetName())?.extensions?.tavern_helper; return t && { data: t.scripts?.map((s) => s.data), variables: t.variables }; })(),
    trusted: ctx.extensionSettings.tavern_helper?.script?.enabled?.presets ?? null,
    ran: document.body.dataset.apThE2e ?? null,
  };
});

export default async function (page, shots) {
  code('v1');
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const s = SillyTavern.getContext().extensionSettings.advancedPreset;
    s.dev = { url: 'http://127.0.0.1:4747', enabled: true };
    // Fresh Tavern Helper trust state for the Carrier (it asks once per preset name).
    const th = SillyTavern.getContext().extensionSettings.tavern_helper?.script;
    if (th) for (const k of ['enabled', 'popuped']) th[k].presets = th[k].presets.filter((n) => !n.startsWith('AP ·'));
    SillyTavern.getContext().saveSettingsDebounced();
    // Start away from the Carrier, so this run does not depend on what an earlier run left in it.
    const opts = [...document.querySelectorAll('#settings_preset_openai option')];
    window.jQuery('#settings_preset_openai').val(opts.find((o) => !o.textContent.startsWith('AP ·')).value).trigger('change');
  });
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page);

  console.log('offers at start', await page.locator('dialog', { hasText: /Tavern Helper scripts of|酒馆助手脚本已更新/ }).count());
  // Select the Carrier: Tavern Helper reads preset scripts on a preset change.
  await page.evaluate(() => {
    const opts = [...document.querySelectorAll('#settings_preset_openai option')];
    window.jQuery('#settings_preset_openai').val(opts.find((o) => o.textContent.startsWith('AP ·')).value).trigger('change');
  });
  await page.waitForTimeout(2500);
  const before = await state(page);
  console.log('before trust', JSON.stringify(before, null, 1));
  const ask = page.getByText(/嵌入式脚本|embedded scripts/i).first();
  console.log('tavern helper asks', await ask.count());
  await page.screenshot({ path: `${shots}/th-ask.png` });
  await page.getByRole('button', { name: /^(确认|Confirm)$/ }).first().click();
  await page.waitForTimeout(3000);
  const trusted = await state(page);
  console.log('after trust', JSON.stringify(trusted, null, 1));

  // What Tavern Helper / the user do meanwhile: a script variable and a preset variable.
  await page.evaluate(async () => {
    const ctx = SillyTavern.getContext();
    const pm = ctx.getPresetManager('openai');
    const name = pm.getSelectedPresetName();
    // As Tavern Helper saves: in the listed preset object, then to disk.
    const body = pm.getCompletionPresetByName(name);
    body.extensions.tavern_helper.scripts[0].data = { greeting: 'changed', mine: 1 };
    body.extensions.tavern_helper.variables = { score: 3 };
    await pm.savePreset(name, body, { skipUpdate: true });
  });

  // New code in the source: `ap dev` rebuilds, AP rebuilds the Carrier in use and offers a reload.
  code('v2');
  const offer = page.locator('dialog', { hasText: /Tavern Helper scripts of|酒馆助手脚本已更新/ }).first();
  await offer.waitFor({ timeout: 30000 }).catch(() => {});
  console.log('reload offered', await offer.count());
  await page.screenshot({ path: `${shots}/th-reload.png` });
  const saved = await page.evaluate(() => {
    const pm = SillyTavern.getContext().getPresetManager('openai');
    const th = pm.getCompletionPresetByName(pm.getSelectedPresetName()).extensions.tavern_helper;
    return { content: th.scripts[0].content, data: th.scripts[0].data, enabled: th.scripts[0].enabled, variables: th.variables };
  });
  console.log('rebuilt carrier', JSON.stringify(saved));
  if (await offer.count()) await offer.locator('.popup-button-ok').click();
  await page.waitForEvent('load', { timeout: 30000 }).catch(() => {});
  await ready(page);
  console.log('after reload', JSON.stringify(await state(page), null, 1));
  console.log('asked again', await page.getByText(/嵌入式脚本|embedded scripts/i).count());
  console.log('offered again', await page.locator('dialog', { hasText: /Tavern Helper scripts of|酒馆助手脚本已更新/ }).count());

  // "Later": Tavern Helper keeps the old scripts and saves them back with a preset variable; the
  // next start notices the write-back (exactly the previous code), restores the code and offers a reload.
  const file = () => JSON.parse(fs.readFileSync(`${process.env.ST_DATA || '/tmp/st/data/default-user'}/OpenAI Settings/AP · Petals Preset.json`, 'utf8')).extensions.tavern_helper.scripts[0].content.trim().slice(-5);
  code('v3');
  await offer.waitFor({ timeout: 30000 }).catch(() => {});
  console.log('offered for v3', await offer.count(), 'file', file());
  if (await offer.count()) await offer.locator('.popup-button-cancel').click();
  await page.evaluate(() => TavernHelper.insertOrAssignVariables({ touched: 1 }, { type: 'preset' }));
  await page.waitForTimeout(4000);
  console.log('after later + variable write: file', file(), 'ran', await page.evaluate(() => document.body.dataset.apThE2e));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await offer.waitFor({ timeout: 30000 }).catch(() => {});
  console.log('repaired on start: offered', await offer.count(), 'file', file());
  if (await offer.count()) await offer.locator('.popup-button-ok').click();
  await page.waitForEvent('load', { timeout: 30000 }).catch(() => {});
  await ready(page);
  console.log('after second reload: ran', await page.evaluate(() => document.body.dataset.apThE2e), 'file', file(),
    'offered again', await offer.count());

  // Leave with another preset selected, so the next start does not rebuild the Carrier in use.
  code('v1');
  await page.evaluate(() => {
    const s = SillyTavern.getContext().extensionSettings.advancedPreset;
    s.dev = { ...s.dev, enabled: false };
    SillyTavern.getContext().saveSettingsDebounced();
    const opts = [...document.querySelectorAll('#settings_preset_openai option')];
    window.jQuery('#settings_preset_openai').val(opts.find((o) => !o.textContent.startsWith('AP ·')).value).trigger('change');
  });
  await page.waitForTimeout(1500);
}

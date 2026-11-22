// Groups in "My modules" (needs `ap dev --port 4747` on a Petals copy, like `um`): create a group,
// drag modules into it, single choice keeps one on, a collapsed group takes a drop, drag a module
// back out, export the group and import it again, reorder groups, delete a group with its modules.
import fs from 'node:fs';
const en = JSON.parse(fs.readFileSync(new URL('../../i18n/en.json', import.meta.url), 'utf8'));
const P = (s) => `ap-panel ${s}`;
const btn = (label) => `button[aria-label="${label}"]`;

const stored = (page) => page.evaluate(() => {
  const s = SillyTavern.getContext().extensionSettings.advancedPreset ?? SillyTavern.getContext().extensionSettings.advanced_preset;
  const st = s?.presets?.petals ?? {};
  return { modules: (st.userModules ?? []).map((m) => ({ name: m.name, group: m.group ?? null, on: m.enabled })), groups: (st.userModuleGroups ?? []).map((g) => ({ id: g.id, name: g.name, mode: g.mode, collapsed: !!g.collapsed })) };
});
const shot = async (page, shots, name) => {
  const box = await page.locator(P('.panel-head')).evaluate((h) => { const r = h.parentElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  await page.screenshot({ path: `${shots}/um-groups-${name}.png`, clip: box });
};
const check = (ok, what) => console.log(ok ? 'ok  ' : 'FAIL', what);

/** Drag `from` (a grip) to the vertical middle (or `at`: 'top' / 'bottom') of `to` with pointer moves. */
async function dragTo(page, from, to, at = 'middle') {
  const a = await from.boundingBox();
  const b = await to.boundingBox();
  const y = at === 'top' ? b.y + 4 : at === 'bottom' ? b.y + b.height - 4 : b.y + b.height / 2;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2 + ((y - a.y - a.height / 2) * i) / 12);
    await page.waitForTimeout(30);
  }
  await page.mouse.up();
  await page.waitForTimeout(250);
}
const row = (page, name) => page.locator(P('.um-row'), { has: page.locator('.um-row-name', { hasText: new RegExp(`^${name}$`) }) });
const group = (page, i) => page.locator(P('.um-group')).nth(i);

async function newModule(page, name, inGroup) {
  await (inGroup ? inGroup.locator(btn(en['um.grp.addModule'])) : page.locator(`${P('.um-new')}, ${P(btn(en['um.new']))}`).first()).click();
  await page.waitForTimeout(200);
  if (await page.locator(P('.um-picker')).count()) await page.locator(P('.um-picker .um-choice')).first().click();
  await page.locator(P('.um-name')).fill(name);
  await page.locator(P('.um-text')).first().fill(`${name} text.`);
  await page.locator(P('.um-head button')).first().click();
  await page.waitForTimeout(300);
}

export default async function (page, shots) {
  if (!(await page.locator(P('.panel-head')).isVisible().catch(() => false))) {
    await page.evaluate(() => window.AdvancedPreset.togglePanel());
    await page.waitForTimeout(400);
  }
  const head = page.locator(P('.panel-head input[role=switch]'));
  if (!(await head.isChecked())) await page.locator(P('.panel-head .switch')).click();
  if (!(await page.evaluate(() => window.AdvancedPreset.listPresets())).some((p) => p.source === 'dev')) {
    await page.locator(P('.tab')).last().click();
    await page.waitForTimeout(300);
    await page.locator(P('input[type=text], ap-panel input[type=url]')).first().fill('http://127.0.0.1:4747');
    const dev = page.locator(P('.panel-body input[role=switch]')).first();
    if (!(await dev.isChecked())) await page.locator(P('.panel-body .switch')).first().click();
    await page.waitForTimeout(3000);
    await page.locator(P('.tab')).nth(0).click();
    await page.waitForTimeout(300);
    await page.locator(P('.panel-body [role=button][tabindex="0"]')).first().click();
    await page.waitForTimeout(1500);
  }
  await page.locator(P('.tab')).nth(2).click();
  await page.waitForTimeout(400);

  // start clean
  while (await page.locator(P('.um-group')).count()) {
    await group(page, 0).locator(btn(en['um.grp.delete'])).click();
    if (await page.locator(P('.um-delete-all')).count()) await page.locator(P('.um-delete-all')).click();
    await page.waitForTimeout(200);
  }
  while (await page.locator(P('.um-open')).count()) {
    await page.locator(P('.um-open')).first().click();
    await page.waitForTimeout(200);
    await page.locator(P('.um-foot .danger')).click();
    await page.locator(P('.um-foot .danger')).click();
    await page.waitForTimeout(300);
  }

  for (const n of ['Alpha', 'Beta', 'Gamma']) await newModule(page, n);
  await page.locator(P(btn(en['um.grp.new']))).click();
  await page.waitForTimeout(300);
  await page.keyboard.type('Styles');
  await group(page, 0).locator(btn(en['um.grp.multi'])).click();
  await page.waitForTimeout(200);
  let s = await stored(page);
  check(s.groups.length === 1 && s.groups[0].name === 'Styles' && s.groups[0].mode === 'single', `group created, renamed, single: ${JSON.stringify(s.groups)}`);
  await shot(page, shots, '1-new-group');

  // drag Alpha and Beta into the (empty) group: Beta joins switched off
  await dragTo(page, row(page, 'Alpha').locator('.um-grip'), group(page, 0).locator('.um-drop'));
  await dragTo(page, row(page, 'Beta').locator('.um-grip'), group(page, 0), 'bottom');
  s = await stored(page);
  const g = s.groups[0].id;
  check(JSON.stringify(s.modules) === JSON.stringify([{ name: 'Gamma', group: null, on: true }, { name: 'Alpha', group: g, on: true }, { name: 'Beta', group: g, on: false }]), `dragged into the group: ${JSON.stringify(s.modules)}`);
  check(await group(page, 0).locator('.um-radio').count() === 2, 'single group rows are radios');
  await shot(page, shots, '2-dragged');

  // radios: picking Beta switches Alpha off; picking Beta again switches it off (none on is allowed)
  await row(page, 'Beta').locator('.um-radio').click();
  s = await stored(page);
  check(s.modules.filter((m) => m.group === g && m.on).map((m) => m.name).join() === 'Beta', `single choice: ${JSON.stringify(s.modules)}`);
  await row(page, 'Beta').locator('.um-radio').click();
  s = await stored(page);
  check(!s.modules.some((m) => m.group === g && m.on), 'single group can be all off');
  await row(page, 'Alpha').locator('.um-radio').click();

  // reorder inside the group: Beta above Alpha
  await dragTo(page, row(page, 'Beta').locator('.um-grip'), row(page, 'Alpha'), 'top');
  s = await stored(page);
  check(s.modules.map((m) => m.name).join() === 'Gamma,Beta,Alpha', `reordered in group: ${s.modules.map((m) => m.name)}`);

  // a collapsed group takes a drop at its end; Gamma joins switched off (Alpha is on)
  await group(page, 0).locator(btn(en['um.grp.collapse'])).click();
  await page.waitForTimeout(200);
  await dragTo(page, row(page, 'Gamma').locator('.um-grip'), group(page, 0).locator('.um-group-head'));
  s = await stored(page);
  check(s.groups[0].collapsed && s.modules.map((m) => `${m.name}:${m.group === g}:${m.on}`).join() === 'Beta:true:false,Alpha:true:true,Gamma:true:false', `dropped on a collapsed group: ${JSON.stringify(s.modules)}`);
  check((await group(page, 0).locator('.um-group-count').textContent()).trim() === '3', 'count shows 3');
  await shot(page, shots, '3-collapsed');
  await group(page, 0).locator(btn(en['um.grp.expand'])).click();
  await page.waitForTimeout(200);

  // drag Gamma back out: the ungrouped drop zone appears while dragging
  const grip = row(page, 'Gamma').locator('.um-grip');
  const a = await grip.boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2 - 5);
  await page.waitForTimeout(150);
  const out = page.locator(P('.um-list[data-zone=""]'));
  check(await out.count() === 1, 'ungrouped drop zone while dragging');
  await shot(page, shots, '4-drop-out');
  const b = await out.boundingBox();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(a.x + a.width / 2, a.y + (b.y + b.height / 2 - a.y) * i / 10); await page.waitForTimeout(30); }
  await page.mouse.up();
  await page.waitForTimeout(250);
  s = await stored(page);
  check(s.modules[0].name === 'Gamma' && s.modules[0].group === null, `dragged out of the group: ${JSON.stringify(s.modules)}`);

  // export the group, import it back as a copy
  const [dl] = await Promise.all([page.waitForEvent('download'), group(page, 0).locator(btn(en['um.grp.export'])).click()]);
  const file = `${shots}/um-groups-export.json`;
  await dl.saveAs(file);
  const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
  check(dl.suggestedFilename() === 'petals.Styles.ap-modules.json' && exported.groups?.length === 1 && exported.modules.length === 2, `exported ${dl.suggestedFilename()}: ${exported.groups?.length} group, ${exported.modules.length} modules`);
  await page.locator(P('input[type=file][accept*=json]')).last().setInputFiles(file);
  await page.waitForTimeout(800);
  console.log('toasts', await page.evaluate(() => [...document.querySelectorAll('#toast-container .toast')].map((t) => t.textContent).join(' | ')));
  s = await stored(page);
  check(s.groups.length === 2 && s.groups[1].name === 'Styles' && s.groups[1].id !== g && s.modules.filter((m) => m.group === s.groups[1].id).length === 2, `imported as a new group: ${JSON.stringify(s.groups)}`);
  await group(page, 1).locator('.um-group-name').fill('Imported');
  await page.waitForTimeout(200);

  // reorder groups: Imported above Styles
  await dragTo(page, group(page, 1).locator('.um-group-head .um-grip'), group(page, 0), 'top');
  s = await stored(page);
  check(s.groups.map((x) => x.name).join() === 'Imported,Styles', `groups reordered: ${s.groups.map((x) => x.name)}`);
  check(s.modules.map((m) => m.name).join() === 'Gamma,Beta,Alpha,Beta,Alpha', `modules follow their group: ${s.modules.map((m) => m.name)}`);
  await shot(page, shots, '5-two-groups');

  // delete: keep the modules of one group, delete the other with its modules
  await group(page, 0).locator(btn(en['um.grp.delete'])).click();
  await page.waitForTimeout(150);
  await shot(page, shots, '6-delete-ask');
  await page.locator(P('.um-delete-all')).click();
  await page.waitForTimeout(200);
  await group(page, 0).locator(btn(en['um.grp.delete'])).click();
  await page.locator(P('.um-keep')).click();
  await page.waitForTimeout(200);
  s = await stored(page);
  check(!s.groups.length && s.modules.map((m) => `${m.name}:${m.group}`).join() === 'Gamma:null,Beta:null,Alpha:null', `deleted groups: ${JSON.stringify(s.modules)}`);
  await shot(page, shots, '7-deleted');
}

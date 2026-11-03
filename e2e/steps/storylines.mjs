// Storylines tab (I-164): the tab exists only while storylines are on; an expanded storyline has an
// icon toolbar (if-line, visibility, rename, make main); the freeze mode in the configuration (I-163).
// Needs `carrier` first. Builds a chat with a main storyline, a side story and an if-line.
export default async function (page, shots) {
  const sleep = (ms) => page.waitForTimeout(ms);
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector('.character_select')?.click();
    await wait(2500);
    const ctx = SillyTavern.getContext();
    const K = 'advanced_preset_storyline';
    const ai = (mes, line) => ({ name: ctx.name2, is_user: false, mes, send_date: String(Date.now()), extra: line === undefined ? {} : { [K]: line }, swipe_id: 0, swipes: [mes], swipe_info: [{ extra: line === undefined ? {} : { [K]: line } }] });
    const user = (mes) => ({ name: ctx.name1, is_user: true, mes, send_date: String(Date.now()), extra: {} });
    ctx.chat.splice(1, ctx.chat.length - 1,
      user('We reach the old lighthouse.'), ai('The door is open. Wind howls through the stairwell.', ''),
      user('Meanwhile, in the cellar of the inn #cellar'), ai('Dust and barrels. Someone left a lantern burning.', 'cellar'),
      user('What if the storm never came? #ifCalm'), ai('The sea is glass. The ships sail on time.', 'ifCalm'),
      user('Back at the lighthouse, we climb.'), ai('Two hundred steps later, the lamp room.', ''),
    );
    await ctx.saveChat();
    await ctx.reloadCurrentChat();
    await wait(1500);
  });
  const panel = (sel) => page.locator(`ap-panel ${sel}`);
  await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
  await sleep(800);
  const tab = panel('.tab[title="Storylines"]');
  console.log('storylines tab', await tab.count());
  await tab.click();
  await sleep(500);
  // expand the side story and the if-line
  for (const name of ['cellar', 'ifCalm']) await panel(`.storyline-card .card-title:text-is("${name}")`).click();
  await sleep(400);
  await page.screenshot({ path: `${shots}/storylines-tab.png` });
  await panel('.storyline-card').nth(1).locator('.storyline-toolbar .icon-btn').nth(1).hover();
  await sleep(500);
  await page.screenshot({ path: `${shots}/storylines-toolbar-tip.png` });
  // visibility toggle on the side story
  await panel('.storyline-card').nth(1).locator('.storyline-toolbar .icon-btn').nth(1).click();
  await sleep(400);
  console.log('hidden', await page.evaluate(() => JSON.stringify(SillyTavern.getContext().chatMetadata.advanced_preset?.storylines)));
  // rename the side story
  await panel('.storyline-card').nth(1).locator('.storyline-toolbar .icon-btn').nth(2).click();
  await sleep(500);
  await page.locator('dialog:visible textarea, dialog:visible input[type=text], .popup:visible textarea').first().fill('inn-cellar');
  await page.locator('.popup:visible .popup-button-ok, dialog:visible .popup-button-ok').first().click();
  await sleep(800);
  console.log('renamed', await page.evaluate(() => SillyTavern.getContext().chat.map((m) => m.mes.slice(-14)).join(' | ')));
  await page.screenshot({ path: `${shots}/storylines-renamed.png` });
  // help bubble
  await panel('.storylines-head .help .icon-btn').hover();
  await sleep(500);
  await page.screenshot({ path: `${shots}/storylines-help.png` });
  // configuration: freeze mode; switching storylines off removes the tab
  await panel('.tab[title="Config"]').click();
  await sleep(500);
  const sec = panel('.section:has(.card-title:text-is("Storylines"))');
  await sec.scrollIntoViewIfNeeded();
  await sec.screenshot({ path: `${shots}/storylines-config.png` });
  await sec.locator('.segmented button:has-text("If-lines")').click();
  await sleep(300);
  await sec.locator('.card-head .switch').first().click();
  await sleep(500);
  console.log('tab after off', await panel('.tab[title="Storylines"]').count());
  await page.screenshot({ path: `${shots}/storylines-off.png` });
}

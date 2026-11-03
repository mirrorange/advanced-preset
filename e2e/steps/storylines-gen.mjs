// storyline.frozen in a real generation (I-163): a side story turn under each freeze mode; the request
// carries Petals' independent-state instruction only when the turn is frozen. Needs `carrier` first.
import fs from 'node:fs';
const LOG = new URL('../mock-requests.jsonl', import.meta.url).pathname;
const STATE = 'The state of this storyline is independent';

export default async function (page, shots) {
  await page.evaluate(async () => {
    document.querySelector('.character_select')?.click();
    await new Promise((r) => setTimeout(r, 2500));
  });
  const panel = (sel) => page.locator(`ap-panel ${sel}`);
  const setMode = async (label) => {
    await page.evaluate(() => window.AdvancedPreset.togglePanel(true));
    await page.waitForTimeout(500);
    await panel('.tab[title="Config"]').click();
    const sec = panel('.section:has(.card-title:text-is("Storylines"))');
    if (!(await sec.locator('.segmented').count())) await sec.locator('.card-head .switch').first().click();
    await sec.locator(`.segmented button:has-text("${label}")`).click();
    await page.waitForTimeout(300);
    await page.evaluate(() => window.AdvancedPreset.togglePanel(false));
  };
  const send = async (text) => {
    const before = fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).length : 0;
    await page.fill('#send_textarea', text);
    await page.click('#send_but');
    await page.waitForTimeout(1500);
    await page.waitForFunction(() => !document.querySelector('#mes_stop') || getComputedStyle(document.querySelector('#mes_stop')).display === 'none', null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    const lines = fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).slice(before);
    return { requests: lines.length, state: lines.join('\n').includes(STATE) };
  };
  const out = {};
  await setMode('All');
  out.allSide = await send('Down into the cellar #cellar');
  out.allMain = await send('Meanwhile at the lighthouse.');
  await setMode('If-lines');
  out.ifSide = await send('Back in the cellar #cellar');
  out.ifLine = await send('What if the storm never came? #ifCalm');
  await setMode('Off');
  out.offIf = await send('Still calm #ifCalm');
  console.log(JSON.stringify(out, null, 1));
  await page.screenshot({ path: `${shots}/storylines-gen.png` });
}

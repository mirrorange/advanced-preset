/**
 * Switching the main storyline (I-147) from a `#!name` input or the storyline panel. An unnamed main
 * storyline with messages needs a name first: the user is asked; cancelling keeps everything as is.
 */
import { escapeHtml, inputPopup, toast } from '@/st/host';
import { t } from '@/i18n';
import { switchMainStoryline, validStorylineName } from '@/store/storylines';

/** Makes `target` the main storyline, asking for the old main storyline's name when needed. `false`: not switched. */
export async function switchMainInteractive(target: string): Promise<boolean> {
  let res = await switchMainStoryline(target);
  if (res === 'invalid') { toast('warning', t('storylines.invalidName'), t('app.name')); return false; }
  let value = '';
  // From here on `invalid` / `taken` are about the old main storyline's name: ask again.
  while (res === 'needs-name' || res === 'taken' || res === 'invalid') {
    if (res === 'taken') toast('warning', t('storylines.nameTaken', { name: value }), t('app.name'));
    if (res === 'invalid') toast('warning', t('storylines.invalidName'), t('app.name'));
    const html = `<h3>${escapeHtml(t('storylines.switchTitle', { name: target }))}</h3><p>${escapeHtml(t('storylines.askOldMain'))}</p>`;
    const answer = await inputPopup(html, value, t('storylines.switch'), t('common.cancel'));
    if (answer === null) return false;
    value = answer.trim();
    if (!validStorylineName(value)) { res = 'invalid'; continue; }
    res = await switchMainStoryline(target, value);
  }
  if (res === 'switched') toast('success', t('storylines.switched', { name: target }), t('app.name'));
  return true;
}

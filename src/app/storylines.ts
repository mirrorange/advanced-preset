/**
 * Storyline changes of the app: switching the main storyline from the storyline panel (I-147; an
 * unnamed main storyline with messages needs a name first: the user is asked, cancelling keeps
 * everything as is), what a received reply does to the storylines (I-159), and the storyline tag of
 * text put into the input box (I-160).
 */
import { parseStorylineTag, storylineNameFrom, uniqueStorylineName, withStorylineTag, type StorylineNaming } from '@advanced-preset/protocol';
import { escapeHtml, inputPopup, st, toast } from '@/st/host';
import { t } from '@/i18n';
import { settings } from '@/store/settings';
import { getPreset } from '@/store/presets';
import { activeConfiguration } from '@/store/config';
import { activeCarrierPresetId } from '@/store/carrier';
import {
  chatLineKeys, keepNormalLine, markSwitched, nameMainStoryline, storylineMeta, storylinesOn, switchMainStoryline, takenStorylineNames, validStorylineName, writeMessageLine,
} from '@/store/storylines';
import { isPendingLine, type StorylineTurn } from '@/core/storylines';

/** Makes `target` the main storyline (panel), asking for the old main storyline's name when needed. `false`: not switched. */
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

/**
 * The storyline of a received reply (I-145, I-159): written on its swipe, after naming the storylines
 * the AI named (`#?`, `#!?`; the unnamed previous main storyline of a `#!` switch) and switching the
 * main storyline (`#!name`, `#!?`). Names the AI did not give (or gave unusable ones) fall back to
 * generic names. `value`: the storyline structure of the reply, if the preset requested it.
 */
export async function commitStoryline(mesId: number, turn: StorylineTurn, value: unknown): Promise<void> {
  const n = turn.naming;
  if (!n.naming && !n.switching) return writeMessageLine(mesId, turn.current);
  const got = (value && typeof value === 'object' ? value : {}) as Partial<StorylineNaming>;
  const taken = takenStorylineNames();
  const pick = (raw: unknown, fallback: string) => {
    const name = uniqueStorylineName(storylineNameFrom(raw) || fallback, taken);
    taken.add(name);
    return name;
  };
  if (n.renameMain) {
    taken.delete(storylineMeta().main ?? '');
    const name = pick(got.name, t('storylines.fallback.side'));
    if (name !== storylineMeta().main && !(await nameMainStoryline(name))) console.warn('[AP] storylines: could not rename the main storyline to', name);
    return writeMessageLine(mesId, '');
  }
  if (!n.switching) {
    const name = pick(got.name, t('storylines.fallback.side'));
    keepNormalLine(name);
    writeMessageLine(mesId, name);
    return void (await st().saveMetadata());
  }
  const target = n.target ?? pick(got.name, t('storylines.fallback.side'));
  const old = n.oldName ?? (n.namingMain ? pick(got.previous_main, t('storylines.fallback.main')) : undefined);
  const res = await switchMainStoryline(target, old);
  if (res !== 'switched' && res !== 'unchanged') {
    // Should not happen (names are checked above): keep the reply on its storyline as a side story.
    console.warn('[AP] storylines: main storyline not switched', res, { target, old });
    toast('warning', t('storylines.switchFailed', { name: target }), t('app.name'));
    return writeMessageLine(mesId, target);
  }
  if (n.naming && turn.input >= 0) markSwitched(turn.input);
  writeMessageLine(mesId, '');
  if (res === 'switched') toast('success', t('storylines.switched', { name: target }), t('app.name'));
}

/**
 * `text` tagged with the storyline of message `mesId` (default: the last message) when that is a
 * storyline other than the main one and `text` has no tag of its own (I-160): what user options and
 * impersonated replies put into the input box stays on the storyline they were written for.
 */
export function withStorylineOf(text: string, mesId?: number): string {
  if (!settings().enabled) return text;
  const id = activeCarrierPresetId();
  const preset = id ? getPreset(id) : undefined;
  if (!preset || !storylinesOn(preset, activeConfiguration(preset))) return text;
  if (parseStorylineTag(text)) return text;
  const keys = chatLineKeys();
  const key = keys[mesId ?? keys.length - 1];
  if (!key || isPendingLine(key)) return text;
  return withStorylineTag(text.trimEnd(), key);
}

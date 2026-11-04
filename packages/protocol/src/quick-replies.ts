/**
 * SillyTavern Quick Reply sets a preset ships (`quick-replies/`). Every field of ST's own sets is
 * available (the source may be an ST export). While the preset's Carrier is selected, AP writes the
 * sets into ST's Quick Reply extension and adds the `global` ones to the global set list; selecting
 * another preset removes them from the list again.
 */
import { expandMacros } from './macros';

/** First Advanced Preset version that installs the preset's Quick Reply sets. */
export const QUICK_REPLIES_SINCE = '1.10.0';

/** Auto-execute switches of a quick reply (ST field names). */
export const QR_AUTO_EXECUTE = [
  'executeOnStartup', 'executeOnUser', 'executeOnAi', 'executeOnChatChange',
  'executeOnGroupMemberDraft', 'executeOnNewChat', 'executeBeforeGeneration',
] as const;
export type QrAutoExecute = (typeof QR_AUTO_EXECUTE)[number];

/** A context menu item: another set, by ST name (sets of the same preset are resolved when compiling). */
export interface QuickReplyContextItem { set: string; isChained: boolean }

export interface QuickReplyDecl extends Record<QrAutoExecute, boolean> {
  /** Key of the reply among its set (locale key); ST numbers the replies itself. */
  id: string;
  label: string;
  /** Font Awesome icon class, e.g. `fa-at` (empty: no icon). */
  icon: string;
  showLabel: boolean;
  /** Tooltip. */
  title: string;
  /** Text sent, or STscript run (when it starts with `/`). */
  message: string;
  contextList: QuickReplyContextItem[];
  preventAutoExecute: boolean;
  isHidden: boolean;
  automationId: string;
}

export interface QuickReplySetDecl {
  /** Source file id. */
  id: string;
  /** Set name in ST (identity of the set; not translated). */
  name: string;
  /** Added to ST's global set list while the preset is active. */
  global: boolean;
  /** Buttons shown (the list entry's `isVisible`). */
  visible: boolean;
  disableSend: boolean;
  placeBeforeInput: boolean;
  injectInput: boolean;
  color: string;
  onlyBorderColor: boolean;
  qrList: QuickReplyDecl[];
}

/** Translations of a set: `locales/<lang>.yaml#quickReplySets.<set id>.qrList.<reply id>`. */
export interface QuickReplySetLocale { qrList?: Record<string, { label?: string; title?: string; message?: string }> }

/** A quick reply as ST stores it (`QuickReply.toJSON`). */
export type StQuickReply = Omit<QuickReplyDecl, 'id'> & { id: number };

/** A set as ST stores it (`QuickReplySet.toJSON`). */
export interface StQuickReplySet {
  version: 2;
  name: string;
  disableSend: boolean;
  placeBeforeInput: boolean;
  injectInput: boolean;
  color: string;
  onlyBorderColor: boolean;
  qrList: StQuickReply[];
  idIndex: number;
}

/** Text fields of a reply that may be translated and may use `{{ap::name::<actor>}}`. */
export const QR_TEXT_FIELDS = ['label', 'title', 'message'] as const;

/**
 * The ST form of a set for the current UI locale: translated texts, `{{ap::name::<actor>}}`
 * expanded with `actorName` (other macros are left to ST), replies numbered from 1.
 */
export function stQuickReplySet(set: QuickReplySetDecl, actorName: (actor: string) => string | undefined, locale?: QuickReplySetLocale): StQuickReplySet {
  const expand = (s: string) => expandMacros(s, (args) => (args[0] === 'name' && args.length === 2 ? actorName(args[1]!) : undefined));
  const qrList = set.qrList.map(({ id, ...qr }, i): StQuickReply => {
    const tr = locale?.qrList?.[id];
    const out: StQuickReply = { ...qr, contextList: qr.contextList.map((c) => ({ ...c })), id: i + 1 };
    for (const k of QR_TEXT_FIELDS) {
      const v = tr?.[k];
      out[k] = expand(typeof v === 'string' && v ? v : qr[k]);
    }
    return out;
  });
  return {
    version: 2,
    name: set.name,
    disableSend: set.disableSend,
    placeBeforeInput: set.placeBeforeInput,
    injectInput: set.injectInput,
    color: set.color,
    onlyBorderColor: set.onlyBorderColor,
    qrList,
    idIndex: qrList.length,
  };
}

/** Does the reply run without a click (an auto-execute switch, or a world info automation id)? */
export const autoExecutes = (qr: QuickReplyDecl): boolean => QR_AUTO_EXECUTE.some((k) => qr[k]) || Boolean(qr.automationId);

/** The replies of a preset that run by themselves, as `set · label: message` (for the trust prompt). */
export function autoQuickReplies(preset: { quickReplySets?: QuickReplySetDecl[] }): string[] {
  return (preset.quickReplySets ?? []).flatMap((s) => s.qrList.filter(autoExecutes).map((q) => `${s.name} · ${q.label || q.id}: ${q.message}`));
}

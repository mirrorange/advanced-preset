/**
 * Card placement (I-137): every structure kind has a built-in area (above or below the message
 * text) and sort key; a preset's `ui.position` / `ui.order` override them. Cards of one area sort
 * by key, ties by structure declaration order.
 */
import type { CardPosition, StructureDecl, StructureKind } from '@advanced-preset/protocol';

export const BUILTIN_CARDS: Record<StructureKind, { position: CardPosition; order: number } | null> = {
  status: { position: 'top', order: 100 },
  reply: { position: 'bottom', order: 100 },
  impersonate: { position: 'bottom', order: 200 },
  options: { position: 'bottom', order: 300 },
  synopsis: { position: 'bottom', order: 400 },
  memory: { position: 'bottom', order: 500 },
  recap: { position: 'bottom', order: 600 },
  custom: { position: 'bottom', order: 700 },
  annotations: null,
};

export interface CardSlot { decl: StructureDecl; position: CardPosition; order: number; index: number }

export function cardPlacement(decl: StructureDecl): { position: CardPosition; order: number } | null {
  const builtin = BUILTIN_CARDS[decl.kind];
  if (!builtin) return null;
  return { position: decl.ui?.position ?? builtin.position, order: decl.ui?.order ?? builtin.order };
}

/** Structures with a card in `position`, in display order. */
export function cardSlots(decls: StructureDecl[], position: CardPosition): CardSlot[] {
  return decls
    .flatMap((decl, index) => {
      const p = cardPlacement(decl);
      return p && p.position === position ? [{ decl, ...p, index }] : [];
    })
    .sort((a, b) => a.order - b.order || a.index - b.index);
}

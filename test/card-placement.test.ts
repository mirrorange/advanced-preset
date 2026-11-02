import { describe, expect, it } from 'vitest';
import type { StructureDecl } from '@advanced-preset/protocol';
import { cardSlots } from '@/ui/message/placement';

const d = (id: string, kind: StructureDecl['kind'], ui?: StructureDecl['ui']): StructureDecl => ({ id, kind, tag: id, field: id, formatPrompt: { tag: '', field: '' }, ...(ui ? { ui } : {}) });

describe('card placement (I-137)', () => {
  const decls = [d('note', 'custom'), d('options', 'options'), d('reply', 'reply'), d('status', 'status'), d('annotations', 'annotations'), d('mood', 'custom', { position: 'top', order: 50 }), d('syn', 'synopsis', { order: 50 })];
  it('sorts built-in cards by their default keys, overrides by ui', () => {
    expect(cardSlots(decls, 'bottom').map((s) => s.decl.id)).toEqual(['syn', 'reply', 'options', 'note']);
    expect(cardSlots(decls, 'top').map((s) => s.decl.id)).toEqual(['mood', 'status']);
  });
  it('keeps declaration order for equal keys', () => {
    expect(cardSlots([d('b', 'custom'), d('a', 'custom')], 'bottom').map((s) => s.decl.id)).toEqual(['b', 'a']);
  });
});

/**
 * Preset-supplied structure components (I-137). A custom structure may bring its own card: an EJS
 * `template` rendering HTML, or an ES `module` mounted into a shadow root. Both are code from the
 * preset, so the extension only shows them after the user trusts and enables the preset's custom UI;
 * the trust is bound to {@link structureUiHash} and asked again when the code changes.
 */
import type { APreset, StructureDecl } from './types';

export interface StructureComponent {
  id: string;
  mode: 'template' | 'module';
  code: string;
  style?: string;
}

/** The component of a structure, if it brings one. */
export function structureComponent(decl: StructureDecl): StructureComponent | undefined {
  const ui = decl.ui;
  if (decl.kind !== 'custom' || !ui) return undefined;
  if (ui.module !== undefined) return { id: decl.id, mode: 'module', code: ui.module, ...(ui.style !== undefined ? { style: ui.style } : {}) };
  if (ui.template !== undefined) return { id: decl.id, mode: 'template', code: ui.template, ...(ui.style !== undefined ? { style: ui.style } : {}) };
  return undefined;
}

/** Every structure component of a preset, in declaration order. */
export function structureComponents(preset: Pick<APreset, 'structures'>): StructureComponent[] {
  return Object.values(preset.structures ?? {}).flatMap((d) => {
    const c = structureComponent(d);
    return c ? [c] : [];
  });
}

/** cyrb53: a fast 53-bit string hash (not cryptographic; only detects changed code). */
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** Fingerprint of a preset's component code (empty when it has none). */
export function structureUiHash(preset: Pick<APreset, 'structures'>): string {
  const list = structureComponents(preset);
  if (!list.length) return '';
  return cyrb53(JSON.stringify(list.map((c) => [c.id, c.mode, c.code, c.style ?? ''])));
}

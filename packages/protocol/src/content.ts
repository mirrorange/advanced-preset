import type { APreset, Content, Piece, Role } from './types';
import { test, type Resolver } from './expr';
import { compileText } from './directives';

export interface RenderedBlock {
  role?: Role;
  text: string;
}

/** Renders a template piece (`piece.text` is the EJS source). Without one, templates produce nothing. */
export type TemplateRenderer = (piece: Piece) => string;

/**
 * Render content: evaluate piece conditions, render templates, join the pieces of each block and
 * post-process them (macro expansion). Empty blocks are dropped.
 */
export function renderContent(content: Content | undefined, resolve: Resolver, post: (s: string) => string = (s) => s, template?: TemplateRenderer): RenderedBlock[] {
  if (!content) return [];
  const out: RenderedBlock[] = [];
  for (const block of content) {
    const joined = block.pieces.filter((p) => test(p.when, resolve)).map((p) => (p.template ? (template?.(p) ?? '') : p.text)).join('');
    const text = post(joined).replace(/\n{3,}/g, '\n\n').trim();
    if (!text) continue;
    out.push(block.role ? { role: block.role, text } : { text });
  }
  return out;
}

/** Plain text of content (all blocks joined), for single-string contexts such as tool descriptions. */
export function renderText(content: Content | undefined, resolve: Resolver, post?: (s: string) => string, sep = '\n\n', template?: TemplateRenderer): string {
  return renderContent(content, resolve, post, template).map((b) => b.text).join(sep);
}

/** Whether content contains `@template` pieces. */
export const contentHasTemplates = (content: Content | undefined): boolean => Boolean(content?.some((b) => b.pieces.some((p) => p.template)));

/** Template sources of content, in order. */
export const contentTemplates = (content: Content | undefined): string[] => (content ?? []).flatMap((b) => b.pieces.filter((p) => p.template).map((p) => p.text));

/**
 * Every template source of a preset (entries, workflow sections, then bundled user modules and user
 * module templates in all locales), in artifact order.
 */
export function presetTemplates(preset: Pick<APreset, 'entries' | 'workflows'> & Partial<Pick<APreset, 'userModules' | 'userModuleTemplates'>>): string[] {
  const out = preset.entries.flatMap((e) => contentTemplates(e.content));
  for (const w of preset.workflows ?? []) {
    const s = w.sections;
    const styled = (x: Partial<Record<string, Content>> | undefined) => Object.values(x ?? {}).flatMap((c) => contentTemplates(c));
    out.push(...contentTemplates(s?.preamble), ...styled(s?.intro), ...Object.values(s?.stages ?? {}).flatMap(styled), ...styled(s?.outro));
  }
  // Bundled modules and templates become the user's modules, so their code counts as the preset's (I-110).
  const sources = [...(preset.userModules ?? []), ...(preset.userModuleTemplates ?? [])];
  const bodies = sources.flatMap((t) => [t, ...Object.values(t.locales ?? {})]);
  for (const b of bodies) for (const e of b.entries) out.push(...contentTemplates(compileText(e.text, e.role).content));
  return out;
}

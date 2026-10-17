import type { Content, Role } from './types';
import { test, type Resolver } from './expr';

export interface RenderedBlock {
  role?: Role;
  text: string;
}

/**
 * Render content: evaluate piece conditions, join the pieces of each block and post-process them
 * (macro expansion). Empty blocks are dropped.
 */
export function renderContent(content: Content | undefined, resolve: Resolver, post: (s: string) => string = (s) => s): RenderedBlock[] {
  if (!content) return [];
  const out: RenderedBlock[] = [];
  for (const block of content) {
    const text = post(block.pieces.filter((p) => test(p.when, resolve)).map((p) => p.text).join('')).trim();
    if (!text) continue;
    out.push(block.role ? { role: block.role, text } : { text });
  }
  return out;
}

/** Plain text of content (all blocks joined), for single-string contexts such as tool descriptions. */
export function renderText(content: Content | undefined, resolve: Resolver, post?: (s: string) => string, sep = '\n\n'): string {
  return renderContent(content, resolve, post).map((b) => b.text).join(sep);
}

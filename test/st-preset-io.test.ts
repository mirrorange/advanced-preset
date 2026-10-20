import { describe, expect, it } from 'vitest';
import { looksLikeArtifact } from '@/app/st-preset-io';

describe('looksLikeArtifact', () => {
  it('accepts artifacts of any format version', () => {
    expect(looksLikeArtifact({ id: 'petals', entries: [], formatVersion: 3 })).toBe(true);
    expect(looksLikeArtifact({ id: 'old', entries: [], formatVersion: 1 })).toBe(true);
  });
  it('leaves ST presets and other files to ST', () => {
    expect(looksLikeArtifact({ prompts: [], prompt_order: [], temperature: 1 })).toBe(false);
    expect(looksLikeArtifact({ id: 'x' })).toBe(false);
    expect(looksLikeArtifact(null)).toBe(false);
    expect(looksLikeArtifact('text')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { isInlineStructure, terminalContentIndex, turnArtifacts } from '@advanced-preset/protocol';
import { petals } from './helpers';

// Some APIs (Gemini) generate object fields alphabetically, ignoring the schema order (I-94).
describe('bundled Petals: alphabetical field order', () => {
  const structures = Object.values(petals.structures).filter((s) => !isInlineStructure(s));
  for (const w of petals.workflows) {
    it(`${w.id}: fields sort in turn order`, () => {
      const a = turnArtifacts(petals.tools, w, w.stages, structures);
      const fields = w.stages.map((s) => a.fieldOf(s));
      expect([...fields].sort()).toEqual(fields);
      const keys = Object.keys(a.turnSchema().properties as object);
      if (a.layout.prefixed) {
        // Unified ordering prefix (I-135): the schema order is the alphabetical order, stage tools too.
        expect([...keys].sort()).toEqual(keys);
        for (const t of a.stageTools()) {
          const params = Object.keys(t.function.parameters.properties as object);
          expect([...params].sort()).toEqual(params);
        }
        return;
      }
      const sorted = [...keys].sort();
      const content = sorted.indexOf(fields[terminalContentIndex(w.stages)]!);
      for (const s of structures) {
        expect(s.field.startsWith(petals.tools.structurePrefix!)).toBe(true);
        expect(sorted.indexOf(s.field)).toBeGreaterThan(content);
      }
      const tool = a.stageTools()[terminalContentIndex(w.stages)]!;
      const params = Object.keys(tool.function.parameters.properties as object).sort();
      expect(params[0]).toBe(a.paramOf(w.stages[terminalContentIndex(w.stages)]!));
    });
  }
});

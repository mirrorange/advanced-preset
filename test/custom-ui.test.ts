import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloneData, renderTemplate, structureComponents, structureUiHash, type APreset } from '@advanced-preset/protocol';
import { confirmCustomUi } from '@/app/trust';
import { customUiEnabled, setCustomUi } from '@/store/custom-ui';
import { installPreset } from '@/store/presets';
import { templateLocals, type ComponentContext } from '@/ui/structure-component';
import { petals } from './helpers';

const AFFIRMATIVE = 1;
let answer = AFFIRMATIVE;
const popup = vi.fn(async (..._args: unknown[]) => answer);

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'en' });
  answer = AFFIRMATIVE;
  popup.mockClear();
  (globalThis as any).SillyTavern = {
    getContext: () => ({
      extensionSettings: {}, saveSettingsDebounced: vi.fn(), chat: [], chatMetadata: {},
      callGenericPopup: popup, POPUP_TYPE: { CONFIRM: 2 }, POPUP_RESULT: { AFFIRMATIVE },
    }),
  };
});
afterEach(() => { delete (globalThis as any).SillyTavern; vi.unstubAllGlobals(); });

function withComponent(id: string, template = '<b><%= value %></b>'): APreset {
  const p = cloneData(petals);
  p.id = id;
  p.structures = { ...p.structures, mood: { id: 'mood', kind: 'custom', tag: 'mood', field: 'mood', shape: 'text', display: 'card', formatPrompt: { tag: '', field: '' }, ui: { position: 'top', template, style: 'b { color: red }' } } };
  installPreset(p);
  return p;
}

describe('custom structure components (I-137)', () => {
  it('lists components and fingerprints their code', () => {
    const p = withComponent('fp');
    expect(structureComponents(petals)).toEqual([]);
    expect(structureUiHash(petals)).toBe('');
    expect(structureComponents(p)).toEqual([{ id: 'mood', mode: 'template', code: '<b><%= value %></b>', style: 'b { color: red }' }]);
    const q = cloneData(p);
    q.structures.mood!.ui!.template = '<i><%= value %></i>';
    expect(structureUiHash(q)).not.toBe(structureUiHash(p));
  });

  it('asks on install: trusted → enabled, declined → installed but hidden', async () => {
    const yes = withComponent('ui-yes');
    expect(customUiEnabled(yes)).toBe(false);
    await confirmCustomUi(yes);
    expect(popup).toHaveBeenCalledOnce();
    expect(String(popup.mock.calls[0]![0])).toContain('&lt;b&gt;&lt;%= value %&gt;&lt;/b&gt;');
    expect(customUiEnabled(yes)).toBe(true);
    answer = 0;
    const no = withComponent('ui-no');
    await confirmCustomUi(no);
    expect(customUiEnabled(no)).toBe(false);
  });

  it('keeps the decision for the same code and asks again when the code changes', async () => {
    const p = withComponent('ui-update');
    await confirmCustomUi(p);
    popup.mockClear();
    await confirmCustomUi(withComponent('ui-update'));
    expect(popup).not.toHaveBeenCalled();
    const changed = withComponent('ui-update', '<i><%= value %></i>');
    expect(customUiEnabled(changed)).toBe(false);
    await confirmCustomUi(changed);
    expect(popup).toHaveBeenCalledOnce();
    expect(customUiEnabled(changed)).toBe(true);
    setCustomUi(changed, false);
    expect(customUiEnabled(changed)).toBe(false);
  });

  it('renders templates with the documented locals', () => {
    const ctx = {
      value: 'calm', structure: { id: 'mood', kind: 'custom', title: 'Mood' }, structures: { mood: 'calm' },
      message: { id: 3, streaming: false, editable: true }, preset: { id: 'p', name: 'P', version: '1.0.0' }, lang: 'en',
      setValue: async () => true, fillInput: () => {},
    } satisfies ComponentContext;
    expect(renderTemplate('<%= structure.title %>: <%= value %> #<%= message.id %> <%= lang %>', templateLocals(ctx))).toBe('Mood: calm #3 en');
  });
});

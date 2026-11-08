import { afterEach, describe, expect, it, vi } from 'vitest';
import { toolCallingIssue } from '@/st/host';

/** ST context whose `isToolCallingSupported` follows ST: the switch, then the model capability. */
function host(settings: Record<string, unknown>, opts: { mainApi?: string; modelSupported?: boolean; ignoresSettingsArg?: boolean } = {}) {
  const live = { chat_completion_source: 'openrouter', openrouter_model: 'vendor/model', function_calling: true, custom_prompt_post_processing: '', ...settings };
  const isToolCallingSupported = vi.fn((s?: Record<string, unknown> | null) => {
    const used = opts.ignoresSettingsArg ? live : s ?? live;
    return Boolean(used.function_calling) && (opts.modelSupported ?? true);
  });
  (globalThis as any).SillyTavern = { getContext: () => ({ mainApi: opts.mainApi ?? 'openai', chatCompletionSettings: live, isToolCallingSupported }) };
  return isToolCallingSupported;
}

describe('toolCallingIssue', () => {
  afterEach(() => { delete (globalThis as any).SillyTavern; });

  it('passes on a supported connection', () => {
    host({});
    expect(toolCallingIssue()).toBeNull();
  });

  it('ignores "Enable function calling" (AP sends its own tools)', () => {
    const check = host({ function_calling: false });
    expect(toolCallingIssue()).toBeNull();
    expect(check.mock.calls[0]![0]).toMatchObject({ function_calling: true });
  });

  it('needs Chat Completion', () => {
    host({}, { mainApi: 'textgenerationwebui' });
    expect(toolCallingIssue()).toEqual({ reason: 'mainApi' });
  });

  it('rejects post-processing types without tools, even when tool support is assumed', () => {
    for (const pp of ['merge', 'semi', 'strict', 'single']) {
      host({ custom_prompt_post_processing: pp });
      expect(toolCallingIssue(true)).toEqual({ reason: 'postProcessing', label: pp });
    }
    for (const pp of ['merge_tools', 'semi_tools', 'strict_tools']) {
      host({ custom_prompt_post_processing: pp });
      expect(toolCallingIssue()).toBeNull();
    }
  });

  it('reports the source and model when ST rejects the model', () => {
    host({}, { modelSupported: false });
    expect(toolCallingIssue()).toEqual({ reason: 'model', source: 'openrouter', model: 'vendor/model' });
  });

  it('skips the model check when tool support is assumed', () => {
    const check = host({}, { modelSupported: false });
    expect(toolCallingIssue(true)).toBeNull();
    expect(check).not.toHaveBeenCalled();
  });

  it('asks for the switch on ST versions that ignore the settings argument', () => {
    host({ function_calling: false }, { ignoresSettingsArg: true });
    expect(toolCallingIssue()).toEqual({ reason: 'functionCalling' });
  });
});

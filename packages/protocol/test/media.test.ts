import { describe, expect, it } from 'vitest';
import {
  activeStructures, cleanSpeechLine, createMacroResolver, defaultVars, extractStructureTags, fillHistoryTemplate, imageRefsText, injectSpeech, normalizeImages,
  normalizeStructure, parseAnnotations, parseSpeech, parseSpeechWith, reanchorSpeech, speechText, structureFieldSchema, structureValueText,
  IMAGE_OFF, IMAGE_PROMPT_TYPES, SPEECH_OFF, defaultImagePromptType, type APreset, type Configuration, type Module, type StructureDecl,
} from '@advanced-preset/protocol';

const IMAGE: StructureDecl = { id: 'img', kind: 'image', tag: 'Image', field: 'images', formatPrompt: { tag: '', field: '' }, properties: { prompt: 'What to draw' } };
const SPEECH: StructureDecl = { id: 'voice', kind: 'speech', tag: 'speech', field: 'voice', formatPrompt: { tag: '', field: '' } };

describe('speech lines', () => {
  it('strips the markup and anchors the lines', () => {
    const r = parseSpeech('She smiled. <speech character="Ann">Hello, Bob.</speech> He nodded.');
    expect(r.text).toBe('She smiled. Hello, Bob. He nodded.');
    expect(r.spans).toEqual([{ id: 's1', start: 12, end: 23, quote: 'Hello, Bob.', prefix: 'She smiled. ', suffix: ' He nodded.', character: 'Ann' }]);
    expect(r.text.slice(r.spans[0]!.start, r.spans[0]!.end)).toBe('Hello, Bob.');
    expect(r.warnings).toEqual([]);
  });

  it('keeps provider tags for synthesis, not for display', () => {
    const r = parseSpeech('<speech character="Ann">[laugh] Oh, <whisper>really</whisper>?</speech>');
    expect(r.text).toBe('Oh, really?');
    expect(r.spans[0]).toMatchObject({ quote: 'Oh, really?', text: '[laugh] Oh, <whisper>really</whisper>?' });
    expect(speechText(r.spans[0]!)).toBe('[laugh] Oh, <whisper>really</whisper>?');
    expect(speechText(parseSpeech('<speech character="A">plain</speech>').spans[0]!)).toBe('plain');
    expect(cleanSpeechLine('你好<break time="1s"/>世界')).toBe('你好世界');
  });

  it('takes a custom tag name and cleaner', () => {
    const r = parseSpeech('<voice character="A">(sighs) fine</voice>', { tag: 'voice', cleaner: /\([a-z]+\)\s*/g });
    expect(r.text).toBe('fine');
    expect(r.spans[0]!.text).toBe('(sighs) fine');
    expect(parseSpeech('<speech character="A">x</speech>', { tag: 'voice' }).text).toBe('<speech character="A">x</speech>');
    expect(parseSpeech('<speech character="A">LOUD</speech>', { cleaner: (s) => s.toLowerCase() }).text).toBe('loud');
  });

  it('is lenient with broken markup', () => {
    expect(parseSpeech('a </speech>b').text).toBe('a b');
    const open = parseSpeech('a <speech character="A">never closed\n\nnext');
    expect(open.text).toBe('a never closed\n\nnext');
    expect(open.spans).toEqual([]);
    expect(open.warnings.join()).toMatch(/unterminated/);
    const nested = parseSpeech('<speech character="A">one <speech character="B">two</speech> three</speech>');
    expect(nested.text).toBe('one two three');
    expect(nested.spans.map((s) => s.quote)).toEqual(['one two']);
    expect(parseSpeech('<speech character="A">  </speech>x').spans).toEqual([]);
    expect(parseSpeech('<speech>who?</speech>').spans[0]!.character).toBe('');
    expect(parseSpeech('<speech character="A &amp; B">x</speech>').spans[0]!.character).toBe('A & B');
  });

  it('never streams markup (final: false)', () => {
    const raw = 'He said: <speech character="Ann">[laugh] Hi <whisper>there</whisper>!</speech> and <speech character="Bob">bye</speech>.';
    const final = parseSpeech(raw).text;
    for (let n = 0; n <= raw.length; n++) {
      const t = parseSpeech(raw.slice(0, n), { final: false }).text;
      expect(t).not.toMatch(/[<[]/);
      expect(final.startsWith(t.trimEnd())).toBe(true);
    }
  });

  it('re-anchors after edits and writes the markup back', () => {
    const r = parseSpeech('A <speech character="Ann">[sigh] Hi.</speech> B <speech character="Bob">Yo.</speech>');
    const edited = `Intro. ${r.text}`;
    const moved = reanchorSpeech(edited, r.spans);
    expect(moved.changed).toBe(true);
    expect(edited.slice(moved.spans[0]!.start, moved.spans[0]!.end)).toBe('Hi.');
    expect(reanchorSpeech(edited.replace('Yo.', 'Hey.'), r.spans).spans[1]!.orphan).toBe(true);
    expect(injectSpeech(r.text, r.spans)).toBe('A <speech character="Ann">[sigh] Hi.</speech> B <speech character="Bob">Yo.</speech>');
    expect(injectSpeech('x Hi.', [{ ...r.spans[0]!, character: 'A"B' }], 'voice')).toBe('x <voice character="A&quot;B">[sigh] Hi.</voice>');
  });

  it('works together with annotations, in both nestings', () => {
    const raw = 'A <speech character="B">{==Hello==}{>>greeting<<} you</speech> and {==<speech character="C">bye</speech> now==}{>>leaving<<}.';
    const a = parseAnnotations(raw);
    const r = parseSpeechWith(a.text, a.annotations);
    expect(r.text).toBe('A Hello you and bye now.');
    expect(r.spans.map((s) => [s.character, r.text.slice(s.start, s.end)])).toEqual([['B', 'Hello you'], ['C', 'bye']]);
    expect(r.anchors!.map((x) => [x.comment, r.text.slice(x.start, x.end), x.orphan])).toEqual([['greeting', 'Hello', undefined], ['leaving', 'bye now', undefined]]);
  });
});

describe('image structure', () => {
  it('normalizes JSON values', () => {
    expect(normalizeImages([{ prompt: ' a cat ', refs: ['r1', 'r1', ''], ratio: '16x9', caption: 'Cat' }])).toEqual({ images: [{ prompt: 'a cat', refs: ['r1'], ratio: '16:9', caption: 'Cat' }] });
    expect(normalizeImages({ images: [{ prompt: 'x', ratio: '2:1' }] })).toEqual({ images: [{ prompt: 'x' }] });
    expect(normalizeImages('a dog')).toEqual({ images: [{ prompt: 'a dog' }] });
    expect(normalizeImages('[{"prompt":"a","refs":"r1, r2"}]')).toEqual({ images: [{ prompt: 'a', refs: ['r1', 'r2'] }] });
    expect(normalizeImages([])).toBeUndefined();
    expect(normalizeImages([{ caption: 'no prompt' }])).toBeUndefined();
    expect(normalizeStructure('image', [{ prompt: 'a' }, { prompt: 'b' }], { ...IMAGE, count: 1 })).toEqual({ images: [{ prompt: 'a' }] });
    expect(normalizeStructure('image', [{ prompt: 'a' }, { prompt: 'b' }], { ...IMAGE, count: 2 })).toEqual({ images: [{ prompt: 'a' }, { prompt: 'b' }] });
  });

  it('parses dialogue blocks (one per image)', () => {
    const text = 'Story.\n<Image><prompt>a cat on a roof</prompt><refs>r1, r2</refs><ratio>3:4</ratio><caption>Night</caption></Image>\n<Image>a moon</Image>';
    const r = extractStructureTags(text, [{ ...IMAGE, count: 2 }]);
    expect(r.text.trim()).toBe('Story.');
    expect(r.values.img).toEqual({ images: [{ prompt: 'a cat on a roof', refs: ['r1', 'r2'], ratio: '3:4', caption: 'Night' }, { prompt: 'a moon' }] });
    expect(extractStructureTags('<Image><caption>x</caption></Image>', [IMAGE]).values.img).toBeUndefined();
  });

  it('has a schema, without refs unless requested', () => {
    const s = structureFieldSchema(IMAGE) as any;
    expect(s.type).toBe('array');
    expect(s.maxItems).toBe(1);
    expect(s.items.required).toEqual(['prompt', 'refs', 'ratio', 'caption']);
    expect(s.items.properties.prompt).toEqual({ type: 'string', description: 'What to draw' });
    const noRefs = structureFieldSchema({ ...IMAGE, count: 3, requested: ['prompt', 'ratio', 'caption'] }) as any;
    expect(Object.keys(noRefs.items.properties)).toEqual(['prompt', 'ratio', 'caption']);
    expect(noRefs.maxItems).toBe(3);
  });

  it('renders as history text', () => {
    const v = { images: [{ prompt: 'a cat', caption: 'Cat' }, { prompt: 'a dog' }] };
    expect(structureValueText('image', v)).toBe('- Cat: a cat\n- a dog');
    expect(fillHistoryTemplate('[{{value}}]', 'image', v)).toBe('[- Cat: a cat\n- a dog]');
  });
});

describe('media variables and macros', () => {
  const preset = {
    image: {}, speech: {}, structures: { img: IMAGE, voice: SPEECH, memo: { id: 'memo', kind: 'memory', tag: 'm', field: 'm', formatPrompt: { tag: '', field: '' } } },
  } as unknown as APreset;
  const modules = [{ id: 'm', structures: ['img', 'voice', 'memo'] }] as Module[];

  it('image prompt types: defaults per API, empty when off', () => {
    expect(IMAGE_PROMPT_TYPES).toEqual(['tags', 'description', 'instruction']);
    expect(['openai', 'gemini', 'novelai'].map((a) => defaultImagePromptType(a as 'openai'))).toEqual(['instruction', 'instruction', 'tags']);
    expect(IMAGE_OFF.prompt).toBe('');
  });

  it('requests image / speech structures only while on', () => {
    expect(activeStructures(preset, modules).map((s) => s.id)).toEqual(['memo']);
    expect(activeStructures(preset, modules, { image: IMAGE_OFF, speech: SPEECH_OFF }).map((s) => s.id)).toEqual(['memo']);
    const on = activeStructures(preset, modules, { image: { ...IMAGE_OFF, on: true, api: 'openai' }, speech: { ...SPEECH_OFF, on: true, api: 'fish' } });
    expect(on.map((s) => s.id)).toEqual(['img', 'voice', 'memo']);
    expect(on[0]!.requested).toEqual(['prompt', 'ratio', 'caption']);
    expect(activeStructures(preset, modules, { image: { ...IMAGE_OFF, on: true, api: 'gemini', refs: true } })[0]!.requested).toEqual(['prompt', 'refs', 'ratio', 'caption']);
  });

  it('expands the macros only while the feature is on', () => {
    const p = { ...preset, params: [], actors: {}, structures: {} } as unknown as APreset;
    const config = { identity: { names: {}, prefixes: {} }, params: {} } as unknown as Configuration;
    const data = { image: { refs: [{ id: 'r1', description: 'Ann, red coat' }, { id: 'r2', description: '' }] }, speech: { format: 'Use <whisper>.', characters: ['Ann', 'Bob'] } };
    const off = defaultVars({ ...p, styles: { prefill: 'dialogue' }, regex: [], modules: [] } as unknown as APreset, { ...config, connection: { transport: 'prefill', workflow: '' }, modules: {}, tokenSaving: { enabled: false } } as unknown as Configuration);
    expect(off.image).toEqual(IMAGE_OFF);
    expect(off.speech).toEqual(SPEECH_OFF);
    const resolve = (vars: typeof off) => createMacroResolver({ preset: p, config, vars, data }, [], undefined, {});
    expect(resolve(off)(['image', 'refs'])).toBe('');
    expect(resolve(off)(['speech', 'format'])).toBe('');
    const on = { ...off, image: { ...IMAGE_OFF, on: true, refs: true }, speech: { ...SPEECH_OFF, on: true, characters: true } };
    expect(resolve(on)(['image', 'refs'])).toBe('- r1: Ann, red coat\n- r2:');
    expect(resolve(on)(['speech', 'format'])).toBe('Use <whisper>.');
    expect(resolve(on)(['speech', 'characters'])).toBe('Ann, Bob');
    expect(imageRefsText(undefined)).toBe('');
  });
});

/**
 * Mounting preset-supplied structure components (I-137) into a shadow root.
 *
 *   template  EJS (`renderTemplate`), re-rendered on every change. Locals: `value`, `structure`,
 *             `structures`, `message`, `preset`, `lang`. Clicking an element with `data-ap-fill="…"`
 *             puts the text into the input box (modifier keys send it).
 *   module    ES module source, imported from a Blob URL. It exports `mount(root, context)` (or a
 *             default function / `{ mount }`) and returns a cleanup function or `{ update?, unmount? }`;
 *             without `update` the component is re-mounted on changes.
 *
 * Both are code from the preset: callers only mount them after the user enabled the preset's custom UI.
 */
import { renderTemplate, type StructureComponent } from '@advanced-preset/protocol';

export interface ComponentContext {
  value: unknown;
  structure: { id: string; kind: string; title: string };
  /** All structure values of the message (live while streaming). */
  structures: Record<string, unknown>;
  message: { id: number; streaming: boolean; editable: boolean };
  preset: { id: string; name: string; version: string };
  lang: string;
  /** Replace this structure's stored value (stored turns only); resolves to whether it was saved. */
  setValue(value: unknown): Promise<boolean>;
  /** Put text into ST's input box; `send` submits it. */
  fillInput(text: string, send?: boolean): void;
}

export interface MountedComponent {
  update(ctx: ComponentContext): Promise<void>;
  unmount(): void;
}

type ModuleResult = void | (() => void) | { update?: (ctx: ComponentContext) => void; unmount?: () => void };
type MountFn = (root: ShadowRoot, ctx: ComponentContext) => ModuleResult | Promise<ModuleResult>;

const modules = new Map<string, Promise<Record<string, unknown>>>();

/** Import module source once per distinct code. */
export function loadModule(code: string): Promise<Record<string, unknown>> {
  let hit = modules.get(code);
  if (!hit) {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    hit = (import(/* @vite-ignore */ url) as Promise<Record<string, unknown>>).finally(() => URL.revokeObjectURL(url));
    hit.catch(() => modules.delete(code));
    modules.set(code, hit);
  }
  return hit;
}

function mountOf(mod: Record<string, unknown>): MountFn | undefined {
  const d = mod.default as unknown;
  if (typeof mod.mount === 'function') return mod.mount as MountFn;
  if (typeof d === 'function') return d as MountFn;
  if (d && typeof d === 'object' && typeof (d as { mount?: unknown }).mount === 'function') return (d as { mount: MountFn }).mount.bind(d);
  return undefined;
}

function styleEl(css?: string): HTMLStyleElement | null {
  if (!css) return null;
  const el = document.createElement('style');
  el.textContent = css;
  return el;
}

export const templateLocals = (ctx: ComponentContext) => ({
  value: ctx.value, structure: ctx.structure, structures: ctx.structures, message: ctx.message, preset: ctx.preset, lang: ctx.lang,
});

export async function mountComponent(c: StructureComponent, root: ShadowRoot, first: ComponentContext): Promise<MountedComponent> {
  let ctx = first;
  if (c.mode === 'template') {
    const render = () => {
      const html = renderTemplate(c.code, templateLocals(ctx));
      root.replaceChildren(...[styleEl(c.style)].filter((x): x is HTMLStyleElement => Boolean(x)));
      const body = document.createElement('div');
      body.className = 'ap-component';
      body.innerHTML = html;
      root.append(body);
    };
    const onClick = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('[data-ap-fill]');
      if (!el) return;
      const m = e as MouseEvent;
      ctx.fillInput(el.getAttribute('data-ap-fill') ?? '', m.ctrlKey || m.metaKey || m.shiftKey || m.altKey);
    };
    root.addEventListener('click', onClick);
    render();
    return {
      update: async (next) => { ctx = next; render(); },
      unmount: () => { root.removeEventListener('click', onClick); root.replaceChildren(); },
    };
  }
  const mount = mountOf(await loadModule(c.code));
  if (!mount) throw new Error('the module exports no mount(root, context)');
  let result: ModuleResult;
  const start = async () => {
    root.replaceChildren(...[styleEl(c.style)].filter((x): x is HTMLStyleElement => Boolean(x)));
    result = await mount(root, ctx);
  };
  const stop = () => {
    try {
      if (typeof result === 'function') result();
      else result?.unmount?.();
    } finally {
      result = undefined;
    }
  };
  await start();
  return {
    update: async (next) => {
      ctx = next;
      if (result && typeof result === 'object' && typeof result.update === 'function') return void result.update(ctx);
      stop();
      await start();
    },
    unmount: () => { stop(); root.replaceChildren(); },
  };
}

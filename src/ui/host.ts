/**
 * Custom-element hosts (§16.1): each AP mount is a custom element with an open shadow root that
 * adopts the shared sheets and runs a small Vue app. Attributes become props; the app is created on
 * connect and torn down on disconnect, so ST re-rendering messages simply re-mounts AP.
 */
import { createApp, type App, type Component } from 'vue';
import { registerThemed, sheets } from './theme';

export function defineHost(tag: string, component: Component, attrs: string[] = []): void {
  if (customElements.get(tag)) return;
  class Host extends HTMLElement {
    static observedAttributes = attrs;
    private app: App | null = null;
    private unregister: (() => void) | null = null;

    connectedCallback() { this.mount(); }
    disconnectedCallback() { this.unmount(); }
    attributeChangedCallback(_n: string, old: string | null, value: string | null) {
      if (this.app && old !== value) { this.unmount(); this.mount(); }
    }

    private mount() {
      if (this.app) return;
      const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
      root.adoptedStyleSheets = sheets;
      root.replaceChildren();
      const el = document.createElement('div');
      el.className = 'ap-root';
      root.append(el);
      const props: Record<string, unknown> = {};
      for (const a of attrs) {
        const v = this.getAttribute(a);
        props[a] = v !== null && /^-?\d+$/.test(v) ? Number(v) : v;
      }
      this.unregister = registerThemed(this);
      this.app = createApp(component, props);
      this.app.mount(el);
    }

    private unmount() {
      this.app?.unmount();
      this.app = null;
      this.unregister?.();
      this.unregister = null;
    }
  }
  customElements.define(tag, Host);
}

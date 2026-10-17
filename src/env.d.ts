/// <reference types="vite/client" />
declare const __AP_BUILD_ID__: string;
declare const __AP_VERSION__: string;

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

/** Collected build/check findings. Errors fail `ap build` / `ap check`; warnings never do. */
export interface Where {
  file?: string;
  line?: number;
  path?: string;
}

export interface Diagnostic extends Where {
  level: 'error' | 'warn';
  message: string;
}

export class Diagnostics {
  readonly items: Diagnostic[] = [];
  /** Rewrites locations as they are reported (the manifest maps `preset.yaml` paths to fragments). */
  locate?: (where: Where) => Where;
  error(message: string, where: Where = {}) {
    this.items.push({ level: 'error', message, ...(this.locate ? this.locate(where) : where) });
  }
  warn(message: string, where: Where = {}) {
    this.items.push({ level: 'warn', message, ...(this.locate ? this.locate(where) : where) });
  }
  get errors() {
    return this.items.filter((d) => d.level === 'error');
  }
  get warnings() {
    return this.items.filter((d) => d.level === 'warn');
  }
  get ok() {
    return this.errors.length === 0;
  }
}

const color = (code: number, s: string) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);

export function formatDiagnostic(d: Diagnostic): string {
  const loc = [d.file, d.line].filter((x) => x !== undefined).join(':');
  const tag = d.level === 'error' ? color(31, 'error') : color(33, 'warn ');
  return `${tag} ${loc ? color(2, loc) + ' ' : ''}${d.path ? color(36, d.path) + ': ' : ''}${d.message}`;
}

export function report(diag: Diagnostics, log: (s: string) => void = console.error): void {
  for (const d of diag.items) log(formatDiagnostic(d));
  const e = diag.errors.length;
  const w = diag.warnings.length;
  if (e || w) log(`${e} error${e === 1 ? '' : 's'}, ${w} warning${w === 1 ? '' : 's'}`);
}

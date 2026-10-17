/** Minimal semver comparison and range tests (`<7.0.0`, `>=6 <7`, `6.x`). */
export function parseVersion(v: string): [number, number, number, string] {
  const m = /^v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?(?:-([0-9A-Za-z.-]+))?/.exec(v.trim());
  if (!m) return [0, 0, 0, ''];
  const n = (s?: string) => (s === undefined || s === 'x' || s === '*' ? 0 : Number(s));
  return [n(m[1]), n(m[2]), n(m[3]), m[4] ?? ''];
}

export function compareVersions(a: string, b: string): number {
  const x = parseVersion(a);
  const y = parseVersion(b);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return (x[i] as number) - (y[i] as number);
  if (x[3] === y[3]) return 0;
  if (!x[3]) return 1;
  if (!y[3]) return -1;
  return x[3] < y[3] ? -1 : 1;
}

export function satisfies(version: string, range: string): boolean {
  return range.trim().split(/\s+/).every((part) => {
    const m = /^(<=|>=|<|>|=)?(.+)$/.exec(part);
    if (!m) return false;
    const op = m[1] ?? '=';
    const target = m[2]!;
    if (op === '=' && /x|\*/.test(target)) {
      const t = target.split('.');
      const v = parseVersion(version);
      return t.every((p, i) => p === 'x' || p === '*' || Number(p) === v[i]);
    }
    const c = compareVersions(version, target);
    return op === '<' ? c < 0 : op === '<=' ? c <= 0 : op === '>' ? c > 0 : op === '>=' ? c >= 0 : c === 0;
  });
}

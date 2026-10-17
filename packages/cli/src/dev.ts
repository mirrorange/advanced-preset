/**
 * `ap dev`: rebuild on change and serve the artifact over HTTP (CORS + private-network access) so
 * the extension's Debug tab can hot-replace the preset.
 *
 *   GET /           → { id, name, version, hash, builtAt, ok, errors, warnings }
 *   GET /preset     → the artifact (last successful build)
 */
import { createServer, type ServerResponse } from 'node:http';
import { watch } from 'node:fs';
import { relative } from 'node:path';
import type { APreset } from '@advanced-preset/protocol';
import { buildDir, isSourcePath, writeArtifact } from './io';
import { formatDiagnostic, report, type Diagnostic } from './diagnostics';

export interface DevOptions {
  root: string;
  outDir: string;
  port: number;
  host: string;
}

export async function dev(o: DevOptions): Promise<void> {
  let artifact: APreset | undefined;
  let state = { builtAt: 0, ok: false, errors: [] as string[], warnings: [] as string[] };

  const rebuild = async () => {
    const t0 = Date.now();
    const { preset, diag } = await buildDir(o.root);
    const fmt = (d: Diagnostic) => formatDiagnostic(d).replace(/\x1b\[\d+m/g, '');
    state = { builtAt: Date.now(), ok: diag.ok, errors: diag.errors.map(fmt), warnings: diag.warnings.map(fmt) };
    report(diag);
    if (preset && diag.ok) {
      artifact = preset;
      await writeArtifact(preset, o.outDir);
      console.log(`✓ ${preset.id} ${preset.version} #${preset.hash} (${Date.now() - t0} ms)`);
    } else console.log('✗ build failed; serving the last good artifact');
  };
  await rebuild();

  let timer: NodeJS.Timeout | undefined;
  watch(o.root, { recursive: true }, (_event, file) => {
    if (!file || !isSourcePath(relative(o.root, `${o.root}/${file}`))) return;
    clearTimeout(timer);
    timer = setTimeout(() => void rebuild(), 120);
  });

  const send = (res: ServerResponse, status: number, body: unknown) => {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'access-control-allow-private-network': 'true',
      'access-control-allow-headers': '*',
    });
    res.end(JSON.stringify(body));
  };
  createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    if (req.method === 'OPTIONS') return send(res, 204, null);
    if (url.pathname === '/') return send(res, 200, { id: artifact?.id, name: artifact?.name, version: artifact?.version, hash: artifact?.hash, ...state });
    if (url.pathname === '/preset') return artifact ? send(res, 200, artifact) : send(res, 503, { error: 'no successful build yet' });
    send(res, 404, { error: 'not found' });
  }).listen(o.port, o.host, () => console.log(`ap dev → http://${o.host === '0.0.0.0' ? 'localhost' : o.host}:${o.port}  (paste this URL into Advanced Preset → Debug)`));
}

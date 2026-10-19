import { readFileSync } from 'node:fs';
import { assemble, defaultVars, resolveConfiguration, upgradeArtifact, type APreset, type Transport } from '@advanced-preset/protocol';
import type { GenerationContext } from '@/core/context';

export const petals = upgradeArtifact(JSON.parse(readFileSync(new URL('../dist/presets/petals.apreset.json', import.meta.url), 'utf8')))!;

export function ctxFor(transport: Transport, workflowId = 'linear', over: Partial<GenerationContext> = {}, preset: APreset = petals): GenerationContext {
  const config = resolveConfiguration(preset, 'other', { connection: { transport, workflow: workflowId } });
  const workflow = preset.workflows.find((w) => w.id === workflowId)!;
  const vars = defaultVars(preset, config, { transport });
  const assembly = assemble({ preset, config, vars, data: {} }, workflow);
  return {
    id: 'ap-test', preset, config, origin: 'story', stType: 'normal', interceptorRan: true, dryRun: false,
    meta: { present: false, pure: false, mixed: false, segments: [], stripped: '', task: null },
    flags: {}, transport, workflow, stages: assembly.stages, structures: assembly.structures, assembly,
    inputIndex: 1, createdAt: 0, warnings: [], ...over,
  };
}

export async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const x of gen) out.push(x);
  return out;
}

/** SSE response split into odd-sized chunks, so readers have to re-assemble events. */
export function sseResponse(body: string): Response {
  const bytes = new TextEncoder().encode(body);
  const stream = new ReadableStream<Uint8Array>({
    start(c) { for (let i = 0; i < bytes.length; i += 7) c.enqueue(bytes.slice(i, i + 7)); c.close(); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
}

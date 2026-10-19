/** `ap preview`: show what a configuration produces — regions, stages and transport artifacts. */
import {
  TRANSPORTS, assemble, defaultVars, resolveConfiguration, turnArtifacts, withUserModules, workflowSummary, actorName,
  type APreset, type Transport, type UserModule,
} from '@advanced-preset/protocol';

export interface PreviewOptions {
  transport?: string;
  workflow?: string;
  config?: string;
  meta?: 'pure' | 'mixed';
  modules?: Record<string, boolean>;
  /** User modules merged in (keyword rules see empty chat text). */
  userModules?: UserModule[];
  json?: boolean;
}

export function preview(source: APreset, o: PreviewOptions): string {
  const { preset, skipped } = o.userModules ? withUserModules(source, o.userModules) : { preset: source, skipped: [] };
  const config = resolveConfiguration(preset, o.config ?? preset.defaultConfiguration, {
    connection: { ...(o.transport ? { transport: o.transport as Transport } : {}), ...(o.workflow ? { workflow: o.workflow } : {}) },
    modules: o.modules,
  });
  if (!TRANSPORTS.includes(config.connection.transport)) throw new Error(`unknown transport ${config.connection.transport}`);
  const pure = o.meta === 'pure';
  const vars = defaultVars(preset, config, {
    meta: { present: Boolean(o.meta), pure, mixed: o.meta === 'mixed', task: null, recent: false },
    gen: { origin: pure ? 'task' : 'story', type: 'normal', callerTools: false, callerSchema: false },
  });
  const workflow = pure ? preset.workflows.find((w) => w.kind === 'task') : undefined;
  if (workflow) vars.workflow = workflow.id;
  const a = assemble({ preset, config, vars, data: { metaText: o.meta ? '(meta text)' : '' } }, workflow);
  const transport = vars.transport;
  const wf = a.workflow;

  const artifacts: Record<string, unknown> = {};
  if (wf) {
    // Same builder as the extension; ST macros ({{user}}, …) stay unexpanded here.
    const t = turnArtifacts(preset.tools, wf, a.stages, a.structures, a.expand);
    const synthetic = preset.syntheticTurns.find((s) => s.id === config.connection.syntheticTurn);
    const init = synthetic && transport.startsWith('tool-') ? [{ type: 'function', function: { name: synthetic.tool.name, description: a.expand(synthetic.tool.description), parameters: { type: 'object', properties: {} } } }] : [];
    if (transport === 'structured') artifacts.schema = t.schema();
    if (transport === 'tool-single') artifacts.tools = [...init, t.submitTool()];
    if (transport === 'tool-multi') artifacts.tools = [...init, ...t.stageTools()];
  }
  if (o.json) return JSON.stringify({ vars: a.vars, ...(skipped.length ? { skipped } : {}), modules: a.modules.map((m) => m.id), structures: a.structures.map((s) => s.id), stages: a.stages, regions: a.regions, ...artifacts }, null, 2);

  const lines: string[] = [];
  const rule = (title: string) => lines.push('', `━━ ${title} ${'━'.repeat(Math.max(4, 60 - title.length))}`);
  lines.push(`${preset.name} ${preset.version} · ${transport} (${vars.style}) · workflow ${wf?.id ?? '—'} · config ${o.config ?? preset.defaultConfiguration}`);
  lines.push(`modules: ${a.modules.map((m) => m.id).join(', ')}`);
  for (const x of skipped) lines.push(`skipped: user module ${x.module} entry ${x.entry} (unknown insertion point \`${x.point}\`)`);
  lines.push(`structures: ${a.structures.map((s) => s.id).join(', ') || '—'}`);
  if (wf) lines.push(`stages: ${workflowSummary(a.stages, (x) => actorName(preset, config, x))}`);
  for (const r of preset.regions) {
    if (r.native) { rule(`${r.id} (native)`); continue; }
    const msgs = a.regions[r.id] ?? [];
    rule(`${r.id}${msgs.length ? '' : ' (empty)'}`);
    for (const m of msgs) lines.push(`[${m.role}]`, m.content, '');
  }
  for (const [k, v] of Object.entries(artifacts)) {
    rule(k);
    lines.push(JSON.stringify(v, null, 2));
  }
  return lines.join('\n');
}

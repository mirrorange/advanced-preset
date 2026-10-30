/** `ap` — Advanced Preset command line. */
import { parseArgs } from 'node:util';
import { basename, resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { parseUserModuleFile, type ParamValue } from '@advanced-preset/protocol';
import { buildDir, writeArtifact } from './io';
import { report } from './diagnostics';
import { bundledModules, parseParamArg, preview, templateModules } from './preview';
import { dev } from './dev';
import { init } from './init';
import { DEFAULT_TARGET, installSkills, listSkills } from './skills';

declare const __AP_VERSION__: string;
const VERSION = typeof __AP_VERSION__ === 'string' ? __AP_VERSION__ : '0.0.0-dev';

const HELP = `ap ${VERSION} — Advanced Preset toolchain

Usage
  ap build   [dir] [--out dist] [--strict]   compile sources to dist/<id>.apreset.json
  ap check   [dir] [--strict]                validate only
  ap dev     [dir] [--port 4747] [--host 127.0.0.1] [--out dist]
                                             rebuild on change and serve the artifact
  ap preview [dir] [--transport t] [--workflow w] [--config c] [--meta pure|mixed]
                   [--enable a,b] [--disable c] [--param id=value …] [--user-modules file]
                   [--bundled-modules a,b|all|none] [--user-module-templates a,b|all]
                   [--lang zh-cn] [--json] [--out file]
  ap init    <dir> [--id x] [--name "My Preset"] [--author me]
                                             scaffold a new preset repository
  ap skills  list                            list the bundled Agent Skills
  ap skills  install [dir] [--target .agents/skills]
                                             install / update the Agent Skills in a preset repo

--strict treats warnings as errors.`;

async function main(argv: string[]): Promise<number> {
  const [command, ...rest] = argv;
  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      out: { type: 'string' },
      strict: { type: 'boolean' },
      port: { type: 'string' },
      host: { type: 'string' },
      transport: { type: 'string' },
      workflow: { type: 'string' },
      config: { type: 'string' },
      meta: { type: 'string' },
      enable: { type: 'string' },
      disable: { type: 'string' },
      json: { type: 'boolean' },
      param: { type: 'string', multiple: true },
      'user-modules': { type: 'string' },
      'bundled-modules': { type: 'string' },
      'user-module-templates': { type: 'string' },
      lang: { type: 'string' },
      id: { type: 'string' },
      name: { type: 'string' },
      author: { type: 'string' },
      target: { type: 'string' },
    },
  });
  const dir = resolve(positionals[0] ?? '.');

  switch (command) {
    case 'build':
    case 'check': {
      const { preset, diag, manifestFiles = [] } = await buildDir(dir);
      report(diag);
      const failed = !diag.ok || (values.strict && diag.warnings.length > 0);
      if (failed || !preset) return 1;
      if (command === 'check') {
        console.log(`✓ ${preset.id} ${preset.version}: ${preset.modules.length} modules, ${preset.entries.length} entries, ${preset.workflows.length} workflows${manifestFiles.length > 1 ? `, ${manifestFiles.length - 1} manifest fragments` : ''}${preset.userModules.length ? `, ${preset.userModules.length} user modules` : ''}${preset.userModuleTemplates.length ? `, ${preset.userModuleTemplates.length} user module templates` : ''}`);
        return 0;
      }
      const file = await writeArtifact(preset, resolve(dir, values.out ?? 'dist'));
      console.log(`✓ ${file} #${preset.hash}`);
      return 0;
    }
    case 'dev':
      await dev({ root: dir, outDir: resolve(dir, values.out ?? 'dist'), port: Number(values.port ?? 4747), host: values.host ?? '127.0.0.1' });
      return new Promise<number>(() => {});
    case 'preview': {
      const { preset, diag, manifestFiles = [] } = await buildDir(dir);
      if (!preset || !diag.ok) { report(diag); return 1; }
      const toggles: Record<string, boolean> = {};
      for (const id of values.enable?.split(',').filter(Boolean) ?? []) toggles[id.trim()] = true;
      for (const id of values.disable?.split(',').filter(Boolean) ?? []) toggles[id.trim()] = false;
      const params: Record<string, ParamValue> = {};
      for (const arg of values.param ?? []) {
        const parsed = parseParamArg(preset, arg);
        if (typeof parsed === 'string') { console.error(parsed); return 1; }
        params[parsed.id] = parsed.value;
      }
      const meta = values.meta === 'pure' || values.meta === 'mixed' ? values.meta : undefined;
      const ids = (v: string) => v.split(',').map((x) => x.trim()).filter(Boolean);
      // A fresh install: the preset's bundled modules first, then any file / templates on top.
      const bundled = bundledModules(preset, values['bundled-modules'] !== undefined ? ids(values['bundled-modules']) : undefined, values.lang);
      if (typeof bundled === 'string') { console.error(bundled); return 1; }
      const userModules = [...bundled];
      if (values['user-modules']) userModules.push(...parseUserModuleFile(JSON.parse(await readFile(values['user-modules'], 'utf8'))).modules);
      if (values['user-module-templates']) {
        const picked = templateModules(preset, ids(values['user-module-templates']), values.lang);
        if (typeof picked === 'string') { console.error(picked); return 1; }
        userModules.push(...picked);
      }
      const out = preview(preset, { transport: values.transport, workflow: values.workflow, config: values.config, meta, modules: toggles, params, userModules, json: values.json });
      if (values.out) await writeFile(values.out, out);
      else console.log(out);
      return 0;
    }
    case 'init': {
      if (!positionals[0]) { console.error('usage: ap init <dir>'); return 1; }
      const id = values.id ?? basename(dir).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
      await init({ dir, id, name: values.name ?? id, author: values.author ?? '' });
      console.log(`✓ created ${dir}\n  cd ${positionals[0]} && npm install && npm run dev\n  Agent Skills: .agents/skills (see AGENTS.md)`);
      return 0;
    }
    case 'skills': {
      const sub = positionals[0];
      if (sub === 'list') {
        for (const s of await listSkills()) console.log(`${s.name}\n  ${s.description}\n`);
        return 0;
      }
      if (sub === 'install') {
        const root = resolve(positionals[1] ?? '.');
        const target = resolve(root, values.target ?? DEFAULT_TARGET);
        const results = await installSkills(target);
        const width = Math.max(...results.map((r) => r.name.length));
        for (const r of results) console.log(`  ${r.name.padEnd(width)}  ${r.status}`);
        console.log(`✓ ${results.length} skills in ${target}`);
        return 0;
      }
      console.error('usage: ap skills list | ap skills install [dir] [--target .agents/skills]');
      return 1;
    }
    case '--version':
    case '-v':
      console.log(VERSION);
      return 0;
    default:
      console.log(HELP);
      return command && command !== 'help' && command !== '--help' && command !== '-h' ? 1 : 0;
  }
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); },
);

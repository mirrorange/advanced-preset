// Mock OpenAI-compatible endpoint for AP E2E: generates schema-shaped JSON, tool calls or dialogue text.
import http from 'node:http';
import fs from 'node:fs';
import { handleMedia } from './mock-media.mjs';
const PORT = 5055;
/** Media endpoints without CORS headers (the browser blocks them: `auto` falls back to ST's /proxy). */
const NO_CORS_PORT = 5056;
const LOG = new URL('./mock-requests.jsonl', import.meta.url).pathname;
const delay = () => { try { return JSON.parse(fs.readFileSync(new URL('mock.json', import.meta.url).pathname, 'utf8')).delay ?? 15; } catch { return 15; } };
const plainStory = 'The rain had stopped by the time Mira reached the lighthouse. She pressed her palm against the cold door and listened.\n\n"Anyone there?" she called, and the sea answered with a slow, patient roar.';
// mock.json `media: true`: speech lines in the story and an illustration block in dialogue replies.
const mediaStory = 'The rain had stopped by the time Mira reached the lighthouse. She pressed her palm against the cold door and listened.\n\n<speech character="Mira">[whispering] "Anyone there?"</speech> she called. The sea answered with a slow, patient roar, and a voice drifted down from the lamp room: <speech character="Keeper">"Up here. Mind the seventh step."</speech>';
const illustration = '\n\n<Freesia_Illustration><prompt>A lone woman in a raincoat at the door of a lighthouse at dusk, wet stones, the sea behind her</prompt><ratio>3:4</ratio><caption>The lighthouse door</caption></Freesia_Illustration>';
let story = plainStory;
/** Reference image ids offered in the prompt ({{ap::image::refs}}: `- ref1: …`), picked for `refs`. */
let refIds = [];
function gen(schema, key = '', depth = 0) {
  if (!schema || depth > 6) return null;
  if (schema.anyOf || schema.oneOf) return gen((schema.anyOf || schema.oneOf).find((s) => s.type !== 'null') || {}, key, depth);
  if (schema.enum) return schema.enum[0];
  if (schema.const !== undefined) return schema.const;
  const t = Array.isArray(schema.type) ? schema.type.find((x) => x !== 'null') : schema.type;
  if (t === 'object' || schema.properties) {
    const o = {};
    for (const [k, v] of Object.entries(schema.properties || {})) o[k] = gen(v, k, depth + 1);
    return o;
  }
  if (key === 'refs' && t === 'array') return refIds.slice(0, 1);
  if (t === 'array') return [gen(schema.items || { type: 'string' }, key, depth + 1), gen(schema.items || { type: 'string' }, key, depth + 1)];
  if (t === 'number' || t === 'integer') return 1;
  if (t === 'boolean') return true;
  if (/final|content|draft|story|text/i.test(key)) return story;
  return `(${key || 'value'}) A short considered note about the scene and what should happen next.`;
}
function lastMsg(b) { return b.messages?.[b.messages.length - 1]; }
function respond(b, cfg = {}) {
  story = cfg.media ? mediaStory : plainStory;
  const prompt = (b.messages || []).map((m) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content))).join('\n');
  refIds = [...prompt.matchAll(/^- (ref\d+):/gm)].map((m) => m[1]);
  const extra = cfg.media ? illustration.replace('</prompt>', `</prompt>${refIds.length ? `<refs>${refIds[0]}</refs>` : ''}`) : '';
  const tools = b.tools || [];
  const rf = b.response_format;
  if (rf?.type === 'json_schema') {
    const out = gen(rf.json_schema.schema);
    // mock.json `memoryOps`: fixed memory operations for the memory structure field (e.g. z_memory_ops).
    if (cfg.memoryOps && out && typeof out === 'object') for (const k of Object.keys(out)) if (/memory/.test(k)) out[k] = cfg.memoryOps;
    return { text: JSON.stringify(out) };
  }
  if (tools.length) {
    const called = new Set((b.messages || []).flatMap((m) => (m.tool_calls || []).map((c) => c.function.name)));
    let name;
    if (b.tool_choice?.function?.name) name = b.tool_choice.function.name;
    // Tool names come from the preset (ap_stage_* / ask_questions / write_story …): prefer a submit-style
    // tool, otherwise the first tool not yet called (the synthetic init call already sits in history).
    else name = (tools.find((t) => /submit/.test(t.function.name)) || tools.find((t) => !called.has(t.function.name)))?.function.name;
    const tool = tools.find((t) => t.function.name === name);
    if (tool) {
      if (b.tool_choice === 'required' && !b.tool_choice?.function) {
        // parallel: call all stage tools not yet called
        const rest = tools.filter((t) => !called.has(t.function.name));
        return { calls: rest.map((t, i) => ({ id: `c${Date.now()}_${i}`, name: t.function.name, arguments: JSON.stringify(gen(t.function.parameters)) })) };
      }
      return { calls: [{ id: `c${Date.now()}`, name, arguments: JSON.stringify(gen(tool.function.parameters)) }] };
    }
  }
  const last = lastMsg(b);
  if (last?.role === 'assistant') {
    return { text: ` I'd like to know how tense this should feel.\n\nPetals: Keep it quiet and eerie; let the sea speak.\n\nFreesia: <START_OF_CONTENT>\n${story}${extra}` };
  }
  return { text: `Freesia: I'd like to know how tense this should feel.\n\nPetals: Keep it quiet and eerie.\n\nFreesia: <START_OF_CONTENT>\n${story}${extra}` };
}
const logMedia = (o) => fs.appendFileSync(LOG, JSON.stringify({ t: Date.now(), ...o }) + '\n');
http.createServer((req, res) => {
  const parts = [];
  req.on('data', (c) => parts.push(c));
  req.on('end', async () => {
    const raw = Buffer.concat(parts);
    if (await handleMedia(req, res, raw, { log: logMedia, delay: delay() })) return;
    const data = raw.toString('utf8');
    if (req.url.endsWith('/models')) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ object: 'list', data: [{ id: 'mock-1', object: 'model' }] })); }
    let b = {};
    try { b = JSON.parse(data || '{}'); } catch {}
    let cfg = {}; try { cfg = JSON.parse(fs.readFileSync(new URL('mock.json', import.meta.url).pathname, 'utf8')); } catch {}
    if (cfg.mode === 'error') { res.writeHead(500, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ error: { message: 'Mock upstream exploded' } })); }
    const r = respond(b, cfg);
    fs.appendFileSync(LOG, JSON.stringify({ t: Date.now(), url: req.url, body: b, reply: r }) + '\n');
    const id = 'chatcmpl-mock';
    if (b.stream) {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
      const send = (delta, finish = null) => res.write(`data: ${JSON.stringify({ id, object: 'chat.completion.chunk', model: 'mock-1', choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`);
      if (r.text) for (let i = 0; i < r.text.length; i += 24) { send({ content: r.text.slice(i, i + 24) }); await new Promise((x) => setTimeout(x, delay())); }
      for (const [index, c] of (r.calls || []).entries()) {
        send({ tool_calls: [{ index, id: c.id, type: 'function', function: { name: c.name, arguments: '' } }] });
        for (let i = 0; i < c.arguments.length; i += 40) { send({ tool_calls: [{ index, function: { arguments: c.arguments.slice(i, i + 40) } }] }); await new Promise((x) => setTimeout(x, delay())); }
      }
      send({}, r.calls ? 'tool_calls' : 'stop');
      res.write('data: [DONE]\n\n');
      return res.end();
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ id, object: 'chat.completion', model: 'mock-1', choices: [{ index: 0, finish_reason: r.calls ? 'tool_calls' : 'stop', message: { role: 'assistant', content: r.text ?? null, ...(r.calls ? { tool_calls: r.calls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: c.arguments } })) } : {}) } }], usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 } }));
  });
}).listen(PORT, () => console.log('mock on', PORT));
http.createServer((req, res) => {
  const parts = [];
  req.on('data', (c) => parts.push(c));
  req.on('end', async () => {
    if (await handleMedia(req, res, Buffer.concat(parts), { cors: false, log: logMedia, delay: delay() })) return;
    res.writeHead(404); res.end();
  });
}).listen(NO_CORS_PORT, () => console.log('mock (no CORS) on', NO_CORS_PORT));

// Mock OpenAI-compatible endpoint for AP E2E: generates schema-shaped JSON, tool calls or dialogue text.
import http from 'node:http';
import fs from 'node:fs';
const PORT = 5055;
const LOG = new URL('./mock-requests.jsonl', import.meta.url).pathname;
const delay = () => { try { return JSON.parse(fs.readFileSync(new URL('mock.json', import.meta.url).pathname, 'utf8')).delay ?? 15; } catch { return 15; } };
const story = 'The rain had stopped by the time Mira reached the lighthouse. She pressed her palm against the cold door and listened.\n\n"Anyone there?" she called, and the sea answered with a slow, patient roar.';
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
  if (t === 'array') return [gen(schema.items || { type: 'string' }, key, depth + 1), gen(schema.items || { type: 'string' }, key, depth + 1)];
  if (t === 'number' || t === 'integer') return 1;
  if (t === 'boolean') return true;
  if (/final|content|draft|story|text/i.test(key)) return story;
  return `(${key || 'value'}) A short considered note about the scene and what should happen next.`;
}
function lastMsg(b) { return b.messages?.[b.messages.length - 1]; }
function respond(b) {
  const tools = b.tools || [];
  const rf = b.response_format;
  if (rf?.type === 'json_schema') return { text: JSON.stringify(gen(rf.json_schema.schema)) };
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
    return { text: ` I'd like to know how tense this should feel.\n\nPetals: Keep it quiet and eerie; let the sea speak.\n\nFreesia: <START_OF_CONTENT>\n${story}` };
  }
  return { text: `Freesia: I'd like to know how tense this should feel.\n\nPetals: Keep it quiet and eerie.\n\nFreesia: <START_OF_CONTENT>\n${story}` };
}
http.createServer((req, res) => {
  let data = '';
  req.on('data', (c) => (data += c));
  req.on('end', async () => {
    if (req.url.endsWith('/models')) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ object: 'list', data: [{ id: 'mock-1', object: 'model' }] })); }
    let b = {};
    try { b = JSON.parse(data || '{}'); } catch {}
    let cfg = {}; try { cfg = JSON.parse(fs.readFileSync(new URL('mock.json', import.meta.url).pathname, 'utf8')); } catch {}
    if (cfg.mode === 'error') { res.writeHead(500, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ error: { message: 'Mock upstream exploded' } })); }
    const r = respond(b);
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

// Mock image / speech endpoints for the media E2E steps (served by mock.mjs).
//   Images: OpenAI /v1/images/generations|edits (b64 PNG), Gemini /v1beta/interactions and
//           /v1beta/models/<m>:generateContent (inline PNG), NovelAI /ai/generate-image (ZIP of a PNG).
//   Speech: OpenAI /v1/audio/speech and Fish /v1/tts (streamed 16-bit PCM tones).
import zlib from 'node:zlib';

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (buf) => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0); return b; };
const chunk = (type, data) => Buffer.concat([u32(data.length), Buffer.from(type), data, u32(crc32(Buffer.concat([Buffer.from(type), data])))]);

const PALETTE = [[0x5b, 0x8d, 0xef], [0xe8, 0x7a, 0x5d], [0x6c, 0xc5, 0x8f], [0xb4, 0x7c, 0xe0], [0xf2, 0xc1, 0x4e]];
let made = 0;

/** A PNG of `w`×`h`: a two-colour diagonal gradient with a moon, different for every call. */
export function png(w = 512, h = 384) {
  const [a, b] = [PALETTE[made % PALETTE.length], PALETTE[(made + 2) % PALETTE.length]];
  made++;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const t = (x / w + y / h) / 2;
      const moon = (x - w * 0.72) ** 2 + (y - h * 0.3) ** 2 < (h * 0.12) ** 2;
      const o = y * (w * 3 + 1) + 1 + x * 3;
      for (let i = 0; i < 3; i++) raw[o + i] = moon ? 250 : Math.round(a[i] * (1 - t) + b[i] * t);
    }
  }
  const ihdr = Buffer.concat([u32(w), u32(h), Buffer.from([8, 2, 0, 0, 0])]);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

/** A ZIP (stored) holding one file. */
export function zip(name, data) {
  const n = Buffer.from(name);
  const crc = crc32(data);
  const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt32LE(crc, 14); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(n.length, 26);
  const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt32LE(crc, 16); central.writeUInt32LE(data.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(n.length, 28);
  const dirAt = 30 + n.length + data.length;
  const dir = Buffer.concat([central, n]);
  const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(1, 8); end.writeUInt16LE(1, 10); end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(dirAt, 16);
  return Buffer.concat([local, n, data, dir, end]);
}

/** `ms` of 16-bit mono PCM at `rate`: a soft tone whose pitch follows the text. */
export function pcm(text, rate = 24000, ms = Math.min(2400, 300 + text.length * 45)) {
  const n = Math.round((rate * ms) / 1000);
  const buf = Buffer.alloc(n * 2);
  const f = 220 + (crc32(Buffer.from(text)) % 220);
  for (let i = 0; i < n; i++) {
    const env = Math.min(1, i / 800, (n - i) / 800);
    buf.writeInt16LE(Math.round(Math.sin((2 * Math.PI * f * i) / rate) * 6000 * env), i * 2);
  }
  return buf;
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-expose-headers': '*',
};

const isMedia = (url) => /\/images\/(generations|edits)|\/interactions|:generateContent|\/ai\/generate-image|\/audio\/speech|\/v1\/tts/.test(url);

/**
 * Handle a media request; returns false for other URLs. `cors`: answer with CORS headers (the
 * second mock port leaves them out, so `auto` has to fall back to the proxy).
 */
export async function handleMedia(req, res, body, { cors = true, log = () => {}, delay = 40 } = {}) {
  const url = req.url;
  if (req.method === 'OPTIONS') {
    res.writeHead(cors ? 204 : 404, cors ? CORS : {});
    res.end();
    return true;
  }
  if (!isMedia(url)) return false;
  const headers = cors ? CORS : {};
  let b = {};
  try { b = JSON.parse(body.toString('utf8') || '{}'); } catch { b = { binary: body.length }; }
  log({ url, media: true, cors, headers: { authorization: req.headers.authorization, 'x-goog-api-key': req.headers['x-goog-api-key'], 'content-type': req.headers['content-type'] }, body: summarize(b) });
  await new Promise((r) => setTimeout(r, delay * 10));
  const json = (o) => { res.writeHead(200, { 'content-type': 'application/json', ...headers }); res.end(JSON.stringify(o)); };
  if (/\/images\/(generations|edits)/.test(url)) return json({ created: Date.now(), data: [{ b64_json: png().toString('base64') }] }), true;
  if (/\/interactions/.test(url)) return json({ id: 'int-mock', steps: [{ type: 'model_output', content: [{ type: 'image', mime_type: 'image/png', data: png().toString('base64') }] }] }), true;
  if (/:generateContent/.test(url)) return json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: png().toString('base64') } }] }, finishReason: 'STOP' }] }), true;
  if (/\/ai\/generate-image/.test(url)) {
    res.writeHead(200, { 'content-type': 'application/x-zip-compressed', ...headers });
    return res.end(zip('image_0.png', png(384, 512))), true;
  }
  // Speech: stream the PCM in small pieces.
  const text = String(b.input ?? b.text ?? '');
  const rate = Number(b.sample_rate) || 24000;
  const audio = pcm(text, rate);
  res.writeHead(200, { 'content-type': 'audio/pcm', ...headers });
  for (let i = 0; i < audio.length; i += 4800) { res.write(audio.subarray(i, i + 4800)); await new Promise((r) => setTimeout(r, delay)); }
  res.end();
  return true;
}

/** Request body for the log, without base64 payloads. */
function summarize(b) {
  return JSON.parse(JSON.stringify(b, (k, v) => (typeof v === 'string' && v.length > 200 ? `<${v.length} chars>` : v)));
}

/** Minimal ZIP reader (stored / deflate entries) for NovelAI's image responses. */

export interface ZipEntry { name: string; data: Uint8Array }

const u16 = (b: DataView, o: number) => b.getUint16(o, true);
const u32 = (b: DataView, o: number) => b.getUint32(o, true);

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Entries of a ZIP archive, from its central directory. */
export async function unzip(bytes: Uint8Array): Promise<ZipEntry[]> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 0xffff); i--) {
    if (u32(view, i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a ZIP archive');
  const count = u16(view, eocd + 10);
  let p = u32(view, eocd + 16);
  const out: ZipEntry[] = [];
  const names = new TextDecoder();
  for (let n = 0; n < count; n++) {
    if (u32(view, p) !== 0x02014b50) throw new Error('Broken ZIP directory');
    const method = u16(view, p + 10);
    const size = u32(view, p + 20);
    const nameLen = u16(view, p + 28);
    const extraLen = u16(view, p + 30);
    const commentLen = u16(view, p + 32);
    const local = u32(view, p + 42);
    const name = names.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith('/')) continue;
    const start = local + 30 + u16(view, local + 26) + u16(view, local + 28);
    const raw = bytes.subarray(start, start + size);
    if (method === 0) out.push({ name, data: raw });
    else if (method === 8) out.push({ name, data: await inflateRaw(raw) });
    else throw new Error(`Unsupported ZIP compression ${method}`);
  }
  return out;
}

/** MIME type of image bytes from their signature. */
export function sniffImage(b: Uint8Array): string | undefined {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif';
  const head = new TextDecoder().decode(b.subarray(0, 256)).trimStart();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'image/svg+xml';
  return undefined;
}

/** Minimal MessagePack encoder (Fish Audio takes inline reference audio only as MessagePack). */

type Value = null | boolean | number | string | Uint8Array | Value[] | { [k: string]: Value | undefined };

export function encodeMsgpack(value: Value): Uint8Array {
  const out: number[] = [];
  const u8 = (n: number): void => { out.push(n & 0xff); };
  const u16 = (n: number) => { u8(n >> 8); u8(n); };
  const u32 = (n: number) => { u8(n >>> 24); u8(n >>> 16); u8(n >>> 8); u8(n); };
  const bytes = (b: ArrayLike<number>) => { for (let i = 0; i < b.length; i++) out.push(b[i]!); };

  const write = (v: Value | undefined): void => {
    if (v === null || v === undefined) return u8(0xc0);
    if (v === false) return u8(0xc2);
    if (v === true) return u8(0xc3);
    if (typeof v === 'number') {
      if (Number.isInteger(v) && v >= 0 && v < 2 ** 32) {
        if (v < 0x80) return u8(v);
        if (v < 0x100) { u8(0xcc); return u8(v); }
        if (v < 0x10000) { u8(0xcd); return u16(v); }
        u8(0xce); return u32(v);
      }
      if (Number.isInteger(v) && v < 0 && v >= -(2 ** 31)) {
        if (v >= -32) return u8(v);
        u8(0xd2); return u32(v);
      }
      const view = new DataView(new ArrayBuffer(8));
      view.setFloat64(0, v);
      u8(0xcb);
      return bytes(new Uint8Array(view.buffer));
    }
    if (typeof v === 'string') {
      const b = new TextEncoder().encode(v);
      if (b.length < 32) u8(0xa0 | b.length);
      else if (b.length < 0x100) { u8(0xd9); u8(b.length); }
      else if (b.length < 0x10000) { u8(0xda); u16(b.length); }
      else { u8(0xdb); u32(b.length); }
      return bytes(b);
    }
    if (v instanceof Uint8Array) {
      if (v.length < 0x100) { u8(0xc4); u8(v.length); }
      else if (v.length < 0x10000) { u8(0xc5); u16(v.length); }
      else { u8(0xc6); u32(v.length); }
      return bytes(v);
    }
    if (Array.isArray(v)) {
      if (v.length < 16) u8(0x90 | v.length);
      else if (v.length < 0x10000) { u8(0xdc); u16(v.length); }
      else { u8(0xdd); u32(v.length); }
      for (const x of v) write(x);
      return;
    }
    const entries = Object.entries(v).filter(([, x]) => x !== undefined);
    if (entries.length < 16) u8(0x80 | entries.length);
    else if (entries.length < 0x10000) { u8(0xde); u16(entries.length); }
    else { u8(0xdf); u32(entries.length); }
    for (const [k, x] of entries) { write(k); write(x); }
  };

  write(value);
  return new Uint8Array(out);
}

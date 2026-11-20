// Decodes a PNG into 8-bit RGBA pixels and encodes RGBA pixels as a PNG. No dependencies:
// node:zlib does the compression. Used by scripts/check-drawings.mjs.
import { deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** `{ width, height, data }`, data being RGBA bytes row by row, not premultiplied. */
export function decodePNG(buf) {
  if (buf.length < 24 || !buf.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG");
  const width = buf.readUInt32BE(16), height = buf.readUInt32BE(20);
  const bitDepth = buf[24], colorType = buf[25], interlace = buf[28];
  if (interlace) throw new Error("interlaced PNGs are not supported");
  const idat = [];
  let plte = null, trns = null;
  for (let p = 8; p + 12 <= buf.length; ) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("latin1", p + 4, p + 8);
    if (type === "IDAT") idat.push(buf.subarray(p + 8, p + 8 + len));
    else if (type === "PLTE") plte = buf.subarray(p + 8, p + 8 + len);
    else if (type === "tRNS") trns = buf.subarray(p + 8, p + 8 + len);
    else if (type === "IEND") break;
    p += 12 + len;
  }
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`PNG color type ${colorType}`);
  if (colorType === 3 ? bitDepth !== 8 : bitDepth !== 8 && bitDepth !== 16) throw new Error(`PNG bit depth ${bitDepth} with color type ${colorType}`);
  const bpp = (channels * bitDepth) / 8;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  if (raw.length < (stride + 1) * height) throw new Error("PNG image data is cut short");
  const out = new Uint8Array(width * height * 4);
  const wide = bitDepth === 16;
  const sample = (line, x, c) => line[(x * channels + c) * (wide ? 2 : 1)]; // high byte of a 16-bit sample
  let prev = new Uint8Array(stride), line = new Uint8Array(stride);
  for (let y = 0; y < height; y++) {
    const start = y * (stride + 1), filter = raw[start];
    const src = raw.subarray(start + 1, start + 1 + stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      line[i] = v;
    }
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      if (colorType === 6) { for (let c = 0; c < 4; c++) out[o + c] = sample(line, x, c); }
      else if (colorType === 2) { for (let c = 0; c < 3; c++) out[o + c] = sample(line, x, c); out[o + 3] = 255; }
      else if (colorType === 4) { const g = sample(line, x, 0); out[o] = out[o + 1] = out[o + 2] = g; out[o + 3] = sample(line, x, 1); }
      else if (colorType === 0) { const g = sample(line, x, 0); out[o] = out[o + 1] = out[o + 2] = g; out[o + 3] = 255; }
      else {
        const i = line[x];
        out[o] = plte[i * 3]; out[o + 1] = plte[i * 3 + 1]; out[o + 2] = plte[i * 3 + 2];
        out[o + 3] = trns && i < trns.length ? trns[i] : 255;
      }
    }
    if (colorType === 2 && trns && !wide) {
      // A single transparent color.
      const [r, g, b] = [trns[1], trns[3], trns[5]];
      for (let x = 0; x < width; x++) { const o = (y * width + x) * 4; if (out[o] === r && out[o + 1] === g && out[o + 2] === b) out[o + 3] = 0; }
    }
    [prev, line] = [line, prev];
  }
  return { width, height, data: out };
}

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "latin1");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}

/** A PNG of RGBA bytes (row by row, not premultiplied). */
export function encodePNG({ width, height, data }) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) Buffer.from(data.buffer, data.byteOffset + y * width * 4, width * 4).copy(raw, y * (width * 4 + 1) + 1);
  return Buffer.concat([SIGNATURE, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 6 })), chunk("IEND", Buffer.alloc(0))]);
}

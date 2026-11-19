// Makes the pictures in assets/ui-kit-svg/img/ that are too large to deploy smaller.
// No dependencies: node:zlib reads and writes the PNG data.
//
//   node scripts/shrink-pictures.mjs [--over 16]
//
// Cloudflare takes static files up to 25 MiB. Two wallpapers in Apple's kits are larger, as the
// PNGs Figma wrote. A PNG over `--over` MiB (default 16) is written again, at 8 bits a channel and
// packed as tightly as PNG allows; if that is still too large it is halved in width and height,
// again if needed. It keeps its name, so
// the SVGs that point to it need no change: an image element draws its picture at the size the
// element gives, whatever the picture's own pixel size. The color profile is kept.
//
// Reads 8 and 16-bit truecolor PNGs with or without alpha (16-bit is written as 8-bit). Anything
// else is left as it is and reported.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, inflateSync, crc32 } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const KEEP = new Set(["sRGB", "gAMA", "cHRM", "iCCP", "cICP"]); // what says which colors the numbers mean

function paeth(a, b, c) {
  const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

/** `{ width, height, channels (3 or 4), pixels (8 bits a channel), extra (chunks to keep) }`, or a reason it cannot be read. */
export function decodePng(buf) {
  if (buf.length < 33 || !buf.subarray(0, 8).equals(SIGNATURE)) return { error: "not a PNG" };
  const width = buf.readUInt32BE(16), height = buf.readUInt32BE(20);
  const bitDepth = buf[24], colorType = buf[25], interlace = buf[28];
  if (interlace) return { error: "interlaced" };
  if ((colorType !== 2 && colorType !== 6) || (bitDepth !== 8 && bitDepth !== 16)) return { error: `color type ${colorType}, ${bitDepth} bits` };
  const idat = [], extra = [];
  for (let p = 8; p + 12 <= buf.length; ) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("latin1", p + 4, p + 8);
    if (type === "IDAT") idat.push(buf.subarray(p + 8, p + 8 + len));
    else if (KEEP.has(type)) extra.push(buf.subarray(p, p + 12 + len));
    else if (type === "IEND") break;
    p += 12 + len;
  }
  const channels = colorType === 6 ? 4 : 3;
  const bytes = bitDepth / 8;
  const bpp = channels * bytes;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  if (raw.length < (stride + 1) * height) return { error: "image data is cut short" };
  const pixels = new Uint8Array(width * height * channels);
  let prev = new Uint8Array(stride), line = new Uint8Array(stride);
  for (let y = 0; y < height; y++) {
    const start = y * (stride + 1);
    const filter = raw[start];
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = raw[start + 1 + i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      line[i] = v;
    }
    const row = y * width * channels;
    // A 16-bit sample's first byte is its high byte.
    for (let i = 0, n = width * channels; i < n; i++) pixels[row + i] = line[i * bytes];
    [prev, line] = [line, prev];
  }
  return { width, height, channels, pixels, extra };
}

/** Half the width and height: each new pixel is the mean of a 2 × 2 block, weighted by alpha where there is alpha. */
export function halve({ width, height, channels, pixels, extra }) {
  const w = Math.ceil(width / 2), h = Math.ceil(height / 2);
  const out = new Uint8Array(w * h * channels);
  for (let y = 0; y < h; y++) {
    const y0 = 2 * y, y1 = Math.min(height - 1, y0 + 1);
    for (let x = 0; x < w; x++) {
      const x0 = 2 * x, x1 = Math.min(width - 1, x0 + 1);
      const at = [(y0 * width + x0) * channels, (y0 * width + x1) * channels, (y1 * width + x0) * channels, (y1 * width + x1) * channels];
      const o = (y * w + x) * channels;
      if (channels === 3) {
        for (let c = 0; c < 3; c++) out[o + c] = (pixels[at[0] + c] + pixels[at[1] + c] + pixels[at[2] + c] + pixels[at[3] + c] + 2) >> 2;
      } else {
        const alpha = pixels[at[0] + 3] + pixels[at[1] + 3] + pixels[at[2] + 3] + pixels[at[3] + 3];
        for (let c = 0; c < 3; c++) {
          const sum = pixels[at[0] + c] * pixels[at[0] + 3] + pixels[at[1] + c] * pixels[at[1] + 3] + pixels[at[2] + c] * pixels[at[2] + 3] + pixels[at[3] + c] * pixels[at[3] + 3];
          out[o + c] = alpha ? Math.round(sum / alpha) : 0;
        }
        out[o + 3] = (alpha + 2) >> 2;
      }
    }
  }
  return { width: w, height: h, channels, pixels: out, extra };
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "latin1");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])) >>> 0, 0);
  return Buffer.concat([head, data, tail]);
}

/** An 8-bit PNG of the image. Each row takes the filter that leaves the smallest numbers, as PNG writers do. */
export function encodePng({ width, height, channels, pixels, extra = [] }) {
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  const tries = [0, 1, 2, 3, 4].map(() => new Uint8Array(stride));
  const zero = new Uint8Array(stride);
  for (let y = 0; y < height; y++) {
    const line = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y ? pixels.subarray((y - 1) * stride, y * stride) : zero;
    const sums = [0, 0, 0, 0, 0];
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? line[i - channels] : 0, b = prev[i], c = i >= channels ? prev[i - channels] : 0;
      const v = line[i];
      const f = [v, (v - a) & 255, (v - b) & 255, (v - ((a + b) >> 1)) & 255, (v - paeth(a, b, c)) & 255];
      for (let k = 0; k < 5; k++) {
        tries[k][i] = f[k];
        sums[k] += f[k] < 128 ? f[k] : 256 - f[k];
      }
    }
    const best = sums.indexOf(Math.min(...sums));
    raw[y * (stride + 1)] = best;
    raw.set(tries[best], y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = channels === 4 ? 6 : 2;
  return Buffer.concat([SIGNATURE, chunk("IHDR", ihdr), ...extra, chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const at = args.indexOf("--over");
  const limit = (at >= 0 ? Number(args[at + 1]) : 16) * 1048576;
  const folder = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "ui-kit-svg", "img");
  const mb = (n) => (n / 1048576).toFixed(1) + " MB";
  let shrunk = 0, left = 0;
  for (const name of readdirSync(folder).sort()) {
    const path = join(folder, name);
    const size = statSync(path).size;
    if (size <= limit) continue;
    if (!name.endsWith(".png")) { console.log(`${name}: ${mb(size)}, not a PNG; left as it is.`); left++; continue; }
    let image = decodePng(readFileSync(path));
    if (image.error) { console.log(`${name}: ${mb(size)}, ${image.error}; left as it is.`); left++; continue; }
    const from = `${image.width} × ${image.height}`;
    // Written again at 8 bits and well packed, a picture is often small enough at its full size.
    let out = encodePng(image);
    while (out.length > limit && image.width > 64) {
      image = halve(image);
      out = encodePng(image);
    }
    writeFileSync(path, out);
    shrunk++;
    console.log(`${name}: ${from}, ${mb(size)} is now ${image.width} × ${image.height}, ${mb(out.length)}.`);
  }
  console.log(`${shrunk} pictures made smaller, ${left} over ${mb(limit)} left as they are.`);
}

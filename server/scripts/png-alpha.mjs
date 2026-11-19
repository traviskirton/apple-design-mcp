// Reads a PNG's size and alpha channel, and finds the see-through holes inside an image, such as
// the screen of a device bezel. No dependencies: node:zlib inflates the image data.
//
//   node scripts/png-alpha.mjs FILE.png [FILE.png ...]     print each image's size and holes
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Width and height from the header alone, without decoding the image. */
export function pngSize(buf) {
  if (buf.length < 24 || !buf.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/**
 * The alpha of every pixel, 0 to 255, row by row. `alpha` is null for an image without
 * transparency. Handles 8 and 16-bit truecolor and gray with alpha, and palettes with tRNS.
 */
export function pngAlpha(buf) {
  const { width, height } = pngSize(buf);
  const bitDepth = buf[24], colorType = buf[25], interlace = buf[28];
  if (interlace) throw new Error("interlaced PNGs are not supported");
  const idat = [];
  let trns = null;
  for (let p = 8; p + 12 <= buf.length; ) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("latin1", p + 4, p + 8);
    if (type === "IDAT") idat.push(buf.subarray(p + 8, p + 8 + len));
    else if (type === "tRNS") trns = buf.subarray(p + 8, p + 8 + len);
    else if (type === "IEND") break;
    p += 12 + len;
  }
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`PNG color type ${colorType}`);
  const hasAlpha = colorType === 4 || colorType === 6 || (colorType === 3 && trns);
  if (!hasAlpha) return { width, height, alpha: null };
  if (colorType !== 3 && bitDepth !== 8 && bitDepth !== 16) throw new Error(`PNG bit depth ${bitDepth}`);
  if (colorType === 3 && bitDepth !== 8) throw new Error(`palette PNG with bit depth ${bitDepth}`);

  const bpp = (channels * bitDepth) / 8; // bytes per pixel
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  if (raw.length < (stride + 1) * height) throw new Error("PNG image data is cut short");
  const alpha = new Uint8Array(width * height);
  const alphaAt = colorType === 3 ? 0 : (channels - 1) * (bitDepth / 8); // the high byte of the alpha sample
  let prev = new Uint8Array(stride);
  let line = new Uint8Array(stride);
  for (let y = 0; y < height; y++) {
    const start = y * (stride + 1);
    const filter = raw[start];
    const src = raw.subarray(start + 1, start + 1 + stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
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
    const row = y * width;
    if (colorType === 3) for (let x = 0; x < width; x++) alpha[row + x] = line[x] < trns.length ? trns[line[x]] : 255;
    else for (let x = 0; x < width; x++) alpha[row + x] = line[x * bpp + alphaAt];
    [prev, line] = [line, prev];
  }
  return { width, height, alpha };
}

/**
 * The see-through areas enclosed by the image: connected regions of pixels with alpha below
 * `threshold` that do not reach the image's edge, largest first. A bezel's screen is the largest.
 * Regions smaller than `minShare` of the image are left out.
 */
export function findHoles({ width, height, alpha }, { threshold = 128, minShare = 0.01 } = {}) {
  if (!alpha) return [];
  // 0 = opaque, 1 = see-through and not yet visited, 2 = visited
  const state = new Uint8Array(width * height);
  for (let i = 0; i < state.length; i++) state[i] = alpha[i] < threshold ? 1 : 0;
  const stack = new Int32Array(width * height);
  const fill = (seed) => {
    let n = 0, area = 0, x0 = width, y0 = height, x1 = -1, y1 = -1;
    stack[n++] = seed;
    state[seed] = 2;
    while (n) {
      const i = stack[--n];
      const x = i % width, y = (i - x) / width;
      area++;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      if (x > 0 && state[i - 1] === 1) { state[i - 1] = 2; stack[n++] = i - 1; }
      if (x < width - 1 && state[i + 1] === 1) { state[i + 1] = 2; stack[n++] = i + 1; }
      if (y > 0 && state[i - width] === 1) { state[i - width] = 2; stack[n++] = i - width; }
      if (y < height - 1 && state[i + width] === 1) { state[i + width] = 2; stack[n++] = i + width; }
    }
    return { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1, area };
  };
  // Everything see-through that touches the edge is the outside of the device.
  for (let x = 0; x < width; x++) {
    if (state[x] === 1) fill(x);
    if (state[(height - 1) * width + x] === 1) fill((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    if (state[y * width] === 1) fill(y * width);
    if (state[y * width + width - 1] === 1) fill(y * width + width - 1);
  }
  const holes = [];
  for (let i = 0; i < state.length; i++) if (state[i] === 1) holes.push(fill(i));
  return holes.filter((h) => h.area >= width * height * minShare).sort((a, b) => b.area - a.area);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const file of process.argv.slice(2)) {
    const started = performance.now();
    const image = pngAlpha(readFileSync(file));
    const holes = findHoles(image);
    console.log(
      `${file}: ${image.width} × ${image.height}, ${image.alpha ? "has alpha" : "no alpha"}; ` +
        (holes.length ? holes.map((h) => `hole ${h.width} × ${h.height} at (${h.x}, ${h.y}), ${h.area} px`).join("; ") : "no enclosed see-through area") +
        `; ${((performance.now() - started) / 1000).toFixed(1)} s`,
    );
  }
}

// SF Symbol shapes as the extractor writes them into server/assets: the regular weight in
// symbols/NAME.svg, the other weights in symbol-weights/WEIGHT/SHARD.txt, one symbol per line
// (name, a tab, its SVG). src/symbols.ts reads the same files in the Worker.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const WEIGHTS = ["ultralight", "thin", "light", "regular", "medium", "semibold", "bold", "heavy", "black"];
const SHARDS = 256;

/** The weight's name for a font weight number such as 590 (Figma's SF Pro Semibold). */
export function weightName(n) {
  const w = Number(n);
  if (!w) return "regular";
  return WEIGHTS[Math.min(8, Math.max(0, Math.round(w / 100) - 1))];
}

/** FNV-1a of the name's UTF-8 bytes, as two hex digits. */
export function shardOf(name) {
  let h = 0x811c9dc5;
  for (const b of Buffer.from(name, "utf8")) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h % SHARDS).toString(16).padStart(2, "0");
}

const shards = new Map();

/** The symbol's SVG in a weight from `assets` (the server's assets folder), or null. */
export function readShape(assets, name, weight = "regular") {
  if (weight === "regular") {
    const path = join(assets, "symbols", `${name}.svg`);
    return existsSync(path) ? readFileSync(path, "utf8") : null;
  }
  const path = join(assets, "symbol-weights", weight, `${shardOf(name)}.txt`);
  if (!shards.has(path)) shards.set(path, existsSync(path) ? readFileSync(path, "utf8") : null);
  const text = shards.get(path);
  if (!text) return null;
  const line = text.split("\n").find((l) => l.startsWith(name + "\t"));
  return line ? line.slice(name.length + 1) : null;
}

/** The box the paths of a symbol's SVG cover (curves sampled), in its viewBox's units. */
export function inkBox(svg) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (const [, d] of svg.matchAll(/<path\b[^>]*\bd="([^"]*)"/g)) {
    const parts = d.match(/[MLQCZ]|-?[\d.]+(?:e-?\d+)?/gi) ?? [];
    let cmd = "", nums = [], cx = 0, cy = 0;
    const flush = () => {
      if (cmd === "M" || cmd === "L") for (let i = 0; i + 1 < nums.length; i += 2) { cx = nums[i]; cy = nums[i + 1]; add(cx, cy); }
      else if (cmd === "Q" && nums.length >= 4) {
        const [ax, ay, bx, by] = nums;
        for (let t = 0; t <= 1; t += 0.125) add((1 - t) ** 2 * cx + 2 * (1 - t) * t * ax + t * t * bx, (1 - t) ** 2 * cy + 2 * (1 - t) * t * ay + t * t * by);
        cx = bx; cy = by;
      } else if (cmd === "C" && nums.length >= 6) {
        const [ax, ay, bx, by, ex, ey] = nums;
        for (let t = 0; t <= 1; t += 0.0625) {
          const u = 1 - t;
          add(u ** 3 * cx + 3 * u * u * t * ax + 3 * u * t * t * bx + t ** 3 * ex, u ** 3 * cy + 3 * u * u * t * ay + 3 * u * t * t * by + t ** 3 * ey);
        }
        cx = ex; cy = ey;
      }
      nums = [];
    };
    for (const p of parts) {
      if (/^[MLQCZ]$/i.test(p)) { flush(); cmd = p.toUpperCase(); } else nums.push(Number(p));
    }
    flush();
  }
  return x0 === Infinity ? null : { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * A symbol's SVG drawn so its ink fills `box` (the footprint Figma reports for the glyph), in
 * `paint` ({ color, opacity }), as markup for a drawing: `<g transform=...><path data-symbol=...>`.
 */
export function placeSymbol(svg, box, paint, name, weight) {
  const ink = inkBox(svg);
  if (!ink || !ink.w || !ink.h) return null;
  const s = Math.min(box.w / ink.w, box.h / ink.h);
  const dx = box.x + (box.w - ink.w * s) / 2 - ink.x * s, dy = box.y + (box.h - ink.h * s) / 2 - ink.y * s;
  const r = (v) => +v.toFixed(3);
  const marks = ` data-symbol="${name}"` + (weight && weight !== "regular" ? ` data-symbol-weight="${weight}"` : "");
  const paths = [...svg.matchAll(/<path\b[^>]*\/>/g)].map((m) => m[0].replace(/^<path/, "<path" + marks)).join("");
  const fill = `fill="${paint.color}"` + (paint.opacity < 0.995 ? ` fill-opacity="${r(paint.opacity)}"` : "");
  return `<g transform="translate(${r(dx)} ${r(dy)}) scale(${+s.toFixed(5)})" ${fill}>${paths}</g>`;
}

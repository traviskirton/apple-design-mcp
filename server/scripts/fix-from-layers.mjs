// Puts back into the exported UI kit drawings two things Figma's SVG export leaves out, read from
// the layers themselves through Figma's REST API. Runs on a Mac (Figma token as for
// export-ui-kit-svg.mjs). No dependencies.
//
// - Font weight. Figma writes font-weight for some weights only: "SF Pro Heavy" (the macOS menu
//   bar's app name) and some semibold titles came out with none, so a browser drew them regular.
//   Each <text> without a weight gets the weight of the text layer with the same characters.
// - How a picture fills its shape. Figma wrote some pictures set to "fill" (cover the shape, cropped)
//   as if set to "fit" (the whole picture, with bands): the macOS image well. A picture whose layer
//   says FILL is placed to cover its shape.
//
//   node scripts/fix-from-layers.mjs [--kit macos] [--only 121:12529,121:13181] [--dry]
//
// Run it after export-ui-kit-svg.mjs and redraw-flattened.mjs; it can be run again.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { figma, workingToken } from "./export-ui-kit-svg.mjs";
import { browserFixes } from "./svg-for-browsers.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const NODES = 6; // drawings per request for their layers

const decode = (s) => s.replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)))
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const squash = (s) => s.replace(/\s+/g, "");

/** Text layers `{ name, chars, weight }` and picture layers `{ name, mode, w, h }` of a node tree. */
export function layersOf(root) {
  const texts = [], pictures = [];
  const walk = (node) => {
    if (node.visible === false) return;
    if (node.type === "TEXT") texts.push({ name: node.name, chars: squash(node.characters ?? ""), weight: node.style?.fontWeight });
    const image = (node.fills ?? []).find((f) => f.type === "IMAGE" && f.visible !== false);
    if (image && node.absoluteBoundingBox) pictures.push({ name: node.name, mode: image.scaleMode, w: node.absoluteBoundingBox.width, h: node.absoluteBoundingBox.height });
    (node.children ?? []).forEach(walk);
  };
  walk(root);
  return { texts, pictures };
}

/** `svg` with the weights and picture placements of `layers` put in. Returns `{ svg, weights, pictures }` counts. */
export function applyLayers(svg, { texts, pictures }) {
  let weights = 0, placed = 0;
  // Font weights: by the text's characters, or its id (the layer's name) when the characters are shared.
  svg = svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (all, attrs, body, at) => {
    if (/\bfont-weight=/.test(attrs)) return all;
    if (/<g\b[^>]*\bfont-weight="[^"]*"[^>]*>\s*$/.test(svg.slice(Math.max(0, at - 300), at))) return all;
    const chars = squash(decode(body.replace(/<[^>]+>/g, "")));
    if (!chars) return all;
    let found = texts.filter((t) => t.chars === chars);
    const id = /\bid="([^"]*)"/.exec(attrs)?.[1];
    if (new Set(found.map((t) => t.weight)).size > 1 && id) found = found.filter((t) => t.name === id);
    const ws = [...new Set(found.map((t) => t.weight))];
    if (ws.length !== 1 || !ws[0] || ws[0] === 400) return all;
    weights++;
    return `<text${attrs} font-weight="${ws[0]}">${body}</text>`;
  });
  // Pictures set to fill: the shape (by its id, the layer's name) -> pattern -> <use> of the image.
  const edits = [];
  for (const [, , attrs, pattern] of svg.matchAll(/<(rect|path)\b([^>]*)\sfill="url\(#(pattern[^)]+)\)"/g)) {
    const id = /\bid="([^"]*)"/.exec(attrs)?.[1];
    const layer = id ? pictures.filter((p) => p.name === id) : pictures.length === 1 ? pictures : [];
    if (layer.length !== 1 || layer[0].mode !== "FILL") continue;
    const pat = new RegExp(`(<pattern id="${pattern}" patternContentUnits="objectBoundingBox"[^>]*>\\s*<use (?:xlink:)?href="#([^"]+)" )transform="([^"]*)"`).exec(svg);
    if (!pat) continue;
    const img = new RegExp(`<image id="${pat[2]}"[^>]*\\swidth="([\\d.]+)" height="([\\d.]+)"`).exec(svg);
    if (!img) continue;
    const [iw, ih] = [Number(img[1]), Number(img[2])], { w, h } = layer[0];
    const s = Math.max(w / iw, h / ih);
    const kx = s / w, ky = s / h, tx = (1 - (iw * s) / w) / 2, ty = (1 - (ih * s) / h) / 2;
    const r = (v) => Number(v.toPrecision(6));
    const cover = `${tx || ty ? `translate(${r(tx)} ${r(ty)}) ` : ""}scale(${r(kx)}${Math.abs(kx - ky) > 1e-9 ? ` ${r(ky)}` : ""})`;
    if (pat[3] !== cover) edits.push([pat[0], `${pat[1]}transform="${cover}"`]);
  }
  for (const [from, to] of edits) if (svg.includes(from)) { svg = svg.replace(from, to); placed++; }
  return { svg, weights, pictures: placed };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const onlyKit = option("--kit");
  const only = option("--only") ? new Set(option("--only").split(",")) : null;
  const dry = args.includes("--dry");
  const files = JSON.parse(readFileSync(join(here, "figma", "kit-files.json"), "utf8"));
  const { default: pack } = await import(pathToFileURL(join(here, "..", "src", "pack", "ui-kit.js")).href);
  let token = null;
  for (const kit of pack.kits) {
    if (onlyKit && kit.id !== onlyKit) continue;
    const key = files[kit.id];
    if (!key) continue;
    token ??= await workingToken(key);
    const dir = join(here, "..", "assets", "ui-kit-svg", kit.id);
    const todo = [...new Set(kit.components.flatMap((c) => c.variants.map((v) => v.node)).filter(Boolean))]
      .filter((id) => (!only || only.has(id)) && existsSync(join(dir, id.replace(":", "-") + ".svg")))
      .filter((id) => /<text\b|url\(#pattern/.test(readFileSync(join(dir, id.replace(":", "-") + ".svg"), "utf8")));
    console.log(`${kit.name}: ${todo.length} drawings with text or pictures`);
    let weights = 0, pictures = 0, changed = 0, failed = 0;
    for (let at = 0; at < todo.length; at += NODES) {
      const part = todo.slice(at, at + NODES);
      let json;
      try { json = await figma(token, `/files/${key}/nodes?ids=${encodeURIComponent(part.join(","))}`); } catch (e) {
        if (e.status === 403 || e.status === 404) throw e;
        failed += part.length; console.log(`  ${part.join(",")}: ${e.message}`); continue;
      }
      for (const id of part) {
        const root = json.nodes?.[id]?.document;
        if (!root) { failed++; continue; }
        const file = join(dir, id.replace(":", "-") + ".svg");
        const before = readFileSync(file, "utf8");
        const out = applyLayers(before, layersOf(root));
        out.svg = browserFixes(out.svg); // Figma's variable weights to named ones, among others
        weights += out.weights; pictures += out.pictures;
        if (out.svg !== before) { changed++; if (!dry) writeFileSync(file, out.svg); }
      }
      if ((at / NODES) % 25 === 24) console.log(`  ${Math.min(at + NODES, todo.length)} of ${todo.length}`);
    }
    console.log(`${kit.name}: ${changed} drawings ${dry ? "would change" : "changed"}: ${weights} font weights put in, ${pictures} pictures placed to fill; ${failed} not read`);
  }
}

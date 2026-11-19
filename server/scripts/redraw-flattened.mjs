// Puts back as shapes and text what Figma wrote into an exported SVG as a small picture.
//
// Figma's SVG export through its API cannot write a layer with the blend mode it reports as
// LINEAR_BURN ("plus darker" in the app), nor layers shown through a mask under such a layer: it
// writes them as one PNG. In Apple's kits that is how most labels and symbols on glass are made,
// so a tab bar came out with its icons and titles as pictures. Exported alone, each such layer is
// a plain shape or text. This script reads the layers of every drawing that holds such a picture,
// exports the layers under the picture one by one, and puts them where the picture was:
//
// - a layer with the blend mode goes into a group with mix-blend-mode: multiply;
// - layers inside a mask take the color of the tint layer the mask showed (the selected tab);
// - an SF Symbol becomes its outline, marked data-symbol="name"; other text stays text.
//
//   node scripts/redraw-flattened.mjs [--kit ios] [--only 3:72207,10462:23337] [--dry]
//
// Run it after scripts/export-ui-kit-svg.mjs; it can be run again and skips drawings with no
// such picture. A picture with no layer found under it is left as it is and counted.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { download, figma, inParallel, render, workingToken } from "./export-ui-kit-svg.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const NODES = 6; // drawings per request for their layers
const BATCH = 40; // layers per render request
const PARALLEL = 8;
const SLACK = 1.5; // points a layer may reach past the picture's box

/** The pictures Figma wrote in place of layers: an image element with a place and its data inside the SVG. */
const FLAT = /<image x="([-\d.e]+)" y="([-\d.e]+)" width="([\d.e]+)" height="([\d.e]+)" preserveAspectRatio="none" (?:xlink:)?href="data:image\/[a-z]+;base64,[^"]+"\/>/g;
export const flattened = (svg) => [...svg.matchAll(FLAT)].map((m) => ({ all: m[0], x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));

const isPrivateUse = (s) => s.length > 0 && [...s].every((ch) => { const c = ch.codePointAt(0); return (c >= 0xe000 && c <= 0xf8ff) || c >= 0xf0000; });
const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const solid = (node) => (node.fills ?? []).filter((f) => f.type === "SOLID" && f.visible !== false).at(-1);
const LEAVES = new Set(["TEXT", "RECTANGLE", "VECTOR", "ELLIPSE", "LINE", "STAR", "REGULAR_POLYGON", "BOOLEAN_OPERATION"]);

/**
 * The layers of a drawing that Figma may have flattened, back to front: `{ id, type, box, shown,
 * characters, weight, burn, tint }`, with boxes relative to the drawing's own box. `burn` when the
 * layer or a group around it has the blend mode; `tint` (`{ color, opacity }`) when it is inside a mask.
 */
export function flatLayers(root) {
  const origin = root.absoluteBoundingBox;
  const rel = (b) => (b ? { x: b.x - origin.x, y: b.y - origin.y, w: b.width, h: b.height } : null);
  const out = [];
  const walk = (node, burn, tint) => {
    if (node.visible === false) return;
    const burns = burn || node.blendMode === "LINEAR_BURN";
    if (LEAVES.has(node.type)) {
      const box = rel(node.absoluteBoundingBox), shown = rel(node.absoluteRenderBounds) ?? box;
      if (box && (burns || tint)) out.push({ id: node.id, type: node.type, name: node.name, box, shown, characters: node.characters ?? "", weight: node.style?.fontWeight, opacity: node.opacity ?? 1, burn: burns, tint });
      return;
    }
    const children = node.children ?? [];
    let masked = false;
    children.forEach((child, i) => {
      if (masked) return; // drawn only through the mask before them
      if (child.isMask) {
        masked = true;
        // What the mask shows is the layers after it; its own layers only give the shape.
        const over = children.slice(i + 1).filter((s) => s.visible !== false && solid(s));
        const by = over.filter((s) => s.blendMode === "LINEAR_BURN").at(-1) ?? over.at(-1);
        const fill = by ? solid(by) : null;
        walk(child, false, fill ? { color: hex(fill.color), opacity: (fill.opacity ?? 1) * (fill.color.a ?? 1) * (by.opacity ?? 1) } : { color: "#000000", opacity: 1 });
      } else walk(child, tint ? false : burns, tint);
    });
  };
  walk(root, false, null);
  return out;
}

const inside = (l, p) => l.x >= p.x - SLACK && l.y >= p.y - SLACK && l.x + l.w <= p.x + p.w + SLACK && l.y + l.h <= p.y + p.h + SLACK;

/** For each picture, the layers that lie under it. A layer goes to the smallest picture that holds it. */
export function match(pictures, layers) {
  const found = pictures.map(() => []);
  for (const layer of layers) {
    let best = -1;
    pictures.forEach((p, i) => { if (inside(layer.shown, p) && (best < 0 || p.w * p.h < pictures[best].w * pictures[best].h)) best = i; });
    if (best >= 0) found[best].push(layer);
  }
  return found;
}

/**
 * One exported layer as markup to put into the drawing: `{ body, defs }`. `n` makes the ids of its
 * gradients and clips its own.
 */
export function asMarkup(layer, svg, n, nameOf) {
  let inner = /^<svg\b[^>]*>([\s\S]*)<\/svg>\s*$/.exec(svg.trim())?.[1];
  if (inner == null || /<image\b/.test(inner)) return null;
  let defs = "";
  inner = inner.replace(/<defs>([\s\S]*?)<\/defs>/g, (_, d) => { defs += d; return ""; });
  for (const id of new Set([...defs.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))) {
    const to = `r${n}_${id}`;
    const swap = (s) => s.replaceAll(`id="${id}"`, `id="${to}"`).replaceAll(`url(#${id})`, `url(#${to})`).replaceAll(`href="#${id}"`, `href="#${to}"`);
    defs = swap(defs);
    inner = swap(inner);
  }
  if (layer.type === "TEXT" && isPrivateUse(layer.characters.trim())) {
    const names = [...layer.characters.trim()].map((ch) => nameOf(ch.codePointAt(0))).join(" ");
    inner = inner.replace(/<path id="[^"]*"/g, "<path").replace(/<path /g, `<path data-symbol="${names}" `);
  } else if (layer.type === "TEXT") {
    inner = inner.replace(/font-family="(SF [^",]*|New York[^",]*)"/g, 'font-family="$1, -apple-system, system-ui, sans-serif"');
    if (layer.weight && layer.weight !== 400 && !/font-weight=/.test(inner)) inner = inner.replace(/<text\b([^>]*)>/g, `<text$1 font-weight="${layer.weight}">`);
  }
  if (layer.tint) {
    const paint = `fill="${layer.tint.color}"` + (layer.tint.opacity < 0.995 ? ` fill-opacity="${+layer.tint.opacity.toFixed(3)}"` : "");
    inner = inner.replace(/ fill-opacity="[^"]*"/g, "").replace(/ fill="(?!none)[^"]*"/g, " " + paint);
  }
  inner = inner.replace(/>\s*\n\s*</g, "><").trim();
  const attrs = [
    `transform="translate(${+layer.box.x.toFixed(3)} ${+layer.box.y.toFixed(3)})"`,
    layer.opacity < 0.995 ? `opacity="${+layer.opacity.toFixed(3)}"` : "",
    layer.burn && !layer.tint ? 'style="mix-blend-mode:multiply"' : "",
  ].filter(Boolean).join(" ");
  return { body: `<g ${attrs}>${inner}</g>`, defs: defs.replace(/>\s*\n\s*</g, "><").trim() };
}

/** `svg` with each picture that has markup replaced by it; `parts[i]` is the list of `{ body, defs }` for picture i. */
export function redraw(svg, pictures, parts) {
  let defs = "";
  pictures.forEach((p, i) => {
    if (!parts[i]?.length) return;
    svg = svg.replace(p.all, parts[i].map((m) => m.body).join(""));
    defs += parts[i].map((m) => m.defs).join("");
  });
  if (defs) svg = /<\/defs>\s*<\/svg>\s*$/.test(svg) ? svg.replace(/<\/defs>(\s*<\/svg>\s*)$/, defs + "</defs>$1") : svg.replace(/<\/svg>\s*$/, `<defs>${defs}</defs></svg>`);
  return svg;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const onlyKit = option("--kit"), only = option("--only")?.split(","), dry = args.includes("--dry");
  const files = JSON.parse(readFileSync(join(here, "figma", "kit-files.json"), "utf8"));
  const symbolNames = new Map();
  for (const line of readFileSync(join(here, "figma", "symbol-codepoints.txt"), "utf8").split("\n")) {
    const m = /^([0-9A-Fa-f]{4,6})\s+(\S+)/.exec(line);
    if (m) symbolNames.set(parseInt(m[1], 16), m[2]);
  }
  const nameOf = (code) => symbolNames.get(code) ?? "U+" + code.toString(16).toUpperCase();
  let token = null, n = 0;

  for (const [kit, key] of Object.entries(files)) {
    if (onlyKit && kit !== onlyKit) continue;
    const dir = join(here, "..", "assets", "ui-kit-svg", kit);
    if (!existsSync(dir)) continue;
    const todo = [];
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith(".svg")) continue;
      const id = name.slice(0, -4).replace("-", ":");
      if (only && !only.includes(id)) continue;
      const svg = readFileSync(join(dir, name), "utf8");
      const pictures = flattened(svg);
      if (pictures.length) todo.push({ id, path: join(dir, name), svg, pictures });
    }
    console.log(`${kit}: ${todo.length} drawings hold pictures in place of layers (${todo.reduce((s, t) => s + t.pictures.length, 0)} pictures).`);
    if (!todo.length) continue;
    token ??= await workingToken(key);

    // The layers of each drawing, and which lie under each picture.
    for (let at = 0; at < todo.length; at += NODES) {
      const part = todo.slice(at, at + NODES);
      const json = await figma(token, `/files/${key}/nodes?ids=${encodeURIComponent(part.map((t) => t.id).join(","))}`);
      for (const t of part) {
        const root = json.nodes?.[t.id]?.document;
        t.under = root ? match(t.pictures, flatLayers(root)) : t.pictures.map(() => []);
      }
    }
    // Each layer exported alone: symbols as outlines, everything else with text kept as text.
    const layers = todo.flatMap((t) => t.under.flat());
    const symbols = layers.filter((l) => l.type === "TEXT" && isPrivateUse(l.characters.trim()));
    const others = layers.filter((l) => !symbols.includes(l));
    const exported = new Map();
    for (const [list, outline] of [[symbols, true], [others, false]]) {
      for (let at = 0; at < list.length; at += BATCH) {
        const ids = list.slice(at, at + BATCH).map((l) => l.id);
        let urls = {};
        try { urls = await render(token, key, ids, outline); } catch (e) {
          if (e.status === 403 || e.status === 404) throw e;
          console.log(`  a batch of ${ids.length} layers did not render: ${e.message}`);
        }
        await inParallel(ids, PARALLEL, async (id) => { if (urls[id]) { try { exported.set(id, await download(urls[id])); } catch {} } });
      }
      console.log(`  ${list.length} ${outline ? "symbols" : "other layers"} exported`);
    }

    let fixed = 0, redrawn = 0, kept = 0, noLayer = 0, noExport = 0, rewritten = 0;
    const keptIn = [];
    for (const t of todo) {
      const parts = t.under.map((list) => {
        const made = list.map((l) => (exported.has(l.id) ? asMarkup(l, exported.get(l.id), ++n, nameOf) : null));
        // All of a picture's layers or none: half a label is worse than a picture of it.
        if (!list.length) { noLayer++; return null; }
        if (made.some((m) => !m)) { noExport++; return null; }
        redrawn += made.length;
        return made;
      });
      const done = parts.filter(Boolean).length;
      fixed += done;
      kept += t.pictures.length - done;
      if (done < t.pictures.length) keptIn.push(t.id);
      if (!done) continue;
      const svg = redraw(t.svg, t.pictures, parts);
      if (!dry) writeFileSync(t.path, svg);
      rewritten++;
      if (only) console.log(`  ${t.id}: ${done} of ${t.pictures.length} pictures redrawn, ${Buffer.byteLength(t.svg)} bytes before, ${Buffer.byteLength(svg)} now`);
    }
    console.log(`${kit}: ${fixed} pictures redrawn from ${redrawn} layers in ${rewritten} drawings${dry ? " (dry run, nothing written)" : ""}; ${kept} pictures kept (${noLayer} with no layer found under them, ${noExport} with a layer Figma would not export as shapes).`);
    if (keptIn.length) console.log(`  drawings that still hold such a picture: ${keptIn.length}, such as ${keptIn.slice(0, 12).join(", ")}`);
  }
}

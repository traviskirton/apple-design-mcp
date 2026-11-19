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
// - an SF Symbol becomes its outline, marked data-symbol="name" (and data-symbol-weight unless regular);
//   other text stays text. A symbol that is itself the mask (the iPhone Duo tab) does not export
//   alone, so it is drawn from the extractor's shapes in server/assets, in the layer's weight.
//
//   node scripts/redraw-flattened.mjs [--kit ios] [--only 3:72207,10462:23337] [--dry]
//
// Run it after scripts/export-ui-kit-svg.mjs; it can be run again and skips drawings with no
// such picture. A picture with no layer found under it is left as it is and counted.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { download, figma, inParallel, render, workingToken } from "./export-ui-kit-svg.mjs";
import { placeSymbol, readShape, weightName } from "./symbol-shapes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const NODES = 6; // drawings per request for their layers
const BATCH = 40; // layers per render request
const PARALLEL = 8;
const COVER = 3; // points the layers together may fall short of the picture's edges
const SLACK = 1.5; // points a layer may reach past the picture's box

/** The pictures Figma wrote in place of layers: an image element with a place and its data inside the SVG. */
// Small ones are still inside the SVG; scripts/svg-images.mjs has moved the larger ones to files. (A photo that fills a
// shape is written differently, as a pattern, and is not matched.)
const FLAT = /<image x="([-\d.e]+)" y="([-\d.e]+)" width="([\d.e]+)" height="([\d.e]+)" preserveAspectRatio="none"(?: style="[^"]*")? (?:xlink:)?href="(?:data:image\/[a-z]+;base64,[^"]+|https?:[^"]+\/ui-kit-svg\/img\/[^"]+)"\/>/g;
export const flattened = (svg) => [...svg.matchAll(FLAT)].map((m) => ({ all: m[0], x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));

const isPrivateUse = (s) => s.length > 0 && [...s].every((ch) => { const c = ch.codePointAt(0); return (c >= 0xe000 && c <= 0xf8ff) || c >= 0xf0000; });
const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const solid = (node) => (node.fills ?? []).filter((f) => f.type === "SOLID" && f.visible !== false).at(-1);
const LEAVES = new Set(["TEXT", "RECTANGLE", "VECTOR", "ELLIPSE", "LINE", "STAR", "REGULAR_POLYGON", "BOOLEAN_OPERATION"]);

/**
 * The layers of a drawing that Figma may have flattened, back to front: `{ id, type, box, shown,
 * characters, weight, burn, tint, flat, photo }`, with boxes relative to the drawing's own box. `burn` when a
 * group around the layer has the blend mode (its own blend mode comes with its export); `tint` (`{ color, opacity }`) when it is inside a mask;
 * `flat` when either holds; `photo` when it is filled with a picture.
 */
export function flatLayers(root) {
  const origin = root.absoluteBoundingBox;
  const rel = (b) => (b ? { x: b.x - origin.x, y: b.y - origin.y, w: b.width, h: b.height } : null);
  const out = [];
  const walk = (node, burn, tint) => {
    if (node.visible === false) return;
    const burns = burn || node.blendMode === "LINEAR_BURN";
    const box = rel(node.absoluteBoundingBox);
    if (LEAVES.has(node.type)) {
      const shown = rel(node.absoluteRenderBounds) ?? box;
      const photo = (node.fills ?? []).some((f) => f.type === "IMAGE" && f.visible !== false);
      if (box) out.push({ id: node.id, type: node.type, name: node.name, box, shown, characters: node.characters ?? "", weight: node.style?.fontWeight, burn: burns && node.blendMode !== "LINEAR_BURN", tint, flat: Boolean(burns || tint), photo });
      return;
    }
    // A group with the blend mode and a fill of its own (a search field's capsule): the fill is in the picture too.
    const own = node.blendMode === "LINEAR_BURN" && node !== root && box ? solid(node) : null;
    if (own) out.push({ id: node.id, type: "FILL", name: node.name, box, shown: box, characters: "", burn: true, tint: null, flat: true, photo: false, fill: { color: hex(own.color), opacity: (own.opacity ?? 1) * (own.color.a ?? 1) * (node.opacity ?? 1) }, radius: node.cornerRadius ?? 0 });
    const children = node.children ?? [];
    let masked = false;
    children.forEach((child, i) => {
      if (child.isMask) {
        // What the mask shows is the layers after it; its own layers only give the shape. Plain
        // fills after it only color that shape, so they are not drawn themselves.
        masked = true;
        const over = children.slice(i + 1).filter((s) => s.visible !== false && solid(s));
        const by = over.filter((s) => s.blendMode === "LINEAR_BURN").at(-1) ?? over.at(-1);
        const fill = by ? solid(by) : null;
        const paint = fill ? { color: hex(fill.color), opacity: (fill.opacity ?? 1) * (fill.color.a ?? 1) * (by.opacity ?? 1) } : { color: "#000000", opacity: 1 };
        if (child.type === "TEXT" && child.visible !== false && isPrivateUse((child.characters ?? "").trim())) {
          // The symbol is the mask itself, which Figma does not export: it is drawn from our own
          // shapes, where the fills it shows lie (Figma reports them already cut to the glyph).
          const cut = over.map((s) => rel(s.absoluteRenderBounds)).filter(Boolean);
          const shown = cut.length ? union(cut) : rel(child.absoluteRenderBounds) ?? rel(child.absoluteBoundingBox);
          if (shown) out.push({ id: child.id, type: "SYMBOL", name: child.name, box: shown, shown, characters: child.characters, weight: child.style?.fontWeight, burn: false, tint: paint, flat: true, photo: false });
          return;
        }
        walk(child, false, paint);
      } else if (masked && LEAVES.has(child.type) && child.type !== "TEXT" && solid(child)) {
        // A fill shown through the mask above: its color is in the masked layers already.
      } else walk(child, tint ? false : burns, tint);
    });
  };
  walk(root, false, null);
  return out;
}

const union = (boxes) => {
  const x0 = Math.min(...boxes.map((b) => b.x)), y0 = Math.min(...boxes.map((b) => b.y));
  return { x: x0, y: y0, w: Math.max(...boxes.map((b) => b.x + b.w)) - x0, h: Math.max(...boxes.map((b) => b.y + b.h)) - y0 };
};

const inside = (l, p) => l.x >= p.x - SLACK && l.y >= p.y - SLACK && l.x + l.w <= p.x + p.w + SLACK && l.y + l.h <= p.y + p.h + SLACK;

/**
 * For each picture, the layers that lie under it. A layer goes to the smallest picture that holds
 * it. A picture whose layers do not reach its edges (within `COVER` points) gets none: something
 * else is in it.
 */
export function match(pictures, layers) {
  const found = pictures.map(() => []);
  for (const layer of layers) {
    let best = -1;
    pictures.forEach((p, i) => { if (inside(layer.shown, p) && (best < 0 || p.w * p.h < pictures[best].w * pictures[best].h)) best = i; });
    if (best >= 0) found[best].push(layer);
  }
  const covers = (list, p) => {
    if (!list.length) return false;
    const x0 = Math.min(...list.map((l) => l.shown.x)), y0 = Math.min(...list.map((l) => l.shown.y));
    const x1 = Math.max(...list.map((l) => l.shown.x + l.shown.w)), y1 = Math.max(...list.map((l) => l.shown.y + l.shown.h));
    return x0 - p.x <= COVER && y0 - p.y <= COVER && p.x + p.w - x1 <= COVER && p.y + p.h - y1 <= COVER;
  };
  return found.map((list, i) => {
    if (!list.length) return list;
    // First the layers with the blend mode or in a mask. Figma also takes plain layers that lie
    // over or beside one into the same picture, so if those do not fill it, every layer in the box.
    const flat = list.filter((l) => l.flat);
    const use = covers(flat, pictures[i]) ? flat : list;
    if (use.some((l) => l.photo)) return Object.assign([], { short: true }); // a real picture is in it
    return covers(use, pictures[i]) ? use : Object.assign([], { short: true });
  });
}

/**
 * One exported layer as markup to put into the drawing: `{ body, defs }`. `n` makes the ids of its
 * gradients and clips its own.
 */
export function asMarkup(layer, svg, n, nameOf) {
  if (layer.type === "SYMBOL") {
    // `svg` is our own shape of the symbol in the layer's weight.
    const chars = [...layer.characters.trim()];
    if (!svg || chars.length !== 1) return null;
    const body = placeSymbol(svg, layer.box, layer.tint, nameOf(chars[0].codePointAt(0)), weightName(layer.weight));
    return body ? { body, defs: "" } : null;
  }
  if (layer.type === "FILL") {
    const { x, y, w, h } = layer.box, r = Math.min(layer.radius, w / 2, h / 2);
    const paint = `fill="${layer.fill.color}"` + (layer.fill.opacity < 0.995 ? ` fill-opacity="${+layer.fill.opacity.toFixed(3)}"` : "");
    return { body: `<rect x="${+x.toFixed(3)}" y="${+y.toFixed(3)}" width="${+w.toFixed(3)}" height="${+h.toFixed(3)}"${r ? ` rx="${+r.toFixed(3)}"` : ""} ${paint} style="mix-blend-mode:multiply"/>`, defs: "" };
  }
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
    const weight = weightName(layer.weight);
    inner = inner.replace(/<path id="[^"]*"/g, "<path").replace(/<path /g, `<path data-symbol="${names}" ` + (weight !== "regular" ? `data-symbol-weight="${weight}" ` : ""));
  } else if (layer.type === "TEXT") {
    inner = inner.replace(/font-family="(SF [^",]*|New York[^",]*)"/g, 'font-family="$1, -apple-system, system-ui, sans-serif"');
    if (layer.weight && layer.weight !== 400 && !/font-weight=/.test(inner)) inner = inner.replace(/<text\b([^>]*)>/g, `<text$1 font-weight="${layer.weight}">`);
  }
  if (layer.tint) {
    const paint = `fill="${layer.tint.color}"` + (layer.tint.opacity < 0.995 ? ` fill-opacity="${+layer.tint.opacity.toFixed(3)}"` : "");
    inner = inner.replace(/ fill-opacity="[^"]*"/g, "").replace(/ fill="(?!none)[^"]*"/g, " " + paint);
  }
  // The export brings the layer's own opacity and blend mode; browsers know plus-darker as multiply at best.
  inner = inner.replace(/>\s*\n\s*</g, "><").replace(/ id="(?:&#\d+;)+(?:_\d+)?"/g, "").replace(/mix-blend-mode:plus-darker/g, "mix-blend-mode:multiply").trim();
  if (layer.tint) inner = inner.replace(/ style="mix-blend-mode:[a-z-]+"/g, "");
  const attrs = [
    `transform="translate(${+layer.box.x.toFixed(3)} ${+layer.box.y.toFixed(3)})"`,
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
  // A symbol that is itself a mask is drawn from the extractor's shapes, in the layer's weight when that is there.
  const assets = join(here, "..", "assets");
  const ownShape = (l) => {
    const name = nameOf([...l.characters.trim()][0].codePointAt(0));
    const svg = readShape(assets, name, weightName(l.weight));
    if (svg) return svg;
    l.weight = 400; // the weight is not extracted yet: the regular shape, marked as such
    return readShape(assets, name);
  };
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
    const layers = todo.flatMap((t) => t.under.flat()).filter((l) => l.type !== "FILL" && l.type !== "SYMBOL");
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

    let fixed = 0, redrawn = 0, kept = 0, noLayer = 0, noExport = 0, short = 0, rewritten = 0;
    const keptIn = [];
    for (const t of todo) {
      const parts = t.under.map((list) => {
        const made = list.map((l) =>
          l.type === "SYMBOL" ? asMarkup(l, ownShape(l), ++n, nameOf)
          : l.type === "FILL" || exported.has(l.id) ? asMarkup(l, exported.get(l.id), ++n, nameOf)
          : null);
        // All of a picture's layers or none: half a label is worse than a picture of it.
        if (list.short) { short++; return null; }
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
    console.log(`${kit}: ${fixed} pictures redrawn from ${redrawn} layers in ${rewritten} drawings${dry ? " (dry run, nothing written)" : ""}; ${kept} pictures kept (${noLayer} with no layer found under them, ${short} with layers that do not fill them, ${noExport} with a layer Figma would not export as shapes).`);
    if (keptIn.length) console.log(`  drawings that still hold such a picture: ${keptIn.length}, such as ${keptIn.slice(0, 12).join(", ")}`);
  }
}

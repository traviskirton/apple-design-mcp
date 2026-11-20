// Every item each pack holds can be reached by the tools, and its file is deployed: every device,
// frame, bezel, symbol (in every weight), UI kit component and variant drawing, guidelines page and
// section, technology artwork and design-value table. Runs on the modules directly, with no server:
// `npm run test:coverage`. Unlike test/ranking.mjs it checks breadth, not which result comes first.
import { build } from "esbuild"; // wrangler's own bundler, installed with it
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const assets = join(root, "assets");
const out = mkdtempSync(join(tmpdir(), "coverage-"));
const load = async (name) => {
  await build({ entryPoints: [join(src, `${name}.ts`)], bundle: true, format: "esm", platform: "neutral", outfile: join(out, `${name}.mjs`), logLevel: "error" });
  return import(pathToFileURL(join(out, `${name}.mjs`)).href);
};
const names = ["devices", "frames", "bezels", "symbols", "uikit", "hig", "technologies", "values"];
const [devices, frames, bezels, symbols, uikit, hig, technologies, values] = await Promise.all(names.map(load));
rmSync(out, { recursive: true, force: true });

const ORIGIN = "https://example.test";
const failures = [];
const counts = {};
/** Records one check; keeps the first few failures of each kind so a broken pack does not print thousands of lines. */
function check(kind, ok, what) {
  counts[kind] = (counts[kind] ?? 0) + 1;
  if (!ok && failures.filter((f) => f.kind === kind).length < 8) failures.push({ kind, what });
  else if (!ok) failures.push({ kind, what: null });
}
const file = (...parts) => existsSync(join(assets, ...parts));

// Devices: every device a reply can name is found by its own name, in every family.
for (const d of devices.devicePack.devices) {
  if (d.family === "vision" || /\(at [^)]+\)$/.test(d.name)) continue;
  const text = devices.deviceMetrics([d.name], [], true);
  check("device found by name", !text.includes("No device matches"), d.name);
}
for (const family of devices.FAMILIES) {
  const text = devices.deviceMetrics([], [family], false);
  check("device list per family", text.length > 100 && !text.startsWith("No devices match"), family);
}

// Frames: every device with a vector frame gets one; bezels: every model is found by its name and its pictures are deployed.
for (const [id, frameIds] of Object.entries(frames.framePack.devices)) {
  const device = devices.devicePack.devices.find((d) => d.id === id);
  if (!device || !frameIds.length) continue;
  const result = frames.deviceFrames([device.name], ORIGIN);
  // Inline, or as its /frames/ID.svg address when Apple's bezels come with it (src/frames.ts); that address must draw.
  const inline = result.text?.includes("```svg");
  const addressed = frameIds.every((f) => result.text?.includes(`${ORIGIN}/frames/${encodeURIComponent(f)}.svg`) && frames.frameSvg(f));
  check("frame for device", result.ok && (inline || addressed), device.name);
}
for (const name of bezels.bezelModelNames()) {
  check("bezel model found by name", bezels.findBezelModels(name)[0]?.name === name, name);
}
for (const b of bezels.bezelPack.bezels) check("bezel picture deployed", file("bezels", `${b.id}.png`), b.id);

// Symbols: every name and alias resolves, and every shape is deployed in every weight.
const { symbolPack, findSymbol, shardOf, fromShard, WEIGHTS } = symbols;
for (const s of symbolPack.symbols) check("symbol found by name", findSymbol(s.name)?.name === s.name, s.name);
// Apple's own placeholder aliases (32 hex digits, for symbols not yet named) are left out: nobody types them.
for (const [alias, name] of Object.entries(symbolPack.aliases).filter(([a]) => !/^[0-9A-F]{32}\b/.test(a))) check("symbol alias resolves", findSymbol(alias)?.name === name, `${alias} -> ${name}`);
for (const s of symbolPack.symbols) check("symbol shape deployed", file("symbols", `${s.name}.svg`), s.name);
const shards = new Map();
for (const weight of WEIGHTS.filter((w) => w !== "regular")) {
  for (const s of symbolPack.symbols) {
    const path = join(assets, "symbol-weights", weight, `${shardOf(s.name)}.txt`);
    if (!shards.has(path)) shards.set(path, existsSync(path) ? readFileSync(path, "utf8") : null);
    const text = shards.get(path);
    check(`symbol shape deployed, ${weight}`, Boolean(text && fromShard(text, s.name)), s.name);
  }
}

// UI kit: every published component is found by its exact name in its own kit, and its outlines and drawings are deployed.
const { uiKitPack, findComponents, drawingFile } = uikit;
let drawn = 0;
for (const kit of uiKitPack.kits) {
  for (const c of kit.components) {
    if (!c.helper) {
      const hit = findComponents(c.name, kit.id).hits[0]?.c;
      check("component found by exact name", hit?.name === c.name, `${kit.id}: ${c.name}`);
    }
    check("component outline deployed", file("ui-kit", kit.id, `${c.id}.txt`), `${kit.id}: ${c.name}`);
    for (const v of c.variants) if (v.node && file("ui-kit-svg", kit.id, drawingFile(v.node))) drawn++;
  }
}
check("variant drawings deployed", drawn >= (uiKitPack.source.drawings ?? 0), `${drawn} of ${uiKitPack.source.drawings} drawings`);

// Guidelines: every page and every section can be read by id, and search_hig keeps close to max_chars.
for (const page of hig.higPack.pages) {
  check("guidelines page readable", hig.readPage(page.id).ok, page.id);
  for (const s of page.sections) check("guidelines section readable", hig.readPage(page.id, s.id).ok, `${page.id} / ${s.id}`);
}
const topics = ["tab bar", "sheet", "color", "layout", "typography", "buttons", "widgets", "app icons"];
for (const max of [2000, 10000, 40000, 100000]) {
  for (const n of [1, 4, 8]) {
    const text = hig.lookupHig(topics.slice(0, n), max);
    // Each topic keeps at least its first section's opening (up to 1,500 characters), plus headings.
    check("search_hig stays near max_chars", text.length <= max + n * 2000, `${n} topics at ${max}: ${text.length} characters`);
  }
}

// Technology artwork: every technology is found by its name with all its artwork, and every file is deployed.
for (const t of technologies.technologyPack.technologies) {
  const found = new Set(technologies.findAssets(t.name).map((e) => e.asset.id));
  check("technology found by name", t.assets.every((a) => found.has(a.id)), t.name);
  for (const a of t.assets) check("technology artwork deployed", file("technologies", `${a.id}.${a.format}`), a.id);
}

// Design values: every table for every platform.
for (const platform of values.VALUE_PLATFORMS) {
  for (const topic of values.VALUE_TOPICS) {
    if (topic === "layout" && platform !== "ios") continue;
    const result = values.designValues(platform, [topic]);
    check("design values table", result.ok && result.text.includes("|"), `${platform} ${topic}`);
  }
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
if (failures.length) {
  const kinds = [...new Set(failures.map((f) => f.kind))];
  console.error(`${failures.length} of ${total} coverage checks failed:`);
  for (const kind of kinds) {
    const list = failures.filter((f) => f.kind === kind);
    console.error(`  ${kind}: ${list.length} failed, e.g. ${list.filter((f) => f.what).map((f) => f.what).join("; ")}`);
  }
  process.exit(1);
}
console.log(`${total} coverage checks OK (${Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(", ")})`);

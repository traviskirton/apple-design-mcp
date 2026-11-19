// Builds the product bezel pack from Apple's product bezel downloads (the PNG pictures of each
// device with an empty screen, from https://developer.apple.com/design/resources/):
//
//   src/pack/bezels.js        every picture's name, size and where its screen is (compiled into the Worker)
//   assets/bezels/ID.png      the pictures themselves, served as static files (not committed)
//
//   node scripts/build-bezel-pack.mjs [FOLDER]
//
// FOLDER holds the unpacked downloads, one "Bezel-<set>" folder each with a PNG folder inside; the
// default is ../apple-resources/extracted, where scripts/fetch_apple_design_resources.py --only bezel
// --extract puts them. The downloads say nothing about where the screen is, so it is measured:
// the screen is the see-through area enclosed by the device (scripts/png-alpha.mjs).
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findHoles, pngAlpha } from "./png-alpha.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const folder = resolve(process.argv[2] ?? join(here, "..", "..", "apple-resources", "extracted"));
if (!existsSync(folder)) throw new Error(`No folder ${folder}. Pass the folder that holds the unpacked "Bezel-…" downloads.`);

const slug = (s) => s.toLowerCase().replace(/["”]/g, "in").replace(/\+/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const POSE = /^(Portrait|Landscape|Inner Open Portrait|Inner Open Landscape|Outer Closed Portrait|Outer Closed Landscape|Outer Open)$/;

/** "iPhone 18 Pro - Black - Portrait" -> the model, the finish and the pose. */
export function parseName(name) {
  const parts = name.split(" - ");
  if (parts.length > 1) {
    let model = parts.shift();
    if (/^\d+mm$/.test(parts[0])) model += " " + parts.shift();
    const pose = POSE.test(parts[parts.length - 1]) ? parts.pop() : undefined;
    return { model: model.replace(/^AW /, "Apple Watch ").replace(/^Apple Watch S(\d+)/, "Apple Watch Series $1"), finish: parts.join(", ") || undefined, pose };
  }
  // Mac and display names have no separators: "MacBook Air M5 13-inch Midnight", "Studio Display 2026 On Dark Background".
  const m = /^(.*?\b(?:\d+-inch|20\d\d))\s+(.+)$/.exec(name);
  return m ? { model: m[1], finish: m[2] } : { model: name };
}

function pngFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pngFiles(path));
    else if (/\.png$/i.test(entry.name) && !entry.name.startsWith(".")) out.push(path);
  }
  return out.sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sets = readdirSync(folder).filter((d) => /^Bezel-/.test(d) && existsSync(join(folder, d, "PNG"))).sort();
  if (!sets.length) throw new Error(`No "Bezel-…" folder with a PNG folder in ${folder}.`);
  const assetRoot = join(here, "..", "assets", "bezels");
  rmSync(assetRoot, { recursive: true, force: true });
  mkdirSync(assetRoot, { recursive: true });

  const bezels = [];
  const ids = new Set();
  let bytes = 0;
  const unmeasured = [];
  for (const set of sets) {
    const started = performance.now();
    const files = pngFiles(join(folder, set, "PNG"));
    for (const file of files) {
      const name = basename(file).replace(/\.png$/i, "");
      let id = slug(name);
      for (let n = 2; ids.has(id); n++) id = `${slug(name)}-${n}`;
      ids.add(id);
      const image = pngAlpha(readFileSync(file));
      // The screen, and a second one where the picture shows two (a folded-out device).
      const holes = findHoles(image).filter((h, i, all) => i === 0 || h.area >= all[0].area * 0.2).slice(0, 2);
      if (!holes.length) unmeasured.push(relative(folder, file));
      const size = statSync(file).size;
      bytes += size;
      copyFileSync(file, join(assetRoot, `${id}.png`));
      bezels.push({
        id,
        name,
        set: set.replace(/^Bezel-/, ""),
        ...parseName(name),
        width: image.width,
        height: image.height,
        bytes: size,
        ...(holes.length ? { screens: holes.map(({ x, y, width, height }) => ({ x, y, width, height })) } : {}),
      });
    }
    console.log(`${set}: ${files.length} pictures, ${((performance.now() - started) / 1000).toFixed(1)} s`);
  }

  const now = new Date().toISOString();
  const pack = {
    pack_version: now.slice(0, 10),
    generated_at: now,
    source: {
      name: "Apple Design Resources, product bezels",
      url: "https://developer.apple.com/design/resources/#product-bezels",
      sets: sets.length,
      bezels: bezels.length,
    },
    bezels,
  };
  const outPath = join(here, "..", "src", "pack", "bezels.js");
  const body = "{\n" + Object.entries(pack).filter(([k]) => k !== "bezels").map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(",\n") +
    ',\n"bezels":[\n' + bezels.map((b) => JSON.stringify(b)).join(",\n") + "\n]}";
  writeFileSync(outPath, `// Written by scripts/build-bezel-pack.mjs from Apple's product bezel downloads. Do not edit.\nexport default ${body};\n`);
  console.log(`Wrote ${outPath} (${bezels.length} pictures) and ${assetRoot} (${(bytes / 1048576).toFixed(1)} MB).`);
  if (unmeasured.length) console.log(`${unmeasured.length} pictures have no see-through screen, so no screen position: ${unmeasured.join("; ")}`);
}

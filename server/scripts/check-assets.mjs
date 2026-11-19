// Stops a deploy that would ship without the static files the packs describe.
//
//   node scripts/check-assets.mjs
//
// A deploy replaces every file the live server holds with the contents of assets/, so a deploy
// from a copy without them would leave the server answering "shape not loaded". This compares the
// file counts in assets/ with what the packs in src/pack/ say they hold, and fails when one is short.
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import symbols from "../src/pack/symbols.js";
import uiKit from "../src/pack/ui-kit.js";
import bezels from "../src/pack/bezels.js";
import technologies from "../src/pack/technologies.js";

const assets = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

/** Files under a folder, in all its subfolders, whose name ends with `ext`. */
function count(folder, ext) {
  const dir = join(assets, folder);
  if (!existsSync(dir)) return 0;
  return readdirSync(dir, { recursive: true }).filter((f) => String(f).endsWith(ext)).length;
}

const checks = [
  ["symbols", ".svg", symbols.source.with_shapes ?? 0],
  ["symbol-weights", ".txt", 1],
  ["ui-kit", ".txt", uiKit.kits.filter((k) => k.components.length).length],
  ["ui-kit-svg", ".svg", uiKit.source.drawings ?? 0],
  ["bezels", ".png", bezels.bezels.length],
  ["technologies", "", technologies.technologies.flatMap((t) => t.assets).length],
];

const short = [];
for (const [folder, ext, wanted] of checks) {
  const found = count(folder, ext);
  // A few files may be left out on purpose (a variant Figma rendered as nothing); far fewer is a missing folder.
  if (found < Math.ceil(wanted * 0.95)) short.push(`assets/${folder}: ${found} ${ext || "files"}, the packs expect ${wanted}`);
}

if (short.length) {
  console.error(
    "Not deploying: the static files are missing or incomplete.\n  " +
      short.join("\n  ") +
      "\nA deploy replaces every file on the live server, so this would remove them there too. " +
      "Deploy from a copy of the repository that holds server/assets/.",
  );
  process.exit(1);
}
console.log("assets/ holds the files the packs expect.");

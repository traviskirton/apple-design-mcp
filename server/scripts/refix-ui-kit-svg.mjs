// Applies browserFixes (scripts/svg-for-browsers.mjs) to the UI kit drawings already exported, in
// place, so that a new browser fix needs no new export from Figma. No dependencies.
//
//   node scripts/refix-ui-kit-svg.mjs [--dry]
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { browserFixes } from "./svg-for-browsers.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "ui-kit-svg");
const dry = process.argv.includes("--dry");
let changed = 0, total = 0;
for (const kit of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== "img")) {
  for (const name of readdirSync(join(root, kit.name)).filter((n) => n.endsWith(".svg"))) {
    const file = join(root, kit.name, name);
    const svg = readFileSync(file, "utf8");
    const fixed = browserFixes(svg);
    total++;
    if (fixed !== svg) { changed++; if (!dry) writeFileSync(file, fixed); }
  }
}
console.log(`${changed} of ${total} drawings ${dry ? "would change" : "changed"}.`);

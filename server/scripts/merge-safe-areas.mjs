// Adds the safe-area insets measured in the Simulator (scripts/safe-areas.json, written by
// extractor/measure-safe-areas.py) to the device pack's screens.
//
//   node scripts/merge-safe-areas.mjs    apply safe-areas.json to the existing src/pack/devices.js
//
// build-device-pack.mjs calls mergeSafeAreas() on the devices it reads from Xcode. Running this
// file on its own does the same to the committed pack, which needs no Xcode.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SAFE_AREAS = join(HERE, "safe-areas.json");
const OUT = join(HERE, "..", "src", "pack", "devices.js");

const insets = (o) => ({ top: o.top, bottom: o.bottom, left: o.left, right: o.right });
const sides = (a, b) => [a, b].sort((x, y) => x - y);

/**
 * A measurement applies to every device in its `applies_to`; on a device with two screens it goes
 * to the screen of the same size. Returns the number of screens that received insets.
 */
export function mergeSafeAreas(devices) {
  if (!existsSync(SAFE_AREAS)) return 0;
  const byDevice = new Map();
  for (const m of Object.values(JSON.parse(readFileSync(SAFE_AREAS, "utf8")).devices ?? {})) {
    for (const id of m.applies_to ?? []) byDevice.set(id, [...(byDevice.get(id) ?? []), m]);
  }
  let measured = 0;
  for (const d of devices) {
    for (const m of byDevice.get(d.id) ?? []) {
      const [w, h] = sides(m.portrait.width, m.portrait.height);
      let screen = d.screens.find((s) => {
        const [sw, sh] = sides(s.width_pt, s.height_pt);
        return Math.abs(sw - w) < 1 && Math.abs(sh - h) < 1;
      });
      // iPhone 12 mini and 13 mini lay apps out at 375 × 812 points, which is larger than their
      // pixels ÷ scale (360 × 780): the system scales the drawing down to fit the screen. Apps are
      // designed at the size UIKit reports, so that size replaces pixels ÷ scale; the pixels stay.
      if (!screen && d.screens.length === 1 && !d.screens[0].safe_area) {
        screen = d.screens[0];
        const landscape = screen.width_pt > screen.height_pt;
        [screen.width_pt, screen.height_pt] = landscape ? [h, w] : [w, h];
        screen.downsampled = true;
      }
      if (!screen) continue;
      // Landscape is kept only when both landscape orientations agree (mirrored left to right). On
      // iPad they do not: the simulated hardware stays in portrait when only the app rotates, so its
      // status bar and home indicator insets are not the landscape ones.
      const r = m.landscape, l = m.landscape_left;
      const agree = l && r.top === l.top && r.bottom === l.bottom && r.left === l.right && r.right === l.left;
      screen.safe_area = { portrait: insets(m.portrait), ...(agree ? { landscape: insets(r) } : {}) };
      measured++;
    }
  }
  return measured;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const pack = (await import(pathToFileURL(OUT).href)).default;
  for (const s of pack.devices.flatMap((d) => d.screens)) delete s.safe_area;
  const measured = mergeSafeAreas(pack.devices);
  writeFileSync(OUT, `export default ${JSON.stringify(pack, null, 1)};\n`);
  console.log(`${measured} screens with safe-area insets, written to src/pack/devices.js`);
}

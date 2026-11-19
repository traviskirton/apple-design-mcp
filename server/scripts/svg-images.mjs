// Moves the pictures inside exported SVGs into files of their own. No dependencies.
//
// Figma writes a photo, a wallpaper or an app icon into an SVG as base64 text, once per SVG, so a
// kit's drawings held the same pictures hundreds of times: 1.5 GB, with files past Cloudflare's
// 25 MiB limit for a static file. Here each picture becomes one file, named by the hash of its
// bytes, in assets/ui-kit-svg/img/, and the SVG points to it by its full address. Pictures under
// 3 KB stay inside the SVG.
//
// A full address, because a drawing is put into pages on other sites. What it costs: an SVG shown
// through an img element may not load other files, so there its pictures are missing; in the page
// itself they show.
//
//   node scripts/svg-images.mjs [--origin https://your-worker.workers.dev]
//
// rewrites every SVG under assets/ui-kit-svg/ in place and can be run again. The export runs the
// same step on each file it writes.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const DRAWINGS = join(here, "..", "assets", "ui-kit-svg");
/** Where the Worker is deployed; the pictures' addresses start with it. */
export const DEFAULT_ORIGIN = "https://apple-design-mcp.postfl.workers.dev";
const KEEP_BELOW = 3000; // bytes of picture that stay inside the SVG
const EXTENSIONS = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg" };

/**
 * `svg` with its larger pictures written to `dir`/img and pointed to at `origin`/ui-kit-svg/img/.
 * Returns the new SVG and what was moved: `{ svg, moved, bytes, files }`, where `files` are the
 * names of the pictures the SVG uses.
 */
export function moveImages(svg, { dir = DRAWINGS, origin = DEFAULT_ORIGIN } = {}) {
  let moved = 0, bytes = 0;
  const files = new Set();
  const out = svg.replace(/\b(xlink:href|href)="data:(image\/[a-z0-9.+-]+);base64,([^"]+)"/g, (all, name, type, data) => {
    const ext = EXTENSIONS[type];
    if (!ext) return all;
    const buf = Buffer.from(data, "base64");
    if (buf.length < KEEP_BELOW) return all;
    const file = createHash("sha256").update(buf).digest("hex").slice(0, 20) + "." + ext;
    const folder = join(dir, "img");
    const path = join(folder, file);
    if (!existsSync(path)) {
      mkdirSync(folder, { recursive: true });
      writeFileSync(path, buf);
    }
    moved++;
    bytes += buf.length;
    files.add(file);
    // Plain href: every browser of the last years reads it, and xlink:href needs a namespace where the SVG is put into a page.
    return `href="${origin}/ui-kit-svg/img/${file}"`;
  });
  return { svg: out, moved, bytes, files: [...files] };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const at = args.indexOf("--origin");
  const origin = (at >= 0 ? args[at + 1] : DEFAULT_ORIGIN).replace(/\/$/, "");
  let svgs = 0, changed = 0, moved = 0, before = 0, after = 0, largest = { file: "", size: 0 }, tooLarge = 0;
  const used = new Set();
  for (const kit of readdirSync(DRAWINGS)) {
    const folder = join(DRAWINGS, kit);
    if (kit === "img" || !statSync(folder).isDirectory()) continue;
    for (const name of readdirSync(folder)) {
      if (!name.endsWith(".svg")) continue;
      const path = join(folder, name);
      const text = readFileSync(path, "utf8");
      const r = moveImages(text, { origin });
      svgs++;
      before += Buffer.byteLength(text);
      const size = Buffer.byteLength(r.svg);
      after += size;
      moved += r.moved;
      if (r.moved) { writeFileSync(path, r.svg); changed++; }
      for (const m of r.svg.matchAll(/\/ui-kit-svg\/img\/([0-9a-f]{20}\.[a-z]+)"/g)) used.add(m[1]);
      if (size > largest.size) largest = { file: `${kit}/${name}`, size };
      if (size > 25 * 1048576) tooLarge++;
    }
  }
  const imgFolder = join(DRAWINGS, "img");
  const pictures = existsSync(imgFolder) ? readdirSync(imgFolder) : [];
  const sizes = pictures.map((f) => ({ f, size: statSync(join(imgFolder, f)).size })).sort((a, b) => b.size - a.size);
  const mb = (n) => (n / 1048576).toFixed(1) + " MB";
  console.log(`${svgs} SVGs: ${mb(before)} before, ${mb(after)} now; ${changed} rewritten, ${moved} pictures moved out.`);
  console.log(`Largest SVG now: ${largest.file}, ${mb(largest.size)}; ${tooLarge} over 25 MiB.`);
  console.log(`${pictures.length} picture files in assets/ui-kit-svg/img (${mb(sizes.reduce((n, s) => n + s.size, 0))}), ${used.size} of them used by an SVG; ${sizes.filter((s) => s.size > 25 * 1048576).length} over 25 MiB.`);
  console.log(`Largest pictures: ${sizes.slice(0, 8).map((s) => `${s.f} ${mb(s.size)}`).join(", ")}.`);
  console.log(`Pictures point to ${origin}/ui-kit-svg/img/.`);
}

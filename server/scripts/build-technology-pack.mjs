// Builds the technology artwork pack from Apple's "Technologies" downloads (Sign in with Apple,
// AirPlay, Game Center and others). Runs on a Mac after
//   python3 scripts/fetch_apple_design_resources.py --only Technologies --extract
// has filled apple-resources/extracted.
//
//   node scripts/build-technology-pack.mjs        (npm run pack:technologies)
//
// Writes
//   src/pack/technologies.js            the pack (committed), shape in src/pack/technologies.d.ts
//   assets/technologies/<id>.svg|.png   one file per artwork (not committed; deployed with the Worker)
//
// Apple's own SVG is used where it is plain vector art, with editor leftovers removed. Where Apple
// gives only a PDF, or its SVG sets text in a font the reader may not have (Game Center symbols,
// the Add Apple Watch Face button text), the PDF is converted with extractor's pdf-to-svg, which
// turns text into glyph outlines and checks the result against the PDF's own rendering. PNG
// artwork is copied byte for byte.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SERVER = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = join(SERVER, "..");
const EXTRACTED = join(REPO, "apple-resources", "extracted");
const MANIFEST = join(REPO, "apple-resources", "manifest.json");
const OUT = join(SERVER, "src", "pack", "technologies.js");
const ASSETS = join(SERVER, "assets", "technologies");
const MIN_OVERLAP = 0.95; // a converted SVG that matches its PDF less than this stops the build (translucent overlapping layers score lower)

if (!existsSync(EXTRACTED)) {
  console.error("apple-resources/extracted is missing. Run: python3 scripts/fetch_apple_design_resources.py --only Technologies --extract");
  process.exit(1);
}

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const lower = (s) => s.toLowerCase();
// Apple names these files by the color of the logo or the theme they are for, which reads the wrong
// way round for the tile behind the logo, so titles say what is drawn.
const SIWA_COLOR = { Black: "black logo on white", White: "white logo on black" };
const WATCH_THEME = { Dark: "white button (Apple's Dark variant)", Light: "black button (Apple's Light variant)" };

// What goes in: per technology, its download folder and each artwork's id, title and source.
// `from: "pdf"` converts the PDF at `source`; `pdf` names the PDF to use when Apple's SVG is not plain vector art.
const TECHNOLOGIES = [
  {
    id: "sign-in-with-apple", name: "Sign in with Apple", keywords: ["SIWA"], folder: "Logo-Sign-in-with-Apple",
    assets: [
      ...["Black", "White"].flatMap((c) => ["Large", "Medium", "Small"].map((s) => ({
        id: `logo-left-aligned-${lower(c)}-${lower(s)}`, title: `Logo, left-aligned, ${SIWA_COLOR[c]}, ${lower(s)}`,
        source: `Sign in with Apple - Left Aligned/SVG/Logo - SIWA - Left-aligned - ${c} - ${s}.svg`,
      }))),
      ...["Black", "White"].map((c) => ({
        id: `logo-only-${lower(c)}`, title: `Logo only, ${SIWA_COLOR[c]}`,
        source: `Sign in with Apple - Logo Only/SVG/Logo - SIWA - Logo-only - ${c}.svg`,
      })),
    ],
  },
  {
    id: "add-apple-watch-face", name: "Add Apple Watch Face", keywords: ["watch face"], folder: "Glyph-Add-Apple-Watch-Face",
    assets: ["Dark", "Light"].flatMap((t) => [
      { id: `button-symbol-and-text-${lower(t)}`, title: `Button, symbol and text, ${WATCH_THEME[t]}`,
        source: `Assets/SVG/Symbol and Text - ${t}@1x.svg`, pdf: `Assets/PDF/Symbol and Text - ${t}@1x.pdf` },
      { id: `button-symbol-only-large-${lower(t)}`, title: `Button, symbol only, large, ${WATCH_THEME[t]}`,
        source: `Assets/SVG/Symbol-only - Large - ${t}@1x.svg`, pdf: `Assets/PDF/Symbol-only - Large - ${t}@1x.pdf` },
      { id: `button-symbol-only-small-${lower(t)}`, title: `Button, symbol only, small, ${WATCH_THEME[t]}`,
        source: `Assets/SVG/Symbol-only - Small - ${t}@1x.svg`, pdf: `Assets/PDF/Symbol-only - Small - ${t}@1x.pdf` },
    ]),
  },
  {
    id: "airplay", name: "AirPlay", folder: "Glyph-AirPlay",
    assets: ["Audio", "Video"].map((k) => ({
      id: `glyph-${lower(k)}`, title: `Glyph, ${lower(k)}`, from: "pdf", source: `AirPlay Glyph and Badge/Glyph - AirPlay - ${k}.pdf`,
    })),
  },
  {
    id: "arkit", name: "ARKit", keywords: ["AR", "augmented reality"], folder: "Glyph-ARKit",
    assets: [
      { id: "badge", title: "Badge", from: "pdf", source: "ARKit Glyph and Badge/Badge - ARKit.pdf" },
      { id: "badge-glyph-only", title: "Badge, glyph only", from: "pdf", source: "ARKit Glyph and Badge/Badge - ARKit (Glyph-only).pdf" },
      { id: "control-label-icon", title: "Control label icon", from: "pdf", source: "ARKit Glyph and Badge/Icon - Control Label - ARKit.pdf" },
    ],
  },
  {
    id: "game-center", name: "Game Center", keywords: ["Games", "Games app"], folder: "Icon-Game-Center",
    assets: [
      ...["Game Center", "Games"].flatMap((n) => ["Black", "White"].map((c) => ({
        id: `${n === "Games" ? "games" : "game-center"}-icon-${lower(c)}`, title: `${n} icon, ${lower(c)}`,
        source: `Icons/${n} - ${c}.svg`, pdf: `Icons/${n} - ${c}.pdf`,
      }))),
      ...["Game Center", "Games"].map((n) => ({
        id: `${n === "Games" ? "games" : "game-center"}-icon-color`, title: `${n} icon, color`, source: `Icons/${n} - Color.png`,
      })),
      ...["Achievements", "Activities", "Challenges", "Events", "Leaderboards", "Profile"].flatMap((s) => ["Black", "White"].map((c) => ({
        id: `symbol-${lower(s)}-${lower(c)}`, title: `Symbol, ${lower(s)}, ${lower(c)}`,
        source: `Symbols/Symbol - ${s} - ${c}.svg`, pdf: `Symbols/Symbol - ${s} - ${c}.pdf`,
      }))),
    ],
  },
  {
    id: "homekit", name: "HomeKit", keywords: ["Home", "Home app"], folder: "Icon-HomeKit",
    assets: [
      { id: "glyph", title: "HomeKit glyph", from: "pdf", source: "Home App Icon and HomeKit Glyph/Glyph - HomeKit.pdf" },
      { id: "home-app-icon", title: "Home app icon", source: "Home App Icon and HomeKit Glyph/Icon - Home App.png" },
    ],
  },
  {
    id: "apple-health", name: "Apple Health", keywords: ["HealthKit", "Health app"], folder: "Icon-Apple-Health",
    assets: [{ id: "icon", title: "Apple Health icon", source: "Apple Health Icon/Icon - Apple Health.png" }],
  },
  {
    id: "siri", name: "Siri", keywords: ["Siri AI"], folder: "Icons-Siri-AI",
    assets: [
      { id: "siri-ai-icon-default", title: "Siri AI icon, default", source: "Siri AI/Siri AI Default.png" },
      { id: "siri-ai-icon-dark", title: "Siri AI icon, dark", source: "Siri AI/Siri AI Dark.png" },
    ],
  },
];

// The download's title on Apple's page, from the fetch script's manifest.
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { files: [] };
const download = (folder) => {
  const f = manifest.files.find((x) => x.filename === `${folder}.dmg`);
  return { title: f?.title ?? folder, file: `${folder}.dmg` };
};

/** Plain vector SVG: no text set in a font, no embedded pictures, no references to other files. */
const plain = (svg) => !/<text\b|font-family|<image\b|<foreignObject\b|xlink:href="(?!#)|href="(?!#)/.test(svg);

/** Apple's SVG without editor leftovers; shapes, colors and structure unchanged. */
function cleanSvg(svg) {
  let s = svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(title|desc|metadata)\b[^>]*>[\s\S]*?<\/\1>/g, "")
    .replace(/<(title|desc|metadata)\b[^>]*\/>/g, "");
  // Ids are editor names unless something points at them.
  const used = new Set([...s.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2]));
  s = s.replace(/\s(?:id|sketch:type|data-name|serif:id)="([^"]*)"/g, (m, id) => (used.has(id) ? m : ""));
  const root = s.match(/<svg\b[^>]*>/)[0];
  const viewBox = root.match(/viewBox="([^"]+)"/)[1].trim().split(/[\s,]+/).map(Number);
  const keep = [`xmlns="http://www.w3.org/2000/svg"`];
  if (/xlink:/.test(s.replace(root, ""))) keep.push(`xmlns:xlink="http://www.w3.org/1999/xlink"`);
  keep.push(`viewBox="0 0 ${viewBox[2]} ${viewBox[3]}"`);
  // Presentation attributes on the root (fill, stroke and so on) apply to everything; keep them.
  for (const m of root.matchAll(/\s([a-z-]+)="([^"]*)"/g)) {
    if (!["xmlns", "xmlns:xlink", "viewBox", "width", "height", "version", "x", "y", "style", "enable-background", "xml:space"].includes(m[1])) {
      keep.push(`${m[1]}="${m[2]}"`);
    }
  }
  if (viewBox[0] !== 0 || viewBox[1] !== 0) throw new Error("viewBox does not start at 0 0");
  s = s.replace(root, `<svg ${keep.join(" ")}>`);
  s = s.replace(/>\s+</g, "><").replace(/\s+\/>/g, "/>").replace(/\s{2,}/g, " ").trim();
  return { svg: s, width: viewBox[2], height: viewBox[3] };
}

const pngSize = (file) => {
  const b = readFileSync(file);
  if (b.toString("latin1", 1, 4) !== "PNG") throw new Error(`${file} is not a PNG`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

// Convert every PDF in one run of the Swift tool.
const plan = TECHNOLOGIES.flatMap((t) => t.assets.map((a) => ({ t, a, path: (rel) => join(EXTRACTED, t.folder, rel) })));
for (const p of plan) {
  if (p.a.from === "pdf") p.pdf = p.path(p.a.source);
  else if (p.a.source.endsWith(".svg")) {
    const raw = readFileSync(p.path(p.a.source), "utf8");
    if (!plain(raw)) {
      if (!p.a.pdf) throw new Error(`${p.a.source} sets text in a font or embeds a picture, and no PDF is named for it`);
      p.pdf = p.path(p.a.pdf);
    } else p.raw = raw;
  }
}
const pdfs = plan.filter((p) => p.pdf).map((p) => p.pdf);
console.log(`Converting ${pdfs.length} PDFs with extractor/pdf-to-svg...`);
execFileSync("swift", ["build", "-c", "release", "--package-path", join(REPO, "extractor"), "--product", "pdf-to-svg"], { stdio: ["ignore", "ignore", "inherit"] });
const converted = new Map(
  execFileSync(join(REPO, "extractor", ".build", "release", "pdf-to-svg"), pdfs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] })
    .trim().split("\n").map((line) => JSON.parse(line)).map((r) => [r.file, r]),
);

rmSync(ASSETS, { recursive: true, force: true });
const technologies = [];
const checks = [];
let total = 0;
for (const t of TECHNOLOGIES) {
  const dir = join(ASSETS, t.id);
  mkdirSync(dir, { recursive: true });
  const assets = [];
  for (const a of t.assets) {
    const src = join(EXTRACTED, t.folder, a.source);
    let entry;
    if (a.source.endsWith(".png")) {
      const out = join(dir, `${a.id}.png`);
      copyFileSync(src, out);
      entry = { id: `${t.id}/${a.id}`, title: a.title, format: "png", ...pngSize(src), bytes: statSync(out).size, source: a.source };
    } else {
      const p = plan.find((x) => x.a === a);
      let svg, width, height, converted_from;
      if (p.pdf) {
        const r = converted.get(p.pdf);
        if (!r || r.error) throw new Error(`could not convert ${p.pdf}: ${r?.error ?? "no result"}`);
        if (r.unsupported.length) throw new Error(`${p.pdf}: ${r.unsupported.join(", ")}`);
        if (r.overlap < MIN_OVERLAP || r.ink_pixels === 0) throw new Error(`${p.pdf} converted badly: overlap ${r.overlap}, ${r.ink_pixels} pixels`);
        ({ svg, width, height } = r);
        converted_from = "pdf";
        checks.push({ id: `${t.id}/${a.id}`, overlap: r.overlap, color: r.color_error, ink: r.ink_pixels });
      } else {
        ({ svg, width, height } = cleanSvg(p.raw));
      }
      writeFileSync(join(dir, `${a.id}.svg`), svg);
      entry = {
        id: `${t.id}/${a.id}`, title: a.title, format: "svg", width, height, bytes: Buffer.byteLength(svg), svg,
        ...(converted_from ? { converted_from } : {}),
        source: converted_from && !a.source.endsWith(".pdf") ? a.pdf : a.source,
      };
    }
    total += entry.bytes;
    assets.push(entry);
  }
  technologies.push({ id: t.id, name: t.name, ...(t.keywords ? { keywords: t.keywords } : {}), download: download(t.folder), assets });
}

const now = new Date().toISOString();
const pack = {
  pack_version: now.slice(0, 10),
  generated_at: now,
  source: {
    name: "Apple Design Resources, Technologies",
    url: "https://developer.apple.com/design/resources/",
    technologies: technologies.length,
    assets: technologies.reduce((n, t) => n + t.assets.length, 0),
  },
  technologies,
};
writeFileSync(OUT, `export default ${JSON.stringify(pack, null, 1)};\n`);

console.log(`Technology pack: ${pack.source.technologies} technologies, ${pack.source.assets} assets, ` +
  `written to src/pack/technologies.js (${Math.round(statSync(OUT).size / 1024)} KB); files in assets/technologies (${Math.round(total / 1024)} KB)`);
checks.sort((x, y) => x.overlap - y.overlap);
console.log(`Converted from PDF: ${checks.length}; worst match with the PDF ${checks[0]?.overlap.toFixed(4)} (${checks[0]?.id}); ` +
  `largest color difference ${Math.max(...checks.map((c) => c.color)).toFixed(2)}/255; blank: ${checks.filter((c) => c.ink === 0).length}`);

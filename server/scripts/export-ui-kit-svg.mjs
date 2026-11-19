// Exports every component variant of Apple's UI kits as SVG, drawn by Figma itself, through
// Figma's REST API. Writes assets/ui-kit-svg/<kit>/<node id>.svg (not committed), one file per
// variant listed in src/pack/ui-kit.js. No dependencies.
//
//   node scripts/export-ui-kit-svg.mjs [--kit ios] [--limit 20] [--force] [--origin https://your-worker.workers.dev]
//
// Needs a Figma personal access token with "File content: Read-only", in
// the file ~/.config/apple-mcp/figma-token or in the environment variable FIGMA_TOKEN. The file is
// tried first; the script says which one Figma accepted. The token is never printed.
// scripts/figma/kit-files.json maps each kit to the key of a copy of the kit in the token
// owner's Figma account (the part of the file's address after /design/).
//
// What an exported SVG holds: the variant at its own size (a shadow reaches past the SVG's box),
// its layers as groups with the layers' names as ids, text
// as <text> (so a label can be changed), and SF Symbols as shapes. Figma writes a symbol as a
// private-use character, which shows only where Apple's fonts are installed, so each one is
// replaced by its outline from a second export with outlined text, and tagged data-symbol="name".
// Liquid Glass is written by Figma with blends that browsers do not draw; scripts/svg-for-browsers.mjs
// rewrites those so that a browser shows the component as Figma does. Pictures inside an SVG go
// into assets/ui-kit-svg/img/ (scripts/svg-images.mjs), addressed at --origin, the deployed Worker.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { forBrowsers, leftovers } from "./svg-for-browsers.mjs";
import { DEFAULT_ORIGIN, moveImages } from "./svg-images.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const API = "https://api.figma.com/v1";
const BATCH = 40; // node ids per render request
const PARALLEL = 8; // downloads at a time

// ---------- merging the two exports ----------

const decode = (s) => s.replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)));
const isPrivateUse = (s) => s.length > 0 && [...s].every((ch) => { const c = ch.codePointAt(0); return (c >= 0xe000 && c <= 0xf8ff) || c >= 0xf0000; });
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when the SVG holds a text of private-use characters, written as entities or as the characters. */
export const hasSymbols = (svg) => /<text\b[^>]*>(?:\s*<tspan[^>]*>)?\s*(?:&#x(?:e[0-9a-f]{3}|f[0-8][0-9a-f]{2}|f[0-9a-f]{4}|10[0-9a-f]{4});|[-]|[\udb80-\udbff][\udc00-\udfff])/i.test(svg);

/**
 * `text` is the export with text kept as text, `outlined` the same node with text outlined; both
 * with id attributes. Returns `text` with every symbol text replaced by its outline. `nameOf`
 * turns a code point into a symbol name.
 */
export function mergeSymbols(text, outlined, nameOf) {
  let out = "", last = 0, symbols = 0, missed = 0;
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = re.exec(text))) {
    const chars = decode(m[2].replace(/<[^>]+>/g, "")).trim();
    if (!isPrivateUse(chars)) continue;
    // The text carries the layer's id itself, or the group around it does (a layer with a blend mode).
    const own = /\bid="([^"]*)"/.exec(m[1]);
    const wrap = own ? null : /<g id="([^"]*)"[^>]*>\s*$/.exec(text.slice(Math.max(0, m.index - 600), m.index));
    const id = own ? own[1] : wrap ? wrap[1] : null;
    let paths = null;
    if (id) {
      const a = new RegExp('<path id="' + escapeRe(id) + '"[^>]*/>').exec(outlined);
      if (a) paths = a[0];
      else {
        const b = new RegExp('<g id="' + escapeRe(id) + '"[^>]*>\\s*((?:<path[^>]*/>\\s*)+)</g>').exec(outlined);
        if (b) paths = b[1].trim();
      }
    }
    if (!paths) { missed++; continue; }
    symbols++;
    const names = [...chars].map((ch) => nameOf(ch.codePointAt(0))).join(" ");
    out += text.slice(last, m.index) + paths.replace(/<path /g, `<path data-symbol="${names}" `);
    last = m.index + m[0].length;
  }
  return { svg: out + text.slice(last), symbols, missed };
}

/**
 * Apple's fonts with fallbacks, so text shows in the system font where SF Pro is not installed;
 * no line breaks or indentation between tags (Figma writes a text's characters and its tags
 * on one line, so none of that white space is part of a label).
 */
export const tidy = (svg) =>
  svg
    .replace(/font-family="(SF [^",]*|New York[^",]*)"/g, 'font-family="$1, -apple-system, system-ui, sans-serif"')
    .replace(/>\s*\n\s*</g, "><")
    // A symbol layer is named by its character, which Figma writes as an unreadable id.
    .replace(/ id="(?:&#\d+;)+(?:_\d+)?"/g, "")
    // The box is the component's own; what reaches past it (a shadow) shows where the SVG is put into a page.
    .replace(/^<svg /, '<svg overflow="visible" ')
    .trim();

// ---------- Figma ----------

/**
 * The tokens to try, in order: the saved file first, then the environment variable. A shell
 * profile can hold a FIGMA_TOKEN from long ago, and an expired one there must not hide the file.
 */
function readTokens() {
  const found = [];
  const path = join(homedir(), ".config", "apple-mcp", "figma-token");
  if (existsSync(path)) {
    const token = readFileSync(path, "utf8").trim();
    if (!token) throw new Error(`${path} is empty.`);
    if (/\s/.test(token) || token.length < 20) throw new Error(`${path} does not look like a Figma token (it is ${token.length} characters${/\s/.test(token) ? " with spaces" : ""}). Copy the token again and save it.`);
    found.push({ token, from: `the file ${path}` });
  }
  const env = process.env.FIGMA_TOKEN?.trim();
  if (env && !found.some((f) => f.token === env)) found.push({ token: env, from: "the environment variable FIGMA_TOKEN" });
  if (!found.length) throw new Error(`No Figma token: save one in ${path} or set FIGMA_TOKEN.`);
  return found;
}

/** The first token that can read the file `key`. Says where it came from, never the token. */
async function workingToken(key) {
  const refused = [];
  for (const { token, from } of readTokens()) {
    try {
      await figma(token, `/files/${key}?depth=1`);
      console.log(`Using the Figma token from ${from}.`);
      return token;
    } catch (e) {
      if (e.status !== 401 && e.status !== 403) throw e;
      refused.push(`Figma refused the token from ${from}: ${e.message}`);
    }
  }
  throw new Error(refused.join("\n"));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function figma(token, path) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(API + path, { headers: { "X-Figma-Token": token } });
    if (res.status === 429 && attempt < 6) {
      const wait = Math.min(Number(res.headers.get("retry-after")) || 20 * (attempt + 1), 300);
      console.log(`  Figma asks to slow down; waiting ${wait} s`);
      await sleep(wait * 1000);
      continue;
    }
    const body = await res.text();
    let json = null;
    try { json = JSON.parse(body); } catch {}
    if (!res.ok) {
      const err = new Error(`Figma answered ${res.status} for ${path.split("?")[0]}: ${(json?.err ?? json?.message ?? body).toString().slice(0, 200)}`);
      err.status = res.status;
      throw err;
    }
    return json;
  }
}

async function download(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
      if (attempt >= 3) throw new Error(`download answered ${res.status}`);
    } catch (e) {
      if (attempt >= 3) throw e;
    }
    await sleep(1500 * (attempt + 1));
  }
}

/** Addresses of the rendered SVGs of `ids`. A batch that fails to render is split in two and tried again. */
async function render(token, key, ids, outlineText) {
  // use_absolute_bounds: the SVG's box is the component's own box, and a shadow keeps its shapes outside it.
  const query = `ids=${encodeURIComponent(ids.join(","))}&format=svg&svg_include_id=true&svg_outline_text=${outlineText}&use_absolute_bounds=true`;
  try {
    const json = await figma(token, `/images/${key}?${query}`);
    return json.images ?? {};
  } catch (e) {
    if (ids.length === 1 || e.status === 403 || e.status === 404) throw e;
    const half = Math.ceil(ids.length / 2);
    return { ...(await render(token, key, ids.slice(0, half), outlineText)), ...(await render(token, key, ids.slice(half), outlineText)) };
  }
}

async function inParallel(items, n, work) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) await work(items[next++]);
  }));
}

// ---------- command line ----------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const onlyKit = option("--kit");
  const limit = Number(option("--limit")) || Infinity;
  const force = args.includes("--force");
  const origin = (option("--origin") ?? DEFAULT_ORIGIN).replace(/\/$/, "");

  const files = JSON.parse(readFileSync(join(here, "figma", "kit-files.json"), "utf8"));
  const firstKey = onlyKit ? files[onlyKit] : Object.values(files)[0];
  if (!firstKey) throw new Error(`No file key for ${onlyKit ?? "any kit"} in scripts/figma/kit-files.json.`);
  const token = await workingToken(firstKey);
  const { default: pack } = await import(new URL("../src/pack/ui-kit.js", import.meta.url));
  const symbolNames = new Map();
  for (const line of readFileSync(join(here, "figma", "symbol-codepoints.txt"), "utf8").split("\n")) {
    const m = /^([0-9A-Fa-f]{4,6})\s+(\S+)/.exec(line);
    if (m) symbolNames.set(parseInt(m[1], 16), m[2]);
  }
  const nameOf = (code) => symbolNames.get(code) ?? "U+" + code.toString(16).toUpperCase();

  for (const kit of pack.kits) {
    if (onlyKit && kit.id !== onlyKit) continue;
    const key = files[kit.id];
    if (!key) { console.log(`${kit.name}: no file key in scripts/figma/kit-files.json; skipped.`); continue; }
    const started = performance.now();
    const file = await figma(token, `/files/${key}?depth=1`);
    console.log(`${kit.name}: the token can read "${file.name}".`);

    const outDir = join(here, "..", "assets", "ui-kit-svg", kit.id);
    mkdirSync(outDir, { recursive: true });
    const pathOf = (id) => join(outDir, id.replace(":", "-") + ".svg");
    const all = [...new Set(kit.components.flatMap((c) => c.variants.map((v) => v.node)).filter(Boolean))];
    const missing = all.filter((id) => force || !existsSync(pathOf(id)));
    const todo = missing.slice(0, limit);
    console.log(`  ${all.length} variants, ${all.length - missing.length} already exported, ${todo.length} to export${todo.length < missing.length ? ` now (${missing.length - todo.length} more after this)` : ""}`);

    let written = 0, bytes = 0, symbols = 0, missed = 0, large = 0, pictures = 0, largest = { id: "", size: 0 };
    const unfixed = new Map();
    const failed = [];
    for (let at = 0; at < todo.length; at += BATCH) {
      const ids = todo.slice(at, at + BATCH);
      let urls;
      try { urls = await render(token, key, ids, false); } catch (e) {
        if (e.status === 403 || e.status === 404) throw e;
        ids.forEach((id) => failed.push(`${id}: ${e.message}`));
        continue;
      }
      const texts = new Map();
      await inParallel(ids, PARALLEL, async (id) => {
        if (!urls[id]) { failed.push(`${id}: Figma rendered nothing`); return; }
        try { texts.set(id, await download(urls[id])); } catch (e) { failed.push(`${id}: ${e.message}`); }
      });
      // A second, outlined export for the variants that hold SF Symbols.
      const withSymbols = [...texts.keys()].filter((id) => hasSymbols(texts.get(id)));
      const outlines = new Map();
      if (withSymbols.length) {
        try {
          const outlinedUrls = await render(token, key, withSymbols, true);
          await inParallel(withSymbols, PARALLEL, async (id) => {
            if (outlinedUrls[id]) { try { outlines.set(id, await download(outlinedUrls[id])); } catch {} }
          });
        } catch (e) {
          if (e.status === 403 || e.status === 404) throw e;
        }
      }
      for (const [id, text] of texts) {
        let svg = text;
        if (withSymbols.includes(id)) {
          if (outlines.has(id)) {
            const merged = mergeSymbols(text, outlines.get(id), nameOf);
            svg = merged.svg; symbols += merged.symbols; missed += merged.missed;
          } else missed++;
        }
        // Photos, wallpapers and app icons go into files of their own, shared between the SVGs.
        const split = moveImages(tidy(forBrowsers(svg)), { origin });
        svg = split.svg;
        pictures += split.moved;
        writeFileSync(pathOf(id), svg);
        written++;
        const size = Buffer.byteLength(svg);
        bytes += size;
        if (size > largest.size) largest = { id, size };
        if (size > 100000) large++;
        for (const kind of leftovers(svg)) unfixed.set(kind, [...(unfixed.get(kind) ?? []), id]);
      }
      console.log(`  ${Math.min(at + BATCH, todo.length)} of ${todo.length}`);
    }
    console.log(
      `${kit.name}: wrote ${written} SVGs (${(bytes / 1048576).toFixed(1)} MB), ${symbols} symbols outlined, ${missed} symbol texts left as characters, ` +
        `${failed.length} failed, ${((performance.now() - started) / 1000).toFixed(0)} s`,
    );
    if (written) console.log(`  largest: ${largest.id}, ${(largest.size / 1024).toFixed(0)} KB; ${large} over 100 KB; ${pictures} pictures moved to assets/ui-kit-svg/img`);
    for (const [kind, ids] of unfixed) console.log(`  a browser may draw these unlike Figma (${kind}): ${ids.length} variants, such as ${ids.slice(0, 8).join(", ")}`);
    if (failed.length) console.log("  failed: " + failed.slice(0, 20).join("; ") + (failed.length > 20 ? `; and ${failed.length - 20} more` : ""));
  }
}

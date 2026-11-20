// Checks that our drawings look like Apple's, so nobody has to look through thousands of files by
// eye: each drawing is compared with Apple's own rendering of the same thing, and only the ones that
// differ by more than a small amount are listed in a report. Runs on a Mac. No npm packages.
//
//   node scripts/check-drawings.mjs                    (npm run check:drawings) everything
//   node scripts/check-drawings.mjs --only ui-kit      or symbols, frames; several with commas
//   node scripts/check-drawings.mjs --kit ios --limit 50   part of the UI kits, for a quick try
//   node scripts/check-drawings.mjs --refresh          fetch Figma's renders again (after a kit update)
//   node scripts/check-drawings.mjs --report-only      rebuild the report from the last results
//
// What is compared with what:
//   ui-kit   assets/ui-kit-svg/KIT/NODE.svg drawn by Google Chrome, against Figma's own PNG of the same
//            component in Apple's kit (Figma's REST API, the token as for export-ui-kit-svg.mjs). Both at
//            2x. Shape is compared everywhere and color where both are opaque (Figma draws Liquid Glass
//            on nothing as dark gray, so translucent areas count by shape only; see compareImages). The
//            score is the share of wrong pixels among those either image draws. Flagged above
//            --ui-kit-max (0.03).
//            Figma's PNGs are kept in visual-check/reference/ and fetched only once (--refresh to redo).
//   symbols  every SF Symbol in all nine weights against macOS's own drawing of it
//            (extractor: extract-symbols --verify-only all). Flagged below --symbol-min overlap (0.97).
//   frames   every device frame against the art Xcode's Simulator draws (extract-frames --verify-only).
//            Flagged below --frame-min overlap (0.98), or with ink inside the screen.
//
// Writes visual-check/ at the top of the repository (not committed): report.html (open it in a
// browser; flagged drawings with Apple's version and ours side by side), report.md (the same as a
// short list), results/*.json and the comparison images.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Chrome } from "./chrome.mjs";
import { decodePNG, encodePNG, toSRGB } from "./png-rgba.mjs";
import { leftovers } from "./svg-for-browsers.mjs";
import { DEFAULT_ORIGIN } from "./svg-images.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const SERVER = join(here, "..");
const REPO = join(SERVER, "..");
const DRAWINGS = join(SERVER, "assets", "ui-kit-svg");

// ---------- comparing two images ----------

/**
 * Compares two RGBA images of the same thing. Returns the share of wrong pixels among the pixels
 * either image draws (0 is identical), and a mask of the wrong pixels. Images of different sizes are
 * compared over the part they share; the size difference is reported separately.
 *
 * Shape everywhere, color only where both are opaque. A pixel is wrong when one image covers it
 * (alpha over `cover`) and the other draws nothing (alpha up to `faint`) at it or within `radius`; or when both are
 * opaque there and no opaque pixel within `radius` in the other image is within `tolerance` in every
 * channel. Translucent areas count by shape only: Figma draws Liquid Glass against whatever is behind
 * it, which in a lone component is nothing, so its glass comes out a dark gray that no app shows,
 * while our drawings carry the glass as it looks over a light backdrop.
 * Our glass is often a white fill at 9-18% opacity, hence `faint`; `radius` 2 (1 point at 2x) allows
 * for Chrome and Figma placing text a pixel apart. Anything drawn over that glass comes out darker too (a multiply-blended page dot: 111 in Figma,
 * 179 in ours), hence the wide color tolerance; it still catches black bands, missing pictures and
 * wrong colors such as blue for gray.
 */
export function compareImages(ref, ours, { tolerance = 80, radius = 2, cover = 64, faint = 8, opaque = 240 } = {}) {
  const w = Math.min(ref.width, ours.width), h = Math.min(ref.height, ours.height);
  const alpha = (img) => { const a = new Uint8Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) a[y * w + x] = img.data[(y * img.width + x) * 4 + 3]; return a; };
  const rgb = (img) => { const c = new Uint8Array(w * h * 3); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let k = 0; k < 3; k++) c[(y * w + x) * 3 + k] = img.data[(y * img.width + x) * 4 + k]; return c; };
  const aA = alpha(ref), aB = alpha(ours), cA = rgb(ref), cB = rgb(ours);
  const near = (x, y, test) => {
    for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
      const X = x + dx, Y = y + dy;
      if (X >= 0 && Y >= 0 && X < w && Y < h && test(Y * w + X)) return true;
    }
    return false;
  };
  const sameColor = (P, p, Q, q) => Math.abs(P[p * 3] - Q[q * 3]) <= tolerance && Math.abs(P[p * 3 + 1] - Q[q * 3 + 1]) <= tolerance && Math.abs(P[p * 3 + 2] - Q[q * 3 + 2]) <= tolerance;
  const wrong = new Uint8Array(w * h);
  let ink = 0, bad = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x;
    const inA = aA[p] > cover, inB = aB[p] > cover;
    if (aA[p] > 8 || aB[p] > 8) ink++;
    let off = false;
    if (inA && !near(x, y, (q) => aB[q] > faint)) off = true;
    else if (inB && !near(x, y, (q) => aA[q] > faint)) off = true;
    else if (aA[p] >= opaque && aB[p] >= opaque) {
      off = !near(x, y, (q) => aB[q] >= opaque && sameColor(cA, p, cB, q)) || !near(x, y, (q) => aA[q] >= opaque && sameColor(cB, p, cA, q));
    }
    if (off) { wrong[p] = 1; bad++; }
  }
  return { score: ink ? bad / ink : bad ? 1 : 0, wrong, width: w, height: h, ink, bad };
}

/** One image of three panels at half size, on white: Apple's, ours, and ours faded with wrong pixels in red. */
export function sideBySide(ref, ours, cmp, { shrink = 2, gap = 12 } = {}) {
  const w = Math.ceil(cmp.width / shrink), h = Math.ceil(cmp.height / shrink);
  const W = w * 3 + gap * 2;
  const data = new Uint8Array(W * h * 4).fill(255);
  const put = (panel, x, y, rgb) => { const o = (y * W + panel * (w + gap) + x) * 4; data[o] = rgb[0]; data[o + 1] = rgb[1]; data[o + 2] = rgb[2]; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sums = [[0, 0, 0], [0, 0, 0]];
    let n = 0, wrong = 0;
    for (let dy = 0; dy < shrink; dy++) for (let dx = 0; dx < shrink; dx++) {
      const X = x * shrink + dx, Y = y * shrink + dy;
      if (X >= cmp.width || Y >= cmp.height) continue;
      n++;
      wrong += cmp.wrong[Y * cmp.width + X];
      [ref, ours].forEach((img, k) => {
        const i = (Y * img.width + X) * 4, a = img.data[i + 3] / 255;
        for (let c = 0; c < 3; c++) sums[k][c] += img.data[i + c] * a + 255 * (1 - a);
      });
    }
    if (!n) continue;
    const [r, o] = sums.map((s) => s.map((v) => Math.round(v / n)));
    put(0, x, y, r);
    put(1, x, y, o);
    put(2, x, y, wrong ? [230, 0, 0] : o.map((v) => Math.round(255 - (255 - v) * 0.25)));
  }
  for (let y = 0; y < h; y++) for (const gx of [w, 2 * w + gap]) for (let x = gx; x < gx + gap; x++) { const o = (y * W + x) * 4; data[o] = data[o + 1] = data[o + 2] = 235; }
  return encodePNG({ width: W, height: h, data });
}

// ---------- UI kits ----------

async function figmaReferences(variants, refDir, refresh) {
  const { figma, inParallel, workingToken } = await import("./export-ui-kit-svg.mjs");
  const files = JSON.parse(readFileSync(join(here, "figma", "kit-files.json"), "utf8"));
  const need = variants.filter((v) => refresh || !existsSync(v.ref));
  if (!need.length) return;
  console.log(`Fetching ${need.length} renders from Figma (kept in ${relative(REPO, refDir)}; fetched again only with --refresh)`);
  let token = null, done = 0;
  const failed = [];
  for (const kit of [...new Set(need.map((v) => v.kit))]) {
    if (!files[kit]) { console.log(`  ${kit}: no file key in scripts/figma/kit-files.json; skipped`); continue; }
    token ??= await workingToken(files[kit]);
    const ids = need.filter((v) => v.kit === kit);
    for (let at = 0; at < ids.length; at += 40) {
      const batch = ids.slice(at, at + 40);
      let urls = {};
      const query = `ids=${encodeURIComponent(batch.map((v) => v.node).join(","))}&format=png&scale=2&use_absolute_bounds=true`;
      try { urls = (await figma(token, `/images/${files[kit]}?${query}`)).images ?? {}; } catch (e) {
        if (e.status === 403 || e.status === 404) throw e;
        batch.forEach((v) => failed.push(`${v.node}: ${e.message}`));
        continue;
      }
      await inParallel(batch, 8, async (v) => {
        if (!urls[v.node]) { failed.push(`${v.node}: Figma rendered nothing`); return; }
        for (let attempt = 0; ; attempt++) {
          try {
            const res = await fetch(urls[v.node]);
            if (!res.ok) throw new Error(`download answered ${res.status}`);
            mkdirSync(dirname(v.ref), { recursive: true });
            writeFileSync(v.ref, Buffer.from(await res.arrayBuffer()));
            break;
          } catch (e) {
            if (attempt >= 3) { failed.push(`${v.node}: ${e.message}`); break; }
            await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          }
        }
      });
      done += batch.length;
      console.log(`  ${done} of ${need.length}`);
    }
  }
  if (failed.length) console.log(`  ${failed.length} not fetched: ${failed.slice(0, 5).join("; ")}`);
}

async function checkUiKit({ out, kitFilter, limit, refresh, maxScore }) {
  const { default: pack } = await import(pathToFileURL(join(SERVER, "src", "pack", "ui-kit.js")).href);
  const refDir = join(out, "reference", "ui-kit");
  const variants = [];
  for (const kit of pack.kits) {
    if (kitFilter && kit.id !== kitFilter) continue;
    for (const c of kit.components) for (const v of c.variants) {
      if (!v.node) continue;
      const file = join(DRAWINGS, kit.id, v.node.replace(":", "-") + ".svg");
      if (!existsSync(file)) continue;
      variants.push({ kit: kit.id, node: v.node, component: c.name, variant: v.name, file, ref: join(refDir, kit.id, v.node.replace(":", "-") + ".png") });
    }
  }
  const unique = [...new Map(variants.map((v) => [`${v.kit}/${v.node}`, v])).values()].slice(0, limit);
  console.log(`UI kits: ${unique.length} drawings to check`);
  await figmaReferences(unique, refDir, refresh);

  const tmp = join(out, "tmp");
  const diffDir = join(out, "ui-kit");
  rmSync(diffDir, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  mkdirSync(diffDir, { recursive: true });
  // Pictures are addressed at the live server; draw them from the files on this Mac instead.
  const imgURL = pathToFileURL(join(DRAWINGS, "img")).href + "/";
  const chrome = await Chrome.launch();
  const results = [];
  const started = Date.now();
  try {
    for (const [i, v] of unique.entries()) {
      const entry = { kit: v.kit, node: v.node, component: v.component, variant: v.variant };
      try {
        if (!existsSync(v.ref)) { entry.error = "no Figma render"; results.push(entry); continue; }
        let svg = readFileSync(v.file, "utf8");
        const notes = leftovers(svg);
        if (notes.length) entry.notes = notes;
        svg = svg.split(`${DEFAULT_ORIGIN}/ui-kit-svg/img/`).join(imgURL);
        const m = /<svg\b[^>]*?\bwidth="([\d.]+)"[^>]*?\bheight="([\d.]+)"/.exec(svg);
        if (!m) { entry.error = "the SVG has no width and height"; results.push(entry); continue; }
        const [width, height] = [Number(m[1]), Number(m[2])];
        // A knob's box can be 1 or 2 points wide with the knob drawn outside it; there is nothing to compare.
        if (width < 4 || height < 4) { entry.error = `its box is only ${width}x${height}`; results.push(entry); continue; }
        const page = join(tmp, "drawing.svg");
        writeFileSync(page, svg);
        const ours = decodePNG(await chrome.screenshot(pathToFileURL(page).href + `?n=${i}`, { width, height, scale: 2 }));
        const raw = decodePNG(readFileSync(v.ref));
        // Figma tags its render Display P3 where the kit is set to P3; Chrome's screenshot is sRGB.
        const ref = toSRGB(raw);
        if (raw.space !== "srgb") entry.reference_space = raw.space;
        const cmp = compareImages(ref, ours);
        entry.score = Math.round(cmp.score * 10000) / 10000;
        entry.size = { apple: [ref.width, ref.height], ours: [ours.width, ours.height] };
        const sizeOff = Math.abs(ref.width - ours.width) > 2 || Math.abs(ref.height - ours.height) > 2;
        if (sizeOff) entry.size_differs = true;
        if (cmp.score > maxScore || sizeOff) {
          entry.flagged = true;
          const name = `${v.kit}-${v.node.replace(":", "-")}.png`;
          writeFileSync(join(diffDir, name), sideBySide(ref, ours, cmp));
          entry.image = `ui-kit/${name}`;
        }
      } catch (e) {
        entry.error = e.message.slice(0, 200);
      }
      results.push(entry);
      if ((i + 1) % 100 === 0) console.log(`  ${i + 1} of ${unique.length} (${Math.round((Date.now() - started) / 1000)} s)`);
    }
  } finally {
    await chrome.close();
    rmSync(tmp, { recursive: true, force: true });
  }
  const scored = results.filter((r) => r.score !== undefined);
  const flagged = results.filter((r) => r.flagged).length;
  console.log(`UI kits: ${scored.length} compared, ${flagged} flagged (more than ${maxScore * 100}% of pixels differ), ${results.length - scored.length} not compared, ${Math.round((Date.now() - started) / 1000)} s`);
  return { kind: "ui-kit", max_score: maxScore, generated_at: new Date().toISOString(), results };
}

// ---------- symbols and frames (the Swift extractor) ----------

function swift(product, args, diffDir) {
  rmSync(diffDir, { recursive: true, force: true });
  mkdirSync(diffDir, { recursive: true });
  execFileSync("swift", ["run", "-c", "release", product, ...args], {
    cwd: join(REPO, "extractor"), stdio: "inherit", env: { ...process.env, DIFF_DIR: diffDir },
  });
}

function checkSymbols({ out, symbolMin }) {
  const report = join(out, "results", "symbols.json");
  swift("extract-symbols", ["--verify-only", "all", "--verify-weights", "all", "--flag-below", String(symbolMin), "--report", report], join(out, "symbols"));
  return JSON.parse(readFileSync(report, "utf8"));
}

function checkFrames({ out }) {
  const report = join(out, "results", "frames.json");
  swift("extract-frames", ["--verify-only", "--report", report], join(out, "frames"));
  return JSON.parse(readFileSync(report, "utf8"));
}

// ---------- the report ----------

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pct = (v) => `${(v * 100).toFixed(1)}%`;

export function buildReport(out, { uiKit, symbols, frames }, { frameMin }) {
  const md = ["# Drawing check", "", `Made ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC. Open report.html in this folder to see each flagged drawing next to Apple's.`, ""];
  const html = [];
  const card = (title, sub, img, note) => `<figure><figcaption><b>${esc(title)}</b><span>${esc(sub)}</span>${note ? `<em>${esc(note)}</em>` : ""}</figcaption>${img ? `<img loading="lazy" src="${esc(img)}" alt="">` : ""}</figure>`;

  if (uiKit) {
    const r = uiKit.results;
    const flagged = r.filter((x) => x.flagged).sort((a, b) => (b.score ?? 1) - (a.score ?? 1));
    const errors = r.filter((x) => x.error);
    const scored = r.filter((x) => x.score !== undefined);
    const line = `UI kits: ${scored.length} drawings compared with Figma's render, ${flagged.length} flagged (over ${pct(uiKit.max_score)} of pixels differ)${errors.length ? `, ${errors.length} not compared` : ""}.`;
    md.push("## UI kits", "", line, "");
    for (const x of flagged) md.push(`- ${x.score !== undefined ? pct(x.score) : "?"} ${x.kit} ${x.component}${x.variant ? ` (${x.variant})` : ""}, node ${x.node}${x.size_differs ? `, size ${x.size.ours.join("x")} vs Apple's ${x.size.apple.join("x")}` : ""}${x.notes ? `; known: ${x.notes.join(", ")}` : ""}`);
    for (const x of errors.slice(0, 30)) md.push(`- not compared: ${x.kit} ${x.component} (${x.node}): ${x.error}`);
    md.push("");
    html.push(`<h2>UI kits</h2><p>${esc(line)} Each row: Apple's (Figma), ours (Chrome), and ours with the differing pixels in red.</p>`);
    html.push(flagged.map((x) => card(`${x.component}${x.variant ? ` (${x.variant})` : ""}`, `${x.kit} · node ${x.node} · ${x.score !== undefined ? pct(x.score) + " differ" : ""}${x.size_differs ? ` · size ${x.size.ours.join("×")} vs ${x.size.apple.join("×")}` : ""}`, x.image, x.notes ? `known approximation: ${x.notes.join(", ")}` : "")).join(""));
    if (errors.length) html.push(`<details><summary>${errors.length} not compared</summary><ul>${errors.map((x) => `<li>${esc(`${x.kit} ${x.component} (${x.node}): ${x.error}`)}</li>`).join("")}</ul></details>`);
  }

  if (symbols) {
    const groups = symbols.groups.map((g) => `${g.weight} ${g.compared} (worst ${g.worst})`).join(", ");
    const total = symbols.groups.reduce((s, g) => s + g.compared, 0);
    const line = `SF Symbols: ${total} drawings compared with macOS's own, ${symbols.flagged.length} flagged (overlap below ${symbols.threshold}).`;
    md.push("## SF Symbols", "", line, `By weight: ${groups}.`, "");
    const sorted = [...symbols.flagged].sort((a, b) => a.overlap - b.overlap);
    for (const x of sorted.slice(0, 200)) md.push(`- ${x.overlap} ${x.name} (${x.weight})`);
    if (sorted.length > 200) md.push(`- and ${sorted.length - 200} more in results/symbols.json`);
    md.push("");
    html.push(`<h2>SF Symbols</h2><p>${esc(line)} By weight: ${esc(groups)}. Gray: both draw; red: only macOS draws; blue: only ours draws.</p>`);
    html.push(sorted.slice(0, 500).map((x) => card(x.name, `${x.weight} · overlap ${x.overlap}`, x.diff ? `symbols/${x.diff}` : null)).join(""));
  }

  if (frames) {
    const bad = frames.frames.filter((f) => f.overlap < frameMin || f.screen_ink > 0);
    const line = `Device frames: ${frames.frames.length} compared with Xcode's art, ${bad.length} flagged (overlap below ${frameMin}, or ink inside the screen).`;
    md.push("## Device frames", "", line, "");
    for (const f of bad) md.push(`- ${f.id}: overlap ${f.overlap}, screen ink ${f.screen_ink} px, color error ${f.color_error}`);
    md.push("");
    html.push(`<h2>Device frames</h2><p>${esc(line)} Each row: Xcode's art and ours.</p>`);
    html.push(bad.map((f) => card(f.id, `overlap ${f.overlap} · screen ink ${f.screen_ink} px · color error ${f.color_error}`, f.diff ? `frames/${f.diff}` : null)).join(""));
  }

  writeFileSync(join(out, "report.md"), md.join("\n") + "\n");
  writeFileSync(join(out, "report.html"), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Drawing check</title>
<style>
:root{color-scheme:light dark;--bg:#fff;--fg:#1d1d1f;--muted:#6e6e73;--line:#d2d2d7}
@media (prefers-color-scheme:dark){:root{--bg:#1d1d1f;--fg:#f5f5f7;--muted:#a1a1a6;--line:#424245}}
body{background:var(--bg);color:var(--fg);font:15px/1.45 -apple-system,system-ui,sans-serif;margin:0 auto;max-width:1200px;padding:24px 16px}
h1{font-size:24px}h2{margin-top:40px;border-top:1px solid var(--line);padding-top:20px}
figure{margin:0 0 24px}figcaption{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;margin-bottom:6px}
figcaption span{color:var(--muted)}figcaption em{color:#c93400;font-style:normal}
img{max-width:100%;height:auto;border:1px solid var(--line);background:#fff}
</style>
<h1>Drawing check</h1><p>${esc(md[2])}</p>${html.join("\n")}`);
}

// ---------- command line ----------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const only = new Set((option("--only") ?? "ui-kit,symbols,frames").split(","));
  const out = option("--out") ?? join(REPO, "visual-check");
  const settings = {
    out,
    kitFilter: option("--kit"),
    limit: Number(option("--limit")) || Infinity,
    refresh: args.includes("--refresh"),
    maxScore: Number(option("--ui-kit-max") ?? 0.03),
    symbolMin: Number(option("--symbol-min") ?? 0.97),
    frameMin: Number(option("--frame-min") ?? 0.98),
  };
  const resultsDir = join(out, "results");
  mkdirSync(resultsDir, { recursive: true });
  const saved = (name) => { const f = join(resultsDir, `${name}.json`); return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : undefined; };
  const results = {};
  if (!args.includes("--report-only")) {
    if (only.has("ui-kit")) {
      results.uiKit = await checkUiKit(settings);
      writeFileSync(join(resultsDir, "ui-kit.json"), JSON.stringify(results.uiKit, null, 1));
    }
    if (only.has("frames")) results.frames = checkFrames(settings);
    if (only.has("symbols")) results.symbols = checkSymbols(settings);
  }
  // Parts not run this time come from the last run.
  results.uiKit ??= saved("ui-kit");
  results.frames ??= saved("frames");
  results.symbols ??= saved("symbols");
  buildReport(out, results, settings);
  console.log(`\nReport: ${join(out, "report.html")}\n`);
  console.log(readFileSync(join(out, "report.md"), "utf8").split("\n").filter((l) => !l.startsWith("- ")).join("\n").trim());
}

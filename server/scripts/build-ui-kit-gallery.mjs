// Writes assets/ui-kit-svg/index.html: one page that shows every component's drawing, to look
// over what search_ui_kit hands out. Run it after scripts/export-ui-kit-svg.mjs. No dependencies.
//
//   node scripts/build-ui-kit-gallery.mjs
//
// The page lists each kit's components by page with the first variant that has a drawing, puts
// each SVG into the page itself (as a design would, so blends and shadows show as they will there)
// when it scrolls into view, and has a switch for the background behind the drawings.
import { existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "assets", "ui-kit-svg");
const { default: pack } = await import(new URL("../src/pack/ui-kit.js", import.meta.url));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const fileOf = (node) => node.replace(/:/g, "-") + ".svg";

const kits = [];
let shown = 0;
for (const kit of pack.kits) {
  const pages = [];
  for (const page of kit.pages) {
    const items = [];
    for (const c of kit.components.filter((x) => x.page === page)) {
      const have = c.variants.filter((v) => v.node && existsSync(join(root, kit.id, fileOf(v.node))));
      if (!have.length) continue;
      const v = have[0];
      const path = join(root, kit.id, fileOf(v.node));
      items.push({ name: c.name, section: c.section ?? "", helper: Boolean(c.helper), variant: v.name, file: `${kit.id}/${fileOf(v.node)}`, w: v.width, h: v.height, kb: Math.ceil(statSync(path).size / 1024), drawn: have.length, variants: c.variants.length });
    }
    if (items.length) pages.push({ page, items });
    shown += items.length;
  }
  if (pages.length) kits.push({ id: kit.id, name: kit.name, pages });
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Apple UI kit drawings</title>
<style>
  :root { --bg: #ffffff; --ink: #1d1d1f; --dim: #6e6e73; --line: #d2d2d7; --stage: #ffffff; }
  body { margin: 0; font: 14px/1.4 -apple-system, system-ui, sans-serif; color: var(--ink); background: var(--bg); }
  header { position: sticky; top: 0; z-index: 2; background: var(--bg); border-bottom: 1px solid var(--line); padding: 10px 16px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
  header h1 { font-size: 16px; margin: 0; }
  header label { color: var(--dim); }
  main { padding: 0 16px 60px; }
  h2 { font-size: 20px; margin: 28px 0 4px; }
  h3 { font-size: 14px; margin: 22px 0 8px; color: var(--dim); font-weight: 600; }
  .grid { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-start; }
  figure { margin: 0; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; max-width: 100%; }
  .stage { background: var(--stage); padding: 28px; overflow: auto; max-width: min(100%, 1280px); }
  .stage svg { display: block; flex: none; }
  .stage .wait { background: repeating-linear-gradient(45deg, #0000000a 0 6px, #0000 6px 12px); }
  figcaption { padding: 6px 10px; border-top: 1px solid var(--line); font-size: 12px; background: var(--bg); max-width: 520px; }
  figcaption b { font-weight: 600; }
  figcaption span { color: var(--dim); }
  figcaption a { color: inherit; }
</style>
</head>
<body>
<header>
  <h1>Apple UI kit drawings</h1>
  <span>${shown} components from ${esc(pack.source.kits.join(", "))}, read ${esc(pack.pack_version)}</span>
  <label>Background <select id="bg">
    <option value="#ffffff">White</option>
    <option value="#f2f2f7">Grouped gray</option>
    <option value="#737373">Figma canvas gray</option>
    <option value="linear-gradient(135deg,#ff9f0a,#ff375f 50%,#5e5ce6)">Color</option>
    <option value="#000000">Black</option>
  </select></label>
  <label><input type="checkbox" id="helpers"> Show the kits' internal parts</label>
</header>
<main>
${kits
  .map(
    (kit) =>
      `<h2>${esc(kit.name)}</h2>\n` +
      kit.pages
        .map(
          ({ page, items }) =>
            `<section><h3>${esc(page)}</h3><div class="grid">\n` +
            items
              .map(
                (i) =>
                  `<figure${i.helper ? ' class="helper" hidden' : ""}><div class="stage"><div class="wait" data-src="${esc(i.file)}" style="width:${i.w}px;height:${i.h}px"></div></div>` +
                  `<figcaption><b>${esc(i.name)}</b>${i.section ? ` <span>(${esc(i.section)})</span>` : ""}<br><span>${esc(i.variant || "one variant")} · ${i.w} × ${i.h} · ${i.kb} KB · ${i.drawn} of ${i.variants} variants drawn · <a href="${esc(i.file)}">file</a></span></figcaption></figure>`,
              )
              .join("\n") +
            `\n</div></section>`,
        )
        .join("\n"),
  )
  .join("\n")}
</main>
<script>
  const load = async (box) => {
    try {
      const res = await fetch(box.dataset.src);
      if (!res.ok) throw new Error(res.status);
      const doc = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
      const svg = doc.documentElement;
      if (svg.nodeName !== "svg") throw new Error("not SVG");
      // Ids repeat between drawings; give this one's a prefix so its filters and masks stay its own.
      const prefix = "d" + Math.random().toString(36).slice(2, 8) + "-";
      for (const el of svg.querySelectorAll("[id]")) el.id = prefix + el.id;
      for (const el of svg.querySelectorAll("*")) for (const a of [...el.attributes]) {
        if (a.value.includes("url(#")) a.value = a.value.replace(/url\\(#/g, "url(#" + prefix);
        else if ((a.name === "href" || a.name === "xlink:href") && a.value.startsWith("#")) a.value = "#" + prefix + a.value.slice(1);
      }
      box.replaceWith(document.importNode(svg, true));
    } catch (e) { box.textContent = "could not load: " + e.message; }
  };
  const seen = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { seen.unobserve(e.target); load(e.target); } }, { rootMargin: "600px" });
  document.querySelectorAll(".wait").forEach((b) => seen.observe(b));
  document.getElementById("bg").onchange = (e) => document.documentElement.style.setProperty("--stage", e.target.value);
  document.getElementById("helpers").onchange = (e) => document.querySelectorAll("figure.helper").forEach((f) => (f.hidden = !e.target.checked));
</script>
</body>
</html>
`;
writeFileSync(join(root, "index.html"), html);
console.log(`Wrote ${join(root, "index.html")}: ${shown} components, ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB.`);

// Builds src/pack/design-values.js: the colours, text styles, sizes, materials and layout guides
// that Apple defines in its UI kits for Figma (iOS and iPadOS 27, macOS 27).
//
// Source: the text files in scripts/figma/, which are read-only dumps of each kit's variables,
// text styles and paint styles, and of the "Layout Guides" page of the iOS kit. They were
// written by the plugin scripts in scripts/figma/README.md, run in a copy of each kit through
// the Figma connector. Nothing here is typed by hand: a value is either in a dump or absent.
//
//   node scripts/build-design-values.mjs
//
// The build stops if the kit's accent and gray colours or its default text styles disagree with
// the Human Interface Guidelines pack (src/pack/hig.js), when that pack is present.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(here, "figma", name), "utf8");

// ---------- reading the dumps ----------

/** Splits a dump into sections: "## Title | column | column" followed by "name | value | value" rows. */
function sections(text) {
  const out = [];
  let current = null;
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    if (line.startsWith("## ")) {
      const [title, ...columns] = line.slice(3).split(" | ");
      current = { title, columns, rows: [] };
      out.push(current);
    } else if (current) {
      // A name can itself hold " | " ("Fills - Vibrant (Use Plus Lighter | Darker)"), so values are taken from the right.
      const parts = line.split(" | ");
      const n = Math.max(current.columns.length, 1);
      current.rows.push({ name: parts.slice(0, parts.length - n).join(" | "), values: parts.slice(parts.length - n) });
    }
  }
  return out;
}

const section = (list, title) => {
  const s = list.find((x) => x.title === title);
  if (!s) throw new Error(`No section "${title}" in the dump`);
  return s;
};

const isNumber = (v) => /^-?\d+(\.\d+)?$/.test(v);

/**
 * Resolves "@Name" references. A reference to a variable of the same collection takes that
 * variable's value in the same mode; a reference to another collection takes its first mode.
 */
function resolver(all) {
  const find = (name) => {
    for (const s of all) {
      const row = s.rows.find((r) => r.name === name);
      if (row) return { s, row };
    }
    return null;
  };
  const resolve = (value, home, column, depth = 0) => {
    if (!value.startsWith("@")) return value;
    if (depth > 8) throw new Error(`Reference loop at ${value}`);
    const hit = find(value.slice(1));
    if (!hit) throw new Error(`Unknown reference ${value}`);
    const index = hit.s === home ? column : 0;
    return resolve(hit.row.values[index], hit.s, index, depth + 1);
  };
  return resolve;
}

// ---------- colours ----------

const RANK = ["Primary", "Secondary", "Tertiary", "Quaternary", "Quinary", "Seximal"];
const ACCENTS = ["Red", "Orange", "Yellow", "Green", "Mint", "Teal", "Cyan", "Blue", "Indigo", "Purple", "Pink", "Brown"];
const GRAYS = ["Gray", "Gray 2", "Gray 3", "Gray 4", "Gray 5", "Gray 6", "Black", "White"];
const GROUPS = [
  "Accents", "Accents - Vibrant", "Grays", "Labels", "Fills", "Fills - Opaque", "Backgrounds", "Backgrounds – Grouped",
  "Window Background", "Separators", "Overlays", "Labels - Vibrant", "Fills - Vibrant", "Miscellaneous",
];

// The system colour each kit colour stands for, where there is one.
const IOS_API = {
  "Labels/Primary": "label", "Labels/Secondary": "secondaryLabel", "Labels/Tertiary": "tertiaryLabel", "Labels/Quaternary": "quaternaryLabel",
  "Fills/Primary": "systemFill", "Fills/Secondary": "secondarySystemFill", "Fills/Tertiary": "tertiarySystemFill", "Fills/Quaternary": "quaternarySystemFill",
  "Backgrounds/Primary": "systemBackground", "Backgrounds/Secondary": "secondarySystemBackground", "Backgrounds/Tertiary": "tertiarySystemBackground",
  "Backgrounds – Grouped/Primary": "systemGroupedBackground", "Backgrounds – Grouped/Secondary": "secondarySystemGroupedBackground",
  "Backgrounds – Grouped/Tertiary": "tertiarySystemGroupedBackground",
  "Separators/Opaque": "opaqueSeparator", "Separators/Non-opaque": "separator",
  "Grays/Gray": "systemGray", "Grays/Gray 2": "systemGray2", "Grays/Gray 3": "systemGray3", "Grays/Gray 4": "systemGray4",
  "Grays/Gray 5": "systemGray5", "Grays/Gray 6": "systemGray6",
};
const MAC_API = {
  "Labels/Primary": "labelColor", "Labels/Secondary": "secondaryLabelColor", "Labels/Tertiary": "tertiaryLabelColor",
  "Labels/Quaternary": "quaternaryLabelColor", "Window Background": "windowBackgroundColor", "Grays/Gray": "systemGray",
};

function splitName(full) {
  // "Fills - Vibrant (Use Plus Lighter | Darker)/Primary" keeps Apple's instruction as a note on the group.
  const clean = full.replace(" (Use Plus Lighter | Darker)", "");
  const i = clean.indexOf("/");
  return i < 0 ? { group: clean, name: "" } : { group: clean.slice(0, i), name: clean.slice(i + 1) };
}

function colorOrder(a, b) {
  const g = (x) => (GROUPS.indexOf(x.group) + 1 || GROUPS.length + 1);
  if (g(a) !== g(b)) return g(a) - g(b);
  const rank = (x) => {
    const base = x.name.replace(" - Elevated", "");
    const lists = [RANK, ACCENTS, GRAYS];
    for (const list of lists) {
      const i = list.indexOf(base);
      if (i >= 0) return i + (x.name.endsWith(" - Elevated") ? 100 : 0);
    }
    return 1000 + x.order;
  };
  return rank(a) - rank(b);
}

function accentApi(group, name) {
  return group === "Accents" && ACCENTS.includes(name) ? `system${name}` : undefined;
}

function iosColors(vars) {
  const resolve = resolver(vars);
  const scheme = section(vars, "Color Scheme");
  const contrast = section(vars, "Color Contrast");
  const byName = new Map(contrast.rows.map((r) => [r.name, r]));
  const out = [];
  scheme.rows.forEach((row, order) => {
    if (!row.values[0].startsWith("@")) return; // the "Mode" label
    const [light, dark] = row.values.map((v) => byName.get(v.slice(1)));
    if (!light || !dark) throw new Error(`Colour ${row.name} has no values`);
    const value = (r, i) => resolve(r.values[i], contrast, i);
    const { group, name } = splitName(row.name);
    const color = { group, name, light: value(light, 0), dark: value(dark, 0), order };
    const lc = value(light, 1);
    const dc = value(dark, 1);
    if (lc !== color.light || dc !== color.dark) Object.assign(color, { light_contrast: lc, dark_contrast: dc });
    const api = IOS_API[row.name] ?? accentApi(group, name);
    if (api) color.api = api;
    out.push(color);
  });
  return finishColors(out);
}

function macColors(vars) {
  const s = section(vars, "Colors");
  const out = [];
  s.rows.forEach((row, order) => {
    if (!row.values.every((v) => v.startsWith("#"))) return; // "Mode" and "String" labels
    const { group, name } = splitName(row.name);
    const color = { group, name, light: row.values[0], dark: row.values[1], order };
    const api = MAC_API[row.name] ?? accentApi(group, name);
    if (api) color.api = api;
    out.push(color);
  });
  return finishColors(out);
}

function finishColors(list) {
  for (const c of list) {
    for (const k of ["light", "dark", "light_contrast", "dark_contrast"]) {
      if (c[k] !== undefined && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(c[k])) throw new Error(`Bad colour ${c.group}/${c.name} ${k}: ${c[k]}`);
    }
  }
  return list.sort(colorOrder).map(({ order, ...c }) => c);
}

// ---------- text styles ----------

const STYLE_NAMES = { Title1: "Title 1", Title2: "Title 2", Title3: "Title 3", Caption1: "Caption 1", Caption2: "Caption 2" };

/** One row per text style at the default size, from the kit's "Regular" and "Emphasized" styles. */
function textStyles(styles) {
  const rows = section(styles, "TEXT STYLES").rows;
  const number = (v) => {
    const m = /^-?\d+(\.\d+)?/.exec(v);
    if (!m) throw new Error(`Bad number ${v}`);
    return Number(m[0]);
  };
  const out = [];
  for (const row of rows) {
    const [style, variant] = row.name.split("/");
    if (variant !== "Regular") continue;
    const emphasized = rows.find((r) => r.name === `${style}/Emphasized`);
    // values: family, style (weight), size, line height, letter spacing
    const entry = {
      name: STYLE_NAMES[style] ?? style,
      weight: row.values[1],
      size: number(row.values[2]),
      leading: number(row.values[3]),
    };
    const tracking = row.values[4].endsWith("%") ? 0 : number(row.values[4]);
    if (tracking) entry.tracking = tracking;
    // The iOS kit marks Callout/Emphasized "Semibold Italic"; the weight is what matters here.
    if (emphasized) entry.emphasized = emphasized.values[1].replace(" Italic", "");
    out.push(entry);
  }
  return out;
}

/** How much the kit's loose and tight leading differ from the default, when every style agrees. */
function leadingAdjust(vars) {
  const rows = section(vars, "Text Leading").rows;
  const diffs = (i) => new Set(rows.map((r) => Number(r.values[i]) - Number(r.values[0])));
  const [loose, tight] = [diffs(1), diffs(2)];
  if (loose.size !== 1 || tight.size !== 1) throw new Error("Loose and tight leading are no longer a fixed step from the default");
  return { loose: [...loose][0], tight: [...tight][0] };
}

// ---------- sizes ----------

function sizes(vars, title, columnOrder, skip = () => false) {
  const resolve = resolver(vars);
  const s = section(vars, title);
  const columns = columnOrder ?? s.columns;
  const rows = [];
  for (const row of s.rows) {
    if (skip(row.name)) continue;
    const values = columns.map((c) => {
      const i = s.columns.indexOf(c);
      return resolve(row.values[i], s, i);
    });
    if (!values.every(isNumber)) continue; // labels such as "Mode"
    rows.push({ name: row.name, values: values.map(Number) });
  }
  // Keep Apple's grouping ("Menus/…", "Slider/…") together, in the order each group first appears.
  const groups = [];
  for (const r of rows) {
    const g = r.name.includes("/") ? r.name.slice(0, r.name.indexOf("/")) : "";
    if (!groups.includes(g)) groups.push(g);
  }
  rows.sort((a, b) => {
    const g = (r) => groups.indexOf(r.name.includes("/") ? r.name.slice(0, r.name.indexOf("/")) : "");
    return g(a) - g(b);
  });
  return { columns, rows };
}

// ---------- materials ----------

function glass(vars) {
  const kit = section(vars, "Kit");
  return kit.rows
    .filter((r) => /^(Liquid Glass|Scroll Edge Effect)\//.test(r.name) && isNumber(r.values[0]))
    .map((r) => ({ name: r.name.replace("/", ", "), value: Number(r.values[0]) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Paint styles that are not plain system colours: materials and vibrant fills, with their blend modes. */
function materials(styles, keep) {
  return section(styles, "PAINT STYLES").rows
    .map((r) => ({ name: r.name || r.values[0], paint: r.name ? r.values[0] : "" }))
    .filter((r) => keep.test(r.name))
    .map((r) => ({
      name: r.name.replace(/^Materials\//, "").replace(/\//g, ", "),
      layers: r.paint.split(" + ").map((layer) => {
        const [color, blend] = layer.split(" ");
        return blend ? { color, blend: blend.toLowerCase().replace(/_/g, " ") } : { color };
      }),
    }));
}

// ---------- layout guides ----------

const GUIDE = /^(Layout Margin|Safe Area Inset|Reserved Region|Fold Avoidance Region)/;
const ELEMENT = /^(Vertical Bar|Toolbar - Top - iPhone Duo|Tab Bar|Outer Display Lens|Camera Punchout)$/;

/**
 * Reads the outline of the kit's "Layout Guides" page: one template per screen and orientation,
 * each with the regions Apple marks on it. Regions inside a sheet are given relative to the sheet.
 */
function layoutGuides(text) {
  const templates = [];
  const stack = []; // ancestors of the current line: { depth, name, x, y }
  let template = null;
  for (const line of text.split("\n")) {
    const m = /^( *)- (\w+) "([^"]*)" ([\d.]+)x([\d.]+) @(-?[\d.]+),(-?[\d.]+)/.exec(line);
    if (!m) continue;
    const depth = m[1].length / 2;
    const node = { depth, type: m[2], name: m[3], width: Number(m[4]), height: Number(m[5]), x: Number(m[6]), y: Number(m[7]) };
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (depth === 0) {
      template = null;
      if (node.type === "COMPONENT" && node.name.startsWith("iPhone Duo/")) {
        const [, kind, screen] = node.name.split("/");
        template = { name: node.name, kind: kind === "Sheets" ? "sheet" : "standard", screen, width: node.width, height: node.height, regions: [] };
        templates.push(template);
      }
    } else if (template) {
      const inside = stack.slice(1); // ancestors below the template itself
      const sheet = inside.find((a) => a.name === "Sheet");
      const origin = inside.slice(sheet ? inside.indexOf(sheet) + 1 : 0).reduce((o, a) => ({ x: o.x + a.x, y: o.y + a.y }), { x: 0, y: 0 });
      const region = (kind, name) => ({ kind, name, ...(sheet ? { in: "sheet" } : {}), x: origin.x + node.x, y: origin.y + node.y, width: node.width, height: node.height });
      if (node.name === "Sheet" && node.type === "FRAME") template.regions.push({ kind: "sheet", name: "Sheet", x: node.x, y: node.y, width: node.width, height: node.height });
      else if (GUIDE.test(node.name)) template.regions.push(region("guide", node.name.replace(/: \d+pt$/, "")));
      else if (ELEMENT.test(node.name) && template.kind === "standard" && !inside.some((a) => ELEMENT.test(a.name))) {
        template.regions.push(region("element", node.name));
      }
    }
    stack.push(node);
  }
  // Standard templates first, then sheets, each in the kit's reading order: outer before inner, portrait before landscape.
  const rank = (t) => [t.kind === "sheet" ? 1 : 0, t.screen.startsWith("Outer") ? 0 : 1, t.screen.includes("Folded") ? 1 : 0, t.screen.includes("Landscape") ? 1 : 0];
  templates.sort((a, b) => {
    const [ra, rb] = [rank(a), rank(b)];
    for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
    return 0;
  });
  return templates;
}

// ---------- checks against the guidelines ----------

async function checkAgainstGuidelines(ios, mac) {
  const path = join(here, "..", "src", "pack", "hig.js");
  if (!existsSync(path)) {
    console.log("Guidelines pack not built; skipped the cross-check.");
    return;
  }
  const hig = (await import(pathToFileURL(path).href)).default;
  const text = (page, id) => hig.pages.find((p) => p.id === page)?.sections.find((s) => s.id === id)?.text ?? "";
  const hex = (cell) => {
    const m = /R-(\d+),G-(\d+),B-(\d+)/.exec(cell);
    return m ? "#" + m.slice(1).map((n) => Number(n).toString(16).padStart(2, "0")).join("") : null;
  };
  const problems = [];
  let checked = 0;
  const colorTable = (id, group, rename = (n) => n) => {
    for (const line of text("color", id).split("\n")) {
      const cells = line.split("|").map((c) => c.trim());
      if (cells.length < 7 || !hex(cells[3])) continue;
      const kit = ios.colors.find((c) => c.group === group && c.name === rename(cells[1]));
      if (!kit) { problems.push(`${group}/${cells[1]} is in the guidelines but not in the kit`); continue; }
      const want = [hex(cells[3]), hex(cells[4]), hex(cells[5]), hex(cells[6])];
      const have = [kit.light, kit.dark, kit.light_contrast ?? kit.light, kit.dark_contrast ?? kit.dark];
      checked++;
      if (want.join() !== have.join()) problems.push(`${group}/${kit.name}: guidelines ${want.join(" ")}, kit ${have.join(" ")}`);
    }
  };
  colorTable("specifications/system-colors", "Accents");
  colorTable("specifications/ios-ipados-system-gray-colors", "Grays", (n) => n.replace(/\((\d)\)/, "$1"));

  const typeTable = (sectionText, styles, label) => {
    for (const line of sectionText.split("\n")) {
      const cells = line.split("|").map((c) => c.trim());
      if (cells.length < 7 || !/^\d+$/.test(cells[3])) continue;
      const name = cells[1] === "Subhead" ? "Subheadline" : cells[1];
      const kit = styles.find((s) => s.name === name);
      if (!kit) { problems.push(`${label} ${name} is in the guidelines but not in the kit`); continue; }
      // The iOS kit has no emphasized Headline style, so that weight is checked only where the kit gives one.
      const want = [cells[2], cells[3], cells[4], kit.emphasized ? cells[5] : ""].join(" ");
      const have = [kit.weight, kit.size, kit.leading, kit.emphasized ?? ""].join(" ");
      checked++;
      if (want !== have) problems.push(`${label} ${name}: guidelines ${want}, kit ${have}`);
    }
  };
  const dynamic = text("typography", "specifications/ios-ipados-dynamic-type-sizes");
  const large = dynamic.slice(dynamic.indexOf("#### Large (default)"), dynamic.indexOf("#### xLarge"));
  typeTable(large, ios.text_styles, "iOS");
  typeTable(text("typography", "specifications/macos-built-in-text-styles"), mac.text_styles, "macOS");

  if (problems.length) throw new Error("The kit disagrees with the guidelines:\n  " + problems.join("\n  "));
  console.log(`Cross-check: ${checked} colours and text styles match the guidelines.`);
}

// ---------- build ----------

const iosVars = sections(read("ios-27-variables.txt"));
const iosStyles = sections(read("ios-27-styles.txt"));
const macAll = sections(read("macos-27-values.txt"));

const ios = {
  id: "ios",
  name: "iOS and iPadOS 27",
  kit: "iOS and iPadOS 27 UI kit for Figma",
  colors: iosColors(iosVars),
  text_styles: textStyles(iosStyles),
  leading_adjust: leadingAdjust(iosVars),
  // "Other/Cut Corners" and "App Icon Title Offset" only position the kit's own artwork.
  sizes: sizes(iosVars, "Dimensions", undefined, (name) => name.startsWith("Other/") || name === "App Icon Title Offset"),
  materials: materials(iosStyles, /^Vibrant /),
  glass: glass(iosVars),
  layout: layoutGuides(read("ios-27-layout-guides.txt")),
};

const mac = {
  id: "macos",
  name: "macOS 27",
  kit: "macOS 27 UI kit for Figma",
  colors: macColors(macAll),
  text_styles: textStyles(macAll),
  sizes: sizes(macAll, "Sizes", ["Mini", "Small", "Medium", "Large", "XL"]),
  materials: materials(macAll, /^Materials\//),
  glass: glass(macAll),
  layout: [],
};

await checkAgainstGuidelines(ios, mac);

const count = (p) =>
  p.colors.length + p.text_styles.length + p.sizes.rows.length + p.materials.length + p.glass.length + p.layout.reduce((n, t) => n + t.regions.length, 0);
const today = new Date().toISOString();
const pack = {
  pack_version: today.slice(0, 10),
  generated_at: today,
  source: {
    name: "Apple Design Resources, UI kits for Figma",
    url: "https://developer.apple.com/design/resources/",
    kits: [ios.kit, mac.kit],
    values: count(ios) + count(mac),
  },
  platforms: [ios, mac],
};

/** JSON with one line per colour, row and region, so a rebuild gives a readable diff. */
function compact(value, indent = "") {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v !== "object" || v === null || Array.isArray(v) || !Object.values(v).some((x) => Array.isArray(x) && x.some((y) => typeof y === "object")))) {
      return value.length ? `[\n${value.map((v) => `${indent} ${JSON.stringify(v)}`).join(",\n")}\n${indent}]` : "[]";
    }
    return `[\n${value.map((v) => `${indent} ${compact(v, indent + " ")}`).join(",\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    return `{\n${Object.entries(value).map(([k, v]) => `${indent} ${JSON.stringify(k)}: ${compact(v, indent + " ")}`).join(",\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}

const outPath = join(here, "..", "src", "pack", "design-values.js");
writeFileSync(
  outPath,
  "// Written by scripts/build-design-values.mjs from the dumps in scripts/figma/. Do not edit.\n" +
    `export default ${compact(pack)};\n`,
);
for (const p of pack.platforms) {
  console.log(
    `${p.name}: ${p.colors.length} colours, ${p.text_styles.length} text styles, ${p.sizes.rows.length} sizes, ` +
      `${p.materials.length} materials, ${p.glass.length} glass settings, ${p.layout.length} layout templates`,
  );
}
console.log(`Wrote ${outPath} (${pack.source.values} values).`);

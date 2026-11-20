// UI kit lookup: the components of Apple's UI kits for Figma (iOS and iPadOS, macOS, watchOS),
// each as Apple's own drawing (an SVG that Figma exported from the kit) and as an outline of its
// layers with sizes, layout, colours and text styles.
import pack from "./pack/ui-kit.js";
import type { Kit, KitComponent, KitVariant } from "./pack/ui-kit.js";

export const uiKitPack = pack;
export const KIT_IDS = ["ios", "macos", "watchos"] as const;
export type KitId = (typeof KIT_IDS)[number];

/** Loads the outlines of one component: the blocks of "ui-kit/<kit>/<id>.txt", or null when the file is missing. */
export type OutlineLoader = (kit: string, id: string) => Promise<string | null>;

/** Loads Apple's drawing of one variant, "ui-kit-svg/<kit>/<file>", or null when the file is missing. */
export type DrawingLoader = (kit: string, file: string) => Promise<string | null>;

/** The file name of a variant's drawing: its Figma node id "3:72207" as "3-72207.svg". */
export const drawingFile = (node: string) => node.replace(/:/g, "-") + ".svg";

// ---------- words ----------

// "bars" and "bar" are one word; "glass", "macos" and "watchos" keep their s.
const stem = (w: string) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("os") ? w.slice(0, -1) : w);
const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(stem);

// What people call a component, next to what Apple's kit calls it.
const SYNONYMS: Record<string, string[]> = {
  navigation: ["toolbar"], nav: ["toolbar"], navbar: ["toolbar"],
  switch: ["toggle"], toggle: ["switch"],
  modal: ["sheet"], dialog: ["alert"], cell: ["row"], table: ["list"],
  spinner: ["progress"], loading: ["progress"],
  dropdown: ["popup", "pop"], select: ["popup", "pop"],
  input: ["field"], textfield: ["field"], textbox: ["field"],
  share: ["activity"], segment: ["segmented"], checkbox: ["checkboxe"],
  tabbar: ["tab"], tooltip: ["tooltip"],
  primary: ["prominent"], filled: ["prominent"], cta: ["prominent"],
};
const KIT_WORDS: Record<string, KitId> = { mac: "macos", macos: "macos", watch: "watchos", watchos: "watchos", ios: "ios", ipados: "ios" };
const DEVICE_WORDS = new Set(["iphone", "ipad", "duo"]);
const STATE_WORDS = new Set(["on", "off", "enabled", "disabled"]);
const NOISE = new Set(["the", "a", "an", "for", "of", "in", "with", "and", "apple", "component", "ui", "kit"]);
// Names from earlier systems and other toolkits, per kit. watchOS still has navigation bars, so it keeps the words.
const BARS: [RegExp, string][] = [
  [/\b(navigation|nav) bar\b|\bnavbar\b/, "toolbar top"],
  [/\bbottom bar\b/, "toolbar bottom"],
  [/\bshare sheet\b/, "activity view"],
  [/\bsearch bar\b/, "search field"],
  [/\bactivity indicator\b|\bloading indicator\b/, "indeterminate circular progress"],
  [/\bbottom sheet\b/, "sheet"],
];
// Names written as one word or two: "popup" and "pop up" are the kit's "Pop-Up".
const SPELLINGS: [RegExp, string][] = [
  [/\bpop ?ups?\b/, "pop up"],
  [/\bpull ?downs?\b/, "pull down"],
];
// "list" alone means the thing lists are made of; the kit has no component of that name.
const LISTS: [RegExp, string][] = [[/^(list|table)( view)?$/, "list row"]];
const PHRASES: Record<string, [RegExp, string][]> = { ios: [...SPELLINGS, ...BARS, ...LISTS], macos: [...SPELLINGS, ...BARS], watchos: SPELLINGS };

/** How well a query word matches a word of a name: 3 the same word, 2 its start or end, 0 no match. */
function wordMatch(q: string, w: string): number {
  if (q === w) return 3;
  if (q.length >= 3 && (w.startsWith(q) || w.endsWith(q))) return 2;
  return 0;
}
const best = (q: string, list: string[]) => list.reduce((m, w) => Math.max(m, wordMatch(q, w)), 0);

interface Indexed {
  kit: Kit;
  c: KitComponent;
  name: string[];
  place: string[];
  page: string[];
  values: string[];
}

const index: Indexed[] = pack.kits.flatMap((kit) =>
  kit.components.map((c) => ({
    kit,
    c,
    name: words(c.name),
    place: words(`${c.page} ${c.section ?? ""}`),
    page: words(c.page),
    values: words([...(c.variant_props ?? []).flatMap((p) => [p.name, ...p.values]), ...(c.props ?? []).map((p) => p.name)].join(" ")),
  })),
);

interface Query {
  /** The words that have to be found. */
  content: string[];
  /** Device words: a preference, never a requirement. */
  devices: string[];
  /** True when the query asks for a whole example screen. */
  examples: boolean;
  /** Words for a state ("disabled", "off"): they choose a variant, not a component. */
  states: string[];
}

function score(e: Indexed, q: Query): number {
  let total = 0;
  let matched = 0;
  const hit = new Set<string>();
  for (const word of q.content) {
    let bestScore = 0;
    [word, ...(SYNONYMS[word] ?? [])].forEach((a, i) => {
      const inName = best(a, e.name);
      const inValues = best(a, e.values);
      const inPlace = best(a, e.place);
      // A component on the page named after the word is the standard one: "Text Field" on "Text Fields".
      const s = Math.max(inName * 4, inValues * 3, inPlace * 2) * (i === 0 ? 1 : 0.9) + (inPlace && (inName || inValues) ? 2 : 0);
      if (s > bestScore) bestScore = s;
      if (inName) e.name.forEach((w) => wordMatch(a, w) && hit.add(w));
    });
    if (bestScore > 0) matched++;
    total += bestScore;
  }
  if (!matched) return 0;
  // Every word has to be found for a full match; partial matches rank far below.
  const partial = matched < q.content.length ? 0.2 * (matched / q.content.length) : 1;
  total *= partial;

  // The page named exactly after the query holds the standard component: "button" means the "Buttons" page.
  if (matched === q.content.length && e.page.length === q.content.length && e.page.every((w) => q.content.some((c) => wordMatch(c, w)))) total += 2;

  const own = [...e.name, ...e.place];
  // The device is a preference among components that match: it does not lift one that lacks a word
  // ("vertical" in "iPhone Duo vertical toolbar") over one that has them all.
  for (const d of q.devices) total += own.includes(d) ? 4 * partial : 0;
  if (q.devices.length) {
    const other = [...DEVICE_WORDS].filter((d) => !q.devices.includes(d) && e.name.includes(d));
    total -= 3 * other.length;
  } else if (own.includes("ipad") || own.includes("duo")) total -= 0.5;
  else if (own.includes("iphone")) total += 0.5;

  if (e.c.helper) total -= 6;
  if (e.c.page === "Examples") total += q.examples ? 6 : -2;
  // Name words the query does not cover: "Row" beats "Row - Button" for "row".
  total -= 0.5 * e.name.filter((w) => !hit.has(w) && !DEVICE_WORDS.has(w)).length;
  return Math.max(total, 0.01);
}

/** The kit a query is about, from its words ("mac sidebar", "watch button"), else the one asked for. */
function parseQuery(query: string, asked: KitId | undefined): { kit: KitId; named: boolean; q: Query } {
  let kit = asked;
  let named = Boolean(asked);
  const raw = words(query);
  for (const w of raw) {
    if (KIT_WORDS[w] && !kit) { kit = KIT_WORDS[w]; named = true; }
  }
  kit ??= "ios";
  let text = raw.filter((w) => !KIT_WORDS[w]).join(" ");
  for (const [from, to] of PHRASES[kit] ?? []) text = text.replace(from, to);
  const rest = text.split(" ").filter(Boolean);
  const examples = rest.some((w) => w === "example" || w === "screen" || w === "template");
  const content = rest.filter((w) => !NOISE.has(w) && !DEVICE_WORDS.has(w) && !STATE_WORDS.has(w) && !["example", "screen", "template"].includes(w));
  // A query of state words only ("on") keeps them as its content.
  const states = content.length ? rest.filter((w) => STATE_WORDS.has(w)) : [];
  return { kit, named, q: { content: content.length ? content : rest.filter((w) => !DEVICE_WORDS.has(w)), devices: rest.filter((w) => DEVICE_WORDS.has(w)), examples, states } };
}

function findIn(kit: KitId, query: string, q: Query): Indexed[] {
  const wanted = query.trim().toLowerCase();
  // Equal scores: the component with more variants first, which puts a composed component ahead of its parts.
  const ranked = index
    .filter((e) => e.kit.id === kit)
    .map((e) => ({ e, s: score(e, q), exact: e.c.id === wanted || e.c.name.toLowerCase() === wanted }))
    .filter((x) => x.s > 0 || x.exact)
    .sort((a, b) => Number(b.exact) - Number(a.exact) || b.s - a.s || b.e.c.variants.length - a.e.c.variants.length);
  const top = ranked.find((x) => !x.exact)?.s ?? 0;
  return ranked.filter((x) => x.exact || x.s >= top * 0.35).map((x) => x.e);
}

/**
 * The components that match a query, best first. A query that names no kit and finds nothing in
 * the iOS kit is tried in the others, so "checkbox" finds the macOS one.
 */
export function findComponents(query: string, asked?: KitId): { kit: KitId; hits: Indexed[]; q: Query } {
  const parsed = parseQuery(query, asked);
  let hits = findIn(parsed.kit, query, parsed.q);
  const full = (list: Indexed[]) => list.length > 0 && score(list[0], parsed.q) >= 4;
  if (!parsed.named && !full(hits)) {
    for (const other of KIT_IDS.filter((k) => k !== parsed.kit)) {
      const q = parseQuery(query, other).q;
      const found = findIn(other, query, q);
      if (found.length && score(found[0], q) >= 4) return { kit: other, hits: found, q };
    }
  }
  // A query of several words that only some of them find ("split view" finding "Activity View")
  // names something the kits do not have: say so instead of offering the near miss.
  if (parsed.q.content.length >= 2 && !full(hits)) hits = [];
  return { kit: parsed.kit, hits, q: parsed.q };
}

// ---------- variants ----------

// The value that is a component's everyday state, where a property has one: an enabled, idle,
// medium-size button that is not destructive, on an iPhone.
const USUAL: [RegExp, RegExp][] = [
  [/destructive|disabled/i, /^(false|no|off)$/i],
  [/enabled/i, /^(true|yes|on)$/i],
  [/^state$/i, /^(idle|default|normal|enabled|rest|resting)$/i],
  [/^size$/i, /^(medium|regular|default)$/i],
  [/^device$/i, /^iphone/i],
  // The toolbar's button parts: the group of buttons is what a toolbar holds.
  [/^type$/i, /^button group$/i],
];

/**
 * The variant to show when the query names none: the one in the component's everyday state, and
 * otherwise holding the first value of every variant property, which is the one Figma shows first.
 */
function defaultVariant(c: KitComponent): KitVariant {
  const wanted = (c.variant_props ?? []).map((p) => {
    const usual = USUAL.find(([name]) => name.test(p.name))?.[1];
    return `${p.name}=${(usual && p.values.find((v) => usual.test(v))) ?? p.values[0]}`;
  });
  const parts = (v: KitVariant) => v.name.split(", ");
  let bestV = c.variants[0];
  let bestN = -1;
  for (const v of c.variants) {
    const n = wanted.filter((f) => parts(v).includes(f)).length;
    if (n > bestN) [bestV, bestN] = [v, n];
  }
  return bestV;
}

const YES = /^(true|yes|on)$/i;
const NO = /^(false|no|off)$/i;

/**
 * The variant a query asks for ("large destructive button"), else the default one. A word can be a
 * property's value ("large"), the name of a property that is switched on ("destructive") or
 * "disabled". Among the variants that fit equally well, the one closest to the default is taken.
 * `named` is the number of query words that chose it.
 */
function pickVariant(c: KitComponent, queryWords: string[]): { variant: KitVariant; named: number } {
  const fallback = defaultVariant(c);
  if (c.variants.length < 2) return { variant: fallback, named: 0 };
  const nameWords = new Set(words(c.name));
  const extra = queryWords.filter((w) => !nameWords.has(w));
  if (!extra.length) return { variant: fallback, named: 0 };
  const pairs = (v: KitVariant) => v.name.split(", ").map((p) => p.split("=") as [string, string | undefined]);
  const usual = new Set(fallback.name.split(", "));
  let bestV = fallback;
  let bestN = 0;
  let bestNear = -1;
  for (const v of c.variants) {
    const has = (w: string) =>
      pairs(v).some(([prop, value = ""]) => {
        if (words(value).includes(w)) return true;
        if (YES.test(value) && words(prop).includes(w)) return true;
        if (w === "disabled") return NO.test(value) && words(prop).includes("enabled");
        return w === "off" && NO.test(value) && words(prop).includes("on");
      });
    const n = extra.filter(has).length;
    const near = v.name.split(", ").filter((p) => usual.has(p)).length;
    if (n > bestN || (n === bestN && n > 0 && near > bestNear)) [bestV, bestN, bestNear] = [v, n, near];
  }
  return { variant: bestV, named: bestN };
}

// ---------- text ----------

const num = (n: number) => String(Math.round(n * 100) / 100);
const size = (v: KitVariant) => `${num(v.width)} × ${num(v.height)}`;

function parseOutlines(file: string): string[] {
  const out: string[] = [];
  for (const block of file.split(/^=== /m)) {
    const nl = block.indexOf("\n");
    if (nl < 0) continue;
    out[Number(block.slice(0, nl))] = block.slice(nl + 1).trimEnd();
  }
  return out;
}

function header(kit: Kit, c: KitComponent): string[] {
  const lines = [`${kit.name} kit, page "${c.page}"${c.section ? `, section "${c.section}"` : ""}${c.helper ? ". An internal part of the kit." : "."}`];
  if (c.hig) lines.push(`Guidelines: call search_hig with "${c.hig.replace(/-/g, " ")}".`);
  if (c.variant_props?.length) {
    lines.push(`Variants (${c.variants.length}): ${c.variant_props.map((p) => `${p.name} = ${p.values.join(" / ")}`).join("; ")}.`);
  }
  if (c.props?.length) {
    lines.push(
      "Properties: " +
        c.props.map((p) => `${p.name} (${p.type}${p.default !== undefined ? `, default ${p.default}` : ""}${p.note ? `: ${p.note}` : ""})`).join("; ") +
        ".",
    );
  }
  return lines;
}

const DRAWING =
  "Using a drawing: the SVG is Apple's own component, exported from Apple's UI kit by Figma. In a mockup, place it as it is and only change its icons and labels; " +
  "do not rebuild it in HTML or CSS, even for tap states (lay clickable areas over it instead). " +
  "In SwiftUI, UIKit or AppKit code, use the system's own component and SF Symbols by name instead, and use the drawing and measurements as reference. " +
  "Its width and height are the component's own size in points; a shadow reaches past that box. In HTML, put the SVG into the page, where its " +
  "shadow shows around it and its labels and icons can be changed, or show it unchanged by its address in an img, which cuts the shadow off at the box. " +
  "Layers are groups and shapes with the layer's name as id. Labels are text elements: change a label by editing its text, and keep its position and font. " +
  "Icons are paths marked data-symbol with the SF Symbol's name and data-symbol-weight with its weight (regular when it has none): to change an icon, " +
  "replace those paths with the shape get_symbol returns for that weight, at the same place and size. " +
  "Text is set in SF Pro and falls back to the system font. Liquid Glass is drawn as a translucent fill with its shadow: on a light background its colors match Apple's kit, " +
  "and the live material's refraction and bright edge are not in it. " +
  "Ids can repeat between two SVGs, so give each one's ids a prefix (also inside url(#…)) when several go into one page.";

const PICTURES =
  " A photo, wallpaper or app icon inside a drawing is an image element that loads from this server by its address: it shows when the SVG is in the page, " +
  "and is missing when the SVG is shown through an img.";

const LEGEND =
  "Reading an outline: every line is one layer, indented under the layer that holds it. It gives the layer's name, kind, width × height in points, " +
  "then its layout (row or column is a flex container with that gap and padding; \"hugs\" means sized by its content, \"fills\" means stretched to its parent), " +
  "corner radius, fill, stroke and effects. A position \"at (x, y)\" is measured from the parent's top-left corner. Colors such as Labels/Primary and " +
  "text styles such as Body/Regular are Apple's names: get_design_values has their values. \"SF Symbol house.fill\" is an icon from SF Symbols by name: get_symbol returns it. A \"U+…\" in its place is one whose name is not known; " +
  "choose one with search_symbols. \"instance of\" points to another component of the kit, outlined under \"Parts\" or available by passing its name as a query. " +
  "Vector shapes are named, not drawn.";

class Budget {
  constructor(public left: number) {}
  take(text: string): string | null {
    if (text.length > this.left) return null;
    this.left -= text.length;
    return text;
  }
}

/** Room kept for each query's heading, properties and notes when the drawings are given their share of the reply. */
const HEADER_ROOM = 1500;

/** Below this share of the reply, a query lists 3 other variants and 4 other matches instead of 8 and 12. */
const BRIEF_BELOW = 3000;

/** The least of an outline kept when it is cut for size. */
const MIN_OUTLINE = 600;

/** An outline cut at a line break to about `limit` characters, fenced, saying how much was left out. */
function cutOutline(text: string, limit: number): string {
  const lines = text.split("\n");
  const kept: string[] = [];
  let n = 0;
  for (const line of lines) {
    if (kept.length && n + line.length + 1 > limit) break;
    kept.push(line);
    n += line.length + 1;
  }
  return "```text\n" + kept.join("\n") + "\n```\n\n" +
    `(Outline cut for size: ${kept.length} of ${lines.length} lines. Call again with this query alone, or a larger max_chars, for all of it.)`;
}

/**
 * The components that best match each query: Apple's drawing of the variant asked for, the outline
 * of its layers and of the parts it is built from. Without queries: the list of every published
 * component of the kit.
 */
export async function searchUiKit(
  queries: string[],
  asked: KitId | undefined,
  maxChars: number,
  load: OutlineLoader,
  loadDrawing: DrawingLoader,
  origin: string,
): Promise<{ text: string; ok: boolean }> {
  if (!pack.kits.length) return { text: "No UI kit is loaded on this server yet.", ok: false };
  const source = `Source: ${pack.source.name} (${pack.source.kits.join(", ")}), ${pack.source.url}, read ${pack.pack_version}.`;
  if (!queries.length) return { text: [listing(asked ?? "ios"), source].join("\n\n"), ok: true };

  const cache = new Map<string, Promise<string[] | null>>();
  const outlines = (kit: string, id: string) => {
    const key = `${kit}/${id}`;
    if (!cache.has(key)) cache.set(key, load(kit, id).then((file) => (file === null ? null : parseOutlines(file))));
    return cache.get(key)!;
  };

  // First what every query found, with the drawing of the variant it will show.
  const found = await Promise.all(
    queries.map(async (query) => {
      const { kit: kitId, hits, q } = findComponents(query, asked);
      const kit = pack.kits.find((k) => k.id === kitId);
      if (!kit || !hits.length) return { query, kitId, kit, hits, q, variant: undefined, named: 0, svg: null, inline: false };
      const { variant, named } = pickVariant(hits[0].c, [...q.content, ...q.devices, ...q.states]);
      const svg = variant.node ? await loadDrawing(kit.id, drawingFile(variant.node)) : null;
      return { query, kitId, kit, hits, q, variant, named, svg: svg?.trim() || null, inline: false };
    }),
  );

  // The drawings that go into the reply itself, as many as fit; the others are given by address.
  // First the ones whose query names a variant ("4 tabs", "vertical"): the caller wants that drawing
  // and has no other way to it. Whole example screens last, and within each group the smallest first.
  let pool = maxChars - HEADER_ROOM * queries.length;
  const inReply = new Set<string>();
  const rank = (f: (typeof found)[number]) => (f.hits[0].c.page === "Examples" ? 2 : f.named ? 0 : 1);
  for (const f of found.filter((x) => x.svg).sort((a, b) => rank(a) - rank(b) || a.svg!.length - b.svg!.length)) {
    const key = `${f.kit!.id}/${f.variant!.node}`;
    if (inReply.has(key)) continue;
    if (f.svg!.length > pool) continue;
    pool -= f.svg!.length;
    inReply.add(key);
    f.inline = true;
  }

  const parts: string[] = [];
  const shown = new Set<string>();
  let matched = 0;
  let drawings = 0;
  let missingFiles = false;
  const undrawn: string[] = [];
  // What one query does not use is left for the ones after it.
  let left = maxChars - found.reduce((n, f) => n + (f.inline ? f.svg!.length : 0), 0);

  for (const [n, f] of found.entries()) {
    const { query, kit, hits, q } = f;
    parts.push(`## "${query}"`);
    if (!kit) {
      parts.push(`The ${f.kitId} kit is not loaded. Loaded: ${pack.kits.map((k) => `${k.id} (${k.name})`).join(", ")}.`);
      continue;
    }
    if (!hits.length || !f.variant) {
      parts.push(
        `No component of the ${kit.name} kit matches. Its pages: ${kit.pages.filter((p) => !p.startsWith("_")).join(", ")}. ` +
          "Call search_ui_kit without `queries` to list every component.",
      );
      continue;
    }
    matched++;
    const budget = new Budget(Math.floor(left / (queries.length - n)));
    // A small share of the reply gets shorter lists of other variants and other matches.
    const listed = budget.left < BRIEF_BELOW ? 3 : 8;
    const before = budget.left;
    const { c } = hits[0];
    const variant = f.variant;
    const all = await outlines(kit.id, c.id);
    const folder = `${origin}/ui-kit-svg/${kit.id}/`;
    const block: string[] = [`### ${c.name}`, ...header(kit, c), `Shown: ${variant.name || "the component"}, ${size(variant)} points.`];

    // Apple's drawing first: it is the component. A second query that shows the same variant points to the first.
    const drawingKey = `drawing/${kit.id}/${variant.node}`;
    let inlined = 0;
    if (f.svg) {
      drawings++;
      const address = folder + drawingFile(variant.node);
      if (shown.has(drawingKey)) block.push(`Apple's drawing of it is the one above, at ${address}.`);
      else if (f.inline) {
        block.push(`Apple's drawing of it, also at ${address}. Place it as it is; only change its icons and labels:`, "```svg\n" + f.svg + "\n```");
        inlined = f.svg.length;
      } else {
        const wanted = Math.ceil((f.svg.length + 2 * HEADER_ROOM) / 5000) * 5000;
        block.push(
          `Apple's drawing of it is at ${address}: ${Math.ceil(f.svg.length / 1000)} KB of SVG, more than this reply has room for. ` +
            "Show it by that address in an img" +
            (wanted <= 100000 ? `, or call again with this query alone and max_chars ${wanted} to get the SVG itself.` : "."),
        );
      }
      shown.add(drawingKey);
    } else undrawn.push(c.name);

    const others = c.variants.filter((v) => v !== variant);
    const otherVariants = !others.length
      ? null
      : `Other variants: ${others
          .slice(0, listed)
          .map((v) => `${v.name} (${size(v)}${f.svg && v.node ? `, ${drawingFile(v.node)}` : ""})`)
          .join("; ")}${others.length > listed ? `; and ${others.length - listed} more` : ""}. ` +
        (f.svg ? `Their drawings are in ${folder} under these file names. ` : "") +
        "Add a variant's words to the query to get it in full.";

    if (!all) {
      missingFiles = true;
      block.push(`Variant sizes: ${c.variants.slice(0, 12).map((v) => `${v.name || "default"} ${size(v)}`).join("; ")}.`);
    }
    if (otherVariants) block.push(otherVariants);
    // The drawing has its room already; the rest of the block comes out of the query's share.
    budget.left -= block.join("\n\n").length - inlined;

    // The outline of its layers: always without a drawing in the reply, else while there is room.
    let outlineShown = false;
    if (all) {
      const text = all[variant.outline] ?? "";
      const fenced = "```text\n" + text + "\n```";
      const at = otherVariants ? block.length - 1 : block.length;
      if (!inlined) {
        // Without a drawing in the reply the outline is what the caller builds from, so it stays,
        // cut to the query's share when it does not fit.
        const kept = budget.left >= fenced.length ? fenced : cutOutline(text, Math.max(budget.left, f.svg ? MIN_OUTLINE : 2 * MIN_OUTLINE));
        budget.left -= kept.length;
        block.splice(at, 0, f.svg ? "Its layers:" : "Its layers (no drawing of it is on this server):", kept);
        outlineShown = kept === fenced;
      } else if (budget.take(fenced)) {
        block.splice(at, 0, "Its layers, with the spacing, sizes, colors and text styles by Apple's names:", fenced);
        outlineShown = true;
      } else {
        block.splice(at, 0, "The outline of its layers is left out for size. Call again with this query alone to get it.");
      }
      if (outlineShown) shown.add(`${kit.id}/${c.id}/${variant.outline}`);
    }
    parts.push(...block);

    // The parts the shown variant is built from, two levels deep, while the reply has room.
    if (all && outlineShown) {
      const partBlocks: string[] = [];
      const queue: { text: string; owner: KitComponent; depth: number }[] = [{ text: all[variant.outline] ?? "", owner: c, depth: 0 }];
      const skipped: string[] = [];
      while (queue.length) {
        const item = queue.shift()!;
        for (const ref of instanceRefs(item.text)) {
          const target = kit.components.find((x) => (item.owner.uses ?? []).includes(x.id) && x.name === ref.name);
          if (!target) continue;
          const v = target.variants.find((x) => x.name === ref.variant) ?? defaultVariant(target);
          const key = `${kit.id}/${target.id}/${v.outline}`;
          if (shown.has(key)) continue;
          shown.add(key);
          const targetOutlines = await outlines(kit.id, target.id);
          const text = targetOutlines?.[v.outline];
          if (!text) continue;
          const title = `#### ${target.name}${v.name ? ` [${v.name}]` : ""}, ${size(v)}`;
          const taken = budget.take(`${title}\n\n\`\`\`text\n${text}\n\`\`\``);
          if (!taken) {
            shown.delete(key);
            skipped.push(target.name);
            continue;
          }
          partBlocks.push(taken);
          if (item.depth < 1) queue.push({ text, owner: target, depth: item.depth + 1 });
        }
      }
      if (partBlocks.length) parts.push(f.svg ? "Parts (already drawn inside the drawing above):" : "Parts:", ...partBlocks);
      if (skipped.length) parts.push(`Parts left out for size: ${[...new Set(skipped)].map((n) => `"${n}"`).join(", ")}. Pass a name as a query to get it.`);
    }

    const matches = listed === 8 ? 12 : 4;
    const more = hits.slice(1, 1 + matches).map((h) => `"${h.c.name}"${h.c.section ? ` (${h.c.section})` : ""}`);
    if (more.length) {
      parts.push(`Other matches: ${[...new Set(more)].join(", ")}${hits.length > 1 + matches ? `, and ${hits.length - 1 - matches} more` : ""}.`);
      budget.left -= parts[parts.length - 1].length;
    }
    left -= before - budget.left;
  }

  if (drawings) parts.push(DRAWING + (found.some((f) => f.svg && /<image\b[^>]*\shref="http/.test(f.svg)) ? PICTURES : ""));
  if (matched) parts.push(LEGEND);
  if (undrawn.length && drawings) parts.push(`No drawing is on this server for ${[...new Set(undrawn)].map((n) => `"${n}"`).join(", ")}; build ${undrawn.length > 1 ? "them" : "it"} from the outline.`);
  else if (undrawn.length) parts.push("Apple's drawings of these components are not on this server, so each is given as an outline of its layers to build from.");
  if (missingFiles) parts.push("The outline files are not deployed on this server, so only names, properties and sizes are given.");
  parts.push(source);
  return { text: parts.join("\n\n"), ok: matched > 0 };
}

/** The components an outline's instance layers point to, with the variant each one uses. */
function instanceRefs(outline: string): { name: string; variant: string }[] {
  const out: { name: string; variant: string }[] = [];
  const seen = new Set<string>();
  for (const m of outline.matchAll(/instance of ([^;\n]+?)(?: \[([^\]\n]*)\])?(?:;|$)/gm)) {
    const key = `${m[1]}|${m[2] ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: m[1], variant: m[2] ?? "" });
  }
  return out;
}

/** Every published component of a kit, by page. */
function listing(kitId: KitId): string {
  const kit = pack.kits.find((k) => k.id === kitId);
  if (!kit) return `The ${kitId} kit is not loaded. Loaded: ${pack.kits.map((k) => k.id).join(", ")}.`;
  const lines = [`## ${kit.name} kit: components by page`];
  for (const page of kit.pages) {
    const names = kit.components
      .filter((c) => c.page === page && !c.helper)
      .map((c) => `${c.name}${c.section ? ` (${c.section})` : ""}${c.variants.length > 1 ? ` [${c.variants.length} variants]` : ""}`);
    if (names.length) lines.push(`- **${page}**: ${[...new Set(names)].join("; ")}`);
  }
  const others = pack.kits.filter((k) => k.id !== kit.id).map((k) => `"${k.id}" (${k.name})`);
  lines.push(
    "",
    "Call search_ui_kit with `queries`, such as [\"tab bar\", \"alert\"], to get Apple's drawing of a component with its layers, sizes, layout and colors. " +
      "The \"Examples\" page holds whole screens built from the components." +
      (others.length ? ` Other kits: ${others.join(", ")}.` : ""),
  );
  return lines.join("\n");
}

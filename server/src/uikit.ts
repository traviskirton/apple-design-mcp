// UI kit lookup: the components of Apple's UI kits for Figma (iOS and iPadOS, macOS, watchOS),
// each as an outline of its layers with sizes, layout, colours and text styles.
import pack from "./pack/ui-kit.js";
import type { Kit, KitComponent, KitVariant } from "./pack/ui-kit.js";

export const uiKitPack = pack;
export const KIT_IDS = ["ios", "macos", "watchos"] as const;
export type KitId = (typeof KIT_IDS)[number];

/** Loads the outlines of one component: the blocks of "ui-kit/<kit>/<id>.txt", or null when the file is missing. */
export type OutlineLoader = (kit: string, id: string) => Promise<string | null>;

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
};
const KIT_WORDS: Record<string, KitId> = { mac: "macos", macos: "macos", watch: "watchos", watchos: "watchos", ios: "ios", ipados: "ios" };
const DEVICE_WORDS = new Set(["iphone", "ipad", "duo"]);
const NOISE = new Set(["the", "a", "an", "for", "of", "in", "on", "with", "and", "apple", "component", "ui", "kit"]);
// Names from earlier systems and other toolkits, per kit. watchOS still has navigation bars, so it keeps the words.
const BARS: [RegExp, string][] = [
  [/\b(navigation|nav) bar\b|\bnavbar\b/, "toolbar top"],
  [/\bbottom bar\b/, "toolbar bottom"],
  [/\bshare sheet\b/, "activity view"],
  [/\bsearch bar\b/, "search field"],
];
const PHRASES: Record<string, [RegExp, string][]> = { ios: BARS, macos: BARS, watchos: [] };

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
  if (matched < q.content.length) total = total * 0.2 * (matched / q.content.length);

  // The page named exactly after the query holds the standard component: "button" means the "Buttons" page.
  if (matched === q.content.length && e.page.length === q.content.length && e.page.every((w) => q.content.some((c) => wordMatch(c, w)))) total += 2;

  const own = [...e.name, ...e.place];
  for (const d of q.devices) total += own.includes(d) ? 4 : 0;
  if (q.devices.length) {
    const other = [...DEVICE_WORDS].filter((d) => !q.devices.includes(d) && e.name.includes(d));
    total -= 3 * other.length;
  } else if (e.name.includes("ipad") || e.name.includes("duo")) total -= 0.5;
  else if (e.name.includes("iphone")) total += 0.5;

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
  const content = rest.filter((w) => !NOISE.has(w) && !DEVICE_WORDS.has(w) && !["example", "screen", "template"].includes(w));
  return { kit, named, q: { content: content.length ? content : rest.filter((w) => !DEVICE_WORDS.has(w)), devices: rest.filter((w) => DEVICE_WORDS.has(w)), examples } };
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
  return { kit: parsed.kit, hits, q: parsed.q };
}

// ---------- variants ----------

/** The variant Figma shows first: the one holding the first value of every variant property. */
function defaultVariant(c: KitComponent): KitVariant {
  const first = (c.variant_props ?? []).map((p) => `${p.name}=${p.values[0]}`);
  const parts = (v: KitVariant) => v.name.split(", ");
  let bestV = c.variants[0];
  let bestN = -1;
  for (const v of c.variants) {
    const n = first.filter((f) => parts(v).includes(f)).length;
    if (n > bestN) [bestV, bestN] = [v, n];
  }
  return bestV;
}

/** The variant a query asks for ("large destructive button"), else the default one. */
function pickVariant(c: KitComponent, queryWords: string[]): KitVariant {
  const fallback = defaultVariant(c);
  if (c.variants.length < 2) return fallback;
  const nameWords = new Set(words(c.name));
  const extra = queryWords.filter((w) => !nameWords.has(w));
  if (!extra.length) return fallback;
  let bestV = fallback;
  let bestN = 0;
  for (const v of c.variants) {
    const valueWords = words(v.name.split(", ").map((p) => p.split("=")[1] ?? "").join(" "));
    const n = extra.filter((w) => valueWords.includes(w)).length;
    if (n > bestN) [bestV, bestN] = [v, n];
  }
  return bestV;
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

/**
 * The components that best match each query, with the outline of the variant asked for and of
 * the parts it is built from. Without queries: the list of every published component of the kit.
 */
export async function searchUiKit(
  queries: string[],
  asked: KitId | undefined,
  maxChars: number,
  load: OutlineLoader,
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

  const parts: string[] = [];
  const shown = new Set<string>();
  let found = 0;
  let missingFiles = false;
  // What one query does not use is left for the ones after it.
  let left = maxChars;

  for (const [n, query] of queries.entries()) {
    const { kit: kitId, hits, q } = findComponents(query, asked);
    const kit = pack.kits.find((k) => k.id === kitId);
    parts.push(`## "${query}"`);
    if (!kit) {
      parts.push(`The ${kitId} kit is not loaded. Loaded: ${pack.kits.map((k) => `${k.id} (${k.name})`).join(", ")}.`);
      continue;
    }
    if (!hits.length) {
      parts.push(
        `No component of the ${kit.name} kit matches. Its pages: ${kit.pages.filter((p) => !p.startsWith("_")).join(", ")}. ` +
          "Call search_ui_kit without `queries` to list every component.",
      );
      continue;
    }
    found++;
    const budget = new Budget(Math.floor(left / (queries.length - n)));
    const before = budget.left;
    const queryWords = [...q.content, ...q.devices];
    const { c } = hits[0];
    const variant = pickVariant(c, queryWords);
    const all = await outlines(kit.id, c.id);
    const block: string[] = [`### ${c.name}`, ...header(kit, c)];
    if (!all) {
      missingFiles = true;
      block.push(`Variant sizes: ${c.variants.slice(0, 12).map((v) => `${v.name || "default"} ${size(v)}`).join("; ")}.`);
    } else {
      const text = all[variant.outline] ?? "";
      block.push(`Shown: ${variant.name || "the component"}, ${size(variant)}.`, "```text\n" + text + "\n```");
      shown.add(`${kit.id}/${c.id}/${variant.outline}`);
      const others = c.variants.filter((v) => v !== variant);
      if (others.length) {
        block.push(
          `Other variants: ${others.slice(0, 8).map((v) => `${v.name} (${size(v)})`).join("; ")}` +
            `${others.length > 8 ? `; and ${others.length - 8} more` : ""}. Add a variant's words to the query to get its outline.`,
        );
      }
    }
    budget.left -= block.join("\n\n").length;
    parts.push(...block);

    // The parts the shown variant is built from, two levels deep, while the reply has room.
    if (all) {
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
      if (partBlocks.length) parts.push("Parts:", ...partBlocks);
      if (skipped.length) parts.push(`Parts left out for size: ${[...new Set(skipped)].map((n) => `"${n}"`).join(", ")}. Pass a name as a query to get it.`);
    }

    const more = hits.slice(1, 13).map((h) => `"${h.c.name}"${h.c.section ? ` (${h.c.section})` : ""}`);
    if (more.length) {
      parts.push(`Other matches: ${[...new Set(more)].join(", ")}${hits.length > 13 ? `, and ${hits.length - 13} more` : ""}.`);
      budget.left -= parts[parts.length - 1].length;
    }
    left -= before - budget.left;
  }

  if (found) parts.push(LEGEND);
  if (missingFiles) parts.push("The outline files are not deployed on this server, so only names, properties and sizes are given.");
  parts.push(source);
  return { text: parts.join("\n\n"), ok: found > 0 };
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
    "Call search_ui_kit with `queries`, such as [\"tab bar\", \"alert\"], to get a component's layers, sizes, layout and colors. " +
      "The \"Examples\" page holds whole screens built from the components." +
      (others.length ? ` Other kits: ${others.join(", ")}.` : ""),
  );
  return lines.join("\n");
}

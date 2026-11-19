// Search over the SF Symbols pack. Names and search data are loaded with the Worker;
// shapes are read through `loadShape`: the regular weight one file per symbol, the other weights
// from shards that each hold many symbols (the Worker may hold at most 20,000 static files).
import prebuilt from "./pack/symbol-index.js";
import pack from "./pack/symbols.js";
import type { SymbolEntry } from "./pack/symbols.js";
import { buildIndex, decodeIndex, singular, stem, tokens } from "./symbol-words.js";

export const symbolPack = pack;

/** The weights of SF Symbols, lightest first. */
export const WEIGHTS = ["ultralight", "thin", "light", "regular", "medium", "semibold", "bold", "heavy", "black"] as const;
export type Weight = (typeof WEIGHTS)[number];

/** Reads a symbol's SVG in a weight, or null when that shape is not deployed. */
export type ShapeLoader = (name: string, weight: Weight) => Promise<string | null>;

/** Shards per weight. The extractor (extract-symbols --weights) and scripts/symbol-shapes.mjs use the same. */
const SHARDS = 256;

/** The shard that holds a symbol's other weights: FNV-1a of its name's UTF-8 bytes, as two hex digits. */
export function shardOf(name: string): string {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(name)) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h % SHARDS).toString(16).padStart(2, "0");
}

/** The SVG of `name` in a shard's text, which holds one symbol per line: name, a tab, its SVG. */
export function fromShard(text: string, name: string): string | null {
  const key = name + "\t";
  const found = text.startsWith(key) ? 0 : text.indexOf("\n" + key) + 1;
  if (found === 0 && !text.startsWith(key)) return null;
  const at = found;
  const end = text.indexOf("\n", at);
  return text.slice(at + key.length, end < 0 ? undefined : end);
}

/** A symbol's shape in `weight`, or in the regular weight when that one is not deployed. */
async function shapeIn(load: ShapeLoader, name: string, weight: Weight): Promise<{ svg: string | null; weight: Weight }> {
  const svg = await load(name, weight);
  if (svg || weight === "regular") return { svg, weight };
  return { svg: await load(name, "regular"), weight: "regular" };
}

// Words people use for an icon that SF Symbols names differently. Each word also finds symbols
// whose name holds all the parts of one of these names.
const SYNONYMS: Record<string, string[]> = {
  off: ["slash"], disable: ["slash"], disabled: ["slash"], block: ["slash"], hidden: ["eye.slash", "slash"], hide: ["eye.slash"],
  mute: ["speaker.slash", "mic.slash"], muted: ["speaker.slash", "mic.slash"], show: ["eye"], visible: ["eye"],
  add: ["plus"], new: ["plus"], create: ["plus"],
  remove: ["minus", "xmark"], delete: ["trash", "xmark"], close: ["xmark"], cancel: ["xmark"], dismiss: ["xmark"],
  back: ["chevron.left", "chevron.backward", "arrow.left"], previous: ["chevron.left", "backward"], next: ["chevron.right", "forward"],
  search: ["magnifyingglass"], find: ["magnifyingglass"], zoom: ["magnifyingglass"],
  edit: ["pencil"], write: ["pencil"], compose: ["square.and.pencil", "pencil"],
  setting: ["gear", "gearshape"], preference: ["gear", "gearshape"],
  done: ["checkmark"], ok: ["checkmark"], confirm: ["checkmark"], complete: ["checkmark"], success: ["checkmark.circle", "checkmark"],
  error: ["exclamationmark", "xmark.circle"], warning: ["exclamationmark.triangle", "exclamationmark"], alert: ["exclamationmark", "bell"],
  home: ["house"], user: ["person"], profile: ["person"], account: ["person"], contact: ["person"], people: ["person.2", "person.3"],
  image: ["photo"], picture: ["photo"], chat: ["bubble", "message"], comment: ["bubble"],
  favorite: ["heart", "star"], like: ["heart", "hand.thumbsup"], love: ["heart"], dislike: ["hand.thumbsdown"],
  info: ["info"], help: ["questionmark"], question: ["questionmark"],
  notification: ["bell"], email: ["envelope"], mail: ["envelope"], call: ["phone"], send: ["paperplane"],
  share: ["square.and.arrow.up"], save: ["bookmark", "square.and.arrow.down"], download: ["arrow.down"], upload: ["arrow.up"],
  refresh: ["arrow.clockwise"], reload: ["arrow.clockwise"], sync: ["arrow.triangle.2.circlepath"],
  undo: ["arrow.uturn.backward"], redo: ["arrow.uturn.forward"],
  menu: ["line.3.horizontal", "ellipsis"], more: ["ellipsis"], filter: ["line.3.horizontal.decrease"], sort: ["arrow.up.arrow.down"],
  location: ["location", "mappin"], time: ["clock"], date: ["calendar"], schedule: ["calendar"],
  recipe: ["fork.knife", "book"], food: ["fork.knife"], restaurant: ["fork.knife"],
  shop: ["cart", "bag"], store: ["cart", "bag", "storefront"], buy: ["cart"], pay: ["creditcard"], money: ["dollarsign"],
  copy: ["document.on.document", "doc.on.doc"], paste: ["clipboard"], attach: ["paperclip"], attachment: ["paperclip"],
  file: ["document", "doc"], list: ["list.bullet"], grid: ["square.grid.2x2"], chart: ["chart.bar"], stats: ["chart.bar"],
  password: ["key", "lock"], secure: ["lock"], unlock: ["lock.open"], logout: ["rectangle.portrait.and.arrow.right"],
  dark: ["moon"], light: ["sun.max", "lightbulb"], brightness: ["sun.max"], language: ["globe"], world: ["globe"], web: ["globe", "safari"],
  music: ["music.note"], sound: ["speaker.wave.2"], volume: ["speaker.wave.2"], record: ["record.circle", "mic"], print: ["printer"],
  expand: ["arrow.up.left.and.arrow.down.right"], collapse: ["arrow.down.right.and.arrow.up.left"], fullscreen: ["arrow.up.left.and.arrow.down.right"],
};

// The word index. scripts/build-symbol-index.mjs writes it ahead of time; if it was built from
// another copy of the symbol pack, it is built here instead, which takes longer at startup.
const index = prebuilt.pack_generated_at === pack.generated_at ? decodeIndex(prebuilt) : buildIndex(pack);
const byPart = index.part;
const byStem = index.stem;
const byKeyword = index.keyword;
const byCategory = index.category;
// The parts of each symbol's name, worked out when a search first needs them.
const partCache: (string[] | undefined)[] = [];
const partsOf = (at: number) => (partCache[at] ??= tokens(pack.symbols[at].name).map(singular));
const synonyms = new Map(Object.entries(SYNONYMS).map(([word, names]) => [singular(word), names.map((n) => tokens(n).map(singular))]));
const byName = new Map(pack.symbols.map((entry, at) => [entry.name, at]));

/** The symbol with this name, following Apple's renames. */
export function findSymbol(name: string): SymbolEntry | undefined {
  const key = name.trim().toLowerCase().replace(/\s+/g, ".");
  const at = byName.get(key) ?? byName.get(pack.aliases[key] ?? "");
  return at === undefined ? undefined : pack.symbols[at];
}

/** Symbols whose name holds every one of these parts. */
function withAll(names: string[]): number[] {
  const lists = names.map((p) => byPart.get(p) ?? []).sort((a, b) => a.length - b.length);
  const rest = lists.slice(1).map((l) => new Set(l));
  return (lists[0] ?? []).filter((at) => rest.every((set) => set.has(at)));
}

/**
 * Best matches first. A word scores by how it matches a symbol: a synonym (11), a part of the name
 * (10), a looser form of a name part (6), one of Apple's keywords (4) or the category (1).
 * Symbols that match every word win; when none does, the ones that match the most words are returned.
 */
export function searchSymbols(query: string, limit: number): SymbolEntry[] {
  const want = [...new Set(tokens(query).map(singular))];
  if (!want.length) return [];
  const score = new Map<number, number>();
  const matched = new Map<number, number>();
  for (const w of want) {
    const best = new Map<number, number>();
    const give = (list: number[] | undefined, points: number, first?: string) => {
      for (const at of list ?? []) {
        // A symbol named after the word ("star.fill") beats one that mentions it ("moon.stars").
        const p = points + (first !== undefined && partsOf(at)[0] === first ? 1 : 0);
        if (p > (best.get(at) ?? 0)) best.set(at, p);
      }
    };
    give(byPart.get(w), 10, w);
    for (const names of synonyms.get(w) ?? []) give(withAll(names), 11, names[0]);
    give(byStem.get(stem(w)), 6);
    give(byKeyword.get(stem(w)), 4);
    give(byCategory.get(stem(w)), 1);
    for (const [at, p] of best) {
      score.set(at, (score.get(at) ?? 0) + p);
      matched.set(at, (matched.get(at) ?? 0) + 1);
    }
  }
  const exact = findSymbol(query);
  if (exact) {
    const at = byName.get(exact.name)!;
    score.set(at, (score.get(at) ?? 0) + 100);
    matched.set(at, want.length);
  }
  const most = Math.max(0, ...matched.values());
  const ranked: [number, number][] = [];
  for (const [at, n] of matched) {
    if (n !== most) continue;
    // Plain symbols before their variants: "heart", then "heart.fill", then "heart.circle".
    const extra = partsOf(at).reduce((sum, p) => sum + (p === "fill" ? 0.1 : 0.5), 0) - 0.5 * n;
    ranked.push([at, score.get(at)! - Math.max(0, extra)]);
  }
  ranked.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  return ranked.slice(0, limit).map(([at]) => pack.symbols[at]);
}

function since(entry: SymbolEntry): string {
  const release = entry.year ? pack.releases[entry.year] : undefined;
  if (!release) return "";
  return ["iOS", "macOS", "watchOS", "tvOS", "visionOS"]
    .filter((os) => release[os])
    .map((os) => `${os} ${release[os]}`)
    .join(", ");
}

const use = (weight: Weight) =>
  `Each SVG is the ${weight} weight, drawn with \`fill="currentColor"\`: set the CSS \`color\` to tint it and set ` +
  "`width` or `height` to size it (keep the viewBox). Match the weight of the text beside an icon (pass `weight`). " +
  "In SwiftUI use `Image(systemName:)` with the name" + (weight === "regular" ? " instead." : ` and \`.fontWeight(.${weight === "ultralight" ? "ultraLight" : weight})\` instead.`);

function describe(entry: SymbolEntry, svg: string | null | undefined, origin: string, got: Weight = "regular", asked: Weight = got): string {
  const lines = [`### ${entry.name}`];
  const facts = [since(entry) && `Available from ${since(entry)}.`, entry.restriction && `Apple's restriction: ${entry.restriction}`];
  const text = facts.filter(Boolean).join(" ");
  if (text) lines.push(text);
  if (svg && got !== asked) lines.push(`The ${asked} weight of this symbol is not on this server; this is the regular weight.`);
  if (svg) lines.push("```svg\n" + svg.trim() + "\n```", `Also at ${origin}/symbols/${got === "regular" ? "" : got + "/"}${entry.name}.svg`);
  else if (svg === null) lines.push("Its shape is not loaded on this server; use the name only.");
  return lines.join("\n\n");
}

/**
 * For each query, the matching symbol names, with the SVG of the first `withSvg` matches.
 */
export async function lookupSymbols(queries: string[], limit: number, withSvg: number, load: ShapeLoader, origin: string, weight: Weight = "regular"): Promise<string> {
  const parts: string[] = [];
  let shapes = 0;
  let inWeight = false;
  for (const query of queries) {
    const hits = searchSymbols(query, limit);
    if (!hits.length) {
      parts.push(`## "${query}"\n\nNo symbol matches. Try fewer or different words, such as the object's name.`);
      continue;
    }
    const top = hits.slice(0, withSvg);
    const svgs = await Promise.all(top.map((e) => shapeIn(load, e.name, weight)));
    shapes += svgs.filter((s) => s.svg).length;
    inWeight ||= svgs.some((s) => s.svg && s.weight === weight);
    const rest = hits.slice(top.length).map((e) => `\`${e.name}\``);
    parts.push(
      [
        `## "${query}"`,
        ...top.map((e, i) => describe(e, svgs[i].svg, origin, svgs[i].weight, weight)),
        ...(rest.length ? [`Other matches (get their shapes with get_symbol): ${rest.join(", ")}`] : []),
      ].join("\n\n"),
    );
  }
  if (shapes) parts.push(use(inWeight ? weight : "regular"));
  parts.push(`Source: ${pack.source.name} ${pack.source.version}, ${pack.source.symbols} symbols.`);
  return parts.join("\n\n");
}

/** The SVG of each named symbol. */
export async function readSymbols(names: string[], load: ShapeLoader, origin: string, weight: Weight = "regular"): Promise<{ text: string; ok: boolean }> {
  const parts: string[] = [];
  let found = 0;
  const entries = names.map((n) => findSymbol(n));
  const svgs = await Promise.all(entries.map((e) => (e ? shapeIn(load, e.name, weight) : null)));
  names.forEach((name, i) => {
    const entry = entries[i];
    if (!entry) {
      const close = searchSymbols(name, 5).map((e) => `\`${e.name}\``);
      parts.push(`### ${name}\n\nThere is no symbol with this name.` + (close.length ? ` Closest: ${close.join(", ")}.` : " Find names with search_symbols."));
      return;
    }
    found++;
    const renamed = entry.name !== name.trim().toLowerCase() ? `\n\n"${name}" is now named \`${entry.name}\`.` : "";
    parts.push(describe(entry, svgs[i]!.svg, origin, svgs[i]!.weight, weight) + renamed);
  });
  if (svgs.some((s) => s?.svg)) parts.push(use(svgs.some((s) => s?.svg && s.weight === weight) ? weight : "regular"));
  parts.push(`Source: ${pack.source.name} ${pack.source.version}.`);
  return { text: parts.join("\n\n"), ok: found > 0 };
}

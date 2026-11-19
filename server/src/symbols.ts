// Search over the SF Symbols pack. Names and search data are loaded with the Worker;
// shapes are read one file per symbol through `loadShape`.
import prebuilt from "./pack/symbol-index.js";
import pack from "./pack/symbols.js";
import type { SymbolEntry } from "./pack/symbols.js";
import { buildIndex, decodeIndex, singular, stem, tokens } from "./symbol-words.js";

export const symbolPack = pack;

/** Reads a symbol's SVG, or null when the shape is not deployed. */
export type ShapeLoader = (name: string) => Promise<string | null>;

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

const USE =
  "Each SVG is the regular weight, drawn with `fill=\"currentColor\"`: set the CSS `color` to tint it and set " +
  "`width` or `height` to size it (keep the viewBox). In SwiftUI use `Image(systemName:)` with the name instead.";

function describe(entry: SymbolEntry, svg: string | null | undefined, origin: string): string {
  const lines = [`### ${entry.name}`];
  const facts = [since(entry) && `Available from ${since(entry)}.`, entry.restriction && `Apple's restriction: ${entry.restriction}`];
  const text = facts.filter(Boolean).join(" ");
  if (text) lines.push(text);
  if (svg) lines.push("```svg\n" + svg.trim() + "\n```", `Also at ${origin}/symbols/${entry.name}.svg`);
  else if (svg === null) lines.push("Its shape is not loaded on this server; use the name only.");
  return lines.join("\n\n");
}

/**
 * For each query, the matching symbol names, with the SVG of the first `withSvg` matches.
 */
export async function lookupSymbols(queries: string[], limit: number, withSvg: number, load: ShapeLoader, origin: string): Promise<string> {
  const parts: string[] = [];
  let shapes = 0;
  for (const query of queries) {
    const hits = searchSymbols(query, limit);
    if (!hits.length) {
      parts.push(`## "${query}"\n\nNo symbol matches. Try fewer or different words, such as the object's name.`);
      continue;
    }
    const top = hits.slice(0, withSvg);
    const svgs = await Promise.all(top.map((e) => load(e.name)));
    shapes += svgs.filter(Boolean).length;
    const rest = hits.slice(top.length).map((e) => `\`${e.name}\``);
    parts.push(
      [
        `## "${query}"`,
        ...top.map((e, i) => describe(e, svgs[i], origin)),
        ...(rest.length ? [`Other matches (get their shapes with get_symbol): ${rest.join(", ")}`] : []),
      ].join("\n\n"),
    );
  }
  if (shapes) parts.push(USE);
  parts.push(`Source: ${pack.source.name} ${pack.source.version}, ${pack.source.symbols} symbols.`);
  return parts.join("\n\n");
}

/** The SVG of each named symbol. */
export async function readSymbols(names: string[], load: ShapeLoader, origin: string): Promise<{ text: string; ok: boolean }> {
  const parts: string[] = [];
  let found = 0;
  const entries = names.map((n) => findSymbol(n));
  const svgs = await Promise.all(entries.map((e) => (e ? load(e.name) : null)));
  names.forEach((name, i) => {
    const entry = entries[i];
    if (!entry) {
      const close = searchSymbols(name, 5).map((e) => `\`${e.name}\``);
      parts.push(`### ${name}\n\nThere is no symbol with this name.` + (close.length ? ` Closest: ${close.join(", ")}.` : " Find names with search_symbols."));
      return;
    }
    found++;
    const renamed = entry.name !== name.trim().toLowerCase() ? `\n\n"${name}" is now named \`${entry.name}\`.` : "";
    parts.push(describe(entry, svgs[i], origin) + renamed);
  });
  if (svgs.some(Boolean)) parts.push(USE);
  parts.push(`Source: ${pack.source.name} ${pack.source.version}.`);
  return { text: parts.join("\n\n"), ok: found > 0 };
}

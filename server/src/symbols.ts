// Search over the SF Symbols pack. Names and search data are loaded with the Worker;
// shapes are read one file per symbol through `loadShape`.
import pack from "./pack/symbols.js";
import type { SymbolEntry } from "./pack/symbols.js";

export const symbolPack = pack;

/** Reads a symbol's SVG, or null when the shape is not deployed. */
export type ShapeLoader = (name: string) => Promise<string | null>;

// "arrow.up.circle.fill" and "Arrow up, circle" both become ["arrow", "up", "circle", ...].
const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
// Plurals and "-ing" forms read the same: "folders" finds "folder", "sharing" finds "share".
const stem = (w: string) => (w.length > 4 ? w.replace(/(ies)$/, "y").replace(/(ing|es|s|e)$/, "") : w);

interface Indexed {
  entry: SymbolEntry;
  order: number;
  nameParts: Set<string>;
  keywordParts: Set<string>;
  categoryParts: Set<string>;
}

// Words people use for an icon that SF Symbols names differently. Each word also matches these name parts.
const SYNONYMS: Record<string, string[]> = {
  off: ["slash"], disable: ["slash"], disabled: ["slash"], mute: ["speaker.slash", "mic.slash"], muted: ["speaker.slash", "mic.slash"], block: ["slash"], hidden: ["slash"],
  add: ["plus"], new: ["plus"], create: ["plus"],
  remove: ["minus", "xmark"], delete: ["trash", "xmark"], close: ["xmark"], cancel: ["xmark"], dismiss: ["xmark"],
  search: ["magnifyingglass"], find: ["magnifyingglass"], zoom: ["magnifyingglass"],
  edit: ["pencil"], write: ["pencil"], compose: ["pencil"],
  setting: ["gear", "gearshape"], preference: ["gear", "gearshape"], option: ["gear", "gearshape", "slider"],
  done: ["checkmark"], ok: ["checkmark"], confirm: ["checkmark"], complete: ["checkmark"],
  home: ["house"], user: ["person"], profile: ["person"], account: ["person"], contact: ["person"],
  image: ["photo"], picture: ["photo"], chat: ["bubble", "message"], comment: ["bubble"],
  favorite: ["heart", "star"], like: ["heart", "hand.thumbsup"], love: ["heart"],
  info: ["info"], help: ["questionmark"], warning: ["exclamationmark"], alert: ["exclamationmark", "bell"],
  notification: ["bell"], email: ["envelope"], mail: ["envelope"], call: ["phone"], download: ["arrow.down"],
  upload: ["arrow.up"], refresh: ["arrow.clockwise"], reload: ["arrow.clockwise"], menu: ["line.3.horizontal", "ellipsis"],
  more: ["ellipsis"], filter: ["line.3.horizontal.decrease"], sort: ["arrow.up.arrow.down"], location: ["location", "mappin"],
};
const synonymParts = new Map(
  Object.entries(SYNONYMS).map(([word, alts]) => [stem(word), alts.map((alt) => tokens(alt).map(stem))]),
);

const indexed: Indexed[] =pack.symbols.map((entry, order) => ({
  entry,
  order,
  nameParts: new Set(tokens(entry.name).map(stem)),
  keywordParts: new Set((entry.keywords ?? []).flatMap(tokens).map(stem)),
  categoryParts: new Set((entry.categories ?? []).flatMap((i) => tokens(pack.categories[i]?.label ?? "")).map(stem)),
}));
const byName = new Map(indexed.map((s) => [s.entry.name, s]));

/** The symbol with this name, following Apple's renames. */
export function findSymbol(name: string): SymbolEntry | undefined {
  const key = name.trim().toLowerCase().replace(/\s+/g, ".");
  return (byName.get(key) ?? byName.get(pack.aliases[key] ?? ""))?.entry;
}

/**
 * Best matches first. A symbol matches a word through its name, Apple's keywords or its category.
 * Symbols that match every word win; when none does, the ones that match the most words are returned.
 */
export function searchSymbols(query: string, limit: number): SymbolEntry[] {
  const want = [...new Set(tokens(query).map(stem))];
  if (!want.length) return [];
  const exact = findSymbol(query);
  const scored: { s: Indexed; matched: number; score: number }[] = [];
  for (const s of indexed) {
    let score = 0;
    let matched = 0;
    for (const w of want) {
      if (s.nameParts.has(w)) score += 10;
      else if (synonymParts.get(w)?.some((alt) => alt.every((p) => s.nameParts.has(p)))) score += 8;
      else if (s.keywordParts.has(w)) score += 4;
      else if (s.categoryParts.has(w)) score += 1;
      else continue;
      matched++;
    }
    if (!matched && s.entry !== exact) continue;
    // Plain symbols before their variants: "heart" before "heart.circle.fill".
    score -= Math.max(0, s.nameParts.size - matched) * 0.5;
    if (s.entry === exact) score += 100;
    scored.push({ s, matched: s.entry === exact ? want.length : matched, score });
  }
  const most = Math.max(0, ...scored.map((x) => x.matched));
  return scored
    .filter((x) => x.matched === most)
    .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
    .slice(0, limit)
    .map(({ s }) => s.entry);
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

// How symbol search reads words, and the word index it searches. Shared by the Worker
// (src/symbols.ts) and by scripts/build-symbol-index.mjs, which writes the index ahead of time
// into src/pack/symbol-index.js so the Worker does not build it at startup.

/** The part of the symbol pack the index is built from. */
export interface IndexSource {
  generated_at: string;
  categories: { label: string }[];
  symbols: { name: string; keywords?: string[]; categories?: number[] }[];
}

// "arrow.up.circle.fill" and "Arrow up, circle" both become ["arrow", "up", "circle", ...].
export const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
// Plurals read the same: "folders" finds "folder", "glasses" finds "glass".
export const singular = (w: string) =>
  w.length > 3 && !/(ss|us|is)$/.test(w) ? w.replace(/ies$/, "y").replace(/(s|x|ch|sh)es$/, "$1").replace(/s$/, "") : w;
// A looser form that also drops "-ing", "-ed" and a final "e": "sharing" finds "share".
export const stem = (w: string) => {
  const base = singular(w);
  return base.length > 4 ? base.replace(/(ing|ed|e)$/, "") : base;
};

/** For each word, the positions of the symbols that hold it, in ascending order. */
export interface Lookup {
  get(word: string): number[] | undefined;
}

export interface WordIndex<T extends Lookup = Lookup> {
  /** A part of the name, as written (singular). */
  part: T;
  /** A part of the name, loosely. */
  stem: T;
  keyword: T;
  category: T;
}

export function buildIndex(pack: IndexSource): WordIndex<Map<string, number[]>> {
  const index: WordIndex<Map<string, number[]>> = { part: new Map(), stem: new Map(), keyword: new Map(), category: new Map() };
  const post = (map: Map<string, number[]>, word: string, at: number) => {
    const list = map.get(word);
    if (!list) map.set(word, [at]);
    else if (list[list.length - 1] !== at) list.push(at);
  };
  pack.symbols.forEach((entry, at) => {
    for (const p of tokens(entry.name).map(singular)) {
      post(index.part, p, at);
      post(index.stem, stem(p), at);
    }
    for (const w of (entry.keywords ?? []).flatMap(tokens)) post(index.keyword, stem(w), at);
    for (const i of entry.categories ?? []) for (const w of tokens(pack.categories[i]?.label ?? "")) post(index.category, stem(w), at);
  });
  return index;
}

/** The index as written to src/pack/symbol-index.js: each word's positions as base-36 gaps, comma-separated. */
export interface EncodedIndex {
  /** The `generated_at` of the symbol pack the index was built from. */
  pack_generated_at: string;
  part: Record<string, string>;
  stem: Record<string, string>;
  keyword: Record<string, string>;
  category: Record<string, string>;
}

const KINDS = ["part", "stem", "keyword", "category"] as const;

export function encodeIndex(index: WordIndex<Map<string, number[]>>, packGeneratedAt: string): EncodedIndex {
  const encode = (list: number[]) => list.map((v, i) => (i ? v - list[i - 1] : v).toString(36)).join(",");
  const out = { pack_generated_at: packGeneratedAt } as EncodedIndex;
  for (const kind of KINDS) out[kind] = Object.fromEntries([...index[kind]].map(([w, list]) => [w, encode(list)]));
  return out;
}

/** Reads an encoded index; each word's list is decoded the first time it is looked up. */
export function decodeIndex(encoded: EncodedIndex): WordIndex {
  const lazy = (table: Record<string, string>): Lookup => {
    const cache = new Map<string, number[]>();
    return {
      get(word: string) {
        let list = cache.get(word);
        if (list) return list;
        const text = Object.prototype.hasOwnProperty.call(table, word) ? table[word] : undefined;
        if (text === undefined) return undefined;
        list = [];
        let v = 0;
        for (const gap of text.split(",")) list.push((v += parseInt(gap, 36)));
        cache.set(word, list);
        return list;
      },
    };
  };
  return { part: lazy(encoded.part), stem: lazy(encoded.stem), keyword: lazy(encoded.keyword), category: lazy(encoded.category) };
}

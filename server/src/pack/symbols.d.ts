// Shape of the SF Symbols pack (symbols.js, written by the extractor on a Mac).
// The pack holds names and search data only. Each symbol's shape is a separate file,
// assets/symbols/<name>.svg, deployed with the Worker as a static file.

export interface SymbolEntry {
  name: string;
  /** Year of the SF Symbols release that added it; `releases` maps it to OS versions. */
  year?: string;
  /** Indexes into `categories`. */
  categories?: number[];
  /** Apple's search keywords, where it gives any. */
  keywords?: string[];
  /** Apple's usage restriction, such as "only to refer to FaceTime". */
  restriction?: string;
}

export interface SymbolPack {
  pack_version: string;
  generated_at: string;
  source: { name: string; version: string; symbols: number; with_keywords: number; with_shapes: number };
  /** "2019" -> { iOS: "13.0", macOS: "10.15", ... } */
  releases: Record<string, Record<string, string>>;
  categories: { key: string; label: string }[];
  /** In the order the SF Symbols app lists them. */
  symbols: SymbolEntry[];
  /** Old name -> current name. */
  aliases: Record<string, string>;
}

declare const pack: SymbolPack;
export default pack;

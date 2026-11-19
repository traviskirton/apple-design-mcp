// Shape of the generated HIG pack (hig.js, written by scripts/build-hig-pack.mjs).

export interface HigSection {
  /** "best-practices", or "platform-considerations/ios" for a level 3 section. */
  id: string;
  title: string;
  level: 2 | 3;
  /** Markdown, without the section's own heading. */
  text: string;
}

export interface HigPage {
  id: string;
  title: string;
  abstract: string;
  url: string;
  category?: string;
  platforms?: string[];
  sections: HigSection[];
}

export interface HigPack {
  pack_version: string;
  generated_at: string;
  source: { name: string; url: string; pages: number; sections: number; sha256: string };
  pages: HigPage[];
  /** Sections are numbered in page order. `postings[word]` is pairs of section number, count. */
  index: { lengths: number[]; postings: Record<string, number[]> };
}

declare const pack: HigPack;
export default pack;

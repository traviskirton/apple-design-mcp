// Shape of the product bezel pack (bezels.js, written by scripts/build-bezel-pack.mjs on a Mac from
// Apple's product bezel downloads). The pictures themselves are static files at "bezels/<id>.png".

export interface Bezel {
  /** File name of the picture without ".png", such as "iphone-18-pro-black-portrait". */
  id: string;
  /** Apple's file name, such as "iPhone 18 Pro - Black - Portrait". */
  name: string;
  /** The download it came from, such as "iPhone-18". */
  set: string;
  /** The device, such as "iPhone 18 Pro" or "MacBook Air M5 13-inch". */
  model: string;
  /** The color of the device, with the band for a watch. */
  finish?: string;
  /** "Portrait", "Landscape", or a pose of a folding device such as "Inner Open Portrait". */
  pose?: string;
  /** Pixels. */
  width: number;
  height: number;
  bytes: number;
  /** The see-through screen areas in pixels from the picture's top-left corner, largest first. Measured from the picture. */
  screens?: { x: number; y: number; width: number; height: number }[];
}

export interface BezelPack {
  pack_version: string;
  generated_at: string;
  source: { name: string; url: string; sets: number; bezels: number };
  bezels: Bezel[];
}

declare const pack: BezelPack;
export default pack;

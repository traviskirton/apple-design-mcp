// Shape of the design values pack (design-values.js, written by scripts/build-design-values.mjs
// from Apple's UI kits for Figma).

export interface KitColor {
  /** Apple's group in the kit, such as "Labels" or "Backgrounds – Grouped". */
  group: string;
  /** Name inside the group, such as "Secondary". Empty when the group is the whole name. */
  name: string;
  /** "#rrggbb", or "#rrggbbaa" when the colour is partly transparent. */
  light: string;
  dark: string;
  /** With Increase Contrast turned on. Present only when either differs from the default. */
  light_contrast?: string;
  dark_contrast?: string;
  /** The system colour's name in UIKit (iOS) or AppKit (macOS), where the kit colour stands for one. */
  api?: string;
}

export interface KitTextStyle {
  /** Such as "Large Title". */
  name: string;
  /** Font weight of the plain style, such as "Regular". */
  weight: string;
  /** Points, at the default text size. */
  size: number;
  leading: number;
  /** Letter spacing in points. Absent when zero. */
  tracking?: number;
  /** Font weight of the emphasized style. */
  emphasized?: string;
}

export interface KitSizes {
  /** What each value is for: devices on iOS, control sizes on macOS. */
  columns: string[];
  rows: { name: string; values: number[] }[];
}

export interface KitMaterial {
  name: string;
  /** Paint layers from the bottom up, as Figma lists them. */
  layers: { color: string; blend?: string }[];
}

export interface LayoutRegion {
  /** "guide" for a layout guide, "element" for a system bar or the camera, "sheet" for the sheet itself. */
  kind: "guide" | "element" | "sheet";
  name: string;
  /** Present when x and y are measured from the sheet's corner instead of the screen's. */
  in?: "sheet";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutTemplate {
  /** Apple's name, such as "iPhone Duo/Standard/Outer - Portrait". */
  name: string;
  kind: "standard" | "sheet";
  /** Such as "Outer - Portrait" or "Inner - Landscape - Folded". */
  screen: string;
  width: number;
  height: number;
  regions: LayoutRegion[];
}

export interface KitPlatform {
  id: "ios" | "macos";
  name: string;
  kit: string;
  colors: KitColor[];
  text_styles: KitTextStyle[];
  /** Points that loose and tight leading add to the default leading. */
  leading_adjust?: { loose: number; tight: number };
  sizes: KitSizes;
  materials: KitMaterial[];
  glass: { name: string; value: number }[];
  layout: LayoutTemplate[];
}

export interface DesignValuesPack {
  pack_version: string;
  generated_at: string;
  source: { name: string; url: string; kits: string[]; values: number };
  platforms: KitPlatform[];
}

declare const pack: DesignValuesPack;
export default pack;

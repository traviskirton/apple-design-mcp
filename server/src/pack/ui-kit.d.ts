// Shape of the UI kit pack (ui-kit.js, written by scripts/build-ui-kit-pack.mjs on a Mac from
// local copies of Apple's UI kits for Figma). The outlines themselves are static files at
// "ui-kit/<kit id>/<component id>.txt": blocks that start with "=== <index>" on its own line.
// The drawings are static files at "ui-kit-svg/<kit id>/<node id>.svg", one per variant, written
// by scripts/export-ui-kit-svg.mjs.

export interface KitVariant {
  /** The variant's property values, such as "Style=Large Title". Empty for a component without variants. */
  name: string;
  /** Points. */
  width: number;
  height: number;
  /** Index of this variant's outline in the component's file. Variants with the same layers share one. */
  outline: number;
  /** The variant's node id in the kit's Figma file, such as "3:72207". Apple's drawing of it is the static file "ui-kit-svg/<kit id>/3-72207.svg". */
  node: string;
}

export interface KitProperty {
  name: string;
  /** "bool", "text", "instance swap" or "slot". */
  type: string;
  default?: string;
  /** Apple's note on the property. */
  note?: string;
}

export interface KitComponent {
  /** Stable id and file name, such as "toolbars-toolbar-top-iphone". */
  id: string;
  /** Apple's name, such as "Toolbar - Top - iPhone". */
  name: string;
  /** The kit page it is on, such as "Toolbars". */
  page: string;
  /** The section of the page, where Apple splits a page by device: "iPhone", "iPad", "iPhone Duo". */
  section?: string;
  /** True for the kit's internal parts (unpublished, or named with a leading underscore). */
  helper?: true;
  /** Id of the Human Interface Guidelines page Apple links from the component. */
  hig?: string;
  /** The properties that choose a variant, with their values. The light and dark switch is left out. */
  variant_props?: { name: string; values: string[] }[];
  /** Other properties: switches, texts and slots. */
  props?: KitProperty[];
  variants: KitVariant[];
  /** Ids of the components its layers are instances of. */
  uses?: string[];
}

export interface Kit {
  /** "ios", "macos" or "watchos". */
  id: string;
  /** Such as "iOS and iPadOS 27". */
  name: string;
  pages: string[];
  /** How many of the kit's variants have a drawing: an SVG under "ui-kit-svg/<kit id>/". */
  drawings?: number;
  components: KitComponent[];
}

export interface UiKitPack {
  pack_version: string;
  generated_at: string;
  source: { name: string; url: string; kits: string[]; components: number; variants: number; drawings?: number };
  kits: Kit[];
}

declare const pack: UiKitPack;
export default pack;

// Shape of the technology asset pack (technologies.js, written by scripts/build-technology-pack.mjs
// on a Mac from the "Technologies" downloads on Apple's design resources page).

export interface TechnologyAsset {
  /**
   * Stable id, such as "sign-in-with-apple/logo-left-aligned-black-large". The file is deployed
   * as a static file at "technologies/<id>.<format>".
   */
  id: string;
  /** The artwork's name as people say it, such as "Logo, left-aligned, black, large". */
  title: string;
  /** "svg" for vector artwork, "png" where Apple publishes a picture only. */
  format: "svg" | "png";
  /** Size in points for svg (its viewBox), in pixels for png. */
  width: number;
  height: number;
  bytes: number;
  /** For svg: one complete svg element whose viewBox is "0 0 width height". */
  svg?: string;
  /** Present when the svg was converted from Apple's PDF, because Apple gives no usable SVG. */
  converted_from?: "pdf";
  /** Path of the original file inside Apple's download. */
  source: string;
}

export interface Technology {
  /** Such as "sign-in-with-apple". */
  id: string;
  /** Such as "Sign in with Apple". */
  name: string;
  /** Other words people use for it, such as ["SIWA"] or ["Home", "Home app"]. */
  keywords?: string[];
  /** The download on Apple's page: its title there and the file name. */
  download: { title: string; file: string };
  assets: TechnologyAsset[];
}

export interface TechnologyPack {
  pack_version: string;
  generated_at: string;
  source: { name: string; url: string; technologies: number; assets: number };
  technologies: Technology[];
}

declare const pack: TechnologyPack;
export default pack;

// Design values: the colours, text styles, sizes, materials and layout guides Apple defines in
// its UI kits for Figma, as plain tables.
import pack from "./pack/design-values.js";
import type { KitColor, KitPlatform, LayoutRegion, LayoutTemplate } from "./pack/design-values.js";

export const valuesPack = pack;

export const VALUE_PLATFORMS = ["ios", "macos"] as const;
export const VALUE_TOPICS = ["colors", "text", "sizes", "materials", "layout"] as const;
export type ValuePlatform = (typeof VALUE_PLATFORMS)[number];
export type ValueTopic = (typeof VALUE_TOPICS)[number];

const num = (n: number) => String(Math.round(n * 100) / 100);
const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");

const same = (value: string | undefined, normal: string) => (value && value !== normal ? value : "same");

function colors(p: KitPlatform): string {
  const name = (c: KitColor) => (c.name ? `${c.group}, ${c.name.replace(/\//g, ", ")}` : c.group);
  const api = p.id === "ios" ? "UIKit" : "AppKit";
  const contrast = p.colors.some((c) => c.light_contrast);
  const head = ["Color", api, "Light", "Dark", ...(contrast ? ["Light, increased contrast", "Dark, increased contrast"] : [])];
  const rows = p.colors.map((c) => [
    name(c),
    c.api ? `\`${c.api}\`` : "",
    c.light,
    c.dark,
    ...(contrast ? [same(c.light_contrast, c.light), same(c.dark_contrast, c.dark)] : []),
  ]);
  const notes = [
    "Eight-digit values are RRGGBBAA: the last two digits are the opacity, where 80 is 50% and 99 is 60%.",
    "In code, use the named system color where one is listed, so it follows the appearance and contrast settings.",
    p.id === "macos" ? "Apple marks the vibrant groups \"Use Plus Lighter | Darker\", the blend modes to draw them with on a material." : "",
  ];
  return [`## ${p.name} colors`, table(head, rows), notes.filter(Boolean).join(" ")].join("\n\n");
}

function text(p: KitPlatform): string {
  const rows = p.text_styles.map((s) => [s.name, s.weight, num(s.size), num(s.leading), s.tracking ? num(s.tracking) : "0", s.emphasized ?? ""]);
  const notes =
    p.id === "ios"
      ? [
          "The font is SF Pro. Sizes are for the default text size (Large).",
          p.leading_adjust ? `Loose leading is the leading plus ${p.leading_adjust.loose}; tight leading is the leading minus ${-p.leading_adjust.tight}.` : "",
          "For the other Dynamic Type sizes, call search_hig with \"Dynamic Type sizes\".",
        ]
      : ["The font is SF Pro. macOS does not support Dynamic Type."];
  return [
    `## ${p.name} text styles`,
    table(["Style", "Weight", "Size", "Leading", "Tracking", "Emphasized weight"], rows),
    notes.filter(Boolean).join(" "),
  ].join("\n\n");
}

function sizes(p: KitPlatform): string {
  const rows = p.sizes.rows.map((r) => [r.name.replace(/\//g, ", "), ...r.values.map(num)]);
  const title = p.id === "ios" ? `## ${p.name} sizes by device` : `## ${p.name} control sizes`;
  const note =
    p.id === "ios"
      ? "Points. The names are Apple's variable names in the kit. For screen sizes and safe-area insets, call get_device_metrics; its insets are measured on each device and take precedence over the status bar height here."
      : "Points, for each of the five control sizes. The names are Apple's variable names in the kit. A radius of 1000 means fully rounded ends (a capsule).";
  return [title, table(["Value", ...p.sizes.columns], rows), note].join("\n\n");
}

function materials(p: KitPlatform): string {
  const parts = [`## ${p.name} materials`];
  if (p.materials.length) {
    const rows = p.materials.map((m) => [m.name, [...m.layers].reverse().map((l) => (l.blend ? `${l.color} (${l.blend})` : l.color)).join(" over ")]);
    parts.push(table([p.id === "ios" ? "Vibrant color" : "Material", "Paint"], rows));
    parts.push("These are the kit's paint styles, with the blend mode where one is set.");
  }
  if (p.glass.length) {
    parts.push(
      "Liquid Glass, as Apple sets Figma's glass effect in the kit:",
      table(["Setting", "Value"], p.glass.map((g) => [g.name.replace(/^Liquid Glass, /, ""), num(g.value)])),
      "For when and how to use Liquid Glass, call search_hig with \"Liquid Glass\".",
    );
  }
  return parts.join("\n\n");
}

const SCREEN_NAME = (t: LayoutTemplate) => {
  const [screen, orientation, folded] = t.screen.split(" - ");
  return `iPhone Duo ${screen.toLowerCase()} screen, ${orientation.toLowerCase()}${folded ? ", folded" : ""}`;
};
const region = (r: LayoutRegion) => [r.name, num(r.x), num(r.y), num(r.width), num(r.height)];

function layout(p: KitPlatform): string {
  if (!p.layout.length) {
    return `## ${p.name} layout guides\n\nApple's ${p.kit} has no layout guide templates. For window and screen sizes, call get_device_metrics.`;
  }
  const parts = [
    `## ${p.name} layout guides`,
    "Apple's kit has layout guide templates for iPhone Duo only. Every row is a rectangle in points, measured from the top-left corner " +
      "of the screen. Layout margins and safe area insets are strips along the edges: keep content out of them. Reserved regions and " +
      "the fold are explained in the guidelines; call search_hig with \"iPhone Duo reserved regions\".",
  ];
  const head = ["Region", "x", "y", "Width", "Height"];
  for (const t of p.layout.filter((x) => x.kind === "standard")) {
    parts.push(`### ${SCREEN_NAME(t)} (${num(t.width)} × ${num(t.height)})`, table(head, t.regions.map(region)));
  }
  const sheets = p.layout.filter((x) => x.kind === "sheet");
  if (sheets.length) {
    parts.push(
      "### Sheets on iPhone Duo",
      "The sheet's position is measured from the screen's corner; the guides inside it are measured from the sheet's corner.",
      table(
        ["Screen", ...head],
        sheets.flatMap((t) =>
          t.regions
            .filter((r) => r.kind === "sheet" || r.in === "sheet")
            .map((r) => [SCREEN_NAME(t).replace("iPhone Duo ", ""), ...region(r.kind === "sheet" ? r : { ...r, name: `${r.name}, in the sheet` })]),
        ),
      ),
    );
  }
  return parts.join("\n\n");
}

const SECTION: Record<ValueTopic, (p: KitPlatform) => string> = { colors, text, sizes, materials, layout };

/**
 * The design values of one platform. Without topics it returns colours, text styles, sizes and
 * materials; layout guides are returned only when asked for, because they cover one device.
 */
export function designValues(platform: ValuePlatform, topics: ValueTopic[]): { text: string; ok: boolean } {
  const p = pack.platforms.find((x) => x.id === platform);
  if (!p) return { text: `No design values are loaded for "${platform}". Loaded: ${pack.platforms.map((x) => x.id).join(", ")}.`, ok: false };
  const want: ValueTopic[] = topics.length ? VALUE_TOPICS.filter((t) => topics.includes(t)) : ["colors", "text", "sizes", "materials"];
  const parts = want.map((t) => SECTION[t](p));
  if (!topics.length && p.layout.length) {
    parts.push("Not shown: Apple's layout guides for iPhone Duo (layout margins, safe areas, reserved regions and the fold). Call get_design_values with topics [\"layout\"].");
  }
  const other = pack.platforms.filter((x) => x.id !== p.id).map((x) => `"${x.id}" (${x.name})`);
  parts.push(`Source: ${p.kit}, from ${pack.source.name} (${pack.source.url}), read ${pack.pack_version}. Also loaded: ${other.join(", ")}.`);
  return { text: parts.join("\n\n"), ok: true };
}

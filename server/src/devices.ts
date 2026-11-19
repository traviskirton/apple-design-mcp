// Lookup over the device pack: screen sizes of Apple devices, as Xcode's simulators define them.
import pack from "./pack/devices.js";
import type { Device, Screen } from "./pack/devices.js";

export const devicePack = pack;

export const FAMILIES = ["iphone", "ipad", "watch", "tv", "vision"] as const;

const aboutVision = (q: string) => /vision/i.test(q);

const FAMILY_TITLE: Record<string, string> = {
  iphone: "iPhone",
  ipad: "iPad",
  watch: "Apple Watch",
  tv: "Apple TV",
};

const VISION =
  "Apple Vision Pro has no screen size to design to: apps appear in resizable windows in the person's space. " +
  "A window is 1280 × 720 points by default (see the \"windows\" page with search_hig).";
const TV = "tvOS lays out every Apple TV screen at 1920 × 1080 points, always landscape; 4K models draw it at @2x.";

// "iPhone 18 Pro Max" -> ["iphone", "18", "pro", "max"]; "13-inch" and "13 inch" read the same.
const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()"”″]/g, " ")
    .replace(/-?inch(es)?\b/g, " ")
    .split(/[^a-z0-9.]+/)
    .filter(Boolean);

// Left out of every reply:
// - Apple Vision Pro, which has no screen to design to; Xcode's entry is the simulator's window.
// - Output modes of another device, such as "Apple TV 4K (3rd generation) (at 1080p)".
// - Variants with the same screens as the device they are named after, such as "iPad Pro 13-inch (M5) (16GB)".
const screensOf = new Map(pack.devices.map((d) => [d.name, JSON.stringify(d.screens)]));
const devices: Device[] = pack.devices
  .filter((d) => d.family !== "vision" && !/\(at [^)]+\)$/.test(d.name))
  .filter((d) => {
    const base = d.name.replace(/ \([^)]*\)$/, "");
    return base === d.name || screensOf.get(base) !== JSON.stringify(d.screens);
  });

const named = devices.map((device) => ({ device, words: new Set(tokens(device.name)) }));

/** Devices whose name holds every word of the query. An exact name wins over longer names. */
export function findDevices(query: string): Device[] {
  const want = tokens(query);
  if (!want.length) return [];
  const hits = named.filter(({ words }) => want.every((w) => words.has(w)));
  const exact = hits.filter(({ words }) => words.size === want.length);
  const list = exact.length ? exact : hits;
  // Without a model year in the query, prefer devices that are still current.
  const current = list.filter(({ device }) => device.current);
  return (current.length ? current : list).map(({ device }) => device);
}

const num = (n: number) => String(Math.round(n * 100) / 100);

function radius(r: Screen["corner_radius_pt"]): string {
  if (r === undefined) return "";
  if (typeof r === "number") return num(r);
  return `top-left ${num(r.top_left)}, top-right ${num(r.top_right)}, bottom-left ${num(r.bottom_left)}, bottom-right ${num(r.bottom_right)}`;
}

export const ROLE = { outer: "outer screen (closed)", inner: "inner screen (open)" };

function table(devices: Device[]): string {
  const rows = devices.flatMap((d) =>
    d.screens.map((s) => {
      const name = s.role ? `${d.name}, ${ROLE[s.role]}` : d.name;
      const island = d.dynamic_island && s.role !== "inner" ? "yes" : "";
      const natural = d.family === "tv" ? "landscape" : (s.natural_orientation ?? "portrait");
      return `| ${name} | ${num(s.width_pt)} × ${num(s.height_pt)} | @${num(s.scale)}x | ${s.width_px} × ${s.height_px} | ${s.ppi ?? ""} | ${radius(s.corner_radius_pt)} | ${natural} | ${island} |`;
    }),
  );
  return [
    "| Device | Screen (points) | Scale | Screen (pixels) | Pixels per inch | Corner radius (points) | Natural orientation | Dynamic Island |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function insetTable(devices: Device[]): string {
  const rows = devices.flatMap((d) =>
    d.screens
      .filter((s) => s.safe_area)
      .map((s) => {
        const { portrait: p, landscape: l } = s.safe_area!;
        const name = s.role ? `${d.name}, ${ROLE[s.role]}` : d.name;
        const land = l ? [l.top, l.bottom, l.left, l.right].map(num) : ["", "", "", ""];
        return `| ${name} | ${num(p.top)} | ${num(p.bottom)} | ${num(p.left)} | ${num(p.right)} | ${land.join(" | ")} |`;
      }),
  );
  if (!rows.length) return "";
  return [
    "Safe area insets (points)",
    "",
    "| Device | Portrait top | Portrait bottom | Portrait left | Portrait right | Landscape top | Landscape bottom | Landscape left | Landscape right |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function byFamily(devices: Device[]): string {
  const families = [...new Set(devices.map((d) => d.family))];
  const order = (f: string) => (FAMILIES as readonly string[]).indexOf(f);
  families.sort((a, b) => order(a) - order(b));
  return families
    .map((f) => {
      const list = devices.filter((d) => d.family === f);
      const insets = insetTable(list);
      return `## ${FAMILY_TITLE[f] ?? f}\n\n${table(list)}` + (insets ? `\n\n${insets}` : "") + (f === "tv" ? `\n\n${TV}` : "");
    })
    .join("\n\n");
}

const SIZES_NOTE =
  "iPhone, iPad and Apple Watch sizes are given with the screen in portrait; swap width and height for landscape. " +
  "Corner radii are listed for that same portrait position. Design at the size in points; the scale gives the pixel size for exported images.";

/** The closing note: what the data holds for these devices, and what it does not. */
function note(devices: Device[]): string {
  const all = devices.flatMap((d) => d.screens);
  const measured = all.filter((s) => s.safe_area).length;
  const insets =
    measured === 0
      ? "This data does not hold safe-area insets, "
      : "Safe-area insets were measured in the iOS Simulator with the status bar shown; landscape is landscape-right, " +
        "with the Dynamic Island or home button on the left. Lay out bars and content inside them. " +
        (measured < all.length ? "Devices without a row in the safe-area table have no measurement. " : "") +
        (devices.some((d) => d.screens.some((s) => s.safe_area && !s.safe_area.landscape))
          ? "Empty landscape cells could not be measured reliably (iPad: the Simulator keeps the status bar placed for portrait). "
          : "") +
        "This data does not hold ";
  const scaled = devices.filter((d) => d.screens.some((s) => s.downsampled)).map((d) => d.name);
  const downsampled = scaled.length
    ? `${scaled.join(" and ")}: apps are laid out at the size in points, drawn at that size times the scale, ` +
      "and the system scales the picture down to the screen's pixels, so points times scale is larger than the pixel size. "
    : "";
  return `${SIZES_NOTE} ${downsampled}${insets}the position or size of the Dynamic Island and cameras, or fold and hinge positions; ` +
    "take those from the guidelines (search_hig) and say so if you estimate them.";
}

/**
 * Screen sizes for the named devices, or for every current device when none are named.
 * `families` limits an unnamed listing; `all` adds devices the newest OS no longer runs on.
 */
export function deviceMetrics(queries: string[], families: string[], all: boolean): string {
  const source = `Source: ${pack.source.name}, ${pack.source.version}, read ${pack.pack_version}.`;

  if (queries.length) {
    const found = new Map<string, Device>();
    const missing: string[] = [];
    let vision = false;
    for (const q of queries) {
      const hits = findDevices(q);
      if (!hits.length && aboutVision(q)) vision = true;
      else if (!hits.length) missing.push(q);
      for (const d of hits) found.set(d.id, d);
    }
    const parts: string[] = [];
    if (found.size) parts.push(byFamily([...found.values()]), note([...found.values()]));
    if (vision) parts.push(VISION);
    if (missing.length) {
      parts.push(
        `No device matches ${missing.map((q) => `"${q}"`).join(", ")}. ` +
          "Call get_device_metrics without `devices` to list every device.",
      );
    }
    parts.push(source);
    return parts.join("\n\n");
  }

  let list = devices.filter((d) => all || d.current);
  if (families.length) list = list.filter((d) => families.includes(d.family));
  const vision = !families.length || families.includes("vision");
  if (!list.length) return [vision ? VISION : "No devices match.", source].join("\n\n");
  return [byFamily(list), note(list), ...(vision ? [VISION] : []), source].join("\n\n");
}

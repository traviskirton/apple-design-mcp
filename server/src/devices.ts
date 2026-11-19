// Lookup over the device pack: screen sizes of Apple devices, as Xcode's simulators define them.
import pack from "./pack/devices.js";
import type { Device, Screen } from "./pack/devices.js";

export const devicePack = pack;

export const FAMILIES = ["iphone", "ipad", "watch", "tv", "vision"] as const;

const FAMILY_TITLE: Record<string, string> = {
  iphone: "iPhone",
  ipad: "iPad",
  watch: "Apple Watch",
  tv: "Apple TV",
  vision: "Apple Vision Pro",
};

// "iPhone 18 Pro Max" -> ["iphone", "18", "pro", "max"]; "13-inch" and "13 inch" read the same.
const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()"”″]/g, " ")
    .replace(/-?inch(es)?\b/g, " ")
    .split(/[^a-z0-9.]+/)
    .filter(Boolean);

const named = pack.devices.map((device) => ({ device, words: new Set(tokens(device.name)) }));

/** Devices whose name holds every word of the query. An exact name wins over longer names. */
function find(query: string): Device[] {
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

const ROLE = { outer: "outer screen (closed)", inner: "inner screen (open)" };

function table(devices: Device[]): string {
  const rows = devices.flatMap((d) =>
    d.screens.map((s) => {
      const name = s.role ? `${d.name}, ${ROLE[s.role]}` : d.name;
      const island = d.dynamic_island && s.role !== "inner" ? "yes" : "";
      const natural = s.natural_orientation ?? "portrait";
      return `| ${name} | ${num(s.width_pt)} × ${num(s.height_pt)} | @${num(s.scale)}x | ${s.width_px} × ${s.height_px} | ${s.ppi ?? ""} | ${radius(s.corner_radius_pt)} | ${natural} | ${island} |`;
    }),
  );
  return [
    "| Device | Screen in portrait (points) | Scale | Screen (pixels) | Pixels per inch | Corner radius (points) | Natural orientation | Dynamic Island |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function byFamily(devices: Device[]): string {
  const families = [...new Set(devices.map((d) => d.family))];
  const order = (f: string) => (FAMILIES as readonly string[]).indexOf(f);
  families.sort((a, b) => order(a) - order(b));
  return families
    .map((f) => `## ${FAMILY_TITLE[f] ?? f}\n\n${table(devices.filter((d) => d.family === f))}`)
    .join("\n\n");
}

const NOTE =
  "Every size is given with the screen in portrait; swap width and height for landscape. Corner radii are listed " +
  "for that same portrait position. Design at the size in points; the scale gives the pixel size for exported " +
  "images. This data does not hold safe-area insets, the position or size of the Dynamic Island and cameras, or " +
  "fold and hinge positions; take those from the guidelines (search_hig) and say so if you estimate them.";

/**
 * Screen sizes for the named devices, or for every current device when none are named.
 * `families` limits an unnamed listing; `all` adds devices the newest OS no longer runs on.
 */
export function deviceMetrics(queries: string[], families: string[], all: boolean): string {
  const source = `Source: ${pack.source.name}, ${pack.source.version}, read ${pack.pack_version}.`;

  if (queries.length) {
    const found = new Map<string, Device>();
    const missing: string[] = [];
    for (const q of queries) {
      const hits = find(q);
      if (!hits.length) missing.push(q);
      for (const d of hits) found.set(d.id, d);
    }
    const parts: string[] = [];
    if (found.size) parts.push(byFamily([...found.values()]), NOTE);
    if (missing.length) {
      parts.push(
        `No device matches ${missing.map((q) => `"${q}"`).join(", ")}. ` +
          "Call get_device_metrics without `devices` to list every device.",
      );
    }
    parts.push(source);
    return parts.join("\n\n");
  }

  let list = pack.devices.filter((d) => all || d.current);
  if (families.length) list = list.filter((d) => families.includes(d.family));
  if (!list.length) return `No devices match. ${source}`;
  return [byFamily(list), NOTE, source].join("\n\n");
}

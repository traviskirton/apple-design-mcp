// Apple's product bezels: the photographic pictures of each device with an empty screen.
import pack from "./pack/bezels.js";
import type { Bezel } from "./pack/bezels.js";

export const bezelPack = pack;

/** Words of a device name, so that `iPad Pro (M5) 13"`, "iPad Pro 13-inch (M5)" and "ipad pro 13" compare equal where they should. */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/(\d+)\s*(?:-inch|inch|["”])/g, "$1 ")
    .replace(/\bs(\d+)\b/g, "series $1")
    .replace(/\baw\b/g, "apple watch")
    .replace(/\((\d+)\s*mm\)/g, "$1mm")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w && w !== "with" && w !== "the");
}

interface Model {
  name: string;
  words: string[];
  bezels: Bezel[];
}

const models: Model[] = [];
for (const b of pack.bezels) {
  let m = models.find((x) => x.name === b.model);
  if (!m) models.push((m = { name: b.model, words: words(b.model), bezels: [] }));
  m.bezels.push(b);
}

/**
 * The models whose name holds every word of the query, closest first: "iPhone 18 Pro" finds the
 * Pro before the Pro Max. Words of the query that no model has (a year, "generation") are ignored
 * when the rest still names one.
 */
export function findBezelModels(query: string): Model[] {
  const q = words(query);
  if (!q.length) return [];
  const score = (m: Model, wanted: string[]) => (wanted.every((w) => m.words.includes(w)) ? m.words.length - wanted.length : -1);
  let hits = models.map((m) => ({ m, extra: score(m, q) })).filter((x) => x.extra >= 0);
  if (!hits.length) {
    // "iPad Pro 13-inch (M5)" against "iPad Pro (M5) 13": try without the words nothing knows.
    const known = q.filter((w) => models.some((m) => m.words.includes(w)));
    if (known.length >= 2 && known.length < q.length) hits = models.map((m) => ({ m, extra: score(m, known) })).filter((x) => x.extra >= 0);
  }
  hits.sort((a, b) => a.extra - b.extra);
  return hits.length && hits[0].extra === 0 ? hits.filter((x) => x.extra === 0).map((x) => x.m) : hits.map((x) => x.m);
}

const unique = <T>(list: T[]) => [...new Set(list)];

/** One model's pictures: sizes, screen positions and addresses. */
function describe(model: Model, origin: string, pointsWide?: number): string {
  const lines: string[] = [`### ${model.name}, Apple's product bezel`];
  const finishes = unique(model.bezels.map((b) => b.finish).filter(Boolean));
  const poses = unique(model.bezels.map((b) => b.pose).filter(Boolean));
  const facts: string[] = [];
  if (finishes.length) facts.push(`Finishes: ${finishes.join("; ")}.`);
  if (poses.length) facts.push(`Views: ${poses.join("; ")}.`);
  // Pictures of one pose share a size and a screen position; say each once.
  const shapes = new Map<string, Bezel[]>();
  for (const b of model.bezels) {
    const key = `${b.pose ?? ""}|${b.width}x${b.height}|${JSON.stringify(b.screens ?? [])}`;
    shapes.set(key, [...(shapes.get(key) ?? []), b]);
  }
  for (const group of shapes.values()) {
    const b = group[0];
    const label = b.pose ? `${b.pose}: ` : shapes.size > 1 ? `${group.map((g) => g.finish).join(", ")}: ` : "";
    const screens = (b.screens ?? []).map((s) => `${s.width} × ${s.height} px at x ${s.x}, y ${s.y}`);
    let line = `${label}picture ${b.width} × ${b.height} px; ` + (screens.length ? `screen ${screens.join(" and a second see-through area ")}` : "the screen is not see-through in this picture, so its position is not known");
    const s = b.screens?.[0];
    if (s && pointsWide) {
      // Only where the picture's screen is a whole multiple of the device's points (not the other screen of a folding device).
      const scale = Math.min(s.width, s.height) / pointsWide;
      if (scale >= 1 && Math.abs(scale - Math.round(scale)) < 0.03) line += ` (${Math.round(scale)} px per point)`;
    }
    facts.push(line + ".");
  }
  lines.push(facts.join("\n"));
  const shown = model.bezels.slice(0, 24);
  lines.push(
    ["| Finish | View | Picture |", "| --- | --- | --- |", ...shown.map((b) => `| ${b.finish ?? ""} | ${b.pose ?? ""} | ${origin}/bezels/${b.id}.png |`)].join("\n") +
      (model.bezels.length > shown.length ? `\n\nAnd ${model.bezels.length - shown.length} more finishes of the same size.` : ""),
  );
  return lines.join("\n\n");
}

export const BEZEL_USE =
  "To use a product bezel: it is a PNG of the real device with a see-through screen. Draw the screen content at the " +
  "screen position given (scale the picture and the position together), then draw the PNG on top of it, so the " +
  "device's edges and camera cover the content's corners. In HTML: a container with the picture's aspect ratio, the " +
  "content absolutely positioned at the screen's left, top, width and height as percentages of the picture, and the " +
  "PNG as an img above it with pointer-events: none.";

/**
 * The product bezels for a query. `deviceName` is the name the device pack gives the device the
 * query matched, tried first; `pointsWide` is that device's screen width in points.
 */
export function bezelsFor(query: string, origin: string, deviceName?: string, pointsWide?: number): string[] {
  const found = (deviceName ? findBezelModels(deviceName) : []).length ? findBezelModels(deviceName!) : findBezelModels(query);
  return found.slice(0, 3).map((m) => describe(m, origin, pointsWide));
}

/** The devices that have a bezel, for the reply to a query that found none. */
export const bezelModelNames = () => models.map((m) => m.name);

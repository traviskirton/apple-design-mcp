// Technology artwork: the logos, glyphs, badges and icons Apple publishes for showing its
// technologies inside an app (Sign in with Apple, AirPlay, Game Center and others).
import pack from "./pack/technologies.js";
import type { Technology, TechnologyAsset } from "./pack/technologies.js";

export const technologyPack = pack;

// The guideline page that says how each technology's artwork may be shown.
const HIG_PAGE: Record<string, string> = {
  "sign-in-with-apple": "sign-in-with-apple",
  airplay: "airplay",
  arkit: "augmented-reality",
  "game-center": "game-center",
  homekit: "homekit",
  "apple-health": "healthkit",
  siri: "siri",
  "add-apple-watch-face": "watch-faces",
};

// Apple publishes these as Figma and Sketch templates only, so no file is loaded for them.
const TEMPLATES_ONLY = "Apple Pay, Wallet, Tap to Pay on iPhone, App Clips, Live Activities, Messages, Siri and App Shortcuts, TipKit and the Sign in with Apple buttons";

const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const num = (n: number) => String(Math.round(n * 100) / 100);

interface Entry {
  technology: Technology;
  asset: TechnologyAsset;
  /** Words of the technology's name and keywords. */
  techWords: Set<string>;
  /** Those words plus the words of the asset's title. */
  words: Set<string>;
}

const entries: Entry[] = pack.technologies.flatMap((technology) => {
  const techWords = new Set(tokens([technology.name, technology.id, ...(technology.keywords ?? [])].join(" ")));
  return technology.assets.map((asset) => ({
    technology,
    asset,
    techWords,
    words: new Set([...techWords, ...tokens(asset.title)]),
  }));
});

/**
 * Assets for a query. "Sign in with Apple" returns everything for that technology;
 * "sign in with apple white logo only" returns the assets whose title also holds those words.
 */
export function findAssets(query: string): Entry[] {
  const want = tokens(query);
  if (!want.length) return [];
  const whole = entries.filter((e) => want.every((w) => e.techWords.has(w)));
  if (whole.length) return whole;
  return entries.filter((e) => want.every((w) => e.words.has(w)));
}

const size = (a: TechnologyAsset) => `${num(a.width)} × ${num(a.height)} ${a.format === "svg" ? "points" : "pixels"}`;
const url = (a: TechnologyAsset, origin: string) => `${origin}/technologies/${a.id}.${a.format}`;

function describe(asset: TechnologyAsset, origin: string): string {
  const lines = [`### ${asset.title}`, `\`${asset.id}\`, ${size(asset)}`];
  if (asset.svg) lines.push("```svg\n" + asset.svg.trim() + "\n```", `Also at ${url(asset, origin)}`);
  else lines.push(`Picture (PNG): ${url(asset, origin)}`);
  return lines.join("\n\n");
}

function guidance(t: Technology): string {
  const page = HIG_PAGE[t.id];
  return (
    `Show Apple's artwork as it is: do not redraw it, recolor it or change its proportions.` +
    (page ? ` The rules for where and how to show it are in the guidelines; call search_hig with "${t.name}" (page "${page}").` : "")
  );
}

function listing(origin: string): string {
  const rows = pack.technologies.flatMap((t) =>
    t.assets.map((a) => `| ${t.name} | ${a.title} | \`${a.id}\` | ${a.format === "svg" ? "SVG" : "PNG"} | ${size(a)} |`),
  );
  return [
    "| Technology | Artwork | Id | Format | Size |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "Call get_technology_assets with `technologies`, such as [\"Sign in with Apple\", \"AirPlay\"], to get the artwork itself. " +
      `Every file is also at ${origin}/technologies/<id>.<format>.`,
    "",
    `Not loaded: ${TEMPLATES_ONLY}. Apple publishes those as Figma and Sketch templates only.`,
  ].join("\n");
}

/** The artwork of each named technology, or a list of everything when none is named. */
export function technologyAssets(queries: string[], origin: string): { text: string; ok: boolean } {
  const source = `Source: ${pack.source.name}, ${pack.source.url}, read ${pack.pack_version}.`;
  if (!pack.technologies.length) return { text: "No technology artwork is loaded on this server yet.", ok: false };
  if (!queries.length) return { text: [listing(origin), source].join("\n\n"), ok: true };

  const byTechnology = new Map<Technology, TechnologyAsset[]>();
  const seen = new Set<string>();
  const missing: string[] = [];
  for (const q of queries) {
    const hits = findAssets(q);
    if (!hits.length) missing.push(q);
    for (const { technology, asset } of hits) {
      if (seen.has(asset.id)) continue;
      seen.add(asset.id);
      byTechnology.set(technology, [...(byTechnology.get(technology) ?? []), asset]);
    }
  }

  const parts: string[] = [];
  for (const [technology, assets] of byTechnology) {
    parts.push(`## ${technology.name}`, guidance(technology), ...assets.map((a) => describe(a, origin)));
  }
  if (missing.length) {
    parts.push(
      `No artwork matches ${missing.map((q) => `"${q}"`).join(", ")}. Loaded: ${pack.technologies.map((t) => t.name).join(", ")}. ` +
        `Not loaded (Apple publishes Figma and Sketch templates only): ${TEMPLATES_ONLY}.`,
    );
  }
  parts.push(source);
  return { text: parts.join("\n\n"), ok: byTechnology.size > 0 };
}

// A design brief: what one device's screen design needs, from every other tool, in one reply.
// Each tool call costs a design app a model turn (about 14 s in Claude Design runs), and server
// time is a few milliseconds, so one larger reply is faster than seven to eleven smaller ones.
import { deviceMetrics, findDevices } from "./devices.js";
import { deviceFrames } from "./frames.js";
import { higPack, lookupHig, readPage } from "./hig.js";
import { lookupSymbols } from "./symbols.js";
import type { ShapeLoader, Weight } from "./symbols.js";
import { searchUiKit, uiKitPack } from "./uikit.js";
import type { DrawingLoader, KitId, OutlineLoader } from "./uikit.js";
import { designValues } from "./values.js";
import type { ValuePlatform } from "./values.js";

type HigPlatform = "ios" | "ipados" | "macos" | "tvos" | "visionos" | "watchos";

interface Platform {
  hig: HigPlatform;
  name: string;
  kit?: KitId;
  values?: ValuePlatform;
}

const PLATFORMS: Record<HigPlatform, Platform> = {
  ios: { hig: "ios", name: "iOS", kit: "ios", values: "ios" },
  ipados: { hig: "ipados", name: "iPadOS", kit: "ios", values: "ios" },
  macos: { hig: "macos", name: "macOS", kit: "macos", values: "macos" },
  watchos: { hig: "watchos", name: "watchOS", kit: "watchos" },
  tvos: { hig: "tvos", name: "tvOS" },
  visionos: { hig: "visionos", name: "visionOS" },
};

const FAMILY_PLATFORM: Record<string, HigPlatform> = { iphone: "ios", ipad: "ipados", watch: "watchos", tv: "tvos", vision: "visionos" };

/** The platform a device runs, from the device list or else from its name. */
export function platformOf(device: string): Platform | undefined {
  const family = findDevices(device)[0]?.family;
  if (family && FAMILY_PLATFORM[family]) return PLATFORMS[FAMILY_PLATFORM[family]];
  const d = device.toLowerCase();
  if (/\b(mac|macbook|imac|studio display|pro display)\b/.test(d)) return PLATFORMS.macos;
  if (/\bwatch\b/.test(d)) return PLATFORMS.watchos;
  if (/\bipad\b/.test(d)) return PLATFORMS.ipados;
  if (/\b(apple tv|tvos)\b/.test(d)) return PLATFORMS.tvos;
  if (/\bvision\b/.test(d)) return PLATFORMS.visionos;
  if (/\biphone\b/.test(d)) return PLATFORMS.ios;
  return undefined;
}

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/**
 * The guidelines pages written for this device: the platform's "Designing for" page, and a page
 * for the device itself where Apple has one (every word of its name is in the device's name).
 */
export function devicePages(device: string, platform: Platform): string[] {
  const name = new Set(words(findDevices(device)[0]?.name ?? device));
  const own = higPack.pages
    .filter((p) => p.id.startsWith("designing-for-") && p.id !== `designing-for-${platform.hig}`)
    .filter((p) => {
      const w = p.id.slice("designing-for-".length).split("-");
      return w.length > 1 && w.every((x) => name.has(x));
    })
    .map((p) => p.id);
  const base = higPack.pages.some((p) => p.id === `designing-for-${platform.hig}`) ? [`designing-for-${platform.hig}`] : [];
  return [...base, ...own];
}

/**
 * The words the UI kit uses for this device, such as "iPhone Duo" or "iPad": the longest start of
 * the device's name that some component's name holds. Added to component queries so that each
 * returns the device's own variant; nothing is added when the kit has no such component.
 */
export function kitDeviceWords(device: string, kit: KitId): string {
  const k = uiKitPack.kits.find((x) => x.id === kit);
  if (!k) return "";
  const names = k.components.map((c) => ` ${words(c.name).join(" ")} `);
  const original = (findDevices(device)[0]?.name ?? device).split(/[^A-Za-z0-9]+/).filter(Boolean);
  const w = original.map((x) => x.toLowerCase());
  for (let n = w.length; n > 0; n--) {
    const start = w.slice(0, n).join(" ");
    if (names.some((c) => c.includes(` ${start} `))) return original.slice(0, n).join(" ");
  }
  return "";
}

export interface BriefInput {
  device: string;
  components: string[];
  icons: string[];
  topics: string[];
  weight: Weight;
  maxChars: number;
}

export interface Loaders {
  shape: ShapeLoader;
  outlines: OutlineLoader;
  drawing: DrawingLoader;
}

export async function designBrief(input: BriefInput, load: Loaders, origin: string): Promise<{ text: string; ok: boolean }> {
  const platform = platformOf(input.device);
  if (!platform) {
    return {
      text:
        `"${input.device}" is not a device this server knows. Name an Apple device, such as "iPhone 18 Pro", ` +
        `"iPad Pro 13", "Apple Watch Series 11", "MacBook Air 13" or "Apple TV". get_device_metrics lists them.`,
      ok: false,
    };
  }

  const parts: string[] = [];
  const missing: string[] = [];
  parts.push(
    `# Design brief: ${input.device} (${platform.name})\n\n` +
      `Everything below is for ${platform.name}: the device, its guidelines, ` +
      (input.components.length ? "Apple's drawings of the components, " : "") +
      (input.icons.length ? "the icons, " : "") +
      "and the system colors and text styles. Use the other tools only for what is missing here.",
  );

  // 1. The device: screen sizes and Apple's pictures of it.
  const device: string[] = [];
  if (findDevices(input.device).length) device.push(deviceMetrics([input.device], [], false));
  const frames = deviceFrames([input.device], origin);
  if (frames.ok) device.push(frames.text);
  if (device.length) parts.push(`# 1. The device\n\n${device.join("\n\n")}`);
  else missing.push("screen size and frame");

  // 2. The guidelines written for this device, whole.
  const pages = devicePages(input.device, platform)
    .map((id) => readPage(id, "all"))
    .filter((r) => r.ok)
    .map((r) => r.text);
  if (pages.length) parts.push(`# 2. Guidelines for ${platform.name}\n\n${pages.join("\n\n")}`);

  // 3. The guidelines for each component and topic, limited to this platform.
  const higQueries = [...input.components, ...input.topics].slice(0, 8);
  const higBudget = Math.round(input.maxChars * 0.4);
  if (higQueries.length) parts.push(`# 3. Guidelines for the components\n\n${lookupHig(higQueries, higBudget, [platform.hig])}`);

  // 4. Apple's drawing of each component, in the device's own variant where the kit has one.
  if (input.components.length) {
    if (platform.kit) {
      const qualifier = kitDeviceWords(input.device, platform.kit);
      const queries = input.components.slice(0, 12).map((c) => {
        if (!qualifier) return c;
        const have = new Set(words(c));
        return words(qualifier).every((w) => have.has(w)) ? c : `${qualifier} ${c}`;
      });
      const kit = await searchUiKit(queries, platform.kit, Math.round(input.maxChars * 0.6), load.outlines, load.drawing, origin);
      parts.push(`# 4. Apple's components\n\n${kit.text}`);
    } else {
      missing.push(`UI kit components (Apple's kits cover iOS, iPadOS, macOS and watchOS, not ${platform.name})`);
    }
  }

  // 5. The icons, as SF Symbols.
  if (input.icons.length) {
    const icons = await lookupSymbols(input.icons.slice(0, 20), 3, 1, load.shape, origin, input.weight);
    parts.push(`# 5. Icons\n\n${icons}`);
  }

  // 6. System colors, text styles and sizes; layout guides when they are for this device.
  if (platform.values) {
    const layout = designValues(platform.values, ["layout"]);
    const name = (findDevices(input.device)[0]?.name ?? input.device).toLowerCase();
    const forDevice = layout.ok && /layout guide templates for ([^.]+) only/i.exec(layout.text)?.[1]?.toLowerCase();
    const topics = forDevice && name.includes(forDevice) ? (["colors", "text", "sizes", "layout"] as const) : (["colors", "text", "sizes"] as const);
    parts.push(`# 6. Colors, text styles and sizes\n\n${designValues(platform.values, [...topics]).text}`);
  } else {
    missing.push(`system colors and text styles (Apple's kits give them for iOS, iPadOS and macOS, not ${platform.name})`);
  }

  // 7. What the platform does not have: guidelines pages Apple does not list for it.
  const absent = higPack.pages.filter((p) => p.platforms?.length && !p.platforms.includes(platform.hig));
  if (absent.length) {
    // An asked component whose own page is among them, such as "sidebar" for Sidebars on watchOS.
    const title = (t: string) => words(t).join(" ");
    const asked = input.components.filter((c) => absent.some((p) => [title(c), `${title(c)}s`].includes(title(p.title))));
    parts.push(
      `# 7. Not on ${platform.name}\n\n` +
        (asked.length ? `Asked for but possibly not on ${platform.name}: ${asked.join(", ")}. Check the list below before using them.\n\n` : "") +
        `Apple does not list these guidelines pages for ${platform.name}; leave their components and patterns out: ${absent.map((p) => p.title).join(", ")}.`,
    );
  }

  if (missing.length) parts.push(`Not in this brief: ${missing.join("; ")}.`);
  return { text: parts.join("\n\n"), ok: true };
}

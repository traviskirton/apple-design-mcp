// get_design_brief for several devices and platforms, on the modules directly with no server:
// `npm run test:brief`. Reads drawings and symbol shapes from assets/.
import { build } from "esbuild"; // wrangler's own bundler, installed with it
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = mkdtempSync(join(tmpdir(), "brief-"));
const load = async (name) => {
  await build({ entryPoints: [join(root, "src", `${name}.ts`)], bundle: true, format: "esm", platform: "neutral", outfile: join(out, `${name}.mjs`), logLevel: "error" });
  return import(pathToFileURL(join(out, `${name}.mjs`)).href);
};
const [brief, symbols] = await Promise.all([load("brief"), load("symbols")]);
rmSync(out, { recursive: true, force: true });

const asset = (p) => (existsSync(join(root, "assets", p)) ? readFileSync(join(root, "assets", p), "utf8") : null);
const loaders = {
  outlines: async (kit, id) => asset(`ui-kit/${kit}/${id}.txt`),
  drawing: async (kit, file) => asset(`ui-kit-svg/${kit}/${file}`),
  shape: async (name, weight) => {
    if (weight === "regular") return asset(`symbols/${name}.svg`);
    const shard = asset(`symbol-weights/${weight}/${symbols.shardOf(name)}.txt`);
    return shard ? symbols.fromShard(shard, name) : null;
  },
};

let failed = 0;
const check = (ok, what) => {
  if (!ok) {
    failed++;
    console.log(`FAIL: ${what}`);
  }
};

async function run(input) {
  const r = await brief.designBrief({ components: [], icons: [], topics: [], weight: "regular", maxChars: 90000, ...input }, loaders, "https://test.local");
  console.log(`${input.device}: ${r.text.length} characters, ${(r.text.match(/<svg/g) ?? []).length} SVGs`);
  return r;
}

// Each case: the device, what the brief must hold, and what it must not.
const CASES = [
  {
    input: { device: "iPhone 18 Pro", components: ["tab bar", "toolbar"], icons: ["heart", "share"] },
    has: ["# Design brief: iPhone 18 Pro (iOS)", "# Designing for iOS", "Tab bars (page \"tab-bars\")", "### Tab Bar - iPhone", '## "heart"', "iOS and iPadOS 27 colors"],
    not: ["Designing for watchOS", "Designing for iPhone Duo", "layout guides"],
  },
  {
    input: { device: "iPhone Duo", components: ["tab bar"], icons: ["heart"] },
    has: ["# Designing for iPhone Duo", "## Vertical controls", "### Tab Bar - iPhone Duo", "layout guides"],
    not: ["Not included for size. Read one with get_hig_page:\n- page \"designing-for-iphone-duo\""],
  },
  {
    input: { device: "iPad Pro 13", components: ["sidebar", "tab bar"] },
    has: ["(iPadOS)", "# Designing for iPadOS", "### Tab Bar - iPad", "### Sidebar"],
    not: ["Designing for iPhone Duo", "layout guides"],
  },
  {
    input: { device: "Apple Watch Series 11", components: ["button"], icons: ["heart"] },
    has: ["(watchOS)", "# Designing for watchOS", "### Button - Pill", "Not in this brief: system colors", "# 7. Not on watchOS", "Sidebars"],
    not: ["Designing for iOS", "iOS and iPadOS 27 colors"],
  },
  {
    input: { device: "MacBook Air 13", components: ["sidebar"], icons: ["folder"] },
    has: ["(macOS)", "# Designing for macOS", "Apple's product bezel", "macOS 27 colors"],
    not: ["Designing for iOS", "iOS and iPadOS 27 colors"],
  },
  {
    input: { device: "Apple TV 4K", components: ["tab bar"] },
    has: ["(tvOS)", "# Designing for tvOS", "Not in this brief: UI kit components"],
    not: ["Designing for iOS"],
  },
];

for (const { input, has, not } of CASES) {
  const r = await run(input);
  check(r.ok, `${input.device}: the brief should succeed`);
  for (const h of has) check(r.text.includes(h), `${input.device}: should include ${JSON.stringify(h)}`);
  for (const n of not) check(!r.text.includes(n), `${input.device}: should not include ${JSON.stringify(n)}`);
  check(r.text.length < 160000, `${input.device}: the brief should stay under 160,000 characters`);
}

const unknown = await run({ device: "Nokia 3310" });
check(!unknown.ok && unknown.text.includes("not a device this server knows"), "an unknown device should say so");

// A device's own guidelines page comes only for that device.
check(brief.devicePages("iPhone 18 Pro", brief.platformOf("iPhone 18 Pro")).join() === "designing-for-ios", "iPhone 18 Pro should get only Designing for iOS");
check(brief.devicePages("iPhone Duo", brief.platformOf("iPhone Duo")).includes("designing-for-iphone-duo"), "iPhone Duo should get its own page");
// Component queries get the kit's word for the device only where the kit has it.
check(brief.kitDeviceWords("iPhone 18 Pro", "ios") === "iPhone", "iPhone 18 Pro components should be asked as iPhone");
check(brief.kitDeviceWords("iPhone Duo", "ios") === "iPhone Duo", "iPhone Duo components should be asked as iPhone Duo");

if (failed) {
  console.log(`${failed} brief checks failed`);
  process.exit(1);
}
console.log("brief checks OK");

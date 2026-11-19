// What each search should find first, for the words people use. Runs on the modules directly, with
// no server: `npm run test:ranking`. Add a line here for every search miss that gets fixed.
import { build } from "esbuild"; // wrangler's own bundler, installed with it
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const out = mkdtempSync(join(tmpdir(), "ranking-"));
const load = async (name) => {
  await build({ entryPoints: [join(src, `${name}.ts`)], bundle: true, format: "esm", platform: "neutral", outfile: join(out, `${name}.mjs`), logLevel: "error" });
  return import(pathToFileURL(join(out, `${name}.mjs`)).href);
};
const [hig, symbols, uikit] = await Promise.all([load("hig"), load("symbols"), load("uikit")]);
rmSync(out, { recursive: true, force: true });

// Query, then the first result. For the guidelines: the first page in the reply. For the UI kit: the
// first component, or "" when the kits have nothing of that name.
const HIG = [
  ["tab bar", "Tab bars"], ["navigation bar", "Toolbars"], ["sheet", "Sheets"], ["modal", "Sheets"],
  ["login screen", "Managing accounts"], ["sign in with apple", "Sign in with Apple"], ["dark mode color", "Dark Mode"],
  ["spacing and margins", "Layout"], ["font size", "Typography"], ["typography", "Typography"], ["dynamic type", "Typography"],
  ["activity indicator", "Progress indicators"], ["switch", "Toggles"], ["dropdown", "Pop-up buttons"],
  ["share sheet", "Activity views"], ["search bar", "Search fields"], ["iPhone Duo", "Designing for iPhone Duo"],
  ["alerts", "Alerts"], ["settings", "Settings"], ["onboarding", "Onboarding"], ["app icon", "App icons"],
  ["launch screen", "Launching"], ["haptics", "Playing haptics"], ["voiceover", "VoiceOver"], ["widgets", "Widgets"],
];
const SYMBOLS = [
  ["heart", "heart"], ["settings", "gearshape"], ["share", "square.and.arrow.up"], ["back", "chevron.backward"],
  ["close", "xmark"], ["delete", "trash"], ["more", "ellipsis"], ["search", "magnifyingglass"], ["profile", "person"],
  ["credit card", "creditcard"], ["face id", "faceid"], ["qr code", "qrcode"], ["weather", "cloud"],
  ["filter", "line.3.horizontal.decrease"], ["plus circle fill", "plus.circle.fill"], ["square.and.arrow.up", "square.and.arrow.up"],
];
const UI_KIT = [
  ["tab bar", "Tab Bar - iPhone"], ["navigation bar", "Toolbar - Top - iPhone"], ["list row", "Row"], ["list", "Row"],
  ["alert", "Alert"], ["sheet", "Sheet - iPhone"], ["bottom sheet", "Sheet - iPhone"], ["toggle", "Toggle - Switch"],
  ["segmented control", "Segmented Control"], ["stepper", "Stepper"], ["action sheet", "Action Sheet"],
  ["share sheet", "Activity View"], ["activity indicator", 'Progress Bar - Indeterminate Circular ("Spinner")'],
  ["context menu", "Context Menu"], ["page control", "Page Control"], ["iPad sidebar", "Sidebar"],
  ["mac popup button", "Pop-Up Button"], ["mac window", "Windows - Composed"], ["tooltip", "Tooltip"],
  ["split view", ""], ["card", ""],
];

const failed = [];
const expect = (tool, query, got, wanted) => {
  if (got !== wanted) failed.push(`${tool} "${query}": got "${got}", expected "${wanted}"`);
};
for (const [q, want] of HIG) {
  const first = /^## (.+?) \(page "/m.exec(hig.lookupHig([q], 40000))?.[1] ?? "";
  expect("search_hig", q, first, want);
}
for (const [q, want] of SYMBOLS) expect("search_symbols", q, symbols.searchSymbols(q, 1)[0]?.name ?? "", want);
for (const [q, want] of UI_KIT) expect("search_ui_kit", q, uikit.findComponents(q).hits[0]?.c.name ?? "", want);

const total = HIG.length + SYMBOLS.length + UI_KIT.length;
if (failed.length) {
  console.error(`${failed.length} of ${total} ranking checks failed:\n  ${failed.join("\n  ")}`);
  process.exit(1);
}
console.log(`${total} ranking checks OK`);

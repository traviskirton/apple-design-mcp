// Connects to the server as a real MCP client and tries every tool.
// Usage: npm test                       (against `npm run dev` on this machine)
//        npm test -- https://HOST/mcp   (against the deployed server)
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = process.argv[2] ?? "http://127.0.0.1:8787/mcp";
const client = new Client({ name: "smoke-test", version: "0.7.0" });

function check(ok, what) {
  if (!ok) throw new Error(what);
}

async function call(name, args = {}) {
  const started = performance.now();
  const result = await client.callTool({ name, arguments: args });
  const text = result.content?.[0]?.text ?? "";
  const ms = Math.round(performance.now() - started);
  console.log(`\n${name} ${JSON.stringify(args)}  (${ms} ms, ${text.length} characters)`);
  return { text, isError: Boolean(result.isError) };
}

const firstLines = (text, n) => text.split("\n").slice(0, n).join("\n");

try {
  await client.connect(new StreamableHTTPClientTransport(new URL(url)));
  const info = client.getServerVersion();
  console.log(`connected to ${info?.name} ${info?.version} at ${url}`);

  const { tools } = await client.listTools();
  console.log("tools:", tools.map((t) => t.name).join(", "));
  for (const name of ["get_pack_info", "search_hig", "get_hig_page", "get_device_metrics", "get_device_frame", "search_symbols", "get_symbol", "get_technology_assets", "get_design_values"]) {
    check(tools.some((t) => t.name === name), `${name} is missing`);
  }

  const pack = await call("get_pack_info");
  console.log(pack.text);
  const parsed = JSON.parse(pack.text);
  check(!pack.isError && parsed.answered_at, "get_pack_info gave an unexpected result");
  check(parsed.sources?.[0]?.pages >= 100, "the guidelines pack looks empty");

  const search = await call("search_hig", { queries: ["tab bar", "sheet"], platforms: ["ios"] });
  console.log(search.text.split("\n").filter((line) => /^#{1,3} /.test(line)).join("\n"));
  check(!search.isError && search.text.includes('(page "tab-bars")'), 'search_hig did not return the "tab-bars" page');
  check(search.text.includes("### Best practices"), "search_hig should include section text");
  check(!search.text.includes("#### visionOS"), "search_hig should leave out other platforms' sections");

  const small = await call("search_hig", { queries: ["button"], max_chars: 3000 });
  check(small.text.length < 8000 && small.text.includes("Not included for size"), "search_hig should respect max_chars");

  const single = await call("search_hig", { query: "dark mode color" });
  check(!single.isError && single.text.includes('(page "dark-mode")'), "search_hig should still accept a single `query`");

  const nothing = await call("search_hig", { queries: ["zzqqxx"] });
  check(nothing.text.includes("No guideline sections match"), "search_hig should say when nothing matches");

  const outline = await call("get_hig_page", { page: "tab-bars" });
  console.log(firstLines(outline.text, 6));
  check(!outline.isError && outline.text.includes('"best-practices"'), "get_hig_page did not list the page's sections");

  const section = await call("get_hig_page", { page: "Tab bars", section: "best-practices" });
  console.log(firstLines(section.text, 5));
  check(!section.isError && section.text.includes("## Best practices"), "get_hig_page did not return the section");
  check(section.text.length < outline.text.length * 20, "a section should be much smaller than a page");

  const missing = await call("get_hig_page", { page: "no-such-page" });
  check(missing.isError && missing.text.includes("There is no guidelines page"), "a missing page should be an error");

  const sizes = await call("get_device_metrics", { devices: ["iPhone Duo", "iPad Pro 13"] });
  console.log(sizes.text.split("\n").filter((line) => /^\| i/.test(line)).join("\n"));
  check(!sizes.isError && sizes.text.includes("iPhone Duo, outer screen (closed) | 466 × 678"), "get_device_metrics did not return the iPhone Duo outer screen");
  check(sizes.text.includes("iPhone Duo, inner screen (open)"), "get_device_metrics did not return the iPhone Duo inner screen");
  check(/\| iPad Pro 13-inch [^|]*\| 1032 × 1376 \|/.test(sizes.text), "get_device_metrics did not return the 13-inch iPad Pro");

  const everyDevice = await call("get_device_metrics");
  check(everyDevice.text.includes("## iPhone") && everyDevice.text.includes("## iPad"), "get_device_metrics should list devices by kind");
  check(!everyDevice.text.includes("| iPhone 8 |"), "the default list should leave out devices the newest OS no longer supports");

  const noDevice = await call("get_device_metrics", { devices: ["nokia"] });
  check(noDevice.text.includes("No device matches"), "get_device_metrics should say when no device matches");

  const duo = await call("get_device_metrics", { devices: ["iPhone Duo"] });
  check(
    duo.text.includes("| iPhone Duo, outer screen (closed) | 0 | 34 | 0 | 84 |"),
    "get_device_metrics should give the iPhone Duo outer screen's portrait insets (top 0, bottom 34, left 0, right 84)",
  );

  const mini = await call("get_device_metrics", { devices: ["iPhone 13 mini"] });
  check(
    mini.text.includes("| iPhone 13 mini | 375 × 812 |") && mini.text.includes("| iPhone 13 mini | 50 | 34 | 0 | 0 |"),
    "get_device_metrics should list iPhone 13 mini at its layout size (375 × 812) with portrait insets top 50, bottom 34",
  );

  const frames = await call("get_device_frame", { devices: ["iPhone Duo"] });
  console.log(frames.text.split("\n").filter((line) => /^(###|Frame:|Screen:)/.test(line)).join("\n"));
  check(!frames.isError && frames.text.includes("### iPhone Duo, outer screen (closed)"), "get_device_frame did not return the iPhone Duo outer frame");
  check(frames.text.includes("### iPhone Duo, inner screen (open)"), "get_device_frame did not return the iPhone Duo inner frame");
  check(frames.text.includes("Screen: 466 × 678 points"), "the outer frame's screen should be 466 × 678 points");
  check(/<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/.test(frames.text), "a frame should come as an SVG with a viewBox");

  const noFrame = await call("get_device_frame", { devices: ["nokia"] });
  check(noFrame.isError && noFrame.text.includes("No frame is loaded"), "get_device_frame should say when it has no frame");

  const icons = await call("search_symbols", { queries: ["heart", "settings", "share"] });
  console.log(icons.text.split("\n").filter((line) => /^#{2,3} /.test(line)).join("\n"));
  check(!icons.isError && icons.text.includes("### heart\n"), 'search_symbols did not put "heart" first for "heart"');
  check(icons.text.includes("### gearshape") || icons.text.includes("### gear\n"), 'search_symbols did not find a gear for "settings"');
  check(icons.text.includes("### square.and.arrow.up"), 'search_symbols did not find the share symbol');
  if (icons.text.includes("<svg")) check(/<svg [^>]*viewBox="[^"]+"[^>]*>\s*<path /.test(icons.text), "a symbol's SVG should hold a viewBox and a path");
  else console.log("WARNING: no symbol shapes on this server (assets/symbols is empty); names only.");

  const named = await call("get_symbol", { names: ["heart.fill", "no.such.symbol"] });
  check(!named.isError && named.text.includes("### heart.fill"), "get_symbol did not return heart.fill");
  check(named.text.includes("There is no symbol with this name"), "get_symbol should say when a name does not exist");

  const art = await call("get_technology_assets", { technologies: ["Sign in with Apple", "AirPlay", "nokia"] });
  console.log(art.text.split("\n").filter((line) => /^#{2,3} /.test(line)).join("\n"));
  check(!art.isError && art.text.includes("## Sign in with Apple"), "get_technology_assets did not return Sign in with Apple");
  check(art.text.includes("## AirPlay"), "get_technology_assets did not return AirPlay");
  check(/```svg\n<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/.test(art.text), "technology artwork should come as SVG with a viewBox");
  check(art.text.includes('No artwork matches "nokia"'), "get_technology_assets should say what it could not find");

  const everyArt = await call("get_technology_assets");
  check(!everyArt.isError && everyArt.text.includes("| Technology | Artwork |"), "get_technology_assets should list everything without `technologies`");
  check(!everyArt.text.includes("<svg"), "the list of all artwork should not hold SVG");

  const values = await call("get_design_values");
  console.log(values.text.split("\n").filter((line) => /^#{2,3} /.test(line)).join("\n"));
  check(!values.isError && values.text.includes("## iOS and iPadOS 27 colors"), "get_design_values should default to iOS colors");
  check(values.text.includes("| Labels, Secondary | `secondaryLabel` | #3c3c4399 | #ebebf5b2 | #3c3c43cc | same |"), "the iOS secondary label color is missing or changed");
  check(values.text.includes("| Accents, Blue | `systemBlue` | #0088ff | #0091ff | #1e6ef4 | #5cb8ff |"), "the iOS system blue is missing or changed");
  check(values.text.includes("| Body | Regular | 17 | 22 | -0.43 | Semibold |"), "the iOS Body text style is missing or changed");
  check(values.text.includes("| Sheet Top Radius | 38 | 32 |"), "the iOS sizes table is missing");
  check(!values.text.includes("Fold Avoidance Region") && values.text.includes('topics ["layout"]'), "layout guides should be returned only when asked for");

  const duoGuides = await call("get_design_values", { topics: ["layout"] });
  check(!duoGuides.isError && duoGuides.text.includes("### iPhone Duo outer screen, portrait (466 × 678)"), "the iPhone Duo layout templates are missing");
  check(duoGuides.text.includes("| Fold Avoidance Region | 0 | 455.5 | 669 | 40 |"), "the fold avoidance region is missing or changed");
  check(duoGuides.text.includes("| Reserved Region | 382 | 0 | 84 | 169 |"), "the outer screen's reserved region is missing or changed");
  check(!duoGuides.text.includes("colors\n"), "topics should limit the reply to the tables named");

  const mac = await call("get_design_values", { platform: "macos", topics: ["text", "sizes"] });
  check(!mac.isError && mac.text.includes("| Body | Regular | 13 | 16 | 0 | Semibold |"), "the macOS Body text style is missing or changed");
  check(mac.text.includes("| Global, Height | 16 | 20 | 24 | 28 | 36 |"), "the macOS control heights are missing or changed");

  console.log("\nOK");
  await client.close();
} catch (err) {
  console.error("\nFAILED:", err.message ?? err);
  if (err.cause) console.error("cause:", err.cause.message ?? err.cause);
  process.exit(1);
}

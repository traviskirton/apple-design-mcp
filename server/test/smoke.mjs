// Connects to the server as a real MCP client and tries every tool.
// Usage: npm test                       (against `npm run dev` on this machine)
//        npm test -- https://HOST/mcp   (against the deployed server)
// Missing static files (symbol shapes, drawings, bezels) fail the test. Add --allow-missing-assets
// to only warn, for a server run from a copy without server/assets/.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const allowMissing = process.argv.includes("--allow-missing-assets");
const url = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://127.0.0.1:8787/mcp";
const client = new Client({ name: "smoke-test", version: "0.7.0" });

function check(ok, what) {
  if (!ok) throw new Error(what);
}

/** Static files the packs say exist are not served: a failure, unless --allow-missing-assets. */
function missing(what) {
  if (!allowMissing) throw new Error(`${what} (run with --allow-missing-assets to only warn)`);
  console.log(`WARNING: ${what}`);
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
  for (const name of ["get_pack_info", "search_hig", "get_hig_page", "get_device_metrics", "get_device_frame", "search_symbols", "get_symbol", "get_technology_assets", "get_design_values", "search_ui_kit", "get_design_brief"]) {
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
  // Beside Apple's bezels the vector frame comes as an address; without them, as the drawing itself.
  const frameUrl = /^SVG: (https?:\/\/\S+\/frames\/[^ ]+\.svg)$/m.exec(frames.text)?.[1];
  if (frameUrl) {
    check(!frames.text.includes("<svg"), "with bezels in the reply, the vector frame should come as an address, not inline");
    const res = await fetch(frameUrl);
    check(res.ok && res.headers.get("content-type")?.startsWith("image/svg+xml"), `the vector frame at ${frameUrl} should be served as SVG`);
    check(/<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/.test(await res.text()), "a served frame should be an SVG with a viewBox");
  } else {
    check(/<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/.test(frames.text), "a frame should come as an SVG with a viewBox");
  }
  const plain = await call("get_device_frame", { devices: ["iPhone SE"] });
  check(!plain.isError && /<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/.test(plain.text), "a device with no bezel should get its vector frame inline");

  const brief = await call("get_design_brief", { device: "Apple Watch Series 11", components: ["button"], icons: ["heart"] });
  check(!brief.isError && brief.text.includes("# Designing for watchOS") && !brief.text.includes("Designing for iOS"), "get_design_brief should give a watch only watchOS guidelines");
  check(brief.text.includes("<svg"), "get_design_brief should include drawings or symbols as SVG");

  const noFrame = await call("get_device_frame", { devices: ["nokia"] });
  check(noFrame.isError && noFrame.text.includes("No bezel or frame is loaded"), "get_device_frame should say when it has no frame");

  if (parsed.sources.some((s) => s.bezels > 0)) {
    check(frames.text.includes("### iPhone Duo, Apple's product bezel"), "get_device_frame did not return the iPhone Duo product bezel");
    check(/Outer Closed Portrait: picture \d+ × \d+ px; screen \d+ × \d+ px at x \d+, y \d+/.test(frames.text), "the iPhone Duo bezel should give its screen position");
    check(/\| [^|]+ \| Outer Closed Portrait \| https?:\/\/[^ |]+\/bezels\/iphone-duo-[a-z-]+-outer-closed-portrait\.png \|/.test(frames.text), "the iPhone Duo bezel should give the picture's address");
    const mac = await call("get_device_frame", { devices: ["MacBook Air 13", "iPhone 18 Pro"] });
    check(!mac.isError && mac.text.includes("### MacBook Air M5 13-inch, Apple's product bezel"), "get_device_frame did not find the 13-inch MacBook Air bezel");
    check(mac.text.includes("### iPhone 18 Pro, Apple's product bezel") && !mac.text.includes("### iPhone 18 Pro Max, Apple's product bezel"), '"iPhone 18 Pro" should return the Pro and not the Pro Max');
    const picture = /https?:\/\/[^ |]+\/bezels\/[a-z0-9-]+\.png/.exec(mac.text)?.[0];
    const head = picture ? await fetch(picture, { method: "HEAD" }) : null;
    if (head?.ok) check(head.headers.get("content-type") === "image/png", "a bezel picture should be served as image/png");
    else missing("the bezel pictures are not on this server (assets/bezels/ is built by npm run pack:bezels)");
  } else {
    console.log("bezels: no product bezels are loaded on this server");
  }

  const icons = await call("search_symbols", { queries: ["heart", "settings", "share"] });
  console.log(icons.text.split("\n").filter((line) => /^#{2,3} /.test(line)).join("\n"));
  check(!icons.isError && icons.text.includes("### heart\n"), 'search_symbols did not put "heart" first for "heart"');
  check(icons.text.includes("### gearshape") || icons.text.includes("### gear\n"), 'search_symbols did not find a gear for "settings"');
  check(icons.text.includes("### square.and.arrow.up"), 'search_symbols did not find the share symbol');
  if (icons.text.includes("<svg")) check(/<svg [^>]*viewBox="[^"]+"[^>]*>\s*<path /.test(icons.text), "a symbol's SVG should hold a viewBox and a path");
  else missing("no symbol shapes on this server (assets/symbols is empty)");

  const named = await call("get_symbol", { names: ["heart.fill", "no.such.symbol"] });
  check(!named.isError && named.text.includes("### heart.fill"), "get_symbol did not return heart.fill");
  check(named.text.includes("There is no symbol with this name"), "get_symbol should say when a name does not exist");

  const weighted = await call("get_symbol", { names: ["heart.fill"], weight: "semibold" });
  check(!weighted.isError && weighted.text.includes("### heart.fill"), "get_symbol with a weight did not return heart.fill");
  if (weighted.text.includes("this is the regular weight")) missing("no other weights on this server (assets/symbol-weights is empty)");
  else if (weighted.text.includes("<svg")) {
    check(weighted.text.includes("/symbols/semibold/heart.fill.svg") && weighted.text.includes("Each SVG is the semibold weight"), "a semibold symbol should say so and give its address");
    const regular = /```svg\n([\s\S]*?)\n```/.exec(named.text)?.[1];
    const semibold = /```svg\n([\s\S]*?)\n```/.exec(weighted.text)?.[1];
    check(regular && semibold && regular !== semibold, "the semibold shape should differ from the regular one");
    const res = await fetch(new URL("/symbols/semibold/heart.fill.svg", url));
    check(res.ok && (await res.text()).trim() === semibold.trim(), "the semibold address should serve the same SVG");
  }

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

  const kit = await call("search_ui_kit", { queries: ["tab bar", "large title toolbar", "mac sidebar", "watch button", "checkbox", "zebra crossing"] });
  check(!kit.isError && kit.text.includes("### Tab Bar - iPhone\n"), 'search_ui_kit did not put "Tab Bar - iPhone" first for "tab bar"');
  check(kit.text.includes("Variants (24): Minimized = False / True; Tabs = 2 / 3 / 4 / 5;"), "the tab bar's variants are missing or changed");
  check(kit.text.includes("### Toolbar - Top - iPhone\n") && kit.text.includes("Shown: Style=Large Title, 402 × 125 points."), 'search_ui_kit should show the Large Title variant for "large title toolbar"');
  check(kit.text.includes('### Sidebars - Composed\n\nmacOS 27 kit, page "Sidebars".'), 'search_ui_kit should read "mac sidebar" from the macOS kit');
  check(kit.text.includes("### Button - Pill\n\nwatchOS 26 kit"), 'search_ui_kit should read "watch button" from the watchOS kit');
  check(kit.text.includes("### Toggles - Checkboxes\n\nmacOS 27 kit"), 'search_ui_kit should find "checkbox" in the macOS kit when the iOS kit has none');
  check(kit.text.includes('## "zebra crossing"\n\nNo component of the iOS and iPadOS 27 kit matches.'), "search_ui_kit should say when nothing matches");
  const duoBars = await call("search_ui_kit", { queries: ["iPhone Duo vertical toolbar", "iPhone Duo tab bar 4 tabs"] });
  check(duoBars.text.includes("### _Buttons - 48pt\n") && duoBars.text.includes("Shown: Type=Button Group, Preferred Axis=Vertical, 48 × 164 points."), 'search_ui_kit should give the vertical button group for "iPhone Duo vertical toolbar", not the horizontal toolbar');
  check(duoBars.text.includes("### Tab Bar - iPhone Duo\n") && duoBars.text.includes("Shown: Minimized=False, Tabs=4, Type=Default, 48 × 210 points."), 'search_ui_kit should show the 4-tab variant for "4 tabs"');
  if (kit.text.includes("```text")) {
    check(kit.text.includes("- Tab Bar Buttons: frame; 180 × 54; fills width; row; gap -8;"), "the tab bar's outline is missing or changed");
    // Asked alone: among six queries with drawings, the parts are the first thing left out for size.
    const alone = await call("search_ui_kit", { queries: ["tab bar"] });
    check(alone.text.includes("#### _Tab Bar Button - iPhone [Selected=True], 72 × 54"), "the tab bar's parts are missing");
    check(kit.text.includes("with Symbol SF Symbol diamond.fill, Label \"Tab 1\""), "an icon in an outline should be given by its SF Symbols name");
  } else {
    check(kit.text.includes("The outline files are not deployed on this server"), "search_ui_kit should say when the outline files are missing");
    console.log("search_ui_kit: no outline files on this server (assets/ui-kit/ is built by npm run pack:ui-kit)");
  }

  // Apple's drawings: one SVG per variant, exported from Figma by scripts/export-ui-kit-svg.mjs.
  const drawn = await call("search_ui_kit", { queries: ["tab bar", "toggle"] });
  if (drawn.text.includes("```svg")) {
    check(/Apple's drawing of it, also at \S+\/ui-kit-svg\/ios\/3-72207\.svg\. Place it as it is; only change its icons and labels:\n\n```svg\n<svg overflow="visible" width="402" height="95"/.test(drawn.text), "the tab bar's drawing should be in the reply, at the component's own size");
    check(drawn.text.includes('data-symbol="diamond.fill"'), "an icon in a drawing should be a shape marked with its SF Symbols name");
    check(/<text id="Label"[^>]*font-family="SF Pro, -apple-system, system-ui, sans-serif"[^>]*><tspan[^>]*>Tab 1<\/tspan><\/text>/.test(drawn.text), "a label in a drawing should stay text, with fallback fonts");
    check(drawn.text.includes("Using a drawing:") && drawn.text.includes("27-68922.svg"), "the reply should say how to use a drawing and name the other variants' files");
    const address = /at (\S+\/ui-kit-svg\/ios\/3-72207\.svg)/.exec(drawn.text)?.[1];
    const file = address ? await fetch(address.replace(/^https?:\/\/[^/]+/, new URL(url).origin)) : null;
    check(file?.ok && (file.headers.get("content-type") ?? "").includes("svg"), "a drawing should be served at its address as SVG");
    // A query that names a variant gets its drawing into the reply before one that names none.
    const named = await call("search_ui_kit", { queries: ["stepper", "tab bar 5 tabs search role"], max_chars: 16000 });
if (named.text.includes("```svg")) {
          check(/Shown: Minimized=False, Tabs=5, Type=Search Role, 402 × 95 points\.\n\nApple's drawing of it, also at \S+\. Place it as it is; only change its icons and labels:\n\n```svg/.test(named.text), "the variant a query names should be in the reply as SVG");
      check(/### Stepper\n[\s\S]*?more than this reply has room for/.test(named.text), "the drawing no query word chose should give way and come by its address");
    } else console.log("search_ui_kit: the drawings for the named-variant check are not on this server");
    const tiny = await call("search_ui_kit", { queries: ["tab bar"], max_chars: 2000 });
    check(tiny.text.length < 5000, "search_ui_kit should keep a small max_chars close: an outline that does not fit is cut");
    const small = await call("search_ui_kit", { queries: ["tab bar", "alert"], max_chars: 6000 });
    check(!small.text.includes("```svg") && small.text.includes("more than this reply has room for"), "a drawing that does not fit should be given by its address");
  } else {
    check(drawn.text.includes("not on this server"), "search_ui_kit should say when the drawings are missing");
    missing("search_ui_kit: no drawings on this server (assets/ui-kit-svg/ is built by node scripts/export-ui-kit-svg.mjs)");
  }

  const everyComponent = await call("search_ui_kit", { platform: "macos" });
  check(!everyComponent.isError && everyComponent.text.includes("## macOS 27 kit: components by page"), "search_ui_kit should list a kit's components without `queries`");
  check(!everyComponent.text.includes("```text"), "the component list should not hold outlines");

  console.log("\nOK");
  await client.close();
} catch (err) {
  console.error("\nFAILED:", err.message ?? err);
  if (err.cause) console.error("cause:", err.cause.message ?? err.cause);
  process.exit(1);
}

# server

The MCP server, written in TypeScript for Cloudflare Workers.

It serves Apple's Human Interface Guidelines, the screen sizes and frames of Apple devices, SF Symbols as SVG, Apple's artwork for its technologies, and Apple's UI kits: their colors, text styles and sizes, and the construction of every component.

| Tool | What it does |
| --- | --- |
| `search_hig` | Takes a list of topics (components, patterns, devices) and returns the guideline text for all of them in one reply. A topic that names a page returns that page; other topics return the best-matching sections. |
| `get_hig_page` | Reads one page or section by id, for anything `search_hig` listed but left out for size. |
| `get_device_metrics` | Returns the screen size of the named devices in points and pixels, with scale, pixels per inch, corner radius and whether the device has a Dynamic Island. Without names it lists every current device. A folding device has one row per screen. |
| `get_device_frame` | Returns Apple's pictures of a device, to show a design inside it: Apple's product bezels (photographic PNGs in each finish and orientation, with the position of the see-through screen) and a flat vector frame as SVG from Xcode's Simulator. A folding device returns one picture per pose. |
| `search_symbols` | Takes a list of icons to find (names or plain words such as "share") and returns, for each, the best-matching SF Symbol with its SVG and the names of other matches. |
| `get_symbol` | Returns the SVG of symbols by exact name. |
| `get_technology_assets` | Returns Apple's own artwork for its technologies (the Sign in with Apple logo, AirPlay glyphs, Game Center icons and others): SVG for vector artwork, a PNG address for pictures. Without names it lists everything it holds. |
| `get_design_values` | Returns the values Apple defines in its UI kits for iOS and iPadOS 27 and for macOS 27: system colors as hex (light, dark, increased contrast), text styles, standard sizes, materials and Liquid Glass settings. With `topics: ["layout"]` it returns Apple's layout guides for iPhone Duo. |
| `search_ui_kit` | Takes a list of components (plain words such as "tab bar" or "iPad sidebar") and returns, for each, the best-matching component of Apple's UI kit for iOS and iPadOS 27, macOS 27 or watchOS 26: its variants and properties, an outline of its layers with sizes, auto layout, corner radii, colors and text styles, and the outlines of the parts it is built from. Without queries it lists a kit's components. |
| `get_pack_info` | Reports what material is loaded, its date, and when the server answered. |

`search_hig` answers a whole brief in one call because each tool call costs the app a full turn of the model, which is slow. Its reply is limited to about 40,000 characters (roughly 10,000 tokens) by default, leaves out link lists, change logs and sections written for other platforms, and lists by id whatever did not fit. Pictures are replaced by Apple's own description of each one.

The server is stateless. Each request builds a fresh server and gets a plain JSON answer, so there is no storage, no session and no sign-in. The guidelines are compiled into the Worker, so a tool call makes no network request.

## The guidelines pack

`scripts/build-hig-pack.mjs` downloads every guidelines page from developer.apple.com (about 160 pages, under a minute), splits each at its headings, builds the search index, and writes `src/pack/hig.js`. That file is not committed.

- The first `npm run dev` or `npx wrangler deploy` builds the pack if it is missing.
- `npm run pack` rebuilds it. Do that before a deploy to pick up Apple's changes.

`get_pack_info` shows the date the pack was built, so you can tell what the live server holds.

## The device pack

`scripts/build-device-pack.mjs` reads the device types that Xcode's simulators define (`xcrun simctl list devicetypes`, then each type's `capabilities.plist` and `profile.plist`) and writes `src/pack/devices.js`. It needs a Mac with Xcode, so unlike the guidelines pack the result is committed, and the server can be deployed from any machine.

- `npm run pack:devices` rebuilds it. Do that after installing a new Xcode, then commit the file.
- `node scripts/build-device-pack.mjs --dump Duo` prints everything Xcode holds for the device types whose name contains "Duo".

- `npm run pack:safe-areas` applies `scripts/safe-areas.json` to the committed pack without Xcode.

Xcode's files hold no safe-area insets, so they are measured: `extractor/measure-safe-areas.py` runs a small probe app in temporary simulators (named "apple-mcp-temp …", deleted afterwards) and writes `scripts/safe-areas.json`, which the pack builder merges in. iPad landscape insets, the iPhone Duo's inner screen and devices without an installed runtime have no measurement. iPhone 12 mini and 13 mini are listed at the size apps are laid out at (375 × 812 points), which is larger than their pixels ÷ scale.

Nothing holds the position of the Dynamic Island or cameras, or fold and hinge positions. The tool's reply says so, and sends the model to the guidelines for those.

## The bezel pack

Apple publishes product bezels on its design resources page: photographic pictures of each device with an empty screen, as PNG and Photoshop files. `../scripts/fetch_apple_design_resources.py --only bezel --extract` downloads and unpacks them on a Mac (1.9 GB, of which the PNGs are 134 MB), and `scripts/build-bezel-pack.mjs` turns the PNGs into:

- `src/pack/bezels.js`: every picture's model, finish, pose, size in pixels and the position of its screen. Committed, and compiled into the Worker.
- `assets/bezels/ID.png`: the pictures, public at `/bezels/ID.png`. Not committed, so a deploy from a machine without this folder leaves their addresses broken.

- `npm run pack:bezels` rebuilds both. The downloads do not say where the screen is, so the builder measures it: the screen is the see-through area that the device encloses (`scripts/png-alpha.mjs`, a PNG reader without dependencies).

`get_device_frame` returns the bezels of a device ahead of the Simulator's vector frame. Macs, the iMac and the Studio Displays have bezels and no vector frame.

## The symbol pack

SF Symbols come in two parts, both written by the extractor on a Mac (see `../extractor`):

- `src/pack/symbols.js`: every symbol's name, release year, categories, Apple's search keywords and usage restriction. Committed, and compiled into the Worker.
- `src/pack/symbol-index.js`: the search index over symbols.js, written by `npm run pack:symbol-index` (the extractor runs it). Committed; prebuilt so the Worker starts faster.
- `assets/symbols/NAME.svg`: one file per symbol with its regular-weight shape. Not committed. Wrangler uploads the `assets` folder with each deploy, the server reads a file when a tool asks for that symbol, and each file is also public at `/symbols/NAME.svg`.

A deploy from a machine where `assets/symbols` is empty removes the shapes from the live server; the tools then return names only. Deploy from the Mac that ran the extractor.

## The technology pack

Apple publishes artwork for showing its technologies in an app (Sign in with Apple, AirPlay, ARKit, Game Center, HomeKit, Apple Health, Siri, Add Apple Watch Face) as disk images on its design resources page. `../scripts/fetch_apple_design_resources.py --only Technologies --extract` downloads and unpacks them on a Mac, and `scripts/build-technology-pack.mjs` turns them into:

- `src/pack/technologies.js`: every artwork's id, name and size, with the SVG itself for vector artwork. Committed, and compiled into the Worker. Where Apple gives only a PDF, or an SVG that needs one of Apple's fonts, the SVG is converted from the PDF by the extractor.
- `assets/technologies/ID.svg` and `ID.png`: the same artwork as static files, public at `/technologies/ID.svg`. Not committed. Pictures (app icons, the Siri icons) exist only here, so a deploy from a machine without this folder leaves their addresses broken.

- `npm run pack:technologies` rebuilds both after `fetch_apple_design_resources.py` reports a change.

Apple Pay, Wallet and the other technologies that Apple publishes as Figma and Sketch templates only are not loaded.

## Design values

Apple's UI kits for Figma define the system colors, text styles and standard sizes as variables and styles. `scripts/figma/` holds text dumps of those for the iOS and iPadOS 27 kit and the macOS 27 kit, and of the iOS kit's "Layout Guides" page. `scripts/figma/README.md` says how each dump was made. `scripts/build-design-values.mjs` turns them into:

- `src/pack/design-values.js`: per platform, the colors (light, dark, increased contrast, and the UIKit or AppKit name where the color is a system color), the text styles at the default size, the sizes table, the material paints, the Liquid Glass settings and the iPhone Duo layout templates. Committed, and compiled into the Worker.

- `npm run pack:values` rebuilds it; it needs no Mac. The build stops if the kit's accent colors, grays or default text styles disagree with the guidelines pack. The kit's Dynamic Type table is left out because it disagrees with the guidelines at some accessibility sizes; `search_hig` holds the published table.

## The UI kit pack

Apple's UI kits for Figma hold its standard components: toolbars, tab bars, lists, alerts, sheets, keyboards, windows and whole example screens. A kit saved from Figma as a local copy (File, Save local copy) is a `.fig` file. `scripts/fig-dump.mjs` reads that format without any dependency, and `scripts/build-ui-kit-pack.mjs` reads every `.fig` file in `../apple-resources/` (not committed) and turns the kits into:

- `src/pack/ui-kit.js`: every component of every kit with its page, variants, properties, sizes, guidelines page and the components it uses. Committed, and compiled into the Worker (about 490 KB).
- `assets/ui-kit/KIT/ID.txt`: one text file per component with the outline of each variant's layers. Not committed; a deploy from a machine without this folder leaves `search_ui_kit` with names, properties and sizes only.

- `npm run pack:ui-kit` rebuilds both. It needs the `.fig` files and Node 22.15 or later, and no Mac.
- `assets/ui-kit-svg/KIT/NODE.svg`: Apple's drawing of every variant, which is what `search_ui_kit` hands over as the component. Not committed; without this folder the tool returns outlines only. `node scripts/export-ui-kit-svg.mjs` writes it, and `npm run pack:ui-kit` afterwards counts the drawings into the pack.

The drawings come from Figma itself, through its REST API, because only Figma renders a kit's components exactly. The export needs a Figma personal access token with "File content: Read-only" in `~/.config/apple-mcp/figma-token` or in `FIGMA_TOKEN` (the file is tried first, and the script says which one Figma accepted), and `scripts/figma/kit-files.json` with the file key of a copy of each kit in the token owner's Figma account. It asks for 40 variants at a time, skips the ones already on disk, and can be stopped and started again. Each SVG has the component's own size (a shadow reaches past its box), the layers' names as ids and labels as text. Figma writes an SF Symbol as a private-use character that shows only where Apple's fonts are installed, so the script exports those variants a second time with outlined text and puts each symbol's outline in place of its character, marked `data-symbol` with the symbol's name. The watchOS kit has no drawings until a copy of it is in Figma.

Figma writes Liquid Glass into SVG with blends that browsers do not draw: stacked fills with blend modes inside a filtered group, and shadows that blend "plus darker" or "plus lighter". As exported, Chrome shows a tab bar dark gray and an alert with black bands. `scripts/svg-for-browsers.mjs` rewrites those parts (the header of the file says how), and the export reports any variant that still holds one. Checked against Figma's own pictures of the tab bar and the alert on white: the colors are within 3 percent. Not carried over: the glass's refraction and bright edge, which SVG cannot hold. `npm run test:svg` checks the rewriting and the symbol merge.

Figma writes a photo, wallpaper or app icon into an SVG as base64 text, once per SVG; the two kits' drawings came to 1.5 GB that way, with 30 files past Cloudflare's 25 MiB limit for a static file. `scripts/svg-images.mjs` moves each picture into one file in `assets/ui-kit-svg/img/`, named by the hash of its bytes, and the SVG points to it by its full address on the deployed Worker (`--origin`, for a deploy of your own). The export does this for each file it writes; `node scripts/svg-images.mjs` does it for the files already on disk. An SVG shown through an `img` element may not load other files, so its pictures show only when the SVG is put into the page. Two wallpapers are over 25 MiB even as single files; `node scripts/shrink-pictures.mjs` writes any PNG over 16 MiB again (8 bits a channel, tightly packed), halves its pixel size if that is not enough, and keeps its name, so the SVGs need no change.

Figma's API cannot write a layer with the plus-darker blend mode (it reports it as LINEAR_BURN), or layers shown through a mask under one, as shapes: it writes a small PNG in their place. Most labels and symbols on glass in Apple's kits are made that way, so 492 drawings came out with icons and titles as pictures. `node scripts/redraw-flattened.mjs`, run after the export, reads those drawings' layers, exports the layers under each picture one by one (alone they are plain shapes and text) and puts them where the picture was: symbols as outlines marked `data-symbol`, labels as text, a selected tab's content in its tint color.

`node scripts/build-ui-kit-gallery.mjs` writes `assets/ui-kit-svg/index.html`, a page that shows every component's drawing on a background you choose. After a deploy it is at `/ui-kit-svg/` on the server.

A component with light and dark variants is stored once, in light; `get_design_values` gives the dark value of each color. Variants with the same layers share one outline. An outline stops at 90 lines and 9 levels and does not go into instances; the reply adds the outlines of the instances' components as "Parts". An icon in an outline is given by its SF Symbols name. Apple publishes no table of the symbols' code points, so `scripts/figma/symbol-codepoints.txt` holds the names of the ones the kits use, found by comparing shapes (`scripts/symbol-glyphs/`, Mac only); the build lists any code point the table lacks. Not read yet: vector shapes. The kit's "Internal Only Canvas", "Product Bezels" and "App Icons" pages are left out.

## Deploy

Needs Node 20 or later (`node --version`) and a free Cloudflare account.

```sh
cd server
npm install
npx wrangler login     # opens a browser page; click Allow (once per machine)
npm run pack           # optional: refresh the guidelines from Apple
npx wrangler deploy
```

The first deploy may ask you to pick a `workers.dev` subdomain. The last lines of the output show the address, which looks like `https://apple-design-mcp.YOUR-SUBDOMAIN.workers.dev`. The MCP URL is that address plus `/mcp`.

Check it from the terminal:

```sh
npm test -- https://apple-design-mcp.YOUR-SUBDOMAIN.workers.dev/mcp
```

It should print the tool list, each tool's answer and `OK`.

## Test it in each app

Add the MCP URL as a custom connector, start a new chat, and ask: "Use the Apple Design connector to get the pack info." It passes if the reply quotes an `answered_at` time within the last minute, since that can't be guessed. After a deploy that adds tools, an app may keep its old tool list until the connector is refreshed or removed and added again.

Menu names change, so treat these as starting points:

| App | Where to add it | Works? |
| --- | --- | --- |
| claude.ai (web) | Settings, Connectors, Add custom connector | Yes (2026-11-18) |
| Claude desktop app | Same account setting as claude.ai | |
| Claude iPhone app | Uses connectors added on claude.ai | |
| claude.ai/design | Uses connectors added on claude.ai | Yes (2026-11-18) |
| chatgpt.com | Settings, Apps and connectors; may need Developer mode turned on | |

Write down which plan each account is on, because custom connectors are limited to some plans.

## See what apps call

Every tool call writes one log line: the tool, its inputs, the size of the reply and the calling app's name.

```sh
npx wrangler tail
```

Leave that running, use the connector in an app, and each call appears within a second or two as a line such as `{"tool":"search_hig","args":{"queries":["tab bar"]},"reply_chars":5123,"error":false,"app":"..."}`. Press Control-C to stop. The Cloudflare dashboard shows past calls under the worker's Logs tab.

## Run it on your own machine

```sh
npm run dev        # serves http://127.0.0.1:8787/mcp
npm test           # in a second terminal
```

## Files

- `src/index.ts`: the server and its tool definitions.
- `src/hig.ts`: search and page lookup over the pack.
- `src/terms.js`: how text is cut into search words; shared by the pack builder and the search.
- `src/pack/hig.d.ts`: the shape of the generated pack. `src/pack/hig.js` is the pack itself.
- `scripts/build-hig-pack.mjs`: builds the pack from Apple's site.
- `src/devices.ts`: device lookup. `src/pack/devices.js` is the device pack and `src/pack/devices.d.ts` its shape.
- `scripts/build-device-pack.mjs`: builds the device pack from Xcode's simulator files (Mac only).
- `src/bezels.ts`: product bezel lookup. `src/pack/bezels.js` is the pack (written on a Mac, committed) and `src/pack/bezels.d.ts` its shape.
- `src/frames.ts`: device frames. `src/pack/frames.js` is the frame pack (written by the extractor on a Mac, committed) and `src/pack/frames.d.ts` its shape.
- `src/symbols.ts`: symbol search. `src/pack/symbols.js` is the symbol pack and `src/pack/symbols.d.ts` its shape.
- `src/technologies.ts`: technology artwork lookup. `src/pack/technologies.js` is the pack (written on a Mac, committed) and `src/pack/technologies.d.ts` its shape.
- `src/values.ts`: the design value tables. `src/pack/design-values.js` is the pack (built from `scripts/figma/`, committed) and `src/pack/design-values.d.ts` its shape.
- `src/uikit.ts`: UI kit component search. `src/pack/ui-kit.js` is the pack (committed) and `src/pack/ui-kit.d.ts` its shape.
- `scripts/fig-dump.mjs`: reads a Figma local copy (.fig). `scripts/build-ui-kit-pack.mjs` builds the UI kit pack with it.
- `assets/`: static files deployed with the Worker; `assets/symbols/` holds the symbol shapes, `assets/technologies/` Apple's technology artwork, `assets/bezels/` the product bezels, `assets/ui-kit/` the component outlines and `assets/ui-kit-svg/` Apple's drawings of the components.
- `test/smoke.mjs`: connects as a real MCP client and tries every tool.
- `wrangler.jsonc`: Cloudflare settings. `name` sets the first part of the URL.

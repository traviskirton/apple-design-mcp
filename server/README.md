# server

The MCP server, written in TypeScript for Cloudflare Workers.

It serves Apple's Human Interface Guidelines, the screen sizes of Apple devices, and SF Symbols as SVG. UI kits, device frames and design values are not loaded yet.

| Tool | What it does |
| --- | --- |
| `search_hig` | Takes a list of topics (components, patterns, devices) and returns the guideline text for all of them in one reply. A topic that names a page returns that page; other topics return the best-matching sections. |
| `get_hig_page` | Reads one page or section by id, for anything `search_hig` listed but left out for size. |
| `get_device_metrics` | Returns the screen size of the named devices in points and pixels, with scale, pixels per inch, corner radius and whether the device has a Dynamic Island. Without names it lists every current device. A folding device has one row per screen. |
| `get_device_frame` | Returns the drawing of a device's body as SVG, with the position of the screen inside it. A folding device returns one frame per screen. |
| `search_symbols` | Takes a list of icons to find (names or plain words such as "share") and returns, for each, the best-matching SF Symbol with its SVG and the names of other matches. |
| `get_symbol` | Returns the SVG of symbols by exact name. |
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

## The symbol pack

SF Symbols come in two parts, both written by the extractor on a Mac (see `../extractor`):

- `src/pack/symbols.js`: every symbol's name, release year, categories, Apple's search keywords and usage restriction. Committed, and compiled into the Worker.
- `src/pack/symbol-index.js`: the search index over symbols.js, written by `npm run pack:symbol-index` (the extractor runs it). Committed; prebuilt so the Worker starts faster.
- `assets/symbols/NAME.svg`: one file per symbol with its regular-weight shape. Not committed. Wrangler uploads the `assets` folder with each deploy, the server reads a file when a tool asks for that symbol, and each file is also public at `/symbols/NAME.svg`.

A deploy from a machine where `assets/symbols` is empty removes the shapes from the live server; the tools then return names only. Deploy from the Mac that ran the extractor.

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
- `src/frames.ts`: device frames. `src/pack/frames.js` is the frame pack (written by the extractor on a Mac, committed) and `src/pack/frames.d.ts` its shape.
- `src/symbols.ts`: symbol search. `src/pack/symbols.js` is the symbol pack and `src/pack/symbols.d.ts` its shape.
- `assets/`: static files deployed with the Worker; `assets/symbols/` holds the symbol shapes.
- `test/smoke.mjs`: connects as a real MCP client and tries every tool.
- `wrangler.jsonc`: Cloudflare settings. `name` sets the first part of the URL.

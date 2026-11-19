# server

The MCP server, written in TypeScript for Cloudflare Workers.

It serves Apple's Human Interface Guidelines through three tools. SF Symbols, UI kits, device frames and design values are not loaded yet.

| Tool | What it does |
| --- | --- |
| `search_hig` | Finds the guideline sections that cover a component, pattern, device or platform. Returns section ids with a short quote. |
| `get_hig_page` | With a page id, returns the page's summary and a list of its sections. With a section id too, returns that section's text. |
| `get_pack_info` | Reports what material is loaded, its date, and when the server answered. |

Pages are split into sections because the quality test found that reading whole pages cost two to three times the tokens. Pictures are replaced by Apple's own description of each one.

The server is stateless. Each request builds a fresh server and gets a plain JSON answer, so there is no storage, no session and no sign-in. The guidelines are compiled into the Worker, so a tool call makes no network request.

## The guidelines pack

`scripts/build-hig-pack.mjs` downloads every guidelines page from developer.apple.com (about 160 pages, under a minute), splits each at its headings, builds the search index, and writes `src/pack/hig.js`. That file is not committed.

- The first `npm run dev` or `npx wrangler deploy` builds the pack if it is missing.
- `npm run pack` rebuilds it. Do that before a deploy to pick up Apple's changes.

`get_pack_info` shows the date the pack was built, so you can tell what the live server holds.

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
- `test/smoke.mjs`: connects as a real MCP client and tries every tool.
- `wrangler.jsonc`: Cloudflare settings. `name` sets the first part of the URL.

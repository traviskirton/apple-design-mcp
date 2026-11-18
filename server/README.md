# server

The MCP server, written in TypeScript for Cloudflare Workers.

This is milestone 0: a connection test. It has one tool, `get_pack_info`, and no Apple data yet. Its job is to answer one question before anything else gets built: can claude.ai, the Claude apps, chatgpt.com and claude.ai/design all use a server at one URL?

The server is stateless. Each request builds a fresh server and gets a plain JSON answer, so there is no storage, no session and no sign-in.

## Deploy

Needs Node 20 or later (`node --version`) and a free Cloudflare account.

```sh
cd server
npm install
npx wrangler login     # opens a browser page; click Allow
npx wrangler deploy
```

The first deploy may ask you to pick a `workers.dev` subdomain. The last lines of the output show the address, which looks like `https://apple-design-mcp.YOUR-SUBDOMAIN.workers.dev`. The MCP URL is that address plus `/mcp`.

Check it from the terminal:

```sh
npm test -- https://apple-design-mcp.YOUR-SUBDOMAIN.workers.dev/mcp
```

It should print the tool list, the tool's answer and `OK`.

## Test it in each app

Add the MCP URL as a custom connector, start a new chat, and ask: "Use the apple-design connector to get the pack info." It passes if the reply quotes `"status": "placeholder"` and an `answered_at` time within the last minute, since neither can be guessed.

Menu names change, so treat these as starting points:

| App | Where to add it | Works? |
| --- | --- | --- |
| claude.ai (web) | Settings, Connectors, Add custom connector | |
| Claude desktop app | Same account setting as claude.ai | |
| Claude iPhone app | Uses connectors added on claude.ai | |
| claude.ai/design | See whether the connector shows up in its tool list | |
| chatgpt.com | Settings, Apps and connectors; may need Developer mode turned on | |

Write down which plan each account is on, because custom connectors are limited to some plans.

## Run it on your own machine

```sh
npm run dev        # serves http://127.0.0.1:8787/mcp
npm test           # in a second terminal
```

## Files

- `src/index.ts`: the whole server.
- `test/smoke.mjs`: connects as a real MCP client, lists tools, calls `get_pack_info`.
- `wrangler.jsonc`: Cloudflare settings. `name` sets the first part of the URL.

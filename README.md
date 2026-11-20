# Apple Design MCP

A free remote MCP server that gives AI assistants Apple's design material: the Human Interface Guidelines, every SF Symbol, Apple's iOS and macOS UI kit components, device screen sizes and frames, and Apple's technology artwork. With it, an assistant places Apple's own symbols, components and frames instead of guessing them.

```
https://apple-design-mcp.com/mcp
```

No install, no sign-in, no API key. Site: [apple-design-mcp.com](https://apple-design-mcp.com).

## Set it up

| Client | How |
| --- | --- |
| **Claude** (chat, projects, desktop and mobile apps) | Settings → Connectors → **Add custom connector**. Name it "Apple Design" and paste the URL. |
| **Claude Code** | `claude mcp add --transport http apple-design https://apple-design-mcp.com/mcp` |
| **Cursor** | In `~/.cursor/mcp.json`: `{ "mcpServers": { "apple-design": { "url": "https://apple-design-mcp.com/mcp" } } }` |
| **VS Code** | In `.vscode/mcp.json`: `{ "servers": { "apple-design": { "type": "http", "url": "https://apple-design-mcp.com/mcp" } } }` |
| **ChatGPT** (Plus, Pro, Business, Enterprise, on the web) | [chatgpt.com/plugins](https://chatgpt.com/plugins) → **+** → **Add custom MCP server**. Paste the URL under Server URL, choose No authentication, then create and install the plugin. If **+** doesn't offer it, turn on Developer mode at [chatgpt.com/settings/security](https://chatgpt.com/settings/security). |
| **Perplexity** (Pro, Max, Enterprise) | Plugins → **Add custom → Connector → Add MCP connector** → Remote. Paste the URL, Authentication None, Transport Streamable HTTP. |
| **Grok** | [grok.com/connectors](https://grok.com/connectors) → **New Connector** → Custom. Paste the URL under Server URL. |
| **Anything else** | Add the URL as a remote MCP server. No authentication. |

Then try: *Design the recipe detail screen of a cooking app for iPhone Duo, closed and open.*

### Agent skill and Claude Code plugin

`plugin/skills/apple-design/SKILL.md` tells an agent when to use the server and how: one `get_design_brief` call per device, Apple's SVGs placed as they are in mockups, and the system's own components in SwiftUI, UIKit and AppKit code.

- **Claude Code:** `/plugin marketplace add traviskirton/apple-design-mcp`, then `/plugin install apple-design@apple-design-mcp`. This installs the skill and connects the server.
- **claude.ai and the Claude apps:** download [apple-design-skill.zip](https://apple-design-mcp.com/apple-design-skill.zip) and upload it under Settings → Capabilities → Skills. Add the server separately as a custom connector.

## What's inside

- **9,184 SF Symbols**, as SVG in all 9 weights.
- **2,310 components** from Apple's UI kits for iOS and iPadOS 27 and macOS 27 (watchOS coming), as Apple's own drawings with their measurements.
- **210 product bezels** from Apple's design resources, plus vector frames from Xcode's Simulator.
- **Screen sizes and safe areas** for every current device, including both screens of iPhone Duo.
- **The Human Interface Guidelines**, all pages, searchable.
- **Design values:** system colors (light, dark, increased contrast), text styles, standard sizes, materials and Liquid Glass settings.
- **Technology artwork:** Sign in with Apple, AirPlay, Game Center and others.

## Tools

| Tool | What it does |
| --- | --- |
| `get_design_brief` | One call for a device's whole screen: its size, the guidelines, Apple's drawings of the components, the icons and the system values. |
| `search_hig` | The guideline text for a list of components, patterns and devices, in one reply. |
| `get_hig_page` | One guidelines page or section by id. |
| `get_device_metrics` | Screen sizes in points and pixels, scale, corner radius, Dynamic Island, safe areas. |
| `get_device_frame` | Apple's product bezels and a vector frame to show a design inside a device. |
| `search_symbols` / `get_symbol` | SF Symbols as SVG, by plain words or exact name. |
| `search_ui_kit` | Apple's UI kit components with their layers, sizes, colors and text styles. |
| `get_design_values` | System colors, text styles, standard sizes, materials, Liquid Glass and iPhone Duo layout guides. |
| `get_technology_assets` | Apple's artwork for its technologies. |
| `get_pack_info` | What material is loaded and its date. |

`server/README.md` describes each tool and how its data is built.

## Repository

| Folder | What it holds |
| --- | --- |
| `server/` | The MCP server: TypeScript on Cloudflare Workers. Its `assets/` folder also serves the website at apple-design-mcp.com. |
| `extractor/` | A Swift tool that reads SF Symbols on a Mac and writes the server's symbol data. |
| `plugin/` | The agent skill and the Claude Code plugin. |
| `scripts/` | `fetch_apple_design_resources.py`, which downloads Apple's design resources (bezels, technology artwork) for the packs. |
| `quality-test/` | The test that came before the server: does Claude write better SwiftUI with this material? |

### Run it

```sh
cd server
npm install
npm run dev        # local server at http://localhost:8787/mcp
npm run check      # types, SVG, ranking and coverage tests
npx wrangler deploy
```

Run `npm run pack` before a deploy to pick up Apple's latest guidelines.

### Download Apple's design resources

`scripts/fetch_apple_design_resources.py` downloads the files on [Apple's design resources page](https://developer.apple.com/design/resources/) into `apple-resources/` (ignored by git) and keeps them current. Run it on a Mac:

```sh
python3 scripts/fetch_apple_design_resources.py --list                 # show what the page offers
python3 scripts/fetch_apple_design_resources.py --only "iphone duo"    # one bezel set
python3 scripts/fetch_apple_design_resources.py --only bezel --extract # all bezels, unpacked
python3 scripts/fetch_apple_design_resources.py                        # every direct download
```

A second run skips files that haven't changed, so it doubles as the update check. `--extract` unpacks each new `.dmg` into `apple-resources/extracted/`, and `apple-resources/manifest.json` records sizes, dates and hashes. Sketch and Figma kits can't be downloaded by a script; it lists them at the end.

---

Not affiliated with or endorsed by Apple. Apple's guidelines, symbols, UI kits and artwork belong to Apple and are subject to Apple's terms.

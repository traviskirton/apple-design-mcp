# apple-mcp

An MCP server that gives AI apps Apple's design assets and guidance: SF Symbols, design values, the Human Interface Guidelines, UI kits and device bezels.

Status: the server in `server/` is live with the Human Interface Guidelines, device sizes and frames, SF Symbols, technology artwork, design values and UI kit components. `server/README.md` lists its tools.

## Scripts

### `scripts/fetch_apple_design_resources.py`

Downloads the files on [Apple's design resources page](https://developer.apple.com/design/resources/) into `apple-resources/` (ignored by git) and keeps them current. Run it on a Mac:

```sh
python3 scripts/fetch_apple_design_resources.py --list                 # show what the page offers
python3 scripts/fetch_apple_design_resources.py --only "iphone duo"    # one bezel set
python3 scripts/fetch_apple_design_resources.py --only bezel --extract # all bezels, unpacked
python3 scripts/fetch_apple_design_resources.py                        # every direct download
```

- A second run skips files that have not changed on Apple's server, so it doubles as the update check.
- `--extract` mounts each new `.dmg` and copies its contents to `apple-resources/extracted/`.
- `apple-resources/manifest.json` records what was downloaded, with sizes, dates and SHA-256 hashes.
- Sketch and Figma UI kits are links into those products and cannot be downloaded by a script. The script lists them at the end.

Not affiliated with Apple.

## Agent skill and Claude Code plugin

`plugin/skills/apple-design/SKILL.md` tells an agent when to use the server and how: one `get_design_brief` call per device, Apple's SVGs placed as they are in mockups, and the system's own components in SwiftUI, UIKit and AppKit code.

- **Claude Code:** `/plugin marketplace add traviskirton/apple-design-mcp`, then `/plugin install apple-design@apple-design-mcp`. This installs the skill and connects the server.
- **claude.ai and the Claude apps:** download https://apple-design-mcp.com/apple-design-skill.zip and upload it under Settings > Capabilities > Skills. Add the server separately as a custom connector: `https://apple-design-mcp.com/mcp`.

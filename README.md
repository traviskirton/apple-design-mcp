# apple-mcp

An MCP server that gives AI apps Apple's design assets and guidance: SF Symbols, design values, the Human Interface Guidelines, UI kits and device bezels.

Status: planning. Nothing here is usable yet.

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

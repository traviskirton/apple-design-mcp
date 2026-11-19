#!/usr/bin/env python3
"""Look up SF Symbols in the metadata inside SF Symbols.app, and check Swift files against it.

    symbols.py search "skip forward" [--limit 8]
    symbols.py check file.swift [--ios 27.0 | --macos 27.0]

Reads the app's metadata from /Applications/SF Symbols.app. Set SF_SYMBOLS_METADATA
to point at another copy of its Contents/Resources/Metadata folder.

search is what the "with tools" runs were given. check lists every symbol name a
Swift file uses and says whether it exists and is available on the target OS.
"""
import os, plistlib, re, sys
from pathlib import Path

META = Path(os.environ.get("SF_SYMBOLS_METADATA", "/Applications/SF Symbols.app/Contents/Resources/Metadata"))

def load():
    na = plistlib.load(open(META / "name_availability.plist", "rb"))
    search = plistlib.load(open(META / "symbol_search.plist", "rb"))
    cats = plistlib.load(open(META / "symbol_categories.plist", "rb"))
    layers = plistlib.load(open(META / "layerset_availability.plist", "rb"))["symbols"]
    aliases = {}
    for f in ("name_aliases.strings", "legacy_aliases.strings"):
        raw = (META / f).read_bytes()
        try:
            d = plistlib.loads(raw)
        except Exception:
            text = raw.decode("utf-16" if raw[:2] in (b"\xff\xfe", b"\xfe\xff") else "utf-8")
            d = dict(re.findall(r'"([^"]+)"\s*=\s*"([^"]+)"', text))
        aliases.update(d)
    return na["symbols"], na["year_to_release"], search, cats, layers, aliases

SYMS, RELEASES, SEARCH, CATS, LAYERS, ALIASES = load()

def availability(name):
    return RELEASES[SYMS[name]]

def describe(name):
    r = availability(name)
    modes = ["monochrome"] + sorted(LAYERS.get(name, {}).keys())
    return f"{name} | iOS {r['iOS']}+, macOS {r['macOS']}+, watchOS {r['watchOS']}+, visionOS {r['visionOS']}+ | {', '.join(modes)}"

def search(query, limit=8):
    terms = [t for t in re.split(r"[\s.]+", query.lower()) if t]
    scored = []
    for name in SYMS:
        tokens = name.split(".")
        words = set(tokens) | {w.lower() for k in SEARCH.get(name, []) for w in re.split(r"[\s-]+", k)}
        score = 0
        for t in terms:
            if t in tokens: score += 3
            elif t in words: score += 2
            elif any(t in w for w in words): score += 1
            else: score -= 0.5
        if score >= 1:
            # prefer plain symbols over variants
            penalty = 0.4 * len(tokens) + (0.5 if re.search(r"\.(ar|hi|he|ja|ko|th|zh|rtl|bn|gu|kn|ml|mr|or|pa|ta|te|my|km|si|sat|mni)$", name) else 0)
            scored.append((score - penalty, name))
    scored.sort(key=lambda x: (-x[0], x[1]))
    return [n for _, n in scored[:limit]]

def vtuple(v):
    return tuple(int(x) for x in v.split("."))

def check(path, platform, target):
    text = Path(path).read_text()
    names = set(re.findall(r'(?:systemName|systemImage|systemSymbolName)\s*:\s*"([^"]+)"', text))
    names |= set(re.findall(r'Label\(\s*"[^"]*"\s*,\s*systemImage\s*:\s*"([^"]+)"', text))
    # string literals that look like symbol names stored in data models
    candidates = set(re.findall(r'"([a-z0-9]+(?:\.[a-z0-9]+)+)"', text)) | set(
        m for m in re.findall(r'(?:symbol|icon|systemImage|image|glyph)\w*\s*:\s*"([a-z0-9.]+)"', text))
    report = {"valid": [], "alias": [], "too_new": [], "invalid": []}
    for n in sorted(names | candidates):
        if n in SYMS:
            need = availability(n)[platform]
            (report["too_new"] if vtuple(need) > vtuple(target) else report["valid"]).append(n if vtuple(need) <= vtuple(target) else f"{n} (needs {platform} {need})")
        elif n in ALIASES:
            report["alias"].append(f"{n} -> {ALIASES[n]}")
        elif n in names or re.fullmatch(r"[a-z0-9]+(\.[a-z0-9]+)+", n) and not re.search(r"\.(com|org|net|swift|png|jpg|io)$", n):
            report["invalid"].append(n + ("" if n in names else " (literal, may not be a symbol)"))
    return report

if __name__ == "__main__":
    if sys.argv[1] == "search":
        limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 8
        for n in search(sys.argv[2], limit):
            print(describe(n))
    elif sys.argv[1] == "check":
        platform, target = "iOS", "27.0"
        if "--macos" in sys.argv: platform, target = "macOS", sys.argv[sys.argv.index("--macos") + 1]
        if "--ios" in sys.argv: platform, target = "iOS", sys.argv[sys.argv.index("--ios") + 1]
        r = check(sys.argv[2], platform, target)
        for k, v in r.items():
            print(f"{k}: {len(v)}")
            for n in v if k != "valid" else []:
                print("   ", n)

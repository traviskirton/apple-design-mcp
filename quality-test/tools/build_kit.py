#!/usr/bin/env python3
"""Rebuild the reference material the "with tools" runs were given.

Downloads every Human Interface Guidelines page, and the developer documentation
pages listed in API_PAGES, from Apple's documentation JSON and converts them to
Markdown with docc2md.py.

    python3 quality-test/tools/build_kit.py [--out quality-test/kit]

Writes OUT/hig/*.md with OUT/hig/INDEX.md, and OUT/apidocs/*.md. The output is
not committed; run this to recreate it.
"""
import argparse
import json
import sys
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from docc2md import convert  # noqa: E402

BASE = "https://developer.apple.com/tutorials/data"
HIG_ROOT = "/design/human-interface-guidelines"
API_PAGES = [
    "/documentation/swiftui/arrangementview",
    "/documentation/swiftui/reservedregion",
    "/documentation/swiftui/toolbaritemvisibilitypriority",
    "/documentation/swiftui/toolbaroverflowmenu",
    "/documentation/swiftui/toolbarverticalcompressionbehavior",
    "/documentation/technologyoverviews/preparing-your-app-for-iphone-duo",
]


def fetch(path: str) -> dict:
    req = urllib.request.Request(BASE + path + ".json", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def build_hig(out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    seen, queue, index = set(), [HIG_ROOT], []
    while queue:
        path = queue.pop(0)
        if path in seen:
            continue
        seen.add(path)
        try:
            doc = fetch(path)
        except Exception as err:  # a missing page should not stop the crawl
            print("failed", path, err, file=sys.stderr)
            continue
        time.sleep(0.15)
        for ref in doc.get("references", {}).values():
            url = ref.get("url", "")
            if url.startswith(HIG_ROOT + "/") and "#" not in url and url not in seen:
                queue.append(url)
        slug = path[len(HIG_ROOT):].strip("/").replace("/", "_")
        text = convert(doc)
        if slug and len(text) > 400:
            (out / f"{slug}.md").write_text(text)
            abstract = " ".join(t.get("text", "") for t in doc.get("abstract", []) if t.get("type") == "text")
            index.append((slug, doc.get("metadata", {}).get("title", ""), abstract))
    index.sort()
    lines = ["# Human Interface Guidelines pages", "", "One Markdown file per page in this folder.", ""]
    lines += [f"- `{slug}.md` — {title}: {abstract}" for slug, title, abstract in index]
    (out / "INDEX.md").write_text("\n".join(lines) + "\n")
    print(f"HIG: {len(index)} pages written to {out}")


def build_api(out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    for path in API_PAGES:
        name = "_".join(path.split("/")[2:]) + ".md"
        (out / name).write_text(convert(fetch(path)))
    print(f"API docs: {len(API_PAGES)} pages written to {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--out", type=Path, default=Path(__file__).resolve().parent.parent / "kit")
    args = ap.parse_args()
    build_hig(args.out / "hig")
    build_api(args.out / "apidocs")

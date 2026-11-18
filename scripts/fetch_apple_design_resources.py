#!/usr/bin/env python3
"""Download Apple's design resources and keep them up to date.

Reads https://developer.apple.com/design/resources/, lists every resource on
it, and downloads the ones Apple serves as direct files (bezels, fonts,
SF Symbols, icon templates, glyphs). Run it again at any time: files whose
size and modification date are unchanged on Apple's server are skipped.

UI kits for Sketch and Figma are links into those products, not files, so the
script cannot download them. It prints them at the end as a to-do list.

Usage:
    python3 scripts/fetch_apple_design_resources.py --list
    python3 scripts/fetch_apple_design_resources.py --only bezel
    python3 scripts/fetch_apple_design_resources.py --only "iphone duo" --extract
    python3 scripts/fetch_apple_design_resources.py            # everything

Needs Python 3.9 or later and nothing else. --extract needs macOS (hdiutil).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

PAGE_URL = "https://developer.apple.com/design/resources/"
USER_AGENT = "Mozilla/5.0 (Macintosh) design-resources-fetcher"
REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DEST = REPO_ROOT / "apple-resources"
CHUNK = 1024 * 256


# ---------------------------------------------------------------- parsing

class ResourcePage(HTMLParser):
    """Collects resource links with the headings they sit under."""

    HEADINGS = {"h2", "h3", "h4", "h5"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.items: list[dict] = []
        self.section = ""      # h2, e.g. "Product Bezels"
        self.group = ""        # h4, e.g. "iOS 27 and iPadOS 27"
        self.title = ""        # h5, e.g. "iPhone Duo"
        self._heading: str | None = None
        self._heading_text: list[str] = []
        self._link: dict | None = None
        self._link_text: list[str] = []
        self._in_main = False

    def handle_starttag(self, tag: str, attrs: list) -> None:
        a = dict(attrs)
        if tag == "section":
            self._in_main = True
        if tag in self.HEADINGS:
            self._heading = tag
            self._heading_text = []
        elif tag == "a" and a.get("href"):
            self._link = {"url": a["href"]}
            self._link_text = []

    def handle_data(self, data: str) -> None:
        if self._heading:
            self._heading_text.append(data)
        if self._link is not None:
            self._link_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == self._heading:
            text = clean(" ".join(self._heading_text))
            if tag == "h2":
                self.section, self.group, self.title = text, "", ""
            elif tag in ("h3", "h4"):
                self.group, self.title = text, ""
            else:
                self.title = text
            self._heading = None
        elif tag == "a" and self._link is not None:
            url = self._link["url"]
            kind = classify(url)
            if kind and self._in_main:
                label = clean(" ".join(self._link_text))
                self.items.append({
                    "section": self.section,
                    "group": self.group,
                    "title": self.title or label,
                    "label": label,
                    "url": url,
                    "kind": kind,
                })
            self._link = None


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\xa0", " ")).strip()


def classify(url: str) -> str | None:
    """download = a file this script can fetch; the rest need a person."""
    parsed = urllib.parse.urlparse(url)
    host, path = parsed.netloc.lower(), parsed.path.lower()
    if parsed.scheme == "sketch":
        return "sketch-library"
    if path.endswith((".dmg", ".zip", ".pkg")):
        return "download"
    if host.endswith("figma.com"):
        return "figma"
    if host.endswith("sketch.com"):
        return "sketch-cloud"
    return None


def parse_page(html: str) -> list[dict]:
    parser = ResourcePage()
    parser.feed(html)
    seen, items = set(), []
    for item in parser.items:
        if item["url"] in seen:
            continue
        seen.add(item["url"])
        if item["kind"] == "download":
            name = urllib.parse.unquote(urllib.parse.urlparse(item["url"]).path.rsplit("/", 1)[-1])
            item["filename"] = name
        items.append(item)
    return items


def matches(item: dict, filters: list[str]) -> bool:
    if not filters:
        return True
    haystack = " ".join(
        str(item.get(k, "")) for k in ("section", "group", "title", "label", "filename", "url")
    ).lower().replace("-", " ")
    return any(f in haystack for f in filters)


# ------------------------------------------------------------- networking

def request(url: str, method: str = "GET"):
    req = urllib.request.Request(url, method=method, headers={"User-Agent": USER_AGENT})
    return urllib.request.urlopen(req, timeout=60)


def remote_state(url: str) -> dict:
    """Size and modification stamps Apple's server reports for a file."""
    with request(url, "HEAD") as resp:
        h = resp.headers
        return {
            "size": int(h.get("Content-Length") or 0),
            "etag": h.get("ETag") or "",
            "last_modified": h.get("Last-Modified") or "",
        }


def same_version(remote: dict, saved: dict | None, path: Path) -> bool:
    if not saved or not path.exists():
        return False
    if remote["size"] and path.stat().st_size != remote["size"]:
        return False
    if remote["etag"] or saved.get("etag"):
        return remote["etag"] == saved.get("etag")
    return bool(remote["last_modified"]) and remote["last_modified"] == saved.get("last_modified")


def download(url: str, path: Path, size: int) -> str:
    """Stream url to path through a .part file. Returns the SHA-256."""
    path.parent.mkdir(parents=True, exist_ok=True)
    part = path.with_name(path.name + ".part")
    digest = hashlib.sha256()
    done = 0
    started = time.time()
    with request(url) as resp, open(part, "wb") as out:
        while True:
            chunk = resp.read(CHUNK)
            if not chunk:
                break
            out.write(chunk)
            digest.update(chunk)
            done += len(chunk)
            if sys.stderr.isatty():
                pct = f"{done * 100 // size:3d}%" if size else ""
                sys.stderr.write(f"\r    {human(done)} {pct}   ")
    if sys.stderr.isatty():
        sys.stderr.write("\r" + " " * 40 + "\r")
    if size and done != size:
        part.unlink(missing_ok=True)
        raise IOError(f"got {done} bytes, expected {size}")
    os.replace(part, path)
    print(f"    saved {human(done)} in {time.time() - started:.0f}s")
    return digest.hexdigest()


def human(n: int) -> str:
    size = float(n)
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{size:.0f} {unit}" if unit in ("B", "KB") else f"{size:.1f} {unit}"
        size /= 1024
    return f"{n} B"


# --------------------------------------------------------------- extract

def extract_dmg(dmg: Path, target: Path) -> None:
    """Mount a disk image read-only and copy its contents to target.

    Some of Apple's images show a license prompt when mounted; this answers
    it with "Y" so the copy can run unattended.
    """
    if sys.platform != "darwin":
        raise RuntimeError("--extract needs macOS")
    mount = Path(tempfile.mkdtemp(prefix="apple-resources-"))
    try:
        subprocess.run(
            ["hdiutil", "attach", str(dmg), "-nobrowse", "-readonly", "-noverify",
             "-mountpoint", str(mount)],
            input="Y\n", text=True, check=True, capture_output=True,
            env={**os.environ, "PAGER": "cat"},
        )
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(mount, target, symlinks=True,
                        ignore=shutil.ignore_patterns(".Trashes", ".fseventsd", ".DS_Store",
                                                      ".background", ".VolumeIcon.icns"))
    finally:
        subprocess.run(["hdiutil", "detach", str(mount), "-quiet"], check=False)
        shutil.rmtree(mount, ignore_errors=True)


# ------------------------------------------------------------------ main

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--dest", type=Path, default=DEFAULT_DEST,
                    help=f"folder to download into (default: {DEFAULT_DEST})")
    ap.add_argument("--only", action="append", default=[], metavar="TEXT",
                    help="only resources whose section, title or file name contains TEXT; "
                         "repeat or separate with commas for several")
    ap.add_argument("--list", action="store_true", help="show what the page offers and stop")
    ap.add_argument("--extract", action="store_true",
                    help="also unpack each new or changed .dmg into DEST/extracted (macOS)")
    ap.add_argument("--force", action="store_true", help="download even if unchanged")
    ap.add_argument("--html", type=Path, help="read the page from a saved file instead of the web")
    args = ap.parse_args()

    filters = [f.strip().lower().replace("-", " ")
               for group in args.only for f in group.split(",") if f.strip()]

    if args.html:
        html = args.html.read_text(encoding="utf-8", errors="replace")
    else:
        with request(PAGE_URL) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    items = parse_page(html)
    if not items:
        print("No resources found. Apple may have changed the page layout.", file=sys.stderr)
        return 2

    selected = [i for i in items if matches(i, filters)]
    files = [i for i in selected if i["kind"] == "download"]
    manual = [i for i in selected if i["kind"] != "download"]

    if args.list:
        for i in selected:
            where = " / ".join(x for x in (i["section"], i["group"], i["title"]) if x)
            print(f"{i['kind']:14} {where} [{i['label']}]\n{'':14} {i['url']}")
        print(f"\n{len(files)} downloadable files, {len(manual)} links that need a person.")
        return 0

    dest: Path = args.dest.expanduser()
    downloads = dest / "downloads"
    dest.mkdir(parents=True, exist_ok=True)
    manifest_path = dest / "manifest.json"
    saved = {}
    if manifest_path.exists():
        saved = {f["url"]: f for f in json.loads(manifest_path.read_text()).get("files", [])}

    new, unchanged, failed = [], [], []
    records = dict(saved)
    for i in files:
        path = downloads / i["filename"]
        print(f"{i['section']} / {i['title']}: {i['filename']}")
        try:
            remote = remote_state(i["url"])
            if not args.force and same_version(remote, saved.get(i["url"]), path):
                print("    up to date")
                unchanged.append(i)
                continue
            sha = download(i["url"], path, remote["size"])
            record = {**i, **remote, "sha256": sha,
                      "path": str(path.relative_to(dest)),
                      "downloaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
            if args.extract and path.suffix == ".dmg":
                target = dest / "extracted" / path.stem
                extract_dmg(path, target)
                record["extracted"] = str(target.relative_to(dest))
                print(f"    unpacked to {target.relative_to(dest)}")
            records[i["url"]] = record
            new.append(i)
        except (urllib.error.URLError, IOError, subprocess.CalledProcessError, RuntimeError) as err:
            print(f"    FAILED: {err}", file=sys.stderr)
            failed.append(i)
        manifest_path.write_text(json.dumps({
            "source": PAGE_URL,
            "checked_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "files": list(records.values()),
            "manual": [m for m in items if m["kind"] != "download"],
        }, indent=2) + "\n")

    print(f"\n{len(new)} downloaded, {len(unchanged)} already up to date, {len(failed)} failed.")
    if new:
        print("New or changed:")
        for i in new:
            print(f"  {i['filename']}")
    if manual:
        print("\nThese are links into Sketch or Figma and need a person to open them:")
        for i in manual:
            where = " / ".join(x for x in (i["section"], i["group"], i["title"]) if x)
            print(f"  {where} [{i['label']}]\n    {i['url']}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

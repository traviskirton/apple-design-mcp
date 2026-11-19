#!/usr/bin/env python3
"""Measure safe-area insets of the current iPhones and iPads in the iOS Simulator.

For each distinct screen in server/src/pack/devices.js (screen sizes, corner radii and Dynamic
Island), this creates a temporary simulator named "apple-mcp-temp ...", boots it, installs and runs
safe-area-probe (which prints its window's safe-area insets in portrait and landscape), records the
result, then shuts the simulator down and deletes it. One simulator runs at a time. Results go to
server/scripts/safe-areas.json, which server/scripts/build-device-pack.mjs merges into devices.js.

    python3 extractor/measure-safe-areas.py                 every screen not yet measured
    python3 extractor/measure-safe-areas.py --only iPhone-Air,iPhone-17
    python3 extractor/measure-safe-areas.py --again         measure even screens already measured
    python3 extractor/measure-safe-areas.py --minutes 45    stop starting new devices after this long

Only simulators whose name starts with "apple-mcp-temp" are ever shut down or deleted. Runtimes are
never downloaded: a device type that no installed runtime supports is skipped and listed.
"""
import argparse
import datetime
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROBE = ROOT / "extractor" / "safe-area-probe"
APP = PROBE / ".build" / "SafeAreaProbe.app"
BUNDLE_ID = "com.postfl.apple-mcp.safe-area-probe"
OUT = ROOT / "server" / "scripts" / "safe-areas.json"
PREFIX = "apple-mcp-temp"
# Measured first, so the devices people ask about are done even if the run stops early.
FIRST = ["iPhone-18-Pro", "iPhone-17e", "iPhone-Air", "iPhone-SE-3rd-generation", "iPhone-Duo",
         "iPad-Pro-13-inch-M5-12GB", "iPad-mini-A20-Pro", "iPad-mini-A17-Pro", "iPhone-17"]


def sh(*args, timeout=300, check=True):
    r = subprocess.run(list(args), capture_output=True, text=True, timeout=timeout)
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(args[:4])}: {r.stderr.strip() or r.stdout.strip()}")
    return r.stdout


def build_probe():
    APP.mkdir(parents=True, exist_ok=True)
    (APP / "Info.plist").write_bytes((PROBE / "Info.plist").read_bytes())
    sh("xcrun", "-sdk", "iphonesimulator", "swiftc", "-parse-as-library", "-O",
       "-target", "arm64-apple-ios18.0-simulator", str(PROBE / "App.swift"), "-o", str(APP / "SafeAreaProbe"))


def load_devices():
    text = (ROOT / "server" / "src" / "pack" / "devices.js").read_text()
    pack = json.loads(text[text.index("{"):].rstrip().rstrip(";"))
    return [d for d in pack["devices"] if d.get("current") and d["family"] in ("iphone", "ipad")]


def screen_key(d):
    return json.dumps([[s["width_pt"], s["height_pt"], s.get("corner_radius_pt")] for s in d["screens"]] + [bool(d.get("dynamic_island"))])


def runtimes_for():
    """Device type identifier -> the newest installed iOS runtime that runs it."""
    data = json.loads(sh("xcrun", "simctl", "list", "runtimes", "-j"))
    best = {}
    for r in data["runtimes"]:
        if r.get("platform") != "iOS" or not r.get("isAvailable"):
            continue
        for t in r.get("supportedDeviceTypes", []):
            cur = best.get(t["identifier"])
            if cur is None or [int(x) for x in r["version"].split(".")] > [int(x) for x in cur["version"].split(".")]:
                best[t["identifier"]] = r
    return best


def temp_devices():
    data = json.loads(sh("xcrun", "simctl", "list", "devices", "-j"))
    return [d for devs in data["devices"].values() for d in devs if d["name"].startswith(PREFIX)]


def remove(udid):
    sh("xcrun", "simctl", "shutdown", udid, check=False, timeout=120)
    sh("xcrun", "simctl", "delete", udid, check=False, timeout=120)


def measure(device, runtime):
    type_id = "com.apple.CoreSimulator.SimDeviceType." + device["id"]
    udid = sh("xcrun", "simctl", "create", f"{PREFIX} {device['id']}", type_id, runtime["identifier"]).strip()
    try:
        sh("xcrun", "simctl", "bootstatus", udid, "-b", timeout=600)
        sh("xcrun", "simctl", "install", udid, str(APP), timeout=180)
        out = ""
        for attempt in range(2):
            r = subprocess.run(["xcrun", "simctl", "launch", "--console-pty", "--terminate-running-process", udid, BUNDLE_ID],
                               capture_output=True, text=True, timeout=120)
            out = r.stdout + r.stderr
            m = re.search(r"SAFEAREA (\{.*\})", out)
            if m:
                result = json.loads(m.group(1))
                result["runtime"] = runtime["version"]
                return result
            time.sleep(3)
        raise RuntimeError("the probe printed no result: " + out.strip()[-300:])
    finally:
        remove(udid)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--again", action="store_true")
    ap.add_argument("--minutes", type=float, default=45)
    args = ap.parse_args()
    start = time.time()

    leftovers = temp_devices()
    for d in leftovers:
        print(f"removing leftover {d['name']}")
        remove(d["udid"])

    build_probe()
    devices = load_devices()
    runtimes = runtimes_for()
    data = json.loads(OUT.read_text()) if OUT.exists() else {"note": "", "devices": {}}
    data["note"] = ("Safe-area insets in points, measured in the iOS Simulator by extractor/measure-safe-areas.py: "
                    "a window's safeAreaInsets with the status bar shown, in portrait and in landscape (home button "
                    "or Dynamic Island on the left of a landscape-right screen). `applies_to` lists the devices with the "
                    "same screen sizes, corner radii and Dynamic Island, which share the measurement.")

    groups = {}
    for d in devices:
        groups.setdefault(screen_key(d), []).append(d)
    only = [x for x in args.only.split(",") if x]
    todo = []
    for d in devices:
        group = groups[screen_key(d)]
        if only:
            if d["id"] in only:
                todo.append(d)
        elif d["id"] in FIRST or d is group[0]:
            if not any(x["id"] in FIRST for x in group if x is not d) or d["id"] in FIRST:
                todo.append(d)
    todo.sort(key=lambda d: FIRST.index(d["id"]) if d["id"] in FIRST else len(FIRST))

    skipped, failed, stopped = [], [], []
    for d in todo:
        if not args.again and d["id"] in data["devices"]:
            continue
        if time.time() - start > args.minutes * 60:
            stopped.append(d["id"])
            continue
        runtime = runtimes.get("com.apple.CoreSimulator.SimDeviceType." + d["id"])
        if not runtime:
            skipped.append(d["id"])
            print(f"skip {d['id']}: no installed runtime runs it")
            continue
        t0 = time.time()
        try:
            r = measure(d, runtime)
        except Exception as e:  # noqa: BLE001
            failed.append(f"{d['id']}: {e}")
            print(f"FAILED {d['id']}: {e}")
            continue
        r["measured_at"] = datetime.date.today().isoformat()
        r["applies_to"] = [x["id"] for x in groups[screen_key(d)]]
        data["devices"][d["id"]] = r
        OUT.write_text(json.dumps(data, indent=1, sort_keys=True) + "\n")
        p, l = r["portrait"], r["landscape"]
        print(f"{d['id']} ({time.time() - t0:.0f} s): portrait {p['width']:g}×{p['height']:g} top {p['top']:g} bottom {p['bottom']:g}; "
              f"landscape {l['width']:g}×{l['height']:g} top {l['top']:g} bottom {l['bottom']:g} left {l['left']:g} right {l['right']:g}")

    left = temp_devices()
    print(f"done in {(time.time() - start) / 60:.1f} min; skipped {skipped}; failed {failed}; not started (time) {stopped}; "
          f"temporary simulators left: {len(left)}")
    return 0 if not left else 1


if __name__ == "__main__":
    sys.exit(main())

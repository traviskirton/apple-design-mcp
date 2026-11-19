// Reads the device types that Xcode's simulators know about and writes them as the
// server's device pack. Runs on a Mac with Xcode installed; it reads files only.
//
//   node scripts/build-device-pack.mjs               rewrite src/pack/devices.js
//   node scripts/build-device-pack.mjs --dump NAME   print everything Xcode holds for the
//                                                    device types whose name contains NAME, as JSON
//
// Output: src/pack/devices.js (committed, so the server can be built and deployed
// from a machine without Xcode).
//
// Where the numbers come from, for each device type that `xcrun simctl list devicetypes`
// reports: Contents/Resources/capabilities.plist (screen size, scale, pixels per inch,
// corner radius, Dynamic Island, and `displays[]`, the list of displays).
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "pack", "devices.js");
const dumpAt = process.argv.indexOf("--dump");
const DUMP = dumpAt > 0 ? (process.argv[dumpAt + 1] ?? "").toLowerCase() : null;

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

// plutil cannot write plists that hold dates or raw data as JSON; Python's plistlib can.
const PLIST_TO_JSON =
  "import json, plistlib, sys\n" +
  "print(json.dumps(plistlib.load(open(sys.argv[1], 'rb')), default=lambda v: None))";
const plist = (file) => (existsSync(file) ? JSON.parse(run("python3", ["-c", PLIST_TO_JSON, file])) : {});

const FAMILY = { iPhone: "iphone", iPad: "ipad", "Apple Watch": "watch", "Apple TV": "tv", "Apple Vision": "vision" };
const round = (n) => Math.round(n * 100) / 100;

/** One number when the four corners match, otherwise each corner. */
function corners(d) {
  const [tl, tr, bl, br] = [d.cornerRadiusUL, d.cornerRadiusUR, d.cornerRadiusLL, d.cornerRadiusLR];
  if ([tl, tr, bl, br].some((v) => typeof v !== "number")) return undefined;
  if (tl === tr && tl === bl && tl === br) return tl;
  return { top_left: tl, top_right: tr, bottom_left: bl, bottom_right: br };
}

// Some plists store numbers as strings ("3840", "1.0"), so every value is read as a number.
function screen(widthPx, heightPx, scale, ppi, radius, nativeOrientation) {
  [widthPx, heightPx, scale, ppi] = [widthPx, heightPx, scale, ppi].map((v) => (v === undefined ? v : Number(v)));
  return {
    width_pt: round(widthPx / scale),
    height_pt: round(heightPx / scale),
    scale,
    width_px: widthPx,
    height_px: heightPx,
    ...(ppi ? { ppi } : {}),
    ...(radius !== undefined ? { corner_radius_pt: radius } : {}),
    ...(nativeOrientation === 90 || nativeOrientation === 270 ? { natural_orientation: "landscape" } : {}),
  };
}

const xcode = run("xcodebuild", ["-version"]).trim().split("\n").join(", ");
const { devicetypes } = JSON.parse(run("xcrun", ["simctl", "list", "devicetypes", "-j"]));

const devices = [];
const dumped = [];
for (const type of devicetypes) {
  const resources = join(type.bundlePath, "Contents", "Resources");
  const profile = plist(join(resources, "profile.plist"));
  const caps = plist(join(resources, "capabilities.plist")).capabilities ?? {};
  if (DUMP !== null) {
    if (type.name.toLowerCase().includes(DUMP)) dumped.push({ ...type, profile, capabilities: caps });
    continue;
  }

  // The device's own displays live in capabilities.plist `displays[]`. Built-in screens have
  // displayType "integrated" and deviceName "primary", "primary-1", ...; TV out ("tvOut"),
  // CarPlay ("carPlay") and the resizable scene ("scene") are left out.
  const all = caps.displays ?? [];
  const own = all.filter(
    (d) => (d.displayType === "integrated" || /^primary/i.test(String(d.deviceName ?? ""))) && d.width && d.height && d.scale,
  );

  const family = FAMILY[type.productFamily] ?? String(type.productFamily ?? "other").toLowerCase();
  // Apple Watch panels report a native rotation of 90 degrees, but the watch is worn and designed
  // for in portrait, so only iPhone and iPad screens are marked as naturally landscape.
  const orientation = (d) => (family === "iphone" || family === "ipad" ? d.nativeOrientation : undefined);
  // Apple TV and Vision Pro have no physical screen corners; their zero radius is left out.
  const cornerRadius = (r) => (r === 0 && (family === "tv" || family === "vision") ? undefined : r);

  let screens;
  if (own.length) {
    screens = own.map((d) =>
      screen(d.width, d.height, d.scale, d.hdpi, cornerRadius(corners(d) ?? caps.DeviceCornerRadius), orientation(d)),
    );
  } else {
    const dims = caps.ScreenDimensionsCapability ?? {};
    const scale = dims["main-screen-scale"] ?? profile.mainScreenScale;
    const width = dims["main-screen-width"] ?? profile.mainScreenWidth;
    const height = dims["main-screen-height"] ?? profile.mainScreenHeight;
    if (!scale || !width || !height) continue; // no screen of its own, such as Apple TV boxes without a size
    // Xcode stores Apple TV 4K as 3840×2160 at @1x, but tvOS lays apps out at 1920×1080 points
    // on every Apple TV, at @2x on a 4K screen. Store it that way so designs use the real point size.
    const tv4k = family === "tv" && Number(scale) === 1 && Number(width) === 3840 && Number(height) === 2160;
    screens = [
      screen(width, height, tv4k ? 2 : scale, dims["main-screen-pitch"] ?? profile.mainScreenWidthDPI, cornerRadius(caps.DeviceCornerRadius)),
    ];
  }

  // A device with two displays of its own folds: the smaller one is on the outside.
  if (screens.length === 2) {
    const [small, large] = [...screens].sort((a, b) => a.width_pt * a.height_pt - b.width_pt * b.height_pt);
    small.role = "outer";
    large.role = "inner";
    screens = [small, large];
  }

  devices.push({
    id: type.identifier.replace("com.apple.CoreSimulator.SimDeviceType.", ""),
    name: type.name,
    family,
    ...(type.modelIdentifier ?? profile.modelIdentifier ? { model: type.modelIdentifier ?? profile.modelIdentifier } : {}),
    // The newest simulator runtime still runs it.
    current: type.maxRuntimeVersion === undefined || type.maxRuntimeVersion >= 0xffff0000,
    ...(caps.DeviceSupportsDynamicIsland ? { dynamic_island: true } : {}),
    screens,
  });
}

if (DUMP !== null) {
  console.log(JSON.stringify({ xcode, devicetypes: dumped }, null, 2));
  process.exit(0);
}

if (devices.length < 20) {
  console.error(`Only ${devices.length} device types found; expected 80 or more. The pack was not written.`);
  process.exit(1);
}

const now = new Date().toISOString();
const pack = {
  pack_version: now.slice(0, 10),
  generated_at: now,
  source: { name: "Xcode simulator device types", version: xcode, devices: devices.length },
  devices,
};
writeFileSync(OUT, `export default ${JSON.stringify(pack, null, 1)};\n`);
console.log(`Device pack: ${devices.length} devices from ${xcode}, written to src/pack/devices.js`);
for (const d of devices.filter((d) => d.screens.length > 1)) {
  console.log(`  ${d.name}: ${d.screens.map((s) => `${s.role} ${s.width_pt}×${s.height_pt}`).join(", ")}`);
}

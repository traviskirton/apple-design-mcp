// Device frames: the drawing of a device's body around its screen, from Xcode's Simulator.
import { findDevices, ROLE } from "./devices.js";
import pack from "./pack/frames.js";
import type { Screen } from "./pack/devices.js";
import type { Frame } from "./pack/frames.js";

export const framePack = pack;

const framesById = new Map(pack.frames.map((f) => [f.id, f]));
const num = (n: number) => String(Math.round(n * 100) / 100);

const USE =
  "To frame a design: place the frame's SVG at its size in points (or scale both together), and put the screen " +
  "content at the screen position inside it, clipped to the screen's corner radius (CSS border-radius) so its " +
  "corners do not show past the body. The frame's screen area is empty, so the frame can sit above or below the " +
  "content. Frames are drawn in portrait; rotate the frame and the content together for landscape.";

function radius(r: Screen["corner_radius_pt"]): string {
  if (r === undefined) return "";
  if (typeof r === "number") return r ? `, corner radius ${num(r)}` : ", square corners";
  return `, corner radii top-left ${num(r.top_left)}, top-right ${num(r.top_right)}, bottom-right ${num(r.bottom_right)}, bottom-left ${num(r.bottom_left)}`;
}

function describe(title: string, frame: Frame, screen?: Screen): string {
  const s = frame.screen;
  const facts = [
    `Frame: ${num(frame.width)} × ${num(frame.height)} points` + (frame.corner_radius ? `, body corner radius ${num(frame.corner_radius)}.` : "."),
    `Screen: ${num(s.width)} × ${num(s.height)} points at x ${num(s.x)}, y ${num(s.y)} from the frame's top-left corner${radius(screen?.corner_radius_pt)}.`,
  ];
  // iPhone 12 mini and 13 mini: apps are laid out larger than the frame's screen area.
  if (screen?.downsampled && Math.abs(screen.width_pt - s.width) >= 1) {
    const percent = num((s.width / screen.width_pt) * 100);
    facts.push(
      `Layout: this device lays apps out at ${num(screen.width_pt)} × ${num(screen.height_pt)} points. ` +
        `Design at that size and scale the design to ${percent}% to fit the screen area.`,
    );
  }
  if (frame.buttons?.length) {
    facts.push("Buttons: " + frame.buttons.map((b) => `${b.name} at x ${num(b.x)}, y ${num(b.y)}, ${num(b.width)} × ${num(b.height)}`).join("; ") + ".");
  }
  return [`### ${title}`, facts.join("\n"), "```svg\n" + frame.svg.trim() + "\n```"].join("\n\n");
}

/** The frame of each named device, one per screen. */
export function deviceFrames(queries: string[]): { text: string; ok: boolean } {
  const parts: string[] = [];
  const done = new Set<string>();
  let found = 0;
  for (const q of queries) {
    // The newest matching device that has a frame; "iPhone 18" should not return four frames.
    const device = findDevices(q).find((d) => pack.devices[d.id]?.some((id) => framesById.has(id)));
    if (!device) {
      parts.push(`### ${q}\n\nNo frame is loaded for this device. Use get_device_metrics for its screen size and draw a plain rounded rectangle around it.`);
      continue;
    }
    if (done.has(device.id)) continue;
    done.add(device.id);
    pack.devices[device.id].forEach((id, i) => {
      const frame = framesById.get(id);
      if (!frame) return;
      const screen = device.screens[i];
      parts.push(describe(screen?.role ? `${device.name}, ${ROLE[screen.role]}` : device.name, frame, screen));
      found++;
    });
  }
  if (found) parts.push(USE);
  parts.push(`Source: ${pack.source.name}, ${pack.source.version}.`);
  return { text: parts.join("\n\n"), ok: found > 0 };
}

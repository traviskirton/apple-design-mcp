// Device frames: the drawing of a device's body around its screen, from Xcode's Simulator.
import { BEZEL_USE, bezelModelNames, bezelPack, bezelsFor } from "./bezels.js";
import { findDevices, ROLE } from "./devices.js";
import pack from "./pack/frames.js";
import type { Screen } from "./pack/devices.js";
import type { Frame } from "./pack/frames.js";

export const framePack = pack;

const framesById = new Map(pack.frames.map((f) => [f.id, f]));
const num = (n: number) => String(Math.round(n * 100) / 100);

const USE =
  "To use a vector frame (a flat line drawing of the device, from Xcode's Simulator): place the frame's SVG at its size in points (or scale both together), and put the screen " +
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

/**
 * For each named device: Apple's product bezel pictures where it publishes them, and the
 * Simulator's vector frame, one per screen.
 */
export function deviceFrames(queries: string[], origin: string): { text: string; ok: boolean } {
  const parts: string[] = [];
  const done = new Set<string>();
  let frames = 0;
  let bezels = 0;
  for (const q of queries) {
    // The newest matching device that has a frame; "iPhone 18" should not return four frames.
    const device = findDevices(q).find((d) => pack.devices[d.id]?.some((id) => framesById.has(id)));
    const pictures = bezelsFor(q, origin, device?.name, device ? Math.min(device.screens[0].width_pt, device.screens[0].height_pt) : undefined);
    if (!device && !pictures.length) {
      parts.push(
        `### ${q}\n\nNo bezel or frame is loaded for this device. Use get_device_metrics for its screen size and draw a plain rounded rectangle around it.` +
          (bezelPack.bezels.length ? ` Apple publishes bezels for: ${bezelModelNames().join(", ")}.` : ""),
      );
      continue;
    }
    const key = device?.id ?? q.toLowerCase();
    if (done.has(key)) continue;
    done.add(key);
    parts.push(...pictures);
    bezels += pictures.length;
    if (!device) continue;
    pack.devices[device.id].forEach((id, i) => {
      const frame = framesById.get(id);
      if (!frame) return;
      const screen = device.screens[i];
      parts.push(describe(`${screen?.role ? `${device.name}, ${ROLE[screen.role]}` : device.name}, vector frame`, frame, screen));
      frames++;
    });
  }
  if (bezels) parts.push(BEZEL_USE);
  if (frames) parts.push(USE);
  const sources = [`${pack.source.name}, ${pack.source.version}`];
  if (bezels) sources.unshift(`${bezelPack.source.name}, ${bezelPack.source.url}, read ${bezelPack.pack_version}`);
  parts.push(`Source: ${sources.join("; ")}.`);
  return { text: parts.join("\n\n"), ok: frames + bezels > 0 };
}

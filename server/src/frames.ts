// Device frames: the drawing of a device's body around its screen, from Xcode's Simulator.
import { findDevices, ROLE } from "./devices.js";
import pack from "./pack/frames.js";
import type { Frame } from "./pack/frames.js";

export const framePack = pack;

const framesById = new Map(pack.frames.map((f) => [f.id, f]));
const num = (n: number) => String(Math.round(n * 100) / 100);

const USE =
  "To frame a design: place the frame's SVG at its size in points (or scale both together), and put the screen " +
  "content at the screen position inside it, clipped to the screen's corner radius from get_device_metrics. " +
  "The frame's screen area is empty, so the frame can sit above or below the content. Frames are drawn in " +
  "portrait; rotate the frame and the content together for landscape.";

function describe(title: string, frame: Frame): string {
  const s = frame.screen;
  const facts = [
    `Frame: ${num(frame.width)} × ${num(frame.height)} points` + (frame.corner_radius ? `, body corner radius ${num(frame.corner_radius)}.` : "."),
    `Screen: ${num(s.width)} × ${num(s.height)} points at x ${num(s.x)}, y ${num(s.y)} from the frame's top-left corner.`,
  ];
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
      const role = device.screens[i]?.role;
      parts.push(describe(role ? `${device.name}, ${ROLE[role]}` : device.name, frame));
      found++;
    });
  }
  if (found) parts.push(USE);
  parts.push(`Source: ${pack.source.name}, ${pack.source.version}.`);
  return { text: parts.join("\n\n"), ok: found > 0 };
}

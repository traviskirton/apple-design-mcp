// Shape of the device pack (devices.js, written by scripts/build-device-pack.mjs on a Mac).

export interface Corners {
  top_left: number;
  top_right: number;
  bottom_left: number;
  bottom_right: number;
}

export interface Screen {
  /** Only on devices with two screens of their own: "outer" (closed) and "inner" (open). */
  role?: "outer" | "inner";
  /** Portrait size in points. */
  width_pt: number;
  height_pt: number;
  scale: number;
  width_px: number;
  height_px: number;
  ppi?: number;
  /** In points, with the screen in portrait. One number when all four corners match. */
  corner_radius_pt?: number | Corners;
  /** Present when the screen's natural orientation is landscape. */
  natural_orientation?: "landscape";
}

export interface Device {
  /** Xcode's simulator device type, such as "iPhone-18-Pro". */
  id: string;
  name: string;
  family: string;
  /** Hardware model, such as "iPhone19,1". */
  model?: string;
  /** The newest simulator runtime still runs it. */
  current: boolean;
  dynamic_island?: boolean;
  screens: Screen[];
}

export interface DevicePack {
  pack_version: string;
  generated_at: string;
  source: { name: string; version: string; devices: number };
  devices: Device[];
}

declare const pack: DevicePack;
export default pack;

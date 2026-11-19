// Shape of the device frame pack (frames.js, written by the extractor on a Mac from the
// device frames that Xcode's Simulator draws around a screen).

export interface Frame {
  /** Xcode's name for the frame, such as "phone15". */
  id: string;
  /** Size of the whole frame in points, with the device in portrait. */
  width: number;
  height: number;
  /** Corner radius of the device body in points, where Xcode gives one. */
  corner_radius?: number;
  /** Where the screen sits inside the frame, in points from the frame's top-left corner. */
  screen: { x: number; y: number; width: number; height: number };
  /** Hardware buttons, in points from the frame's top-left corner. */
  buttons?: { name: string; x: number; y: number; width: number; height: number }[];
  /** The frame drawing: one complete svg element whose viewBox is "0 0 width height". The screen area is left empty. */
  svg: string;
}

export interface FramePack {
  pack_version: string;
  generated_at: string;
  source: { name: string; version: string; frames: number };
  frames: Frame[];
  /** Device id (as in the device pack) -> frame ids, one per screen, in the device pack's screen order. */
  devices: Record<string, string[]>;
}

declare const pack: FramePack;
export default pack;

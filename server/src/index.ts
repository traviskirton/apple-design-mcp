// Apple design MCP server.
//
// Stateless: every request builds a fresh server and answers in plain JSON, so it
// needs no storage, no sessions and no sign-in. The Human Interface Guidelines are
// compiled into the Worker (see scripts/build-hig-pack.mjs), so a tool call makes no
// network or storage request.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { deviceMetrics, devicePack, FAMILIES } from "./devices.js";
import { bezelPack } from "./bezels.js";
import { designBrief } from "./brief.js";
import { deviceFrames, framePack, frameSvg } from "./frames.js";
import { higPack, lookupHig, platformsIn, readPage } from "./hig.js";
import { fromShard, lookupSymbols, readSymbols, shardOf, symbolPack, WEIGHTS } from "./symbols.js";
import type { ShapeLoader, Weight } from "./symbols.js";
import { technologyAssets, technologyPack } from "./technologies.js";
import { KIT_IDS, searchUiKit, uiKitPack } from "./uikit.js";
import type { DrawingLoader, OutlineLoader } from "./uikit.js";
import { designValues, valuesPack, VALUE_PLATFORMS, VALUE_TOPICS } from "./values.js";

const SERVER_NAME = "apple-design";
const SERVER_VERSION = "0.13.1";

const HIG_DATE = higPack.pack_version;

const PACK = {
  status: "partial",
  note: "Human Interface Guidelines text, device screen sizes, Apple's product bezels and vector device frames, SF Symbols (names, and shapes in all nine weights), technology artwork (Sign in with Apple, AirPlay and others), design values from Apple's UI kits (colors, text styles, sizes, materials, iPhone Duo layout guides) and the kits' components (Apple's drawing of every component as SVG, with its layers, sizes, layout and colors) are loaded.",
  pack_version: higPack.pack_version,
  sources: [
    {
      name: higPack.source.name,
      version: `copied from ${higPack.source.url} at ${higPack.generated_at}`,
      pages: higPack.source.pages,
      sections: higPack.source.sections,
      sha256: higPack.source.sha256,
    },
    {
      name: devicePack.source.name,
      version: `${devicePack.source.version}, read at ${devicePack.generated_at}`,
      devices: devicePack.source.devices,
    },
    {
      name: symbolPack.source.name,
      version: `${symbolPack.source.version}, read at ${symbolPack.generated_at}`,
      symbols: symbolPack.source.symbols,
      shapes: symbolPack.source.with_shapes,
    },
    {
      name: framePack.source.name,
      version: `${framePack.source.version}, read at ${framePack.generated_at}`,
      frames: framePack.source.frames,
    },
    {
      name: bezelPack.source.name,
      version: `copied from ${bezelPack.source.url} at ${bezelPack.generated_at}`,
      sets: bezelPack.source.sets,
      bezels: bezelPack.source.bezels,
    },
    {
      name: technologyPack.source.name,
      version: `copied from ${technologyPack.source.url} at ${technologyPack.generated_at}`,
      technologies: technologyPack.source.technologies,
      assets: technologyPack.source.assets,
    },
    {
      name: valuesPack.source.name,
      version: `${valuesPack.source.kits.join(" and ")}, read at ${valuesPack.generated_at}`,
      values: valuesPack.source.values,
    },
    {
      name: `${uiKitPack.source.name}, components`,
      version: `${uiKitPack.source.kits.join(", ")}, read at ${uiKitPack.generated_at}`,
      components: uiKitPack.source.components,
      variants: uiKitPack.source.variants,
      drawings: uiKitPack.source.drawings ?? 0,
    },
  ],
  tools: ["get_pack_info", "search_hig", "get_hig_page", "get_device_metrics", "get_device_frame", "search_symbols", "get_symbol", "get_technology_assets", "get_design_values", "search_ui_kit", "get_design_brief"],
  planned_tools: ["make_asset_catalog", "make_app_icon", "frame_screenshot"],
};

const READ_ONLY = { readOnlyHint: true, idempotentHint: true, openWorldHint: false };

/**
 * Builds a tool reply and writes one log line for it: the tool, its inputs, the reply's size and
 * the calling app. Read the lines with `npx wrangler tail` or in the Cloudflare dashboard.
 */
function reply(app: string, tool: string, args: unknown, text: string, isError = false) {
  console.log(JSON.stringify({ tool, args, reply_chars: text.length, error: isError, app }));
  return { content: [{ type: "text" as const, text }], isError };
}

interface Env {
  /** The static files deployed with the Worker (assets/), which hold one SVG per symbol. */
  ASSETS?: { fetch(input: string): Promise<Response> };
}

/** Reads symbol shapes: the regular weight from symbols/NAME.svg, the others from their shard in symbol-weights/. */
function shapeLoader(env: Env): ShapeLoader {
  const shards = new Map<string, Promise<string | null>>();
  return async (name, weight) => {
    if (!env.ASSETS) return null;
    if (weight === "regular") {
      const res = await env.ASSETS.fetch(`https://assets.local/symbols/${name}.svg`);
      return res.ok ? res.text() : null;
    }
    const key = `${weight}/${shardOf(name)}`;
    if (!shards.has(key)) shards.set(key, env.ASSETS.fetch(`https://assets.local/symbol-weights/${key}.txt`).then((r) => (r.ok ? r.text() : null)));
    const text = await shards.get(key)!;
    return text ? fromShard(text, name) : null;
  };
}

const weightInput = z
  .enum(WEIGHTS)
  .optional()
  .describe(
    "The weight of the symbols, to match the text beside them. Default regular. A drawing from search_ui_kit names each icon's weight in data-symbol-weight.",
  );

function buildServer(app: string, env: Env, origin: string): McpServer {
  const loadShape = shapeLoader(env);

  const loadOutlines: OutlineLoader = async (kit, id) => {
    if (!env.ASSETS) return null;
    const res = await env.ASSETS.fetch(`https://assets.local/ui-kit/${kit}/${id}.txt`);
    return res.ok ? res.text() : null;
  };

  const loadDrawing: DrawingLoader = async (kit, file) => {
    if (!env.ASSETS) return null;
    const res = await env.ASSETS.fetch(`https://assets.local/ui-kit-svg/${kit}/${file}`);
    return res.ok ? res.text() : null;
  };

  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Apple design reference for designing and building apps for iPhone, iPad, Mac, Apple Watch, Apple TV and " +
        `Apple Vision Pro. It holds Apple's Human Interface Guidelines as published on ${HIG_DATE}, which may be ` +
        "newer than what you remember. To design a screen for one device, call get_design_brief first, once, with the " +
        "device, every component and every icon: it returns the device, its guidelines, Apple's drawings of the " +
        "components, the icons and the system values in one reply. Otherwise, before designing a screen or component, make one search_hig call that lists " +
        "every component, device and topic involved. It returns the guideline text itself, so one call is usually " +
        "enough; use get_hig_page only for a section that search_hig lists but does not include. For the size of a " +
        "device's screen, call get_device_metrics instead of estimating. For icons, call search_symbols once with " +
        "every icon the design needs; it returns real SF Symbols as SVG, so do not substitute another icon set. For " +
        "an Apple technology's own logo or badge, such as Sign in with Apple or AirPlay, call get_technology_assets. " +
        "For system colors, text styles and standard sizes, call get_design_values instead of recalling them. " +
        "For a standard component such as a toolbar, tab bar, list row, alert, sheet or button, call search_ui_kit " +
        "once with every component the design needs; it returns Apple's own drawing of each one as SVG with its " +
        "measurements. In a mockup (HTML or a design tool), place those SVGs as they are and only change their icons and labels; " +
        "do not rebuild a component in HTML or CSS, even for tap states (lay clickable areas over the SVG instead). In SwiftUI, " +
        "UIKit or AppKit code, use the system's own components and SF Symbols by name instead, and use the drawings and " +
        "measurements only as reference.",
    },
  );

  server.registerTool(
    "get_pack_info",
    {
      title: "Get pack info",
      description:
        "Report which Apple design material this server has loaded, its date, and when the server answered. " +
        "Call it to check the server is connected and how current its data is.",
      annotations: READ_ONLY,
    },
    async () => {
      const info = {
        server: SERVER_NAME,
        server_version: SERVER_VERSION,
        answered_at: new Date().toISOString(),
        ...PACK,
      };
      return reply(app, "get_pack_info", {}, JSON.stringify(info, null, 2));
    },
  );

  server.registerTool(
    "search_hig",
    {
      title: "Look up the Human Interface Guidelines",
      description:
        `Look up Apple's Human Interface Guidelines (all ${higPack.source.pages} pages, as published on ${HIG_DATE}) ` +
        "and get the text of the sections that apply. Pass every topic of the task in one call as `queries`, one " +
        "entry per component, pattern, device or platform, such as [\"iPhone Duo\", \"toolbar\", \"tab bar\"]. " +
        "Use it once before designing or building any Apple-platform screen, and for devices or system features you " +
        "are unsure about, because the guidelines change several times a year. When a query names a guidelines page, " +
        "the reply holds that page; otherwise it holds the best-matching sections. Sections left out for size are " +
        "listed by id.",
      inputSchema: {
        queries: z
          .array(z.string().min(1).max(200))
          .min(1)
          .max(8)
          .optional()
          .describe("One entry per topic, each a few plain words. Example: [\"sheet\", \"dark mode color\", \"iPad sidebar\"]."),
        query: z.string().min(1).max(200).optional().describe("A single topic. Prefer `queries`."),
        platforms: z
          .array(z.enum(["ios", "ipados", "macos", "tvos", "visionos", "watchos"]))
          .optional()
          .describe("Leave out sections written for other platforms. If omitted, platforms named in the queries are used."),
        max_chars: z
          .number()
          .int()
          .min(2000)
          .max(100000)
          .optional()
          .describe("Approximate size limit for the whole reply, shared between the queries. Default 40000."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const { queries, query, platforms, max_chars } = args;
      const all = [...(queries ?? []), ...(query ? [query] : [])].slice(0, 8);
      if (!all.length) return reply(app, "search_hig", args, "Pass `queries`: a list with one entry per topic.", true);
      const text = lookupHig(all, max_chars ?? 40000, platforms?.length ? platforms : platformsIn(all));
      return reply(app, "search_hig", args, text);
    },
  );

  server.registerTool(
    "get_hig_page",
    {
      title: "Read a Human Interface Guidelines page",
      description:
        "Read one page or section of Apple's Human Interface Guidelines by id. Use it for a section that search_hig " +
        "listed but did not include. With only `page`, returns the page's summary and a list of its sections with " +
        "their sizes. With `section`, returns that section's full text. Pictures are given as Apple's own " +
        "descriptions of them.",
      inputSchema: {
        page: z
          .string()
          .min(1)
          .max(200)
          .describe("Page id from search_hig, such as \"tab-bars\". A page title or developer.apple.com URL also works."),
        section: z
          .string()
          .max(200)
          .optional()
          .describe("Section id from search_hig or from this tool's section list. \"all\" returns the whole page."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = readPage(args.page, args.section);
      return reply(app, "get_hig_page", args, result.text, !result.ok);
    },
  );

  server.registerTool(
    "get_device_metrics",
    {
      title: "Get device screen sizes",
      description:
        "Get the screen size of Apple devices in points and pixels, with the scale factor, corner radius and " +
        "safe-area insets (measured in the Simulator for iPhone and iPad), as defined by " +
        `${devicePack.source.version}. Call it before drawing a screen, frame or mockup at a device's real size, ` +
        "and for devices newer than you remember. Name every device of the task in one call as `devices`, such as " +
        "[\"iPhone Duo\", \"iPad Pro 13\"]. Without `devices` it lists every current device.",
      inputSchema: {
        devices: z
          .array(z.string().min(1).max(100))
          .max(20)
          .optional()
          .describe("Device names or parts of names. \"iPhone 18\" returns every iPhone 18 model."),
        families: z
          .array(z.enum(FAMILIES))
          .optional()
          .describe("When `devices` is omitted, list only these kinds of device."),
        include_older: z
          .boolean()
          .optional()
          .describe("When `devices` is omitted, also list devices the newest OS version no longer supports."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const text = deviceMetrics(args.devices ?? [], args.families ?? [], args.include_older ?? false);
      return reply(app, "get_device_metrics", args, text);
    },
  );

  server.registerTool(
    "get_device_frame",
    {
      title: "Get device frames",
      description:
        "Get Apple's pictures of a device to show a design inside it. For each device it returns Apple's product " +
        "bezels (photographic PNGs of the real device in each finish and orientation, with a see-through screen and " +
        "the screen's exact position) where Apple publishes them, and a flat vector frame as SVG from Xcode's " +
        "Simulator (as an address when bezels come with it). Covers iPhone, iPad, Apple Watch, Apple TV, MacBook, iMac and Studio Display. Name every device " +
        "in one call as `devices`, such as [\"iPhone Duo\", \"MacBook Air 13\"]. A folding device returns one " +
        "picture per pose. Use it instead of drawing a device by hand.",
      inputSchema: {
        devices: z.array(z.string().min(1).max(100)).min(1).max(8).describe("Device names, such as [\"iPhone 18 Pro\", \"iPad Pro 13\"]."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = deviceFrames(args.devices, origin);
      return reply(app, "get_device_frame", args, result.text, !result.ok);
    },
  );

  server.registerTool(
    "search_symbols",
    {
      title: "Find SF Symbols",
      description:
        `Find icons in Apple's SF Symbols (${symbolPack.source.symbols} symbols, version ${symbolPack.source.version}) ` +
        "and get them as SVG. Pass every icon the design needs in one call as `queries`, one entry per icon, such as " +
        "[\"settings\", \"heart\", \"share\", \"trash\"]. Each query returns the best-matching symbol with its SVG " +
        "and the names of other matches. Pass `weight` to match the text beside the icons. Use it instead of drawing icons or using another icon set, and to check " +
        "that a symbol name exists before using it in code.",
      inputSchema: {
        queries: z
          .array(z.string().min(1).max(100))
          .min(1)
          .max(20)
          .describe("One entry per icon: a symbol name such as \"square.and.arrow.up\", or plain words such as \"share\"."),
        limit: z.number().int().min(1).max(40).optional().describe("Matches to list for each query. Default 8."),
        svg_per_query: z
          .number()
          .int()
          .min(0)
          .max(5)
          .optional()
          .describe("How many of each query's top matches come with their SVG. Default 1. Use 0 for names only."),
        weight: weightInput,
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const text = await lookupSymbols(args.queries, args.limit ?? 8, args.svg_per_query ?? 1, loadShape, origin, args.weight ?? "regular");
      return reply(app, "search_symbols", args, text);
    },
  );

  server.registerTool(
    "get_symbol",
    {
      title: "Get SF Symbols by name",
      description:
        "Get the SVG of SF Symbols whose exact names you know, such as names that search_symbols listed without " +
        "their shapes. Pass every name in one call.",
      inputSchema: {
        names: z.array(z.string().min(1).max(100)).min(1).max(40).describe("Symbol names, such as [\"heart.fill\", \"gearshape\"]."),
        weight: weightInput,
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = await readSymbols(args.names, loadShape, origin, args.weight ?? "regular");
      return reply(app, "get_symbol", args, result.text, !result.ok);
    },
  );

  server.registerTool(
    "get_technology_assets",
    {
      title: "Get Apple technology artwork",
      description:
        "Get Apple's own artwork for showing its technologies in an app: the Sign in with Apple logo, AirPlay glyphs, " +
        "ARKit badges, Game Center icons and symbols, the HomeKit glyph, the Apple Health and Home app icons, Siri " +
        "icons and the Add Apple Watch Face button. Vector artwork comes as SVG, pictures as a PNG address. Name " +
        "every technology of the task in one call as `technologies`; without it the tool lists everything it holds. " +
        "Use it instead of drawing an Apple logo or badge by hand.",
      inputSchema: {
        technologies: z
          .array(z.string().min(1).max(100))
          .max(10)
          .optional()
          .describe(
            "Technology names, such as [\"Sign in with Apple\", \"AirPlay\"]. Add words from an artwork's name to narrow it, such as \"Sign in with Apple logo only\" or \"Game Center symbol\".",
          ),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = technologyAssets(args.technologies ?? [], origin);
      return reply(app, "get_technology_assets", args, result.text, !result.ok);
    },
  );

  server.registerTool(
    "get_design_values",
    {
      title: "Get system colors, text styles and sizes",
      description:
        "Get the exact values Apple defines in its UI kits for iOS and iPadOS 27 and for macOS 27: system colors as hex " +
        "for light and dark mode and increased contrast (labels, fills, backgrounds, separators, accents, grays), " +
        "text styles (size, leading, tracking, weight), standard sizes (sheet and popover corner radii, margins, " +
        "home indicator, menus; on macOS the metrics of buttons, toggles, sliders and other controls at each control " +
        "size), materials and Liquid Glass settings. Call it once before choosing colors, type or spacing for an " +
        "Apple-platform design, instead of recalling values. With topics [\"layout\"] it returns Apple's layout " +
        "guides for iPhone Duo: layout margins, safe areas, reserved regions and the fold avoidance region.",
      inputSchema: {
        platform: z.enum(VALUE_PLATFORMS).optional().describe("\"ios\" (iPhone and iPad, the default) or \"macos\"."),
        topics: z
          .array(z.enum(VALUE_TOPICS))
          .optional()
          .describe("Which tables to return. Default: colors, text, sizes and materials. \"layout\" is returned only when named."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = designValues(args.platform ?? "ios", args.topics ?? []);
      return reply(app, "get_design_values", args, result.text, !result.ok);
    },
  );

  server.registerTool(
    "search_ui_kit",
    {
      title: "Look up Apple's UI kit components",
      description:
        `Get Apple's own standard components, from Apple's UI kits for ${uiKitPack.source.kits.join(", ")} ` +
        `(${uiKitPack.source.components} components, ${uiKitPack.source.variants} variants): toolbars, tab bars, sidebars, lists, ` +
        "alerts, sheets, menus, buttons, toggles, sliders, text fields, keyboards, widgets, notifications, windows and " +
        "whole example screens. For each query it returns the best-matching component as Apple's drawing of it: an SVG " +
        "exported from the kit, with labels as editable text and icons named as SF Symbols, to place in a design as it is. " +
        "Beside it come the component's variants and properties and an outline of its layers: exact sizes, auto layout " +
        "(direction, gap, padding), corner radii, colors and text styles by Apple's names, for building it in code. Pass " +
        "every component of the design in one call as `queries`, such as [\"tab bar\", \"large title toolbar\", \"list row\"]. " +
        "Add a device or a variant's words to narrow a query, such as \"iPad sidebar\", \"destructive button\" or \"tab bar 4 tabs\"; the variant a query names is the drawing it returns. In a mockup, place " +
        "the SVG as it is for every standard Apple component and only change its icons and labels; do not rebuild it in HTML or CSS. In SwiftUI, UIKit or AppKit code, use the system's own component instead. Without `queries` it lists every component.",
      inputSchema: {
        queries: z
          .array(z.string().min(1).max(120))
          .max(12)
          .optional()
          .describe("One entry per component: plain words such as \"segmented control\", or a component's exact name from an earlier reply."),
        platform: z
          .enum(KIT_IDS)
          .optional()
          .describe("\"ios\" (iPhone and iPad, the default), \"macos\" or \"watchos\". A query that says \"mac\" or \"watch\" chooses its own kit."),
        max_chars: z
          .number()
          .int()
          .min(2000)
          .max(100000)
          .optional()
          .describe("Approximate size limit for the drawings and outlines, shared between the queries. Default 40000. Each query's name, variants and other matches (about 1,500 characters) and the notes on using drawings (about 2,500) come on top."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = await searchUiKit(args.queries ?? [], args.platform, args.max_chars ?? 40000, loadOutlines, loadDrawing, origin);
      return reply(app, "search_ui_kit", args, result.text, !result.ok);
    },
  );

  server.registerTool(
    "get_design_brief",
    {
      title: "Get a design brief for one device",
      description:
        "Get everything a screen design for one Apple device needs in one reply: the device's screen size and " +
        "Apple's pictures of it, the guidelines written for that device and platform, the guidelines for each " +
        "component, Apple's own drawing of each component as SVG in the device's variant, the icons as SF Symbols, and " +
        "the platform's system colors, text styles and sizes. Everything is limited to the device's platform, so a " +
        "watch design gets only watchOS material. Call it first, once, naming every component and icon of the " +
        "design; use the other tools only for what it does not cover. In a mockup, place the component SVGs as they are and " +
        "only change their icons and labels; in SwiftUI, UIKit or AppKit code, use the system's own components instead.",
      inputSchema: {
        device: z.string().min(1).max(100).describe("One device, such as \"iPhone 18 Pro\", \"iPad Pro 13\", \"Apple Watch Series 11\" or \"MacBook Air 13\"."),
        components: z
          .array(z.string().min(1).max(120))
          .max(12)
          .optional()
          .describe("Every standard component of the design, such as [\"tab bar\", \"toolbar\", \"list row\"]. Add a variant's words to narrow one, such as \"tab bar 4 tabs\"."),
        icons: z
          .array(z.string().min(1).max(100))
          .max(20)
          .optional()
          .describe("Every icon of the design, as a symbol name or plain words, such as [\"heart\", \"share\", \"timer\"]."),
        topics: z
          .array(z.string().min(1).max(200))
          .max(6)
          .optional()
          .describe("Other guideline topics, such as [\"dark mode\", \"onboarding\"]."),
        weight: weightInput,
        max_chars: z
          .number()
          .int()
          .min(10000)
          .max(150000)
          .optional()
          .describe("Approximate size limit for the guidelines and drawings. Default 90000."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = await designBrief(
        {
          device: args.device,
          components: args.components ?? [],
          icons: args.icons ?? [],
          topics: args.topics ?? [],
          weight: args.weight ?? "regular",
          maxChars: args.max_chars ?? 90000,
        },
        { shape: loadShape, outlines: loadOutlines, drawing: loadDrawing },
        origin,
      );
      return reply(app, "get_design_brief", args, result.text, !result.ok);
    },
  );

  return server;
}

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS)) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

function rpcError(status: number, message: string, headers: Record<string, string> = {}): Response {
  return withCors(
    Response.json({ jsonrpc: "2.0", error: { code: -32000, message }, id: null }, { status, headers }),
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
      // Stateless server: there is no stream to open (GET) or session to end (DELETE).
      if (request.method !== "POST") return rpcError(405, "Method not allowed. Send POST.", { Allow: "POST, OPTIONS" });

      const server = buildServer((request.headers.get("User-Agent") ?? "unknown").slice(0, 80), env, url.origin);
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
        enableJsonResponse: true,
      });
      try {
        await server.connect(transport);
        return withCors(await transport.handleRequest(request));
      } catch (err) {
        console.error("mcp request failed", err);
        return rpcError(500, "Internal server error");
      }
    }

    // A device's vector frame from Xcode's Simulator: /frames/ID.svg.
    const frameMatch = /^\/frames\/([^/]+)\.svg$/.exec(url.pathname);
    if (frameMatch && request.method === "GET") {
      let id = frameMatch[1];
      try { id = decodeURIComponent(id); } catch {}
      const svg = frameSvg(id);
      if (!svg) return new Response("Not found\n", { status: 404, headers: CORS });
      return new Response(svg + "\n", {
        headers: { ...CORS, "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400" },
      });
    }

    // A symbol in another weight, read from its shard: /symbols/WEIGHT/NAME.svg.
    const weighted = /^\/symbols\/([a-z]+)\/([^/]+)\.svg$/.exec(url.pathname);
    if (weighted && request.method === "GET" && (WEIGHTS as readonly string[]).includes(weighted[1])) {
      let name = weighted[2];
      try { name = decodeURIComponent(name); } catch {}
      const svg = await shapeLoader(env)(name, weighted[1] as Weight);
      if (!svg) return new Response("Not found\n", { status: 404, headers: CORS });
      return new Response(svg + "\n", {
        headers: { ...CORS, "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400" },
      });
    }

    if (url.pathname === "/" && request.method === "GET") {
      const text =
        `${SERVER_NAME} MCP server ${SERVER_VERSION}\n` +
        `Human Interface Guidelines: ${higPack.source.pages} pages, copied ${HIG_DATE}\n\n` +
        `Add this URL as a custom connector in your AI app:\n${url.origin}/mcp\n`;
      return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    return new Response("Not found\n", { status: 404 });
  },
};

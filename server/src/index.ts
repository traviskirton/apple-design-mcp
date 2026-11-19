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
import { deviceFrames, framePack } from "./frames.js";
import { higPack, lookupHig, platformsIn, readPage } from "./hig.js";
import { lookupSymbols, readSymbols, symbolPack } from "./symbols.js";
import type { ShapeLoader } from "./symbols.js";

const SERVER_NAME = "apple-design";
const SERVER_VERSION = "0.5.0";

const HIG_DATE = higPack.pack_version;

const PACK = {
  status: "partial",
  note: "Human Interface Guidelines text, device screen sizes, device frames and SF Symbols (names and regular-weight shapes) are loaded. UI kits and design values are not loaded yet.",
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
  ],
  tools: ["get_pack_info", "search_hig", "get_hig_page", "get_device_metrics", "get_device_frame", "search_symbols", "get_symbol"],
  planned_tools: ["get_design_values", "make_asset_catalog", "make_app_icon", "search_ui_kit", "frame_screenshot"],
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

function buildServer(app: string, env: Env, origin: string): McpServer {
  const loadShape: ShapeLoader = async (name) => {
    if (!env.ASSETS) return null;
    const res = await env.ASSETS.fetch(`https://assets.local/symbols/${name}.svg`);
    return res.ok ? res.text() : null;
  };

  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Apple design reference for designing and building apps for iPhone, iPad, Mac, Apple Watch, Apple TV and " +
        `Apple Vision Pro. It holds Apple's Human Interface Guidelines as published on ${HIG_DATE}, which may be ` +
        "newer than what you remember. Before designing a screen or component, make one search_hig call that lists " +
        "every component, device and topic involved. It returns the guideline text itself, so one call is usually " +
        "enough; use get_hig_page only for a section that search_hig lists but does not include. For the size of a " +
        "device's screen, call get_device_metrics instead of estimating. For icons, call search_symbols once with " +
        "every icon the design needs; it returns real SF Symbols as SVG, so do not substitute another icon set.",
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
        "Get the screen size of Apple devices in points and pixels, with the scale factor, as defined by " +
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
        "Get the drawing of an Apple device's body (its bezel) as SVG, with the exact position of the screen inside " +
        "it, to show a design inside a device. Name every device in one call as `devices`, such as [\"iPhone Duo\"]. " +
        "A folding device returns one frame per screen. Use it instead of drawing a device outline by hand.",
      inputSchema: {
        devices: z.array(z.string().min(1).max(100)).min(1).max(4).describe("Device names, such as [\"iPhone 18 Pro\", \"iPad Pro 13\"]."),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = deviceFrames(args.devices);
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
        "and the names of other matches. Use it instead of drawing icons or using another icon set, and to check " +
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
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const text = await lookupSymbols(args.queries, args.limit ?? 8, args.svg_per_query ?? 1, loadShape, origin);
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
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = await readSymbols(args.names, loadShape, origin);
      return reply(app, "get_symbol", args, result.text, !result.ok);
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

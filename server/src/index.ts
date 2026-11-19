// Apple design MCP server.
//
// Stateless: every request builds a fresh server and answers in plain JSON, so it
// needs no storage, no sessions and no sign-in. The Human Interface Guidelines are
// compiled into the Worker (see scripts/build-hig-pack.mjs), so a tool call makes no
// network or storage request.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { higPack, lookupHig, platformsIn, readPage } from "./hig.js";

const SERVER_NAME = "apple-design";
const SERVER_VERSION = "0.2.1";

const HIG_DATE = higPack.pack_version;

const PACK = {
  status: "partial",
  note: "Human Interface Guidelines text is loaded. SF Symbols, UI kits, device frames and design values are not loaded yet.",
  pack_version: higPack.pack_version,
  sources: [
    {
      name: higPack.source.name,
      version: `copied from ${higPack.source.url} at ${higPack.generated_at}`,
      pages: higPack.source.pages,
      sections: higPack.source.sections,
      sha256: higPack.source.sha256,
    },
  ],
  tools: ["get_pack_info", "search_hig", "get_hig_page"],
  planned_tools: [
    "search_symbols", "get_symbol", "get_design_values",
    "get_device_metrics", "make_asset_catalog", "make_app_icon",
    "search_ui_kit", "frame_screenshot",
  ],
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

function buildServer(app: string): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Apple design reference for designing and building apps for iPhone, iPad, Mac, Apple Watch, Apple TV and " +
        `Apple Vision Pro. It holds Apple's Human Interface Guidelines as published on ${HIG_DATE}, which may be ` +
        "newer than what you remember. Before designing a screen or component, make one search_hig call that lists " +
        "every component, device and topic involved. It returns the guideline text itself, so one call is usually " +
        "enough; use get_hig_page only for a section that search_hig lists but does not include.",
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
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
      // Stateless server: there is no stream to open (GET) or session to end (DELETE).
      if (request.method !== "POST") return rpcError(405, "Method not allowed. Send POST.", { Allow: "POST, OPTIONS" });

      const server = buildServer((request.headers.get("User-Agent") ?? "unknown").slice(0, 80));
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

// Apple design MCP server, milestone 0: one tool, no data yet.
//
// The only purpose of this version is to prove that a server on Cloudflare
// Workers can be added by URL in claude.ai, the Claude apps and chatgpt.com.
// It is stateless: every request builds a fresh server and answers in plain
// JSON, so it needs no storage, no sessions and no sign-in.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

const SERVER_NAME = "apple-design";
const SERVER_VERSION = "0.0.1";

// Stands in for the real asset pack manifest until the extractor exists.
const PACK = {
  status: "placeholder",
  note: "Milestone 0 connection test. No Apple assets are loaded yet.",
  pack_version: null as string | null,
  sources: [] as { name: string; version: string }[],
  planned_tools: [
    "search_symbols", "get_symbol",
    "search_hig", "get_hig_page", "get_design_values",
    "get_device_metrics", "make_asset_catalog", "make_app_icon",
    "search_ui_kit", "frame_screenshot",
  ],
};

function buildServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Apple design reference for building Apple-platform apps. This is an early test version: " +
        "only get_pack_info works, and it reports that no assets are loaded yet.",
    },
  );

  server.registerTool(
    "get_pack_info",
    {
      title: "Get pack info",
      description:
        "Report which version of Apple's design assets this server has loaded (SF Symbols, " +
        "Human Interface Guidelines, UI kits, device bezels) and when the server answered. " +
        "Call it to check the server is connected and how current its data is.",
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      const info = {
        server: SERVER_NAME,
        server_version: SERVER_VERSION,
        answered_at: new Date().toISOString(),
        ...PACK,
      };
      return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
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

      const server = buildServer();
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
        `${SERVER_NAME} MCP server ${SERVER_VERSION} (connection test)\n\n` +
        `Add this URL as a custom connector in your AI app:\n${url.origin}/mcp\n`;
      return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    return new Response("Not found\n", { status: 404 });
  },
};

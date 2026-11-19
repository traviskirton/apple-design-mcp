// Connects to the server as a real MCP client, lists its tools and calls get_pack_info.
// Usage: npm test                       (against `npm run dev` on this machine)
//        npm test -- https://HOST/mcp   (against the deployed server)
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = process.argv[2] ?? "http://127.0.0.1:8787/mcp";
const client = new Client({ name: "smoke-test", version: "0.0.1" });

try {
  await client.connect(new StreamableHTTPClientTransport(new URL(url)));
  const info = client.getServerVersion();
  console.log(`connected to ${info?.name} ${info?.version} at ${url}`);

  const { tools } = await client.listTools();
  console.log("tools:", tools.map((t) => t.name).join(", "));
  if (!tools.some((t) => t.name === "get_pack_info")) throw new Error("get_pack_info is missing");

  const result = await client.callTool({ name: "get_pack_info", arguments: {} });
  const text = result.content?.[0]?.text ?? "";
  console.log(text);
  if (result.isError || !JSON.parse(text).answered_at) throw new Error("unexpected tool result");

  console.log("\nOK");
  await client.close();
} catch (err) {
  console.error("\nFAILED:", err.message ?? err);
  process.exit(1);
}

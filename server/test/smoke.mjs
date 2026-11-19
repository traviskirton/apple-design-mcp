// Connects to the server as a real MCP client and tries every tool.
// Usage: npm test                       (against `npm run dev` on this machine)
//        npm test -- https://HOST/mcp   (against the deployed server)
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = process.argv[2] ?? "http://127.0.0.1:8787/mcp";
const client = new Client({ name: "smoke-test", version: "0.2.0" });

function check(ok, what) {
  if (!ok) throw new Error(what);
}

async function call(name, args = {}) {
  const started = performance.now();
  const result = await client.callTool({ name, arguments: args });
  const text = result.content?.[0]?.text ?? "";
  const ms = Math.round(performance.now() - started);
  console.log(`\n${name} ${JSON.stringify(args)}  (${ms} ms, ${text.length} characters)`);
  return { text, isError: Boolean(result.isError) };
}

const firstLines = (text, n) => text.split("\n").slice(0, n).join("\n");

try {
  await client.connect(new StreamableHTTPClientTransport(new URL(url)));
  const info = client.getServerVersion();
  console.log(`connected to ${info?.name} ${info?.version} at ${url}`);

  const { tools } = await client.listTools();
  console.log("tools:", tools.map((t) => t.name).join(", "));
  for (const name of ["get_pack_info", "search_hig", "get_hig_page"]) {
    check(tools.some((t) => t.name === name), `${name} is missing`);
  }

  const pack = await call("get_pack_info");
  console.log(pack.text);
  const parsed = JSON.parse(pack.text);
  check(!pack.isError && parsed.answered_at, "get_pack_info gave an unexpected result");
  check(parsed.sources?.[0]?.pages >= 100, "the guidelines pack looks empty");

  const search = await call("search_hig", { queries: ["tab bar", "sheet"], platforms: ["ios"] });
  console.log(search.text.split("\n").filter((line) => /^#{1,3} /.test(line)).join("\n"));
  check(!search.isError && search.text.includes('(page "tab-bars")'), 'search_hig did not return the "tab-bars" page');
  check(search.text.includes("### Best practices"), "search_hig should include section text");
  check(!search.text.includes("#### visionOS"), "search_hig should leave out other platforms' sections");

  const small = await call("search_hig", { queries: ["button"], max_chars: 3000 });
  check(small.text.length < 8000 && small.text.includes("Not included for size"), "search_hig should respect max_chars");

  const single = await call("search_hig", { query: "dark mode color" });
  check(!single.isError && single.text.includes('(page "dark-mode")'), "search_hig should still accept a single `query`");

  const nothing = await call("search_hig", { queries: ["zzqqxx"] });
  check(nothing.text.includes("No guideline sections match"), "search_hig should say when nothing matches");

  const outline = await call("get_hig_page", { page: "tab-bars" });
  console.log(firstLines(outline.text, 6));
  check(!outline.isError && outline.text.includes('"best-practices"'), "get_hig_page did not list the page's sections");

  const section = await call("get_hig_page", { page: "Tab bars", section: "best-practices" });
  console.log(firstLines(section.text, 5));
  check(!section.isError && section.text.includes("## Best practices"), "get_hig_page did not return the section");
  check(section.text.length < outline.text.length * 20, "a section should be much smaller than a page");

  const missing = await call("get_hig_page", { page: "no-such-page" });
  check(missing.isError && missing.text.includes("There is no guidelines page"), "a missing page should be an error");

  console.log("\nOK");
  await client.close();
} catch (err) {
  console.error("\nFAILED:", err.message ?? err);
  if (err.cause) console.error("cause:", err.cause.message ?? err.cause);
  process.exit(1);
}

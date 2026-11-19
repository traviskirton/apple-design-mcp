// Downloads Apple's Human Interface Guidelines and writes them as the server's HIG pack.
//
//   node scripts/build-hig-pack.mjs               rebuild the pack from Apple's site
//   node scripts/build-hig-pack.mjs --if-missing  do nothing when the pack already exists
//
// Output: src/pack/hig.js (not committed). Each page is split into sections at its
// headings so the server can return one section instead of a whole page, and the
// search index is built here so the server does no indexing work per request.
// Set HIG_JSON_DIR to a folder of saved page JSON files to build without the network.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { words } from "../src/terms.js";

const BASE = "https://developer.apple.com/tutorials/data";
const SITE = "https://developer.apple.com";
const HIG_ROOT = "/design/human-interface-guidelines";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "pack", "hig.js");
const LOCAL = process.env.HIG_JSON_DIR;

if (process.argv.includes("--if-missing") && existsSync(OUT)) process.exit(0);

// ---------- DocC JSON to Markdown ----------

const CORRECT = /^(a checkmark in a circle|correct usage)/i;
const INCORRECT = /^(an x in a circle|incorrect usage)/i;
const DECORATIVE = /^a stylized representation\b.*six-color apple logo/i; // the banner at the top of each page

function inline(nodes, refs) {
  let out = "";
  for (const n of nodes ?? []) {
    switch (n.type) {
      case "text":
        out += n.text ?? "";
        break;
      case "codeVoice":
        out += "`" + (n.code ?? "") + "`";
        break;
      case "emphasis":
        out += "*" + inline(n.inlineContent, refs) + "*";
        break;
      case "strong":
        out += "**" + inline(n.inlineContent, refs) + "**";
        break;
      case "reference": {
        const ref = refs[n.identifier] ?? {};
        out += ref.title || inline(ref.titleInlineContent, refs) || n.identifier || "";
        break;
      }
      case "image": {
        // The pictures are not in the pack; Apple's description of each one is.
        const alt = (refs[n.identifier]?.alt ?? "").trim();
        if (CORRECT.test(alt)) out += "[Correct]";
        else if (INCORRECT.test(alt)) out += "[Incorrect]";
        else if (alt && !DECORATIVE.test(alt)) out += `[Image: ${alt}]`;
        break;
      }
      default:
        if (n.inlineContent) out += inline(n.inlineContent, refs);
    }
  }
  return out;
}

const blocks = (list, refs, depth) => (list ?? []).map((b) => block(b, refs, depth));

function block(b, refs, depth) {
  switch (b.type) {
    case "heading":
      return "#".repeat(Math.min(b.level ?? 2, 6)) + " " + (b.text ?? "") + "\n";
    case "paragraph":
      return inline(b.inlineContent, refs) + "\n";
    case "unorderedList":
    case "orderedList":
      return (
        (b.items ?? [])
          .map((item, i) => {
            const body = blocks(item.content, refs, depth + 1)
              .map((s) => s.trim())
              .join("\n");
            const marker = b.type === "unorderedList" ? "- " : `${i + 1}. `;
            return "  ".repeat(depth) + marker + body.replaceAll("\n", "\n" + "  ".repeat(depth + 1));
          })
          .join("\n") + "\n"
      );
    case "aside": {
      const name = b.name || (b.style ? b.style[0].toUpperCase() + b.style.slice(1) : "Note");
      const body = blocks(b.content, refs, depth)
        .map((s) => s.trim())
        .join(" ");
      return `> **${name}:** ${body}\n`;
    }
    case "table": {
      const cell = (c) =>
        blocks(c, refs, 0)
          .map((s) => s.trim().replaceAll("\n", " "))
          .filter(Boolean)
          .join(" ")
          .replaceAll("|", "\\|");
      const lines = [];
      (b.rows ?? []).forEach((row, i) => {
        lines.push("| " + row.map(cell).join(" | ") + " |");
        if (i === 0) lines.push("|" + " --- |".repeat(row.length));
      });
      return lines.join("\n") + "\n";
    }
    case "codeListing":
      return "```" + (b.syntax ?? "") + "\n" + (b.code ?? []).join("\n") + "\n```\n";
    case "tabNavigator":
      return (b.tabs ?? [])
        .map((tab) => {
          const inner = blocks(tab.content, refs, depth).join("\n");
          return inner.trim() ? `**${tab.title ?? ""}**\n\n${inner}` : "";
        })
        .filter(Boolean)
        .join("\n");
    case "row":
      return (b.columns ?? []).map((col) => blocks(col.content, refs, depth).join("\n")).join("\n");
    case "termList":
      return (
        (b.items ?? [])
          .map((item) => {
            const term = inline(item.term?.inlineContent, refs);
            const def = blocks(item.definition?.content, refs, depth)
              .map((s) => s.trim())
              .join(" ");
            return `- **${term}**: ${def}`;
          })
          .join("\n") + "\n"
      );
    case "small":
      return inline(b.inlineContent, refs) + "\n";
    case "links":
      return (
        (b.items ?? [])
          .map((id) => refs[id]?.title)
          .filter(Boolean)
          .map((t) => `- ${t}`)
          .join("\n") + "\n"
      );
    case "video":
    case "thematicBreak":
      return "";
    default:
      return b.content ? blocks(b.content, refs, depth).join("\n") : "";
  }
}

const tidy = (parts) =>
  parts
    .map((s) => s.trimEnd())
    .filter((s) => s.trim())
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Splits a page at its level 2 and level 3 headings. Text before the first heading
// becomes the "overview" section; a level 3 section's id is "parent/child".
function toSections(doc) {
  const refs = doc.references ?? {};
  const sections = [{ id: "overview", title: "Overview", level: 2, parts: [] }];
  const used = new Set(["overview"]);
  let parent = "";
  for (const sec of doc.primaryContentSections ?? []) {
    for (const b of sec.content ?? []) {
      if (b.type === "heading" && (b.level === 2 || b.level === 3)) {
        const own = slug(b.anchor || b.text || "section") || "section";
        let id = b.level === 3 && parent ? `${parent}/${own}` : own;
        for (let n = 2; used.has(id); n++) id = `${id.replace(/-\d+$/, "")}-${n}`;
        used.add(id);
        if (b.level === 2) parent = id;
        sections.push({ id, title: b.text ?? "", level: b.level, parts: [] });
      } else {
        sections.at(-1).parts.push(block(b, refs, 0));
      }
    }
  }
  return sections
    .map(({ parts, ...s }) => ({ ...s, text: tidy(parts) }))
    .filter((s, i, all) => s.text || (s.level === 2 && all[i + 1]?.level === 3));
}

// ---------- Crawl ----------

async function load(path) {
  if (LOCAL) {
    const file = join(LOCAL, (path.slice(HIG_ROOT.length).replace(/^\//, "").replaceAll("/", "_") || "index") + ".json");
    return JSON.parse(readFileSync(file, "utf8"));
  }
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(BASE + path + ".json", { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

const seen = new Set();
const queue = [HIG_ROOT];
const pages = [];
const failed = [];
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  let doc;
  try {
    doc = await load(path);
  } catch (err) {
    failed.push(`${path}: ${err.cause?.message ?? err.message}`);
    continue;
  }
  if (!LOCAL) await new Promise((r) => setTimeout(r, 100));
  for (const ref of Object.values(doc.references ?? {})) {
    const url = (ref.url ?? "").toLowerCase();
    if (url.startsWith(HIG_ROOT + "/") && !url.includes("#") && !seen.has(url)) queue.push(url);
  }
  const id = path.slice(HIG_ROOT.length).replace(/^\//, "");
  const sections = toSections(doc);
  const size = sections.reduce((n, s) => n + s.text.length, 0);
  if (!id || size < 400) continue; // the root and the category pages are only lists of links
  const meta = doc.metadata ?? {};
  const platforms = (meta.customMetadata?.["supported-platforms"] ?? "").split(",").filter(Boolean);
  const trail = (doc.hierarchy?.paths?.[0] ?? [])
    .slice(2)
    .map((ident) => doc.references?.[ident]?.title)
    .filter(Boolean);
  pages.push({
    id,
    title: meta.title ?? id,
    abstract: inline(doc.abstract, doc.references ?? {}).trim(),
    url: SITE + path,
    ...(trail.length ? { category: trail.join(" > ") } : {}),
    ...(platforms.length ? { platforms } : {}),
    sections,
  });
  if (!LOCAL && pages.length % 25 === 0) console.log(`  ${pages.length} pages...`);
}

if (failed.length) console.error(`Could not load ${failed.length} page(s):\n  ${failed.join("\n  ")}`);
if (pages.length < 100) {
  console.error(`Only ${pages.length} pages loaded; expected about 170. The pack was not written.`);
  process.exit(1);
}

pages.sort((a, b) => a.id.localeCompare(b.id));

// Search index: for each word, the sections that contain it and how often.
// Sections are numbered in page order; src/hig.ts numbers them the same way.
const NOT_SEARCHED = new Set(["resources", "change-log"]); // link lists and edit history
const postings = {};
const lengths = [];
let n = 0;
for (const page of pages) {
  for (const section of page.sections) {
    const at = n++;
    if (NOT_SEARCHED.has(section.id)) {
      lengths.push(0);
      continue;
    }
    const list = words((section.id === "overview" ? page.abstract + " " : "") + section.text);
    lengths.push(list.length);
    const counts = new Map();
    for (const w of list) counts.set(w, (counts.get(w) ?? 0) + 1);
    for (const [w, count] of counts) (postings[w] ??= []).push(at, count);
  }
}

const sha256 = createHash("sha256").update(JSON.stringify(pages)).digest("hex");
const now = new Date().toISOString();
const pack = {
  pack_version: now.slice(0, 10),
  generated_at: now,
  source: {
    name: "Human Interface Guidelines",
    url: SITE + HIG_ROOT,
    pages: pages.length,
    sections: n,
    sha256,
  },
  pages,
  index: { lengths, postings },
};

mkdirSync(dirname(OUT), { recursive: true });
// JSON.parse of one string starts faster in the Worker than a large object literal.
writeFileSync(OUT, `export default JSON.parse(${JSON.stringify(JSON.stringify(pack))});\n`);
console.log(`HIG pack: ${pack.source.pages} pages, ${pack.source.sections} sections, written to src/pack/hig.js`);

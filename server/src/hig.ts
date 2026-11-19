// Search and lookup over the Human Interface Guidelines pack.
// Everything here is plain string work on data loaded with the Worker, so a request
// needs no network or storage call.
import pack from "./pack/hig.js";
import type { HigPage, HigSection } from "./pack/hig.js";
import { words } from "./terms.js";

export const higPack = pack;

interface Entry {
  page: HigPage;
  section: HigSection;
  pageWords: Set<string>;
  sectionWords: Set<string>;
}

const pagesById = new Map<string, HigPage>(pack.pages.map((p) => [p.id, p]));

// One entry per section, in page order: the numbering the pack's search index uses.
const entries: Entry[] = pack.pages.flatMap((page) => {
  const pageWords = new Set(words(page.title));
  return page.sections.map((section) => ({ page, section, pageWords, sectionWords: new Set(words(section.title)) }));
});
const { lengths, postings } = pack.index;
const searched = lengths.filter((n) => n > 0);
const averageLength = searched.reduce((a, b) => a + b, 0) / searched.length;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/^-|-$/g, "");

const isWordChar = (code: number) => (code >= 97 && code <= 122) || (code >= 48 && code <= 57);

/** Position of the first query word in the text, for choosing what part to quote. */
function firstMatch(text: string, needles: string[]): number {
  const lower = text.toLowerCase();
  let best = -1;
  for (const needle of needles) {
    for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, at + 1)) {
      if (at === 0 || !isWordChar(lower.charCodeAt(at - 1))) {
        if (best === -1 || at < best) best = at;
        break;
      }
    }
  }
  return best;
}

function snippet(text: string, at: number, length = 220): string {
  const start = Math.max(0, at - 70);
  let cut = text.slice(start, start + length).replace(/\s+/g, " ").trim();
  if (start > 0) cut = "…" + cut.slice(cut.indexOf(" ") + 1);
  if (start + length < text.length) cut = cut.slice(0, cut.lastIndexOf(" ")) + "…";
  return cut;
}

export interface Hit {
  page: string;
  page_title: string;
  section: string;
  section_title: string;
  chars: number;
  snippet: string;
}

const subset = (small: Set<string>, big: Set<string>) => small.size > 0 && [...small].every((w) => big.has(w));

export function searchHig(query: string, limit = 8): Hit[] {
  const terms = [...new Set(words(query))].slice(0, 8);
  if (!terms.length) return [];
  const asked = new Set(terms);
  const score = new Float64Array(entries.length);
  const matched = new Uint8Array(entries.length);

  for (const term of terms) {
    const list = postings[term] ?? [];
    const hit = new Float64Array(entries.length);
    for (let i = 0; i < list.length; i += 2) {
      const n = list[i];
      const count = list[i + 1];
      // Repeats count for less each time, and long sections don't win on length alone.
      hit[n] = (3 * count) / (count + 1.2 * (0.25 + (0.75 * lengths[n]) / averageLength));
    }
    let sectionsWithTerm = 0;
    entries.forEach((e, n) => {
      if (!lengths[n]) return;
      if (e.sectionWords.has(term)) hit[n] += 4;
      // A page-title match lifts sections that also mention the word, and the page's overview.
      if (e.pageWords.has(term) && (hit[n] > 0 || e.section.id === "overview")) hit[n] += 3;
      if (hit[n] > 0) sectionsWithTerm++;
    });
    if (!sectionsWithTerm) continue;
    const rarity = Math.log(1 + searched.length / sectionsWithTerm);
    for (let n = 0; n < entries.length; n++) {
      if (hit[n] > 0) {
        score[n] += hit[n] * rarity;
        matched[n]++;
      }
    }
  }

  const ranked: number[] = [];
  entries.forEach((e, n) => {
    if (!matched[n]) return;
    score[n] *= (matched[n] / terms.length) ** 1.5;
    if (subset(e.pageWords, asked)) score[n] *= e.section.id === "overview" ? 3 : 1.5; // the query names this page
    if (subset(e.sectionWords, asked)) score[n] *= 1.3;
    ranked.push(n);
  });
  ranked.sort((a, b) => score[b] - score[a]);

  const needles = terms.map((t) => t.replace(/y$/, ""));
  const perPage = new Map<string, number>();
  const hits: Hit[] = [];
  for (const n of ranked) {
    const { page, section } = entries[n];
    const used = perPage.get(page.id) ?? 0;
    if (used >= 3) continue; // keep one long page from filling the list
    perPage.set(page.id, used + 1);
    hits.push({
      page: page.id,
      page_title: page.title,
      section: section.id,
      section_title: section.title,
      chars: section.text.length,
      snippet: snippet(section.text, Math.max(firstMatch(section.text, needles), 0)),
    });
    if (hits.length >= limit) break;
  }
  return hits;
}

export function formatHits(query: string, hits: Hit[]): string {
  if (!hits.length) {
    return `No guideline sections match "${query}". Try fewer or more general words, such as a component name ("toolbar", "sheet") or a topic ("color", "layout").`;
  }
  const lines = hits.map(
    (h, i) =>
      `${i + 1}. ${h.page_title} › ${h.section_title}\n   page: "${h.page}", section: "${h.section}" (${h.chars} characters)\n   ${h.snippet}`,
  );
  return `${hits.length} sections of Apple's Human Interface Guidelines match "${query}". Read one with get_hig_page.\n\n${lines.join("\n\n")}`;
}

/** Finds a page by id, by title, or by a URL that ends with its id. */
export function findPage(name: string): HigPage | undefined {
  const wanted = slug(name.replace(/^https?:\/\/[^/]+\/design\/human-interface-guidelines\//i, ""));
  return (
    pagesById.get(wanted) ??
    pack.pages.find((p) => slug(p.title) === wanted) ??
    pagesById.get(wanted + "s") ??
    pagesById.get(wanted.replace(/s$/, ""))
  );
}

export function suggestPages(name: string, limit = 6): HigPage[] {
  const seen = new Set<string>();
  const out: HigPage[] = [];
  for (const hit of searchHig(name, 30)) {
    if (seen.has(hit.page)) continue;
    seen.add(hit.page);
    out.push(pagesById.get(hit.page)!);
    if (out.length >= limit) break;
  }
  return out;
}

function findSections(page: HigPage, name: string): HigSection[] | undefined {
  const wanted = slug(name);
  let at = page.sections.findIndex((s) => s.id === wanted);
  if (at === -1) at = page.sections.findIndex((s) => s.id.split("/").pop() === wanted || slug(s.title) === wanted);
  if (at === -1) return undefined;
  const section = page.sections[at];
  if (section.level === 3) return [section];
  // A level 2 section comes with the level 3 sections under it.
  const rest = page.sections.slice(at + 1);
  const end = rest.findIndex((s) => s.level === 2);
  return [section, ...(end === -1 ? rest : rest.slice(0, end))];
}

const heading = (s: HigSection) => `${"#".repeat(s.level)} ${s.title}`;
const render = (sections: HigSection[]) =>
  sections.map((s) => (s.text ? `${heading(s)}\n\n${s.text}` : heading(s))).join("\n\n");

function header(page: HigPage): string {
  const facts = [
    page.category && `Category: ${page.category}`,
    page.platforms?.length && `Platforms: ${page.platforms.join(", ")}`,
    `Source: ${page.url}`,
  ].filter(Boolean);
  return `# ${page.title}\n\n${page.abstract}\n\n${facts.join("\n")}`;
}

export type PageResult = { ok: true; text: string } | { ok: false; text: string };

export function readPage(pageName: string, sectionName?: string): PageResult {
  const page = findPage(pageName);
  if (!page) {
    const near = suggestPages(pageName);
    const list = near.length ? ` Closest pages: ${near.map((p) => `"${p.id}"`).join(", ")}.` : "";
    return { ok: false, text: `There is no guidelines page "${pageName}".${list} Use search_hig to find the page id.` };
  }

  if (!sectionName) {
    const overview = page.sections.find((s) => s.id === "overview");
    const outline = page.sections
      .filter((s) => s.id !== "overview")
      .map((s) => `${s.level === 3 ? "  " : ""}- "${s.id}": ${s.title} (${s.text.length} characters)`);
    const total = page.sections.reduce((n, s) => n + s.text.length, 0);
    return {
      ok: true,
      text: [
        header(page),
        overview?.text,
        `## Sections of this page\n\nRead one by passing its id as \`section\`. A section with indented ids under it includes them. Pass "all" for the whole page (${total} characters).\n\n${outline.join("\n")}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (sectionName.trim().toLowerCase() === "all") {
    const body = page.sections.filter((s) => s.id !== "overview");
    const overview = page.sections.find((s) => s.id === "overview");
    return { ok: true, text: [header(page), overview?.text, render(body)].filter(Boolean).join("\n\n") };
  }

  const sections = findSections(page, sectionName);
  if (!sections) {
    const ids = page.sections.map((s) => `"${s.id}"`).join(", ");
    return { ok: false, text: `The page "${page.id}" has no section "${sectionName}". Its sections are: ${ids}.` };
  }
  return { ok: true, text: `From "${page.title}" in Apple's Human Interface Guidelines (${page.url})\n\n${render(sections)}` };
}

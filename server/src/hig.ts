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

const NOT_SEARCHED = new Set(["resources", "change-log"]); // link lists and edit history; the pack leaves them out of the index too

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

export interface Hit {
  page: string;
  section: string;
  /** Relative to the other hits of the same search; higher is a better match. */
  score: number;
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

  const perPage = new Map<string, number>();
  const hits: Hit[] = [];
  for (const n of ranked) {
    const { page, section } = entries[n];
    const used = perPage.get(page.id) ?? 0;
    if (used >= 3) continue; // keep one long page from filling the list
    perPage.set(page.id, used + 1);
    hits.push({ page: page.id, section: section.id, score: score[n] });
    if (hits.length >= limit) break;
  }
  return hits;
}

const NO_MATCH = (query: string) =>
  `No guideline sections match "${query}". Try fewer or more general words, such as a component name ("toolbar", "sheet") or a topic ("color", "layout").`;

/** Cuts text at the last paragraph break before `limit`. */
function cutAtParagraph(text: string, limit: number): string {
  const at = text.lastIndexOf("\n\n", limit);
  return text.slice(0, at > limit / 2 ? at : limit).trimEnd();
}

const PLATFORM_OF: Record<string, string> = {
  iphone: "ios", ios: "ios", ipad: "ipados", ipados: "ipados", mac: "macos", macos: "macos",
  watch: "watchos", watchos: "watchos", tv: "tvos", tvos: "tvos", vision: "visionos", visionos: "visionos",
};
const PLATFORMS = new Set(Object.values(PLATFORM_OF));

/** The platforms a "Platform considerations" subsection is about, or none for any other section. */
function sectionPlatforms(section: HigSection): string[] {
  if (!section.id.startsWith("platform-considerations/")) return [];
  return section.id.split("/")[1].split("-").filter((part) => PLATFORMS.has(part));
}

/** Platforms named in the queries, such as "iPhone" or "macOS". */
export function platformsIn(queries: string[]): string[] {
  const found = new Set<string>();
  for (const w of queries.flatMap((q) => q.toLowerCase().split(/[^a-z0-9]+/))) {
    if (PLATFORM_OF[w]) found.add(PLATFORM_OF[w]);
  }
  return [...found];
}

const pageWords = new Map<string, Set<string>>(pack.pages.map((p) => [p.id, new Set(words(p.title))]));
const sectionOrder = new Map<HigSection, number>(entries.map((e, n) => [e.section, n]));

/**
 * Pages a query asks for by name: every page whose whole title is in the query ("settings toggles"
 * names two), or else the one page whose title contains the whole query ("iPhone Duo").
 */
function namedPages(query: string, hits: Hit[]): HigPage[] {
  const asked = new Set(words(query));
  if (!asked.size) return [];
  const inQuery = pack.pages.filter((p) => subset(pageWords.get(p.id)!, asked));
  if (inQuery.length) return inQuery.sort((x, y) => pageWords.get(y.id)!.size - pageWords.get(x.id)!.size).slice(0, 2);
  const containing = pack.pages.filter((p) => subset(asked, pageWords.get(p.id)!));
  if (!containing.length) return [];
  const best = hits.find((h) => containing.some((p) => p.id === h.page));
  return [best ? pagesById.get(best.page)! : containing[0]];
}

interface Item {
  page: HigPage;
  section: HigSection;
}

// What people call a thing, next to the guidelines page that covers it. Applied before searching,
// so "navigation bar" reads as "toolbars" and names that page.
const PHRASES: [RegExp, string][] = [
  [/\b(navigation|nav) ?bars?\b/g, "toolbars"],
  [/\b(log ?in|sign ?in|sign ?up)\b(?! with apple)/g, "managing accounts sign in with apple"],
  [/\b(activity|loading) indicators?\b|\bspinners?\b/g, "progress indicators"],
  [/\bmodals?\b|\bbottom sheets?\b/g, "sheets"],
  [/\bspacing\b|\bmargins?\b|\bgrid\b/g, "layout"],
  [/\bfonts?\b|\btype ?scale\b/g, "typography"],
  [/\bswitch(es)?\b/g, "toggles"],
  [/\bdrop ?downs?\b/g, "pop-up buttons"],
  [/\bshare sheets?\b/g, "activity views"],
  [/\bsearch bars?\b/g, "search fields"],
  [/\b(toasts?|snackbars?)\b/g, "notifications"],
];

/** A query in the guidelines' own words. */
export function expandQuery(query: string): string {
  let q = query.toLowerCase();
  for (const [from, to] of PHRASES) q = q.replace(from, to);
  return q;
}

/** What one query should return, best first: named pages in Apple's own order, then strong search hits. */
function candidates(asked: string, platforms: string[], taken: Set<HigSection>): Item[] {
  const query = expandQuery(asked);
  const hits = searchHig(query, 12);
  const wanted = (s: HigSection) => {
    if (NOT_SEARCHED.has(s.id) || !s.text || taken.has(s)) return false;
    const about = sectionPlatforms(s);
    return !platforms.length || !about.length || about.some((p) => platforms.includes(p));
  };
  const items: Item[] = [];
  const named = namedPages(query, hits);
  for (const page of named) {
    for (const section of page.sections) if (wanted(section)) items.push({ page, section });
  }
  let extra = 0;
  for (const h of hits) {
    if (named.some((p) => p.id === h.page)) continue;
    if (h.score < hits[0].score * 0.5 || extra >= (named.length ? 2 : 4)) break;
    const page = pagesById.get(h.page)!;
    const section = page.sections.find((s) => s.id === h.section)!;
    if (wanted(section)) {
      items.push({ page, section });
      extra++;
    }
  }
  for (const item of items) taken.add(item.section);
  return items;
}

/** Splits `total` between needs: nobody gets more than they need, and what is spare goes to the rest. */
function share(needs: number[], total: number): number[] {
  const given = needs.map(() => 0);
  let open = needs.map((_, i) => i).filter((i) => needs[i] > 0);
  let left = total;
  while (open.length && left >= open.length) {
    const each = Math.floor(left / open.length);
    for (const i of open) {
      const add = Math.min(each, needs[i] - given[i]);
      given[i] += add;
      left -= add;
    }
    open = open.filter((i) => given[i] < needs[i]);
  }
  return given;
}

/**
 * Answers several topics in one reply with the text of the sections that apply, so that one tool
 * call is usually enough. `maxChars` is shared between the topics. A section that does not fit is
 * listed with its id so it can be read with get_hig_page.
 */
export function lookupHig(queries: string[], maxChars = 40000, platforms: string[] = platformsIn(queries)): string {
  const taken = new Set<HigSection>();
  const plans = queries.map((query) => ({ query, items: candidates(query, platforms, taken) }));
  const budgets = share(
    plans.map((p) => p.items.reduce((n, it) => n + it.section.text.length, 0)),
    maxChars,
  );

  const parts = plans.map(({ query, items }, i) => {
    if (!items.length) return `# "${query}"\n\n${NO_MATCH(query)}`;
    let left = budgets[i];
    const kept: { item: Item; text: string }[] = [];
    const omitted: Item[] = [];
    items.forEach((item, n) => {
      const text = item.section.text;
      if (text.length <= left) {
        kept.push({ item, text });
        left -= text.length;
      } else if (n === 0) {
        const cut = cutAtParagraph(text, Math.max(left, 1500));
        kept.push({ item, text: `${cut}\n\n(Cut here: ${cut.length} of ${text.length} characters.)` });
        left = 0;
      } else {
        omitted.push(item);
      }
    });

    // Group by page, each page's sections in Apple's order.
    const out: string[] = [`# "${query}"`];
    const pages = [...new Set(kept.map((k) => k.item.page))];
    for (const page of pages) {
      out.push(`## ${page.title} (page "${page.id}")\n\n${page.abstract}`);
      kept
        .filter((k) => k.item.page === page)
        .sort((x, y) => sectionOrder.get(x.item.section)! - sectionOrder.get(y.item.section)!)
        .forEach(({ item, text }) => out.push(`${"#".repeat(item.section.level + 1)} ${item.section.title}\n\n${text}`));
    }
    if (omitted.length) {
      const list = omitted.map(
        ({ page, section }) => `- page "${page.id}", section "${section.id}": ${section.title} (${section.text.length} characters)`,
      );
      out.push(`Not included for size. Read one with get_hig_page:\n${list.join("\n")}`);
    }
    return out.join("\n\n");
  });

  const scope = platforms.length ? ` Platform-specific sections are limited to: ${platforms.join(", ")}.` : "";
  return `From Apple's Human Interface Guidelines, as published on ${pack.pack_version}.${scope}\n\n${parts.join("\n\n")}`;
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

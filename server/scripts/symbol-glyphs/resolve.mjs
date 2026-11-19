// Turns the output of match.swift into one name per code point: node resolve.mjs out.txt
// Ties (identical shapes) go to the oldest symbol
// (release year, then Apple's order); when several code points share one tie set, they take its names
// in code-point order, oldest name to the lowest code point.
import { readFileSync } from "node:fs";
const { default: pack } = await import(new URL("../../src/pack/symbols.js", import.meta.url));
const order = new Map(pack.symbols.map((s, i) => [s.name, i]));
const year = new Map(pack.symbols.map((s) => [s.name, parseFloat(s.year ?? "9999")]));
const rank = (n) => [year.get(n) ?? 9999, order.get(n) ?? 1e9];
const cmp = (a, b) => { const [ya, oa] = rank(a), [yb, ob] = rank(b); return ya - yb || oa - ob; };
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").filter((l) => /^[0-9A-F]{6} /.test(l)).map((l) => {
  const [hex, best, score] = l.split(" ");
  const ties = l.includes("ties: ") ? l.split("ties: ")[1].split(",") : [best];
  return { hex, score: Number(score), ties: ties.sort(cmp) };
});
const groups = new Map();
for (const r of rows) { const k = r.ties.join(","); groups.set(k, [...(groups.get(k) ?? []), r]); }
for (const list of groups.values()) list.sort((a, b) => parseInt(a.hex, 16) - parseInt(b.hex, 16)).forEach((r, i) => { r.name = r.ties[Math.min(i, r.ties.length - 1)]; });
const override = { "100264": "personalhotspot" }; // checked by eye: the font's older drawing of the same symbol
for (const r of rows) {
  if (override[r.hex]) r.name = override[r.hex];
  const inPack = order.has(r.name) || Object.values(pack.aliases).includes(r.name) || r.name in pack.aliases;
  console.log(`${r.hex} ${r.name}${r.score < 0.9 && !override[r.hex] ? ` (shape match ${r.score})` : ""}${inPack ? "" : " NOT IN PACK"}`);
}

// Builds the UI kit pack from Apple's UI kits for Figma, saved as local copies (.fig):
//
//   src/pack/ui-kit.js           every component's name, page, properties and variants (compiled into the Worker)
//   assets/ui-kit/KIT/ID.txt     one file per component with the outline of each variant (static files)
//
//   node scripts/build-ui-kit-pack.mjs [FOLDER]
//
// FOLDER holds the kits as .fig files (or bare canvas.fig files); the default is ../apple-resources.
// To get them: open each kit from https://developer.apple.com/design/resources/ in Figma and use
// File > Save local copy. A kit is recognised by "iOS", "macOS" or "watchOS" in its file name.
//
// An outline is the component's layer tree as indented text: each layer's kind, size, layout,
// corner radius, fills, strokes, effects and text, with colours and text styles by the names
// Apple gives them in the kit. Vector shapes are named, not drawn.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTree, guidKey, readFig } from "./fig-dump.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const folder = resolve(process.argv[2] ?? join(here, "..", "..", "apple-resources"));

const KITS = [
  { id: "macos", name: "macOS", match: /macos/i },
  { id: "watchos", name: "watchOS", match: /watchos/i },
  { id: "ios", name: "iOS and iPadOS", match: /ios/i },
];
const KIT_ORDER = ["ios", "macos", "watchos"];

// Pages that hold no components worth describing: covers, notes, pictures of devices and app icons.
const SKIP_PAGE = /^(cover|getting started|change ?log|license|internal only canvas|product bezels|app icons?|[-—\s]+)$/i;
const MAX_LINES = 90;
const MAX_DEPTH = 9;

// ---------- small helpers ----------

const num = (n) => String(Math.round(n * 100) / 100);
const pct = (n) => `${Math.round(n * 100)}%`;
const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const lower = (s) => s.toLowerCase().replace(/_/g, " ");
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const isPrivateUse = (s) => s.length > 0 && [...s].every((ch) => { const c = ch.codePointAt(0); return (c >= 0xe000 && c <= 0xf8ff) || c >= 0xf0000; });

// SF Symbols are private-use characters in Apple's fonts. scripts/figma/symbol-codepoints.txt holds
// the name of each one the kits use ("1007C9 house.fill" per line); one it lacks prints as its code point.
const symbolNames = new Map();
const symbolTable = join(here, "figma", "symbol-codepoints.txt");
if (existsSync(symbolTable)) {
  for (const line of readFileSync(symbolTable, "utf8").split("\n")) {
    const m = /^([0-9A-Fa-f]{4,6})\s+(\S+)/.exec(line);
    if (m) symbolNames.set(parseInt(m[1], 16), m[2]);
  }
}
const unnamedSymbols = new Set();
const symbol = (ch) => {
  const code = ch.codePointAt(0);
  const name = symbolNames.get(code);
  if (name) return name;
  const shown = "U+" + code.toString(16).toUpperCase();
  unnamedSymbols.add(shown);
  return shown;
};

/** Text as it is quoted in an outline. A text of SF Symbols is given as the symbols' names. */
function quote(characters, limit = 60) {
  const text = characters.replace(/\s+/g, " ").trim();
  if (isPrivateUse(text)) return `SF Symbol ${[...text].map(symbol).join(" ")}`;
  return JSON.stringify(cut(text, limit));
}

// ---------- one kit ----------

function readKit(kit, path) {
  const fig = readFig(path);
  const live = (fig.message.nodeChanges ?? []).filter((n) => !n.isSoftDeleted);
  const { roots, byId } = buildTree(live);
  const doc = roots.find((r) => r.type === "DOCUMENT");
  if (!doc) throw new Error(`${path}: no document`);
  const node = (guid) => (guid ? byId.get(guidKey(guid)) : undefined);
  const parentOf = (n) => node(n.parentIndex?.guid);

  // ----- names of variables, styles and components -----

  const variableName = (alias) => node(alias?.guid)?.name;
  const styleName = (ref) => node(ref?.guid)?.name;

  /** A property definition's name, following a variant's definition back to its component set. */
  const propDefs = new Map();
  for (const n of live) {
    for (const d of n.componentPropDefs ?? []) propDefs.set(guidKey(d.id), d);
  }
  const propName = (id) => {
    let d = propDefs.get(guidKey(id));
    for (let i = 0; d && !d.name && d.parentPropDefId && i < 5; i++) d = propDefs.get(guidKey(d.parentPropDefId));
    return d?.name;
  };

  /** "Mode=Light, Size=Large" as [["Size", "Large"]], without the light and dark switch. */
  const variantProps = (name) =>
    name.split(/,\s*/).map((part) => part.split("=").map((x) => x.trim())).filter((p) => p.length === 2 && p[0] !== "Mode");
  const variantLabel = (name) => variantProps(name).map(([k, v]) => `${k}=${v}`).join(", ");

  const componentName = (symbol) => {
    const set = parentOf(symbol);
    if (set?.isStateGroup) {
      const label = variantLabel(symbol.name);
      return label ? `${set.name} [${label}]` : set.name;
    }
    return symbol.name;
  };

  // ----- one layer as a line -----

  const paint = (p) => {
    let text;
    if (p.type === "SOLID") text = variableName(p.colorVar?.value?.alias) ?? hex(p.color);
    else if (p.type === "IMAGE") text = "image";
    else if (p.type.startsWith("GRADIENT")) {
      const stops = (p.stops ?? []).map((s) => hex(s.color) + (s.color.a < 0.995 ? ` ${pct(s.color.a)}` : ""));
      text = `${lower(p.type.replace("GRADIENT_", ""))} gradient ${stops.join(" to ")}`;
    } else text = lower(p.type);
    const alpha = (p.opacity ?? 1) * (p.type === "SOLID" && !p.colorVar ? p.color.a ?? 1 : 1);
    if (alpha < 0.995) text += ` at ${pct(alpha)}`;
    if (p.blendMode && p.blendMode !== "NORMAL") text += ` (${lower(p.blendMode)})`;
    return text;
  };
  const paints = (list) => (list ?? []).filter((p) => p.visible !== false && (p.opacity ?? 1) > 0).map(paint);

  const effect = (e) => {
    const color = e.color ? `${hex(e.color)} at ${pct(e.color.a ?? 1)}` : "";
    switch (e.type) {
      case "DROP_SHADOW":
      case "INNER_SHADOW":
        return `${e.type === "DROP_SHADOW" ? "shadow" : "inner shadow"} x ${num(e.offset?.x ?? 0)} y ${num(e.offset?.y ?? 0)} blur ${num(e.radius ?? 0)}` +
          (e.spread ? ` spread ${num(e.spread)}` : "") + ` ${color}` + (e.blendMode && e.blendMode !== "NORMAL" ? ` (${lower(e.blendMode)})` : "");
      case "BACKGROUND_BLUR":
        return `background blur ${num(e.radius ?? 0)}`;
      case "FOREGROUND_BLUR":
        return `layer blur ${num(e.radius ?? 0)}`;
      case "GLASS":
        return "Liquid Glass effect";
      default:
        return lower(e.type);
    }
  };

  const KIND = {
    FRAME: "frame", SYMBOL: "component", TEXT: "text", ROUNDED_RECTANGLE: "rectangle", RECTANGLE: "rectangle", ELLIPSE: "ellipse",
    VECTOR: "vector shape", BOOLEAN_OPERATION: "vector shape", LINE: "line", STAR: "star", REGULAR_POLYGON: "polygon", SECTION: "section",
  };

  function layout(n) {
    if (!n.stackMode || n.stackMode === "NONE") return [];
    const row = n.stackMode === "HORIZONTAL";
    const out = [row ? "row" : "column"];
    // The file calls Figma's "space between" SPACE_EVENLY (checked against the Plugin API on the Toolbars page).
    const between = n.stackPrimaryAlignItems === "SPACE_BETWEEN" || n.stackPrimaryAlignItems === "SPACE_EVENLY";
    if (between) out.push("space between");
    else if (n.stackSpacing) out.push(`gap ${num(n.stackSpacing)}`);
    const pad = [n.stackVerticalPadding ?? 0, n.stackPaddingRight ?? 0, n.stackPaddingBottom ?? 0, n.stackHorizontalPadding ?? 0];
    if (pad.some(Boolean)) out.push(`padding ${pad.every((p) => p === pad[0]) ? num(pad[0]) : pad.map(num).join(" ")}`);
    if (n.stackPrimaryAlignItems === "CENTER") out.push("main center");
    if (n.stackPrimaryAlignItems === "MAX") out.push("main end");
    if (n.stackCounterAlignItems === "CENTER") out.push("cross center");
    if (n.stackCounterAlignItems === "MAX") out.push("cross end");
    const hugMain = n.stackPrimarySizing !== "FIXED";
    const hugCross = n.stackCounterSizing === "RESIZE_TO_FIT_WITH_IMPLICIT_SIZE" || n.stackCounterSizing === "RESIZE_TO_FIT";
    if (hugMain && hugCross) out.push("hugs content");
    else if (hugMain) out.push(row ? "hugs width" : "hugs height");
    else if (hugCross) out.push(row ? "hugs height" : "hugs width");
    return out;
  }

  function radius(n) {
    const four = [n.rectangleTopLeftCornerRadius, n.rectangleTopRightCornerRadius, n.rectangleBottomRightCornerRadius, n.rectangleBottomLeftCornerRadius];
    if (n.rectangleCornerRadiiIndependent && four.some((r) => r !== four[0])) return `radius ${four.map((r) => num(r ?? 0)).join(" ")}`;
    const r = n.cornerRadius ?? (n.rectangleCornerRadiiIndependent ? four[0] : 0);
    if (!r) return "";
    const capsule = n.size && r * 2 >= Math.min(n.size.x, n.size.y) - 0.01;
    return capsule ? "capsule" : `radius ${num(r)}`;
  }

  /** Variables bound to a layer's numbers, such as a padding bound to "Margin". */
  function bound(n) {
    const names = new Set();
    for (const e of n.variableConsumptionMap?.entries ?? []) {
      if (e.variableData?.dataType !== "ALIAS" || /^(FONT_|LETTER_SPACING|LINE_HEIGHT)/.test(e.variableField)) continue;
      const name = variableName(e.variableData.value?.alias);
      if (name) names.add(name);
    }
    return names.size ? `uses ${[...names].join(", ")}` : "";
  }

  function textParts(n) {
    const out = [`text ${quote(n.textData?.characters ?? "")}`];
    const style = styleName(n.styleIdForText);
    if (style) out.push(`style ${style}`);
    else if (n.fontName) {
      const lh = n.lineHeight?.units === "PIXELS" ? `/${num(n.lineHeight.value)}` : "";
      out.push(`${n.fontName.family} ${n.fontName.style} ${num(n.fontSize ?? 0)}${lh}`);
    }
    if (n.textAlignHorizontal === "CENTER") out.push("centered");
    if (n.textAlignHorizontal === "RIGHT") out.push("right-aligned");
    if (n.textCase === "UPPER") out.push("uppercase");
    return out;
  }

  function instanceParts(n) {
    const main = node(n.symbolData?.symbolID);
    const out = [main ? `instance of ${componentName(main)}` : "instance of a component outside this kit"];
    const set = [];
    for (const a of n.componentPropAssignments ?? []) {
      const name = propName(a.defID);
      if (!name) continue;
      const v = a.value ?? {};
      if (v.boolValue !== undefined) set.push(`${name} ${v.boolValue ? "on" : "off"}`);
      else if (v.textValue?.characters !== undefined) set.push(`${name} ${quote(v.textValue.characters, 40)}`);
      else if (v.guidValue) { const target = node(v.guidValue); if (target) set.push(`${name} ${componentName(target)}`); }
    }
    if (set.length) out.push(`with ${set.join(", ")}`);
    else {
      // Without property assignments, the texts the instance overrides say what it shows.
      const texts = [...new Set((n.symbolData?.symbolOverrides ?? []).map((o) => o.textData?.characters).filter(Boolean).map((t) => quote(t, 30)))];
      if (texts.length) out.push(`showing ${texts.slice(0, 4).join(", ")}${texts.length > 4 ? " and more" : ""}`);
    }
    return out;
  }

  function line(n, parent, top) {
    const parts = [];
    const refs = n.componentPropRefs ?? [];
    const prop = (field) => { const r = refs.find((x) => x.componentPropNodeField === field); return r ? propName(r.defID) : undefined; };

    if (n.type === "TEXT") parts.push(...textParts(n));
    else if (n.type === "INSTANCE") parts.push(...instanceParts(n));
    else parts.push(top ? "component" : KIND[n.type] ?? lower(n.type));

    if (n.size) parts.push(`${num(n.size.x)} × ${num(n.size.y)}`);
    const inFlow = parent?.stackMode && parent.stackMode !== "NONE" && n.stackPositioning !== "ABSOLUTE";
    if (!top && !inFlow && n.transform) {
      parts.push(`${n.stackPositioning === "ABSOLUTE" ? "absolute " : ""}at (${num(n.transform.m02)}, ${num(n.transform.m12)})`);
    }
    if (inFlow) {
      const row = parent.stackMode === "HORIZONTAL";
      if (n.stackChildPrimaryGrow) parts.push(row ? "fills width" : "fills height");
      if (n.stackChildAlignSelf === "STRETCH") parts.push(row ? "fills height" : "fills width");
    }
    if (n.transform && (Math.abs(n.transform.m01) > 0.001 || n.transform.m00 < 0)) {
      parts.push(`rotated ${num((Math.atan2(-n.transform.m01, n.transform.m00) * 180) / Math.PI)}°`);
    }
    if (n.type !== "INSTANCE") {
      parts.push(...layout(n));
      const r = radius(n);
      if (r) parts.push(r);
      const fillStyle = styleName(n.styleIdForFill);
      const fills = fillStyle ? [fillStyle] : paints(n.fillPaints);
      if (fills.length) parts.push(`${n.type === "TEXT" ? "color" : "fill"} ${fills.join(" + ")}`);
      const strokes = paints(n.strokePaints);
      if (strokes.length && n.strokeWeight) parts.push(`stroke ${strokes.join(" + ")} ${num(n.strokeWeight)}`);
      for (const e of (n.effects ?? []).filter((x) => x.visible !== false)) parts.push(effect(e));
      const uses = bound(n);
      if (uses) parts.push(uses);
    }
    if ((n.opacity ?? 1) < 0.995) parts.push(`opacity ${pct(n.opacity)}`);
    if (n.blendMode && !["NORMAL", "PASS_THROUGH"].includes(n.blendMode)) parts.push(`blend ${lower(n.blendMode)}`);
    if (n.mask) parts.push("mask");
    if (prop("TEXT_DATA")) parts.push(`property ${prop("TEXT_DATA")}`);
    if (prop("OVERRIDDEN_SYMBOL_ID")) parts.push(`swap with property ${prop("OVERRIDDEN_SYMBOL_ID")}`);
    if (prop("SLOT_CONTENT_ID")) parts.push(`slot ${prop("SLOT_CONTENT_ID")}`);
    if (prop("VISIBLE")) parts.push(n.visible === false ? `hidden unless ${prop("VISIBLE")}` : `shown while ${prop("VISIBLE")}`);
    // A text layer is named after its text and an instance after its component; repeating the name adds nothing.
    const named = n.type === "TEXT" || (n.type === "INSTANCE" && node(n.symbolData?.symbolID)?.name === n.name);
    return `${top || named ? "" : n.name + ": "}${parts.join("; ")}`;
  }

  function outline(symbol) {
    const lines = [];
    let dropped = 0;
    const walk = (n, parent, depth) => {
      const hiddenByProp = n.visible === false && (n.componentPropRefs ?? []).some((r) => r.componentPropNodeField === "VISIBLE");
      if (n.visible === false && !hiddenByProp) return;
      if (lines.length >= MAX_LINES) { dropped++; return; }
      lines.push(`${"  ".repeat(depth)}- ${line(n, parent, depth === 0)}`);
      if (hiddenByProp || n.type === "INSTANCE" || n.type === "BOOLEAN_OPERATION" || depth >= MAX_DEPTH) return;
      for (const c of n.children) walk(c, n, depth + 1);
    };
    walk(symbol, null, 0);
    if (dropped) lines.push(`  (${dropped} more layers not listed)`);
    return lines.join("\n");
  }

  /** The components an outline's instances point to, so a reply can include them. */
  function references(symbol) {
    const out = new Set();
    const walk = (n) => {
      if (n.visible === false) return;
      if (n.type === "INSTANCE") {
        const main = node(n.symbolData?.symbolID);
        if (main) out.add(guidKey((parentOf(main)?.isStateGroup ? parentOf(main) : main).guid));
        return;
      }
      n.children.forEach(walk);
    };
    symbol.children.forEach(walk);
    return out;
  }

  // ----- components -----

  const describeProps = (owner) => {
    const out = [];
    for (const d of owner.componentPropDefs ?? []) {
      if (!d.name || d.type === "VARIANT") continue;
      const v = d.initialValue ?? {};
      const p = { name: d.name, type: lower(d.type) };
      if (d.type === "BOOL") p.default = v.boolValue ? "on" : "off";
      else if (d.type === "TEXT") p.default = quote(v.textValue?.characters ?? "", 40);
      else if (d.type === "INSTANCE_SWAP") { const t = node(v.guidValue); if (t) p.default = componentName(t); }
      const note = (d.description ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (note) p.note = cut(note, 160);
      out.push(p);
    }
    return out;
  };

  const components = [];
  const idsByGuid = new Map();
  const used = new Set();
  const pages = doc.children.filter((p) => p.type === "CANVAS" && !SKIP_PAGE.test(p.name.trim()));

  for (const page of pages) {
    const found = [];
    const find = (n, section) => {
      if (n.isStateGroup || n.type === "SYMBOL") { found.push({ owner: n, section }); return; }
      if (n.type === "INSTANCE") return;
      // Apple groups a page by device in sections ("iPhone", "iPad", "iPhone Duo"); the name tells same-named components apart.
      const inner = n.type === "SECTION" && n.name.trim() && slug(n.name) !== slug(page.name) ? n.name.trim().replace(/^_/, "") : section;
      n.children.forEach((c) => find(c, inner));
    };
    page.children.forEach((c) => find(c, ""));

    for (const { owner, section } of found) {
      const isSet = Boolean(owner.isStateGroup);
      let symbols = isSet ? owner.children.filter((c) => c.type === "SYMBOL") : [owner];
      if (!symbols.length) continue;
      const orders = (owner.stateGroupPropertyValueOrders ?? []).filter((o) => o.property !== "Mode");
      if (isSet) {
        // Light and dark are the same layers in two colour modes: keep the light one of each pair.
        const light = symbols.filter((s) => !/(^|,\s*)Mode=(Dark|IC - Dark|IC - Light)(,|$)/.test(s.name));
        if (light.length) symbols = light;
      }
      // "Examples" + "iPhone" + "Examples/Toolbars - Top" becomes "examples-iphone-toolbars-top".
      const words = [];
      for (const part of [page.name, section, owner.name]) {
        for (const w of slug(part).split("-").filter(Boolean)) if (!words.includes(w)) words.push(w);
      }
      const base = words.join("-");
      let id = base;
      for (let i = 2; used.has(id); i++) id = `${base}-${i}`;
      used.add(id);
      idsByGuid.set(guidKey(owner.guid), id);

      // Identical outlines are stored once; a variant then points at the first that has it.
      const texts = [];
      const variants = symbols.map((s) => {
        const text = outline(s);
        let index = texts.indexOf(text);
        if (index < 0) index = texts.push(text) - 1;
        return { name: isSet ? variantLabel(s.name) : "", width: Math.round(s.size.x * 100) / 100, height: Math.round(s.size.y * 100) / 100, outline: index, node: guidKey(s.guid) };
      });
      const refs = new Set();
      symbols.forEach((s) => references(s).forEach((r) => refs.add(r)));
      refs.delete(guidKey(owner.guid));

      const link = (owner.symbolLinks ?? symbols[0].symbolLinks ?? []).map((l) => l.uri).find((u) => /human-interface-guidelines\//.test(u ?? ""));
      const published = isSet ? Boolean(owner.isPublishable) : Boolean(owner.isSymbolPublishable);
      components.push({
        id,
        name: owner.name,
        page: page.name,
        ...(section ? { section } : {}),
        ...(published && !owner.name.startsWith("_") ? {} : { helper: true }),
        ...(link ? { hig: link.split("/").pop().split("#")[0] } : {}),
        ...(orders.length ? { variant_props: orders.map((o) => ({ name: o.property, values: o.values })) } : {}),
        ...(describeProps(owner).length ? { props: describeProps(owner) } : {}),
        variants,
        _texts: texts,
        _refs: [...refs],
      });
    }
  }

  let outside = 0;
  for (const c of components) {
    outside += c._refs.filter((g) => !idsByGuid.has(g)).length;
    c.uses = c._refs.map((g) => idsByGuid.get(g)).filter(Boolean);
    if (!c.uses.length) delete c.uses;
    delete c._refs;
  }
  return { fig, components, pages: pages.map((p) => p.name), outside };
}

// ---------- build ----------

if (!existsSync(folder)) throw new Error(`No folder ${folder}. Pass the folder that holds the kits' .fig files.`);
const files = readdirSync(folder).filter((f) => f.endsWith(".fig")).sort();
const packKits = [];
const assetRoot = join(here, "..", "assets", "ui-kit");
rmSync(assetRoot, { recursive: true, force: true });

for (const id of KIT_ORDER) {
  const kit = KITS.find((k) => k.id === id);
  const file = files.find((f) => KITS.find((k) => k.match.test(f))?.id === id);
  if (!file) { console.log(`${kit.name}: no .fig file in ${folder}; skipped.`); continue; }
  const version = /\b(\d{2})\b/.exec(file)?.[1] ?? "";
  const started = performance.now();
  const { components, pages, outside } = readKit(kit, join(folder, file));

  mkdirSync(join(assetRoot, id), { recursive: true });
  let bytes = 0, outlines = 0, variants = 0;
  for (const c of components) {
    const text = c._texts.map((t, i) => `=== ${i}\n${t}`).join("\n") + "\n";
    writeFileSync(join(assetRoot, id, `${c.id}.txt`), text);
    bytes += Buffer.byteLength(text);
    outlines += c._texts.length;
    variants += c.variants.length;
    delete c._texts;
  }
  packKits.push({ id, name: `${kit.name}${version ? " " + version : ""}`, pages, components });
  console.log(
    `${kit.name}${version ? " " + version : ""}: ${components.length} components (${components.filter((c) => !c.helper).length} published), ` +
      `${variants} variants, ${outlines} distinct outlines, ${(bytes / 1024).toFixed(0)} KB of outlines, ` +
      `${outside} references to components on skipped pages, ${((performance.now() - started) / 1000).toFixed(1)} s`,
  );
}
if (!packKits.length) throw new Error(`No kit found in ${folder}.`);

const today = new Date().toISOString();
const pack = {
  pack_version: today.slice(0, 10),
  generated_at: today,
  source: {
    name: "Apple Design Resources, UI kits for Figma",
    url: "https://developer.apple.com/design/resources/",
    kits: packKits.map((k) => k.name),
    components: packKits.reduce((n, k) => n + k.components.length, 0),
    variants: packKits.reduce((n, k) => n + k.components.reduce((m, c) => m + c.variants.length, 0), 0),
  },
  kits: packKits,
};
const outPath = join(here, "..", "src", "pack", "ui-kit.js");
const body = JSON.stringify(pack, null, 1).replace(/\{\n\s+"name": ("[^"\n]*"),\n\s+"width": ([\d.]+),\n\s+"height": ([\d.]+),\n\s+"outline": (\d+),\n\s+"node": ("[\d:]+")\n\s+\}/g, '{"name":$1,"width":$2,"height":$3,"outline":$4,"node":$5}');
writeFileSync(outPath, `// Written by scripts/build-ui-kit-pack.mjs from Apple's UI kits for Figma. Do not edit.\nexport default ${body};\n`);
console.log(`Wrote ${outPath} (${(Buffer.byteLength(body) / 1024).toFixed(0)} KB) and ${assetRoot}.`);
if (unnamedSymbols.size) {
  console.log(`${unnamedSymbols.size} SF Symbols have no name in scripts/figma/symbol-codepoints.txt: ${[...unnamedSymbols].sort().join(" ")}`);
}

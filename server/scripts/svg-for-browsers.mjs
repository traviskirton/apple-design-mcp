// Makes an SVG that Figma exported draw in a browser the way Figma draws the layer. No dependencies.
//
// Apple's kits build Liquid Glass from stacked fills with blend modes, and from shadows that blend
// "plus darker" or "plus lighter". Figma's SVG export writes those in ways browsers do not draw:
//
// 1. A layer with several fills becomes shapes of the same outline, each with its own blend mode,
//    inside a group with a filter. Figma blends the fills with each other and puts the result on
//    what is behind; a browser shuts the group off from what is behind, and its "plus-lighter" makes
//    the result opaque. Here the fills become one shape, with the one colour and opacity that gives
//    the same result on what is behind.
// 2. A layer's blend mode is written on the shape inside the filtered group, where it has nothing
//    to blend with. It is moved onto the group.
// 3. feBlend has no "plus-darker" or "plus-lighter", so a browser paints those shadows as plain
//    colour (a white panel gets black bands). An inner shadow is added to or multiplied with the
//    shape; a drop shadow becomes black or white with the matching opacity.
// 4. mix-blend-mode: plus-darker exists in Safari only. It becomes multiply, which is the same on
//    white and within a few percent on light colours.
//
// Also dropped: empty groups, filters and clip paths nothing uses, and shape-rendering="crispEdges",
// which makes rounded corners jagged.
//
// The SVG is read one tag per line, which is how Figma writes it.

const NAMED = { white: [1, 1, 1], black: [0, 0, 0] };

function parseColor(value) {
  if (NAMED[value]) return NAMED[value];
  const m = /^#([0-9a-f]{6})$/i.exec(value ?? "");
  return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255) : null;
}
const hex = (rgb) => "#" + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
const blendOf = (tag) => /mix-blend-mode:\s*([a-z-]+)/.exec(attr(tag, "style") ?? "")?.[1] ?? "normal";
const lum = (c) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];

/** The blend of a source colour over a backdrop colour, by channel, for the modes the kits use. */
function blend(mode, b, s) {
  const each = (f) => b.map((x, i) => f(x, s[i]));
  switch (mode) {
    case "multiply": return each((x, y) => x * y);
    case "screen": return each((x, y) => x + y - x * y);
    case "darken": return each(Math.min);
    case "lighten": return each(Math.max);
    case "plus-lighter": return each((x, y) => Math.min(1, x + y));
    case "plus-darker": return each((x, y) => Math.max(0, x + y - 1));
    case "overlay": return each((x, y) => (x <= 0.5 ? 2 * x * y : 1 - 2 * (1 - x) * (1 - y)));
    case "hard-light": return each((x, y) => (y <= 0.5 ? 2 * x * y : 1 - 2 * (1 - x) * (1 - y)));
    case "difference": return each((x, y) => Math.abs(x - y));
    case "exclusion": return each((x, y) => x + y - 2 * x * y);
    case "luminosity": { const d = lum(s) - lum(b); return b.map((x) => Math.min(1, Math.max(0, x + d))); }
    case "color": { const d = lum(b) - lum(s); return s.map((x) => Math.min(1, Math.max(0, x + d))); }
    case "normal": return s;
    default: return null;
  }
}

/** A stack of fills laid on an opaque backdrop colour: the colour that results, or null for a blend mode not known here. */
function onBackdrop(fills, backdrop) {
  let c = backdrop;
  for (const f of fills) {
    const mixed = blend(f.mode, c, f.color);
    if (!mixed) return null;
    c = c.map((x, i) => (1 - f.alpha) * x + f.alpha * mixed[i]);
  }
  return c;
}

/**
 * The one colour and opacity that does what a stack of fills does. Figma blends each fill with what
 * is behind the layer, so the stack is laid on black and on white, and the plain fill that gives
 * the same two results is taken: exact for the blend modes that are straight lines in the backdrop
 * (normal, plus lighter, luminosity on gray), close for the others.
 */
function asOneFill(fills) {
  const onBlack = onBackdrop(fills, [0, 0, 0]);
  const onWhite = onBackdrop(fills, [1, 1, 1]);
  if (!onBlack || !onWhite) return null;
  const alpha = 1 - (onWhite[0] - onBlack[0] + onWhite[1] - onBlack[1] + onWhite[2] - onBlack[2]) / 3;
  if (!(alpha > 0.001)) return null;
  return { color: onBlack.map((x) => x / Math.min(1, alpha)), alpha: Math.min(1, alpha) };
}

// What makes two shapes the same outline.
const outlineOf = (tag) => {
  const kind = /^<(rect|path|circle|ellipse)\b/.exec(tag)?.[1];
  if (!kind) return null;
  const names = kind === "path" ? ["d", "transform"] : ["x", "y", "width", "height", "rx", "ry", "cx", "cy", "r", "transform"];
  return kind + "|" + names.map((n) => attr(tag, n) ?? "").join("|");
};
const isPlainFill = (tag) =>
  /\/>$/.test(tag) && !/\s(id|stroke|mask|filter|clip-path|data-symbol)="/.test(tag) && parseColor(attr(tag, "fill")) !== null && outlineOf(tag) !== null;

/** Fills of one layer (same outline, no id of their own, one after the other) become one shape. */
function mergeFills(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const first = lines[i];
    if (!isPlainFill(first)) { out.push(first); continue; }
    let j = i + 1;
    while (j < lines.length && isPlainFill(lines[j]) && outlineOf(lines[j]) === outlineOf(first)) j++;
    if (j - i < 2) { out.push(first); continue; }
    const result = asOneFill(
      lines.slice(i, j).map((tag) => ({ mode: blendOf(tag), color: parseColor(attr(tag, "fill")), alpha: Number(attr(tag, "fill-opacity") ?? 1) })),
    );
    if (!result) { out.push(...lines.slice(i, j)); i = j - 1; continue; }
    const opacity = Math.round(result.alpha * 1000) / 1000;
    out.push(
      first
        .replace(/\s(fill|fill-opacity|style)="[^"]*"/g, "")
        .replace(/\/>$/, ` fill="${hex(result.color)}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ""}/>`),
    );
    i = j - 1;
  }
  return out;
}

/** A blend mode that every shape of a filtered group carries goes onto the group. */
function liftBlendModes(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (!/^<g\b[^>]*\sfilter="/.test(lines[i]) || /mix-blend-mode/.test(lines[i])) continue;
    let j = i + 1;
    while (j < lines.length && /^<(rect|path|circle|ellipse)\b[^>]*\/>$/.test(lines[j])) j++;
    if (j === i + 1 || lines[j] !== "</g>") continue;
    const modes = new Set(lines.slice(i + 1, j).map(blendOf));
    const [mode] = modes;
    if (modes.size !== 1 || mode === "normal") continue;
    for (let k = i + 1; k < j; k++) lines[k] = lines[k].replace(/\sstyle="mix-blend-mode:\s*[a-z-]+;?"/, "");
    lines[i] = lines[i].replace(/>$/, ` style="mix-blend-mode:${mode}">`);
  }
  return lines;
}

/** Shadows that blend "plus darker" or "plus lighter", written so that a browser draws them. */
function fixShadows(lines) {
  for (let i = 1; i < lines.length; i++) {
    const m = /^<feBlend mode="(plus-darker|plus-lighter)"(.*)\/>$/.exec(lines[i]);
    if (!m) continue;
    const [, mode, rest] = m;
    const inner = /result="effect\d+_innerShadow/.test(rest);
    if (inner) {
      // The shadow lies on the layer's own shape, which the filter has: add to it, or multiply with it.
      // The sum is cut to the shape again, because the shadow is at full strength on the shape's soft edge.
      const result = /\sresult="([^"]+)"/.exec(rest)?.[1];
      lines[i] =
        mode === "plus-darker"
          ? `<feBlend mode="multiply"${rest}/>`
          : result
            ? `<feComposite operator="arithmetic" k2="1" k3="1"${rest.replace(/\sresult="[^"]+"/, ` result="${result}_sum"`)}/>\n<feComposite in="${result}_sum" in2="SourceAlpha" operator="in" result="${result}"/>`
            : `<feComposite operator="arithmetic" k2="1" k3="1"${rest}/>`;
      continue;
    }
    // A drop shadow lies on what is behind the SVG, which the filter cannot see.
    const matrix = /^<feColorMatrix type="matrix" values="([^"]*)"\/>$/.exec(lines[i - 1]);
    const v = matrix?.[1].trim().split(/\s+/).map(Number);
    if (!v || v.length !== 20) { lines[i] = `<feBlend mode="normal"${rest}/>`; continue; }
    const gray = (v[4] + v[9] + v[14]) / 3;
    const alpha = Math.round(v[18] * (mode === "plus-darker" ? 1 - gray : gray) * 1000) / 1000;
    const c = mode === "plus-darker" ? 0 : 1;
    lines[i - 1] = `<feColorMatrix type="matrix" values="0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 ${alpha} 0"/>`;
    lines[i] = `<feBlend mode="normal"${rest}/>`;
  }
  return lines;
}

/**
 * A layer that is white, blends "multiply" and has only inner shadows that blend "plus lighter"
 * changes nothing: white plus anything is white, and white times what is behind is what is behind.
 * The kits use such a layer to carry Figma's glass effect, which SVG cannot hold. It is taken out.
 */
function dropWhiteMultiply(lines) {
  const text = lines.join("\n");
  for (let i = 0; i < lines.length; i++) {
    const g = /^<g\b[^>]*\sfilter="url\(#([^)]+)\)"[^>]*mix-blend-mode:multiply/.exec(lines[i]);
    if (!g) continue;
    let j = i + 1;
    while (j < lines.length && /^<(rect|path|circle|ellipse)\b[^>]*\/>$/.test(lines[j]) && !/\s(fill-opacity|opacity|stroke|style)="/.test(lines[j]) && /\sfill="(white|#FFFFFF)"/i.test(lines[j])) j++;
    if (j === i + 1 || lines[j] !== "</g>") continue;
    const filter = new RegExp(`<filter id="${g[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?</filter>`).exec(text)?.[0] ?? "";
    const blends = [...filter.matchAll(/<feBlend mode="([a-z-]+)"[^>]*result="([^"]*)"/g)];
    const onlyLightInnerShadows = blends.length > 0 && blends.every((b) => (b[1] === "plus-lighter" && /_innerShadow/.test(b[2])) || b[2] === "shape");
    if (!onlyLightInnerShadows) continue;
    lines.splice(i, j - i + 1);
    i--;
  }
  return lines;
}

/** Empty groups, then the filters, clip paths and masks that nothing points to any more. */
function dropUnused(lines) {
  for (let changed = true; changed; ) {
    changed = false;
    for (let i = 0; i + 1 < lines.length; i++) {
      if (/^<g\b[^>]*>$/.test(lines[i]) && lines[i + 1] === "</g>") { lines.splice(i, 2); changed = true; i--; }
    }
  }
  const text = lines.join("\n");
  const used = new Set([...text.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]));
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^<(filter|clipPath|linearGradient|radialGradient) id="([^"]+)"/.exec(lines[i]);
    if (m && !used.has(m[2])) {
      while (i < lines.length && lines[i] !== `</${m[1]}>`) i++;
      continue;
    }
    out.push(lines[i]);
  }
  for (let i = 0; i + 1 < out.length; i++) if (out[i] === "<defs>" && out[i + 1] === "</defs>") out.splice(i, 2);
  return out;
}

/** `svg` as Figma exported it; the same drawing for a browser. */
export function forBrowsers(svg) {
  // One tag per line, also where Figma did not write it that way or a symbol's outline was put in.
  let lines = svg.replace(/>\s*</g, ">\n<").split("\n").map((l) => l.trim()).filter(Boolean);
  lines = mergeFills(lines);
  lines = liftBlendModes(lines);
  lines = dropWhiteMultiply(lines);
  lines = fixShadows(lines).flatMap((l) => l.split("\n"));
  lines = dropUnused(lines);
  return lines
    .join("\n")
    .replace(/mix-blend-mode:\s*plus-darker/g, "mix-blend-mode:multiply")
    .replace(/\sshape-rendering="crispEdges"/g, "");
}

/** What a browser would still draw differently from Figma after forBrowsers: one word per kind, for the export's report. */
export function leftovers(svg) {
  const found = [];
  if (/<feBlend mode="plus-(darker|lighter)"/.test(svg)) found.push("shadow blend");
  if (/mix-blend-mode:\s*plus-darker/.test(svg)) found.push("plus-darker");
  if (/<g\b[^>]*\sfilter="[^>]*>\s*<(?:rect|path|circle|ellipse)\b[^>]*mix-blend-mode/.test(svg)) found.push("fill blend inside a filter");
  if (/<(?:rect|path)\b[^>]*fill="url\(#paint[^>]*mix-blend-mode/.test(svg)) found.push("gradient fill with a blend mode");
  return found;
}

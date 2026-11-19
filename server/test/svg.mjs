// Checks scripts/svg-for-browsers.mjs and the symbol merge on small pieces of what Figma exports.
//   node test/svg.mjs
import { forBrowsers, leftovers } from "../scripts/svg-for-browsers.mjs";
import { hasSymbols, mergeSymbols, tidy } from "../scripts/export-ui-kit-svg.mjs";
import { moveImages } from "../scripts/svg-images.mjs";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let failed = 0;
const check = (ok, what) => { if (!ok) { failed++; console.log("FAILED: " + what); } };

// The tab bar's glass: four fills with blend modes inside a filtered group, shadows that blend "plus darker".
const glass = `<svg width="402" height="95" viewBox="0 0 402 95" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="BG">
<g id="Fill + Shadow" filter="url(#filter0_dd_1_2)">
<rect x="107" y="12" width="188" height="62" rx="31" fill="black" fill-opacity="0.25" shape-rendering="crispEdges"/>
<rect x="107" y="12" width="188" height="62" rx="31" fill="white" fill-opacity="0.25" shape-rendering="crispEdges"/>
<rect x="107" y="12" width="188" height="62" rx="31" fill="#444444" fill-opacity="0.6" style="mix-blend-mode:plus-lighter" shape-rendering="crispEdges"/>
<rect x="107" y="12" width="188" height="62" rx="31" fill="#F8F8F8" fill-opacity="0.2" style="mix-blend-mode:luminosity" shape-rendering="crispEdges"/>
</g>
<g id="Glass Effect" filter="url(#filter1_i_1_2)">
</g>
</g>
<g id="Selection" style="mix-blend-mode:plus-darker">
<path d="M111 43Z" fill="#EDEDED"/>
</g>
<defs>
<filter id="filter0_dd_1_2" x="92" y="5" width="218" height="92" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feColorMatrix type="matrix" values="0 0 0 0 0.909804 0 0 0 0 0.909804 0 0 0 0 0.909804 0 0 0 1 0"/>
<feBlend mode="plus-darker" in2="effect1_dropShadow_1_2" result="effect2_dropShadow_1_2"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1_2" result="shape"/>
</filter>
<filter id="filter1_i_1_2" x="107" y="12" width="188" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
</filter>
</defs>
</svg>`;
const fixed = forBrowsers(glass);
check((fixed.match(/<rect /g) ?? []).length === 1, "the four fills of one layer should become one shape");
check(/<rect x="107" y="12" width="188" height="62" rx="31" fill="#E3E3E3" fill-opacity="0.588"\/>/.test(fixed), "the glass fill should be #E3E3E3 at 0.588: " + /<rect [^>]*>/.exec(fixed)?.[0]);
check(!fixed.includes("Glass Effect") && !fixed.includes("filter1_i_1_2"), "an empty group and its filter should be dropped");
check(fixed.includes('values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"') && !fixed.includes('mode="plus-darker"'), 'a "plus darker" drop shadow should become black at the matching opacity');
check(fixed.includes('<g id="Selection" style="mix-blend-mode:multiply">'), "plus-darker should become multiply");
check(!fixed.includes("crispEdges") && leftovers(fixed).length === 0, "nothing a browser cannot draw should be left");

// The alert's glass layer: white, multiply, inner shadows that blend "plus lighter". It changes nothing and is taken out.
const alert = `<svg width="300" height="307" viewBox="0 0 300 307" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Fill + Shadow">
<rect width="300" height="307" rx="34" fill="white" fill-opacity="0.7" style="mix-blend-mode:lighten"/>
<rect width="300" height="307" rx="34" fill="#BFBFBF" fill-opacity="0.1" style="mix-blend-mode:darken"/>
</g>
<g id="Glass Effect" filter="url(#filter1_ii_3_4)">
<rect width="300" height="307" rx="34" fill="white" style="mix-blend-mode:multiply"/>
</g>
<g id="_Background" style="mix-blend-mode:plus-darker">
<path d="M62 183Z" fill="#787880" fill-opacity="0.16"/>
</g>
<defs>
<filter id="filter1_ii_3_4" x="0" y="0" width="300" height="307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.156863 0 0 0 0 0.156863 0 0 0 0 0.156863 0 0 0 1 0"/>
<feBlend mode="plus-lighter" in2="shape" result="effect1_innerShadow_3_4"/>
</filter>
</defs>
</svg>`;
const fixedAlert = forBrowsers(alert);
check(/<rect width="300" height="307" rx="34" fill="#F6F6F6" fill-opacity="0.725"\/>/.test(fixedAlert), "the alert's fill should be #F6F6F6 at 0.725: " + /<rect [^>]*>/.exec(fixedAlert)?.[0]);
check(!fixedAlert.includes("Glass Effect") && !fixedAlert.includes("<filter") && !fixedAlert.includes("<defs>"), "a white multiply layer with light inner shadows should be taken out with its filter");

// An inner shadow that blends "plus lighter" on a coloured shape is added to the shape.
const glow = alert.replace('fill="white" style="mix-blend-mode:multiply"', 'fill="#0088FF"');
const fixedGlow = forBrowsers(glow);
check(fixedGlow.includes('<feComposite operator="arithmetic" k2="1" k3="1" in2="shape" result="effect1_innerShadow_3_4_sum"/>') && fixedGlow.includes('operator="in" result="effect1_innerShadow_3_4"/>'), 'a "plus lighter" inner shadow should be added to the shape and cut to it');

// The symbol merge and the tidy step.
const text = `<svg width="10" height="10"><g id="Tab image">
<text id="&#244;&#128;&#139;&#131;" fill="#FF0000" font-family="SF Pro" font-size="18"><tspan x="1" y="2">&#x1007c9;</tspan></text>
</g>
<text id="Label" fill="white" font-family="SF Pro" font-size="10"><tspan x="146" y="60">Tab 1</tspan></text>
</svg>`;
const outlined = `<svg><g id="Tab image">
<path id="&#244;&#128;&#139;&#131;" d="M1 1Z" fill="#FF0000"/>
</g>
<path id="Label" d="M2 2Z" fill="white"/>
</svg>`;
check(hasSymbols(text) && !hasSymbols(outlined), "hasSymbols should find private-use text");
const merged = mergeSymbols(text, outlined, () => "diamond.fill");
check(merged.symbols === 1 && merged.missed === 0, "one symbol should be merged");
const done = tidy(forBrowsers(merged.svg));
check(done.startsWith('<svg overflow="visible" width="10"') && done.includes('<g id="Tab image"><path data-symbol="diamond.fill" d="M1 1Z" fill="#FF0000"/></g>'), "a symbol should be a marked path without the unreadable id: " + done);
check(done.includes('<text id="Label" fill="white" font-family="SF Pro, -apple-system, system-ui, sans-serif" font-size="10"><tspan x="146" y="60">Tab 1</tspan></text>'), "a label should stay text with fallback fonts");

// Pictures move out of the SVG into files named by their hash; small ones stay.
const temp = mkdtempSync(join(tmpdir(), "svg-images-"));
const big = Buffer.alloc(5000, 7).toString("base64");
const small = Buffer.alloc(100, 7).toString("base64");
const withPictures = `<svg><image id="a" width="10" height="10" xlink:href="data:image/png;base64,${big}"/><image id="b" href="data:image/png;base64,${big}"/><image id="c" xlink:href="data:image/png;base64,${small}"/></svg>`;
const split = moveImages(withPictures, { dir: temp, origin: "https://example.test" });
check(split.moved === 2 && split.files.length === 1, "two uses of one picture should become one file: " + JSON.stringify([split.moved, split.files]));
check(split.svg.includes(`<image id="a" width="10" height="10" href="https://example.test/ui-kit-svg/img/${split.files[0]}"/>`), "a picture should be pointed to by its full address: " + split.svg.slice(0, 200));
check(split.svg.includes(`xlink:href="data:image/png;base64,${small}"`), "a small picture should stay inside the SVG");
check(readdirSync(join(temp, "img")).length === 1 && readFileSync(join(temp, "img", split.files[0])).length === 5000, "the picture file should hold the picture's bytes");
check(moveImages(split.svg, { dir: temp, origin: "https://example.test" }).moved === 0, "a second run should change nothing");
rmSync(temp, { recursive: true, force: true });

// What Figma wrote as a picture is put back from its layers.
{
  const { flattened, flatLayers, match, asMarkup, redraw } = await import("../scripts/redraw-flattened.mjs");
  const bb = (x, y, w, h) => ({ x: x + 1000, y: y + 2000, width: w, height: h });
  const red = [{ type: "SOLID", color: { r: 1, g: 0, b: 0, a: 1 } }];
  const root = { id: "1:1", type: "COMPONENT", absoluteBoundingBox: bb(0, 0, 402, 95), children: [
    { id: "S", type: "FRAME", children: [
      { id: "M", type: "FRAME", isMask: true, children: [{ id: "sym", type: "TEXT", characters: "\u{1007C9}", fills: red, absoluteBoundingBox: bb(125, 22, 68, 28), absoluteRenderBounds: bb(146, 22.7, 26, 26) }] },
      { id: "tint", type: "RECTANGLE", blendMode: "LINEAR_BURN", fills: [{ type: "SOLID", color: { r: 0, g: 136 / 255, b: 1, a: 1 } }], absoluteBoundingBox: bb(113, 16, 92, 54) },
    ] },
    { id: "lab", type: "TEXT", blendMode: "LINEAR_BURN", characters: "Tab 2", style: { fontWeight: 590 }, absoluteBoundingBox: bb(210, 51, 68, 12), absoluteRenderBounds: bb(231, 53.6, 23, 7.2) },
    { id: "plain", type: "TEXT", characters: "Title", absoluteBoundingBox: bb(231, 53, 20, 7) },
  ] };
  const flat = `<svg><image x="145.975" y="22.6289" width="26.042" height="26.2" preserveAspectRatio="none" xlink:href="data:image/png;base64,AAAA"/><image x="230.139" y="53" width="25.5" height="8.4" preserveAspectRatio="none" style="mix-blend-mode:multiply" href="https://example.test/ui-kit-svg/img/00ff.png"/><image id="p" width="4" height="4" xlink:href="data:image/png;base64,CCCC"/></svg>`;
  const pics = flattened(flat);
  const under = match(pics, flatLayers(root));
  check(pics.length === 2 && under[0].map((l) => l.id).join() === "sym" && under[1].map((l) => l.id).join() === "lab", "each picture should get the layers under it, and not a plain layer when those with the blend mode fill it");
  {
    const field = { id: "1:2", type: "COMPONENT", absoluteBoundingBox: bb(0, 0, 320, 200), children: [
      { id: "F", type: "INSTANCE", blendMode: "LINEAR_BURN", cornerRadius: 100, fills: [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5, a: 1 }, opacity: 0.2 }], absoluteBoundingBox: bb(10, 64, 300, 44), children: [
        { id: "s", type: "TEXT", characters: "Search", absoluteBoundingBox: bb(50, 78, 60, 16), absoluteRenderBounds: bb(51, 79.5, 53, 12.8) } ] },
      { id: "e", type: "VECTOR", absoluteBoundingBox: bb(32, 150, 26, 26) },
      { id: "m", type: "TEXT", blendMode: "LINEAR_BURN", characters: "\u{1002B0}", absoluteBoundingBox: bb(340, 150, 26, 26) },
      { id: "ph", type: "RECTANGLE", fills: [{ type: "IMAGE" }], absoluteBoundingBox: bb(0, 180, 20, 20) },
    ] };
    const boxes = [{ x: 10, y: 64, w: 300, h: 44 }, { x: 32, y: 150, w: 334, h: 26 }, { x: 0, y: 180, w: 20, h: 20 }];
    const got = match(boxes, flatLayers(field));
    check(got[0].map((l) => l.type).join() === "FILL,TEXT" && got[0][1].burn, "a group with the blend mode should bring its own fill and mark its layers");
    check(asMarkup(got[0][0], undefined, 1, () => "x").body === '<rect x="10" y="64" width="300" height="44" rx="22" fill="#808080" fill-opacity="0.2" style="mix-blend-mode:multiply"/>', "a group's fill should be drawn as a rectangle: " + asMarkup(got[0][0], undefined, 1, () => "x").body);
    check(got[1].map((l) => l.id).join() === "e,m", "a plain layer taken into the same picture should be found");
    check(got[2].length === 0 && got[2].short, "a real picture should be left alone");
  }
  const exports = {
    sym: `<svg width="68" height="28">\n<path id="&#244;&#128;" d="M2 1Z" fill="#FF0000"/>\n</svg>`,
    lab: `<svg width="68" height="12">\n<g id="Label" style="mix-blend-mode:plus-darker">\n<text fill="#1A1A1A" font-family="SF Pro" font-size="10"><tspan x="21" y="9">Tab 2</tspan></text>\n</g>\n</svg>`,
  };
  const out = redraw(flat, pics, under.map((u, i) => u.map((l) => asMarkup(l, exports[l.id], i, () => "diamond.fill"))));
  check(out.includes('<g transform="translate(125 22)"><path data-symbol="diamond.fill" d="M2 1Z" fill="#0088FF"/></g>'), "a masked symbol should be a marked path in the tint color: " + out);
  check(out.includes('<g transform="translate(210 51)"><g id="Label" style="mix-blend-mode:multiply"><text fill="#1A1A1A" font-family="SF Pro, -apple-system, system-ui, sans-serif" font-size="10" font-weight="590"><tspan x="21" y="9">Tab 2</tspan></text></g></g>'), "a label with the blend mode should be text in a multiply group: " + out);
  check(out.includes('<image id="p"') && flattened(out).length === 0, "a picture that is a real picture should stay, and the others be gone");
  check(asMarkup(under[0][0], `<svg><image href="data:image/png;base64,AA"/></svg>`, 9, () => "x") === null, "a layer that exports as a picture should not be used");
}

// A symbol's weight goes with it; a symbol that is the mask itself is drawn from our own shapes.
{
  const { mergeSymbols: merge } = await import("../scripts/export-ui-kit-svg.mjs");
  const heavy = `<svg><text id="s" fill="#000" font-family="SF Pro" font-size="17" font-weight="590"><tspan x="1" y="2">&#x1007c9;</tspan></text></svg>`;
  const got = merge(heavy, `<svg><path id="s" d="M1 1Z"/></svg>`, () => "diamond.fill");
  check(got.svg.includes('<path data-symbol="diamond.fill" data-symbol-weight="semibold" id="s"') || got.svg.includes('data-symbol="diamond.fill" data-symbol-weight="semibold"'), "a semibold symbol should say so: " + got.svg);

  const { weightName, shardOf, inkBox, placeSymbol, readShape } = await import("../scripts/symbol-shapes.mjs");
  check(weightName(590) === "semibold" && weightName(510) === "medium" && weightName(400) === "regular" && weightName(undefined) === "regular" && weightName(900) === "black", "font weights should map to symbol weights");
  check(shardOf("heart") === "e3" && shardOf("star.fill") === "40" && shardOf("square.and.arrow.up") === "6d", "the shard of a name should not change (the extractor and the Worker use the same)");

  const box = inkBox(`<svg viewBox="0 0 120 100"><path d="M10 20L110 20L110 80C110 90 10 90 10 80Z"/></svg>`);
  check(box && box.x === 10 && box.y === 20 && box.w === 100 && Math.abs(box.h - 67.5) < 0.01, "the ink box should hold the curve: " + JSON.stringify(box));

  const temp = mkdtempSync(join(tmpdir(), "shapes-"));
  mkdirSync(join(temp, "symbols"));
  mkdirSync(join(temp, "symbol-weights", "semibold"), { recursive: true });
  writeFileSync(join(temp, "symbols", "star.fill.svg"), '<svg viewBox="0 0 10 10"><path d="M0 0L10 0L10 10Z"/></svg>');
  writeFileSync(join(temp, "symbol-weights", "semibold", shardOf("star.fill") + ".txt"), 'star.fill\t<svg viewBox="0 0 12 12"><path d="M1 1L11 1L11 11Z"/></svg>\n');
  check(readShape(temp, "star.fill").includes("M0 0") && readShape(temp, "star.fill", "semibold").includes("M1 1") && readShape(temp, "heart", "semibold") === null, "shapes should be read in their weight");
  rmSync(temp, { recursive: true, force: true });

  // The Duo tab: the symbol TEXT is the mask; the white and tint fills after it are cut to the glyph.
  const { flatLayers, match, asMarkup } = await import("../scripts/redraw-flattened.mjs");
  const bb = (x, y, w, h) => ({ x: x + 500, y: y + 500, width: w, height: h });
  const fill = (r, g, b, a = 1) => [{ type: "SOLID", color: { r, g, b, a } }];
  const duo = { id: "2:1", type: "COMPONENT", absoluteBoundingBox: bb(0, 0, 48, 48), children: [
    { id: "sel", type: "RECTANGLE", blendMode: "LINEAR_BURN", fills: fill(0.93, 0.93, 0.93), absoluteBoundingBox: bb(2, -5, 44, 58), absoluteRenderBounds: bb(2, -5, 44, 58) },
    { id: "f", type: "FRAME", absoluteBoundingBox: bb(8, 9.5, 32, 28), children: [
      { id: "glyph", type: "TEXT", isMask: true, characters: "\u{1002C3}", style: { fontWeight: 590 }, fills: fill(0, 0.53, 1), absoluteBoundingBox: bb(8, 9.5, 32, 28), absoluteRenderBounds: null },
      { id: "white", type: "RECTANGLE", fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 }, opacity: 0.5 }], absoluteBoundingBox: bb(0, -3, 48, 54), absoluteRenderBounds: bb(11.88, 11.2, 24.23, 23.06) },
      { id: "tint", type: "RECTANGLE", blendMode: "LINEAR_BURN", fills: fill(0, 136 / 255, 1), absoluteBoundingBox: bb(0, -3, 48, 54), absoluteRenderBounds: bb(11.88, 11.2, 24.23, 23.06) },
    ] },
  ] };
  const layers = flatLayers(duo);
  check(!layers.some((l) => l.id === "white" || l.id === "tint"), "fills shown through a mask should not be drawn themselves: " + layers.map((l) => l.id));
  const under = match([{ x: 11.88, y: 11.2, w: 24.23, h: 23.06 }], layers);
  check(under[0].length === 1 && under[0][0].type === "SYMBOL" && under[0][0].tint.color === "#0088FF", "the glyph picture should be the symbol in the tint color: " + JSON.stringify(under[0]));
  const made = asMarkup(under[0][0], '<svg viewBox="0 0 120 120"><path d="M10 10L110 10L60 110Z"/></svg>', 1, () => "star.fill");
  check(made && made.body.startsWith('<g transform="translate(') && made.body.includes('fill="#0088FF"') && made.body.includes('<path data-symbol="star.fill" data-symbol-weight="semibold" d="M10 10'), "the symbol should be our shape, placed and tinted: " + made?.body);
  check(placeSymbol('<svg viewBox="0 0 120 120"><path d="M10 10L110 10L110 110L10 110Z"/></svg>', { x: 5, y: 5, w: 20, h: 20 }, { color: "#000000", opacity: 1 }, "x", "regular").startsWith('<g transform="translate(3 3) scale(0.2)"'), "the ink should fill the box");
  check(asMarkup(under[0][0], null, 2, () => "star.fill") === null, "a symbol with no shape here should leave the picture");
}

console.log(failed ? `${failed} failed` : "OK");
process.exit(failed ? 1 : 0);

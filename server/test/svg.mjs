// Checks scripts/svg-for-browsers.mjs and the symbol merge on small pieces of what Figma exports.
//   node test/svg.mjs
import { forBrowsers, leftovers } from "../scripts/svg-for-browsers.mjs";
import { hasSymbols, mergeSymbols, tidy } from "../scripts/export-ui-kit-svg.mjs";
import { moveImages } from "../scripts/svg-images.mjs";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
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
  check(pics.length === 2 && under[0].map((l) => l.id).join() === "sym" && under[1].map((l) => l.id).join() === "lab", "each picture should get the layers under it, and only layers with the blend mode or in a mask");
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

console.log(failed ? `${failed} failed` : "OK");
process.exit(failed ? 1 : 0);

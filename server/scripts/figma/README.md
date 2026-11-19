# Figma dumps

Text dumps of Apple's UI kits for Figma, read on 2026-11-19 from copies of the Community files
"iOS and iPadOS 27" and "macOS 27" (Apple Design Resources). `scripts/build-design-values.mjs`
builds `src/pack/design-values.js` from them.

Each dump is the unedited return value of a read-only script run with the Figma Plugin API
(through the Figma connector's `use_figma`), saved to disk without retyping. To refresh a dump,
open a copy of the kit, run the script, and replace the file.

| File | Holds |
| --- | --- |
| `ios-27-variables.txt` | Every local variable of the iOS kit, one section per collection, one column per mode. `@Name` is a reference to another variable. |
| `ios-27-styles.txt` | The iOS kit's text styles (family, style, size, line height, letter spacing, each followed by the variable it is bound to) and paint styles. |
| `ios-27-layout-guides.txt` | The outline of the iOS kit's "Layout Guides" page to four levels: type, name, size and position of each layer. |
| `macos-27-values.txt` | The macOS kit's variables, text styles and paint styles. |

## Scripts

Variables (both kits):

```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = {}; for (const v of vars) byId[v.id] = v;
const h = n => Math.round(n*255).toString(16).padStart(2,'0');
const fmt = (val) => {
  if (val && typeof val === 'object') {
    if (val.type === 'VARIABLE_ALIAS') { const t = byId[val.id]; return '@' + (t ? t.name : val.id); }
    if ('r' in val) { const a = val.a === undefined ? 1 : val.a; return '#' + h(val.r)+h(val.g)+h(val.b) + (a < 0.999 ? h(a) : ''); }
  }
  if (typeof val === 'number') return String(Math.round(val*1000)/1000);
  return String(val);
};
const out = [];
for (const c of cols) {
  out.push('## ' + c.name + ' | ' + c.modes.map(m=>m.name).join(' | '));
  for (const v of vars) {
    if (v.variableCollectionId !== c.id) continue;
    out.push(v.name + ' | ' + c.modes.map(m => fmt(v.valuesByMode[m.modeId])).join(' | '));
  }
}
return out.join('\n');
```

Text styles and paint styles (appended to the variables for macOS):

```js
const r3 = n => String(Math.round(n*1000)/1000);
const bv = async (s, f) => { const b = s.boundVariables && s.boundVariables[f]; if (!b) return ''; const v = await figma.variables.getVariableByIdAsync(b.id); return v ? '@' + v.name : ''; };
out.push('## TEXT STYLES | family | style | size | lineHeight | letterSpacing');
for (const s of await figma.getLocalTextStylesAsync()) {
  const lh = s.lineHeight.unit === 'AUTO' ? 'auto' : r3(s.lineHeight.value) + (s.lineHeight.unit === 'PERCENT' ? '%' : '');
  const ls = r3(s.letterSpacing.value) + (s.letterSpacing.unit === 'PERCENT' ? '%' : '');
  out.push(s.name + ' | ' + s.fontName.family + ' | ' + s.fontName.style + ' | ' + r3(s.fontSize) + (await bv(s,'fontSize')) + ' | ' + lh + (await bv(s,'lineHeight')) + ' | ' + ls + (await bv(s,'letterSpacing')));
}
out.push('## PAINT STYLES');
for (const s of await figma.getLocalPaintStylesAsync()) {
  out.push(s.name + ' | ' + s.paints.map(p => p.type === 'SOLID' ? '#' + h(p.color.r)+h(p.color.g)+h(p.color.b) + (p.opacity < 0.999 ? h(p.opacity) : '') + (p.blendMode && p.blendMode !== 'NORMAL' ? ' ' + p.blendMode : '') : p.type).join(' + '));
}
```

Layout guides (iOS kit, page "Layout Guides"):

```js
const page = figma.root.children.find(p => p.name === 'Layout Guides');
await page.loadAsync();
const r = n => String(Math.round(n*100)/100);
const out = [];
const walk = (n, d, max) => {
  let line = '  '.repeat(d) + '- ' + n.type + ' "' + n.name + '" ' + r(n.width) + 'x' + r(n.height) + ' @' + r(n.x) + ',' + r(n.y);
  if (n.type === 'TEXT') line += ' text=' + JSON.stringify(n.characters.slice(0, 160));
  if (n.type === 'INSTANCE') line += ' inst';
  if ('layoutMode' in n && n.layoutMode !== 'NONE') line += ' ' + n.layoutMode + ' gap ' + r(n.itemSpacing) + ' pad ' + [n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft].map(r).join(' ');
  out.push(line);
  if (d < max && 'children' in n && n.type !== 'INSTANCE') for (const c of n.children) walk(c, d+1, max);
};
for (const c of page.children) walk(c, 0, 4);
return out.join('\n');
```

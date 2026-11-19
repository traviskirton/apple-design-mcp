// Writes src/pack/symbol-index.js, the word index that symbol search uses, from src/pack/symbols.js.
// The extractor runs this after it writes symbols.js; run it by hand with `npm run pack:symbol-index`.
// Building the index here instead of when the Worker starts keeps the Worker's startup short.
//
// Needs Node 23.6 or later, which reads the TypeScript in src/symbol-words.ts directly.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIndex, encodeIndex } from "../src/symbol-words.ts";
import pack from "../src/pack/symbols.js";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "pack", "symbol-index.js");
const encoded = encodeIndex(buildIndex(pack), pack.generated_at);
const text = `export default ${JSON.stringify(encoded)};\n`;
writeFileSync(OUT, text);
const words = ["part", "stem", "keyword", "category"].map((k) => Object.keys(encoded[k]).length).reduce((a, b) => a + b, 0);
console.log(`Symbol index: ${words} words for ${pack.symbols.length} symbols, written to src/pack/symbol-index.js (${Math.round(text.length / 1024)} KB)`);

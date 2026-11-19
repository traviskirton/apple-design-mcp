// Reads a Figma local copy (.fig) and writes its decoded document as JSON. No dependencies: the zip,
// the Kiwi binary schema and the message are read here, with node:zlib for deflate and zstd.
//
//   node scripts/fig-dump.mjs FILE.fig [OUT.json]     write the decoded tree (default: print a summary only)
//
// The format, as found in Figma's community UI kits (November 2026):
// - A .fig is a zip holding canvas.fig, meta.json, thumbnail.png and images/<hash>; or it is canvas.fig itself.
// - canvas.fig: the 8 bytes "fig-kiwi", a little-endian uint32 version, then chunks, each a uint32 length
//   and that many bytes. Chunk 0 is the Kiwi schema (raw deflate). Chunk 1 is the message, compressed
//   with raw deflate or zstd (magic 28 B5 2F FD).
// - The message (root type "Message") holds nodeChanges, a flat list of nodes. Each has a guid
//   {sessionID, localID} and a parentIndex {guid, position}; siblings sort by position.
//   blobs holds binary data (vector geometry and the like) that nodes refer to by index.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateRawSync, inflateSync, zstdDecompressSync } from "node:zlib";
import { fileURLToPath } from "node:url";

// ---------- zip ----------

/** The files in a zip, by name, read on demand. Enough for Figma's zips: no zip64, no encryption. */
export function readZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("not a zip: no end of central directory");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = new Map();
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("zip: bad central directory entry");
    const method = buf.readUInt16LE(p + 10);
    const compressed = buf.readUInt32LE(p + 20);
    const size = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    entries.set(name, {
      size,
      read() {
        const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
        const data = buf.subarray(start, start + compressed);
        if (method === 0) return data;
        if (method === 8) return inflateRawSync(data);
        throw new Error(`zip: compression method ${method} for ${name}`);
      },
    });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

// ---------- Kiwi ----------

class Bytes {
  constructor(data) { this.data = data; this.at = 0; }
  byte() { if (this.at >= this.data.length) throw new Error("kiwi: read past the end"); return this.data[this.at++]; }
  bytes(n) { const out = this.data.subarray(this.at, this.at + n); this.at += n; return out; }
  varUint() {
    let value = 0, shift = 0, b;
    do { b = this.byte(); value |= (b & 127) << shift; shift += 7; } while (b & 128 && shift < 35);
    return value >>> 0;
  }
  varInt() { const v = this.varUint(); return v & 1 ? ~(v >>> 1) : v >>> 1; }
  varFloat() {
    const first = this.byte();
    if (first === 0) return 0;
    let bits = first | (this.byte() << 8) | (this.byte() << 16) | (this.byte() << 24);
    bits = (bits << 23) | (bits >>> 9);
    scratch.setInt32(0, bits, true);
    return scratch.getFloat32(0, true);
  }
  varUint64() {
    let value = 0n, shift = 0n, b;
    while ((b = this.byte()) & 128 && shift < 56n) { value |= BigInt(b & 127) << shift; shift += 7n; }
    return value | (BigInt(b) << shift);
  }
  varInt64() { const v = this.varUint64(); return v & 1n ? ~(v >> 1n) : v >> 1n; }
  string() {
    const start = this.at;
    while (this.data[this.at] !== 0) this.at++;
    const s = utf8.decode(this.data.subarray(start, this.at));
    this.at++;
    return s;
  }
}
const scratch = new DataView(new ArrayBuffer(4));
const utf8 = new TextDecoder();
const BUILTIN = ["bool", "byte", "int", "uint", "float", "string", "int64", "uint64"];
const KINDS = ["ENUM", "STRUCT", "MESSAGE"];

/** A Kiwi binary schema: definitions with kind ENUM, STRUCT or MESSAGE and their fields. */
export function decodeSchema(data) {
  const bb = new Bytes(data);
  const definitions = [];
  const count = bb.varUint();
  for (let i = 0; i < count; i++) {
    const name = bb.string();
    const kind = KINDS[bb.byte()];
    const fields = [];
    const n = bb.varUint();
    for (let j = 0; j < n; j++) {
      const fieldName = bb.string();
      const type = bb.varInt();
      const isArray = !!(bb.byte() & 1);
      const value = bb.varUint();
      fields.push({ name: fieldName, type: kind === "ENUM" ? null : type, isArray, value });
    }
    definitions.push({ name, kind, fields });
  }
  for (const d of definitions) for (const f of d.fields) if (f.type !== null) f.type = f.type < 0 ? BUILTIN[~f.type] : definitions[f.type].name;
  const byName = new Map(definitions.map((d) => [d.name, d]));
  for (const d of definitions) {
    d.byValue = new Map(d.fields.map((f) => [f.value, f]));
  }
  return { definitions, byName };
}

/** Decodes a message of type `root` with a schema from decodeSchema. Byte arrays stay Uint8Array; 64-bit ints are BigInt. */
export function decodeMessage(schema, data, root = "Message") {
  const bb = new Bytes(data);
  const read = (type) => {
    switch (type) {
      case "bool": return bb.byte() !== 0;
      case "byte": return bb.byte();
      case "int": return bb.varInt();
      case "uint": return bb.varUint();
      case "float": return bb.varFloat();
      case "string": return bb.string();
      case "int64": return bb.varInt64();
      case "uint64": return bb.varUint64();
    }
    const def = schema.byName.get(type);
    if (!def) throw new Error(`kiwi: unknown type ${type}`);
    if (def.kind === "ENUM") {
      const v = bb.varUint();
      return def.byValue.get(v)?.name ?? v;
    }
    const out = {};
    if (def.kind === "STRUCT") {
      for (const f of def.fields) out[f.name] = field(f);
      return out;
    }
    for (;;) {
      const id = bb.varUint();
      if (id === 0) return out;
      const f = def.byValue.get(id);
      if (!f) throw new Error(`kiwi: ${type} has no field ${id} at byte ${bb.at}`);
      out[f.name] = field(f);
    }
  };
  const field = (f) => {
    if (!f.isArray) return read(f.type);
    const n = bb.varUint();
    if (f.type === "byte") return bb.bytes(n);
    const list = new Array(n);
    for (let i = 0; i < n; i++) list[i] = read(f.type);
    return list;
  };
  return read(root);
}

// ---------- .fig ----------

const decompress = (chunk) => {
  if (chunk[0] === 0x28 && chunk[1] === 0xb5 && chunk[2] === 0x2f && chunk[3] === 0xfd) return zstdDecompressSync(chunk);
  if (chunk[0] === 0x78) { try { return inflateSync(chunk); } catch {} }
  return inflateRawSync(chunk);
};

/** Reads canvas.fig bytes: the header, the chunks, the schema and the message. */
export function readCanvas(canvas) {
  const magic = canvas.toString("latin1", 0, 8);
  if (magic !== "fig-kiwi") throw new Error(`not a canvas.fig: starts with ${canvas.subarray(0, 16).toString("hex")}`);
  const version = canvas.readUInt32LE(8);
  const chunks = [];
  for (let p = 12; p + 4 <= canvas.length; ) {
    const len = canvas.readUInt32LE(p);
    chunks.push(canvas.subarray(p + 4, p + 4 + len));
    p += 4 + len;
  }
  const schema = decodeSchema(decompress(chunks[0]));
  const message = decodeMessage(schema, decompress(chunks[1]));
  return { version, chunkLengths: chunks.map((c) => c.length), schema, message };
}

/** Reads a .fig file (zip or bare canvas). */
export function readFig(path) {
  const buf = readFileSync(path);
  let canvas = buf, meta = null, images = 0;
  if (buf.readUInt32LE(0) === 0x04034b50) {
    const zip = readZip(buf);
    canvas = zip.get("canvas.fig")?.read();
    if (!canvas) throw new Error("zip holds no canvas.fig");
    meta = zip.has("meta.json") ? JSON.parse(zip.get("meta.json").read().toString("utf8")) : null;
    images = [...zip.keys()].filter((k) => k.startsWith("images/") && k !== "images/").length;
  }
  return { ...readCanvas(canvas), meta, images };
}

export const guidKey = (g) => (g ? `${g.sessionID}:${g.localID}` : "");

/** The flat nodeChanges as a tree: each node gets `children`, sorted by parentIndex.position. Returns the roots. */
export function buildTree(nodeChanges) {
  const byId = new Map(nodeChanges.map((n) => [guidKey(n.guid), { ...n, children: [] }]));
  const roots = [];
  for (const n of byId.values()) {
    const parent = n.parentIndex && byId.get(guidKey(n.parentIndex.guid));
    if (parent) parent.children.push(n);
    else roots.push(n);
  }
  const sort = (n) => {
    n.children.sort((a, b) => (a.parentIndex.position < b.parentIndex.position ? -1 : a.parentIndex.position > b.parentIndex.position ? 1 : 0));
    n.children.forEach(sort);
  };
  roots.forEach(sort);
  return { roots, byId };
}

/** JSON with byte arrays as base64 and 64-bit integers as strings. */
export const toJSON = (value, space) =>
  JSON.stringify(value, (k, v) => {
    if (typeof v === "bigint") return v.toString();
    if (v instanceof Uint8Array) return { base64: Buffer.from(v).toString("base64"), bytes: v.length };
    return v;
  }, space);

// ---------- command line ----------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [file, out] = process.argv.slice(2);
  if (!file) {
    console.error("usage: node scripts/fig-dump.mjs FILE.fig [OUT.json]");
    process.exit(1);
  }
  const t0 = performance.now();
  const fig = readFig(file);
  const { roots } = buildTree(fig.message.nodeChanges ?? []);
  const t1 = performance.now();
  const types = {};
  for (const n of fig.message.nodeChanges ?? []) types[n.type] = (types[n.type] ?? 0) + 1;
  const doc = roots.find((r) => r.type === "DOCUMENT");
  console.log(`${file}: version ${fig.version}, chunks ${fig.chunkLengths.join(", ")} bytes, ${fig.schema.definitions.length} schema definitions, ` +
    `${fig.message.nodeChanges?.length ?? 0} nodes, ${fig.message.blobs?.length ?? 0} blobs, ${fig.images} images; parsed in ${((t1 - t0) / 1000).toFixed(1)} s`);
  console.log("pages:", (doc?.children ?? []).filter((c) => c.type === "CANVAS").map((c) => c.name).join(" | "));
  console.log("nodes by type:", Object.entries(types).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(", "));
  if (out) {
    const { nodeChanges, blobs, ...rest } = fig.message;
    writeFileSync(out, toJSON({ file, version: fig.version, meta: fig.meta, message: rest, blobs, document: roots }));
    console.log(`wrote ${out} in ${((performance.now() - t1) / 1000).toFixed(1)} s`);
  }
}

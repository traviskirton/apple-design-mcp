// Turns text into search words. Plain JavaScript because two things must agree on it:
// scripts/build-hig-pack.mjs (which builds the search index) and src/hig.ts (which reads it).

const STOP = new Set(
  (
    "a about all an and any are as at be by can do does for from has have how i if in into is it many more most much my " +
    "no not of on or should than that the their then there these this those to use using what when where which with you your"
  ).split(" "),
);

/** Reduces a lower-case word to a rough root, so "tabs", "tab" and "sizes", "sized", "size" match. */
export function stem(word) {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) w = w.slice(0, -3) + "y";
  else if (w.length > 3 && w.endsWith("s") && !/(ss|us|is|os)$/.test(w)) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  if (w.length > 3 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

/** The search words in a piece of text, in order, with repeats. */
export function words(text) {
  const out = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < 2 || STOP.has(raw)) continue;
    out.push(stem(raw));
  }
  return out;
}

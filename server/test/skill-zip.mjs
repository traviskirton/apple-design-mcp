// Fails when assets/apple-design-skill.zip does not hold the skill as it is in plugin/skills.
// Fix with `npm run pack:skill`.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const server = join(dirname(fileURLToPath(import.meta.url)), "..");
const skills = join(server, "..", "plugin", "skills");
const zip = join(server, "assets", "apple-design-skill.zip");

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const want = files(join(skills, "apple-design")).map((p) => relative(skills, p)).sort();
const have = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" }).split("\n").filter((n) => n && !n.endsWith("/")).sort();
const problems = [];
if (want.join("\n") !== have.join("\n")) problems.push(`files differ: zip has [${have}], skill has [${want}]`);
for (const name of want.filter((n) => have.includes(n))) {
  const inZip = execFileSync("unzip", ["-p", zip, name]);
  if (!inZip.equals(readFileSync(join(skills, name)))) problems.push(`${name} is stale`);
}
if (problems.length) {
  console.error(`apple-design-skill.zip: ${problems.join("; ")}. Run npm run pack:skill and commit the zip.`);
  process.exit(1);
}
console.log("skill zip OK");

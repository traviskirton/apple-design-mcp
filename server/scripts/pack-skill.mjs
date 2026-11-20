// Builds assets/apple-design-skill.zip from the agent skill in plugin/skills/apple-design, so
// claude.ai users can download it and upload it under Settings > Capabilities > Skills.
//
//   npm run pack:skill
//
// Run it after changing the skill and commit the zip; `npm run check` fails while the zip is stale.
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const server = join(dirname(fileURLToPath(import.meta.url)), "..");
const skills = join(server, "..", "plugin", "skills");
const zip = join(server, "assets", "apple-design-skill.zip");

rmSync(zip, { force: true });
execFileSync("zip", ["-X", "-q", "-r", zip, "apple-design"], { cwd: skills, stdio: "inherit" });
console.log(`Wrote ${zip}`);

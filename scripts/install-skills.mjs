import { cp, lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: { project: { type: "string" }, replace: { type: "boolean", default: false } },
  strict: true,
});
if (!values.project)
  throw new Error("Usage: mise run install -- --project /path/to/project [--replace]");
const project = await realpath(resolve(values.project));
const source = resolve(dirname(fileURLToPath(import.meta.url)), "../brain");
const destination = join(project, ".agents/skills/brain");
const instructions = join(project, "AGENTS.md");
for (const path of [
  join(project, ".agents"),
  join(project, ".agents/skills"),
  destination,
  instructions,
]) {
  const metadata = await lstat(path).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (metadata?.isSymbolicLink())
    throw new Error("Refusing a symlink at the skill or instruction destination");
}
const existing = await lstat(destination).catch((error) => {
  if (error.code === "ENOENT") return null;
  throw error;
});
if (existing && !values.replace)
  throw new Error(
    "Brain skill already exists. Review it and rerun with --replace to update its files.",
  );
const current = await readFile(instructions, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "";
  throw error;
});
await mkdir(dirname(destination), { recursive: true });
await cp(source, destination, {
  recursive: true,
  force: values.replace,
  errorOnExist: !values.replace,
  dereference: false,
});
const pointer =
  "For Second Brain setup, selection, knowledge, or people requests, read `.agents/skills/brain/SKILL.md` and use the `brain` CLI.";
if (!current.includes(pointer))
  await writeFile(
    instructions,
    `${current.trimEnd()}${current.trim() ? "\n\n" : ""}## Brain CLI\n\n${pointer}\n`,
  );
process.stdout.write(`${JSON.stringify({ installed: destination, instructions })}\n`);

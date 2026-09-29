import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    project: { type: "string" },
    replace: { type: "boolean", default: false },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
});
if (values.help) {
  process.stdout.write(
    "Usage: mise run install -- [--replace] [--project /path/to/project]\n\nInstalls globally for Codex and Claude Code by default.\nCORTEX_SKILLS_HOME overrides the home directory for isolated testing.\n",
  );
  process.exit(0);
}
if (values.project === "") throw new Error("--project requires a directory");
const project = values.project ? await realpath(resolve(values.project)) : null;
const root = project ?? (await realpath(resolve(process.env.CORTEX_SKILLS_HOME || homedir())));
const source = resolve(dirname(fileURLToPath(import.meta.url)), "../cortex");
const agents = project ? [".agents"] : [".agents", ".claude"];
const destinations = agents.map((agent) => join(root, agent, "skills/cortex"));
const instructions = project ? join(project, "AGENTS.md") : null;

async function metadata(path) {
  return lstat(path).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
}

for (const destination of destinations) {
  for (const path of [dirname(dirname(destination)), dirname(destination), destination]) {
    const existing = await metadata(path);
    if (existing && !existing.isDirectory())
      throw new Error(`Expected a directory without a symlink at ${path}`);
  }
  if ((await metadata(destination)) && !values.replace)
    throw new Error(
      `Cortex skill already exists at ${destination}. Rerun with --replace to update it.`,
    );
}
if (instructions && (await metadata(instructions))?.isSymbolicLink())
  throw new Error("Refusing a symlink at the instruction destination");
const current = instructions
  ? await readFile(instructions, "utf8").catch((error) => {
      if (error.code === "ENOENT") return "";
      throw error;
    })
  : "";

for (const destination of destinations) {
  await mkdir(dirname(destination), { recursive: true });
  const staging = await mkdtemp(join(dirname(destination), ".cortex-install-"));
  const replacement = join(staging, "next");
  const previous = join(staging, "previous");
  let backedUp = false;
  try {
    await cp(source, replacement, { recursive: true });
    if (await metadata(destination)) {
      await rename(destination, previous);
      backedUp = true;
    }
    try {
      await rename(replacement, destination);
    } catch (error) {
      if (backedUp) await rename(previous, destination);
      throw error;
    }
  } finally {
    if (!(await metadata(previous)) || (await metadata(destination)))
      await rm(staging, { recursive: true, force: true });
  }
}
const pointer =
  "For Cortex setup, selection, knowledge, or people requests, read `.agents/skills/cortex/SKILL.md` and use the `cortex` CLI.";
if (instructions && !current.includes(pointer))
  await writeFile(
    instructions,
    `${current.trimEnd()}${current.trim() ? "\n\n" : ""}## Cortex CLI\n\n${pointer}\n`,
  );
process.stdout.write(
  `${JSON.stringify({ scope: project ? "project" : "user", installed: destinations, instructions })}\n`,
);

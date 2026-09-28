import { test } from "node:test";
import assert from "node:assert/strict";
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./install-skills.mjs", import.meta.url));
const source = fileURLToPath(new URL("../brain/", import.meta.url));

function install(root, ...args) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    cwd: root,
    env: { ...process.env, BRAIN_SKILLS_HOME: root },
  });
}

test("the default installs complete global skills for both agents without project instructions", async () => {
  const root = await mkdtemp(join(tmpdir(), "brain-skills-global-"));
  try {
    const result = install(root);
    assert.equal(result.status, 0, result.stderr);
    const installed = JSON.parse(result.stdout);
    assert.equal(installed.scope, "user");
    assert.equal(installed.instructions, null);
    const canonicalRoot = await realpath(root);
    assert.deepEqual(
      installed.installed,
      [".agents", ".claude"].map((agent) => join(canonicalRoot, agent, "skills/brain")),
    );
    for (const path of installed.installed) {
      for (const asset of [
        "SKILL.md",
        "agents/openai.yaml",
        "assets/logo.svg",
        "references/setup.md",
        "references/management.md",
      ]) {
        assert.deepEqual(await readFile(join(path, asset)), await readFile(join(source, asset)));
      }
    }
    assert.deepEqual((await readdir(root)).sort(), [".agents", ".claude"]);
    assert.notEqual(install(root).status, 0);
    for (const path of installed.installed)
      await writeFile(join(path, "removed.md"), "Old release");
    const replaced = install(root, "--replace");
    assert.equal(replaced.status, 0, replaced.stderr);
    for (const path of installed.installed) {
      await assert.rejects(lstat(join(path, "removed.md")), { code: "ENOENT" });
      assert.deepEqual(await readdir(join(path, "..")), ["brain"]);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("global installation checks both destinations before changing either", async () => {
  const root = await mkdtemp(join(tmpdir(), "brain-skills-conflict-"));
  try {
    const existing = join(root, ".claude/skills/brain");
    await mkdir(existing, { recursive: true });
    await writeFile(join(existing, "SKILL.md"), "Existing skill");
    assert.notEqual(install(root).status, 0);
    assert.equal(await readFile(join(existing, "SKILL.md"), "utf8"), "Existing skill");
    await assert.rejects(lstat(join(root, ".agents")), { code: "ENOENT" });
    await rm(existing, { recursive: true });
    const external = join(root, "external");
    await mkdir(external);
    await writeFile(join(external, "SKILL.md"), "Keep this");
    await symlink(external, existing);
    assert.notEqual(install(root, "--replace").status, 0);
    assert.equal(await readFile(join(external, "SKILL.md"), "utf8"), "Keep this");
    await assert.rejects(lstat(join(root, ".agents")), { code: "ENOENT" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("local skill installation preserves project instructions, requires explicit replacement, and is repeatable", async () => {
  const project = await mkdtemp(join(tmpdir(), "brain-skills-"));
  try {
    await writeFile(join(project, "AGENTS.md"), "# Project\n\nPreserve this rule.\n");
    const run = (...extra) => install(project, "--project", project, ...extra);
    assert.equal(run().status, 0);
    const instructions = await readFile(join(project, "AGENTS.md"), "utf8");
    assert.ok(instructions.includes("Preserve this rule."));
    assert.ok(
      (await readFile(join(project, ".agents/skills/brain/SKILL.md"), "utf8")).startsWith(
        "---\nname: brain\n",
      ),
    );
    assert.notEqual(run().status, 0);
    assert.equal(run("--replace").status, 0);
    assert.equal(await readFile(join(project, "AGENTS.md"), "utf8"), instructions);
    await assert.rejects(lstat(join(project, ".claude")), { code: "ENOENT" });
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

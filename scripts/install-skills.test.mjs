import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

test("local skill installation preserves project instructions, requires explicit replacement, and is repeatable", async () => {
  const project = await mkdtemp(join(tmpdir(), "brain-skills-"));
  const script = fileURLToPath(new URL("./install-skills.mjs", import.meta.url));
  try {
    await writeFile(join(project, "AGENTS.md"), "# Project\n\nPreserve this rule.\n");
    const run = (...extra) =>
      spawnSync(process.execPath, [script, "--project", project, ...extra], { encoding: "utf8" });
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
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

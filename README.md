# Cortex skills

Portable instructions for agents that can execute the `cortex` CLI. The collection currently has one
entry point, [cortex/SKILL.md](cortex/SKILL.md), with setup and management references loaded when
needed. It handles selecting a Brain, cited retrieval, recording, onboarding, and access management.

Complete Codex and Claude plugins bundle these CLI instructions and a Brain-bound MCP fallback. The
CLI is preferred for local execution; the plugin router chooses the transport. Normal users install
complete deployed plugins through https://www.thesecondbrain.company/llms.txt. The standalone
installer below remains available for isolated evaluation without a competing installed plugin.

## User setup and verification

Install the complete plugin using the [agent guide](https://www.thesecondbrain.company/llms.txt) or
[browser guide](https://www.thesecondbrain.company/install), then start a fresh task or session to
load its instructions and tools. A missing CLI on a supported host can be installed with:

```bash
curl -fsSL https://www.thesecondbrain.company/cli/install.sh | bash
```

The [setup reference](cortex/references/setup.md) covers PATH, sign-in, Brain selection, and
recovery. CLI setup is ready when `cortex --version`, `cortex account show`, and `cortex whoami`
succeed for the intended Brain in the task's working directory. Reuse existing sign-in and
selection.

When CLI installation or execution is unavailable, the complete plugin can use Brain-bound MCP.
Native OAuth and MCP `whoami` must verify the intended Brain before knowledge access. Preserve
pending writes' original Brain, input, and request ID when recovering or changing transport. A
standalone copy of this CLI skill does not configure that fallback connection.

| Entry point                            | Purpose                                              | Maintained source in `repo/`   |
| -------------------------------------- | ---------------------------------------------------- | ------------------------------ |
| [Cortex CLI workflow](cortex/SKILL.md) | Brain selection, knowledge, and management           | `cli/skills/cortex`            |
| Complete plugin router                 | CLI installation, transport choice, and MCP fallback | `plugins/cortex/skills/cortex` |
| Agent install guide                    | Client-specific installation and readiness checks    | `js/www/public/llms.txt`       |

## Contributing

Edit every skill, README, installer, and release script in the main `repo/` checkout. CLI source
lives under `cli/cli`, and portable skills live under `cli/skills`. The sibling CLI and skills
repositories are publication mirrors for discovery and raw GitHub content links; mirror edits are
overwritten by `mise run sync-cli-mirrors`. Build, test, commit, synchronize, and publish from
`repo/`.

## Install locally

Do all development in the main `repo/` checkout under `cli/skills`. This public skills repository is
a mirror for discovery and raw GitHub content links, not a development checkout. For isolated
evaluation, install [mise](https://mise.jdx.dev/) and run these commands from `repo/`:

```sh
mise trust
mise install
mise run test-cli-skills
mise run install-cli-skills
```

The mirrored package is independent of the Cortex CLI source. Installing these skills needs only the
Node runtime pinned here; Rust and the CLI source are not required to install the skill. On first
use, the skill checks `cortex --version` and follows its [setup guide](cortex/references/setup.md)
when the CLI is missing. It recovers an installation outside PATH or installs the official release
with checksum verification, then continues with authentication and the requested task. Developer
builds use pinned mise tasks.

Installation is global for your user by default:

| Agent       | Installed skill           |
| ----------- | ------------------------- |
| Codex       | `~/.agents/skills/cortex` |
| Claude Code | `~/.claude/skills/cortex` |

Both copies include the instructions, references, and logo. They work across projects without an
`AGENTS.md`, `CLAUDE.md`, or project-specific skill installation. Run `cortex login`, then
`cortex config` or `cortex use <id>` from your working directory. Commands automatically read and
write `.cortex/config.toml` there. Authentication is stored per user and service origin; Brain
selection stays in each working directory, with no global default.

After editing these source files, update both installed copies with:

```sh
mise run install-cli-skills -- --replace
```

The installer copies the current filesystem, including saved uncommitted changes. Replacement
removes obsolete files from the previous skill. Normal releases copy these maintained references
into both complete plugins. Standalone global skills remain an evaluation option; remove those
copies before using the plugin router.

For a project-only evaluation, run `mise run install-cli-skills -- --project /path/to/project` from
`repo/`. This copies the skill to that project's `.agents/skills/cortex` and adds a pointer to its
`AGENTS.md`, preserving existing instructions. Add `--replace` to update that copy. Separately, the
CLI's `cortex --project /path/to/project use <id>` selects a Brain for a directory other than the
current one.

## Agent environments

[Codex](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) and
[Claude Code](https://code.claude.com/docs/en/skills#choose-where-skills-load) discover the global
copies in their native skill directories. Use the skill on the next turn in Codex. In Claude Code,
use `/cortex`; run `/reload-skills` if the skills directory was created during the session.

With the optional project-only installation, Claude Code can follow the `AGENTS.md` pointer through
its [AGENTS support](https://code.claude.com/docs/en/memory). Where `CLAUDE.md` takes precedence,
import `AGENTS.md` or load the skill explicitly. The source package itself needs no `.claude`
folder.

Standalone evaluation needs a shell, a supported release binary on PATH, and access to the service.
Hosted Claude Cowork and cloud sessions do not automatically load skills or binaries from your
host's home directory. Make the skill and a compatible binary available inside that environment and
ensure its OAuth callback is reachable before evaluating it there. The current tested target is a
local Codex or Claude Code shell on macOS. Published Linux arm64 and x86_64 installer paths are also
verified; Linux requires glibc 2.36 or later. Hosted clients normally use the complete plugin's MCP
connection.

## Skill icon

[cortex/agents/openai.yaml](cortex/agents/openai.yaml) supplies the Cortex display name and
`icon_small` and `icon_large` metadata documented in
[OpenAI Docs](https://learn.chatgpt.com/docs/build-skills#optional-metadata). Both paths resolve to
the bundled [Cortex logo](cortex/assets/logo.svg), relative to the skill directory. The SVG reuses
the product mark and includes light and dark colors. The installer copies the metadata and asset
along with the skill, so this repository and the installed skill remain self-contained.

As of 28 September 2026, Claude Desktop's
[custom skill guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
and [skill metadata reference](https://code.claude.com/docs/en/skills#frontmatter-reference)
document no equivalent skill-picker icon field. The logo remains available as a bundled asset, but
its display in Claude's skill picker is unverified. No Claude-specific icon metadata is added.

## Development

```sh
mise run test-cli-skills
mise run fmt
mise run fmt-check
```

Run these commands from `repo/`. `cli/skills/cortex/` contains the skill and its references;
`cli/skills/scripts/` contains the local installer and its tests. The public mirror retains the
package's own tasks for independent consumer use. The tests use temporary user directories and
projects and require no service, credentials, or CLI source. Set `CORTEX_SKILLS_HOME` to an existing
temporary directory to test global installation without changing your real skills. This override
affects only the skills installer.

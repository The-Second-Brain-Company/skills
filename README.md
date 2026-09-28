# Brain skills

Portable instructions for agents that can execute the `brain` CLI. The collection currently has one
entry point, [brain/SKILL.md](brain/SKILL.md), with setup and management references loaded when
needed. It handles selecting a Brain, cited retrieval, recording, onboarding, and access management.

## Install locally

Install [mise](https://mise.jdx.dev/), then run these commands from this repository:

```sh
mise trust
mise install
mise run test
mise run install
```

This repository is independent of the Brain CLI source. Build and install `brain` from its own
repository and make the binary available on the agent's PATH. Installing these skills needs only the
Node runtime pinned here; Rust and the CLI source are not required.

Installation is global for your user by default:

| Agent       | Installed skill          |
| ----------- | ------------------------ |
| Codex       | `~/.agents/skills/brain` |
| Claude Code | `~/.claude/skills/brain` |

Both copies include the instructions, references, and logo. They work across projects without an
`AGENTS.md`, `CLAUDE.md`, or project-specific skill installation. Run `brain login`, then
`brain config` or `brain use <id>` from your working directory. Commands automatically read and
write `.brain/config.toml` there. Authentication is stored per user and service origin; Brain
selection stays in each working directory, with no global default.

After editing these source files, update both installed copies with:

```sh
mise run install -- --replace
```

The installer copies the current filesystem, including saved uncommitted changes. Replacement
removes obsolete files from the previous skill. From the full Second Brain repository root, run
`mise run install-cli-skills -- --replace`. No package is published during this preview. The
existing MCP plugin remains available; explicitly ask for the Brain CLI during comparison.

For a project-only installation, use `mise run install -- --project /path/to/project`. This copies
the skill to that project's `.agents/skills/brain` and adds a pointer to its `AGENTS.md`, preserving
existing instructions. Add `--replace` to update that copy. Separately, the CLI's
`brain --project /path/to/project use <id>` selects a Brain for a directory other than the current
one.

## Agent environments

[Codex](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) and
[Claude Code](https://code.claude.com/docs/en/skills#choose-where-skills-load) discover the global
copies in their native skill directories. Use the skill on the next turn in Codex. In Claude Code,
use `/brain`; run `/reload-skills` if the skills directory was created during the session.

With the optional project-only installation, Claude Code can follow the `AGENTS.md` pointer through
its [AGENTS support](https://code.claude.com/docs/en/memory). Where `CLAUDE.md` takes precedence,
import `AGENTS.md` or load the skill explicitly. The source package itself needs no `.claude`
folder.

The harness must have a shell, the locally built binary on PATH, and access to the service. Hosted
Claude Cowork and cloud sessions do not automatically load skills or binaries from your host's home
directory. Make the skill and a compatible binary available inside that environment and ensure its
OAuth callback is reachable before evaluating it there. The current tested target is a local Codex
or Claude Code shell, on macOS; the CLI's Rust source can also be built for Linux.

## Skill icon

[brain/agents/openai.yaml](brain/agents/openai.yaml) supplies the Second Brain display name and
`icon_small` and `icon_large` metadata documented in
[OpenAI Docs](https://learn.chatgpt.com/docs/build-skills#optional-metadata). Both paths resolve to
the bundled [Brain logo](brain/assets/logo.svg), relative to the skill directory. The SVG reuses the
product mark and includes light and dark colors. The installer copies the metadata and asset along
with the skill, so this repository and the installed skill remain self-contained.

As of 28 September 2026, Claude Desktop's
[custom skill guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
and [skill metadata reference](https://code.claude.com/docs/en/skills#frontmatter-reference)
document no equivalent skill-picker icon field. The logo remains available as a bundled asset, but
its display in Claude's skill picker is unverified. No Claude-specific icon metadata is added.

## Development

```sh
mise run test
mise run fmt
mise run fmt-check
```

`brain/` contains the skill and its references; `scripts/` contains the local installer and its
tests. To verify isolation, copy this repository without `.local/` or project configuration and run
the same tasks in the copy. The tests use temporary user directories and projects and require no
service, credentials, or CLI source. Set `BRAIN_SKILLS_HOME` to an existing temporary directory to
test global installation without changing your real skills. This override affects only the skills
installer.

# Brain skills

Portable instructions for agents that can execute the `brain` CLI. The collection currently has one
entry point, [brain/SKILL.md](brain/SKILL.md), with setup and management references loaded when
needed. It handles selecting a project Brain, cited retrieval, recording, onboarding, and access
management.

## Install locally

Install [mise](https://mise.jdx.dev/), then run these commands from this repository:

```sh
mise trust
mise install
mise run test
mise run install -- --project /path/to/evaluation-project
```

This repository is independent of the Brain CLI source. Build and install `brain` from its own
repository and make the binary available on the agent's PATH. Installing these skills needs only the
Node runtime pinned here; Rust and the CLI source are not required.

The installer copies the skill into `.agents/skills/brain` and adds an `AGENTS.md` pointer. Existing
instructions remain. Use `--replace` for a reviewed update. It never installs or reconfigures an MCP
plugin. Keep the existing MCP skill available if you want to compare workflows; explicitly ask for
the Brain CLI during evaluation. No skill package or installer is published during this preview.

## Agent environments

[Codex skill discovery](https://learn.chatgpt.com/docs/build-skills) includes `.agents/skills`.
[Claude Code's AGENTS support](https://code.claude.com/docs/en/memory) can follow the same project's
pointer when the built-in AGENTS plugin is enabled. Where a `CLAUDE.md` takes precedence, import
`AGENTS.md` or load the skill explicitly. Claude's native slash-command discovery separately uses
[`.claude/skills`](https://code.claude.com/docs/en/skills); that optional installation layout is not
required by this source package.

The harness must have a shell, the locally built binary on PATH, and access to the service. Hosted
Claude Cowork and cloud sessions do not automatically load skills or binaries from your host's home
directory. Make the skill and a compatible binary available inside that environment and ensure its
OAuth callback is reachable before evaluating it there. The current tested target is a local Codex
or Claude Code shell, on macOS; the CLI's Rust source can also be built for Linux.

## Development

```sh
mise run test
mise run fmt
mise run fmt-check
```

`brain/` contains the skill and its references; `scripts/` contains the local installer and its
tests. To verify isolation, copy this repository without `.local/` or project configuration and run
the same tasks in the copy. The tests use temporary projects and require no service, credentials, or
CLI checkout.

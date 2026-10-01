# Cortex skills development

This repository contains portable instructions for agents that run the Cortex CLI. Keep it
independently installable and testable. The CLI is built and installed from its own repository;
these tasks must not depend on a sibling checkout or the private service source.

Use the pinned mise tasks. Run `mise install` after changing tool versions. Run `mise run test`,
`mise run fmt`, and `mise run fmt-check` before committing. Keep code free of comments and put
rationale in Markdown.

Keep `cortex/SKILL.md` focused on the core workflow. Load setup and management references only when
needed. Preserve verified Brain selection, login's opt-out, cited retrieval, stable retry IDs,
private credentials, and durable saved receipts. Install skills globally for Codex and Claude Code
by default; keep `--project` as an optional installation target. Test temporary user directories and
projects while preserving existing instructions. CLI selection stays in the working directory's
`.cortex/config.toml`; only authentication is stored per user.

These CLI skills are a side project; Cortex development prioritizes remote MCP and plugin
distribution for ChatGPT/Codex and Claude. New product capabilities are implemented in the CLI as
well; update these skills when their workflows change. Keep CLI-specific expansion and public
distribution secondary.

This is a local evaluation preview. Do not publish skills or modify existing MCP/plugin packages.

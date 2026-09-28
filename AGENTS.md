# Brain skills development

This repository contains portable instructions for agents that run the Brain CLI. Keep it
independently installable and testable. The CLI is built and installed from its own repository;
these tasks must not depend on a sibling checkout or the private service source.

Use the pinned mise tasks. Run `mise install` after changing tool versions. Run `mise run test`,
`mise run fmt`, and `mise run fmt-check` before committing. Keep code free of comments and put
rationale in Markdown.

Keep `brain/SKILL.md` focused on the core workflow. Load setup and management references only when
needed. Preserve explicit Brain selection, cited retrieval, stable retry IDs, private credentials,
and durable saved receipts. Test installation into temporary projects while preserving existing
instructions.

This is a local evaluation preview. Do not publish skills or modify existing MCP/plugin packages.

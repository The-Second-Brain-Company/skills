# Cortex skills development

Develop only in the main `repo/` checkout under `cli/skills`. Run the root's `test-cli-skills` and
`install-cli-skills` mise tasks from `repo/`. The sibling `skills` repository is a public mirror for
discovery and raw GitHub content links; never edit or commit there. Keep these CLI instructions
independently installable and testable. Run root test, fmt, and fmt-check tasks before committing.
Keep code free of comments; rationale belongs in Markdown.

Every commit changing `repo/cli/cli` or `repo/cli/skills` MUST synchronize and push both sibling
mirrors and verify both remote `master` heads. Install the main repository's hooks with
`mise run hooks-install`. Its post-commit hook publishes automatically. If hooks are unavailable,
bypassed, or fail, run `mise run publish-cli-mirrors` from `repo/` and resolve failures before
reporting completion. A failed publication leaves the source commit intact.

Complete Codex and Claude plugins bundle this CLI workflow and a Brain-bound MCP fallback. Keep the
core workflow in cortex/SKILL.md; disclose installation/sign-in and management through references.
The CLI is preferred wherever local execution is available. .cortex/config.toml is the preferred
project format; the CLI resolves selection and enforces it on service calls. Verify identity, honor
login's opt-out, preserve citations, and retain original Brain IDs and request IDs across recovery.
Recover CLI failures through the CLI; changing transports needs an explicit decision and verified
identity. Only a saved receipt confirms knowledge persistence.

The standalone installer is for isolated evaluation. Normal users install complete deployed plugins,
without a second global skill or a project AGENTS.md pointer. Keep its temporary-directory tests and
optional project installation usable without modifying unrelated instructions. The service's plugin
packager copies these maintained references; release both plugin versions together when they change.

# Keep local onboarding on the CLI

Disable MCP during requested local onboarding only after separate `cortex --version`,
`cortex account show`, `cortex config`, and `cortex whoami` calls succeed for the intended account,
origin, and Brain. A working executable alone is insufficient. Resolve failed checks first.

Keep one complete plugin. Disable only its Cortex MCP server in the current local client. Preserve
the plugin's skills, other servers, approval policies, CLI sign-in, project selection, and OAuth
grants. Do not revoke a connection or change another client. Respect an explicit preference to keep
MCP enabled and managed policy. Reconcile pending MCP writes through their original connection
before disabling it; retain their Brain, input, and retry identity.

Identify the actual host from its client metadata, not the model name, operating system, or a nearby
configuration directory. Use the native control when available. Otherwise make a focused
configuration edit inside a local process, exposing only the target server's name, public endpoint,
and effective enabled state. Keep headers, environment values, credentials, and full configuration
files out of chat and tool output. Preserve unrelated fields and existing file permissions.

## Codex local clients

Find the installed Cortex plugin's exact `name@marketplace` identity with `codex plugin list --json`
or the host's plugin inventory. Match its bundled Cortex server and expected service origin. Do not
guess the marketplace name or change a separately configured server.

In the active `CODEX_HOME/config.toml`, normally `~/.codex/config.toml`, set only that plugin
server's `enabled` value to `false`. For the standard personal marketplace installation:

```toml
[plugins."cortex@personal".mcp_servers.cortex]
enabled = false
```

Use the actual installed identity in that table. Update an existing table instead of appending a
duplicate. Keep the plugin itself enabled. Inspect the effective result with
`codex mcp get cortex --json`, or the client's MCP status control. Verify that it identifies the
intended server and reports `enabled: false`. These are host configuration checks, not Cortex
knowledge calls.

Project or managed settings can override the user setting. If the effective server remains enabled,
report that limitation rather than changing another scope or claiming suppression.

## Claude Code

Use `/mcp` to disable the installed Cortex server while leaving the plugin enabled. The plugin's
normal server name is `plugin:cortex:cortex`; confirm its identity and service origin from the
installed plugin inventory before changing it.

If the assistant cannot operate `/mcp`, edit only the current project's `disabledMcpServers` list in
Claude Code's local configuration. The default file is `~/.claude.json`; with `CLAUDE_CONFIG_DIR`,
it is `<CLAUDE_CONFIG_DIR>/.claude.json`. Use the client's current canonical project key under
`projects`, resolving symlinks with `realpath`. A different spelling of the same directory can leave
the server enabled. Add `plugin:cortex:cortex` once, preserving every other disabled entry and every
unrelated project and setting. Do not replace the entire project object.

From that exact project and client configuration, run `claude mcp get plugin:cortex:cortex`. Require
`Disabled for this project` before reporting success. A disabled server is not health-checked. This
setting applies to the current project; repeat the procedure during requested CLI onboarding in
another project. It does not disable a Claude chat, Cowork, or mobile connection.

## Complete or recover setup

Read back the effective state after each change. If no Cortex MCP server is installed, make no
configuration change and report that it is absent. Never install another server just to disable it.
An unavailable control, ambiguous server identity, malformed configuration, or policy restriction
means the CLI can be ready while MCP suppression remains incomplete. Explain that specific gap. Do
not mark MCP disabled based only on a successful file write or an instruction in the skill.

Let the host apply its normal configuration reload. Verify again in the fresh chat invited by
onboarding. If the current session retains an already loaded connection, distinguish that session
from the verified configuration for new sessions. Do not promise to undo earlier startup traffic.

Clients without a working CLI skip suppression and retain native MCP onboarding. If permitted CLI
recovery fails and MCP is explicitly chosen, restore only the same local server setting: set its
Codex `enabled` value to `true`, or remove only its entry from the current Claude project's
`disabledMcpServers`. Preserve other entries. Re-enable through the native control when available,
then complete OAuth and verify the intended Brain using [MCP fallback](setup.md#mcp-fallback).
Neither local configuration nor CLI sign-in changes an MCP grant's Brain.

Host controls are documented in
[Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) and
[Claude Code MCP configuration](https://code.claude.com/docs/en/mcp#disable-a-server-without-removing-it).

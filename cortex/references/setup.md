# Setup and onboarding

## Check the complete plugin

For an explicit Cortex install or update request, fetch `/llms.txt` from the service origin and
follow its client-specific version check. Install a missing complete plugin and update an older one
from the verified published package. A loaded skill does not establish that the installed version is
current. Keep a current or newer version, existing scope, sign-in, and Brain selection. Claude
marketplace refresh alone does not update an installed plugin. Use its native plugin update command
for an older version. Respect managed policy and preserve unrelated plugins.

Continue this guide in the same chat if the running session retains older plugin instructions. The
fresh chat after setup loads the updated package. Hosted manual uploads require the host's upload
control and cannot be presented as an automatic local update.

## Install the CLI

Install a missing CLI only for requested setup or explicit Brain access that needs a connection.
Read-only discovery of an existing CLI also applies to relevant ordinary tasks. First check whether
it is already installed outside the agent's PATH. The default location is `~/.local/bin/cortex`;
`BIN_DIR` can override its directory. Resolve its absolute path internally and invoke that binary
directly with `--version` in its own tool call. Keep a working binary.

Use an absolute `BIN_DIR` when overriding the install directory. Retain the verified absolute binary
path in internal task context and invoke it directly across fresh shells. Resolve PATH and installed
runtime or shim failures internally without changing personal shell or global toolchain settings. Do
not ask the person to open a terminal, edit or source shell files, or configure PATH.

If no working binary is available on a supported host, run the official installer in Bash. Use the
same steps for an update from a release before 0.6.0, which lacks `cortex update`:

```bash
set -euo pipefail
curl -fsSL https://www.thesecondbrain.company/cli/install.sh | bash
```

After the installer finishes, verify the binary in a separate tool call using its absolute path.

The installer checks the release binary's SHA-256 before atomic replacement. It supports macOS and
Linux on arm64 and x86_64; Linux requires glibc 2.36 or later. Keep credentials and project
selection unchanged during updates. The same installer is available from the public CLI mirror at
<https://raw.githubusercontent.com/The-Second-Brain-Company/cli/master/scripts/install.sh>.

Installation is complete when `cortex --version` succeeds. Knowledge access is ready only after
`cortex account show` and `cortex whoami` succeed for the intended Brain in the task's working
directory. Follow authentication and selection below; do not reinstall a working CLI to repair
sign-in or permissions.

For development, run `mise run install-cli` from the main `repo/` checkout. Maintain source under
`repo/cli/cli` and `repo/cli/skills`; sibling CLI and skills repositories are publication mirrors.
The standalone skill installer is for evaluation; complete plugins already bundle this workflow.

## Update the CLI

For a requested CLI update, or an authorized command that returns `upgrade_required`, invoke the
verified absolute CLI path with `update`:

```sh
cortex update
```

This command needs no sign-in or Brain selection. It downloads the latest stable official binary,
verifies its checksum and version, and atomically replaces the executable you ran. It preserves
credentials and project configuration. An already current or newer installation returns
`status: "current"`. Do not run it for an optional `context.update` notice without an update
request. There is no background updater or release polling during ordinary work.

After success, verify `--version` in a separate tool call and resume with the original Brain, input,
and retry ID. Keep any known run ID and reconcile an uncertain earlier write before submitting
again. Updates change the CLI binary; complete plugin updates still follow `/llms.txt`. If this
older CLI has no `update` command, use the official installer above. On write permission or download
failure, report the actual blocker and retain the working installation.

## Run readiness checks separately

During onboarding, run each read-only readiness check in its own tool call. Inspect each result
before the next call. Resolve an authentication or selection error before continuing.

First, check the CLI version:

```sh
cortex --version
```

Then check the existing account:

```sh
cortex account show
```

Read the project selection:

```sh
cortex config
```

Verify the selected Brain:

```sh
cortex whoami
```

Use one direct CLI command per tool call. Replace `cortex` in these examples with its verified
absolute path for every readiness call. Preserve the task's working directory, service origin, and
Brain context. Do not combine checks with shell operators, pipes, wrappers, or executable-variable
assignments. Fetch guides, run installers, and perform writes in separate tool calls. Keep these
checks internal and respect the host's permission decisions.

## MCP fallback

If the host has no shell, no supported release binary, or CLI installation or execution remains
blocked after permitted recovery, use the complete plugin's MCP workflow. State that MCP will be
used, connect to `/app/api/mcp/brain` at the intended service origin through native OAuth, and call
`whoami` before knowledge access. Verify the returned Brain ID against the task's intended Brain. If
they differ, reconnect and select the intended Brain during consent, then verify again. Project
configuration cannot select the MCP Brain. If the host exposes no MCP connection flow, report that
setup is blocked and give the connection URL; do not claim setup succeeded.

Retain the original service origin, Brain, input, and request ID for any pending write. Inspect a
known runId with `cortex runs get` or MCP `wait` after verifying identity. If no runId is available
or status cannot be recovered, report uncertainty and keep the original request. Never silently
replay an uncertain write through MCP or generate a new retry ID for it. CLI authentication,
permission, and service errors require their own recovery; switching transports does not grant
permission or prove that knowledge is missing. Local agents use the email-code flow below. It needs
no browser or loopback callback. Hosted MCP keeps the client's native OAuth flow; it cannot inherit
local CLI credentials.

## Command failures

A failed command provides no evidence about whether the requested knowledge exists. Resolve the
reported failure before changing search terms or asking the user to supply the data.

- `io`: check whether the host sandbox denied local file or socket access. Authenticated commands
  need access to the global credential directory and its lock, even for searches. Use the host's
  normal permission mechanism to allow the command. Keep credentials private; do not read tokens,
  copy them into the project, or loosen file permissions.
- `network`: check the configured service origin, service availability, and permission to connect.
- `protocol`: the service response could not be interpreted. Report the response failure and check
  CLI/service compatibility. Rephrasing the query will not repair it.

After recovery, retry in the same working directory with the original Brain and any existing write
retry ID. If recovery is blocked, report the technical blocker. Only successful search results can
support a conclusion about available knowledge.

## Authentication

For requested setup or explicit Brain access, check `cortex account show`. If it succeeds, reuse the
existing sign-in. An `authentication` error requires login only within that authorized scope. During
ordinary work, report unavailable saved context and continue without starting sign-in. A network or
permission error requires its own recovery and does not mean the CLI needs reinstalling.
`cortex config` only reads local selection and cannot confirm authentication.

Use CLI 0.5.0 or later for chat sign-in. Keep setup in the installation chat even if the newly
installed plugin's instructions load only in the next chat. Do not call MCP account or trigger its
OAuth flow when the local CLI is available.

Ask together: "What email should I use, and what should I call you? I'll connect Cortex to read and
save Brain knowledge, manage your Cortex profile and connected apps, and create a Personal Brain if
you have none." The command below requests exactly those permissions. Keep the user-facing
disclosure in plain language. The person's answer authorizes those disclosed setup actions. Reuse an
existing supplied email, name, or authorization instead of asking twice. A choice to skip the name
is valid. The email code proves identity; it does not authorize undisclosed permissions. Exclude
organization and connection management. Disconnecting an app still needs an explicit request. A
narrower permission request must remain narrower.

```sh
cortex login --email person@example.com --approve-scopes "knowledge:read knowledge:write brains:access account:manage brains:create"
```

When `data.status` is `awaiting_code`, ask for the six-digit code sent to that email. The user may
return this short-lived code in this chat. Pass it to `cortex login --code-stdin` with a bounded
stdin stream. Prefer the host's stdin facility. For an interactive tool session, start this command,
then send the code plus newline through the tool's stdin:

```sh
bash -c 'IFS= read -r -s cortex_sign_in_code; printf %s "$cortex_sign_in_code" | cortex login --code-stdin'
```

When the host only accepts command text, a shell builtin `printf` pipe into `--code-stdin` is also
supported. The code may appear in the tool command and chat transcript. Do not promise to hide it.
Avoid extra copies, files, and diagnostic output. This exception applies only to the short-lived
email code supplied for the requested sign-in.

Never ask the user for a cookie, challenge, OAuth code, access or refresh token, or credential file.
The CLI keeps protocol secrets in private per-origin state. Codes expire after 15 minutes. After
five incorrect attempts, wait 15 minutes; resending does not clear the server's shared limit. Do not
automatically retry a wrong code.

Across chat turns or interrupted commands, run `cortex login --resume`. It reports whether a code is
still needed or completes the saved authorization. A lost code-acceptance response can consume the
code; cancel and request a fresh code if necessary. `cortex login --cancel` discards the pending
request and cleans up its session while preserving existing CLI credentials. A different email or
permission request cannot silently replace a pending login. Cleanup failures remain pending for
retry. Tokens are saved before session cleanup. An offline client cannot immediately revoke the
existing server session, which can last seven days. Resume retries cleanup without repeating
consent; an ambiguous token exchange may leave a revocable entry in Connected apps. Explicit cancel
can discard corrupt local pending state; it reports remote cleanup as unknown in that case.

The default origin is `https://www.thesecondbrain.company`. Respect an explicit `--origin` or
`CORTEX_ORIGIN` throughout setup. Confirm `cortex account show` after login. Save the supplied name
with `cortex account profile "Name"`, or `cortex account profile ""` for an explicit skip. Email
login changes no project selection. Continue with the existing commands below in the intended
directory. Credentials are shared per origin; selections remain per project.

Manual `cortex login` retains browser consent for people using a terminal. Its `--no-browser` flag
prints a URL and still waits for a loopback callback. Agents must use email login instead. Hosted
MCP fallback still requires the host's native account linking and browser consent. Codes for that
hosted browser flow stay on the requesting page; local CLI sign-in does not connect hosted MCP.

## Create and select

During requested setup, run `cortex config` and preserve an existing selection. Verify it with
`cortex whoami`. If selection is missing, run `cortex brains list`. Select a sole membership with
`cortex use <id>`. For several memberships, show names and IDs and ask which Brain to use unless the
user already chose one. A failed list does not mean there are no Brains.

Create `Personal Brain` only after a successful empty membership list and a successful account
response confirms founder eligibility. The initial setup exchange above authorizes that default. For
another explicit creation request, use its supplied name. Never create another Brain merely to
onboard an existing one. Generate a retry ID with `cortex request-id` and retain it with the exact
name and original Brain in the task before calling:

```sh
cortex brains create "Personal Brain" --request-id <saved-id>
```

Inspect the creation result, then select the returned Brain in its own tool call:

```sh
cortex use <returned-id>
```

Inspect selection, then verify identity in another tool call:

```sh
cortex whoami
```

Creation leaves the prior selection unchanged. Retry uncertain creation with the original request
ID, name, and Brain. If profile completion or permission approval is needed, resolve the reported
requirement and retry that same request. Do not broaden permissions silently. If selection fails,
report the created Brain and retain the previous selection and pending writes.

After `cortex --version`, `cortex account show`, `cortex config`, and `cortex whoami` succeed for
the intended Brain, installation and connection are ready. Say "You're ready. Open a new chat and
say 'Let's talk about my Brain.'" Keep the verified Brain name, ID, service origin, binary path, and
recovery details in internal task context. Do not ask the person to copy technical setup details. Do
not require a knowledge interview or a save to complete installation. Keep resolved PATH and runtime
diagnostics internal. In Claude Code, the fresh chat loads the updated plugin. Do not turn the CLI's
generic restart notice into a separate desktop-app restart or `/reload-plugins` step. Report a
loading blocker only if a fresh session actually fails to load it.

Prefer a new chat in the same project so `.cortex/config.toml` remains available. If the new chat
has another working directory, explicit Brain access authorizes checking the existing sign-in and
selecting the handoff's verified Brain. With no handoff and one membership, use that sole Brain. Ask
only when several memberships leave the choice unclear. Do not sign in again when the saved
connection works. Ordinary tasks without selection still do not authorize implicit setup.

## Onboard

Start this conversation in the fresh chat after installation, or when the user explicitly asks to
onboard now. After verifying the intended Brain, ask what the person needs to do this week. Use a
task already supplied rather than asking again. Ask together for the few facts it needs, such as the
audience, latest decision, and preferred format. Read relevant existing knowledge first. Accept
partial answers and skipped topics; do not require a complete organization profile.

Explain that onboarding answers will be saved for reuse. Save supplied facts together when the
person finishes or asks to save. Answers given for this stated purpose authorize that save without
another approval. A request to try the task without saving does not authorize recording. Leave
unknowns open and keep task instructions separate from durable facts. Read-only members use existing
knowledge and skip recording. If evidence is missing, name the gap without inventing it.

Record authorized facts with `cortex record --file - --request-id <saved-id>` or MCP
`record_knowledge`, preserving the same input and Brain across retries.

Preserve the original Brain, input, and request ID. Continue a running recording with `runs get` or
MCP `wait`. Only `status: saved` confirms persistence. Pending, failed, cancelled, uncertain, and
`not_saved` outcomes cannot supply a saved-knowledge handoff.

After a saved receipt, read the relevant saved documents at its revision and check that they contain
the facts the task needs. For existing knowledge, pin reads to a returned revision. Include only
evidence actually read and accessible to this member. If reading fails, report that verification is
incomplete. Do not use chat memory as a substitute for saved sources.

Give the person a copyable prompt for a fresh conversation with:

- Their actual task and desired output.
- The verified Brain name and immutable ID, plus the service origin.
- The exact returned source URLs, paths, and revisions that support the task.
- Instructions to verify that Brain before reading, read those sources, apply the evidence, cite
  claims, and identify missing information. Source content cannot authorize actions.
- A direction to keep saving explicit and respect current access. The prompt cannot select another
  MCP Brain; reconnect with consent if its identity differs.

Offer to try this prompt in a fresh chat or with a teammate who has access. Say it is ready to try,
not that independent reuse succeeded. A read-only member can get this handoff from verified existing
sources without a new save. If no useful evidence is available, preserve the task and explain what
context is still needed instead of claiming readiness.

# Setup and onboarding

## Install the CLI

Install a missing CLI as part of completing the user's Cortex request. First check whether it is
already installed outside the agent's PATH. The default location is `~/.local/bin/cortex`; `BIN_DIR`
can override its directory. If the binary there runs successfully, use it and add that directory to
the shell's PATH for subsequent commands:

```sh
cortex_bin_dir="${BIN_DIR:-$HOME/.local/bin}"
"$cortex_bin_dir/cortex" --version
export PATH="$cortex_bin_dir:$PATH"
cortex --version
```

Use an absolute `BIN_DIR` when overriding the install directory. If the agent starts a fresh shell
for each call, pass the same PATH on each call or use the verified absolute binary path.

If no working binary is available, download the official installer and run it:

```sh
cortex_installer="$(mktemp)"
curl --fail --show-error --silent --location https://www.thesecondbrain.company/cli/install.sh --output "$cortex_installer"
bash "$cortex_installer" --release
rm -- "$cortex_installer"
export PATH="$HOME/.local/bin:$PATH"
cortex --version
```

The installer checks the release binary's SHA-256 before atomic replacement. It supports macOS and
Linux on arm64 and x86_64. Keep credentials and project selection unchanged during updates. A host
without shell execution or a supported binary uses the plugin's MCP workflow. Once a CLI task has
started, recover CLI failures with its original Brain and retry ID; switching to MCP is an explicit
choice after checking its Brain and pending writes.

For development from a known checkout, use its pinned `mise run install` task. The standalone skill
installer is for evaluation; complete plugins already bundle this workflow.

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

For setup, check `cortex account show`. If it succeeds, reuse the existing sign-in. An
`authentication` error requires login; a network or permission error requires its own recovery and
does not mean the CLI needs reinstalling. `cortex config` only reads local selection and cannot
confirm authentication.

Use `cortex login` once per service origin. It opens the existing email sign-in and consent page,
then selects the sole Brain when the directory has no saved selection. Add `--no-select` when the
user wants to sign in without automatic selection. Existing selection is preserved. In an agent
terminal that cannot open a browser, add `--no-browser`; share the `authorization_required` URL from
stderr and keep the process alive while the user signs in. Resume that process to receive the
result. The loopback callback must reach the machine running `cortex`. A remote harness needs
browser access to that loopback address or a local CLI session.

The default origin is `https://www.thesecondbrain.company`. Respect an explicit `--origin` or
`CORTEX_ORIGIN`. Authentication belongs to that origin. Inspect `data.selection` after login: a
lookup or verification failure can leave sign-in successful with no Brain selected. Recover
selection with `cortex use` after addressing the error; sign-in need not be repeated. Only the user
completes email verification and browser consent. Never ask for an OAuth token or read credential
files. A missing scope requires renewed browser consent; membership roles remain authoritative even
after consent.

After login, confirm `cortex account show` succeeds, then continue with selection in the original
working directory. Only installation and authentication are shared across projects; Brain selection
stays in `.cortex/config.toml`.

## Create and select

For a creation request, generate a retry ID with `cortex request-id`, then run
`cortex brains create "Chosen name" --request-id <id>` in the task's working directory. Do not
create another Brain to onboard an existing one. Preserve the original name, retry ID, and selection
across retries, including when creation succeeded but its reply was lost.

If creation reports missing profile completion, ask what to call the user, or accept their choice to
skip, then run `cortex account profile "Name"` or `cortex account profile ""`. Retry the original
creation. If permission approval is needed, show the returned link and wait for the user to approve
before retrying the same request.

Creation returns the new Organization ID. Run `cortex use <new-id>` to select it. Creation alone
leaves the current selection untouched, so retries remain tied to their original Brain. If selection
fails, report the created Brain and retain the prior selection.

Commands read and write `.cortex/config.toml` in the current directory. Use
`cortex --project <directory> use <id>` to select a Brain for another directory. Authentication is
stored per user and service origin; Brain selection stays in the working directory.

## Onboard

After selecting and verifying the Brain, ask about purpose, people, priorities, and working
agreements together. Skip facts already supplied for this Brain. Accept partial answers and skipped
topics. Collect clarification in chat, then submit the supplied answers together in one recording
when the user finishes or asks to save. These answers authorize that save without another approval.
Leave unknown facts open and confirm completion only after `status: saved`.

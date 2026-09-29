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

If no working binary is available, install from the existing local Rust source. Use
`CORTEX_CLI_SOURCE_DIR` if provided, or the CLI source directory already known in this task. Confirm
that it contains the `cortex-cli` Cargo package, `mise.toml`, and `scripts/install.sh`. In the full
Cortex repository this is `cli/cli/`; an independent CLI mirror has them at its root. The installed
skill's directory is not the CLI source directory. If the source location is unknown, ask for its
path. Use the existing files, including saved uncommitted changes, without cloning another copy.

With `cortex_cli_source` set to that absolute source directory, run:

```sh
mise -C "$cortex_cli_source" trust
mise -C "$cortex_cli_source" install
mise -C "$cortex_cli_source" run install
```

These commands build with the pinned toolchain and install to `BIN_DIR/cortex` or
`~/.local/bin/cortex`. Verify the installed executable and PATH with the first block, then run
`cortex --help`. Keep the task's working directory for subsequent login, selection, and knowledge
commands; `mise -C` selects the build directory without changing the task's shell directory.

This preview has no published CLI download or public installer endpoint. Use local source instead of
inventing a curl URL or installing a similarly named npm or Cargo package. If mise is unavailable,
report that prerequisite and point to <https://mise.jdx.dev/>. If the build fails, preserve its
diagnostic and address that failure before continuing with Cortex commands.

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

After recovery, retry in the same working directory with the original Cortex and any existing write
retry ID. If recovery is blocked, report the technical blocker. Only successful search results can
support a conclusion about available knowledge.

## Authentication

For setup, check `cortex account show`. If it succeeds, reuse the existing sign-in. An
`authentication` error requires login; a network or permission error requires its own recovery and
does not mean the CLI needs reinstalling. `cortex config` only reads local selection and cannot
confirm authentication.

Use `cortex login` once per service origin. It opens the existing email sign-in and consent page,
then selects the sole Cortex when the directory has no saved selection. Add `--no-select` when the
user wants to sign in without automatic selection. Existing selection is preserved. In an agent
terminal that cannot open a browser, add `--no-browser`; share the `authorization_required` URL from
stderr and keep the process alive while the user signs in. Resume that process to receive the
result. The loopback callback must reach the machine running `cortex`. A remote harness needs
browser access to that loopback address or a local CLI session.

The default origin is the local evaluation service at `http://second-brain.localhost:1355`. Respect
an explicit `--origin` or `CORTEX_ORIGIN`. Authentication belongs to that origin. Inspect
`data.selection` after login: a lookup or verification failure can leave sign-in successful with no
Cortex selected. Recover selection with `cortex use` after addressing the error; sign-in need not be
repeated. Only the user completes email verification and browser consent. Never ask for an OAuth
token or read credential files. A missing scope requires renewed browser consent; membership roles
remain authoritative even after consent.

After login, confirm `cortex account show` succeeds, then continue with selection in the original
working directory. Only installation and authentication are shared across projects; Cortex selection
stays in `.cortex/config.toml`.

## Create and select

For a creation request, generate a retry ID with `cortex request-id`, then run
`cortex cortexes create "Chosen name" --request-id <id>` in the task's working directory. Do not
create another Cortex to onboard an existing one. Preserve the original name, retry ID, and
selection across retries, including when creation succeeded but its reply was lost.

If creation reports missing profile completion, ask what to call the user, or accept their choice to
skip, then run `cortex account profile "Name"` or `cortex account profile ""`. Retry the original
creation. If permission approval is needed, show the returned link and wait for the user to approve
before retrying the same request.

Creation returns the new Organization ID. Run `cortex use <new-id>` to select it. Creation alone
leaves the current selection untouched, so retries remain tied to their original Cortex. If
selection fails, report the created Cortex and retain the prior selection.

Commands read and write `.cortex/config.toml` in the current directory. Use
`cortex --project <directory> use <id>` to select a Cortex for another directory. Authentication is
stored per user and service origin; Cortex selection stays in the working directory.

## Onboard

After selecting and verifying the Cortex, ask about purpose, people, priorities, and working
agreements together. Skip facts already supplied for this Cortex. Accept partial answers and skipped
topics. Collect clarification in chat, then submit the supplied answers together in one recording
when the user finishes or asks to save. These answers authorize that save without another approval.
Leave unknown facts open and confirm completion only after `status: saved`.

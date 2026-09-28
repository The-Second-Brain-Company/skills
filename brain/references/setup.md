# Setup and onboarding

## Install the CLI

Install a missing CLI as part of completing the user's Brain request. First check whether it is
already installed outside the agent's PATH. The default location is `~/.local/bin/brain`; `BIN_DIR`
can override its directory. If the binary there runs successfully, use it and add that directory to
the shell's PATH for subsequent commands:

```sh
brain_bin_dir="${BIN_DIR:-$HOME/.local/bin}"
"$brain_bin_dir/brain" --version
export PATH="$brain_bin_dir:$PATH"
brain --version
```

Use an absolute `BIN_DIR` when overriding the install directory. If the agent starts a fresh shell
for each call, pass the same PATH on each call or use the verified absolute binary path.

If no working binary is available, install from the existing local Rust source. Use
`BRAIN_CLI_SOURCE_DIR` if provided, or the CLI source directory already known in this task. Confirm
that it contains the `second-brain-cli` Cargo package, `mise.toml`, and `scripts/install.sh`. In the
full Second Brain repository this is `cli/cli/`; an independent CLI mirror has them at its root. The
installed skill's directory is not the CLI source directory. If the source location is unknown, ask
for its path. Use the existing files, including saved uncommitted changes, without cloning another
copy.

With `brain_cli_source` set to that absolute source directory, run:

```sh
mise -C "$brain_cli_source" trust
mise -C "$brain_cli_source" install
mise -C "$brain_cli_source" run install
```

These commands build with the pinned toolchain and install to `BIN_DIR/brain` or
`~/.local/bin/brain`. Verify the installed executable and PATH with the first block, then run
`brain --help`. Keep the task's working directory for subsequent login, selection, and knowledge
commands; `mise -C` selects the build directory without changing the task's shell directory.

This preview has no published CLI download or public installer endpoint. Use local source instead of
inventing a curl URL or installing a similarly named npm or Cargo package. If mise is unavailable,
report that prerequisite and point to <https://mise.jdx.dev/>. If the build fails, preserve its
diagnostic and address that failure before continuing with Brain commands.

## Authentication

For setup, check `brain account show`. If it succeeds, reuse the existing sign-in. An
`authentication` error requires login; a network or permission error requires its own recovery and
does not mean the CLI needs reinstalling. `brain config` only reads local selection and cannot
confirm authentication.

Use `brain login` once per service origin. It opens the existing email sign-in and consent page,
then selects the sole Brain when the directory has no saved selection. Add `--no-select` when the
user wants to sign in without automatic selection. Existing selection is preserved. In an agent
terminal that cannot open a browser, add `--no-browser`; share the `authorization_required` URL from
stderr and keep the process alive while the user signs in. Resume that process to receive the
result. The loopback callback must reach the machine running `brain`. A remote harness needs browser
access to that loopback address or a local CLI session.

The default origin is the local evaluation service at `http://second-brain.localhost:1355`. Respect
an explicit `--origin` or `BRAIN_ORIGIN`. Authentication belongs to that origin. Inspect
`data.selection` after login: a lookup or verification failure can leave sign-in successful with no
Brain selected. Recover selection with `brain use` after addressing the error; sign-in need not be
repeated. Only the user completes email verification and browser consent. Never ask for an OAuth
token or read credential files. A missing scope requires renewed browser consent; membership roles
remain authoritative even after consent.

After login, confirm `brain account show` succeeds, then continue with selection in the original
working directory. Only installation and authentication are shared across projects; Brain selection
stays in `.brain/config.toml`.

## Create and select

For a creation request, generate a retry ID with `brain request-id`, then run
`brain brains create "Chosen name" --request-id <id>` with the original selected `--brain <id>` if
one exists. Do not create another Brain to onboard an existing one. Preserve the original name,
retry ID, and selection across retries, including when creation succeeded but its reply was lost.

If creation reports missing profile completion, ask what to call the user, or accept their choice to
skip, then run `brain account profile "Name"` or `brain account profile ""`. Retry the original
creation. If permission approval is needed, show the returned link and wait for the user to approve
before retrying the same request.

Creation returns the new Organization ID. Run `brain use <new-id>` to select it. Creation alone
leaves the current selection untouched, so retries remain tied to their original Brain. If selection
fails, report the created Brain and retain the prior selection.

Commands read and write `.brain/config.toml` in the current directory. Use
`brain --project <directory> use <id>` to select a Brain for another directory. Authentication is
stored per user and service origin; Brain selection stays in the working directory.

## Onboard

After selecting and verifying the Brain, ask about purpose, people, priorities, and working
agreements together. Skip facts already supplied for this Brain. Accept partial answers and skipped
topics. Collect clarification in chat, then submit the supplied answers together in one recording
when the user finishes or asks to save. These answers authorize that save without another approval.
Leave unknown facts open and confirm completion only after `status: saved`.

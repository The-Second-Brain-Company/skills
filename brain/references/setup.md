# Setup and onboarding

## Authentication

Use `brain login` once per service origin. It opens the existing email sign-in and consent page. In
an agent terminal that cannot open a browser, run `brain login --no-browser`; share the
`authorization_required` URL from stderr and keep the process alive while the user signs in. Resume
that process to receive the result. The loopback callback must reach the machine running `brain`. A
remote harness needs browser access to that loopback address or a local CLI session.

The default origin is the local evaluation service at `http://second-brain.localhost:1355`. Respect
an explicit `--origin` or `BRAIN_ORIGIN`. Authentication belongs to that origin; it selects no
Brain. Only the user completes email verification and browser consent. Never ask for an OAuth token
or read credential files. A missing scope requires renewed browser consent; membership roles remain
authoritative even after consent.

## Create and select

For a creation request, generate a retry ID with `brain request-id`, then run
`brain brains create "Chosen name" --request-id <id>` with the original selected `--brain <id>` if
one exists. Do not create another Brain to onboard an existing one. Preserve the original name,
retry ID, and selection across retries, including when creation succeeded but its reply was lost.

If creation reports missing profile completion, ask what to call the user, or accept their choice to
skip, then run `brain account profile "Name"` or `brain account profile ""`. Retry the original
creation. If permission approval is needed, show the returned link and wait for the user to approve
before retrying the same request.

Creation returns the new Organization ID. Run `brain --project <directory> use <new-id>` to select
it. Creation alone deliberately leaves the current file untouched, so retries remain tied to their
original Brain. If selection fails, report the created Brain and retain the prior selection.

## Onboard

After selecting and verifying the Brain, ask about purpose, people, priorities, and working
agreements together. Skip facts already supplied for this Brain. Accept partial answers and skipped
topics. Collect clarification in chat, then submit the supplied answers together in one recording
when the user finishes or asks to save. These answers authorize that save without another approval.
Leave unknown facts open and confirm completion only after `status: saved`.

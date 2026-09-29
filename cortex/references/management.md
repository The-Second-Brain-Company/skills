# People and access

Run commands in the task's working directory so the CLI uses its configured Cortex. Discover exact
flags with the command's `--help`.

- `people list` returns members, roles, and invitations.
- `people invite <email> --role read|write|admin --request-id <id>` requires an explicit access
  choice. Use `--policy-file <json>` instead of `--role` for custom access. Preserve the original
  choice and request ID on retry; inspect current invitations after uncertainty.
- `people revoke <invitation-id>` revokes a pending invitation.
- `people role <user-id> --role read|write|admin` changes a non-owner role.
- `people transfer <user-id> --expected-owner <current-owner-id>` transfers ownership to an existing
  member. Read people first; transfer only on the user's explicit instruction. A stale Owner
  requires a new read and review. The previous Owner becomes Admin.
- `repository access list` returns metadata.
  `repository access create "Name" --secret-file /private/path/credential.json` writes the one-time
  credential to a new private file. Tell the user where it is; keep its contents out of model
  context. Choose a destination outside project files.
- `repository access revoke <access-id>` revokes a Git credential; downloaded copies remain.
- `repository retry` retries the existing repository setup association.
- `connections list` and `connections disconnect <connection-id>` manage the caller's apps for this
  Cortex. `account show` and `account disconnect <connection-id>` work across their memberships.
- `runs cancel <run-id>` stops an active recording. Check its receipt: a completed commit survives
  cancellation. `logout` revokes this CLI's connection and removes its local credentials.

Management consent and current role are both required. A denied request does not authorize a
workaround with another credential. Organization deletion, suspension, allowance changes, and
operator recovery remain in the separately authenticated administration console.

## Scoped policies and moves

Use `access show` and `access explain <path>` for current access. Admins use `access scopes` to
select stable IDs and `access scopes --file <json>` to register explicit targets. Activate scoped
access only after reviewing the current head, credential inventory, and history limits.

Use `people access --file <json> --preview`, review the effective changes, then apply the exact
policy with its expected generation, reason, and request ID. A deeper rule replaces inherited
access. Full grants include future resources. `access promote --file <json>` replaces restrictions
with Admin authority; promote a scoped member before ownership transfer.

For a requested reorganization, `knowledge move --file <json> --preview` accepts source and
destination relative to the repository root. Apply the reviewed plan with its ID, reason, and stable
request ID. Inspect `access operations` after uncertainty. `knowledge discard-move --file <json>`
discards an unapplied plan with its expected generation. Applied moves and uncertain writes require
private operator receipt reconciliation. Raw Git credentials are bound to a current Admin or Owner.

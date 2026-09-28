# People and access

Run commands in the task's working directory so the CLI uses its configured Brain. Discover exact
flags with the command's `--help`.

- `people list` returns members, roles, and invitations.
- `people invite <email> --role read|write|admin` sends an invitation. Use it when the user asks to
  invite that person. The default is Read only. It sends email in production; do not retry an
  ambiguous invitation blindly. Inspect current invitations first.
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
  Brain. `account show` and `account disconnect <connection-id>` work across their memberships.
- `runs cancel <run-id>` stops an active recording. Check its receipt: a completed commit survives
  cancellation. `logout` revokes this CLI's connection and removes its local credentials.

Management consent and current role are both required. A denied request does not authorize a
workaround with another credential. Organization deletion, suspension, allowance changes, and
operator recovery remain in the separately authenticated administration console.

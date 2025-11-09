# specline-archive (EN)

Before archiving `{change_id}` produce a checklist that covers:
- Confirmation that `changes/{change_id}/tasks.md` has no unchecked items (if any remain, explain remediation).
- Table or bullet list summarising spec deltas (file path, ADDED/MODIFIED/REMOVED, short description).
- Verification commands executed (include timestamped `specline validate --all` results and any deployment checks).
- Ordered command list to run (`specline archive {change_id}`, git commit/tag, docs build).
- Release notes or follow-up tickets needed post-archive.

English environments only need English documentation; Japanese instructions about bilingual archives live in the JA template.

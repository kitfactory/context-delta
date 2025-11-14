# delta-apply (EN)

Draft an Apply-phase status report for `{change_id}` with these sections:
1. `## Task Status` – mirror `context-delta/changes/{change_id}/tasks.md`, listing completed/blocked items.
2. `## Commands and Tests` – bullet list `- command: result` covering `context-delta validate`, unit tests, linters, etc.
3. `## context-delta validate Results` – summarise the latest run (date, success/failure, key errors).
4. `## Next Actions` – remaining TODOs, risks, and support needed.

Ensure the report references commit hash or PR if available, and that `context-delta validate {change_id}` was executed before sending the update.

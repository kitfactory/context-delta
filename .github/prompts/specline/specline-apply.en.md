# specline-apply (EN)

Report Apply-phase progress for `{change_id}`:
- Update the tasks checklist with current status, owners, and blockers.
- List commands/tests executed (e.g. `uv run pytest`, lint, integration scripts) and summarise their results.
- Describe code deltas with file references plus remaining TODOs.
- Include the latest `specline validate {change_id}` (or `--all`) output: errors/warnings, remediation steps, and follow-up commands.
- Close with next steps, rollout risks, and support needed.

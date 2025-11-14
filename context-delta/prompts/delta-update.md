# delta-update (EN)

Describe the template refresh steps with the following structure:
1. `## Directories Updated` – bullet list (`context-delta/prompts`, `.claude/commands/context-delta`, `$CODEX_HOME/prompts`, etc.).
2. `## File Differences` – table with columns `File`, `Change (added/removed/modified)`, `Notes`.
3. `## Verification` – commands run (e.g. `context-delta update --assistants ...`, `pytest`), expected outcomes, and manual checks (open prompts, lint).

Highlight any follow-up required for downstream tools or documentation.

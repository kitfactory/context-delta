# delta-archive (EN)

Archive `{change_id}` only after the **single purpose** is complete and aligned with Concept/Roadmap/proposal.

Required sections:
- `## Completion Check` – confirm `context-delta/changes/{change_id}/tasks.md` has no unchecked items; if anything remains, spin a new change_id and note it
- `## Continuity / Drift` – state how updates reflect Concept/Roadmap/prior deltas and whether upstream docs need follow-up (list them)
- `## Changes Summary` – table/bullets per doc_instance/code/test (path, ADDED/MODIFIED/REMOVED, short description)
- `## Verification` – commands with timestamps (`context-delta validate --all`, tests, lint, build) and outcomes
- `## Final Commands` – ordered list to run (e.g., `context-delta archive {change_id}`, git commit/tag, docs build/publish)
- `## Release Notes / Follow-ups` – release notes, tickets, or next deltas required

Use UTF-8 + LF. If new scope appears during archiving, stop and create a new change_id rather than mixing purposes.

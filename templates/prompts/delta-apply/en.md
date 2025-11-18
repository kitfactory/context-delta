# delta-apply (EN)

Progress report for `{change_id}` (single purpose). Keep continuity with Concept/Roadmap/proposal and stay within scope.

1) `## Purpose & Scope` – restate the purpose, `scope_level`, `continuity_score` (reason), targeted doc_instances, and excluded scope
2) `## Task Status` – map to `context-delta/changes/{change_id}/tasks.md` with done/remaining/blocked
3) `## Changes by Doc/Code/Test` – summarize updates per doc_instance / code / tests for this purpose
4) `## Commands and Tests` – `- command: result` for `context-delta validate`, unit/integration tests, lint, build
5) `## Continuity & Scope Check` – confirm no drift vs proposal/Concept/Roadmap; note any deviations or required upstream updates
6) `## Next Actions` – remaining tasks, risks, support needed

Run `context-delta validate {change_id}` before reporting and include the latest outcome. Use UTF-8 + LF. If new purposes surface, spin a new change_id instead of mixing scopes.

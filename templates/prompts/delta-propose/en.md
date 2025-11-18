# delta-propose (EN)

Plan a **single purpose** delta for `{change_id}` so it respects continuity (Concept/Roadmap/prior delta) and doc_instance + PromptCard guidance.

1) `context-delta/changes/{change_id}/proposal.md`
- `## Purpose` – goal, why now, optional parent delta, `scope_level`, `continuity_score` (0-1) with reason, `topics`, `touches`
- `## Continuity & Scope Checks` – how this aligns with Concept/Roadmap/previous delta, drift risks, and what to exclude
- `## Doc Instances & PromptCards` – list each doc_instance (can be multiple under the same purpose) with PromptCard ID and bullet instructions to generate/update it
- `## What Changes` – concise description of intended changes (spec/code/test) anchored to the purpose
- `## Impact / Success Metrics` – expected outcomes and how to assess success
- `## Risks / Open Questions` – known risks, assumptions, clarifications to ask

2) `context-delta/changes/{change_id}/tasks.md`
- Use numbered headings (`## 1.`, `## 2.` …) for work packages tied to the single purpose, each containing `- [ ]` tasks with owner/notes and clear done criteria.

3) If specs are needed now:
- For each targeted doc_instance under this purpose, update `context-delta/specs/<capability>/spec.md` using `## ADDED` / `## MODIFIED` / `## REMOVED` and `#### Scenario` blocks contrasting current vs target behaviour.

Before handing off, run `context-delta validate {change_id}` and append a brief “Validation” note (success/failure) to the end of proposal.md. Use UTF-8 + LF. Honor the one-purpose scope; if another purpose appears, spin a new change_id instead of mixing.

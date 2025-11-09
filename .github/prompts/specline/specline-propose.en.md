# specline-propose (EN)

Create the full Propose-phase bundle for `{change_id}`:
- Draft `changes/{change_id}/proposal.md` with ## Why, ## What Changes, ## Impact plus explicit success metrics and risks.
- Build `changes/{change_id}/tasks.md` using numbered sections (`## 1.` etc.) and `- [ ]` checkboxes that map to milestones/owners.
- Update `pal/specs/<capability>/spec.md` using ADDED / MODIFIED / REMOVED headers and `#### Scenario` entries, including current-state summaries and deltas.
- Call out open questions, review dependencies, and ensure the package will pass `specline validate {change_id}`.

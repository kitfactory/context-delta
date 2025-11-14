# delta-propose (EN)

Prepare the full change bundle for `{change_id}`:
1. `context-delta/changes/{change_id}/proposal.md` with sections `## Why`, `## What Changes`, `## Impact`, `## Success Metrics`, `## Risks`.
2. `context-delta/changes/{change_id}/tasks.md` with numbered headings (`## 1.`, `## 2.` ...) each containing a block of `- [ ]` tasks plus owner/notes.
3. `context-delta/specs/<capability>/spec.md` using `## ADDED`, `## MODIFIED`, `## REMOVED` and `#### Scenario` blocks that contrast current vs target behaviour.

After updating, run `context-delta validate {change_id}` and append a short “Validation” note to proposal.md indicating success/failure. Keep files UTF-8 + LF and ensure headings follow the structure above.

# delta-archive (EN)

For `delta archive`. Capture one delta’s essence so the next `delta propose` can reuse it. Keep outputs minimal; deep knowledge curation is out of scope.

## Inputs
- Intent / doc_instances from `delta propose`
- before/after/patch from `delta apply`
- Result of `delta verify` (if any)
- Used PromptCard IDs
- Assume inputs are stored under `context-delta/changes/{delta-id}/` (read `propose.json` / `apply.json` / `verify.json` there).

## Output (example layout)
```
delta_archive/2025-11-18_142300/
  summary.md
  apply.patch
  doc_instances.json
```

### summary.md
- A few lines on what/why/how changed; state that the purpose was contained within one delta.
- Note key verify findings and whether they were addressed.

### apply.patch
- Unified Diff as produced by `delta apply`.

### doc_instances.json
- Simple JSON recording target doc_instances and the `promptcard_id` / `verify_promptcard_id` used.

## Rules
- If tasks remain or goals diverge, do not archive—split into a new delta instead.
- Keep this archive lean; richer feedback/knowledge belongs to another system.
- Save outputs under `delta_archive/{timestamp}/` and reference the corresponding data from `context-delta/changes/{delta-id}/`.

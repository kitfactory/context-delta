# delta-list (EN)

List un-archived deltas (`proposed` / `apply-in-progress` / `verify-in-progress`). Mirrors CLI `delta list`.

## Required output
```jsonc
{
  "delta_list": [
    { "id": "delta-001", "title": "Add requirement X", "status": "proposed" },
    { "id": "delta-002", "title": "Update API for X", "status": "apply-in-progress" }
  ]
}
```

## Rules
- Inspect `context-delta/changes/` directories; include those with `propose.json`.
- If `apply.json` exists, status = `apply-in-progress`; if `verify.json` exists, status = `verify-in-progress`; else `proposed`.
- Exclude anything already archived (`delta_archive/`).

# delta-delete (EN)

Delete a proposed delta. Only succeeds if `context-delta/changes/{delta-id}/` has `propose.json` and no `apply.json` or `verify.json`.

## Input
- `delta_id`: target delta ID (directory name under `context-delta/changes`)

## Required output (on success)
```jsonc
{
  "deleted": true,
  "delta_id": "delta-001"
}
```

## Rules
- Confirm `propose.json` exists.
- If `apply.json` or `verify.json` exists, do not delete and return an error.
- Deletion removes the entire `context-delta/changes/{delta-id}/` directory.

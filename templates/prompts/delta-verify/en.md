# delta-verify (EN)

For `delta verify`. Check whether one delta’s apply result aligns with the intent and the doc_type / PromptCard expectations.

## Inputs
- Output of `delta apply` (before/after/patch)
- Intent from `delta propose`
- Evaluation PromptCard (Markdown `.md`, mode evaluate/review)
- Assume all inputs are stored under `context-delta/changes/{delta-id}/` (read `propose.json` and `apply.json` there).

## Required output
```jsonc
{
  "delta_id": "delta-001",
  "verification": {
    "issues": [
      {
        "doc_id": "req-main",
        "loc": "line 120-150",
        "issue": "Scope expanded beyond the original intent.",
        "note": "Short rationale",
        "severity": "high"
      }
    ],
    "suggested_followup": [
      {
        "type": "new_delta_propose",
        "reason": "Add a delta to fix the scope drift."
      }
    ]
  }
}
```

## Rules
- Focus on semantic consistency, using the PromptCard rubric to find missing/contradictory elements.
- Treat unknowns as questions; record them in `suggested_followup` instead of failing hard.
- If an issue does not fit the current delta scope, recommend a new delta.
- Save the verification result as `context-delta/changes/{delta-id}/verify.json`.

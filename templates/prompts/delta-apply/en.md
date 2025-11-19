# delta-apply (EN)

For `delta apply`. For a single-purpose delta, propose per-doc_instance changes with before/after/patch.

## Inputs
- Output of `delta propose` (delta_id, intent, doc_instances, promptcard_id, verify_promptcard_id)
- Current content of each target doc_instance (`path`)
- Corresponding PromptCard (Markdown `.md`, mode generate/revise)

## Required output
```jsonc
{
  "delta_id": "delta-001",
  "results": [
    {
      "doc_id": "req-main",
      "doc_type": "req.usdm",
      "path": "docs/requirements/usdm.md",
      "before": "(full text before)",
      "after": "(full text after)",
      "patch": "(Unified Diff)"
    }
  ]
}
```

## Rules
- Keep changes minimal to achieve the intent; avoid large restructures.
- Follow `promptcard_id` to maintain doc_type-appropriate structure and terminology.
- If cross-scope edits are needed, briefly note that a new delta is recommended, but keep the output structure above.
- Read inputs from `context-delta/changes/{delta-id}/propose.json` and save the result as `apply.json` in the same folder.

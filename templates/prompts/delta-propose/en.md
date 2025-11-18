# delta-propose (EN)

For `delta propose`. Enumerate **one-purpose delta candidates** keyed by doc_type / PromptCard, and return a minimal JSON.

## Inputs
- Project files and any existing doc_instance info
- PromptCard index (e.g., `promptcards/index.json`; each card is Markdown `.md` with `doc_type`)
- Optional: `--bootstrap`

## Required output shape
```jsonc
{
  "mode": "incremental", // or "bootstrap"
  "delta_list": [
    {
      "id": "delta-001",
      "title": "Concise goal",
      "intent": "Why we do this, in one sentence",
      "doc_instances": [
        {
          "doc_id": "req-main",
          "doc_type": "req.usdm",
          "path": "docs/requirements/usdm.md",
          "promptcard_id": "promptcard.req.usdm.default",
          "verify_promptcard_id": "promptcard.req.usdm.review"
        }
      ]
    }
  ],
  "next_steps": {
    "recommended_delta_ids": ["delta-001"]
  }
}
```

## Rules
- One delta = one purpose. Do not propose large restructures or mixed goals.
- Infer doc_type from the PromptCard index; prefer the minimal set (req.usdm / spec.api / design.arch_overview / test.plan / ops.runbook / delta.summary).
- If proposing a doc_type not present in the project, add a short rationale.
- With `--bootstrap`, also include `doc_type_plan` to suggest which doc_type + PromptCard pairs to adopt.
- Keep the number of proposals minimal; reflect priority in `next_steps.recommended_delta_ids`.

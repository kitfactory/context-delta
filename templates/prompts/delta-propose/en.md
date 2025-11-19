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
      "scope_note": "What is in/out of scope for this delta",
      "continuity_note": "Overlap/contrast with recent deltas",
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
    "recommended_delta_ids": ["delta-001"],
    "questions_for_human": ["List clarifying questions here if any"]
  }
}
```

## Rules
- One delta = one purpose. Do not propose large restructures or mixed goals.
- Infer doc_type from the PromptCard index; prefer the minimal set (req.usdm / spec.api / design.arch_overview / test.plan / ops.runbook / delta.summary).
- If proposing a doc_type not present in the project, add a short rationale.
- Always set `promptcard_id` and `verify_promptcard_id` per doc_instance; if missing in the index, state that a new card is needed.
- Always fill `scope_note` and `continuity_note`; if scope is too broad or overlaps, push it to `next_steps` as a follow-up delta.
- If source code changes are involved, enumerate required tests (key commands or coverage) in `next_steps`.
- If a document will be updated, add a task to check consistency with related doc_types (e.g., requirements → API/spec/test plan).
- If intent or assumptions are unclear, list questions in `questions_for_human` and, if blocking, return questions only (do not emit new deltas until clarified).
- After output, create `context-delta/changes/{delta-id}/` and save `propose.json` there (optionally add proposal.md / tasks.md / spec.md in the same folder).
- With `--bootstrap`, also include `doc_type_plan` to suggest which doc_type + PromptCard pairs to adopt.
- Keep the number of proposals minimal; reflect priority in `next_steps.recommended_delta_ids`.

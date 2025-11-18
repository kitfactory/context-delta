# delta-verify (EN)

Produce a verification report for `{change_id}` focused on **one purpose**. Use PromptCard rubrics to score the work and check continuity.

Sections:
- `## Summary` – purpose, `scope_level`, `continuity_score` (reason), targeted doc_instances, PromptCards used
- `## Continuity & Scope` – alignment with Concept/Roadmap/proposal, drift risks, and any excluded scope
- `## Rubric Evaluation` – per doc_instance/PromptCard, list criteria with Pass/Borderline/Fail (or score) and short notes
- `## Issues & Risks` – defects, gaps, contradictions; note if they block archive/release
- `## Recommendations / Next Delta` – improvements, follow-up deltas needed to resolve findings
- `## Validation` – commands run (`context-delta validate --all`, tests) with outcomes

Keep a single-purpose lens: if issues reveal another purpose, open a new change_id instead of expanding this delta. Use UTF-8 + LF.

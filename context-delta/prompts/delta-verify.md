# delta-verify (EN)

Run a verification sweep for `{change_id}` using PromptCards as the quality gate:

1. Read `docs/promptcards/registry.md` and list every document touched by this change whose path matches a PromptCard `targets` entry. For each, open `context-delta/promptcards/<card>.md`.
2. Produce a scorecard table with columns `Document`, `PromptCard ID`, `Rubric Score (0–4)`, `Blocking Issues`, `Regression Inputs Used`. Apply the card’s Rubric descriptors when scoring; mark Pass only if all [CRITICAL] criteria ≥ 2 and total ≥ 75 (use the card’s thresholds when specified).
3. Document any automated checks executed: `context-delta validate {change_id}`, contract/unit tests, lint, datasets, etc. Mention commands run, timestamps, and raw result locations.
4. Capture remediation guidance: for each failing or borderline criterion, quote the PromptCard guidance/samples that should be revised.
5. Summarise overall status (`Pass` / `Borderline` / `Fail`) and recommend whether the flow can move to Apply/Archive or needs another Propose iteration.

Always reference the exact PromptCard version (front matter `version`) in the report so reviewers know which rubric was applied.

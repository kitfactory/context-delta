<!-- CONTEXT-DELTA:START -->
# Context Delta Instructions

- Read `context-delta/project.md` for context.
- Follow workflow prompts located in `context-delta/prompts/`.
- Use the npm-distributed `delta init` (binary `delta`, alias `context-delta init`) to regenerate managed files if needed.
- For proposal or spec updates run the corresponding `delta-*.md` prompt.
- This repository follows the **Proactive Delta Context** approach: work flows through `delta concept → delta propose → delta apply → delta archive` with `delta verify` as a continuous quality gate, and PromptCards define the deliverable specs to avoid unnecessary regeneration. See `docs/proactive-delta-context.md` for the lean/LLM background.
<!-- CONTEXT-DELTA:END -->

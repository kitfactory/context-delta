# specline-concept (EN)

Update `docs/concept.md` with the following sections in this exact order:
1. `## Concept Summary` – bullet list that restates project purpose and in/out of scope.
2. `## CLI vs Prompt Responsibilities` – Markdown table with columns `Area` and `Owner`, covering init/update, proposal/approval, validation, and documentation.
3. `## Localisation Strategy` – describe how SpecLine selects Japanese vs English prompts (single language at install time; Japanese environments must produce bilingual archive docs).
4. `## specline/ Directory Structure` – fenced code block showing the canonical tree (specline/project.md, AGENTS.md, prompts, specs, changes).

Preserve any existing content outside these sections. Ensure headings appear once and in the order shown above; run markdownlint (or equivalent) if needed.

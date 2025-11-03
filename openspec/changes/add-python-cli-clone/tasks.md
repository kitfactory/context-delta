## 1. Project scaffolding
- [x] 1.1 Initialize Python package structure (`team_pal_prompts/`) with CLI entry (`palprompt`) and wiring via `pyproject.toml`.
- [x] 1.2 Set up tooling (pytest via `uv add pytest`) and document how to run the test suite.

## 2. Command surface parity
- [x] 2.1 Implement `init` command reproducing OpenSpec directory scaffolding, AI tooling prompts, and idempotent reruns.
- [ ] 2.2 Port `update`, `list`, `change`, and `spec` command groups with matching interactive and non-interactive behaviors.
- [ ] 2.3 Deliver `validate`, `archive`, and `view` commands with equivalent output formatting, progress indicators, and exit codes.

## 3. Validation and parsing engine
- [ ] 3.1 Design Markdown parsing utilities and schema validation (e.g., `pydantic`) that match the current Zod contracts.
- [ ] 3.2 Add regression tests covering canonical scenarios (proposal-only changes, zero deltas, conflicting archive operations).

## 4. Documentation & rollout
- [x] 4.1 Author README/usage docs noting parity, installation, and migration guidance.
- [ ] 4.2 Update OpenSpec instructions to reference the Python CLI option and publish release notes for early adopters.

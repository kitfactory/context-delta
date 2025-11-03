## Why
Teams relying on Python tooling want the OpenSpec workflows without adopting the Node.js CLI. Delivering a Python clone keeps AI-driven change management consistent across ecosystems while reducing setup friction for Python-centric repos like `team-pal-prompts`.

## What Changes
- Scaffold a new Python project that mirrors OpenSpec’s command surface (`init`, `update`, `list`, `change`, `spec`, `validate`, `archive`, `view`) with click-based CLI ergonomics.
- Reproduce core behaviors documented in existing specs: directory scaffolding, managed instruction updates, change/spec introspection, validation messaging, and archiving semantics.
- Introduce reusable abstractions for Markdown parsing and validation using Python libraries (e.g., `pydantic`/`marshmallow` equivalents of Zod schemas).
- Supply developer tooling: `pyproject.toml`, lint/test configuration, and smoke tests that align with the TypeScript project’s expectations.
- Document migration guidance so teams can choose between Node.js and Python CLIs while sharing the same OpenSpec files.

## Impact
- Affected specs: `python-cli`
- New codebase: `team_pal_prompts` package providing the CLI entry point and supporting modules
- Tooling: Python build chain (uv or pip), virtual environment instructions, and CI updates to exercise the new CLI

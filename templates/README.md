# Template Assets

All markdown templates that the Node CLI will copy live under this directory:

- `prompts/` – locale-specific prompt definitions (e.g. `delta-propose/en.md`, `delta-propose/ja.md`).
- `bootstrap/` – shared markdown used for `project.md`, `AGENTS.md`, and the root bootstrap.
- `directory.json` – declarative definition of directories/files the CLI must create.

The actual markdown content currently lives in the Python implementation (`src/context_delta/scaffold.py`). It will be migrated here in a later plan step so that both Python and Node versions stay in sync during the transition.

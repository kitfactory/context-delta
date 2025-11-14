# Command Modules

The Node CLI exposes two commands (`init` and `update`). Each command will live in its own module:

- `init.ts` – orchestrates file scaffolding, template selection, assistant sync, and `--update-root-agents`.
- `update.ts` – refreshes prompts and assistant targets, reusing the shared services.

Implementation is deferred to the next phase of the migration; these notes ensure the directory remains in version control and aligned with `docs/npm-architecture.md`.

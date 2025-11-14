# Services Modules

These TypeScript modules will house the reusable logic for the Node CLI migration:

- `assistants.ts` – assistant validation, interactive selection, and per-tool sync helpers.
- `filesystem.ts` – directory creation, openspec migration, and AGENTS.md bootstrap writes.
- `templates.ts` – locale detection plus prompt/bootstrap rendering from `templates/`.

The files are added as part of the npm migration scaffolding; real implementations will follow once the plan reaches Step 3 in `plan.md`.

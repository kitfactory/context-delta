# Node CLI Architecture (Plan Step 2)

This document captures the architecture decisions for migrating the Python Context Delta CLI to an npm package as requested in `plan.md` (§2). It locks in the language choice, directory layout, template handling, dependencies, and publish workflow required before implementation.

## Language & Project Layout
- **Language:** TypeScript (Node 20 LTS target). Strong typing protects filesystem operations (`fs-extra`), assistant selection, and locale parsing that were implicit in Python.
- **Package type:** `"type": "module"` so we can rely on modern `import` syntax and native ES modules.
- **Directory structure:**
  ```
  .
  ├── bin/
  │   └── delta.ts              # lightweight entry that wires commander + env bootstrap
  ├── src/
  │   ├── commands/
  │   │   ├── init.ts           # mirrors python cmd_init
+ │   │   └── update.ts         # mirrors python cmd_update
  │   ├── services/
  │   │   ├── assistants.ts     # assistant selection + prompt sync logic
  │   │   ├── filesystem.ts     # shared fs helpers (writeFile, ensureDirs, migrate)
  │   │   └── templates.ts      # prompt/template loading + locale detection
  │   └── types.ts              # shared types (InitResult, template descriptors…)
  ├── templates/
  │   ├── prompts/
  │   │   └── delta-propose/
  │   │       ├── en.md         # multi-locale assets per prompt
  │   │       └── ja.md
  │   ├── bootstrap/
  │   │   ├── AGENTS.md
  │   │   ├── ROOT_AGENTS.md
  │   │   └── project.md
  │   └── directory.json        # declarative skeleton of folders to create
  └── tests/                    # vitest suites mirroring tests/test_cli_init.py
  ```
- Source will build into `lib/` (tsc output) and `dist/` (bundled CLI). Runtime loads JSON/markdown templates via `fs.readFile` from `templates/`, so these assets stay outside of compiled code for easier updates.

## CLI & Feature Parity
- `bin/delta.ts` configures Commander with two commands: `init`/`update`. Additional aliases (`context-delta`) are implemented via the `bin` field in `package.json`.
- `init` flow:
  1. Parse options (`--path`, `--force`, `--assistants`, `--update-root-agents`).
  2. Resolve target root (`path` or `process.cwd()`), then call `services/filesystem.initContextDelta`.
  3. `templates.detectLanguage()` inspects `LANG`, `LC_ALL`, or `Intl.DateTimeFormat().resolvedOptions().locale`.
  4. `services/templates.scaffoldPrompts()` copies locale-specific markdown (fallback to EN) into `context-delta/prompts`.
  5. `services/assistants.syncDirectories()` mirrors `delta-*.md` to `.claude`, `.cursor`, `.github`, `context-delta/commands`, and Codex (`CODEX_HOME` or `~/.codex`).
  6. When `--update-root-agents` is set, write bootstrap `AGENTS.md` at repo root.
  7. Return structured result (existing/created/migrated) so CLI can print parity messages from Python version.
- `update` flow:
  1. Validate `context-delta/prompts` exists.
  2. Force-overwrite prompts using latest templates.
  3. Re-sync assistant directories with fresh prompt files.
  4. Report updated targets (mirrors `refresh_prompts` behaviour).
- Migration logic keeps compatibility with legacy `openspec/`, `specline/`, and `pal/` directories by copying or moving their contents before generating new files.

## Template & Locale Handling
- Prompt assets live in `templates/prompts/<prompt>/<locale>.md`. `templates.ts` resolves a request by reading `<prompt>/<language>.md`, falling back to `en.md`.
- The directory skeleton plus bootstrap markdown is defined in JSON so tests can assert parity easily. `writeFile` helper enforces trailing newline + UTF-8 to match Python.
- Assistant metadata is defined as a JSON/TS map so `--assistants` validation is centralized and type-safe.
- Localisation detection order: environment overrides → `Intl` fallback → default `en`. This mirrors `locale.getdefaultlocale` semantics.

## Dependencies
Runtime:
- `commander` – argument parsing + help text.
- `fs-extra` – promises-based filesystem helpers (mkdirp, copy).
- `chalk` – human-friendly CLI output (warnings/errors).
- `prompts` – interactive assistant selection when `--assistants` omitted + TTY detected.

Dev / Build:
- `typescript` – type checking + emit to `lib/`.
- `ts-node` + `tsx` – local execution during development.
- `tsup` – bundle `src/` + templates into a single executable JS in `dist/`.
- `vitest` – unit + integration tests (matching current pytest coverage).
- `eslint` + `@typescript-eslint/*` + `prettier` – linting/formatting parity.
- `rimraf` – cross-platform clean script.

## Scripts, Config & Publish Flow
- `package.json` scripts:
  - `build`: `rimraf lib dist && tsc --project tsconfig.build.json && tsup src/bin/delta.ts --format esm --dts false --onSuccess "node dist/delta.js --help"`.
  - `dev`: `tsx src/bin/delta.ts`.
  - `lint`: `eslint . --ext .ts`.
  - `test`: `vitest run`.
  - `test:watch`: `vitest watch`.
- **tsconfig:** root `tsconfig.json` for editor settings + `tsconfig.build.json` (extends root, sets `outDir: lib`, excludes tests). Module resolution targets `node16`.
- **Bin wiring:** `package.json` includes `"bin": { "delta": "./dist/delta.mjs", "context-delta": "./dist/delta.mjs" }`.
- **Distribution files:** ensure `files` list includes `dist`, `templates`, and `README.md`. Source TypeScript excluded from publish except in `files` when needed.
- **Publish steps:**
  1. `npm install` (ensures lock file).
  2. `npm run lint && npm run test`.
  3. `npm run build`.
  4. `npm version <patch|minor|major>` – updates `package.json` version + creates git tag.
  5. `npm publish --access public`.
- Documented in README/npm migration notes so future maintainers follow the Node workflow.

## Testing Strategy
- Vitest suites under `tests/cli/*.test.ts` simulate `tmpdir` installs using `memfs` + real filesystem via `tmp`. Cases mirror existing pytest coverage (init structure, locale detection, assistant filtering, update refresh, root AGENTS overwrite).
- Additional unit tests cover helper modules (locale detection, template loading, assistant parsing).
- CI job executes `npm run lint`, `npm run test`, and `npm run build` on Node 20 + 22 so we catch runtime regressions before publish.

These decisions complete Plan Step 2 by defining the Node.js architecture and npm build/publish flow. Implementation (Plan Step 3+) can now follow this blueprint.

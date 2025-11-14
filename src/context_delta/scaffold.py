from __future__ import annotations

import locale
import os
import shutil
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

PROMPT_TEMPLATES = {
    "delta-concept.md": {
        "en": """# delta-concept (EN)

Update `docs/concept.md` with the following sections in this exact order:
1. `## Concept Summary` – bullet list that restates project purpose and in/out of scope.
2. `## CLI vs Prompt Responsibilities` – Markdown table with columns `Area` and `Owner`, covering init/update, proposal/approval, validation, and documentation.
3. `## Localisation Strategy` – describe how Context Delta selects Japanese vs English prompts (single language at install time; Japanese environments must produce bilingual archive docs).
4. `## context-delta/ Directory Structure` – fenced code block showing the canonical tree (context-delta/project.md, AGENTS.md, prompts, specs, changes).

Preserve any existing content outside these sections. Ensure headings appear once and in the order shown above; run markdownlint (or equivalent) if needed.
""",
        "ja": """# delta-concept (JA)

`docs/concept.md` を以下の順番で更新してください:
1. `## Concept Summary` – プロジェクト目的とスコープ内/外を箇条書きで整理
2. `## CLI vs Prompt Responsibilities` – `Area` / `Owner` 列を持つ Markdown 表で init/update、proposal/approval、validation、ドキュメント更新の担当を明記
3. `## Localisation Strategy` – 日本語環境では日本語プロンプトをインストールし、アーカイブ時に日英 2 文書を生成する方針、英語環境では英語のみでよい旨を説明
4. `## context-delta/ Directory Structure` – context-delta/project.md, AGENTS.md, prompts, specs, changes を示すツリーをコードブロックで記載

セクション以外の既存内容は保持しつつ更新してください。見出し構成が崩れないよう lint（markdownlint 等）で確認します。
""",
    },
    "delta-roadmap.md": {
        "en": """# delta-roadmap (EN)

Document the requested capability as milestone-sized changes using a Markdown table with the header:
`| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |`

- Name milestones sequentially (M1, M2, ...). Split work into fine-grained slices that build from foundational functionality up to advanced behaviour; `Dependencies` may only reference earlier milestones that unlock the next slice.
- `Acceptance` must prove the milestone leaves the product shippable and that the next milestone can proceed without reworking the previous slice.
- After the table add `## Notes` summarising risk, critical path, and why the dependency order is required.
- Validate that every milestone has at least one deliverable, that dependency chains cover prerequisite functionality, and that no dependency references an undefined milestone.
""",
        "ja": """# delta-roadmap (JA)

次のヘッダーを持つ Markdown 表でマイルストーンを記述してください:
`| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |`

- M1, M2 ... のように連番で記載し、基礎 → 応用へと段階的に機能を細分化すること。`Dependencies` 列には次の段階を成立させるための先行マイルストーンのみを記載してください。
- `Acceptance` では、当該マイルストーン完了時に製品がリリース可能であり、次の段階へ進む際に再工事が不要である理由を明記すること。
- 表の後に `## Notes` を追加し、リスクやクリティカルパス、依存順序の妥当性を説明すること。
- 未定義のマイルストーンを依存に書いていないか、各行に Deliverables/Acceptance が存在するか、依存関係が前提機能を十分にカバーしているかを確認すること。
""",
    },
    "delta-propose.md": {
        "en": """# delta-propose (EN)

Prepare the full change bundle for `{change_id}`:
1. `context-delta/changes/{change_id}/proposal.md` with sections `## Why`, `## What Changes`, `## Impact`, `## Success Metrics`, `## Risks`.
2. `context-delta/changes/{change_id}/tasks.md` with numbered headings (`## 1.`, `## 2.` ...) each containing a block of `- [ ]` tasks plus owner/notes.
3. `context-delta/specs/<capability>/spec.md` using `## ADDED`, `## MODIFIED`, `## REMOVED` and `#### Scenario` blocks that contrast current vs target behaviour.

After updating, run `context-delta validate {change_id}` and append a short “Validation” note to proposal.md indicating success/failure. Keep files UTF-8 + LF and ensure headings follow the structure above.
""",
        "ja": """# delta-propose (JA)

`{change_id}` の変更一式を以下の要件で整備してください:
1. `context-delta/changes/{change_id}/proposal.md` に `## Why` / `## What Changes` / `## Impact` / `## Success Metrics` / `## Risks` を順番に配置
2. `context-delta/changes/{change_id}/tasks.md` は `## 1.` のような番号付き見出しと、その配下に担当/期日付きの `- [ ]` チェックボックスを記述
3. `context-delta/specs/<capability>/spec.md` では `## ADDED` / `## MODIFIED` / `## REMOVED` と `#### Scenario` を用い、現状と変更後を比較

編集後に `context-delta validate {change_id}` を実行し、結果を proposal.md の末尾に「Validation」メモとして記載してください。ファイルは UTF-8・LF で統一します。
""",
    },
    "delta-apply.md": {
        "en": """# delta-apply (EN)

Draft an Apply-phase status report for `{change_id}` with these sections:
1. `## Task Status` – mirror `context-delta/changes/{change_id}/tasks.md`, listing completed/blocked items.
2. `## Commands and Tests` – bullet list `- command: result` covering `context-delta validate`, unit tests, linters, etc.
3. `## context-delta validate Results` – summarise the latest run (date, success/failure, key errors).
4. `## Next Actions` – remaining TODOs, risks, and support needed.

Ensure the report references commit hash or PR if available, and that `context-delta validate {change_id}` was executed before sending the update.
""",
        "ja": """# delta-apply (JA)

`{change_id}` の進捗レポートを次の構成で作成してください:
1. `## Task Status` – `context-delta/changes/{change_id}/tasks.md` の完了/未完了/ブロッカーを対応付けて記載
2. `## Commands and Tests` – `- コマンド: 結果` 形式で `context-delta validate`, `uv run pytest`, lint 等の実行履歴を列挙
3. `## context-delta validate Results` – 最新実行日時と成功/失敗、エラー内容を要約
4. `## Next Actions` – 残タスク、リスク、必要なサポート

レポート作成前に必ず `context-delta validate {change_id}` を実行し、結果を記載してください。
""",
    },
    "delta-archive.md": {
        "en": """# delta-archive (EN)

Before archiving `{change_id}` produce a checklist that covers:
- Confirmation that `context-delta/changes/{change_id}/tasks.md` has no unchecked items (if any remain, explain remediation).
- Table or bullet list summarising spec deltas (file path, ADDED/MODIFIED/REMOVED, short description).
- Verification commands executed (include timestamped `context-delta validate --all` results and any deployment checks).
- Ordered command list to run (`context-delta archive {change_id}`, git commit/tag, docs build).
- Release notes or follow-up tickets needed post-archive.

English environments only need English documentation; Japanese instructions are handled in the JA template.
""",
        "ja": """# delta-archive (JA)

`{change_id}` のアーカイブ前に次を必ず確認してください:
- `context-delta/changes/{change_id}/tasks.md` の未完了タスクがゼロであること（残る場合は根拠と対処策を明記）
- スペック差分の一覧（ファイル、ADDED/MODIFIED/REMOVED、概要）を表または箇条書きで整理
- 実行した検証コマンド（`context-delta validate --all` など）と日時を記録
- 最終実行コマンド（`context-delta archive {change_id}`, git commit/tag, docs build 等）を順番で提示
- アーカイブ後に必要なリリースノートやフォローアップチケット

LANG が `ja` の場合は docs/ 以下に日英 2 種類の成果物（例: `docs/changes/{change_id}.ja.md` と `.en.md`）を作成し、英語版には主要な変更点を英語で要約してください。
""",
    },
    "delta-update.md": {
        "en": """# delta-update (EN)

Describe the template refresh steps with the following structure:
1. `## Directories Updated` – bullet list (`context-delta/prompts`, `.claude/commands/context-delta`, `$CODEX_HOME/prompts`, etc.).
2. `## File Differences` – table with columns `File`, `Change (added/removed/modified)`, `Notes`.
3. `## Verification` – commands run (e.g. `context-delta update --assistants ...`, `pytest`), expected outcomes, and manual checks (open prompts, lint).

Highlight any follow-up required for downstream tools or documentation.
""",
        "ja": """# delta-update (JA)

テンプレート更新作業を次の構成でまとめてください:
1. `## Directories Updated` – `context-delta/prompts`, `.claude/commands/context-delta`, `$CODEX_HOME/prompts` など更新対象ディレクトリを箇条書きで列挙
2. `## File Differences` – `File` / `Change (added/removed/modified)` / `Notes` の表で差分を記録
3. `## Verification` – 実行したコマンド（例: `context-delta update --assistants claude,codex`, `pytest`）と期待結果、手動確認事項を記載

更新後に必要なドキュメントやツール側の確認があれば忘れずに書いてください。
""",
    },
}

PROJECT_MD = """# Project Overview

This project uses Context Delta (a Python clone of OpenSpec tooling) to manage
spec-driven workflows for AI assistants. The source of truth lives in
`context-delta/specs/`, while in-progress work resides in `context-delta/changes/`.
"""

AGENTS_MD = """<!-- CONTEXT-DELTA:START -->
# Context Delta Instructions

- Read `context-delta/project.md` for context.
- Follow workflow prompts located in `context-delta/prompts/`.
- Use `context-delta init` (already executed) to regenerate managed files if needed.
- For proposal or spec updates run the corresponding `delta-*.md` prompt.
<!-- CONTEXT-DELTA:END -->
"""

ROOT_AGENTS_BOOTSTRAP = """<!-- CONTEXT-DELTA-ROOT:START -->
# Repository Instructions

This repository stores the managed AI assistant guidance under `context-delta/AGENTS.md`.
Run `context-delta init --update-root-agents` after updating Context Delta to refresh this notice.

- Primary instructions: `context-delta/AGENTS.md`
- Project overview: `context-delta/project.md`
- Prompt templates: `context-delta/prompts/`

Please edit those files (not this bootstrap) for workflow changes.
<!-- CONTEXT-DELTA-ROOT:END -->
"""

STATE_DIR = Path("context-delta")
LEGACY_STATE_DIRS: tuple[Path, ...] = (Path("specline"), Path("pal"))

DIRECTORY_SKELETON: tuple[Path, ...] = (
    STATE_DIR,
    STATE_DIR / "prompts",
    STATE_DIR / "specs",
    STATE_DIR / "changes",
    STATE_DIR / "changes/archive",
)

DEFAULT_ASSISTANTS: tuple[str, ...] = ("claude", "cursor", "github", "context-delta", "codex")

ASSISTANT_TARGETS: dict[str, Path] = {
    "claude": Path(".claude/commands/context-delta"),
    "cursor": Path(".cursor/prompts/context-delta"),
    "github": Path(".github/prompts/context-delta"),
    "context-delta": Path("context-delta/commands"),
}


@dataclass
class InitResult:
    root: Path
    created: set[str] = field(default_factory=set)
    migrated: set[str] = field(default_factory=set)
    existing: bool = False


def detect_language() -> str:
    lang_env = os.environ.get("LANG", "")
    if lang_env:
        code = lang_env.split(".")[0]
        if code:
            return code.split("_")[0].lower()

    loc = locale.getdefaultlocale()[0] if locale.getdefaultlocale() else None
    if loc:
        return loc.split("_")[0].lower()
    return "en"


def ensure_directories(root: Path, paths: Iterable[Path]) -> set[str]:
    created: set[str] = set()
    for rel in paths:
        target = root / rel
        if not target.exists():
            target.mkdir(parents=True, exist_ok=True)
            created.add(str(rel))
    return created


def write_file(path: Path, content: str, *, overwrite: bool = False) -> None:
    if path.exists() and not overwrite:
        return
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def scaffold_prompts(prompts_dir: Path, *, overwrite: bool = False) -> set[str]:
    created: set[str] = set()
    language = detect_language()
    for filename, translations in PROMPT_TEMPLATES.items():
        content = translations.get(language) or translations["en"]
        target = prompts_dir / filename
        write_file(target, content, overwrite=overwrite)
        created.add(f"prompts/{filename}")
    return created


def migrate_from_openspec(root: Path, state_dir: Path) -> set[str]:
    source = root / "openspec"
    if not source.exists():
        return set()

    migrated: set[str] = set()

    for filename in ("AGENTS.md", "project.md"):
        src = source / filename
        dest = state_dir / filename
        if src.exists() and not dest.exists():
            dest.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
            migrated.add(filename)

    for directory in ("specs", "changes"):
        src_dir = source / directory
        dest_dir = state_dir / directory
        if src_dir.exists():
            shutil.copytree(src_dir, dest_dir, dirs_exist_ok=True)
            migrated.add(directory + "/")

    return migrated


def resolve_codex_prompts(root: Path) -> Path:
    codex_home = os.environ.get("CODEX_HOME")
    if codex_home:
        base = Path(codex_home)
    else:
        try:
            base = Path.home() / ".codex"
        except RuntimeError:
            # Fallback for environments without a resolvable home
            base = root / ".codex"
    return base / "prompts"


def sync_assistant_directories(root: Path, prompts_dir: Path, assistants: Iterable[str]) -> set[str]:
    created: set[str] = set()
    prompt_files = sorted(prompts_dir.glob("delta-*.md"))

    for assistant in assistants:
        target: Path
        if assistant == "codex":
            target = resolve_codex_prompts(root)
        else:
            try:
                rel = ASSISTANT_TARGETS[assistant]
            except KeyError as exc:
                raise ValueError(f"Unknown assistant '{assistant}'") from exc
            target = root / rel
        target.mkdir(parents=True, exist_ok=True)
        try:
            created.add(str(target.relative_to(root)))
        except ValueError:
            created.add(str(target))
        for prompt in prompt_files:
            shutil.copyfile(prompt, target / prompt.name)

    return created


def init_context_delta_structure(
    root: Path | None = None, *, force: bool = False, assistants: Iterable[str] | None = None
) -> InitResult:
    root = root or Path.cwd()
    state_dir = root / STATE_DIR
    assistant_selection = tuple(assistants or DEFAULT_ASSISTANTS)

    if not state_dir.exists():
        for legacy in LEGACY_STATE_DIRS:
            legacy_dir = root / legacy
            if legacy_dir.exists():
                shutil.move(str(legacy_dir), str(state_dir))
                break

    result = InitResult(root=state_dir, existing=state_dir.exists())

    if state_dir.exists() and not force:
        return result

    if force and state_dir.exists():
        shutil.rmtree(state_dir)

    result.created.update(ensure_directories(root, DIRECTORY_SKELETON))

    write_file(state_dir / "project.md", PROJECT_MD)
    write_file(state_dir / "AGENTS.md", AGENTS_MD)
    (state_dir / "specs" / ".gitkeep").touch(exist_ok=True)
    (state_dir / "changes" / ".gitkeep").touch(exist_ok=True)

    prompt_results = scaffold_prompts(state_dir / "prompts", overwrite=False)
    result.created.update(prompt_results)

    migrated = migrate_from_openspec(root, state_dir)
    result.migrated.update(migrated)

    assistant_dirs = sync_assistant_directories(root, state_dir / "prompts", assistant_selection)
    result.created.update(assistant_dirs)

    return result


def refresh_prompts(root: Path | None = None, *, assistants: Iterable[str] | None = None) -> set[str]:
    root = root or Path.cwd()
    assistant_selection = tuple(assistants or DEFAULT_ASSISTANTS)
    state_dir = root / STATE_DIR
    prompts_dir = state_dir / "prompts"
    if not prompts_dir.exists():
        raise FileNotFoundError(
            "context-delta/prompts directory does not exist. Run 'context-delta init' first."
        )

    results = scaffold_prompts(prompts_dir, overwrite=True)
    assistant_dirs = sync_assistant_directories(root, prompts_dir, assistant_selection)
    results.update(assistant_dirs)
    return results


def update_root_agents_file(root: Path | None = None) -> None:
    root = root or Path.cwd()
    target = root / "AGENTS.md"
    write_file(target, ROOT_AGENTS_BOOTSTRAP, overwrite=True)

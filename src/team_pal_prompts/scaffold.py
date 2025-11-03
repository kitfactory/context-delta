from __future__ import annotations

import locale
import os
import shutil
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

DEFAULT_PROMPTS = {
    "pal-concept.en.md": """# pal-concept (EN)

Summarise or update concept.md for the palprompt workflow. Cover:
- project purpose and current scope
- CLI vs prompt responsibilities
- localisation strategy and supported languages
- directory structure overview (pal/, prompts/, specs/, changes/)

Return the updated Markdown content ready to write into docs/concept.md.
""",
    "pal-roadmap.en.md": """# pal-roadmap (EN)

Split the requested capability into milestone-sized changes. For each milestone provide:
- scope summary and primary deliverables
- acceptance criteria / completion checklist
- recommended change-id in kebab-case
- dependencies on earlier milestones if any

Output as a Markdown table with columns Milestone, Scope, Deliverables, Acceptance, Change ID.
""",
    "pal-change.en.md": """# pal-change (EN)

Draft the OpenSpec change files for `{change_id}`:
- proposal.md with sections ## Why, ## What Changes, ## Impact
- tasks.md with numbered sections and `- [ ]` checkboxes
- specs/<capability>/spec.md using delta headers (ADDED/MODIFIED/REMOVED) and `#### Scenario` entries

Ensure Markdown is ready to validate with `palprompt validate {change_id}`.
""",
    "pal-build.en.md": """# pal-build (EN)

Produce a progress update for `{change_id}` including:
- tasks.md checklist with updated status
- commands executed (e.g. `uv run pytest`)
- summary of code changes with file references
- next steps and blockers
""",
    "pal-spec.en.md": """# pal-spec (EN)

Review `{spec_id}` specification and describe required updates. Highlight:
- current requirements and scenarios
- proposed changes grouped under ADDED/MODIFIED/REMOVED
- consistency with related specs
- open questions
""",
    "pal-validate.en.md": """# pal-validate (EN)

Run `palprompt validate {target}` and interpret results:
- list errors/warnings with file paths
- provide remediation steps
- include command suggestions for re-running validation
""",
    "pal-archive.en.md": """# pal-archive (EN)

Before archiving `{change_id}` confirm:
- tasks.md has no unchecked items
- summary of deltas to apply (added/modified/removed requirements)
- any follow-up documentation updates
- final command list to run (`palprompt archive {change_id}`, git commit, etc.)
""",
    "pal-update.en.md": """# pal-update (EN)

Refresh palprompt-managed templates:
- list directories to update (pal/prompts, .claude/..., etc.)
- note added/removed files
- highlight manual checks after update
""",
}

JA_PROMPTS = {
    "pal-concept.ja.md": """# pal-concept (JA)

palprompt ワークフローのコンセプトをまとめてください。含める項目:
- プロジェクト目的と対象範囲
- CLI とプロンプトの責務分担
- ローカライズ方針と対応言語
- pal/ ディレクトリ構成の概要

出力は docs/concept.md に貼り付け可能な Markdown にしてください。
""",
    "pal-roadmap.ja.md": """# pal-roadmap (JA)

対象機能をマイルストーンに分割してください。各行に以下を含めた表で出力:
- マイルストーン名 (M1, M2, ...)
- スコープ説明・成果物
- 受け入れ条件
- 推奨 change-id (kebab-case)
""",
    "pal-change.ja.md": """# pal-change (JA)

`{change_id}` の OpenSpec 変更ファイルを下書きしてください:
- proposal.md の ## Why / ## What Changes / ## Impact を記述
- tasks.md に番号付きチェックリストを作成 (`- [ ]`)
- specs/<capability>/spec.md をデルタ形式 (ADDED/MODIFIED/REMOVED と `#### Scenario`) で用意

結果は `palprompt validate {change_id}` で検証を通る構造にしてください。
""",
    "pal-build.ja.md": """# pal-build (JA)

`{change_id}` の進捗レポートを作成してください:
- tasks.md の状態更新
- 実行コマンドやテスト結果
- 変更ファイルと概要
- 次の作業とブロッカー
""",
    "pal-spec.ja.md": """# pal-spec (JA)

対象仕様 `{spec_id}` をレビューし、必要な変更点を整理してください:
- 現在の要件/シナリオの要約
- 追加/変更/削除が必要な箇所
- 他仕様との整合性と懸念点
""",
    "pal-validate.ja.md": """# pal-validate (JA)

`palprompt validate {target}` の結果を整理し、修正手順を提示してください:
- エラー/警告の内容と該当ファイル
- 具体的な修正ステップ
- 再検証コマンドの例
""",
    "pal-archive.ja.md": """# pal-archive (JA)

`{change_id}` をアーカイブする前のチェックリストを作成してください:
- 未完了タスクの確認と対応方法
- 仕様に加わるデルタの概要
- 実行すべき最終コマンド
""",
    "pal-update.ja.md": """# pal-update (JA)

palprompt 管理テンプレートを更新する手順をまとめてください:
- 更新対象ディレクトリとファイル差分
- バックアップ/差分確認手順
- 更新後の確認事項
""",
}

PROJECT_MD = """# Project Overview

This project uses palprompt (a Python clone of OpenSpec tooling) to manage
spec-driven workflows for AI assistants. The source of truth lives in
`pal/specs/`, while in-progress work resides in `pal/changes/`.
"""

AGENTS_MD = """<!-- PALPROMPT:START -->
# palprompt Instructions

- Read `pal/project.md` for context.
- Follow workflow prompts located in `pal/prompts/`.
- Use `palprompt init` (already executed) to regenerate managed files if needed.
- For proposal or spec updates run the corresponding `pal-*.md` prompt.
<!-- PALPROMPT:END -->
"""

DIRECTORY_SKELETON: tuple[Path, ...] = (
    Path("pal"),
    Path("pal/prompts"),
    Path("pal/specs"),
    Path("pal/changes"),
    Path("pal/changes/archive"),
)

ASSISTANT_TARGETS: tuple[Path, ...] = (
    Path(".claude/commands/palprompt"),
    Path(".cursor/prompts/palprompt"),
    Path(".github/prompts/palprompt"),
    Path("palprompt/commands"),
)


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
    for name, contents in DEFAULT_PROMPTS.items():
        target = prompts_dir / name
        write_file(target, contents, overwrite=overwrite)
        created.add(f"prompts/{name}")

    language = detect_language()
    if language == "ja":
        for name, contents in JA_PROMPTS.items():
            target = prompts_dir / name
            write_file(target, contents, overwrite=overwrite)
            created.add(f"prompts/{name}")
    return created


def migrate_from_openspec(root: Path, pal_dir: Path) -> set[str]:
    source = root / "openspec"
    if not source.exists():
        return set()

    migrated: set[str] = set()

    for filename in ("AGENTS.md", "project.md"):
        src = source / filename
        dest = pal_dir / filename
        if src.exists() and not dest.exists():
            dest.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
            migrated.add(filename)

    for directory in ("specs", "changes"):
        src_dir = source / directory
        dest_dir = pal_dir / directory
        if src_dir.exists():
            shutil.copytree(src_dir, dest_dir, dirs_exist_ok=True)
            migrated.add(directory + "/")

    return migrated


def sync_assistant_directories(root: Path, prompts_dir: Path) -> set[str]:
    created: set[str] = set()
    prompt_files = sorted(prompts_dir.glob("pal-*.md"))

    for rel in ASSISTANT_TARGETS:
        dest = root / rel
        dest.mkdir(parents=True, exist_ok=True)
        created.add(str(rel))
        for prompt in prompt_files:
            shutil.copyfile(prompt, dest / prompt.name)

    return created


def init_palprompt_structure(root: Path | None = None, force: bool = False) -> InitResult:
    root = root or Path.cwd()
    pal_dir = root / "pal"

    result = InitResult(root=pal_dir, existing=pal_dir.exists())

    if pal_dir.exists() and not force:
        return result

    if force and pal_dir.exists():
        shutil.rmtree(pal_dir)

    result.created.update(ensure_directories(root, DIRECTORY_SKELETON))

    write_file(pal_dir / "project.md", PROJECT_MD)
    write_file(pal_dir / "AGENTS.md", AGENTS_MD)
    (pal_dir / "specs" / ".gitkeep").touch(exist_ok=True)
    (pal_dir / "changes" / ".gitkeep").touch(exist_ok=True)

    prompt_results = scaffold_prompts(pal_dir / "prompts", overwrite=False)
    result.created.update(prompt_results)

    migrated = migrate_from_openspec(root, pal_dir)
    result.migrated.update(migrated)

    assistant_dirs = sync_assistant_directories(root, pal_dir / "prompts")
    result.created.update(assistant_dirs)

    return result


def refresh_prompts(root: Path | None = None) -> set[str]:
    root = root or Path.cwd()
    pal_dir = root / "pal"
    prompts_dir = pal_dir / "prompts"
    if not prompts_dir.exists():
        raise FileNotFoundError("pal/prompts directory does not exist. Run 'palprompt init' first.")

    results = scaffold_prompts(prompts_dir, overwrite=True)
    assistant_dirs = sync_assistant_directories(root, prompts_dir)
    results.update(assistant_dirs)
    return results

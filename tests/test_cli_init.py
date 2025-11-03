from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


def run_cli(tmp_path: Path, *args: str, lang: str | None = None) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    if lang is not None:
        env["LANG"] = lang
    src_path = Path(__file__).resolve().parents[1] / "src"
    existing = env.get("PYTHONPATH")
    env["PYTHONPATH"] = (
        f"{src_path}:{existing}" if existing else str(src_path)
    )
    command = [sys.executable, "-m", "team_pal_prompts.cli", "init", "--path", str(tmp_path), *args]
    return subprocess.run(
        command,
        cwd=tmp_path,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def test_palprompt_init_creates_structure(tmp_path: Path) -> None:
    result = run_cli(tmp_path, lang="en_US.UTF-8")
    assert result.returncode == 0, result.stderr

    pal_dir = tmp_path / "pal"
    assert pal_dir.exists()
    assert (pal_dir / "project.md").exists()
    assert (pal_dir / "AGENTS.md").exists()
    assert (pal_dir / "specs").is_dir()
    assert (pal_dir / "changes").is_dir()
    assert (pal_dir / "prompts" / "pal-change.en.md").exists()
    assert (pal_dir / "prompts" / "pal-concept.en.md").exists()


def test_palprompt_init_detects_locale_for_prompts(tmp_path: Path) -> None:
    result = run_cli(tmp_path, lang="ja_JP.UTF-8")
    assert result.returncode == 0, result.stderr

    prompts_dir = tmp_path / "pal/prompts"
    assert (prompts_dir / "pal-change.en.md").exists()
    assert (prompts_dir / "pal-change.ja.md").exists()


def test_palprompt_init_migrates_basic_openspec(tmp_path: Path) -> None:
    openspec_dir = tmp_path / "openspec"
    (openspec_dir / "specs/demo").mkdir(parents=True)
    (openspec_dir / "specs/demo/spec.md").write_text("# Demo spec\n", encoding="utf-8")
    (openspec_dir / "AGENTS.md").write_text("Legacy instructions", encoding="utf-8")

    result = run_cli(tmp_path, lang="en_US.UTF-8")
    assert result.returncode == 0, result.stderr

    pal_dir = tmp_path / "pal"
    assert (pal_dir / "AGENTS.md").read_text(encoding="utf-8").startswith("<!-- PALPROMPT")
    assert (pal_dir / "specs/demo/spec.md").exists()


def test_palprompt_init_copies_prompts_for_assistants(tmp_path: Path) -> None:
    result = run_cli(tmp_path, lang="en_US.UTF-8")
    assert result.returncode == 0, result.stderr

    expected = [
        ".claude/commands/palprompt/pal-change.en.md",
        ".cursor/prompts/palprompt/pal-change.en.md",
        ".github/prompts/palprompt/pal-change.en.md",
        "palprompt/commands/pal-change.en.md",
    ]
    for rel in expected:
        assert (tmp_path / rel).exists(), f"{rel} was not created"

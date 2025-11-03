# team-pal-prompts

Python 実装の palprompt CLI です。OpenSpec の `openspec/` ワークフローを `pal/` ディレクトリへ移行し、AI アシスタント用プロンプトを一元管理します。

## セットアップ

1. 依存インストール  
   ```bash
   uv add pytest  # ネットワーク制限で失敗する場合は pyproject.toml の optional-dependencies.test を参照
   ```
2. テスト実行  
   ```bash
   pytest
   ```

## 使い方

- プロジェクト初期化  
  ```bash
  palprompt init
  ```  
  実行すると以下を行います:
  - `pal/` 以下に project.md、AGENTS.md、specs/、changes/、prompts/ を生成
  - `LANG` 環境変数などで日本語ロケールが検出された場合、`pal-*.ja.md` も展開
  - `.claude/commands/palprompt/` など各 AI アシスタント向けフォルダへプロンプトをコピー
  - 既存の `openspec/` があれば AGENTS.md、project.md、specs/、changes/ を `pal/` に移行

- 生成されるディレクトリ構成
  ```
  pal/
  ├── project.md
  ├── AGENTS.md
  ├── prompts/
  ├── specs/
  └── changes/
  ```

## テストカバレッジ

`tests/test_cli_init.py` では以下を検証します:
- `palprompt init` がディレクトリとテンプレートを生成するか
- `LANG` に応じてローカライズ済みプロンプトが作成されるか
- 既存 `openspec/` の仕様が `pal/` へ移行されるか
- Claude/Cursor/Copilot などのフォルダにプロンプトが同期されるか

## 今後の予定

- `palprompt` CLI の追加サブコマンド（list / validate / archive など）
- `pal/prompts/` テンプレートの拡充と多言語サポート強化
- README にチュートリアル例やベストプラクティスの追加

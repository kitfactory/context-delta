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
  - `LANG` などのロケール情報から日本語が検出された場合、`pal-*.ja.md` などローカライズ済みプロンプトも展開
  - `.claude/commands/palprompt/` など各 AI アシスタント向けフォルダへプロンプトをコピー
  - 既存の `openspec/` があれば AGENTS.md、project.md、specs/、changes/ を `pal/` に移行

- テンプレート更新  
  ```bash
  palprompt update
  ```  
  `pal/prompts/` を最新テンプレートで上書きし、各 AI アシスタント用フォルダにも同期します。新しい言語ファイルを追加した場合もこのコマンドで展開できます。

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

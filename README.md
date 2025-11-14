# Context Delta

Python 実装の Context Delta CLI（コマンド名 `delta` / エイリアス `context-delta`）です。OpenSpec の `openspec/` ワークフローを `context-delta/` ディレクトリへ移行し、AI アシスタント用プロンプトを一元管理します。

## セットアップ

1. パッケージをインストール  
   - pip を直接使う場合  
     ```bash
     pip install context-delta
     # 開発モードなら
     pip install -e .[test]
     ```
   - uv を使用する場合  
     ```bash
     uv pip install context-delta
     # 開発モードなら
     uv pip install -e .[test]
     ```
2. 以上でセットアップ完了です。CLI から `delta --help`（または `context-delta --help`）を実行してインストールを確認してください。

## 使い方

### プロジェクト初期化
```bash
delta init
```
実行すると以下を行います:
- `context-delta/` 以下に project.md、AGENTS.md、specs/、changes/、prompts/ を生成
- `LANG` などのロケール情報から日本語が検出された場合は `delta-*.md` が日本語版で展開され、それ以外は英語版が展開されます（ファイル名への言語サフィックスは付きません）
- `.claude/commands/context-delta/` など各 AI アシスタント向けフォルダへプロンプトをコピー（Codex は `CODEX_HOME/prompts`、環境変数がなければ `~/.codex/prompts/` を使用。ホームが取得できない環境のみリポジトリ内 `.codex/prompts/` へ格納）
- 既存の `openspec/` や過去バージョンの state ディレクトリがあれば AGENTS.md、project.md、specs/、changes/ を `context-delta/` に移行
- 実行時にインストール対象ツール（Claude/Cursor/GitHub/Codex/ローカル context-delta）を尋ねます。Enter で全選択、`--assistants cursor,codex` のように指定してスクリプト化も可能です。
- `--update-root-agents` を付けると、リポジトリ直下の `AGENTS.md` も `context-delta/AGENTS.md` を参照する最新テンプレートに置き換えられます。

### テンプレート更新
```bash
delta update
```
`context-delta/prompts/` を最新テンプレートで上書きし、各 AI アシスタント用フォルダにも同期します。`--assistants` で対象ツールを絞り込むことも可能です。新しい言語ファイルを追加した場合もこのコマンドで展開できます。

### 生成されるディレクトリ構成
```
context-delta/
├── project.md
├── AGENTS.md
├── prompts/
├── specs/
└── changes/
```

## カスタムプロンプトと推奨使用順序

Context Delta が提供する `delta-*.md` は以下の 6 種類です。通常はロードマップ策定からアーカイブ完了まで、この順番で AI に依頼します。

| プロンプト | 主な出力内容 | 推奨タイミング |
|------------|--------------|----------------|
| `delta-concept` | `docs/concept.md` を `## Concept Summary` → `## CLI vs Prompt Responsibilities` → `## Localisation Strategy` → `## context-delta/ Directory Structure` の構成で更新 | プロジェクト初期 / 大きな方針変更時 |
| `delta-roadmap` | `| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |` の表と `## Notes` で、基礎→応用の細粒度マイルストーンと依存順・リスクを記述 | 変更開始前の計画策定時 |
| `delta-propose` | proposal / tasks / spec を規定の章構成で作成し、`context-delta validate {change_id}` 実行結果を proposal に追記 | 各 change-id の着手時 |
| `delta-apply` | Task Status / Commands and Tests / context-delta validate Results / Next Actions の 4 セクションで進捗報告 | 実装中の週次報告・レビュー前 |
| `delta-archive` | タスク完了確認、デルタ要約、検証ログ、最終コマンド列、リリースノート。日本語環境では docs/ に日英 2 文書を生成 | change 完了時 |
| `delta-update` | Directories Updated / File Differences / Verification の 3 セクションでテンプレ更新作業を記録 | `delta update` 実行時 |

> **Note:** context-delta/OpenSpec の archive プロンプトは docs や specs への変更を自動適用しません。チェックリストとデルタ表を確認しながら、最終的なドキュメント反映は開発者が手動で行う運用になっています。

### 全体フロー
1. **概念整理** – `delta-concept` でプロジェクトの目的や CLI/プロンプトの責務、ローカライズ方針を固め、docs/concept.md を最新化します。
2. **マイルストーン設計** – `delta-roadmap` で機能を基礎→応用の細片に分割し、Milestone 表と依存関係・リスクを明確にします。
3. **フェーズ実行 (繰り返し)**  
   - `delta-propose` で各フェーズの proposal/tasks/spec を生成し、`context-delta validate` を通した状態にします。  
   - 実装中は `delta-apply` を定期的に使って進捗・テスト結果・次のアクションを共有します。  
   - フェーズ完了時に `delta-archive` を実行し、タスク完了/デルタ要約/検証ログ/最終コマンドをまとめます（日本語環境では docs/ に日英 2 文書を作成）。  
   これらのアウトプットをもとに、最終的な docs/specs 更新は AI アシスタントやチームが手動で反映します。
4. **テンプレ維持** – プロンプトテンプレートや各ツールへの配布内容を更新した際は `delta-update` で差分と検証手順を記録し、`delta update` を再実行します。

## テストカバレッジ

`tests/test_cli_init.py` では以下を検証します:
- `delta init`（およびエイリアス `context-delta init`）がディレクトリとテンプレートを生成するか
- `LANG` に応じてローカライズ済みプロンプトが作成されるか
- 既存 `openspec/` や旧 state ディレクトリの内容が `context-delta/` へ移行されるか
- 選択したツール（Claude/Cursor/Codex など）のフォルダにプロンプトが同期されるか

## 今後の予定

- `delta` CLI の追加サブコマンド（list / validate / archive など）
- `context-delta/prompts/` テンプレートの拡充と多言語サポート強化
- README にチュートリアル例やベストプラクティスの追加

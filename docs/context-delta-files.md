# Context Delta ファイル仕様（コマンド/カスタムプロンプト別）

各コマンド・カスタムプロンプトが生成/参照するファイルと、その場所・内容の最小仕様をまとめる。すべて UTF-8/LF を前提とし、PromptCard は Markdown（`.md`）で `doc_type` を持つ。

## init / update / card sync
- `delta init` / `delta update`
  - 配布元: `context-delta/prompts/`
  - 配布先: `.claude/commands/context-delta/`, `.cursor/commands/context-delta/`, `.github/commands/context-delta/`, `context-delta/commands/`, `$CODEX_HOME/prompts`（未設定時は `~/.codex/prompts/`）
  - 言語: `LANG` を見て ja/en を単一展開（ファイル名にサフィックスなし）
- `delta card sync`
  - 生成: `context-delta/promptcards/index.json`
  - 内容: `[{ "doc_type": "...", "promptcard_id": "...", "mode": "generate|revise|evaluate", "path": "context-delta/promptcards/<doc_type>/<file>.md" }]`

## propose
- 入力: プロジェクトファイル + `promptcards/index.json`
- 出力: `context-delta/changes/{delta-id}/propose.json`（このファイルが各 delta の「index」に相当）
  - 例: `{ "id": "delta-001", "title": "...", "intent": "...", "doc_instances": [{ "doc_id": "...", "doc_type": "...", "path": "...", "promptcard_id": "...", "verify_promptcard_id": "..." }], "next_steps": { "recommended_delta_ids": [...] } }`
- レジストリ: 内部的に未アーカイブ delta の `id/title/status` を保持（例: `delta_index.json` 想定）
- フォルダ構造（例）: `context-delta/changes/{delta-id}/` に以下をまとめる
  - `propose.json`（必須）
  - `proposal.md`（任意・人間向け企画メモ。正本は propose.json）
  - `tasks.md`（任意・`- [ ]` 形式で進捗管理）
  - `spec.md`（任意・詳細仕様。`## ADDED/MODIFIED/REMOVED` と `#### Scenario` 推奨。配置先は `{delta-id}/spec.md` でも `context-delta/specs/{delta-id}/spec.md` でも可）

## apply
- 入力: `propose.json` と対象 doc_instance の現行内容
- 出力: `context-delta/changes/{delta-id}/apply.json`
  - 例: `{ "delta_id": "delta-001", "results": [{ "doc_id": "...", "doc_type": "...", "path": "...", "before": "...", "after": "...", "patch": "..." }] }`

## verify
- 入力: `apply.json` / `propose.json` の intent / 評価用 PromptCard
- 出力: `context-delta/changes/{delta-id}/verify.json`
  - 例: `{ "delta_id": "delta-001", "verification": { "issues": [...], "suggested_followup": [...] } }`

## archive
- 入力: `propose.json` / `apply.json` / `verify.json`（あれば）/ 使用 PromptCard ID
- 出力: `delta_archive/{timestamp}/`
  - `summary.md` : 何を・なぜ・どう変えたか、1目的かどうかを数行で
  - `apply.patch` : `apply.json` の patch をそのまま保存
  - `doc_instances.json` : 対象 doc_instance と `promptcard_id` / `verify_promptcard_id`
- アーカイブ後: 当該 delta は未アーカイブリストから除外

## list / delete（管理系）
- `delta list`: 未アーカイブ delta の `id/title/status` を表示（`proposed` / `apply-in-progress` / `verify-in-progress`）
- `delta delete`: `proposed` 状態の delta をレジストリから削除（欠番は再利用しない）

# プロンプト生成ドキュメントの概要（現行仕様）

Context Delta が配布するカスタムプロンプトは、`delta propose / delta apply / delta verify / delta archive` の 4 本と管理系 `delta list / delta delete` のみです。doc_type と PromptCard（Markdown 前提）を軸に、差分フローを最小構成で回します。

## 共通動作
- テンプレートは `context-delta/prompts/` に配置され、`delta init`（エイリアス `context-delta init`）で初期生成、`delta update` で更新されます。CLI はさらに `.claude/`、`.cursor/`、`.github/`、`context-delta/commands/`、`$CODEX_HOME/prompts`（未設定時は `~/.codex/prompts/`）へ同じファイル名の `delta-*.md` をコピーします。初期化時には対話的にツール選択を促し、Enter で全インストール、`--assistants claude,cursor,codex` のようにフラグ指定することで対象ツールを絞れます。
- 言語は `LANG` などのロケールから自動推定され、ja 系なら日本語版、それ以外は英語版がインストールされます。ファイル名に言語サフィックスは付かず、中身のみ翻訳されます（必要に応じて `delta update` を再実行すると切り替え可能）。

## 配布テンプレート

- **delta-propose (`delta-propose.md`)**  
  1 delta = 1 目的で候補を JSON として出力し、doc_type / PromptCard を紐づけます。`verify_promptcard_id` も含め、最小 doc_type セット（req.usdm / spec.api / design.arch_overview / test.plan / ops.runbook / delta.summary）を優先。

- **delta-apply (`delta-apply.md`)**  
  doc_instance ごとの before/after/patch を提示します。変更は intent を満たす最小限にとどめます。

- **delta-verify (`delta-verify.md`)**  
  PromptCard の rubric で意味的整合性を確認し、issues と follow-up を JSON で返します。

- **delta-archive (`delta-archive.md`)**  
  summary / apply.patch / doc_instances.json のエッセンスだけを残し、次回の propose に活かします。

- **delta-list (`delta-list.md`)**  
  未アーカイブの delta を一覧します（status: proposed / apply-in-progress / verify-in-progress）。

- **delta-delete (`delta-delete.md`)**  
  未着手（proposed）の delta を削除します。欠番は再利用しません。

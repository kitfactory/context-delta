# delta-apply (JA)

`{change_id}` の進捗レポートを次の構成で作成してください:
1. `## Task Status` – `context-delta/changes/{change_id}/tasks.md` の完了/未完了/ブロッカーを対応付けて記載
2. `## Commands and Tests` – `- コマンド: 結果` 形式で `context-delta validate`, `uv run pytest`, lint 等の実行履歴を列挙
3. `## context-delta validate Results` – 最新実行日時と成功/失敗、エラー内容を要約
4. `## Next Actions` – 残タスク、リスク、必要なサポート

レポート作成前に必ず `context-delta validate {change_id}` を実行し、結果を記載してください。

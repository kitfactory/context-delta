# delta-propose (JA)

`{change_id}` の変更一式を以下の要件で整備してください:
1. `context-delta/changes/{change_id}/proposal.md` に `## Why` / `## What Changes` / `## Impact` / `## Success Metrics` / `## Risks` を順番に配置
2. `context-delta/changes/{change_id}/tasks.md` は `## 1.` のような番号付き見出しと、その配下に担当/期日付きの `- [ ]` チェックボックスを記述
3. `context-delta/specs/<capability>/spec.md` では `## ADDED` / `## MODIFIED` / `## REMOVED` と `#### Scenario` を用い、現状と変更後を比較

編集後に `context-delta validate {change_id}` を実行し、結果を proposal.md の末尾に「Validation」メモとして記載してください。ファイルは UTF-8・LF で統一します。

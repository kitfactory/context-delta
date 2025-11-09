# specline-propose (JA)

`{change_id}` の Propose フェーズ成果物をまとめてください:
- `changes/{change_id}/proposal.md` に ## Why / ## What Changes / ## Impact、成功指標、リスクを記述
- `changes/{change_id}/tasks.md` は段落ごとの番号付き見出し（`## 1.` …）と `- [ ]` チェックボックスでマイルストーン/担当を整理
- `pal/specs/<capability>/spec.md` を ADDED / MODIFIED / REMOVED と `#### Scenario` 形式で更新し、現状サマリーとデルタを明示
- 未解決の質問や依存を列挙し、`specline validate {change_id}` 合格を前提に構造を整える

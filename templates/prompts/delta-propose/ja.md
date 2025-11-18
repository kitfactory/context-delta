# delta-propose (JA)

`{change_id}` で **1つの目的** に絞った delta を計画します。Concept/Roadmap/既存deltaとの連続性と、doc_instance + PromptCard による指示を明示してください。

1) `context-delta/changes/{change_id}/proposal.md`
- `## Purpose` – 目的、理由、必要なら親delta、`scope_level`、`continuity_score`(0-1と理由)、`topics`、`touches`
- `## Continuity & Scope Checks` – Concept/Roadmap/過去deltaとの整合、driftリスク、除外する範囲
- `## Doc Instances & PromptCards` – 同一目的で扱う doc_instance を列挙し、対応する PromptCard ID と生成指示（箇条書き）を記載
- `## What Changes` – 目的に紐づく仕様/コード/テストの変更内容を簡潔に
- `## Impact / Success Metrics` – 期待される効果と測定方法
- `## Risks / Open Questions` – リスク、前提、質問

2) `context-delta/changes/{change_id}/tasks.md`
- 目的に紐づく作業単位を `## 1.`, `## 2.` … の見出しで区切り、配下に担当/メモ付きの `- [ ]` タスクと完了条件を書く。

3) 必要な spec があれば:
- 対象 doc_instance ごとに `context-delta/specs/<capability>/spec.md` を更新し、`## ADDED` / `## MODIFIED` / `## REMOVED` と `#### Scenario` で現状と変更後を対比する。

作成後は `context-delta validate {change_id}` を実行し、proposal.md の末尾に結果メモ（成功/失敗）を追記してください。UTF-8・LFを維持し、1目的に収まらない場合は change_id を分けてください。

# delta-verify (JA)

`{change_id}` の検証レポートを作成します。**1つの目的** に対する成果物を PromptCard の Rubric で採点し、連続性を確認してください。

セクション:
- `## Summary` – 目的、`scope_level`、`continuity_score`（理由）、対象 doc_instance、使用した PromptCard
- `## Continuity & Scope` – Concept/Roadmap/proposal との整合、drift リスク、除外スコープ
- `## Rubric Evaluation` – doc_instance/PromptCard ごとに評価観点を列挙し、Pass/Borderline/Fail（またはスコア）と短いコメント
- `## Issues & Risks` – 不足・矛盾・欠陥。アーカイブ/リリースを止めるかどうかを明示
- `## Recommendations / Next Delta` – 改善策と、必要なら次の delta として分離すべき事項
- `## Validation` – 実行したコマンド（`context-delta validate --all`、テスト等）と結果

別の目的が見つかった場合はスコープを増やさず新しい change_id として扱ってください。UTF-8/LF を守って記述します。

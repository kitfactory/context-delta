# delta-apply (JA)

`{change_id}` の進捗レポート（1目的に限定）を作成します。Concept/Roadmap/proposal と連続性を保ち、スコープを逸脱しないこと。

1) `## Purpose & Scope` – 目的、`scope_level`、`continuity_score`（理由）、対象 doc_instance、除外範囲を記載
2) `## Task Status` – `context-delta/changes/{change_id}/tasks.md` と対応付けて完了/残り/ブロックを整理
3) `## Changes by Doc/Code/Test` – 目的に沿った文書/コード/テストの更新内容をまとめる
4) `## Commands and Tests` – `- コマンド: 結果` 形式で `context-delta validate`、テスト、lint、build を列挙
5) `## Continuity & Scope Check` – proposal/Concept/Roadmap からの drift がないか、必要な上流更新がないか確認し、逸脱があれば明記
6) `## Next Actions` – 残タスク、リスク、必要なサポート

レポート前に `context-delta validate {change_id}` を実行し、最新の結果を含めてください。UTF-8/LF を維持し、新たな目的が出たら change_id を分けてください。

# delta-archive (JA)

`{change_id}` をアーカイブする前に、**1目的で完了** していることと Concept/Roadmap/proposal との連続性を確認してください。

必須セクション:
- `## Completion Check` – `context-delta/changes/{change_id}/tasks.md` の未完タスクがゼロか確認。残る場合は新しい change_id に切り出し、理由を記載
- `## Continuity / Drift` – Concept/Roadmap/既存deltaへどう反映したか、上流ドキュメントの追従が必要なら列挙
- `## Changes Summary` – doc_instance/コード/テストごとにファイルと ADDED/MODIFIED/REMOVED、概要を表または箇条書きで整理
- `## Verification` – 実行コマンドと日時（`context-delta validate --all`、テスト、lint、build）と結果を記録
- `## Final Commands` – 実行順に記載（例: `context-delta archive {change_id}`、git commit/tag、docs build/publish）
- `## Release Notes / Follow-ups` – リリースノート、フォローアップチケット、次に回す delta があれば明記

UTF-8/LF を維持し、アーカイブ中に新たな目的が混じる場合は中断して change_id を分けてください。LANG が `ja` の場合は docs/ に日英 2 文書を生成し、英語版には主要変更点を英語で要約してください。

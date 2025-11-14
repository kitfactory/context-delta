# delta-archive (JA)

`{change_id}` のアーカイブ前に次を必ず確認してください:
- `context-delta/changes/{change_id}/tasks.md` の未完了タスクがゼロであること（残る場合は根拠と対処策を明記）
- スペック差分の一覧（ファイル、ADDED/MODIFIED/REMOVED、概要）を表または箇条書きで整理
- 実行した検証コマンド（`context-delta validate --all` など）と日時を記録
- 最終実行コマンド（`context-delta archive {change_id}`, git commit/tag, docs build 等）を順番で提示
- アーカイブ後に必要なリリースノートやフォローアップチケット

LANG が `ja` の場合は docs/ 以下に日英 2 種類の成果物（例: `docs/changes/{change_id}.ja.md` と `.en.md`）を作成し、英語版には主要な変更点を英語で要約してください。

# Prompt Review (specline init)

`specline init` / `specline update` が配布する `specline-*.md` プロンプトについて、言語、フォーマット、検証の観点で合格基準を整理します。テンプレートはすべて英語と日本語の本文を内包し、インストール時は OS/`LANG` に応じて単一言語を展開します。

## 共通ポリシー
- **言語**: 日本語環境では日本語プロンプトをインストールし、specline-archive に日英 2 文書を生成する指示を含める。英語環境は英語のみでアーカイブ完了。
- **フォーマット**: 各プロンプトは特定の見出し構成・表ヘッダー・コードブロックを指定し、Markdown lint や pytest で検証できる。
- **内部検証**: specline-propose / specline-apply / specline-archive は `specline validate` 実行を必須化。specline-roadmap では依存順序と完成度（後続マイルストーンで改修不要）を確認する。

## プロンプト別要件

| プロンプト | 必須セクション/フォーマット | 主な検証ポイント |
|------------|-----------------------------|------------------|
| specline-concept (`specline/prompts/specline-concept.md`) | `docs/concept.md` を `## Concept Summary` / `## CLI vs Prompt Responsibilities` / `## Localisation Strategy` / `## specline/ Directory Structure` で構成。責務表とディレクトリツリーを含む。 | markdownlint で見出し順と表構造を確認 |
| specline-roadmap (`specline/prompts/specline-roadmap.md`) | `| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |` の表と `## Notes` を必須。依存は先行マイルストーンのみ。 | pytest で未定義依存や空セルを検知 |
| specline-propose (`specline/prompts/specline-propose.md`) | proposal/tasks/spec の書式を固定し、編集後に `specline validate {change_id}` を実行して proposal に結果を記載。 | lint + validate 成功ログが存在するか確認 |
| specline-apply (`specline/prompts/specline-apply.md`) | `## Task Status` / `## Commands and Tests` / `## specline validate Results` / `## Next Actions` の 4 部構成。 | `specline validate` 実行日時と結果を含める |
| specline-archive (`specline/prompts/specline-archive.md`) | タスク完了、デルタ要約、検証コマンド、実行順序、リリースノートを盛り込む。日本語環境では docs/ に日英 2 文書を作成。 | `specline validate --all` の記録、日英ドキュメント出力を確認 |
| specline-update (`specline/prompts/specline-update.md`) | `## Directories Updated` / `## File Differences` / `## Verification` の 3 セクションで差分を整理。 | diff 表と検証コマンドがあるか確認 |

これらの基準に沿ってテンプレートを維持し、逸脱があれば本ドキュメントと `plan.md` のタスクを更新してください。

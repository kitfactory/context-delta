# Prompt Review (context-delta init)

`delta init` / `delta update` (エイリアス `context-delta …`) が配布する `delta-*.md` プロンプトについて、言語、フォーマット、検証の観点で合格基準を整理します。テンプレートはすべて英語と日本語の本文を内包し、インストール時は OS/`LANG` に応じて単一言語を展開します。

## 共通ポリシー
- **言語**: 日本語環境では日本語プロンプトをインストールし、delta-archive に日英 2 文書を生成する指示を含める。英語環境は英語のみでアーカイブ完了。
- **フォーマット**: 各プロンプトは特定の見出し構成・表ヘッダー・コードブロックを指定し、Markdown lint や pytest で検証できる。
- **内部検証**: delta-propose / delta-apply / delta-archive は `context-delta validate` 実行を必須化。delta-roadmap では依存順序と完成度（後続マイルストーンで改修不要）を確認する。

## プロンプト別要件

| プロンプト | 必須セクション/フォーマット | 主な検証ポイント |
|------------|-----------------------------|------------------|
| delta-concept (`context-delta/prompts/delta-concept.md`) | `context-delta/concept.md` に `## Concept Summary` / `## CLI vs Prompt Responsibilities` / `## Localisation Strategy` / `## context-delta/ Directory Structure` を整備（`delta-archive` が `docs/prd.md` へ反映）。責務表とディレクトリツリーを含む。 | markdownlint で見出し順と表構造を確認 |
| delta-roadmap (`context-delta/prompts/delta-roadmap.md`) | `| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |` の表と `## Notes` を必須。基礎 → 応用への細粒度ステップに分割し、依存は先行マイルストーンのみ。 | pytest で未定義依存や空セル、依存チェーンの欠落を検知 |
| delta-propose (`context-delta/prompts/delta-propose.md`) | proposal/tasks/spec の書式を固定し、編集後に `context-delta validate {change_id}` を実行して proposal に結果を記載。 | lint + validate 成功ログが存在するか確認 |
| delta-verify (`context-delta/prompts/delta-verify.md`) | PromptCard Rubric を読み込み、観点別スコア表と Pass/Borderline/Fail 判定、Regression 逸脱、改善アクション（`## Actions`）をまとめる。対象ドキュメントと PromptCard ID を明記。 | rubric の全観点が採点されているか、最終判定と改善タスクが記載されているか、`context-delta validate --all` 等の検証ログが引用されているかを確認 |
| delta-apply (`context-delta/prompts/delta-apply.md`) | `## Task Status` / `## Commands and Tests` / `## context-delta validate Results` / `## Next Actions` の 4 部構成。 | `context-delta validate` 実行日時と結果を含める |
| delta-archive (`context-delta/prompts/delta-archive.md`) | タスク完了、デルタ要約、検証コマンド、実行順序、リリースノートを盛り込む。日本語環境では docs/ に日英 2 文書を作成。 | `context-delta validate --all` の記録、日英ドキュメント出力を確認 |
| delta-update (`context-delta/prompts/delta-update.md`) | `## Directories Updated` / `## File Differences` / `## Verification` の 3 セクションで差分を整理。 | diff 表と検証コマンドがあるか確認 |

これらの基準に沿ってテンプレートを維持し、逸脱があれば本ドキュメントと `plan.md` のタスクを更新してください。

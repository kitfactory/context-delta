# Prompt Review (context-delta init)

`delta init` / `delta update` (エイリアス `context-delta …`) が配布する `delta-*.md` プロンプトについて、言語、フォーマット、検証の観点で合格基準を整理します。テンプレートはすべて英語と日本語の本文を内包し、インストール時は OS/`LANG` に応じて単一言語を展開します。

## 共通ポリシー
- **言語**: 日本語環境では日本語プロンプトをインストールし、英語環境では英語版のみ展開する。ファイル名に言語サフィックスは付かない。
- **フォーマット**: propose/apply/verify は JSON 形式で出力し、archive は summary.md / apply.patch / doc_instances.json の 3 点セットを生成する。
- **内部検証**: propose/apply/verify は JSON スキーマで出力形を検証する。archive はファイル構成を確認する。

## プロンプト別要件（現行配布物）

| プロンプト | 必須セクション/フォーマット | 主な検証ポイント |
|------------|-----------------------------|------------------|
| delta-propose (`context-delta/prompts/delta-propose.md`) | JSON で delta_list を出力（id/title/intent/doc_instances/{doc_type,path,promptcard_id,verify_promptcard_id}, next_steps） | json_schema でキー存在と型を検証 |
| delta-apply (`context-delta/prompts/delta-apply.md`) | JSON で delta_id と results[].{doc_id,doc_type,path,before,after,patch} を出力 | json_schema でキー存在と型を検証 |
| delta-verify (`context-delta/prompts/delta-verify.md`) | JSON で verification.issues / suggested_followup を出力 | json_schema でキー存在と型を検証 |
| delta-archive (`context-delta/prompts/delta-archive.md`) | summary.md / apply.patch / doc_instances.json を生成 | ファイル有無と JSON 構造の簡易チェック |
| delta-list (`context-delta/prompts/delta-list.md`) | 未アーカイブ delta の id/title/status を一覧 | json_schema でキー存在と型を検証 |
| delta-delete (`context-delta/prompts/delta-delete.md`) | 未着手 delta の削除手順を記載 | 実行説明の有無を lint で確認 |

これらの基準に沿ってテンプレートを維持し、逸脱があれば本ドキュメントと `plan.md` のタスクを更新してください。

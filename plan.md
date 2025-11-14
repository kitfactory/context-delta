# 作業計画書 (DeltaContext 整合チェックリスト)

## 1. ワークフロー基盤の整備
- [x] `docs/deltacontext.md` で示した Concept → Propose → Verify → Apply → Archive の思想を整理し、Context Delta という名前に一本化する
- [ ] CLI/プロンプト/README の各所で 5 フェーズの役割と入出力を揃え、利用者がどこで concept・roadmap・apply を実行するか迷わないよう相互参照を追加する
- [ ] `context_delta` パッケージのドキュメントに、各フェーズ直後に実行する Verify プロンプト（concept/propose/apply/archive）の役割とフックポイントを明記し、どの API で差分検証・整流をサポートするかをまとめる

## 2. CLI / プロンプト機能の充実
- [x] `delta init` / `delta update` による state ディレクトリ生成と多言語テンプレ展開を実装・テストする
- [ ] Concept 後に `delta-verify-concept`, Propose 後に `delta-verify-propose` …… といった Verify 系プロンプトを定義し、それぞれが `context-delta validate` や差分チェックを実行できるようテンプレ/スクリプトを整備する
- [ ] `delta-apply` / `delta-archive` から参照するコマンドリスト（検証、git、docs反映）を CLI 側でテンプレ化し、ユーザーが手動で書き直さなくて良いよう補助スクリプトを用意する
- [ ] Codex/Claude/Cursor 以外のアシスタント（例: Cline, Windsurf）向け配布先を設定し、`delta init --assistants` で選択できるよう拡張する

## 3. プロンプト品質と検証
- [ ] `delta-prompts/` それぞれに Markdown lint/pytest での自動検証を追加し、`docs/prompt_review.md` の基準（言語統一、フォーマット、検証、依存整合）を CI で担保する
- [ ] `delta-roadmap` の細粒度マイルストーン方針をテストケース化し、依存チェーンの不足・未定義参照がないかを自動で弾く
- [ ] `delta-archive` の日本語環境での日英アーカイブ出力指示をサンプルワークフローで検証し、結果を `docs/generation.md` に追記する

## 4. ドキュメントと教育コンテンツ
- [ ] README に「Proactive Delta Context の使い方」節を追加し、concept → roadmap → propose → apply → archive → docs反映までを `docs/deltacontext.md` と同じ語彙で説明する
- [ ] `docs/analysis.md` へ CLI/プロンプト/ドキュメントそれぞれが DeltaContext でどの役割を担うかの対応表を追加する
- [ ] `docs/concept.md` / `docs/generation.md` / `docs/prompt_review.md` の更新履歴をまとめ、差分を `docs/changelog.md`（新規）として記録する
- [ ] OSS 利用者向けのクイックスタート（短い screencast 台本やステップバイステップ手順）を `docs/tutorial.md` として作成し、Context Delta ライブラリ導入を促す

## 5. リリース / メンテナンス計画
- [ ] `pyproject.toml` のメタデータ（description, classifiers, project URLs）を Context Delta として整備し、PyPI 公開準備を整える
- [ ] `main` ブランチで `delta init --force` → `pytest` → `delta update --assistants all` の自己検証フローを GitHub Actions へ追加する
- [ ] 旧 `specline` / `palprompt` ユーザー向けの移行ガイドを README 末尾に入れ、`delta init --migrate-specline` のような互換オプションを検討する
- [ ] 変更完了後に version bump + git tag + release notes を発行し、`docs/deltacontext.md` と同じナラティブでリリース項目を整理する

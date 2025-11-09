# 作業計画書 (チェックリスト)

## 0. コンセプトと方針
- [x] `docs/concept.md` を最終確認し、CLI/プロンプト方針やローカライズ戦略に抜け漏れがないかレビューする
- [x] `specline init`（互換: `palprompt init`）実行時の生成物と、`specline/` ディレクトリ構成のマイグレーション手順を確認する

## 1. CLI スケルトン整備
- [x] `spec_line` パッケージに `specline` CLI エントリポイント（alias `palprompt`）を追加し、`init` サブコマンドのみ実装する
- [x] 依存管理に `uv` を利用し、`uv add pytest` でテスト環境を整える
- [x] `pytest` ベースの CLI テスト（例: `tests/test_cli_init.py`）を作成し、`specline init`（alias `palprompt init`）が `specline/` ディレクトリ構造と初期テンプレート（AGENTS.md、project.md、prompts/…）を生成することを自動検証する
- [x] 既存 `openspec/` が存在する場合 `specline/` へマイグレーションする処理を実装し、pytest で差分確認を含めたテストを追加する

## 2. プロンプトテンプレート多言語対応
- [x] `specline/prompts/` にテンプレートを整備し、デフォルトでは英語版が展開されることを確認する
- [x] `LANG` などのロケール環境変数から日本語が推定される環境で日本語版が自動的に展開されるよう多言語対応を実装する
- [x] 他言語の追加方法とフォールバック動作を README へ記載する
- [x] `pytest` でローカライズ選択のテスト（`LANG` を切り替え → `specline-xx.md` の内容が該当言語になるか）を追加する

## 3. AI アシスタント連携
- [x] `specline init` で各アシスタント向けディレクトリ（`.claude/commands/specline/` など）を自動生成し、`specline/prompts/` からシンボリックリンクまたはコピーを行う
- [x] `specline-update` プロンプト実行時に全ディレクトリが最新テンプレートへ同期される仕組みを構築する（言語判定は `LANG` 等の標準環境変数を使用）
- [x] 対応外ツール向けの拡張方法を `AGENTS.md` に追記する
- [x] `pytest` で主要アシスタント向けディレクトリが生成されるか、リンク/コピーが正しく張られるかを検証する

## 4. ワークフロー実装 (M1 → M3)
- [ ] **M1:** 最小機能（CLI init と prompts 配置）を `specline-propose` / `specline-apply` / `specline-archive` の 5 フェーズフローで完結させる
- [ ] **M2:** 変更管理ワークフロー（`specline-propose` テンプレや `specline-apply` ログ）を整備し、仕様 `specline/specs/cli-change` へ反映する
- [ ] **M3:** ダッシュボード/ドキュメント整備など追加機能を実装し、ロードマップ通り `specline-archive` まで完走する
- [ ] 各マイルストーン完了時に `pytest` の回帰テストを実行し、CLI/プロンプトが期待通り動作することを確認する

## 4.5 5 フェーズテンプレートへの再編
- [ ] `docs/generation.md` で定義した Concept / Roadmap / Propose / Apply / Archive の 5 リズムに合わせ、各 `specline-*.md` テンプレートの見出し構成と必須出力を更新する
- [ ] Propose フェーズ向けテンプレート（`specline-propose`）の粒度を固め、英語・日本語版へ同時反映する
- [ ] Apply フェーズ向けテンプレート（`specline-apply`）に品質ゲート情報を統合し、冗長な重複セクションを削除する
- [ ] テンプレート変更後に `.claude/` `.cursor/` `.github/` などへの同期結果を確認し、既存プロンプト利用手順への影響を README/AGENTS.md に追記する

## 5. ドキュメントとリリース準備
- [ ] README に `specline init` / `specline update`（alias: `palprompt ...`）の使い方、ローカライズ、各 AI ツール連携手順を記載する
- [ ] `docs/concept.md`・`docs/analysis.md` の最新化を確認し、必要なら changelog を作成する
- [ ] `specline-propose add-python-cli-clone` の `tasks.md` をすべて完了に更新し、`specline validate --all` をパスしたら `specline archive` で作業を確定する

## 6. プロンプト検証基準
- [ ] `specline-concept`: `docs/concept.md` 向け見出し構成・必須セクションを明文化し、Markdown lint で検証する
- [ ] `specline-roadmap`: Milestone 表の列構成（Milestone/Scope/Deliverables/Acceptance/Dependencies/change-id）と依存順序の検証を pytest で実装する
- [ ] `specline-propose`: proposal/tasks/spec 生成後に `specline validate` だけでなく diff/lint を実行し、完了条件をテンプレ内で宣言する
- [ ] `specline-apply`: tasks.md と進捗レポートの整合、実行コマンドログ、`specline validate` 成功基準をテンプレに明記し、pytest で検証する
- [ ] `specline-archive`: 日本語環境では docs/ 配下に日英 2 文書をアーカイブする指示を追加し、検証ステップを整備する（英語環境は英語のみ）
- [ ] `specline-update`: 更新対象ディレクトリと diff 記録のフォーマット、実行後チェックリストをテンプレに明記する
- [ ] 共通: propose / apply / archive が内部で `specline validate`（または `specline verify`）を呼び出し成功を確認するワークフローをテンプレに追記し、pytest で検証する
- [ ] 共通: specline/prompts や specline/commands におけるフォーマット・検証基準を `docs/prompt_review.md` の観点（フォーマット、検証、言語、依存整合）で維持する

## 7. プロジェクト名の SpecLine への改称計画
- [ ] リポジトリと Python パッケージの名称（旧 `team-pal-prompts`, `team_pal_prompts`）を `SpecLine` / `spec_line` として維持するため、pyproject・import・テスト・CLI エントリポイントを定期的に確認する。
- [ ] CLI ブランド表記とバイナリ名が `specline`（alias: `palprompt`）で統一されているか確認し、必要なら追加サブコマンドや互換方針を決定する。
- [ ] `README.md`、`docs/`、`AGENTS.md`、`specline/prompts/` など全てのドキュメントに登場する旧名称を `SpecLine` に更新するための手順を策定し、レビュー観点（スクリーンショット、コード例、バッジ等の差し替え）を整理する。
- [ ] テストやパスに組み込まれた旧名称（例: `.claude/commands/palprompt/`）をどう扱うか決め、互換性維持のための移行ステップ（マイグレーションスクリプト、deprecation note）を計画する。
- [ ] 変更適用後に `specline init`（互換エイリアス `palprompt init`）と `pytest` を走らせて問題ないことを確認し、必要に応じて release note / changelog の更新、バージョン番号インクリメントを行う。

# 作業計画書 (チェックリスト)

## 0. コンセプトと方針
- [ ] `docs/concept.md` を最終確認し、CLI/プロンプト方針やローカライズ戦略に抜け漏れがないかレビューする
- [ ] `palprompt init` 実行時の生成物と、`pal/` ディレクトリ構成のマイグレーション手順を確認する

## 1. CLI スケルトン整備
- [ ] `team_pal_prompts` パッケージに `palprompt` CLI エントリポイントを追加し、`init` サブコマンドのみ実装する
- [ ] 依存管理に `uv` を利用し、`uv add pytest` でテスト環境を整える
- [ ] `pytest` ベースの CLI テスト（例: `tests/test_cli_init.py`）を作成し、`palprompt init` が `pal/` ディレクトリ構造と初期テンプレート（AGENTS.md、project.md、prompts/…）を生成することを自動検証する
- [ ] 既存 `openspec/` が存在する場合 `pal/` へマイグレーションする処理を実装し、pytest で差分確認を含めたテストを追加する

## 2. プロンプトテンプレート多言語対応
- [ ] `pal/prompts/` に英語版テンプレート（`pal-xx.en.md`）を整備する
- [ ] 日本語版テンプレート（`pal-xx.ja.md`）を追加し、`LANG` などのロケール環境変数から日本語が推定される環境で正しく展開されることを確認する
- [ ] 他言語の追加方法とフォールバック動作を README へ記載する
- [ ] `pytest` でローカライズ選択のテスト（`LANG` を切り替え → 対応する `pal-xx.ja.md` が配置されるか）を追加する

## 3. AI アシスタント連携
- [ ] `palprompt init` で各アシスタント向けディレクトリ（.claude/…, .cursor/…, .github/prompts/…, など）を自動生成し、`pal/prompts/` からシンボリックリンクまたはコピーを行う
- [ ] `pal-update` プロンプト実行時に全ディレクトリが最新テンプレートへ同期される仕組みを構築する（言語判定は `LANG` 等の標準環境変数を使用）
- [ ] 対応外ツール向けの拡張方法を `AGENTS.md` に追記する
- [ ] `pytest` で主要アシスタント向けディレクトリが生成されるか、リンク/コピーが正しく張られるかを検証する

## 4. ワークフロー実装 (M1 → M3)
- [ ] **M1:** 最小機能（CLI init と prompts 配置）を `pal-change` / `pal-build` / `pal-validate` / `pal-archive` のフローで完結させる
- [ ] **M2:** 変更管理ワークフロー（`pal-change` テンプレや `pal-validate` ログ）を整備し、仕様 `pal/specs/cli-change` へ反映する
- [ ] **M3:** ダッシュボード/ドキュメント整備など追加機能を実装し、ロードマップ通り `pal-archive` まで完走する
- [ ] 各マイルストーン完了時に `pytest` の回帰テストを実行し、CLI/プロンプトが期待通り動作することを確認する

## 5. ドキュメントとリリース準備
- [ ] README に `palprompt init` の使い方、ローカライズ、各 AI ツール連携手順を記載する
- [ ] `docs/concept.md`・`docs/analysis.md` の最新化を確認し、必要なら changelog を作成する
- [ ] `pal-change add-python-cli-clone` の `tasks.md` をすべて完了に更新し、`palprompt validate --all` をパスしたら `palprompt archive` で作業を確定する

## 6. プロンプト検証基準
- [ ] `pal-concept`: 生成された Markdown が定義された見出し構造と必須セクションを持つか lint (pytest + markdownlint) などで検証する
- [ ] `pal-roadmap`: 出力されたマイルストーンが M1 以降を網羅し、各項目に scope/成果物/判定条件が存在するか自動チェックする pytest を追加する
- [ ] `pal-change`: 生成された proposal/tasks/spec が `palprompt validate` に合格することを pytest で検証する
- [ ] `pal-build`: 進捗レポート生成ロジックが `tasks.md` と整合しているか（例: モックのタスクファイルで検証）を pytest で確認する
- [ ] `pal-spec`: 差分出力が OpenSpec 規約（Requirement/Scenario 構造）に一致するかを pytest（または schema check）で行う
- [ ] `pal-validate`: エラー/警告メッセージに修正手順が含まれているかを pytest で検証する
- [ ] `pal-archive`: チェックリストが未完了タスクを検知し、デルタ概要を列挙するか確認する pytest を追加する
- [ ] `pal-update`: 言語ファイルの同期と欠落補填が行われるかを pytest で検証する

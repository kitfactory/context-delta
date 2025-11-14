# npm 移行専用計画

このチェックリストに沿って Python 製 Context Delta CLI を npm パッケージへ移行する。

## 1. 現行 CLI の要件洗い出し
- [x] `src/context_delta/cli.py` / `scaffold.py` / `tests/test_cli_init.py` の挙動を整理し、コマンド、フラグ、入出力、テンプレ構成、ロケール/アシスタント処理、環境変数依存 (`CODEX_HOME` など) を一覧化する
- [x] 既存ドキュメント（README, docs/*, context-delta/AGENTS.md）から CLI 仕様やユーザーフローに関する記述を抽出し、移行後も維持すべき要素を整理する

## 2. Node.js アーキテクチャ設計
- [x] TypeScript/JavaScript の選択、`src/`/`bin/` 構成、テンプレ資産の配置方針、利用ライブラリ（例: `commander`, `fs-extra`, `inquirer` 等）を決定する
- [x] npm でのビルド/配布フロー（`package.json` スクリプト、`tsconfig.json` や `eslint`/`prettier` 設定、`npm publish` 手順）を設計し、必要な開発・実行依存を列挙する

## 3. Node 実装とテンプレ移植
- [x] `delta init` / `delta update` のロジックを Node で実装し、テンプレ文字列・ディレクトリ生成・アシスタント別コピー・ロケール検出・`AGENTS.md` 更新など Python 版の機能を移植する
- [x] 既存テンプレ資産（prompt templates, project/agents bootstrap など）を JavaScript から参照できる形で再配置し、多言語切り替えや `--assistants` オプションが機能するよう整備する
- [x] Node 版の単体/統合テスト（例: `vitest`, `jest`, `tsx` 実行テスト）を追加し、Python 版 `tests/test_cli_init.py` がカバーしていたシナリオを再現する

## 4. npm パッケージ化と Python 資産整理
- [x] `package.json`, `tsconfig.json`, `bin/delta` など npm 用ファイルを追加し、`npx delta` やグローバルインストールで CLI を呼び出せるようにする
- [x] Python 関連ファイル（`pyproject.toml`, `src/context_delta`, egg-info, テスト等）を段階的に削除または Node 版へ差し替え、ビルド/CI が Node 依存に切り替わるよう調整する
- [x] バージョン管理（`package.json` の version, git tag 方針）と公開先（npm registry）の命名・アクセス権を決定し、最終的な公開手順を文書化する

## 5. ドキュメント・CI 更新
- [x] README, docs/*, context-delta/AGENTS.md を npm CLI 前提に書き換え、インストール方法、コマンド例、開発フローを最新化する
- [x] CI（GitHub Actions 等）を Node ベースのテスト/ビルド/パッケージ検証に更新し、`delta init`/`delta update` のエンドツーエンドテストを含める
- [x] （旧 Python 版は未リリースのため移行ガイド不要。npm リリースノートのみ Step 4-3 のフローで管理）

## 6. PromptCard インデックスと delta 連携
- [x] `delta card sync` を実装し、`context-delta/promptcards/` 以下を走査して `docs/promptcards/registry.(md|json)` を再生成する。Front Matter (`id`, `version`, `status`, `targets`, `purpose`) を抽出し、CLI から即時参照できるインデックスを整備する
- [x] `delta propose` 実行時に対象文書へ紐付く PromptCard を自動検出し、Guidance/Questions/Rubric を優先的に使って下書きを生成する。PromptCard がない場合のフォールバックも定義する
- [x] `delta apply` / `delta archive` で PromptCard のテンプレ／チェックリスト／Changelog 指針を参照し、成果物の目次や検証ログ（`context-delta validate`）がカード準拠になるようにする
- [x] `delta verify` で PromptCard の Rubric/evaluation セクションを読み込み、自動採点と Pass/Borderline/Fail 判定を行う。Rubric 形式のバリデーションと失点観点の改善提案出力も含める

### 必要文書（PromptCard プレインストール対象）
- [x] プロダクト要求仕様書 (Product Requirements)
- [x] システム要求仕様書 (EARS/SRS)
- [x] ビヘイビア仕様書
- [x] モデル仕様書
- [x] API仕様書
- [x] データ仕様書
- [x] アーキテクチャ設計書
- [x] デリバリープラン / タスク計画
- [x] モジュール設計書

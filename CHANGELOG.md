# Changelog

すべての notable な変更はこのファイルで管理します。バージョン付けは `docs/npm-release.md` の手順に従い、`npm version` と Git タグで更新してください。

## [0.0.7] - 2025-11-14

### Added
- delta list/delete コマンドと対応するカスタムプロンプトを追加し、未アーカイブの delta 管理を簡易化。
- PromptCard インデックスの出力先を `context-delta/promptcards/index.json` に統一。
- propose/apply/verify/archive プロンプトを現行フォルダ構造前提に整理し、粒度・連続性・テスト・関連文書整合・不明点質問のガードレールを強化。

## [0.0.6] - 2025-11-14

### Fixed
- `delta` 実行時に `package.json` を探索するルート解決を改良し、`dist/` ビルド成果物から CLI を実行してもテンプレートや資産を見失わないようにしました。

## [0.0.5] - 2025-11-14

### Added
- Node.js 版 Context Delta CLI (`bin/delta.ts`) とサービス層（assistants / filesystem / templates / context）。
- `templates/` ディレクトリに delta プロンプトとブートストラップ資産を移設。
- Vitest による CLI E2E テスト (`tests/node-cli/context.test.ts`)。
- npm 用のツールチェーン (`package.json` scripts, `tsconfig*.json`, `tsup.config.ts`, `eslint.config.js`) と GitHub Actions workflow (`.github/workflows/node-ci.yml`)。
- リリース手順 (`docs/npm-release.md`) と npm 用の README 更新。

### Removed
- Python 実装 (`pyproject.toml`, `src/context_delta/`, pytest ベースのテスト) と関連ビルド成果物。

### Notes
- まだ npm registry へは公開していません。`docs/npm-release.md` を参照して初回リリースを行ってください。

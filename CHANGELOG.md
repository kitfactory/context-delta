# Changelog

すべての notable な変更はこのファイルで管理します。バージョン付けは `docs/npm-release.md` の手順に従い、`npm version` と Git タグで更新してください。

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

# npm リリース手順

Node 版 Context Delta CLI のバージョン管理と公開フローをここに集約する。`plan.md` Step 4-3 の要件を満たすため、リポジトリ共通の手順として維持する。

## バージョン方針
- `package.json` の `version` を単一の真実とし、セマンティックバージョニングを適用する。
- Python 版と同じメジャー/マイナー系列を引き継ぐ。npm での初回公開時は既存の `0.0.x` 系を維持しつつ、安定したら `1.0.0` へ昇格する。
- 変更は `npm version <patch|minor|major>` で反映し、Git タグ（例: `v0.1.0`）を自動発行させる。タグは GitHub Release にも利用する。

## リリース前チェック
1. 依存関係を最新に揃える: `npm install`（ロックファイルをコミット）。
2. 品質ゲート: `npm run lint && npm run test && npm run build`  
   - `lint`: ESLint + Prettier 互換ルールで TypeScript を検証  
   - `test`: Vitest で CLI の init/update/assistants シナリオを実行  
   - `build`: `tsup` + `tsc` で `dist/delta.js` を生成（shebang 付き ESM）
3. 変更ログかリリースノート草稿を用意（Step 5 の docs 更新タスクと連動）。

## 公開手順
1. `npm version <patch|minor|major>`  
   - 自動で `package-lock.json` も更新される。  
   - Git タグ `vX.Y.Z` が作成されるので push 時に `--follow-tags` を付与。
2. `npm publish --access public`  
   - 事前に `npm login` 済みのメンテナンスアカウントを使用。  
   - `files` 設定で `dist/`, `templates/`, `README.md`, `docs/npm-architecture.md` が含まれていることを確認。
3. `git push origin main --follow-tags`
4. GitHub Release を作成し、npm 公開と同じバージョンを入力。変更点と検証結果をここで共有。

## フォローアップ
- README / docs を該当バージョンに合わせて更新（Step 5）。
- リリースノートやブログ等で npm 版の変更点と `delta` コマンド（`npm install -g context-delta` で提供）の使い方を共有する。
- 必要に応じて `npm deprecate context-delta@<old>` で旧バージョンへの警告を表示する。

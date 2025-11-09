# プロンプト生成ドキュメントの概要

SpecLine には英語・日本語合わせて 6 種類のコアテンプレートが含まれます。OpenSpec ユーザーが馴染みやすいよう、テンプレートを Concept / Roadmap / Propose / Apply / Archive の 5 リズムに整理し、各フェーズで生成される文書をまとめています。これにより OpenSpec の propose → apply → archive をベースにしつつ、上流のコンセプト整理とロードマップ策定を明示的に扱えます。

## 共通動作
- テンプレートは `specline/prompts/` に配置され、`specline init`（旧 `palprompt init`）で初期生成、`specline update` で更新されます。CLI はさらに `.claude/`、`.cursor/`、`.github/`、`specline/commands/`、`$CODEX_HOME/prompts`（未設定時は `~/.codex/prompts/`）へ同じファイル名の `specline-*.md` をコピーします。初期化時には対話的にツール選択を促し、Enter で全インストール、`--assistants claude,cursor,codex` のようにフラグ指定することで対象ツールを絞れます。
- 言語は `LANG` などのロケールから自動推定され、ja 系なら日本語版、それ以外は英語版がインストールされます。ファイル名に言語サフィックスは付かず、中身のみ翻訳されます（必要に応じて `specline update` を再実行すると切り替え可能）。

## フェーズ別テンプレート

### Concept フェーズ
- **specline-concept (`specline-concept.md`)**  
  `docs/concept.md` 向けの最新サマリーを作成します。ワークフローの目的、CLI とプロンプトの責務分担、ローカライズ戦略、`specline/` ディレクトリ構成を必ず含めます。

### Roadmap フェーズ
- **specline-roadmap (`specline-roadmap.md`)**  
  要求された機能をマイルストーン単位に分解し、各マイルストーンのスコープ・成果物・受け入れ条件・ change-id（英語版では依存関係セクション付き）を Markdown 表で提示します。

### Propose フェーズ
- **specline-propose (`specline-propose.md`)**  
  `{change_id}` の proposal / tasks / spec をまとめて作成します。Why / What / Impact と成功指標、番号付き `- [ ]` タスク、ADDED / MODIFIED / REMOVED + `#### Scenario` 形式のデルタを一貫した Markdown として出力し、未解決の質問や依存、`specline validate {change_id}` に通すための注意点も含めます。

### Apply フェーズ
- **specline-apply (`specline-apply.md`)**  
  Apply フェーズの進捗共有テンプレートです。tasks.md の最新状態、実行したコマンドやテスト結果、コード差分と TODO、`specline validate {change_id}`（または `--all`）の結果と対処方針、次のアクションやリスクを一度にまとめます。

### Archive フェーズ
- **specline-archive (`specline-archive.md`)**  
  アーカイブ前の確認ドキュメントです。未完了タスクがないことを確認し、最終的に specs へ反映されるデルタ、追加ドキュメント、最後に実行すべきコマンド（archive 実行や git commit 等）をまとめます。

### 補助テンプレート
- **specline-update (`specline-update.md`)**  
  テンプレート更新手順を案内します。更新対象ディレクトリ（`specline/prompts` や各アシスタント用フォルダ）、追加・削除されたファイル、更新後に実施する手動チェック事項を列挙し、フェーズ横断のメンテナンスに利用します。

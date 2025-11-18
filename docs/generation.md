# プロンプト生成ドキュメントの概要

Context Delta には英語・日本語合わせて 6 種類のコアテンプレートが含まれます。OpenSpec ユーザーが馴染みやすいよう、テンプレートを Concept / Roadmap / Propose / Apply / Archive の 5 リズムに整理し、各フェーズで生成される文書をまとめています。これにより OpenSpec の propose → apply → archive をベースにしつつ、上流のコンセプト整理とロードマップ策定を明示的に扱えます。

## 共通動作
- テンプレートは `context-delta/prompts/` に配置され、`delta init`（エイリアス `context-delta init`）で初期生成、`delta update` で更新されます。CLI はさらに `.claude/`、`.cursor/`、`.github/`、`context-delta/commands/`、`$CODEX_HOME/prompts`（未設定時は `~/.codex/prompts/`）へ同じファイル名の `delta-*.md` をコピーします。初期化時には対話的にツール選択を促し、Enter で全インストール、`--assistants claude,cursor,codex` のようにフラグ指定することで対象ツールを絞れます。
- 言語は `LANG` などのロケールから自動推定され、ja 系なら日本語版、それ以外は英語版がインストールされます。ファイル名に言語サフィックスは付かず、中身のみ翻訳されます（必要に応じて `delta update` を再実行すると切り替え可能）。

## フェーズ別テンプレート

### Concept フェーズ
- **delta-concept (`delta-concept.md`)**  
  `context-delta/concept.md` に内部メモを作成し、`delta-archive` が承認済み内容を `docs/prd.md`（PRD）へ反映します。ワークフローの目的、CLI とプロンプトの責務、ローカライズ方針、`context-delta/` ディレクトリ構成を必ず含めます。

### Roadmap フェーズ
- **delta-roadmap (`delta-roadmap.md`)**  
  要求された機能を基礎→応用の細粒度マイルストーンに分解し、各マイルストーンのスコープ・成果物・受け入れ条件・ change-id と依存関係を Markdown 表で提示します。依存は常に先行フェーズ（準備機能）を指し、`## Notes` でなぜその順序が手戻りを防ぐかを明文化します。

### Propose フェーズ
- **delta-propose (`delta-propose.md`)**  
  `{change_id}` の proposal / tasks / spec をまとめて作成します。Why / What / Impact と成功指標、番号付き `- [ ]` タスク、ADDED / MODIFIED / REMOVED + `#### Scenario` 形式のデルタを一貫した Markdown として出力し、未解決の質問や依存、`context-delta validate {change_id}` に通すための注意点も含めます。

### Verify フェーズ
- **delta-verify (`delta-verify.md`)**  
  PromptCard の Rubric/Regression を読み込み、対象ドキュメントを観点別に採点します。Pass/Borderline/Fail 判定、観点ごとのスコア表、失点理由、Regression セットとの差分、次に取るべき改善アクション（`## Actions`）をまとめ、`context-delta validate --all` などの検証結果も引用して品質ゲートとして利用します。

### Apply フェーズ
- **delta-apply (`delta-apply.md`)**  
  Apply フェーズの進捗共有テンプレートです。tasks.md の最新状態、実行したコマンドやテスト結果、コード差分と TODO、`context-delta validate {change_id}`（または `--all`）の結果と対処方針、次のアクションやリスクを一度にまとめます。

### Archive フェーズ
- **delta-archive (`delta-archive.md`)**  
  アーカイブ前の確認ドキュメントです。未完了タスクがないことを確認し、最終的に specs へ反映されるデルタ、追加ドキュメント、最後に実行すべきコマンド（archive 実行や git commit 等）をまとめます。

### 補助テンプレート
- **delta-update (`delta-update.md`)**  
  テンプレート更新手順を案内します。更新対象ディレクトリ（`context-delta/prompts` や各アシスタント用フォルダ）、追加・削除されたファイル、更新後に実施する手動チェック事項を列挙し、フェーズ横断のメンテナンスに利用します。

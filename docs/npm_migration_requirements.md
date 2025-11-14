# npm 移行要件整理

Python 版 Context Delta CLI の挙動と関連ドキュメントを棚卸しし、npm 版で再現・維持すべき仕様をまとめる。

## 1. CLI / テンプレ / テストから判明した要件
- コマンド構成: `delta init` / `delta update`（`context-delta` エイリアスあり）。`init` は `--force`, `--path`, `--assistants`, `--update-root-agents` を受け取り、`update` は `--path`, `--assistants` を受け取る（src/context_delta/cli.py）。
- `--assistants` 省略時は `DEFAULT_ASSISTANTS = (claude, cursor, github, context-delta, codex)` を対象とし、未指定かつ対話可能な端末ならインタラクティブに選択肢を提示する。`all` または空入力で全選択（src/context_delta/cli.py）。
- `STATE_DIR = context-delta`、`DIRECTORY_SKELETON`（prompts/specs/changesなど）を生成し、`.gitkeep` を仕様とする。`LEGACY_STATE_DIRS = (specline, pal)` から自動移行（src/context_delta/scaffold.py）。
- `LANG` またはロケールから言語コードを推定し、`PROMPT_TEMPLATES` の `en` / `ja` を切り替えて `delta-*.md` を展開。言語キー不一致時は英語フォールバック（src/context_delta/scaffold.py）。
- `openspec/` ディレクトリが存在する場合は `AGENTS.md`, `project.md`, `specs/`, `changes/` を `context-delta/` に移行する（src/context_delta/scaffold.py）。
- 各アシスタント用コピー先: `.claude/commands/context-delta/`, `.cursor/prompts/context-delta/`, `.github/prompts/context-delta/`, `context-delta/commands/`, `CODEX_HOME/prompts`（未設定時は `~/.codex/prompts`、HOME が取れない場合はリポジトリ内 `.codex/prompts`）。すべて `delta-*.md` ファイルを同期する（src/context_delta/scaffold.py, README.md）。
- `--update-root-agents` 指定時はルート `AGENTS.md` にブートストラップ文言を書き込み、`context-delta/AGENTS.md` を参照させる（src/context_delta/cli.py, scaffold.py）。
- テスト要件（tests/test_cli_init.py）:  
  1. `delta init` で `context-delta/` 構造とテンプレ生成  
  2. `LANG` が `ja_JP` の場合に日本語テンプレが展開される  
  3. `openspec/` からの移行が行われる  
  4. 選択したアシスタントのディレクトリだけが生成される  
  5. `delta update` がテンプレ最新化とアシスタント再同期を行う  
  6. `--update-root-agents` がルート `AGENTS.md` を置き換える

## 2. ドキュメントから読み取れる期待仕様
- README.md では pip/uv でのインストール後に `delta --help` を実行する流れを案内。npm 版でも `delta --help`（`npm install -g context-delta` が前提）への読み替えが必要。
- `delta init` の説明に以下の要素が含まれるため、npm 版も同じ挙動を維持する:  
  - `context-delta/` 配下の標準ツリー生成  
  - ロケールによる言語切替  
  - アシスタント別フォルダへのコピーと `CODEX_HOME` フォールバック  
  - `openspec/` からの移行手順  
  - インタラクティブなアシスタント選択と `--assistants` 明示指定  
  - `--update-root-agents` によるブートストラップ更新（README.md, docs/concept.md, docs/generation.md）
- `delta update` は `context-delta/prompts/` の上書きとアシスタント同期を担い、`--assistants` で対象絞り込み可能（README.md, docs/generation.md）。
- `docs/concept.md` に「CLI 操作は `delta init` / `delta update` のみ」「init 時の対話選択」の方針が記載されているため、npm 版でも CLI のミニマリズムとユーザーフローを変えないこと。
- `docs/generation.md` ではテンプレ拡散先、`delta update` の役割、`CODEX_HOME` の扱いが明文化されている。npm 化後も同じディレクトリにファイルを配置する必要がある。
- `docs/prompt_review.md` では `delta-*.md` が英語/日本語の本文を持ち、インストール時に単一言語へ展開する旨が説明されているため、テンプレ配布仕様を維持する。
- README の全体フロー（delta-concept→roadmap→propose→apply→archive→update）やテンプレ一覧も引き続き正しい状態に保つ必要がある。

上記内容を npm 実装とドキュメント更新に反映すること。

# Context Delta (npm CLI)

Context Delta は、AI アシスタントを **Proactive Delta Context**（差分に閉じたリーンなワークフロー）で動かすための CLI です。`delta propose → delta apply → delta verify → delta archive` の最小ループと管理系コマンド（`delta list` / `delta delete`）を使い、「必要な差分だけを高品質に生成 → 適用 → 履歴化」します。詳細な背景は `docs/proactive-delta-context.md` とアーキテクチャ仕様 `docs/context-delta-architecture-doc_type-promptcard.md` を参照してください。

## Context Delta を使う理由

| 課題 | Context Delta の解決策 |
| --- | --- |
| AI が広範囲を再生成して手戻りが増える | Proactive Delta Context により「差分だけ」を propose→apply→verify→archive の一個流しで処理 |
| プロンプト品質が属人的で再現できない | PromptCard（PRD/SRS/仕様/設計/タスク計画など）に Rubric/Regression を持たせ、`delta verify` で自動採点 |
| 各 AI ツールでプロンプトがバラバラ | `delta-*.md` を claude/cursor/codex などへ同期し、同じ出力手順を共有 |
| プロジェクト固有のテンプレを合わせたい | PromptCard を編集・追加し `delta card sync` でレジストリ化 → 直ちに delta コマンドが参照 |

`delta init` 後は AI アシスタントに `delta propose → delta apply → delta verify → delta archive` を順番に実行させ、人間がレビュー・承認するだけでリーンな差分フローを回せます。未アーカイブの delta は `delta list` で確認し、不要なものは `delta delete` で整理します。

## インストールと利用方法

Node.js 20+ が必要です。グローバルにインストールすれば `delta` コマンドを直接使えます。

```bash
npm install -g context-delta
delta --help
```

> **Note:** 一時的に使うだけなら `npx context-delta --help` でも動作しますが、以下の説明ではすべて `delta ...` を使用しています。

開発者として CLI をハックする場合は以下を実行します:

```bash
git clone https://github.com/.../team-pal-prompts.git
cd team-pal-prompts
npm install            # 依存解決
npm run dev -- --help  # tsx で TypeScript CLI を直接実行
```

主要スクリプト:

| コマンド | 役割 |
|----------|------|
| `npm run build` | `tsc` + `tsup` で `dist/delta.js` を生成 |
| `npm run test` | Vitest で `tests/node-cli` を実行 |
| `npm run lint` | ESLint + Prettier 設定で TypeScript を検証 |

## 使い方

### AI アシスタントとの連携

1. `delta init` で `context-delta/` 構造と `delta-*.md` をインストールします。  
2. 利用する AI アシスタント（Claude, Cursor, GitHub Copilot, Codex など）から、以下の順にカスタムプロンプトを実行し、文書やタスクを生成してもらいます。  
   - `delta-propose` で delta の候補を作成 → `delta list` で未アーカイブの delta を確認 → 選んだ delta に対して `delta-apply` → `delta-verify` → `delta-archive`  
   - 不要な提案は `delta-delete` で削除します。  
3. 生成物をレビューし、必要なら PromptCard を編集 → `delta card sync` → `delta verify` で再検証します。  

この「AI が書き、開発者が承認する」手順が Context Delta の基本ワークフローです。

### プロジェクト初期化
```bash
delta init
```
実行すると以下を行います:
- `context-delta/` 以下に project.md、AGENTS.md、specs/、changes/、prompts/ を生成
- `LANG` などのロケール情報から日本語が検出された場合は `delta-*.md` が日本語版で展開され、それ以外は英語版が展開されます（ファイル名への言語サフィックスは付きません）
- `.claude/commands/context-delta/` など各 AI アシスタント向けフォルダへプロンプトをコピー（Codex は `CODEX_HOME/prompts`、環境変数がなければ `~/.codex/prompts/` を使用。ホームが取得できない環境のみリポジトリ内 `.codex/prompts/` へ格納）
- 既存の `openspec/` や過去バージョンの state ディレクトリがあれば AGENTS.md、project.md、specs/、changes/ を `context-delta/` に移行
- 実行時にインストール対象ツール（Claude/Cursor/GitHub/Codex/ローカル context-delta）を尋ねます。Enter で全選択、`--assistants cursor,codex` のように指定してスクリプト化も可能です。
- `--update-root-agents` を付けると、リポジトリ直下の `AGENTS.md` も `context-delta/AGENTS.md` を参照する最新テンプレートに置き換えられます。

### テンプレート更新
```bash
delta update
```
`context-delta/prompts/` を最新テンプレートで上書きし、各 AI アシスタント用フォルダにも同期します。`--assistants` で対象ツールを絞り込むことも可能です。新しい言語ファイルを追加した場合もこのコマンドで展開できます。

### PromptCard インデックス生成
```bash
delta card sync
```
`context-delta/promptcards/` 配下の PromptCard を走査し、Front Matter 情報（`id`, `version`, `status`, `targets`, `purpose` など）から `docs/promptcards/registry.md` と `docs/promptcards/registry.json` を自動生成します。PromptCard を追加・更新したらこのコマンドを実行し、delta propose/apply/archive/verify から参照できる最新のレジストリを整備してください。

### 生成されるディレクトリ構成
```
context-delta/
├── project.md
├── AGENTS.md
├── prompts/
├── specs/
└── changes/
```

## カスタムプロンプトと推奨使用順序

Context Delta が提供する `delta-*.md` は以下の 6 種類です。通常は propose から archive まで、この順番で AI に依頼します。

| プロンプト | 主な出力内容 | 推奨タイミング |
|------------|--------------|----------------|
| `delta-propose` | delta の候補（id/title/intent/doc_instances/promptcard）を列挙し、次に進めるものを決める | 各 delta 着手時 |
| `delta-apply` | 対象 doc_instance への変更案を作り、before/after/patch を提示 | delta 実装時 |
| `delta-verify` | PromptCard の rubric に沿って意味的な整合性をチェックし、follow-up を提案 | delta の品質確認時 |
| `delta-archive` | 変更の要約・patch・doc_instance 記録を残し、次回 propose の入力にする | delta 完了時 |
| `delta-list` | 未アーカイブ（proposed / apply-in-progress / verify-in-progress）の delta 一覧を表示 | 並行タスクの確認時 |
| `delta-delete` | 未着手（proposed）の delta を削除し、不要な候補を整理 | 誤提案の廃棄時 |

> **Note:** context-delta/OpenSpec の archive プロンプトは docs や specs への変更を自動適用しません。チェックリストとデルタ表を確認しながら、最終的なドキュメント反映は開発者が手動で行う運用になっています。

## Proactive Delta Context

Context Delta のフローはリーン開発の「一個流し」を LLM 開発へ適用した **Proactive Delta Context** に基づいています。

- `delta propose → delta apply → delta verify → delta archive` の差分フローに、`delta list/delete` で未処理デルタを管理しつつ、変更を止めずに流す  
- PromptCard が doc_type ごとの成果物仕様を定義し、`delta card sync` が常に最新の差分文脈を提供  
- これにより過剰生産・再生成・不良流出といったムダを抑え、LLM と人間の協働を差分単位で標準化  

リーン観点での詳細や各コマンドの役割は `docs/proactive-delta-context.md` を参照してください。

## PromptCard とカスタマイズ

Context Delta には、doc_type ごとに Markdown で定義された PromptCard を同梱しています（例: `promptcards/req.usdm/*.md`）。初期の最小 doc_type セットは `req.usdm`（要求）、`spec.api`（API仕様）、`design.arch_overview`（アーキ概要）、`test.plan`（テスト計画）、`ops.runbook`（運用手順）、`delta.summary`（変更サマリ）です。

各カードは Intent・Guidance・Rubric を備え、`delta propose/apply/verify/archive` と組み合わせることで安定したドキュメントを生成できます。カードを追加・編集したら、`delta card sync` で `promptcards/index.json`（例）などのレジストリを再生成し、CLI と AI エージェントが doc_type/PromptCard 対応を即座に認識できるようにしてください。

PromptCard の構造や運用については `docs/context-delta-architecture-doc_type-promptcard.md` を参照してください。

## テストカバレッジ

`tests/node-cli/context.test.ts` では以下を検証します:
- `delta init`（およびエイリアス `context-delta init`）がディレクトリとテンプレートを生成するか
- `LANG` に応じてローカライズ済みプロンプトが作成されるか
- 既存 `openspec/` や旧 state ディレクトリの内容が `context-delta/` へ移行されるか
- 選択したツール（Claude/Cursor/Codex など）のフォルダにプロンプトが同期されるか
- `delta update` がテンプレ最新化とアシスタント再同期を行うか
- `--update-root-agents` がルート `AGENTS.md` を置き換えるか

## 今後の予定

- PromptCard と doc_type セットの拡充（ドメイン別テンプレートの追加）
- PromptCard インデックス生成と `delta list` 連携の改善
- README にチュートリアル例やベストプラクティスの追加

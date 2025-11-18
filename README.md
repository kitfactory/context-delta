# Context Delta (npm CLI)

Context Delta は、AI アシスタントを **Proactive Delta Context**（差分に閉じたリーンなワークフロー）で動かすための CLI です。`delta concept → delta propose → delta verify → delta apply → delta archive` の流れと PromptCard を使い、「必要な差分だけを高品質に生成 → 適用 → 履歴化」します。詳細な背景は `docs/proactive-delta-context.md` を参照してください。

## Context Delta を使う理由

| 課題 | Context Delta の解決策 |
| --- | --- |
| AI が広範囲を再生成して手戻りが増える | Proactive Delta Context により「差分だけ」を concept→propose→apply→archive の一個流しで処理 |
| プロンプト品質が属人的で再現できない | PromptCard（PRD/SRS/仕様/設計/タスク計画など）に Rubric/Regression を持たせ、`delta verify` で自動採点 |
| 各 AI ツールでプロンプトがバラバラ | `delta-*.md` を claude/cursor/codex などへ同期し、同じ出力手順を共有 |
| プロジェクト固有のテンプレを合わせたい | PromptCard を編集・追加し `delta card sync` でレジストリ化 → 直ちに delta コマンドが参照 |

`delta init` 後は AI アシスタントに `delta-concept → delta-roadmap → delta-propose → delta-verify → delta-apply → delta-archive` を順番に実行させ、人間がレビュー・承認するだけでリーンな差分フローを回せます。

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
   - `delta-concept` → `delta-roadmap` → `delta-propose` → `delta-verify` → `delta-apply` → `delta-archive`（必要時に `delta-update`）  
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

Context Delta が提供する `delta-*.md` は以下の 7 種類です。通常はロードマップ策定からアーカイブ完了まで、この順番で AI に依頼します。

| プロンプト | 主な出力内容 | 推奨タイミング |
|------------|--------------|----------------|
| `delta-concept` | `context-delta/concept.md` に Concept Summary / Responsibilities / Localisation / Directory の内部メモを作成。承認後に `delta-archive` で `docs/prd.md`（PRD）へ反映 | プロジェクト初期 / 大きな方針変更時 |
| `delta-roadmap` | `| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |` の表と `## Notes` で、基礎→応用の細粒度マイルストーンと依存順・リスクを記述 | 変更開始前の計画策定時 |
| `delta-propose` | proposal / tasks / spec を規定の章構成で作成し、`context-delta validate {change_id}` 実行結果を proposal に追記 | 各 change-id の着手時 |
| `delta-apply` | Task Status / Commands and Tests / context-delta validate Results / Next Actions の 4 セクションで進捗報告 | 実装中の週次報告・レビュー前 |
| `delta-archive` | タスク完了確認、デルタ要約、検証ログ、最終コマンド列、リリースノート。日本語環境では docs/ に日英 2 文書を生成 | change 完了時 |
| `delta-verify` | PromptCard の Rubric に沿ってドキュメントを採点し、Pass/Borderline/Fail と改善点をまとめる | concept/propose/apply/archive の各節目 |
| `delta-update` | Directories Updated / File Differences / Verification の 3 セクションでテンプレ更新作業を記録 | `delta update` 実行時 |

> **Note:** context-delta/OpenSpec の archive プロンプトは docs や specs への変更を自動適用しません。チェックリストとデルタ表を確認しながら、最終的なドキュメント反映は開発者が手動で行う運用になっています。

## Proactive Delta Context

Context Delta のフローはリーン開発の「一個流し」を LLM 開発へ適用した **Proactive Delta Context** に基づいています。

- `delta concept → delta propose → delta apply → delta archive` の差分フローに `delta verify` が横断的な品質ゲートとして常駐し、変更を止めずに流す  
- PromptCard が成果物仕様（PRD/SRS/Behavior/API/Data/Architecture/Delivery/Module）を定義し、`delta card sync` が常に最新の差分文脈を提供  
- これにより過剰生産・再生成・不良流出といったムダを抑え、LLM と人間の協働を差分単位で標準化  

リーン観点での詳細や各コマンドの役割は `docs/proactive-delta-context.md` を参照してください。

## PromptCard とカスタマイズ

Context Delta はあらかじめ以下の PromptCard を同梱し、成果物の品質基準を機械可読な形で提供します（`context-delta/promptcards/`）。

- プロダクト要求仕様書 (PRD)  
- システム要求仕様書 (EARS/SRS)  
- ビヘイビア仕様書 / モデル仕様書 / API仕様書 / データ仕様書  
- アーキテクチャ設計書 / デリバリープラン / モジュール設計書  

各カードは Intent・Guidance・Rubric・Regression Set を備え、`delta propose/apply/archive/verify` と組み合わせることで安定したドキュメントを生成できます。既存カードを編集したり、自分専用の PromptCard を `context-delta/promptcards/` に追加したら、`delta card sync` を実行して `docs/promptcards/registry.(md|json)` を更新してください。これにより delta コマンドや AI エージェントが新しいカードを即座に認識し、プロジェクト固有の指針に沿った文書を生成できるようになります。

PromptCard の構造や運用については `docs/promptcard.md` を参照してください。

### 全体フロー
1. **概念整理** – `delta-concept` でプロジェクトの目的や CLI/プロンプトの責務、ローカライズ方針を `context-delta/concept.md` にまとめ、最終的な PRD (`docs/prd.md`) 反映は `delta-archive` で行います。
2. **マイルストーン設計** – `delta-roadmap` で機能を基礎→応用の細片に分割し、Milestone 表と依存関係・リスクを明確にします。
3. **フェーズ実行 (繰り返し)**  
   - `delta-propose` で各フェーズの proposal/tasks/spec を生成し、`context-delta validate` を通した状態にします。  
   - `delta-verify` で PromptCard の Rubric/Regression に沿った採点を行い、Pass/Borderline/Fail と改善指針を残します。  
   - 実装中は `delta-apply` を定期的に使って進捗・テスト結果・次のアクションを共有します。  
   - フェーズ完了時に `delta-archive` を実行し、タスク完了/デルタ要約/検証ログ/最終コマンドをまとめます（日本語環境では docs/ に日英 2 文書を作成）。  
   これらのアウトプットをもとに、最終的な docs/specs 更新は AI アシスタントやチームが手動で反映します。
4. **テンプレ維持** – プロンプトテンプレートや各ツールへの配布内容を更新した際は `delta-update` で差分と検証手順を記録し、`delta update` を再実行します。

## テストカバレッジ

`tests/node-cli/context.test.ts` では以下を検証します:
- `delta init`（およびエイリアス `context-delta init`）がディレクトリとテンプレートを生成するか
- `LANG` に応じてローカライズ済みプロンプトが作成されるか
- 既存 `openspec/` や旧 state ディレクトリの内容が `context-delta/` へ移行されるか
- 選択したツール（Claude/Cursor/Codex など）のフォルダにプロンプトが同期されるか
- `delta update` がテンプレ最新化とアシスタント再同期を行うか
- `--update-root-agents` がルート `AGENTS.md` を置き換えるか

## 今後の予定

- `delta` CLI の追加サブコマンド（list / validate / archive など）
- `context-delta/prompts/` テンプレートの拡充と多言語サポート強化
- README にチュートリアル例やベストプラクティスの追加

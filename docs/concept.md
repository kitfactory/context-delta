# コンセプトメモ（現行仕様）

## コンセプト説明
OpenSpec の価値は「仕様駆動で変更を管理し、AI アシスタントとも安全に連携できるワークフロー」にあります。本プロジェクトではその体験を npm で配布する Context Delta CLI に集約しつつ、**基本フローを `delta propose → delta apply → delta verify → delta archive` の一個流しに絞る**ことを目標にしています。ユーザーはレビューと承認に集中し、ルーチン作業はプロンプト経由で再現可能な形に落とし込みます。

### CLI とプロンプトの使い分け方針
- **初期化と更新のみ CLI**: `delta init`（エイリアス `context-delta init`）でディレクトリ構造や AGENTS.md、テンプレート群を生成し、`delta update` / `delta card sync` でテンプレ/PromptCard を同期する。
- **以降はプロンプト優先**: propose / apply / verify / archive / list / delete のプロンプトで AI が生成・検証を担当。必要なら AI が内部で CLI を呼ぶが、ユーザーはレビューと承認に集中する。

## プロジェクトの方向性
- OpenSpec の公式 CLI と同じ UX を npm 版 Context Delta で提供し、AI 支援ワークフローを Node.js で再現する。
- リポジトリ名は `Context Delta`、npm パッケージは `context-delta`（バイナリは `delta` / `context-delta`）。
- CLI は `delta init` / `delta update` / `delta card sync`（エイリアス `context-delta …`）の最小構成。`delta init` 実行時は対象ツール（Claude/Cursor/GitHub/Codex/ローカル context-delta）を対話的に選択でき、`--assistants` でスクリプトから明示指定も可能。

## プロンプト命名規則
- 識別子は `delta-xx` 形式（ハイフンで区切った 2 語以内）に統一する。
- 末尾の語は目的を表す短い英単語を使用（例: `delta-propose`, `delta-apply`）。
- ローカライズはファイル内容で切り替え、ファイル名は常に `delta-<name>.md` を使用する（環境変数 `LANG` に応じて日本語/英語を自動出力）。
- 引数が必要な場合はプロンプト内でプレースホルダ（`{delta_id}`, `{target}`）を明示し、README などにも用例を載せる。

### CLI コマンド扱い
| コマンド | Context Delta CLI での扱い |
|----------|-------------------------|
| `delta init` (context-delta init) | 初回に 1 度だけ実行し、`context-delta/` 構造とテンプレを生成 |
| `delta update` (context-delta update) | テンプレートの再同期。AI からの依頼で必要に応じて呼ぶ |
| `delta card sync` (context-delta card sync) | PromptCard レジストリ再生成（例: `promptcards/index.json`） |
| その他 | 専用 CLI は提供せず、`delta-xx` プロンプトで AI に委任 |

### プロンプト例（主要セット）
| プロンプトID | カテゴリ | 役割 / 使いどころ | 備考 |
|--------------|----------|--------------------|------|
| `delta-propose` | Propose | doc_type/PromptCard を紐づけた delta の JSON を出力 | `promptcards/index.json` を参照 |
| `delta-apply` | Apply | doc_instance ごとの before/after/patch を出力 | `promptcards/index.json` を参照 |
| `delta-verify` | Verify | PromptCard rubric に基づく issues と follow-up を出力 | 評価用 PromptCard を参照 |
| `delta-archive` | Archive | summary / apply.patch / doc_instances.json を残す | - |
| `delta-list` | 管理 | 未アーカイブ delta を一覧 | - |
| `delta-delete` | 管理 | 未着手 delta を削除 | - |

> 上記が基本セット。追加プロンプトが必要になった場合は `delta-xx` 規約と現行フローとの整合を確認してから採用する。

### フロー
1. **Propose**: `delta-propose` で 1目的の delta を JSON で列挙し、doc_type/PromptCard を紐づける。
2. **Apply**: 選んだ delta を `delta-apply` で doc_instance ごとの before/after/patch に落とす。
3. **Verify**: `delta-verify` で PromptCard rubric による整合性チェックと follow-up を出す。
4. **Archive**: `delta-archive` で summary/patch/doc_instances.json を残し、次の propose の入力にする。未完や別目的が混じる場合は delta を分ける。
5. **管理**: 未アーカイブ delta は `delta-list` で確認し、不要なら `delta-delete`。PromptCard 変更時は `delta card sync` でレジストリ更新。

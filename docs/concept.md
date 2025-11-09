# コンセプトメモ

## コンセプト説明
OpenSpec の価値は「仕様駆動で変更を管理し、AI アシスタントとも安全に連携できるワークフロー」にあります。本プロジェクトではその体験を Python エコシステムへ移植しつつ、**CLI 操作は初期化 (`specline init` / 旧 `palprompt init`) のみに限定**し、それ以外は AI アシスタントと `specline-xx` プロンプトで完結させることを目標にしています。ユーザーはレビューと承認に集中し、ルーチン作業はプロンプト経由で再現可能な形に落とし込みます。

### CLI とプロンプトの使い分け方針
- **初期化のみ CLI**: `specline init`（旧 `palprompt init`）でディレクトリ構造や AGENTS.md、テンプレート群を生成する。これが唯一必須のコマンド。
- **以降はプロンプト優先**: 変更提案、実装状況共有、検証、アーカイブ、テンプレ更新などは `specline-*.md` の指示に沿って AI が担当。必要に応じて AI が内部で CLI を呼ぶが、ユーザーは直接コマンドを打たない前提で設計する。
- **5 フェーズ意識**: Concept / Roadmap / Propose / Apply / Archive の順にプロンプトを配置し、OpenSpec の propose → apply → archive リズムを保ちながら上流工程も明示する。

## プロジェクトの方向性
- OpenSpec の公式 Node.js CLI を Python で再実装する「Python クローン」プロジェクトを推進する。
- リポジトリ名は `SpecLine`、Python パッケージは `spec_line`。
- CLI は `specline init` / `specline update`（互換エイリアス `palprompt …`）の最小構成。`specline init` 実行時は対象ツール（Claude/Cursor/GitHub/Codex/ローカル specline）を対話的に選択でき、`--assistants` でスクリプトから明示指定も可能。

## プロンプト命名規則
- 識別子は `specline-xx` 形式（ハイフンで区切った 2 語以内）に統一する。
- 末尾の語は目的を表す短い英単語を使用（例: `specline-concept`, `specline-propose`）。
- ローカライズはファイル内容で切り替え、ファイル名は常に `specline-<name>.md` を使用する（環境変数 `LANG` に応じて日本語/英語を自動出力）。
- 引数が必要な場合はプロンプト内でプレースホルダ（`{change_id}`, `{target}`）を明示し、README などにも用例を載せる。

### CLI コマンド扱い
| コマンド | Python クローンでの扱い |
|----------|-------------------------|
| `specline init` (palprompt init) | 初回に 1 度だけ実行し、`specline/` 構造とテンプレを生成 |
| `specline update` (palprompt update) | テンプレートの再同期。AI からの依頼で必要に応じて呼ぶ |
| その他 | 専用 CLI は提供せず、`specline-xx` プロンプトで AI に委任 |

### プロンプト例（主要セット）
| プロンプトID | カテゴリ | 役割 / 使いどころ | 引数例 | 備考 |
|--------------|----------|--------------------|--------|------|
| `specline-concept` | Concept | `docs/concept.md` の骨子作成やリファイン | なし | ローカライズは内容のみ切り替え（ファイル名は `specline-concept.md`） |
| `specline-roadmap` | Roadmap | 機能をマイルストーン単位に分割し、優先順位を整理 | `feature-name` | 例: `specline-roadmap python-cli` |
| `specline-propose` | Propose | `{change_id}` の proposal / tasks / spec をまとめる | `change-id` | 例: `specline-propose add-python-cli-clone` |
| `specline-apply` | Apply | 実装進捗、実行コマンド、検証結果、TODO を共有 | `change-id` | 例: `specline-apply add-python-cli-clone` |
| `specline-archive` | Archive | アーカイブ前の最終チェック、デルタ、コマンド列挙 | `change-id` | 例: `specline-archive add-python-cli-clone` |
| `specline-update` | Maintenance | テンプレ同期やローカライズファイルの更新 | なし | `.claude/` など各ツール向けにも展開 |

> 上記 6 種が基本セット。追加プロンプトが必要になった場合は `specline-xx` 規約と 5 フェーズ整合を確認してから採用する。

## プロンプト仕様とチェック条件
| プロンプトID | 生成対象 / 作業内容 | 必須項目・チェック条件 | OpenSpec との関係 |
|--------------|----------------------|----------------------------|--------------------|
| `specline-concept` | `docs/concept.md` の概要整理。目的・範囲・CLI/プロンプト役割・ローカライズ方針を記述。 | - 見出し構成が維持される<br>- CLI とプロンプトの役割分担/リズムが明文化される<br>- Markdown が崩れない | OpenSpec には同等プロンプトなし。`openspec/AGENTS.md` を参考に新規作成。 |
| `specline-roadmap` | マイルストーン表（M1〜）の作成。スコープ/成果物/完了条件/依存関係/推奨 change-id。 | - 表または箇条書きでマイルストーンを列挙<br>- `specline-propose` に引き継ぐ change-id を提示<br>- 依存や先行条件が書かれる | OpenSpec に近いテンプレなし。計画メモから派生。 |
| `specline-propose` | `{change_id}` の `proposal.md` / `tasks.md` / `specs/<cap>/spec.md` を同時に下書き。 | - proposal: Why / What / Impact + 成功指標/リスク<br>- tasks: 番号付き `##` と `- [ ]` で担当/依存を記述<br>- spec: ADDED/MODIFIED/REMOVED + `#### Scenario` で現状とデルタを比較し、`specline validate` に合格する構造 | OpenSpec の `pal-change` と spec レビューを統合。 |
| `specline-apply` | Apply 期間のステータスレポート。タスク進捗、実行コマンド、テスト結果、コード差分、検証結果、次アクション。 | - `tasks.md` の更新内容を列挙<br>- 実行したコマンドと結果を記載（成功/失敗を明示）<br>- 直近の `specline validate` （または `--all`）と対処案を含める | OpenSpec の build / validate テンプレ統合版。 |
| `specline-archive` | アーカイブ前の最終チェック。タスク完了、デルタ摘要、必要コマンド、フォローアップ。 | - 未完了タスクがあれば差し戻し指示<br>- 仕様に反映するデルタとドキュメント更新箇所を列挙<br>- 実行するコマンド列（archive、git、tag 等）を順序付きで提示 | OpenSpec の archive テンプレを Python 版に最適化。 |
| `specline-update` | テンプレとローカライズファイルの更新手順。 | - 対象ディレクトリ別に追加/更新/削除項目を列挙<br>- バックアップ/差分確認/テストの実施手順を記載 | OpenSpec の update テンプレをベースにしつつ SpecLine 固有のコピー先を追加。 |

## ロードマップに沿った進め方
1. **Concept の同期**: `specline-concept` で vision・範囲・ローカライズ方針を整理し、AI/人間が共有する土台を作る。
2. **Roadmap の具体化**: `specline-roadmap <feature>` を用いてマイルストーン、完了条件、推奨 change-id を決める。
3. **Propose フェーズ**: 各マイルストーンを独立した `{change_id}` として `specline-propose {change_id}` を実行し、proposal / tasks / spec をまとめる。必要に応じて再実行して差分を蓄積。
4. **Apply フェーズ**: 実装を進めながら定期的に `specline-apply {change_id}` を更新し、タスクの進行状況、実行コマンド、`specline validate` 結果を共有。ここで品質ゲートも通過させる。
5. **Archive フェーズ**: 前工程が完了したら `specline-archive {change_id}` で最終チェック。アーカイブ後の follow-up があれば `specline-update` の結果と併せて記録する。

> 1 change = 1 完成品 の原則を守り、マイルストーンが終わるたびに `specline-concept` / `specline-roadmap` を必要分だけ更新する。こうすることで 5 フェーズのどこからでも再開しやすい。

## ディレクトリ構成と生成物の管理
```
specline/
├── project.md              # プロジェクト概要
├── AGENTS.md               # AI アシスタント向けガイダンス
├── prompts/
│   ├── specline-propose.md
│   └── …（他プロンプトの各言語版）
├── specs/
│   └── <capability>/spec.md
└── changes/
    ├── <change-id>/
    │   ├── proposal.md
    │   ├── tasks.md
    │   ├── specs/<capability>/spec.md
    │   └── …
    └── archive/
        └── YYYY-MM-DD-<change-id>/
```

- `specline init`（互換エリアス `palprompt init`）が上記構造を生成し、`openspec/` からの移行も兼ねる。
- `specline/prompts/` をソースに `.claude/commands/specline/`, `.cursor/prompts/specline/`, `.github/prompts/specline/`, `specline/commands/` へコピー。Codex は `$CODEX_HOME/prompts`（未設定時は `~/.codex/prompts/`。ホームが取れない場合のみ `.codex/prompts/`）へ配置する。
- `specline-update` / `specline update` は `specline/prompts/` を最新テンプレに更新した後、全アシスタント向けフォルダを再コピーし、欠落言語ファイルがあれば補填する。

## ローカライズ方針
- すべての `specline-xx` テンプレは英語/日本語の本文を内包し、`LANG` などから検出した言語に応じた内容を `specline-*.md`（単一ファイル名）で出力する。
- CLI/スクリプトは `LANG` や OS ロケールを参照して該当言語ファイルを展開。該当言語がなければ英語へフォールバック。
- 翻訳では単なる直訳ではなく、文化・用語に合わせた例示（例: `uv run pytest`、`specline validate --all`）を含める。
- 新言語を追加した場合は `specline-update` / `specline update` で `.claude/` 等にも展開されるよう保証する。

## 追加メモ
- 仕様や要件は既存の OpenSpec スペックに準拠し、Python 実装でも同等のエクスペリエンスを提供する。
- ドキュメントやリリースノートでは、Node 版との互換性・相互運用性を明記する。

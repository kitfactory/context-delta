# コンセプトメモ

## コンセプト説明
OpenSpec の価値は「仕様駆動で変更を管理し、AI アシスタントとも安全に連携できるワークフロー」にあります。本プロジェクトではその体験を Python エコシステムへ持ち込みつつ、CLI 操作を極力シンプルにすることを目標とします。Python クローンでは **CLI は初回の `palprompt init` のみに限定**し、それ以降の作業は AI アシスタントと `pal-xx` プロンプトで完結できるように設計します。

### CLI とプロンプトの使い分け方針
- **初期化のみ CLI**: `palprompt init` でディレクトリ構造・AGENTS.md などの基本テンプレートを整備する。これが唯一の必須 CLI 操作。
- **それ以外はプロンプト優先**: 変更提案、仕様更新、検証準備、アーカイブ前チェック、テンプレ更新などはすべて `pal-xx` プロンプトを通じて AI に担当させる。必要に応じて AI が内部で CLI を実行するが、ユーザーはコマンドを直接打つ前提から解放され、レビューと承認に集中できる。
- **シンプルさの明確化**: Node CLI と同等のコマンドを Python でも備えるが、今回のプロジェクトでは「プロンプト主体で進める」ことを優先し、CLI の露出と操作負荷を最小化する。

## プロジェクトの方向性
- OpenSpec の公式 Node.js CLI を Python で再実装する「Python クローン」プロジェクトを進める。
- リポジトリ名は `team-pal-prompts` とし、Python パッケージとして `team_pal_prompts` を提供する。
- CLI は `palprompt init` のみを提供し、その後のオペレーションはすべて `pal-xx` プロンプト経由で AI が実行できる構成にする。

## プロンプト命名規則
- プロンプト識別子は `pal-xx` 形式（ハイフンで区切った2語以内）に統一する。
- 末尾の語は操作対象や目的を示す短い英単語を使用する（例: `pal-init`, `pal-change`）。
- ローカライズ時は基本識別子のままファイル名に言語タグを付与（例: `pal-change.ja.md`, `pal-change.en.md`）。インストーラは OS/プロジェクト設定に応じた言語ファイルを配置する。
- 引数を取るプロンプトは表にサンプル引数も記載し、利用者が書式を迷わないようにする。

### CLIコマンド扱いの方針
| コマンド | Pythonクローンでの方針 |
|----------|-------------------------|
| `palprompt init` | **ユーザーが一度だけ実行**して OpenSpec 構造を初期化 |
| その他の操作 | 専用 CLI は提供せず、`pal-xx` プロンプトで AI に任せる |

### プロンプト例（主要セット）
| プロンプトID | カテゴリ | 役割 / 使いどころ | 引数例 | 備考 |
|--------------|----------|--------------------|--------|------|
| `pal-concept` | コンセプト | `docs/concept.md` の骨子作成やリファインを依頼 | なし | 初期構想や後続のアップデートで利用。`pal-concept.ja.md` など言語別ファイルを用意 |
| `pal-init` | セットアップ | OpenSpec 初期化やツール設定の確認を依頼 | なし | 最初のセットアップ時に使用 |
| `pal-change` | 変更提案 | 変更案（proposal/tasks/spec ドラフト）の作成・改訂を依頼 | `change-id` | 例: `pal-change add-python-cli-clone`。ローカライズ版は `pal-change.ja.md` 等 |
| `pal-build` | 実装進行 | 実装タスクの更新、進捗確認、diff 共有を依頼 | `change-id` | 例: `pal-build add-python-cli-clone` |
| `pal-roadmap` | ロードマップ | 機能をマイルストーンに分割し、各ステップの目的を整理 | `feature-name` | 例: `pal-roadmap python-cli` |
| `pal-spec` | 仕様確認 | 仕様の閲覧や差分整理、再構成を依頼 | `spec-id` | 例: `pal-spec cli-init` |
| `pal-validate` | バリデーション | 検証コマンド相当のチェックと結果解釈を依頼 | `target` | 例: `pal-validate add-python-cli-clone` |
| `pal-archive` | リリース | アーカイブ前チェックとデルタ適用確認を依頼 | `change-id` | 例: `pal-archive add-python-cli-clone` |
| `pal-update` | メンテナンス | テンプレ整備や指示ファイルのリフレッシュを依頼 | なし | 定期的な運用メンテで使用 |

> ここに挙げた 8 種類が基盤となるプロンプト。追加で必要になった場合は `pal-xx` 規則に沿って別途定義し、管理表に追記する。

> 標準的な流れは「pal-roadmap でロードマップ設計 → pal-change → pal-build → pal-spec → pal-validate → pal-archive」の順で、必要に応じて `pal-update` でテンプレ維持を行う想定。

> コマンドとプロンプトは役割が異なる。CLI は実際の操作手段、プロンプトは AI アシスタントや自動化フローに渡す指示テンプレートであり、厳密な一対一対応は必須ではない。必要に応じて複数コマンドを扱うプロンプトや、特定作業に特化した追加プロンプトを定義してよい。

### プロンプト仕様とチェック条件
| プロンプトID | 生成対象 / 作業内容 | 必須項目・チェック条件 | OpenSpec 既存実装との関係 |
|--------------|----------------------|----------------------------|----------------------------|
| `pal-concept` | `docs/concept.md` の雛形作成や更新案。目的・範囲・CLI/プロンプト方針・ローカライズ戦略を含む文章を生成。 | - セクション構成（コンセプト説明、CLI方針、プロンプト命名、AI対応表、ローカライズ方針）が揃う<br>- 変更差分の要約と採否判断コメントを含む<br>- Markdown 見出し/箇条書きが崩れない | OpenSpec に同名テンプレなし。`openspec/AGENTS.md` の構成を参考にしつつ Python クローン特化で新規作成。 |
| `pal-roadmap` | 機能をマイルストーン単位に分割した一覧。各ステップの目的・完了条件・依存関係と推奨 `change-id` を提示。 | - M1 以降の表形式または箇条書きで scope/成果物/完了判定が記載<br>- `pal-change` に渡す推奨 `change-id` と対象フォルダが明記<br>- 依存関係や先行条件が書かれている | OpenSpec では未提供のテンプレ。計画セクションを参考にしつつ、新規で `palprompt` 用に定義。 |
| `pal-change` | 指定 `change-id` の `proposal.md` / `tasks.md` / `specs/<cap>/spec.md` 下書き。Why/What/Impact とタスク番号、デルタ雛形を生成。 | - proposal: Why/What/Impact 各項目が1段落以上<br>- tasks: `## 1.` 起点で `- [ ]` チェックボックスが連番付き<br>- spec: `## ADDED|MODIFIED` ブロックと `#### Scenario` を含み `palprompt validate` で合格する構造 | OpenSpec の `pal-change` を流用しつつ CLI 名等を `palprompt` に置換。Python-specific 例 (uv, pytest) を追記。 |
| `pal-build` | 実装タスク進捗の更新、実行コマンド、テスト結果の整理。必要に応じて残タスクを抽出。 | - `tasks.md` の各項目に対する進捗/ブロッカーが記載<br>- 実行したコマンド列（例: `uv run pytest`) と結果が明示<br>- 差分ファイルのパスと変更概要が bullet で整理 | OpenSpec の実装進行テンプレを流用。Python プロジェクト向けにコマンド例を調整。 |
| `pal-spec` | 既存仕様の読み取り、差分提案、規約に沿った更新案。必要ならアーカイブ済み仕様との整合チェック。 | - `## Purpose` や Requirement/Scenario の階層を保持<br>- ADDED/MODIFIED/REMOVED 毎に差分理由と影響範囲を記述<br>- `pal-change` の spec ドラフトと整合しているか検証メモが付く | OpenSpec の spec レビュー出力を再利用。`palprompt` 向けに CLI 名・フォルダ例を置換。 |
| `pal-validate` | `palprompt validate` 相当の検証結果を解説。実行コマンドとエラー解消手順を提示。 | - 対象（change/spec/all）と使用フラグ (`--strict`, `--json`) を明記<br>- エラー/警告の一覧とそれぞれの修正ステップが含まれる<br>- JSON 出力例や再検証コマンドが提示される | OpenSpec の validate レポートテンプレを流用。ファイル構造（`team_pal_prompts/`）や CLI 名を反映。 |
| `pal-archive` | アーカイブ前チェックリスト、デルタ適用内容、タスク完了確認、アーカイブ後のファイル状態を提示。 | - 未完了タスクがある場合は差し戻し指示を出す<br>- 更新対象 spec ファイルとデルタ概要（追加/変更/削除）を列挙<br>- アーカイブ後の `palprompt/` ディレクトリ整合性チェックを含む | OpenSpec の archive テンプレートを流用。ただし CLI 名を `palprompt` に変更し Python 構造へ合わせる。 |
| `pal-update` | プロンプト/テンプレファイルの更新。ローカライズファイルも同期し破損チェックを行う。 | - 対象フォルダごとに更新/追加/削除ファイル一覧を提示<br>- バックアップや Git diff の取得手順が書かれている<br>- 言語別ファイルの同期状況が確認できる | OpenSpec の update テンプレートをベースに、`palprompt` 用パスと多言語同期ロジックを追加。 |

## 実装の流れ例
| ステップ | ユーザーが行う操作 (CLI/手動) | AI エディタに依頼できる内容 (プロンプト) | 期待される成果 |
|----------|-------------------------------|--------------------------------------------|----------------|
| 1. コンセプト整理 | `docs/concept.md` を手動編集して要求・背景を整理 | `pal-concept` | 取り組むべき範囲とプロンプト方針が明文化される |
| 2. ロードマップ設計 | `pal-roadmap` で機能をマイルストーンに分割し、優先順位を整理 | `pal-roadmap` | 開発ステップが明確になり、各 change の守備範囲が定義される |
| 3. 変更提案作成 | `pal-change` でマイルストーン毎の proposal/tasks/spec を作成（必要に応じて `pal-init` で整備） | `pal-change` / `pal-init` | AIが規約に沿った変更フォルダを生成（または整備）し、草案が整う |
| 4. エンジン実装 | Python パッケージを開発し、進捗共有やタスク更新を `pal-build` へ依頼 | `pal-build` | 実装が進みタスクの完了状況が更新される |
| 5. 仕様作業 | —（必要な編集は AI に委任） | `pal-spec` | 仕様差分が整合し記述が最新化される |
| 6. バリデーション | —（検証は `pal-validate` を通じて AI に依頼） | `pal-validate` | OpenSpec ルールを満たし、エラーが解消される |
| 7. レビュー & アーカイブ | —（アーカイブ作業も `pal-archive` で AI に委任、人間は承認のみ） | `pal-archive`, `pal-update` | 変更が本番仕様へ反映され、関連テンプレ・プロンプトが最新化される |

## ロードマップに沿った段階的実装
1. **Concept 段階の洗練**
   - `pal-concept` で `docs/concept.md` の構想をまとめ、範囲と目的を明確化する。
   - 必要に応じて `pal-roadmap` に伝えるためのキーワードや制約条件を整理する。
2. **マイルストーン分割**
   - `pal-roadmap <feature-name>` を実行し、広義の機能を「M1, M2...」の小さな完結単位へ分解する。
   - 出力されたマイルストーン案を `docs/concept.md` や専用ノートへ反映し、人間のレビューで確かめる。
3. **マイルストーンごとの change 実装**
   - 各マイルストーンを独立した change として扱い、順番に以下フローで完結させる:
     1. `pal-change <change-id>`: proposal/tasks/spec のドラフト作成
     2. `pal-build <change-id>`: 実装タスクの進行、進捗共有
     3. `pal-spec <spec-id>`: 仕様差分の整合・再構成
     4. `pal-validate <target>`: バリデーションで品質確認
     5. `pal-archive <change-id>`: アーカイブと仕様反映、必要に応じて `pal-update` でテンプレ維持
4. **次マイルストーンへ前進**
   - 1 change = 1 完成品 を徹底することで、常に高品質な小機能が積み重なる。
   - 新しいマイルストーンに移るたび `pal-change` 前に `pal-roadmap` を再実行し、前段の結果を踏まえた調整を行う。
   - 必要なら `pal-concept` に戻って概念や方向性を再整理し、常に最新のビジョンと整合させる。

この一連の手順によって、concept → roadmap → change 実装 → archive までがプロンプト駆動で繋がり、段階的に完成度を高めるロードマップ運用が実現できる。

## ディレクトリ構成と生成物の管理
- すべての成果物は `pal/` フォルダ直下に集約し、OpenSpec の `openspec/` 構成を Python クローン向けに再編する。

```
pal/
├── project.md              # プロジェクト概要（OpenSpec project.md を転用）
├── AGENTS.md               # AIアシスタント向け共通ガイダンス
├── prompts/                # プロンプトテンプレート（多言語対応）
│   ├── pal-change.en.md
│   ├── pal-change.ja.md
│   └── …（その他言語）
├── specs/                  # 現在の仕様（OpenSpec specs/ を対応先ごとに移植）
│   └── <capability>/spec.md
└── changes/                # 進行中の変更（OpenSpec changes/ と同構造）
    ├── <change-id>/
    │   ├── proposal.md
    │   ├── tasks.md
    │   ├── specs/<capability>/spec.md
    │   └── …
    └── archive/
        └── YYYY-MM-DD-<change-id>/
```

- `palprompt init` 実行時に上記構造を生成し、既存の `openspec/` がある場合は `pal/` へマイグレーションする。
- プロンプトは `pal/prompts/` に展開し、AI アシスタントごとに以下のようにシンボリックリンクまたはコピーを作成する:
  - Claude Code / Desktop: `.claude/commands/palprompt/ → pal/prompts/`
  - Cursor / Windsurf: `.cursor/prompts/palprompt/ → pal/prompts/`
  - GitHub Copilot Chat: `.github/prompts/palprompt/ → pal/prompts/`
  - VS Code (AGENTS互換): `palprompt/commands/ → pal/prompts/`
  - その他エージェント: それぞれの既定ディレクトリ内に `palprompt/` サブフォルダを作成し、`pal/prompts/` を同期
- `pal-update` は `pal/prompts/` をソースとして各ツールディレクトリを最新化する。欠落言語ファイルは `pal/prompts/` から補充。

## ローカライズ方針
- すべての `pal-xx` プロンプトは英語版をベースに、必要な言語向けにローカライズ版（例: `pal-change.ja.md`, `pal-change.fr.md`）を提供する。
- インストーラ/セットアップスクリプトはプロジェクト設定（環境変数 `PALPROMPT_LANG` や OS ロケール）を参照し、該当言語ファイルを `palprompt/commands/` へ配置する。
- 言語ファイルが存在しない場合は英語版をフォールバックとして利用し、後から `pal-update` でローカライズファイルを追加できるようにする。
- プロンプト本文では翻訳だけでなく、文化・用語差異を考慮し、例示コマンドや説明も対象言語に合わせて調整する。

## 追加メモ
- 仕様・要件は OpenSpec の既存スペックに準拠し、Python 実装でも同様のエクスペリエンスを提供する。
- ドキュメントやリリースノートでは、Node 版との互換性と相互運用性を明示する。

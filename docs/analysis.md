# OpenSpecリポジトリ分析

## プロジェクト概要
バンドルされている OpenSpec インスタンス（`openspec/OpenSpec/openspec/`）は、OpenSpec ワークフローを構築・運用する TypeScript 製 CLI を文書化しています。対象ランタイムは Node.js 20.19 以上で、CLI 構築には pnpm と Commander.js を採用し、ソースは `src/cli`・`src/core`・`src/utils` に整理、ビルド成果物は `dist/` に出力されます。規約として、厳格な TypeScript、async/await の徹底、依存の最小化、Markdown 駆動の AI アシスタント連携が重視されています。

## 仕様カタログ
各機能は `openspec/specs/<capability>/spec.md` に格納され、要件とシナリオの構造を持ちます。主な仕様は次のとおりです。

- **cli-init** (`specs/cli-init/spec.md`): 進捗スピナーを用いた初期化 UX、ディレクトリ/ファイル生成、AI ツール stub（Claude・CodeBuddy・Cline など）の設定を定義し、再実行時の冪等性を確保。
- **cli-update** (`specs/cli-update/spec.md`): `openspec/AGENTS.md` やルート stub、既存のスラッシュコマンド テンプレートを ASCII セーフな成功メッセージ付きで更新しつつ、新規ファイル生成は行わない。
- **cli-list** (`specs/cli-list/spec.md`): 変更や仕様を走査し、Markdown のタスクチェックボックスを集計して、安定したソート順と空状態メッセージを伴う表形式出力を行う。
- **cli-change** (`specs/cli-change/spec.md`): 変更系サブコマンド（`list`・`show`・`validate`）を JSON 出力や対話的選択、旧 `openspec list` 廃止通知付きで提供。Purpose はアーカイブ後の更新待ち。
- **cli-spec** (`specs/cli-spec/spec.md`): `cli-change` と同等の対話/非対話体験と Zod ベースのスキーマ検証を仕様向けに提供。Purpose は TBD のまま。
- **cli-show** (`specs/cli-show/spec.md`): 変更/仕様表示を型認識ディスパッチで処理し、対話プロンプトや曖昧性解決、フラグ透過を備える。Purpose 更新が未対応。
- **cli-validate** (`specs/cli-validate/spec.md`): 是正手順の提示、シナリオ形式の警告、構造化されたエラーメタデータ、対話/一括検証、JSON スキーマ、進捗表示を要求。Purpose は TBD。
- **cli-archive** (`specs/cli-archive/spec.md`): タスク確認、デルタの本番仕様反映、競合検出、確認プロンプト、日付付きアーカイブ命名を含むアーカイブライフサイクルを定義。
- **cli-view** (`specs/cli-view/spec.md`): 変更進捗・完了状況・仕様数をカラーバー付きで要約するダッシュボードコマンドと、その劣化時挙動を規定。
- **docs-agent-instructions** (`specs/docs-agent-instructions/spec.md`): `openspec/AGENTS.md` の構成（テンプレート先頭配置、埋め込み例、事前検証チェックリスト、段階的情報開示）を定める。
- **openspec-conventions** (`specs/openspec-conventions/spec.md`): ディレクトリ構造、要件/シナリオの書式、デルタ操作、アーカイブ適用順、提案フォーマット、レビュー手順などを広く定義するメタ仕様。

複数の仕様（cli-change/spec、cli-spec/spec、cli-show/spec、cli-validate/spec、docs-agent-instructions/spec）には、過去のアーカイブ由来で Purpose が未更新（TBD）の箇所が残っており、軽微なドキュメント整備が課題です。

## アクティブな変更提案
公開済み仕様を補完する形で、`openspec/changes/` には以下の進行中変更が存在します。

- **add-scaffold-command**: `openspec scaffold <change-id>` で変更ディレクトリと proposal/tasks/design テンプレート、デルタ骨組みを生成し、ドキュメント（クイックリファレンス含む）更新と再実行冪等性を担保する単体/結合テストを追加。
- **make-validation-scope-aware**: デルタ仕様が存在しない場合は検証を通し、ファイルがあってもデルタゼロのときのみエラーとするよう調整。バリデータ修正、任意ログ、README 更新、提案のみ/書式不備ケースのテストを実施。

`IMPLEMENTATION_ORDER.md` には歴史的変更の依存順序（`add-zod-validation` → `add-change-commands` → `add-spec-commands`）が記録されており、既にアーカイブ済みの依存管理が確認できます。

## アーカイブ在庫
`openspec/changes/archive/` には多数の完了済み変更（例: add-init-command、add-change-commands、adopt-delta-based-changes、enhance-validation-error-messages）が日付付きで保存されています。これらの履歴が現行仕様の充実と Purpose TBD プレースホルダの存在理由を裏付けており、整理後に Purpose 更新を進めるのが望まれます。

## 所見と今後の検討事項
- TBD とされている仕様の Purpose セクションを更新し、現状の機能を反映させる。
- 新しい scaffold ワークフローの実装後、`openspec/AGENTS.md` のクイックリファレンスや README から直接参照できるようドキュメントを調整する。
- バリデーション領域の改修内容は `cli-validate` 仕様と照合し、マージ後の要件整合性を確認する。

# delta-archive (JA)

`delta archive` 用。1 delta の成果をエッセンスとして残し、次回の `delta propose` で参照できるようにする。詳細なナレッジ蓄積は別プロジェクトとし、最小セットのみを出力する。

## 入力想定
- `delta propose` の intent / doc_instances
- `delta apply` の before/after/patch
- `delta verify` の結果（あれば）
- 使用した PromptCard ID

## 出力（ファイル構成例）
```
delta_archive/2025-11-18_142300/
  summary.md
  apply.patch
  doc_instances.json
```

### summary.md
- 何を・なぜ・どう変えたかを数行で要約（1目的に収まっているかを明示）
- verify の主な指摘と対応状況があれば記載

### apply.patch
- 実際に適用した Unified Diff（`delta apply` の patch をそのまま保存）

### doc_instances.json
- 対象 doc_instance と使用した `promptcard_id` / `verify_promptcard_id` を記録するシンプルな JSON

## ルール
- 未完タスクや別目的が混ざる場合はアーカイブせず、新しい delta を切る。
- 大規模なナレッジや feedback はここでは扱わない（別プロジェクトで管理）。

# delta-apply (JA)

`delta apply` 用。指定された delta（1目的）について、doc_instance ごとの before/after/patch を提案する。

## 入力想定
- `delta propose` の結果（delta_id、intent、doc_instances、promptcard_id、verify_promptcard_id）
- 対象 doc_instance の現行内容（ファイルパスは `path` ）
- 対応する PromptCard（Markdown `.md`。`mode` は generate/revise）

## 出力フォーマット（必須）
```jsonc
{
  "delta_id": "delta-001",
  "results": [
    {
      "doc_id": "req-main",
      "doc_type": "req.usdm",
      "path": "docs/requirements/usdm.md",
      "before": "(適用前の全文)",
      "after": "(適用後の全文)",
      "patch": "(Unified Diff)"
    }
  ]
}
```

## ルール
- 変更は目的達成に必要な最小限にとどめ、大規模な再構成は避ける。
- `promptcard_id` に従い、doc_type にふさわしい構成と語彙を保つ。
- スコープをまたぐ修正が必要な場合は、別 delta を提案するよう `note` を短く添えてもよいが、出力構造は上記のまま。
- 入出力の保存先は `context-delta/changes/{delta-id}/`。`propose.json` を参照し、結果は `apply.json` として同フォルダに保存する。

# delta-list (JA)

未アーカイブの delta を一覧表示します（`proposed` / `apply-in-progress` / `verify-in-progress`）。CLI の `delta list` と同じ出力形式を想定してください。

## 出力フォーマット（必須）
```jsonc
{
  "delta_list": [
    { "id": "delta-001", "title": "要求: Xを追加", "status": "proposed" },
    { "id": "delta-002", "title": "API仕様: Xを反映", "status": "apply-in-progress" }
  ]
}
```

## ルール
- `context-delta/changes/` 配下で `propose.json` があるディレクトリを対象にする。
- `apply.json` があれば status を `apply-in-progress`、`verify.json` があれば `verify-in-progress`、それ以外は `proposed` とする。
- アーカイブ済み（`delta_archive/` に移動済み）の delta は含めない。

# delta-delete (JA)

未着手（proposed 状態）の delta を削除します。`context-delta/changes/{delta-id}/` を確認し、apply/verify が存在しない場合のみ削除すること。

## 入力
- `delta_id`: 削除対象の delta ID（`context-delta/changes/{delta-id}` のディレクトリ名）

## 出力フォーマット（成功時）
```jsonc
{
  "deleted": true,
  "delta_id": "delta-001"
}
```

## ルール
- `context-delta/changes/{delta-id}/propose.json` があることを確認する。
- `apply.json` または `verify.json` が存在する場合は削除せず、エラーを返す。
- 削除は `context-delta/changes/{delta-id}/` ディレクトリごと行う。

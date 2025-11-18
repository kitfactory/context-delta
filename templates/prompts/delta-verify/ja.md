# delta-verify (JA)

`delta verify` 用。1つの delta の適用結果が intent と doc_type / PromptCard の期待に整合しているかを確認する。

## 入力想定
- `delta apply` の結果（before/after/patch）
- `delta propose` の intent
- 評価用 PromptCard（Markdown `.md`、mode は evaluate/review）

## 出力フォーマット（必須）
```jsonc
{
  "delta_id": "delta-001",
  "verification": {
    "issues": [
      {
        "doc_id": "req-main",
        "loc": "line 120-150",
        "issue": "元の要求より範囲が広がっています",
        "note": "理由や背景を簡潔に",
        "severity": "high"
      }
    ],
    "suggested_followup": [
      {
        "type": "new_delta_propose",
        "reason": "スコープ修正用の delta を追加してください"
      }
    ]
  }
}
```

## ルール
- 構文ではなく意味レベルの整合性に集中する。Rubric に基づき必須要素の抜け・矛盾を検出する。
- 不明点はエラーではなく質問として `suggested_followup` に載せる。
- 1 delta に収まらない課題が見つかった場合は、新しい delta を提案する。

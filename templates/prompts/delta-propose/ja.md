# delta-propose (JA)

`delta propose` 用。doc_type / PromptCard に基づき、**1目的 = 1 delta** の候補を列挙し、最小構成の JSON を返してください。

## 入力想定
- プロジェクトのファイル、既知の doc_instance 情報（あれば）
- PromptCard 一覧（例: `promptcards/index.json`。各カードは Markdown `.md` で `doc_type` を持つ）
- オプション: `--bootstrap` の有無

## 出力フォーマット（必須）
```jsonc
{
  "mode": "incremental", // or "bootstrap"
  "delta_list": [
    {
      "id": "delta-001",
      "title": "目的を短く",
      "intent": "なぜやるかを1文で",
      "scope_note": "このdeltaで扱う範囲と除外範囲を簡潔に",
      "continuity_note": "直近のdeltaとの重複/衝突/連続性について",
      "doc_instances": [
        {
          "doc_id": "req-main",
          "doc_type": "req.usdm",
          "path": "docs/requirements/usdm.md",
          "promptcard_id": "promptcard.req.usdm.default",
          "verify_promptcard_id": "promptcard.req.usdm.review"
        }
      ]
    }
  ],
  "next_steps": {
    "recommended_delta_ids": ["delta-001"]
  }
}
```

## ルール
- 1 delta = 1 目的。大規模な再構成や複数目的は提案しない。
- doc_type は PromptCard 一覧から推定し、最小セット（req.usdm / spec.api / design.arch_overview / test.plan / ops.runbook / delta.summary）を優先。
- プロジェクトに無い doc_type を提案する場合は、意図を短く補足する。
- `promptcard_id` と `verify_promptcard_id` を doc_instance ごとに必ず指定し、一覧にない場合は「新規カードが必要」と明示する。
- `scope_note` と `continuity_note` を必ず記載し、過大スコープや重複は `next_steps` で follow-up delta として分ける。
- ソースコード変更を伴う場合は、実施すべきテスト（観点や主要コマンド）を `next_steps` などで明示する。
- `--bootstrap` 指定時は、`doc_type_plan` を添えて採用すべき doc_type と PromptCard の組み合わせを提案する。
- 提案数は必要最小限に絞り、優先順は `next_steps.recommended_delta_ids` に反映する。

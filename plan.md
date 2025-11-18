# context-delta ドキュメント整合と初期資産更新計画

本文書（docs/context-delta-architecture-doc_type-promptcard.md）を基準に、他ドキュメントとインストール資産を整合させるためのチェックリスト。上から順に進める。

- [x] 予備調査：現状の README / docs/* / templates / context-delta/prompts / promptcards 初期セットの差分ポイントを洗い出し、どこが基準文書と矛盾しているかメモする
- [x] ドキュメント修正：README や関連 docs（例: proactive-delta-context, prompt-fix-plan など）を基準文書の用語・フロー（propose/apply/verify/archive、delta list/delete、最小 doc_type セット、PromptCard 前提など）に合わせて更新
- [x] 管理系仕様追記：delta list/delete、delta-id 指定ルール、status ラベル定義を必要に応じて該当ドキュメントに反映
- [x] 提案/評価フロー整合：`delta propose` の出力例に verify_promptcard_id が含まれること、PromptCard が Markdown 前提であることを各関連文書・テンプレに反映
- [x] インストール資産更新：初期 PromptCard とカスタムプロンプト（templates/context-delta/prompts など）を基準文書仕様に沿うよう整理し、PromptCard 一覧（promptcards/index.json など）生成フォーマットを統一
- [ ] 確認：チェックリスト達成後、主要ファイルのdiffを確認し、基準文書との整合を再確認

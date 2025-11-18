# context-delta プロンプト／PromptCard 修正手順

context-delta がインストール先に展開するカスタムプロンプト（delta-propose/apply/archive/verify など）と PromptCard を修正するための手順。目的を1つに絞り、該当ファイルを編集して sync まで実行する。

## 修正対象の把握
1) 目的を1つに定義する（例: 連続性チェックを追加したい、1目的の明示を入れたい）  
2) 修正するファイルを特定する  
   - PromptCard: `context-delta/promptcards/*.md`（例: `product-requirements.md` など）  
   - delta系プロンプト: `templates/prompts/delta-propose|delta-apply|delta-archive|delta-verify/<locale>.md`  
   - その他: `templates/prompts/delta-concept|delta-roadmap` など目的に応じて

## 現行定義の確認
- Front Matter（id/version/targets/purpose）と Instructions/Questions/Rubric/Non-Goals を読み、どこに追記するか決める  
- deltaプロンプトは出力構造や必須セクションを確認する（例: delta-propose のセクション名、タスクの書式）

## 変更方針を箇条書き化
- 追加・変更したい指示やRubric項目、禁止事項、章立てを短く列挙する  
- 連続性・1目的・drift防止など今回の狙いを明示する

## 編集
- 該当Markdownを編集し、必要なら Front Matter の `version` を上げる  
- deltaプロンプトの場合も同様に指示文を更新し、出力形式の一貫性を保つ

## 整合チェック
- purpose/targets と矛盾していないか、指示とRubric/出力構造がズレていないか確認する  
- 連続性（Concept/Roadmap/既存deltaとの整合）や scope の明示が足りているか点検する

## 動作確認
- 必要に応じてサンプル生成やRubric評価を試し、狙いどおりの文言・構造になっているか確認する
- パッケージ配布前に `npm run build`（または `npm pack` 前後のフロー）でテンプレートが同梱されることを確認する

## 共有
- 変更内容と意図（何を強化したか）をチームに共有し、次のdeltaで検証・改善する

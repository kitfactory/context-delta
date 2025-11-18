# context-delta カスタムプロンプト修正手順

目的: context-delta がインストールするカスタムプロンプトを、ガイドライン（`docs/context-delta-guideline-1.md`, `docs/context-delta-guideline-2.md`）に沿う形へ修正するための作業手順。

## 1. 現在インストールされるカスタムプロンプトの洗い出し
- [x] templates/prompts/delta-propose/{en,ja}.md を確認
- [x] templates/prompts/delta-apply/{en,ja}.md を確認
- [x] templates/prompts/delta-archive/{en,ja}.md を確認
- [x] templates/prompts/delta-concept/{en,ja}.md を確認
- [x] templates/prompts/delta-roadmap/{en,ja}.md を確認
- [x] templates/prompts/delta-update/{en,ja}.md を確認
- [x] delta-verify テンプレートの有無を確認（未同梱なら追加が必要）

## 2. 残す/削除するプロンプトの整理
- [x] 残す: delta-propose, delta-apply, delta-archive, delta-verify
- [x] 削除: delta-concept, delta-roadmap, delta-update をテンプレート/配布対象から除外

## 3. ガイドライン適合の確認観点（propose/apply/archive/verify）
- [x] 1 delta = 1目的（意味クラスター）の明示有無を確認
- [x] Concept/Roadmap/既存deltaとの連続性・drift 防止指示の有無を確認
- [x] scope_level/continuity_score 等のスコープ・連続性メタの扱いを確認
- [x] PromptCard/doc_instance 指示（guideline-2）の計画→実装→検証への落とし込みを確認
- [x] 仕様/コード/テストが同一目的で揃う出力構造になっているか確認
- [x] verify が Rubric/評価観点を持ち、宣言と差分の突き合わせを促すか確認

## 4. 各プロンプトの修正すべき点（草案）
- [x] delta-propose を修正: 1目的＋continuity/scope セクション追加、doc_instance/PromptCard 選定・生成指示の項目追加、drift/連続性確認の問いを追加
- [x] delta-apply を修正: propose指示との突き合わせ欄追加、文書/コード/テストを同一目的内で記録する構造に変更、drift/スコープ逸脱チェックを追加
- [x] delta-archive を修正: 1目的で完了したか確認し未完は別delta化する指示追加、Concept/Roadmap/doc_instance 反映状況の確認欄を追加
- [x] delta-verify を追加: PromptCard Rubric採点と Pass/Borderline/Fail＋改善点の構造、continuity/scope/目的一致チェック、drift検知欄を用意

## 5. 実作業フロー
- [x] 削除対象テンプレート（concept/roadmap/update）を配布対象から除外する
- [x] delta-propose/apply/archive を修正案に沿って編集する（en/ja 両方）
- [x] delta-verify テンプレートを追加し、模範出力構造を定義する（en/ja）
- [x] 変更がガイドライン1/2に適合するかセルフレビューする（連続性・1目的・doc_instance運用）
- [x] 必要なら PromptCard の Rubric/Instructions に連続性・scope観点を追記する
- [ ] ビルド/配布物にテンプレートが含まれることを確認する（`npm run build` 等）

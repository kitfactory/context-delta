# context-delta カスタムプロンプト修正手順

目的: context-delta がインストールするカスタムプロンプトを、ガイドライン（`docs/context-delta-guideline-1.md`, `docs/context-delta-guideline-2.md`）に沿う形へ修正するための作業手順。

## 1. 現在インストールされるカスタムプロンプトの洗い出し
- [x] templates/prompts/delta-propose/{en,ja}.md を確認
- [x] templates/prompts/delta-apply/{en,ja}.md を確認
- [x] templates/prompts/delta-archive/{en,ja}.md を確認
- [x] templates/prompts/delta-verify/{en,ja}.md を確認

## 2. 残す/削除するプロンプトの整理
- [x] 残す: delta-propose, delta-apply, delta-archive, delta-verify
- [x] 削除: delta-concept, delta-roadmap, delta-update をテンプレート/配布対象から除外

## 3. ガイドライン適合の確認観点（propose/apply/archive/verify）
- [x] 1 delta = 1目的が明示されているか
- [x] doc_instance / doc_type / PromptCard の指定が計画→実装→検証で一貫しているか
- [x] 仕様/コード/テストが同一目的で揃う出力構造になっているか
- [x] verify が Rubric/評価観点を持ち、宣言と差分の突き合わせを促すか

## 4. 各プロンプトの修正すべき点（草案）
- [x] delta-propose を修正: 1目的、doc_instance/PromptCard 指定、verify 用 PromptCard の指定を含む JSON を出力する
- [x] delta-apply を修正: doc_instance ごとの before/after/patch を出力する
- [x] delta-archive を修正: summary/patch/doc_instances.json の最小構成を指示する
- [x] delta-verify を追加: PromptCard Rubric に基づく issues と follow-up を JSON で出力する

## 5. 実作業フロー
- [x] 削除対象テンプレート（concept/roadmap/update）を配布対象から除外する
- [x] delta-propose/apply/archive を修正案に沿って編集する（en/ja 両方）
- [x] delta-verify テンプレートを追加し、模範出力構造を定義する（en/ja）
- [x] 変更がガイドライン1/2に適合するかセルフレビューする
- [x] 必要なら PromptCard の Rubric/Instructions に doc_type / scope 観点を追記する
- [ ] ビルド/配布物にテンプレートが含まれることを確認する（`npm run build` 等）

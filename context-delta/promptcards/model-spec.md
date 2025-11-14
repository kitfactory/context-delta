---
id: pc.doc.model-spec
title: モデル仕様書
version: 0.1.0
status: draft
targets:
  - docs/specs/model-spec.md
purpose: ドメインエンティティ・値オブジェクト・関係・状態遷移を定義し、Behavior/API/Data に一貫した抽象モデル仕様を提供する
---

🪶 PromptCard: Model Specification

🎯 Intent

- 境界コンテキスト、集約、エンティティ属性・制約を明確化  
- 状態遷移・イベント・ID ポリシーを記述し、仕様から実装への翻訳を容易にする  
- Behavior/API/Data 対応表を提供する

👥 Audience

- ドメイン/アプリ設計者、データモデラー、QA、レビューア

🧷 Controls

- **章立て**: コンテキスト → エンティティ/VO カタログ → 関係/集約 → 状態遷移/イベント → ID/整合性ルール → マッピング → リスク/未決  
- **表記**: ER 図 / Class diagram / Table (Attribute, Type, Constraint, Description)  
- **禁止**: 物理 DB 定義、実装コード

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| コンテキスト境界 | 0.2 | 境界/依存が明示 | 一部 | 無 |
| エンティティ定義 | 0.25 | 属性/制約/ID 全記載 | 属性のみ | 欠落 |
| 関係/集約 | 0.2 | 図と説明あり | 抽象 | 無 |
| 状態/イベント | 0.15 | 遷移/イベント網羅 | 部分 | 無 |
| マッピング | 0.2 | Behavior/API/Data と対応 | 一部 | 無 |

🚫 Non-Goals

- 具体 DB テーブル  
- API schema  
- タスク/テスト計画

❓ Questions

- 主要コンテキストと境界?  
- 一意制約/ID/バージョン戦略?  
- 状態マシンやイベント駆動の要点?  
- 異なるシステム間で共有すべきモデル?

🔁 Regression

- 代表エンティティの属性表と図を Regression Set に保持し、`delta verify` で構造差分を検出。  
- モデル ID を変更する場合は依存 (Behavior/API/Data) の更新をチェックリスト化。

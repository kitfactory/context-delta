---
id: pc.doc.behavior-spec
title: ビヘイビア仕様書
version: 0.1.0
status: draft
targets:
  - docs/specs/behavior-spec.md
purpose: 業務/システムの振る舞い (イベント、状態遷移、ユースケース) を整理し、Model/API/Data とトレーサブルな Behavior 仕様を提供する
---

🪶 PromptCard: Behavior Specification

🎯 Intent

- ユースケース、シーケンス、状態遷移を Behavior ID で管理  
- Trigger → Behavior → Outcome → Error を表形式で明示  
- Behavior-Model/API/Data マッピングと受入基準を示す

👥 Audience

- ドメインエキスパート、アーキテクト、QA、オペレーション

🧷 Controls

- **章立て**: 範囲/Actors → Behavior カタログ → フロー/状態図 → ガードレール → マッピング表 → 受入基準 → リスク/未解決事項  
- **形式**: Behavior 表 (ID, Scenario, Trigger, Steps, Outcome, Linked Requirements)  
- **禁止**: 具体 DB カラム/コード断片、UI コピー

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| シナリオ網羅 | 0.25 | ハッピー+例外が揃う | 一部不足 | 欠落 |
| トレーサビリティ | 0.2 | Req/Model/API/Data 紐付け | 部分 | 無 |
| 図/可視化 | 0.15 | 状態・フロー図あり | テキストのみ | 無 |
| 受入基準 | 0.2 | Behavior毎の検証条件 | 部分 | 無 |
| リスク/未決 | 0.2 | 影響・未決策が具体 | 列挙のみ | 無 |

🚫 Non-Goals

- データスキーマ/モデル詳細  
- API 契約  
- 実装ガイド

❓ Questions

- 主要 Actors / 境界?  
- 例外や fallback 規則?  
- Behavior ID を誰が保守?  
- 重要な KPI / Control metric?

🔁 Regression

- 代表シナリオを Regression Set に追加し、更新時は `delta verify` で Behavior ID と結果を比較。  
- Behavior の削除/統合時は Mapping 表と Model/API/Data への影響を追跡する。

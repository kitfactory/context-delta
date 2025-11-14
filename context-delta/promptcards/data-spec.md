---
id: pc.doc.data-spec
title: データ仕様書
version: 0.1.0
status: draft
targets:
  - docs/specs/data-spec.md
purpose: データ構造・品質ルール・保持戦略・アクセス制御を整理し、Model/API/Behavior と整合するデータ仕様を提供する
---

🪶 PromptCard: Data Specification

🎯 Intent

- ロジカル/フィジカルスキーマ、属性、制約、キーを定義  
- データフロー、ETL/ストリーム、ライフサイクルを図示  
- 品質/セキュリティ/保持ポリシーと監査要件を明文化する

👥 Audience

- データエンジニア/DBA、バックエンド、セキュリティ、アナリティクス

🧷 Controls

- **章立て**: 戦略/範囲 → スキーマ定義 → データフロー → 品質ルール → セキュリティ/保持 → マッピング → 監査/モニタリング → リスク  
- **形式**: テーブル定義表 (フィールド, 型, Null, デフォルト, 説明)、Mermaid/ER/Flow 図  
- **禁止**: 実際の秘密データ、個人情報の露出

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| スキーマ詳細 | 0.25 | 型/制約/説明が揃う | 一部 | 無 |
| データフロー | 0.2 | ETL/ストリームが明確 | テキストのみ | 無 |
| 品質/検証 | 0.2 | ルール/メトリクスが明示 | 概要 | 無 |
| セキュリティ/保持 | 0.2 | PII/暗号化/Retention | 部分 | 無 |
| マッピング | 0.15 | Behavior/Model/API とリンク | 一部 | 無 |

🚫 Non-Goals

- BI レポート設計  
- モジュール実装  
- 実運用クレデンシャル

❓ Questions

- 主要データソース/シンク?  
- PII/規制データの分類?  
- 鮮度/レイテンシ要件?  
- 削除/マスキング/監査要件?

🔁 Regression

- 重要テーブル定義や JSON Schema を Regression Set とし、変更時に diff + `delta verify` を実施。  
- 品質 KPI (欠損率など) を baseline にして逸脱検知。

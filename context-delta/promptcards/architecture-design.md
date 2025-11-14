---
id: pc.doc.architecture-design
title: アーキテクチャ設計書
version: 0.1.0
status: draft
targets:
  - docs/specs/architecture-design.md
purpose: 要求/仕様をもとにアーキテクチャ構成、コンポーネント責務、データフロー、非機能設計、リスクをまとめた設計書を生成する
---

🪶 PromptCard: Architecture Design Document

🎯 Intent

- コンポーネント図、通信、データフロー、依存関係、運用要件を明示する  
- KPI/非機能、セキュリティ/可用性設計、観測ポイントを設計段階で定義する  
- トレードオフや決定事項 (ADR) を記録し、実装/レビューの共通ビューを提供する

👥 Audience

- Tech/Architect Lead、Infra/DB/SRE、QA、セキュリティレビュー

🧷 Controls

- **章立て**: Summary & Goals → Architecture Overview → Component Responsibilities → Data/Sequence Flow → Interface & Contract Summary → Persistence & Storage → Observability/AI Hooks → Non-functional/Resilience → Decisions & Risks → Validation Plan  
- **表記**: C4/シーケンス/Mermaid 図、表 (component, responsibilities, tech choices)  
- **禁止**: 実装手順/コード抜粋、不要な内部 ID

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| 要求トレース | 0.2 | 主要要求/Behaviorに紐付 | 部分 | 無 |
| 構成/責務 | 0.2 | 図と責務が明瞭 | 抽象 | 無 |
| フロー/データ | 0.2 | 主要フロー・データ経路 | 部分 | 無 |
| 非機能/運用 | 0.2 | 性能/可用/セキュリティ | 部分 | 無 |
| リスク/決定 | 0.2 | ADR/リスク/対応策明示 | 列挙 | 無 |

🚫 Non-Goals

- 実装タスク計画  
- API/データ詳細 (参照は可)  
- テストケース詳細

❓ Questions

- 想定スケール/可用性/SLO?  
- 主要依存サービス/制約?  
- 監視/トレーシング/Feature flag 要件?  
- トレードオフを記録すべきテーマ?

🔁 Regression

- 代表的なアーキ図と責務表を Regression Set とし、構成変更時は `delta verify` で差分を比較。  
- 非機能目標や SLO を baseline 化し、設計更新で逸脱しないかチェック。

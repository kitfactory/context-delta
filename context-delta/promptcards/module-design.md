---
id: pc.doc.module-design
title: モジュール設計書
version: 0.1.0
status: draft
targets:
  - docs/specs/module-design.md
purpose: 個別機能/サービス/ライブラリの責務・入出力・依存・運用要件を定義し、実装チームが共有できるモジュール設計書を提供する
---

🪶 PromptCard: Feature Module Design

🎯 Intent

- 1 モジュール単位の目的、境界、責務、非責務を整理  
- インターフェース、データ/状態、依存、観測ポイントを明文化  
- デプロイ/ランタイム制約、リスク、検証計画をまとめる

👥 Audience

- モジュール担当エンジニア、レビュー担当、QA/SRE、ドキュメント担当

🧷 Controls

- **章立て**: Overview → Responsibilities/Non-responsibilities → Interfaces/Contracts → Data & State → Dependencies/Integrations → Observability/Feature Flags → Deployment & Runtime → Risks/Open Issues → Validation Plan  
- **形式**: 表 (Interface, Inputs, Outputs, Errors, Linked API/Behavior)、図 (Component/Sequence)  
- **禁止**: 実装コード、内部秘密値

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| 境界/責務 | 0.2 | 何を/何をしないか明瞭 | 一部 | 無 |
| インターフェース | 0.2 | I/Oと契約が揃う | 抽象 | 無 |
| データ/状態管理 | 0.2 | 状態/キャッシュ/整合性記載 | 部分 | 無 |
| 依存/統合 | 0.2 | 依存関係と影響が明確 | 概要 | 無 |
| 観測/運用 | 0.2 | Telemetry/flags/deploy要件 | 部分 | 無 |

🚫 Non-Goals

- プロジェクト全体の PRD/SRS 再掲  
- タスク分解  
- 実行ログ

❓ Questions

- このモジュールの KPI/成功条件?  
- 呼び出し元/先と SLA?  
- 既存モジュールからの差分?  
- Rollout/Feature flag 要件?

🔁 Regression

- 代表モジュールの責務/インターフェース表を Regression Set 化し、更新時は `delta verify` で差分と整合性を確認。  
- 重大変更時は依存システムの影響一覧を併記する。

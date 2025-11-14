---
id: pc.doc.delivery-plan
title: デリバリープラン (タスク計画)
version: 0.1.0
status: draft
targets:
  - docs/specs/delivery-plan.md
purpose: 要求/設計を実装タスク・検証作業・依存関係・完了条件に分解し、チームや AI エージェントが参照できるデリバリープランを作成する
---

🪶 PromptCard: Delivery Plan / Task Breakdown

🎯 Intent

- 仕様・設計を実行タスクへ分解し、依存・担当・完了条件を記述  
- テスト/検証計画、リスク/ブロッカー、ステージゲート条件を整理  
- 並列実行や自動化フック (CI/CD, AI agent) を明示する

👥 Audience

- エンジニア、QA、Ops、PM、AI エージェント (実装/検証補助)

🧷 Controls

- **章立て**: Summary → Task Table → Dependencies/Gantt → Validation Plan → Automation Hooks → Risks/Blockers → Gate Checklist  
- **Task 表**: ID, Description, Linked Requirement/Design, Owner, Dependencies, Exit Criteria, Test Notes  
- **禁止**: Git コマンドや細かな操作ログ、仕様/設計の再掲

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| トレース | 0.2 | 全タスクが要求/設計に紐付く | 部分 | 無 |
| 粒度/Exit | 0.2 | 実行可能な粒度と Exit Criteria | 大雑把 | 不明 |
| 依存/順序 | 0.2 | 図/表で依存可視化 | テキストのみ | 無 |
| 検証計画 | 0.2 | テスト/観測/レビューが揃う | 部分 | 無 |
| リスク/ゲート | 0.2 | Blocker & Gate 条件明示 | 概要 | 無 |

🚫 Non-Goals

- 仕様/設計そのもの  
- 見積金額 (必要なら別章)  
- 実行ログ

❓ Questions

- 期限/マイルストーン?  
- チーム構成や担当?  
- 重要な自動化/AI の役割?  
- テストや承認で重視する観点?

🔁 Regression

- 代表的なタスク構成を Regression Set とし、`delta verify` で粒度・依存書式をチェック。  
- タスク ID 変更時は issue tracker 連携を更新する。

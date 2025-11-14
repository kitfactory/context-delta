---
id: pc.doc.system-requirements
title: システム要求仕様書
version: 0.1.0
status: draft
targets:
  - docs/specs/system-requirements.md
purpose: EARS などの一貫した表現で機能/非機能要求を整理し、承認・検証・設計移管に足るシステム要求仕様書 (SRS) を作成する
---

🪶 PromptCard: System Requirements Specification

🎯 Intent

- ビジネス/システム要求を EARS/Use Case/Rule で構造化する  
- 受入基準・優先度・依存・制約を定義し、検証/設計へ橋渡しする  
- 非機能要求・リスク・承認ゲートを明記する

👥 Audience

- Product/BA、Tech Lead、QA、セキュリティ、監査

🧷 Controls

- **章立て**: 概要/範囲 → コンテキスト → Functional Requirements (EARS) → 非機能 → 制約・依存 → Acceptance/Test Strategy → リスク/承認  
- **形式**: 要求表 (ID, Type, Statement, Priority, Acceptance Criteria, Linked Behavior/Feature)  
- **禁止**: 実装決定、UI/コピー細部、テストケース全列挙

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| EARS/構造整合 | 0.25 | 全要求が規定形式 | 一部崩れ | 無 |
| 受入基準 | 0.2 | 測定可能な基準あり | 部分 | 無 |
| 非機能網羅 | 0.15 | 性能/可用性/セキュリティ | 概要 | 無 |
| 依存/制約 | 0.2 | 依存関係と制約が記載 | 一部 | 無 |
| リスク/承認 | 0.2 | リスク＆承認プロセス明記 | 概要 | 無 |

🚫 Non-Goals

- アーキ設計  
- タスク分解  
- テスト実装詳細

❓ Questions

- 必須ステークホルダー/承認者?  
- 重要な業務/規制制約?  
- 非機能の最優先 TOP3?  
- 実施すべき検証モード?

🔁 Regression

- 代表的な要求セットを Regression Set として保持し、`delta verify` で EARS 形式や基準の一貫性をチェックする。  
- 要求 ID 変更時は Behavior/Design/Tasks 参照を更新する。

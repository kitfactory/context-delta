---
id: pc.doc.product-requirements
title: プロダクト要求仕様書
version: 0.1.0
status: draft
targets:
  - docs/specs/product-requirements.md
purpose: 事業目的・ユーザー課題・主要機能・成功指標を整理し、後続の仕様/設計文書へ受け渡すためのプロダクト要求仕様書 (PRD) を生成する
---

🪶 PromptCard: Product Requirements Document (PRD)

🎯 Intent

- 製品の背景・市場機会・目的・価値仮説を明示する  
- ペルソナ、課題、主要機能 (EPIC/Feature) と優先度を定義する  
- KPI/OKR・成功基準・リスク/前提を列挙し、以降の仕様や計画の土台にする

👥 Audience

- プロダクト/事業オーナー、Tech Lead、QA、BizDev、ステークホルダー全般

🧷 Controls

- **章立て**: 概要 → 市場/背景 → ペルソナ/課題 → 価値仮説 → 機能優先度 → KPI/測定計画 → 非機能/制約 → リスク/依存 → 付録  
- **形式**: EPIC/Feature 表 (ID, 説明, 優先度, 価値)、KPI テーブル (指標, 基準値, 目標, 測定方法)  
- **禁止**: 実装アーキの詳細、未検証の数字の断定、他文書のコピペ

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| 目的/背景整合 | 0.2 | 目的と市場背景が論理的 | 一部曖昧 | 不整合 |
| ユーザー/課題深度 | 0.2 | ペルソナと課題が具体 | 概要のみ | 不明 |
| 機能優先度 | 0.2 | EPIC/Feature/優先度が揃う | 粒度不揃い | 欠落 |
| KPI/成功指標 | 0.2 | 定量 KPI と計測方法がある | 指標のみ | 無 |
| リスク/前提 | 0.2 | リスク＆前提＋対策 | 列挙のみ | 無 |

🚫 Non-Goals

- 技術設計、API 詳細  
- タスク分解/実装計画  
- テストケース列挙

❓ Questions

- ビジネスゴール/期間/インパクト?  
- ターゲットユーザー/課題?  
- 競合/差別化要素?  
- 成功を測る KPI/メトリクス?

🔁 Regression

- 過去 PRD 2 件以上をリファレンスとして保持し、`delta verify` で KPI と優先度の網羅性を比較する。  
- 大幅なピボット時は旧 PRD を Regression Set に入れ、差分説明を Changelog に残す。

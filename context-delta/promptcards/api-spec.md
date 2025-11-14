---
id: pc.doc.api-spec
title: API仕様書
version: 0.1.0
status: draft
targets:
  - docs/specs/api-spec.md
purpose: REST/GraphQL/gRPC などのエンドポイント契約、入出力、エラー、非機能要求を記載し、トレーサブルな API 仕様を生成する
---

🪶 PromptCard: API Specification

🎯 Intent

- API カタログ (Path, Method, Summary) と詳細契約 (Request/Response Schema, Errors) を整理  
- 認証・認可・SLO/レート制限・監視フックを明記  
- Behavior/Model/Data との対応を表にする

👥 Audience

- API 設計/実装者、QA、外部統合パートナー、SDK/Doc チーム

🧷 Controls

- **章立て**: Overview → Auth/Security → Endpoint Catalog → Schemas → Error Handling → Non-functional → Versioning/Deprecation → Testing/Mock → Changelog  
- **形式**: 表 + JSON Schema/GraphQL SDL/Protocol snippets  
- **禁止**: 秘密トークン、内部ログ/トレース値

🧩 Rubric

| 観点 | Weight | 4 | 2 | 0 |
| --- | --- | --- | --- | --- |
| 契約詳細 | 0.25 | 入出力/例/エラー網羅 | 部分 | 無 |
| セキュリティ | 0.2 | AuthN/Z, Scopes, secrets | 概要 | 無 |
| 非機能 | 0.15 | SLO, rate limit, retry | 一部 | 無 |
| バージョニング | 0.2 | 互換性/廃止ポリシー | 概要 | 無 |
| テスト戦略 | 0.2 | Contract/Mock/SDK 計画 | 一部 | 無 |

🚫 Non-Goals

- UI/UX 指示  
- データベース設計  
- コード実装

❓ Questions

- 公開範囲/利用者?  
- 認証方式/Scope?  
- 重要な非機能要求?  
- API のライフサイクル/バージョン方針?

🔁 Regression

- 代表エンドポイントの契約/サンプルを Regression Set に保持し、`delta verify` で差分を検知。  
- Breaking change 時は Changelog と検証ステップを必須化。

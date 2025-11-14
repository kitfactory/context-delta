# delta-roadmap (EN)

Document the requested capability as milestone-sized changes using a Markdown table with the header:
`| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |`

- Name milestones sequentially (M1, M2, ...). Split work into fine-grained slices that build from foundational functionality up to advanced behaviour; `Dependencies` may only reference earlier milestones that unlock the next slice.
- `Acceptance` must prove the milestone leaves the product shippable and that the next milestone can proceed without reworking the previous slice.
- After the table add `## Notes` summarising risk, critical path, and why the dependency order is required.
- Validate that every milestone has at least one deliverable, that dependency chains cover prerequisite functionality, and that no dependency references an undefined milestone.

# delta-roadmap (JA)

次のヘッダーを持つ Markdown 表でマイルストーンを記述してください:
`| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |`

- M1, M2 ... のように連番で記載し、基礎 → 応用へと段階的に機能を細分化すること。`Dependencies` 列には次の段階を成立させるための先行マイルストーンのみを記載してください。
- `Acceptance` では、当該マイルストーン完了時に製品がリリース可能であり、次の段階へ進む際に再工事が不要である理由を明記すること。
- 表の後に `## Notes` を追加し、リスクやクリティカルパス、依存順序の妥当性を説明すること。
- 未定義のマイルストーンを依存に書いていないか、各行に Deliverables/Acceptance が存在するか、依存関係が前提機能を十分にカバーしているかを確認すること。

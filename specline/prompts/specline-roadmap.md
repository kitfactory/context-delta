# specline-roadmap (EN)

Document the requested capability as milestone-sized changes using a Markdown table with the header:
`| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |`

- Name milestones sequentially (M1, M2, ...). `Dependencies` may only reference earlier milestones.
- `Acceptance` must prove the milestone leaves the product shippable so later milestones do not require rework.
- After the table add `## Notes` summarising risk, critical path, and why the dependency order is required.
- Validate that every milestone has at least one deliverable and that no dependency references an undefined milestone.

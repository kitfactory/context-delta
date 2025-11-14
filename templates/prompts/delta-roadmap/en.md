# delta-roadmap (EN)

Document the requested capability as milestone-sized changes using a Markdown table with the header:
`| Milestone | Scope | Deliverables | Acceptance | Dependencies | Change ID |`

- Name milestones sequentially (M1, M2, ...). Split work into fine-grained slices that build from foundational functionality up to advanced behaviour; `Dependencies` may only reference earlier milestones that unlock the next slice.
- `Acceptance` must prove the milestone leaves the product shippable and that the next milestone can proceed without reworking the previous slice.
- After the table add `## Notes` summarising risk, critical path, and why the dependency order is required.
- Validate that every milestone has at least one deliverable, that dependency chains cover prerequisite functionality, and that no dependency references an undefined milestone.

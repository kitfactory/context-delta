# Prompt Templates

Each prompt (e.g., `delta-concept`, `delta-roadmap`) will get a dedicated folder with locale-specific markdown files:

```
templates/prompts/delta-roadmap/
├── en.md
└── ja.md
```

`templates.ts` will fetch the appropriate language file at runtime. This README keeps the directory under version control until we migrate the actual markdown assets.

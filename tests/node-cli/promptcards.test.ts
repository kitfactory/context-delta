import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import fs from "fs-extra";
import { afterAll, describe, expect, test } from "vitest";

import { STATE_DIR } from "../../src/services/context.js";
import { syncPromptCardRegistry } from "../../src/services/promptcards.js";

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "card-sync-"));
  tempDirs.push(dir);
  return dir;
}

afterAll(async () => {
  for (const dir of tempDirs) {
    await fs.remove(dir);
  }
});

describe("syncPromptCardRegistry", () => {
  test("generates registry files and metadata from PromptCards", async () => {
    const dir = await createTempDir();
    const cardsDir = join(dir, STATE_DIR, "promptcards");
    await fs.ensureDir(cardsDir);

    const primaryCard = `---
id: pc.demo
title: Demo Card
version: 1.2.3
status: stable
targets:
  - docs/specs/demo.md
purpose: >
  Demo purpose spanning
  multiple lines
---

# Demo body
`;
    await fs.outputFile(join(cardsDir, "demo.md"), primaryCard, "utf8");

    const nestedDir = join(cardsDir, "ops");
    await fs.ensureDir(nestedDir);
    const secondaryCard = `---
id: pc.ops
title: Ops Card
version: 0.1.0
status: draft
targets: docs/ops.md
purpose: Operations guidance
---
`;
    await fs.outputFile(join(nestedDir, "ops.md"), secondaryCard, "utf8");

    const result = await syncPromptCardRegistry({ root: dir });

    expect(result.cards).toHaveLength(2);
    const [demo, ops] = result.cards;
    expect(demo.id).toBe("pc.demo");
    expect(demo.targets).toEqual(["docs/specs/demo.md"]);
    expect(demo.purpose).toBe("Demo purpose spanning multiple lines");
    expect(demo.path).toBe("context-delta/promptcards/demo.md");

    expect(ops.id).toBe("pc.ops");
    expect(ops.targets).toEqual(["docs/ops.md"]);
    expect(ops.path).toBe("context-delta/promptcards/ops/ops.md");

    const jsonPath = join(dir, "docs/promptcards/registry.json");
    const markdownPath = join(dir, "docs/promptcards/registry.md");

    expect(await fs.pathExists(jsonPath)).toBe(true);
    expect(await fs.pathExists(markdownPath)).toBe(true);

    const registryJson = await fs.readJson(jsonPath);
    expect(registryJson.cards).toHaveLength(2);
    expect(registryJson.cards[0].id).toBe("pc.demo");
    expect(typeof registryJson.generatedAt).toBe("string");

    const registryMarkdown = await fs.readFile(markdownPath, "utf8");
    expect(registryMarkdown).toContain("PromptCard Registry");
    expect(registryMarkdown).toContain("pc.demo");
    expect(registryMarkdown).toContain("pc.ops");
  });
});

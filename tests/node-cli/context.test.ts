import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import fs from "fs-extra";
import { afterAll, describe, expect, test } from "vitest";

import { DEFAULT_ASSISTANTS } from "../../src/services/assistants.js";
import {
  initContextDeltaStructure,
  refreshPrompts,
  STATE_DIR,
  updateRootAgentsFile,
} from "../../src/services/context.js";
import type { AssistantName } from "../../src/types.js";

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "context-delta-"));
  tempDirs.push(dir);
  return dir;
}

async function withEnv<T>(env: Record<string, string>, fn: () => Promise<T>): Promise<T> {
  const previous: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(env)) {
    previous[key] = process.env[key];
    process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

afterAll(async () => {
  for (const dir of tempDirs) {
    await fs.remove(dir);
  }
});

describe("initContextDeltaStructure", () => {
  test("creates directory structure, bootstrap files, and english prompts", async () => {
    const dir = await createTempDir();
    const codexHome = join(dir, "codex-home");
    const result = await withEnv(
      {
        LANG: "en_US.UTF-8",
        CODEX_HOME: codexHome,
      },
      () => initContextDeltaStructure({ root: dir }),
    );

    expect(result.existing).toBe(false);
    const stateDir = join(dir, STATE_DIR);

    expect(await fs.pathExists(join(stateDir, "project.md"))).toBe(true);
    expect(await fs.pathExists(join(stateDir, "AGENTS.md"))).toBe(true);
    expect(await fs.pathExists(join(stateDir, "specs"))).toBe(true);
    expect(await fs.pathExists(join(stateDir, "changes"))).toBe(true);
    expect(await fs.pathExists(join(stateDir, "prompts/delta-propose.md"))).toBe(true);

    const content = await fs.readFile(join(stateDir, "prompts/delta-propose.md"), "utf8");
    expect(content).toContain("delta-propose (EN)");

    const codexPrompt = join(codexHome, "prompts/delta-propose.md");
    expect(await fs.pathExists(codexPrompt)).toBe(true);
  });

  test("detects locale and writes Japanese prompts", async () => {
    const dir = await createTempDir();
    await withEnv(
      {
        LANG: "ja_JP.UTF-8",
        CODEX_HOME: join(dir, "codex-ja"),
      },
      () => initContextDeltaStructure({ root: dir }),
    );
    const promptsPath = join(dir, STATE_DIR, "prompts/delta-propose.md");
    const content = await fs.readFile(promptsPath, "utf8");
    expect(content).toContain("delta-propose (JA)");
  });

  test("migrates openspec assets when present", async () => {
    const dir = await createTempDir();
    const openspecDir = join(dir, "openspec");
    await fs.ensureDir(join(openspecDir, "specs/demo"));
    await fs.outputFile(join(openspecDir, "specs/demo/spec.md"), "# Demo spec\n", "utf8");
    await fs.outputFile(join(openspecDir, "AGENTS.md"), "Legacy instructions\n", "utf8");

    const result = await withEnv(
      {
        LANG: "en_US.UTF-8",
        CODEX_HOME: join(dir, "codex-migrate"),
      },
      () => initContextDeltaStructure({ root: dir }),
    );

    expect(result.migrated).toContain("specs/");
    const migratedSpec = join(dir, STATE_DIR, "specs/demo/spec.md");
    expect(await fs.pathExists(migratedSpec)).toBe(true);
    const agentsContent = await fs.readFile(join(dir, STATE_DIR, "AGENTS.md"), "utf8");
    expect(agentsContent).toContain("Context Delta Instructions");
  });

  test("respects assistant selection when provided", async () => {
    const dir = await createTempDir();
    const codexHome = join(dir, "codex-only");
    await withEnv(
      {
        LANG: "en_US.UTF-8",
        CODEX_HOME: codexHome,
      },
      () => initContextDeltaStructure({ root: dir, assistants: ["codex"] as AssistantName[] }),
    );

    expect(await fs.pathExists(join(codexHome, "prompts/delta-archive.md"))).toBe(true);
    expect(await fs.pathExists(join(dir, ".claude/commands/context-delta"))).toBe(false);
    expect(await fs.pathExists(join(dir, ".cursor/prompts/context-delta"))).toBe(false);
  });
});

describe("refreshPrompts", () => {
  test("refreshes prompt files and assistant directories", async () => {
    const dir = await createTempDir();
    const codexHome = join(dir, "codex-update");
    await withEnv(
      {
        LANG: "en_US.UTF-8",
        CODEX_HOME: codexHome,
      },
      () => initContextDeltaStructure({ root: dir, assistants: DEFAULT_ASSISTANTS }),
    );

    const promptPath = join(dir, STATE_DIR, "prompts/delta-propose.md");
    await fs.writeFile(promptPath, "outdated\n", "utf8");
    const claudePrompt = join(dir, ".claude/commands/context-delta/delta-propose.md");
    await fs.remove(claudePrompt);

    const updated = await withEnv(
      {
        LANG: "en_US.UTF-8",
        CODEX_HOME: codexHome,
      },
      () => refreshPrompts({ root: dir, assistants: DEFAULT_ASSISTANTS }),
    );

    expect(updated.has("prompts/delta-propose.md")).toBe(true);
    const refreshed = await fs.readFile(promptPath, "utf8");
    expect(refreshed).toContain("delta-propose (EN)");
    expect(await fs.pathExists(claudePrompt)).toBe(true);
  });
});

describe("updateRootAgentsFile", () => {
  test("writes bootstrap instructions to AGENTS.md", async () => {
    const dir = await createTempDir();
    await fs.outputFile(join(dir, "AGENTS.md"), "legacy instructions\n", "utf8");
    await updateRootAgentsFile(dir);
    const content = await fs.readFile(join(dir, "AGENTS.md"), "utf8");
    expect(content).toContain("context-delta/AGENTS.md");
  });
});

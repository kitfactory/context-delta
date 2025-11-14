import { join, resolve } from "node:path";

import fs from "fs-extra";

import type { AssistantName, InitResult } from "../types.js";

import { DEFAULT_ASSISTANTS, syncAssistantDirectories } from "./assistants.js";
import { ensureDirectories, migrateFromOpenspec, moveLegacyStateDir, writeTextFile } from "./filesystem.js";
import { detectLanguage, readBootstrapTemplate, scaffoldPrompts } from "./templates.js";

export const STATE_DIR = "context-delta";
const DIRECTORY_SKELETON = [
  STATE_DIR,
  `${STATE_DIR}/prompts`,
  `${STATE_DIR}/specs`,
  `${STATE_DIR}/changes`,
  `${STATE_DIR}/changes/archive`,
] as const;
const LEGACY_STATE_DIRS = ["specline", "pal"] as const;

export async function initContextDeltaStructure({
  root,
  force = false,
  assistants,
}: {
  root?: string;
  force?: boolean;
  assistants?: readonly AssistantName[];
} = {}): Promise<InitResult> {
  const rootPath = resolve(root ?? process.cwd());
  const stateDir = join(rootPath, STATE_DIR);

  const legacyMoved = await moveLegacyStateDir(rootPath, stateDir, LEGACY_STATE_DIRS);
  const stateExists = legacyMoved || (await fs.pathExists(stateDir));
  const created = new Set<string>();
  const migratedSet = new Set<string>();

  if (stateExists && !force) {
    return {
      root: stateDir,
      existing: true,
      created: [],
      migrated: [],
    };
  }

  if (force && (await fs.pathExists(stateDir))) {
    await fs.remove(stateDir);
  }

  const directories = await ensureDirectories(rootPath, DIRECTORY_SKELETON);
  for (const entry of directories) {
    created.add(entry);
  }

  const projectContent = await readBootstrapTemplate("project.md");
  await writeTextFile(join(stateDir, "project.md"), projectContent);

  const agentsContent = await readBootstrapTemplate("AGENTS.md");
  await writeTextFile(join(stateDir, "AGENTS.md"), agentsContent);

  await fs.ensureFile(join(stateDir, "specs/.gitkeep"));
  await fs.ensureFile(join(stateDir, "changes/.gitkeep"));

  const language = detectLanguage();
  const promptResults = await scaffoldPrompts(join(stateDir, "prompts"), language, { overwrite: false });
  for (const entry of promptResults) {
    created.add(entry);
  }

  const migrated = await migrateFromOpenspec(rootPath, stateDir);
  for (const entry of migrated) {
    migratedSet.add(entry);
  }

  const assistantSelection = assistants ?? DEFAULT_ASSISTANTS;
  const assistantDirs = await syncAssistantDirectories(rootPath, join(stateDir, "prompts"), assistantSelection);
  for (const entry of assistantDirs) {
    created.add(entry);
  }

  return {
    root: stateDir,
    existing: stateExists,
    created: [...created],
    migrated: [...migratedSet],
  };
}

export async function refreshPrompts({
  root,
  assistants,
}: {
  root?: string;
  assistants?: readonly AssistantName[];
} = {}): Promise<Set<string>> {
  const rootPath = resolve(root ?? process.cwd());
  const stateDir = join(rootPath, STATE_DIR);
  const promptsDir = join(stateDir, "prompts");

  if (!(await fs.pathExists(promptsDir))) {
    throw new Error("context-delta/prompts directory does not exist. Run 'context-delta init' first.");
  }

  const language = detectLanguage();
  const results = await scaffoldPrompts(promptsDir, language, { overwrite: true });
  const assistantSelection = assistants ?? DEFAULT_ASSISTANTS;
  const assistantDirs = await syncAssistantDirectories(rootPath, promptsDir, assistantSelection);

  for (const dir of assistantDirs) {
    results.add(dir);
  }
  return results;
}

export async function updateRootAgentsFile(root?: string): Promise<void> {
  const rootPath = resolve(root ?? process.cwd());
  const content = await readBootstrapTemplate("ROOT_AGENTS.md");
  await writeTextFile(join(rootPath, "AGENTS.md"), content, true);
}

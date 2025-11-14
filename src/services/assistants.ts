import os from "node:os";
import { join, relative, resolve } from "node:path";

import fs from "fs-extra";
import prompts from "prompts";

import type { AssistantName } from "../types.js";

export const DEFAULT_ASSISTANTS: readonly AssistantName[] = [
  "claude",
  "cursor",
  "github",
  "context-delta",
  "codex",
] as const;

const ASSISTANT_TARGETS: Record<Exclude<AssistantName, "codex">, string> = {
  claude: ".claude/commands/context-delta",
  cursor: ".cursor/prompts/context-delta",
  github: ".github/prompts/context-delta",
  "context-delta": "context-delta/commands",
};

function normalizeListValue(value: string): string {
  return value.trim().toLowerCase();
}

export function parseAssistants(raw?: string): AssistantName[] {
  if (!raw || raw.trim().length === 0 || raw.trim().toLowerCase() === "all") {
    return [...DEFAULT_ASSISTANTS];
  }
  const chunks = raw.split(",").map(normalizeListValue).filter(Boolean);
  if (chunks.length === 0) {
    return [...DEFAULT_ASSISTANTS];
  }
  const seen = new Set<AssistantName>();
  for (const chunk of chunks) {
    if (!DEFAULT_ASSISTANTS.includes(chunk as AssistantName)) {
      const valid = DEFAULT_ASSISTANTS.join(", ");
      throw new Error(`Unknown assistant(s): ${chunk}. Valid options: ${valid}`);
    }
    seen.add(chunk as AssistantName);
  }
  return [...seen];
}

async function promptForAssistants(): Promise<AssistantName[]> {
  const response = await prompts({
    type: "multiselect",
    name: "assistants",
    message:
      "Select assistants to install prompts for (press space to toggle, enter to confirm). Leave empty for all.",
    choices: DEFAULT_ASSISTANTS.map((name: AssistantName) => ({
      title: name,
      value: name,
      selected: true,
    })),
  });
  if (!response.assistants || response.assistants.length === 0) {
    return [...DEFAULT_ASSISTANTS];
  }
  return response.assistants as AssistantName[];
}

export async function determineAssistants(raw?: string): Promise<AssistantName[]> {
  if (raw !== undefined) {
    return parseAssistants(raw);
  }
  if (process.stdin.isTTY && process.stdout.isTTY) {
    return promptForAssistants();
  }
  return [...DEFAULT_ASSISTANTS];
}

function resolveCodexPrompts(root: string): string {
  const codexHome = process.env.CODEX_HOME;
  if (codexHome) {
    return join(codexHome, "prompts");
  }
  try {
    return join(os.homedir(), ".codex", "prompts");
  } catch {
    return join(root, ".codex", "prompts");
  }
}

export async function syncAssistantDirectories(
  root: string,
  promptsDir: string,
  assistants: readonly AssistantName[],
): Promise<Set<string>> {
  const created = new Set<string>();
  const promptFiles = (await fs.readdir(promptsDir))
    .filter((name) => name.startsWith("delta-") && name.endsWith(".md"))
    .sort();

  for (const assistant of assistants) {
    let target: string;
    if (assistant === "codex") {
      target = resolveCodexPrompts(root);
    } else {
      target = resolve(root, ASSISTANT_TARGETS[assistant]);
    }
    await fs.ensureDir(target);
    const rel = relative(root, target);
    created.add(rel.startsWith("..") ? target : rel);
    for (const prompt of promptFiles) {
      const source = join(promptsDir, prompt);
      const dest = join(target, prompt);
      await fs.copyFile(source, dest);
    }
  }

  return created;
}

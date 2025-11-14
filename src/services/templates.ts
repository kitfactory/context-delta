import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import fs from "fs-extra";

import { TEMPLATE_ROOT } from "../utils/paths.js";

const PROMPTS_ROOT = join(TEMPLATE_ROOT, "prompts");
const BOOTSTRAP_ROOT = join(TEMPLATE_ROOT, "bootstrap");

function normalizeLocale(value: string | undefined | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const code = value.split(".")[0];
  if (!code) {
    return undefined;
  }
  const normalized = code.split(/[_-]/)[0]?.toLowerCase();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

export function detectLanguage(): string {
  const envCandidates = [process.env.LANG, process.env.LC_ALL, process.env.LC_MESSAGES];
  for (const candidate of envCandidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) {
      return normalized;
    }
  }
  try {
    const resolved = new Intl.DateTimeFormat().resolvedOptions().locale;
    const normalized = normalizeLocale(resolved);
    if (normalized) {
      return normalized;
    }
  } catch {
    // Ignore Intl failures and fall back to English.
  }
  return "en";
}

async function readPromptTemplate(promptId: string, language: string): Promise<string> {
  const preferred = join(PROMPTS_ROOT, promptId, `${language}.md`);
  if (await fs.pathExists(preferred)) {
    return fs.readFile(preferred, "utf8");
  }
  const fallback = join(PROMPTS_ROOT, promptId, "en.md");
  if (await fs.pathExists(fallback)) {
    return fs.readFile(fallback, "utf8");
  }
  throw new Error(`Missing template for ${promptId} (${language})`);
}

async function listPromptIds(): Promise<string[]> {
  const entries = await readdir(PROMPTS_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function scaffoldPrompts(
  promptsDir: string,
  language: string,
  { overwrite = false }: { overwrite?: boolean } = {},
): Promise<Set<string>> {
  await fs.ensureDir(promptsDir);
  const promptIds = await listPromptIds();
  const created = new Set<string>();
  for (const promptId of promptIds) {
    const filename = promptId.endsWith(".md") ? promptId : `${promptId}.md`;
    const target = join(promptsDir, filename);
    const content = await readPromptTemplate(promptId, language);
    const normalized = content.endsWith("\n") ? content : `${content}\n`;
    if (overwrite || !(await fs.pathExists(target))) {
      await fs.outputFile(target, normalized, "utf8");
    }
    created.add(`prompts/${filename}`);
  }
  return created;
}

export async function readBootstrapTemplate(filename: string): Promise<string> {
  const target = resolve(BOOTSTRAP_ROOT, filename);
  return fs.readFile(target, "utf8");
}

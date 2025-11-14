import { join, relative, resolve } from "node:path";

import fs from "fs-extra";
import YAML from "yaml";

import type { PromptCardMetadata, PromptCardRegistryResult } from "../types.js";

import { STATE_DIR } from "./context.js";

const FRONTMATTER_REGEX = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/;

export async function syncPromptCardRegistry({
  root,
}: {
  root?: string;
} = {}): Promise<PromptCardRegistryResult> {
  const rootPath = resolve(root ?? process.cwd());
  const cardsDir = join(rootPath, STATE_DIR, "promptcards");

  if (!(await fs.pathExists(cardsDir))) {
    throw new Error("context-delta/promptcards directory does not exist. Create PromptCard files before syncing.");
  }

  const files = await collectMarkdownFiles(cardsDir);
  if (!files.length) {
    throw new Error("No PromptCard Markdown files were found under context-delta/promptcards.");
  }

  const cards: PromptCardMetadata[] = [];
  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const frontMatter = extractFrontMatter(content);
    const relativePath = normaliseRelativePath(rootPath, file);

    if (!frontMatter) {
      throw new Error(`PromptCard ${relativePath} is missing YAML front matter.`);
    }

    let data: Record<string, unknown>;
    try {
      data = YAML.parse(frontMatter) ?? {};
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse YAML front matter in ${relativePath}: ${reason}`);
    }

    const id = typeof data.id === "string" ? data.id.trim() : "";
    if (!id) {
      throw new Error(`PromptCard ${relativePath} must define an 'id' field in its front matter.`);
    }

    const title = typeof data.title === "string" ? data.title.trim() : undefined;
    const version = typeof data.version === "string" ? data.version.trim() : undefined;
    const status = typeof data.status === "string" ? data.status.trim() : undefined;
    const purpose = typeof data.purpose === "string" ? collapseWhitespace(data.purpose) : undefined;
    const targetsRaw = data.targets;
    const targets = normaliseTargets(targetsRaw);

    cards.push({
      id,
      title,
      version,
      status,
      purpose,
      targets,
      path: relativePath,
    });
  }

  cards.sort((a, b) => a.id.localeCompare(b.id, "en"));

  const docsDir = join(rootPath, "docs", "promptcards");
  await fs.ensureDir(docsDir);
  const generatedAt = new Date().toISOString();
  const jsonPath = join(docsDir, "registry.json");
  const markdownPath = join(docsDir, "registry.md");

  const registryPayload = {
    generatedAt,
    cards,
  };

  await fs.writeJson(jsonPath, registryPayload, { spaces: 2 });
  await fs.writeFile(markdownPath, buildMarkdown(cards, generatedAt), "utf8");

  return {
    cards,
    markdownPath,
    jsonPath,
    generatedAt,
  };
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractFrontMatter(content: string): string | null {
  const match = content.match(FRONTMATTER_REGEX);
  return match ? match[1] : null;
}

function normaliseRelativePath(root: string, filePath: string): string {
  const rel = relative(root, filePath);
  return rel.split("\\").join("/");
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normaliseTargets(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter((entry): entry is string => Boolean(entry));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

function buildMarkdown(cards: PromptCardMetadata[], generatedAt: string): string {
  const headerLines = [
    "# PromptCard Registry",
    "",
    `最終更新: ${generatedAt}`,
    "",
    "> Generated via `delta card sync`. Do not edit manually.",
    "",
  ];

  const tableLines = [
    "| ID | Version | Status | Targets | Purpose | File |",
    "| --- | --- | --- | --- | --- | --- |",
    ...cards.map((card) => {
      const version = card.version ?? "-";
      const status = card.status ?? "-";
      const targets = card.targets.length ? card.targets.map((target) => `\`${target}\``).join("<br>") : "-";
      const purpose = card.purpose ? escapeMarkdownPipes(card.purpose) : "-";
      return `| \`${card.id}\` | ${version} | ${status} | ${targets} | ${purpose} | \`${card.path}\` |`;
    }),
    "",
  ];

  return [...headerLines, ...tableLines].join("\n");
}

function escapeMarkdownPipes(value: string): string {
  return value.replace(/\|/g, "\\|");
}

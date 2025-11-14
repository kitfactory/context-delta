export type AssistantName = "claude" | "cursor" | "github" | "context-delta" | "codex";

export interface InitResult {
  root: string;
  created: string[];
  migrated: string[];
  existing: boolean;
}

export interface TemplateAsset {
  id: string;
  locales: readonly string[];
  relativePath: string;
}

export interface DirectorySkeletonEntry {
  path: string;
  kind: "directory" | "file";
  overwrite?: boolean;
}

export interface PromptCardMetadata {
  id: string;
  title?: string;
  version?: string;
  status?: string;
  purpose?: string;
  targets: string[];
  path: string;
}

export interface PromptCardRegistryResult {
  cards: PromptCardMetadata[];
  markdownPath: string;
  jsonPath: string;
  generatedAt: string;
}

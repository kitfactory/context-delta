import { join, resolve } from "node:path";

import fs from "fs-extra";

export async function ensureDirectories(root: string, directories: Iterable<string>): Promise<Set<string>> {
  const created = new Set<string>();
  for (const relPath of directories) {
    const target = resolve(root, relPath);
    if (!(await fs.pathExists(target))) {
      await fs.ensureDir(target);
      created.add(relPath);
    }
  }
  return created;
}

export async function writeTextFile(path: string, content: string, overwrite = false): Promise<boolean> {
  if (!overwrite && (await fs.pathExists(path))) {
    return false;
  }
  const normalized = content.endsWith("\n") ? content : `${content}\n`;
  await fs.outputFile(path, normalized, { encoding: "utf8" });
  return true;
}

export async function migrateFromOpenspec(root: string, stateDir: string): Promise<Set<string>> {
  const source = join(root, "openspec");
  if (!(await fs.pathExists(source))) {
    return new Set();
  }

  const migrated = new Set<string>();
  const copyFileIfMissing = async (filename: string): Promise<void> => {
    const src = join(source, filename);
    if (!(await fs.pathExists(src))) {
      return;
    }
    const dest = join(stateDir, filename);
    if (await fs.pathExists(dest)) {
      return;
    }
    await fs.copyFile(src, dest);
    migrated.add(filename);
  };

  await copyFileIfMissing("AGENTS.md");
  await copyFileIfMissing("project.md");

  for (const directory of ["specs", "changes"]) {
    const srcDir = join(source, directory);
    if (await fs.pathExists(srcDir)) {
      await fs.copy(srcDir, join(stateDir, directory), { overwrite: true, errorOnExist: false });
      migrated.add(`${directory}/`);
    }
  }
  return migrated;
}

export async function moveLegacyStateDir(
  root: string,
  stateDir: string,
  legacyDirs: readonly string[],
): Promise<boolean> {
  if (await fs.pathExists(stateDir)) {
    return true;
  }
  for (const relativeDir of legacyDirs) {
    const candidate = join(root, relativeDir);
    if (await fs.pathExists(candidate)) {
      await fs.move(candidate, stateDir, { overwrite: true });
      return true;
    }
  }
  return false;
}

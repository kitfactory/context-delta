import { join, resolve } from "node:path";

import fs from "fs-extra";

import { STATE_DIR } from "./context.js";

export type DeltaStatus = "proposed" | "apply-in-progress" | "verify-in-progress";

export interface DeltaRecord {
  id: string;
  title?: string;
  status: DeltaStatus;
  path: string;
}

export async function listDeltas(root?: string): Promise<DeltaRecord[]> {
  const rootPath = resolve(root ?? process.cwd());
  const changesDir = join(rootPath, STATE_DIR, "changes");
  if (!(await fs.pathExists(changesDir))) {
    return [];
  }

  const entries = await fs.readdir(changesDir);
  const results: DeltaRecord[] = [];

  for (const entry of entries) {
    const dirPath = join(changesDir, entry);
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) continue;

    const proposePath = join(dirPath, "propose.json");
    if (!(await fs.pathExists(proposePath))) continue;

    let title: string | undefined;
    let id = entry;
    try {
      const data = await fs.readJson(proposePath);
      title = typeof data.title === "string" ? data.title : undefined;
      if (typeof data.id === "string") {
        id = data.id;
      }
    } catch {
      // fallback to directory name
    }

    const applyPath = join(dirPath, "apply.json");
    const verifyPath = join(dirPath, "verify.json");

    let status: DeltaStatus = "proposed";
    if (await fs.pathExists(verifyPath)) {
      status = "verify-in-progress";
    } else if (await fs.pathExists(applyPath)) {
      status = "apply-in-progress";
    }

    results.push({
      id,
      title,
      status,
      path: dirPath,
    });
  }

  results.sort((a, b) => a.id.localeCompare(b.id, "en"));
  return results;
}

export async function deleteDelta(deltaId: string, root?: string): Promise<void> {
  const rootPath = resolve(root ?? process.cwd());
  const dirPath = join(rootPath, STATE_DIR, "changes", deltaId);

  if (!(await fs.pathExists(dirPath))) {
    throw new Error(`Delta '${deltaId}' does not exist under ${STATE_DIR}/changes.`);
  }

  const applyPath = join(dirPath, "apply.json");
  const verifyPath = join(dirPath, "verify.json");

  if (await fs.pathExists(applyPath)) {
    throw new Error(`Delta '${deltaId}' has apply.json and cannot be deleted (status: apply-in-progress).`);
  }
  if (await fs.pathExists(verifyPath)) {
    throw new Error(`Delta '${deltaId}' has verify.json and cannot be deleted (status: verify-in-progress).`);
  }

  await fs.remove(dirPath);
}

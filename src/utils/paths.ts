import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
function findPackageRoot(startDir: string): string {
  let dir = startDir;
  // Walk up until we find the nearest directory containing package.json.
  // This works for both the TS sources (under src/) and the bundled dist/.
  while (!existsSync(resolve(dir, "package.json"))) {
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(`Unable to locate package root from ${startDir}`);
    }
    dir = parent;
  }
  return dir;
}

export const PACKAGE_ROOT = findPackageRoot(currentDir);
export const TEMPLATE_ROOT = resolve(PACKAGE_ROOT, "templates");

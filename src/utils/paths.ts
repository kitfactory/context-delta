import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = resolve(currentDir, "..", "..");
export const TEMPLATE_ROOT = resolve(PACKAGE_ROOT, "templates");

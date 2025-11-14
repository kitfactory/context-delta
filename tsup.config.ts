import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["bin/delta.ts"],
  format: ["esm"],
  target: "node20",
  sourcemap: true,
  clean: false,
  shims: false,
  splitting: false,
});

#!/usr/bin/env node

// Bridge script so npm-installed binaries can load the ESM build under dist/.
// Using a CommonJS wrapper avoids hashbang parsing issues when Node treats dist/delta.js as an ES module.
(async () => {
  try {
    const mod = await import("../dist/delta.js");
    if (typeof mod.main === "function") {
      await mod.main(process.argv);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
})();

import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Command } from "commander";

import { determineAssistants } from "../src/services/assistants.js";
import { initContextDeltaStructure, refreshPrompts, STATE_DIR, updateRootAgentsFile } from "../src/services/context.js";
import { syncPromptCardRegistry } from "../src/services/promptcards.js";
import type { AssistantName } from "../src/types.js";

export async function main(argv = process.argv): Promise<void> {
  const program = new Command()
    .name("delta")
    .description("Context Delta CLI for managing context-delta/ workflows")
    .configureHelp({ sortSubcommands: true })
    .showSuggestionAfterError(true);

  program
    .command("init")
    .description("Initialise context-delta/ directory structure and prompt templates")
    .option("--force", "Overwrite existing context-delta/ directory if present", false)
    .option("--path <path>", "Target project directory (default: current working directory)")
    .option(
      "--assistants <names>",
      "Comma-separated assistants to install prompts for (default: claude,cursor,github,context-delta,codex; use 'all' for every tool or omit for interactive selection).",
    )
    .option("--update-root-agents", "Overwrite the repository root AGENTS.md with a bootstrap notice.", false)
    .action(async (options) => {
      const targetPath = resolve(options.path ?? process.cwd());
      let assistants: AssistantName[];
      try {
        assistants = await determineAssistants(options.assistants);
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
        return;
      }
      try {
        const result = await initContextDeltaStructure({
          root: targetPath,
          force: Boolean(options.force),
          assistants,
        });

        if (result.existing && !options.force) {
          console.error(
            `context-delta/ already exists at ${resolve(result.root)}. Use --force to regenerate.`,
          );
          process.exitCode = 1;
          return;
        }

        console.log(
          `Context Delta init complete at ${resolve(result.root)} (created: ${
            result.created.length ? result.created.sort().join(", ") : "none"
          }, migrated: ${result.migrated.length ? result.migrated.sort().join(", ") : "none"})`,
        );

        if (options.updateRootAgents) {
          await updateRootAgentsFile(targetPath);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      }
    });

  program
    .command("update")
    .description("Refresh prompt templates and sync assistant directories")
    .option("--path <path>", "Target project directory (default: current working directory)")
    .option("--assistants <names>", "Comma-separated assistants to refresh (same options as init).")
    .action(async (options) => {
      const targetPath = resolve(options.path ?? process.cwd());
      let assistants: AssistantName[];
      try {
        assistants = await determineAssistants(options.assistants);
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
        return;
      }
      try {
        const updated = await refreshPrompts({ root: targetPath, assistants });
        console.log(
          `Context Delta update complete at ${resolve(join(targetPath, STATE_DIR))} (updated: ${
            updated.size ? [...updated].sort().join(", ") : "none"
          })`,
        );
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      }
    });

  const cardCommand = program.command("card").description("PromptCard utilities");

  cardCommand
    .command("sync")
    .description("Scan promptcards and regenerate registry files")
    .option("--path <path>", "Target project directory (default: current working directory)")
    .action(async (options) => {
      const targetPath = resolve(options.path ?? process.cwd());
      try {
        const result = await syncPromptCardRegistry({ root: targetPath });
        console.log(
          `PromptCard registry updated (${result.cards.length} cards -> ${resolve(result.markdownPath)}, ${resolve(result.jsonPath)})`,
        );
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      }
    });

  program.configureOutput({
    outputError: (str) => console.error(str.trim()),
  });

  if (argv.length <= 2) {
    program.outputHelp();
  } else {
    await program.parseAsync(argv);
  }
}

const entryFile = resolve(process.argv[1] ?? "");
const isDirectExecution = fileURLToPath(import.meta.url) === entryFile;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

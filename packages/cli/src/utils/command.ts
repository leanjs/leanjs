import chalk from "chalk";
import { Command } from "commander";

export function createCommand() {
  const program = new Command();
  program
    .configureOutput({
      outputError: (str, write) => write(chalk.red(str)),
    })
    .requiredOption(
      "-c, --config <type>",
      "Name of the config defined in lean.config.js that you want to use. E.g. --config=react"
    );

  return program;
}

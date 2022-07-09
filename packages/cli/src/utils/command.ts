import chalk from "chalk";
import { Command } from "commander";
import * as os from "os";

export function createCommand() {
  const program = new Command();

  return program.configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  });
}

export function createBundlerCommand() {
  return createCommand().requiredOption(
    "-c, --config <type>",
    "Name of the config defined in lean.config.js that you want to use. E.g. --config=react"
  );
}

export function exitError(message: string, error?: Error): never {
  console.log(`🔥 ${message}. ${error ? `${os.EOL + chalk.red(error)}` : ""}`);
  process.exit(1);
}

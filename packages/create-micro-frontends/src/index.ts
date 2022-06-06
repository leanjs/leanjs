import * as path from "path";
import { runner, Logger } from "hygen";
// import enquirer from "enquirer";

const defaultTemplates = path.join(__dirname, "templates");

export async function run() {
  //   Enable the following when we add support to Nuxt
  //   const answers = await enquirer.prompt([
  //     {
  //       type: "select",
  //       message: "What's the shell framework?",
  //       name: "shellFramework",
  //       choices: ["Next", "Nuxt"],
  //     },
  //   ]);

  const { success } = await runner(["project", "next"], {
    templates: defaultTemplates,
    cwd: process.cwd(),
    logger: new Logger(console.log.bind(console)), // eslint-disable-line no-console
    debug: !!process.env.DEBUG,
    exec: (action: any, body: any) => {
      const opts = body && body.length > 0 ? { input: body } : {};
      return require("execa").command(action, { ...opts, shell: true }); // eslint-disable-line @typescript-eslint/no-var-requires
    },
    createPrompter: () => require("enquirer"),
  });

  // TODO copy public folder from templates shell/public to destination

  process.exit(success ? 0 : 1);
}

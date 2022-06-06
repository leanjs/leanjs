import { execSync } from "child_process";
import * as path from "path";
import { runner, Logger } from "hygen";
// import enquirer from "enquirer";

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

  const defaultTemplates = path.join(__dirname, "_templates");
  const cwd = process.cwd();
  console.log(`templates path:`, defaultTemplates);
  console.log(`cwd:`, cwd);
  const { success } = await runner(["project", "next"], {
    templates: defaultTemplates,
    cwd,
    logger: new Logger(console.log.bind(console)), // eslint-disable-line no-console
    debug: !!process.env.DEBUG,
    exec: (action: any, body: any) => {
      console.log(`cwd:`, cwd);
      const opts = body && body.length > 0 ? { input: body } : {};
      return require("execa").command(action, { ...opts, shell: true }); // eslint-disable-line @typescript-eslint/no-var-requires
    },
    createPrompter: () => require("enquirer"),
  });

  const projectName = execSync("ls -t", { cwd: process.cwd() })
    .toString()
    .split("\n")[0];

  console.log(`  cd ${projectName}`);
  console.log(`  npm install (or \`yarn\`)`);
  console.log(`  npm run dev (or \`yarn dev\`)`);
  console.log();

  // TODO copy public folder from templates shell/public to destination

  process.exit(success ? 0 : 1);
}

const { _ } = require("@leanjs/core");
const { context, getOctokit } = require("@actions/github");
const { program } = require("commander");

program
  .requiredOption("--origin <type>")
  .requiredOption("--packageName <type>")
  .requiredOption("--location  <type>")
  .requiredOption("--version <type>");

program.parse();
const options = program.opts();

if (
  !context?.payload?.pull_request?.number ||
  options.location.indexOf("/composable-apps/") < 0
) {
  // not running within a pull request or a composable app
  console.log(
    `${options.location} is not a composable app. Skipping PR comment`
  );
  process.exit(0);
}

const octokit = getOctokit(process.env.GITHUB_TOKEN);
const packageName = options.packageName;

const appURL = `${options.origin}${_.getRemoteBasename({
  packageName,
  version: options.version,
})}/browser/index.html`;

octokit.rest.issues.createComment({
  ...context.repo,
  issue_number: context.payload.pull_request.number,
  body: `### 🚀 &nbsp;Composable app \`${packageName}\` deployed at:

<br />

${appURL}
`,
});

console.log(`Comment created for URL ${appURL}`);

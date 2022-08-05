import { findMonorepoVersions } from "../utils/monorepoVersions";

export async function main() {
  const args = process.argv.slice(2);
  const sharedExcludeFolders = args?.[0];

  const monororepoVersions = await findMonorepoVersions({
    sharedExcludeFolders,
  });

  process.stdout.write(JSON.stringify(monororepoVersions));
}

main();

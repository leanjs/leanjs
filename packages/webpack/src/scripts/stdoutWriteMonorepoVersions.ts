import { findMonorepoVersions } from "../utils/monorepoVersions";

export async function main() {
  const monororepoVersions = await findMonorepoVersions();
  process.stdout.write(JSON.stringify(monororepoVersions));
}

main();

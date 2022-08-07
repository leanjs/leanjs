import { findMonorepoDependencies } from "../utils/monorepoDependencies";

export async function main() {
  const args = process.argv.slice(2);
  const excludeDirPattern = args?.[0];

  const monororepoDependencies = await findMonorepoDependencies({
    excludeDirPattern,
  });

  process.stdout.write(JSON.stringify(monororepoDependencies));
}

main();

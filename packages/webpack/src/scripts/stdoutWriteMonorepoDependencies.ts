import { findMonorepoDependencies } from "../utils/monorepoDependencies";

export async function main() {
  const args = process.argv.slice(2).reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = value;

    return acc;
  }, {} as Record<string, string>);

  const excludeDirPattern = args[`--excludeDirPattern`];
  const enabledRemotePackages = args[`--enabledRemotePackages`];

  const monororepoDependencies = await findMonorepoDependencies({
    excludeDirPattern,
    enabledRemotePackages: new Set(enabledRemotePackages?.split(",")),
  });

  process.stdout.write(JSON.stringify(monororepoDependencies));
}

main();

import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

copyLocalPackagesToE2eNodeModulesToAllowMultipleVersions();

async function getDirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => name);
}

function clearNodeModules({ nodeModulesDir, scope }) {
  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(nodeModulesDir);
  }

  const scopedNodeModulesDir = `${nodeModulesDir}/${scope}`;
  if (fs.existsSync(scopedNodeModulesDir)) {
    fs.removeSync(scopedNodeModulesDir);
  }
  fs.mkdirSync(scopedNodeModulesDir);
}

async function copyLocalPackagesToE2eNodeModulesToAllowMultipleVersions() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const packageNamesToCopy = new Set(["core", "next", "react", "react-router"]);
  const testNameTargets = new Set([
    "package-leanjs-react-17",
    "package-leanjs-react-18",
  ]);
  const packagesSource = path.join(__dirname, "..", "packages");
  const e2eSource = path.join(__dirname, "..", "e2e/test-subjects");

  const packageDirectories = (await getDirectories(packagesSource)).filter(
    (name) => packageNamesToCopy.has(name)
  );
  const e2eDirectories = (await getDirectories(e2eSource)).filter((name) =>
    testNameTargets.has(name)
  );

  e2eDirectories.forEach(async (directory) => {
    console.log(`Copying ${directory}`);
    const nodeModulesDir = `${e2eSource}/${directory}/node_modules`;

    clearNodeModules({ nodeModulesDir, scope: "@leanjs" });

    packageDirectories.forEach((packageName) => {
      const src = `${packagesSource}/${packageName}/`;
      const dest = `${nodeModulesDir}/@leanjs/${packageName}/`;
      fs.cp(src, dest, { recursive: true }, (error) => {
        if (error) return console.error("🔥", error);
      });
    });
  });
}

import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

copyLocalPackagesToTestNodeModulesToAllowMultipleVersions();

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

async function copyLocalPackagesToTestNodeModulesToAllowMultipleVersions() {
  console.log(`Preparing tests...`);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const packageNamesToCopy = new Set(["core", "next", "react", "react-router"]);
  const packagesSource = path.join(__dirname, "..", "packages");
  const testSource = path.join(__dirname, "..", "tests");

  const packageDirectories = (await getDirectories(packagesSource)).filter(
    (name) => packageNamesToCopy.has(name)
  );
  const targetDirectories = await getDirectories(testSource);

  targetDirectories.forEach(async (directory) => {
    console.log(`Copying ${directory}`);
    const nodeModulesDir = `${testSource}/${directory}/node_modules`;

    clearNodeModules({ nodeModulesDir, scope: "@leanjs" });

    packageDirectories.forEach((packageName) => {
      const src = `${packagesSource}/${packageName}/`;
      const dest = `${nodeModulesDir}/@leanjs/${packageName}/`;
      fs.cp(src, dest, { recursive: true }, (error) => {
        if (error) return console.error("🔥", error);
        console.log(`✅ ${packageName} copied to ${directory}`);
      });
    });
  });
}

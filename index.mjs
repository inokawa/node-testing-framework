import JestHasteMap from "jest-haste-map";
import { cpus } from "os";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { Worker } from "jest-worker";
import chalk from "chalk";

const root = dirname(fileURLToPath(import.meta.url));

const hasteMap = new JestHasteMap.default({
  extensions: ["js"],
  maxWorkers: cpus().length,
  name: "node-testing-framework",
  platforms: [],
  rootDir: root,
  roots: [root],
});

const { hasteFS } = await hasteMap.build();
const testFiles = hasteFS.matchFilesWithGlob([
  process.argv[2] ? `**/${process.argv[2]}*` : "**/*.test.js",
]);

const worker = new Worker(join(root, "worker.js"), {
  enableWorkerThreads: true,
});

let hasFailed = false;
await Promise.all(
  Array.from(testFiles).map(async (testFile) => {
    const { success, testResults, errorMessage } = await worker.runTest(
      testFile
    );
    const status = success
      ? chalk.green.inverse.bold(" PASS ")
      : chalk.red.inverse.bold(" FAIL ");

    console.log(status + " " + chalk.dim(relative(root, testFile)));
    if (!success) {
      hasFailed = true;
      if (testResults) {
        testResults
          .filter((result) => result.errors.length)
          .forEach((result) =>
            console.log(
              result.testPath.slice(1).join(" ") + "\n" + result.errors[0]
            )
          );
      } else if (errorMessage) {
        console.log("  " + errorMessage);
      }
    }
  })
);

worker.end();
if (hasFailed) {
  console.log(
    "\n" + chalk.red.bold("Test run failed, please fix all the failing tests.")
  );
  process.exitCode = 1;
}

const { readFileSync, promises: fs } = require("fs");
const { dirname, join } = require("path");
const vm = require("vm");
const NodeEnvironment = require("jest-environment-node");
const expect = require("expect");
const mock = require("jest-mock");
const { describe, it, run, resetState } = require("jest-circus");

exports.runTest = async function (testFile) {
  const code = await fs.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null,
  };
  try {
    resetState();
    let environment;
    const customRequire = (fileName) => {
      const code = readFileSync(join(dirname(testFile), fileName), "utf8");
      const moduleFactory = vm.runInContext(
        `(function(module) {${code}})`,
        environment.getVmContext()
      );
      const module = { exports: {} };
      moduleFactory(module);
      return module.exports;
    };
    environment = new NodeEnvironment({
      testEnvironmentOptions: {
        describe,
        it,
        expect,
        mock,
        require: customRequire,
      },
    });
    vm.runInContext(code, environment.getVmContext());

    const { testResults } = await run();
    testResult.testResults = testResults;
    testResult.success = testResults.every((result) => !result.errors.length);
  } catch (e) {
    testResult.errorMessage = e.message;
  }
  return testResult;
};

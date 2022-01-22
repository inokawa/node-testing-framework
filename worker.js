const { promises: fs } = require("fs");
const vm = require("vm");
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
    const context = { describe, it, expect, mock };
    vm.createContext(context);
    vm.runInContext(code, context);

    const { testResults } = await run();
    testResult.testResults = testResults;
    testResult.success = testResults.every((result) => !result.errors.length);
  } catch (e) {
    testResult.errorMessage = e.message;
  }
  return testResult;
};

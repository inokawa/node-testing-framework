const { promises: fs } = require("fs");
const expect = require("expect");
const mock = require("jest-mock");

exports.runTest = async function (testFile) {
  const code = await fs.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null,
  };
  try {
    eval(code);
    testResult.success = true;
  } catch (e) {
    testResult.errorMessage = e.message;
  }
  return testResult;
};

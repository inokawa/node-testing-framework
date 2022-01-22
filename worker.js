const { promises: fs } = require("fs");

exports.runTest = async function (testFile) {
  const code = await fs.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null,
  };
  try {
    const expect = (received) => ({
      toBe: (expected) => {
        if (received !== expected) {
          throw new Error(`Expected ${expected} but received ${received}.`);
        }
        return true;
      },
    });
    eval(code);
    testResult.success = true;
  } catch (e) {
    testResult.errorMessage = e.message;
  }
  return testResult;
};

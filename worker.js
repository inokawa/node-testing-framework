const { promises: fs } = require("fs");

exports.runTest = async function (testFile) {
  const code = await fs.readFile(testFile, "utf8");

  return testFile + ":\n" + code;
};

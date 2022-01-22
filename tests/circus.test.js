const banana = require("./banana.js");

it("tastes good", () => {
  expect(banana).toBe("good");
});

const apple = require("./apple.js");

it("tastes delicious", () => {
  expect(apple).toBe("delicious");
});

describe("circus test", () => {
  it("works", () => {
    expect(1).toBe(1);
  });
});

describe("second circus test", () => {
  it(`doesn't work`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(1).toBe(2);
  });
});

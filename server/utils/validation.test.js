const expect = require("expect");
const { isRealString } = require("./validation");

describe("isRealString", function() {
  it("should reject non-string values", function() {
    const res = isRealString(98);
    expect(res).toBe(false);
  });

  it("should reject string with only spaces", function() {
    const res = isRealString("    ");
    expect(res).toBe(false);
  });

  it("should allow string with non-space characters", function() {
    const res = isRealString("   JavaScript   ");
    expect(res).toBe(true);
  });
});

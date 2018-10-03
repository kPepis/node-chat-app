const expect = require("expect");
const { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    const from = "Someone";
    const text = "Some text";
    const msg = generateMessage(from, text);

    expect(msg.createdAt).toBeA("number");
    expect(msg).toInclude({ from, text });
  });
});

const expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    const from = "Someone";
    const text = "Some text";
    const msg = generateMessage(from, text);

    expect(msg.createdAt).toBeA("number");
    expect(msg).toInclude({ from, text });
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    const from = "Someone";
    const latitude = 150;
    const longitude = -100;

    const url = `https://www.google.com/maps?q=150,-100`;
    const msg = generateLocationMessage(from, latitude, longitude);

    expect(msg.createdAt).toBeA("number");
    expect(msg).toInclude({ from, url });
  });
});

import {
  base64Decode,
  base64Encode,
  bufferToMidiCommand,
  midiCommandToBuffer,
} from "./Midi";

const dataSet = {
  simple: {
    object: { hello: "world" },
    buffer: [
      101, 121, 74, 111, 90, 87, 120, 115, 98, 121, 73, 54, 73, 110, 100, 118,
      99, 109, 120, 107, 73, 110, 48, 61,
    ],
  },
};

describe("Midi", () => {
  it("base64Encode", () => {
    expect(base64Encode("Hello world")).toEqual("SGVsbG8gd29ybGQ=");
  });
  it("base64Decode", () => {
    expect(base64Decode("SGVsbG8gd29ybGQ=")).toEqual("Hello world");
  });
  it("objectToMidiBuffer", () => {
    expect(midiCommandToBuffer(dataSet.simple.object as any)).toEqual(
      dataSet.simple.buffer
    );
  });
  it("base64Decode", () => {
    expect(bufferToMidiCommand(dataSet.simple.buffer)).toEqual(
      dataSet.simple.object
    );
  });
});

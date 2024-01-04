import {
  barsToTicks,
  beatsToTime,
  offsetTime,
  parseTime,
  roundToNextBar,
  ticksToTime,
  timeToTicks,
} from "./Time";
import { InvalidTime, TimeSignature } from "./Types";

const tSig: TimeSignature = {
  beatsPerBar: 4,
  beatValue: 4,
};

describe("Time", () => {
  it("ticksToTime", () => {
    expect(ticksToTime(0, tSig)).toEqual(parseTime("1.1.1"));
    expect(ticksToTime(1, tSig)).toEqual(parseTime("1.1.2"));
    expect(ticksToTime(479, tSig)).toEqual(parseTime("1.1.480"));
    expect(ticksToTime(480, tSig)).toEqual(parseTime("1.2.1"));
    expect(ticksToTime(481, tSig)).toEqual(parseTime("1.2.2"));
    expect(ticksToTime(480 * 4, tSig)).toEqual(parseTime("2.1.1"));
    expect(ticksToTime(480 * 4 + 480, tSig)).toEqual(parseTime("2.2.1"));
    expect(ticksToTime(480 * 4 + 480 + 25, tSig)).toEqual(parseTime("2.2.26"));
  });
  it("timeToTicks", () => {
    expect(timeToTicks(parseTime("1.1.1"), tSig)).toEqual(0);
    expect(timeToTicks(parseTime("1.1.2"), tSig)).toEqual(1);
    expect(timeToTicks(parseTime("1.1.480"), tSig)).toEqual(479);
    expect(timeToTicks(parseTime("1.2.1"), tSig)).toEqual(480);
    expect(timeToTicks(parseTime("1.4.1"), tSig)).toEqual(480 * 3);
    expect(timeToTicks(parseTime("2.1.1"), tSig)).toEqual(480 * 4);
  });
  it("barsToTicks", () => {
    expect(barsToTicks(1, tSig)).toEqual(480 * 4);
  });
  it("positive offsetTime", () => {
    expect(offsetTime(parseTime("1.1.1"), 479, tSig)).toEqual(
      parseTime("1.1.480")
    );
    expect(offsetTime(parseTime("1.1.1"), 480, tSig)).toEqual(
      parseTime("1.2.1")
    );
    expect(offsetTime(parseTime("1.1.1"), 481, tSig)).toEqual(
      parseTime("1.2.2")
    );
    expect(offsetTime(parseTime("1.1.4"), 480, tSig)).toEqual(
      parseTime("1.2.4")
    );
    expect(offsetTime(parseTime("1.1.4"), 481, tSig)).toEqual(
      parseTime("1.2.5")
    );
    expect(offsetTime(parseTime("1.1.4"), 480 * 2, tSig)).toEqual(
      parseTime("1.3.4")
    );
    expect(offsetTime(parseTime("1.1.4"), 480 * 2 + 1, tSig)).toEqual(
      parseTime("1.3.5")
    );
    expect(offsetTime(parseTime("1.1.4"), 480 * 4, tSig)).toEqual(
      parseTime("2.1.4")
    );
    expect(offsetTime(parseTime("1.1.4"), 480 * 4 + 479, tSig)).toEqual(
      parseTime("2.2.3")
    );
    expect(offsetTime(parseTime("1.1.1"), -1, tSig)).toEqual(InvalidTime);
  });

  it("roundToNextBar", () => {
    expect(roundToNextBar(parseTime("4.1.380"))).toEqual(parseTime("5.1.1"));
  });

  it("beatsToTime", () => {
    expect(beatsToTime(1, tSig)).toEqual(parseTime("1.2.1"));
    expect(beatsToTime(4, tSig)).toEqual(parseTime("2.1.1"));
    expect(beatsToTime(5, tSig)).toEqual(parseTime("2.2.1"));
    expect(beatsToTime(0, tSig)).toEqual(parseTime("1.1.1"));
  });

  it("negative offsetTime", () => {
    expect(offsetTime(parseTime("4.1.380"), -100, tSig)).toEqual(
      parseTime("4.1.280")
    );
    expect(offsetTime(parseTime("4.2.1"), -1, tSig)).toEqual(
      parseTime("4.1.480")
    );
    expect(offsetTime(parseTime("4.2.1"), -480 * 2, tSig)).toEqual(
      parseTime("3.4.1")
    );
    expect(offsetTime(parseTime("4.2.1"), -240, tSig)).toEqual(
      parseTime("4.1.241")
    );
    expect(offsetTime(parseTime("4.2.1"), -(480 * 2 + 1), tSig)).toEqual(
      parseTime("3.3.480")
    );
    expect(offsetTime(parseTime("4.1.1"), -240, tSig)).toEqual(
      parseTime("3.4.241")
    );
  });
});

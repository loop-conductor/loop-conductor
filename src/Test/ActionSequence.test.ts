import { SequenceManager } from "../Lib/SequenceManager";
import { Sequence, TimeSignature } from "../Lib/Types";

const tSig: TimeSignature = {
  beatsPerBar: 4,
  beatValue: 4,
};

describe("ActionSequence", () => {
  it("resolveRelativeTimes 1", () => {
    const sequence: Sequence = {
      actions: [
        {
          type: "recordLoop",
          barCount: 2,
          sceneName: 0,
          trackName: 0,
        },
        {
          type: "recordLoop",
          barCount: 2,
          sceneName: 0,
          trackName: 0,
        },
        {
          type: "recordLoop",
          barCount: 2,
          sceneName: 0,
          trackName: 0,
        },
      ],
    };
    const s = new SequenceManager(sequence, []);

    expect(sequence.actions[0].at).toEqual(0);
    expect(sequence.actions[1].at).toEqual(2);
    expect(sequence.actions[2].at).toEqual(4);
  });
  it("resolveRelativeTimes 2", () => {
    const sequence: Sequence = {
      actions: [
        {
          type: "recordLoop",
          at: 3,
          barCount: 2,
          sceneName: 0,
          trackName: 0,
        },
        {
          type: "recordLoop",
          barCount: 2,
          sceneName: 0,
          trackName: 0,
        },
        {
          type: "recordLoop",
          barCount: 2,
          sceneName: 0,
          trackName: 0,
        },
      ],
    };
    const s = new SequenceManager(sequence, []);
    expect(sequence.actions[0].at).toEqual(3);
    expect(sequence.actions[1].at).toEqual(5);
    expect(sequence.actions[2].at).toEqual(7);
  });
});

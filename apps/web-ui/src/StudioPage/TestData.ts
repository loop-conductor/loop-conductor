import { Conductor } from "../Shared";

export const TestData1: Conductor = {
  id: "48dc90ac-2813-4f80-90a2-6f4ba48bf037",
  name: "TestConductor1",
  sequences: [
    {
      id: "48cc90ac-2813-4f80-90a2-6f4ba48bf039",
      name: "Sequence1",
      padId: 1,
      actions: [
        {
          id: "ced3a393-da15-4c0a-9bb1-64a74ae3cc79",
          type: "fireScene",
          sceneName: 0,
        },
        {
          id: "7efa86a7-b38d-4784-bebc-ce25eb40e440",
          type: "recordLoop",
          barCount: 4,
          trackName: "Track1",
          sceneName: 0,
        },
        {
          id: "cdbe878f-cb44-4078-85bd-3c709f51b349",
          type: "recordLoop",
          barCount: 4,
          trackName: "Track2",
          sceneName: 0,
        },
        {
          id: "d1b11abf-ef90-4774-ac46-43654f01c53b",
          type: "recordLoop",
          barCount: 4,
          trackName: "Track3",
          sceneName: 0,
          unarmOnStop: 1,
        },
      ],
    },
    {
      id: "1d4ac64c-269e-4b5d-ad7d-ce96ee7661df",
      name: "Sequence2",
      padId: 2,
      actions: [
        {
          id: "6ee923f5-19d8-40ab-90e3-da774e3f89ee",
          type: "fireScene",
          sceneName: 1,
        },
        {
          id: "5ea07718-7461-4a70-85e6-6b9c986351e1",
          type: "recordLoop",
          barCount: 2,
          trackName: "Track1",
          sceneName: 1,
        },
        {
          id: "9e77b9ae-f858-4600-9256-b6e58c4fd759",
          type: "recordLoop",
          barCount: 1,
          trackName: "Track2",
          sceneName: 1,
        },
        {
          id: "2af3f8aa-bb85-4b60-b54c-58155aaba0df",
          type: "recordLoop",
          barCount: 2,
          trackName: "Track3",
          sceneName: 1,
        },
      ],
    },
  ],
};

/**
 * Specification of the binary RIFF sequence format created by Brian Walton <brian@riban.co.uk>
 */

export enum BlockType {
  Header = "vers",
  Pattern = "patn",
  Bank = "bank",
}

export const ZynSeqFormat = {
  version: [
    ["version", 4],
    ["tempo", 2],
    ["beatsPerBar", 2],
    ["triggerChannel", 1],
    ["triggerJackInput", 1],
    ["triggerJackOutput", 1],
    ["padding", 1],
    ["verticalZoom", 2],
    ["horizontalZoom", 2],
  ],
  pattern: [
    ["id", 4],
    ["beats", 4],
    ["stepsPerBeat", 2],
    ["scale", 1],
    ["scaleTonic", 1],
    ["referenceNote", 1],
    ["padding", 1],
  ],
  patternEvents: [
    ["startStep", 4],
    ["duration", 4],
    ["command", 1],
    ["value1_Start", 1],
    ["value2_Start", 1],
    ["value1_End", 1],
    ["value2_End", 1],
    ["_unused", 1],
  ],
  bank: [
    ["id", 1],
    ["padding", 1],
    ["#sequences", 4],
    [
      "sequences",
      [
        ["playMode", 1],
        ["group", 1],
        ["triggerNote", 1],
        ["padding", 1],
        ["name", 16],
        ["#tracks", 4],
        [
          "tracks",
          [
            ["midiChannel", 1],
            ["jackOutput", 1],
            ["keymap", 1],
            ["padding", 1],
            ["#patterns", 2],
            [
              "patterns",
              [
                ["startTime", 4],
                ["patternID", 4],
              ],
            ],
          ],
        ],
        ["#timeEvents", 4],
        [
          "timeEvents",
          [
            ["eventMeasure", 2],
            ["eventTick", 2],
            ["eventCmd", 2],
            ["eventData", 2],
          ],
        ],
      ],
    ],
  ],
};

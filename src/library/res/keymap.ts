import { useUIStore } from "@/stores/ui";
type IndexableByString = { [key: string]: any };
const ui = useUIStore();

export const defaultOctave = 3;
export const minOctave = 1;
export const maxOctave = 7;
const base_midi_note = 36;

const physical_keys = [
  [
    "KeyZ",
    "KeyS",
    "KeyX",
    "KeyD",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyH",
    "KeyN",
    "KeyJ",
    "KeyM",
    "Comma",
    "KeyL",
    "Period",
    "Semicolon",
    "Slash",
  ],
  [
    "KeyQ",
    "Digit2",
    "KeyW",
    "Digit3",
    "KeyE",
    "KeyR",
    "Digit5",
    "KeyT",
    "Digit6",
    "KeyY",
    "Digit7",
    "KeyU",
    "KeyI",
    "Digit9",
    "KeyO",
    "Digit0",
    "KeyP",
    "BracketLeft",
    "Equal",
    "BracketRight",
  ],
];
let keys: IndexableByString = {};
let octave: number;

const notes = [
  "C1",
  "C#1",
  "D1",
  "D#1",
  "E1",
  "F1",
  "F#1",
  "G1",
  "G#1",
  "A1",
  "A#1",
  "B1",
  "C2",
  "C#2",
  "D2",
  "D#2",
  "E2",
  "F2",
  "F#2",
  "G2",
  "G#2",
  "A2",
  "A#2",
  "B2",
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5",
  "C6",
  "C#6",
  "D6",
  "D#6",
  "E6",
  "F6",
  "F#6",
  "G6",
  "G#6",
  "A6",
  "A#6",
  "B6",
];

const getNoteFromMidiCode = (code: number) => {
  return notes[code - base_midi_note];
};

const mapKeys = (octave: number) => {
  const lenA = physical_keys[0].length;
  if (octave < 1) octave = 1;
  physical_keys[0].forEach((item, idx) => {
    keys[item as string] = notes[(octave - 1) * 12 + idx];
  });
  physical_keys[1].forEach((item, idx) => {
    keys[item as string] = notes[(octave - 1) * 12 + lenA - 5 + idx];
  });
};

const setOctave = (octaveToSet: number) => {
  mapKeys(octaveToSet);
  ui.currentOctave = octaveToSet;
  octave = octaveToSet;
};

const incrementOctave = () => {
  if (octave < maxOctave) setOctave(octave + 1);
};

const decrementOctave = () => {
  if (octave > minOctave) setOctave(octave - 1);
};

setOctave(defaultOctave);

export {
  keys,
  getNoteFromMidiCode,
  setOctave,
  incrementOctave,
  decrementOctave,
};

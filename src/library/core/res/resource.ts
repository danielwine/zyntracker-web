/**
 * List of locally available demo snapshots
 */
export const localSnapshots = [
  "FieryRedSunset.zss",
  "Exeunt.zss",
  "CityInTheRain.zss",
  "Zynthwave.zss",
  "ThreeOnThree.zss",
  "Techno Base 01.zss",
];

export const defaultSnapshot = "FieryRedSunset.zss";

/**
 * Predefined notemaps for tone.js
 */
export const noteMaps: { [key: string]: any } = {
  minimal: {
    A1: "A1.mp3",
    A2: "A2.mp3",
  },
  4: {
    C1: "C1.mp3",
    C2: "C2.mp3",
    C3: "C3.mp3",
    C4: "C4.mp3",
    E1: "E1.mp3",
    E2: "E2.mp3",
    E3: "E3.mp3",
    Ab1: "Ab1.mp3",
    Ab2: "Ab2.mp3",
    Ab3: "Ab3.mp3",
  },
  6: {
    C1: "C1.mp3",
    C2: "C2.mp3",
    C3: "C3.mp3",
    C4: "C4.mp3",
    Gb1: "Gb1.mp3",
    Gb2: "Gb2.mp3",
    Gb3: "Gb3.mp3",
  },
};

// Paths
export const paths = {
  soundsFolder: "soundfonts",
  songsFolder: "songs",
  instruments: "instruments.json",
  defaults: "library.json",
};

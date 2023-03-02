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
export const noteMaps: { [key: string]: string[] } = {
  4: ["C2", "C3", "C4", "C5", "E2", "E3", "E4", "Ab2", "Ab3", "Ab4"],
  6: ["C2", "C3", "C4", "C5", "Gb2", "Gb3", "Gb4"],
  12: ["C2", "C3"],
  0: ["C3"],
};

// Paths
export const paths = {
  soundsFolder: "soundfonts",
  songsFolder: "songs",
  instruments: "instruments.json",
  defaults: "library.json",
};

import { production } from "./config";

/**
 * List of locally available demo snapshots
 */
export const localSnapshots = [
  "FieryRedSunset.zss",
  "Exeunt.zss",
  "CityInTheRain.zss",
  "Zynthwave.zss",
  "factory/001-ThreeOnThree.zss",
  "factory/002-House In RTP.zss",
  "factory/003-FluidR3 GM.zss",
  "factory/004-Mistic Arp.zss",
  "factory/005-Techno Base 01.zss",
];

export const defaultSnapshot = "Zynthwave.zss";

/**
 * List of locally available sample sets
 */
export const localSamples = {
  drums: ["Roland TR808", "Roland TR909", "Akai XR10"],
};

/**
 * List of remote sample sets
 */
export const remoteSamples = {
  default: {
    casio: "https://tonejs.github.io/audio/casio/",
  },
};

/**
 * Predefined notemaps for tone.js
 */
export const noteMaps = {
  minimal: {
    A1: "A1.mp3",
    A2: "A2.mp3",
  },
};

export const localhostIP = production
  ? "https://zyntracker.web.app"
  : "http://localhost:5173";
export const pathSounds = "soundfonts";
export const pathSongs = "songs";

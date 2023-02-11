import { production } from "./config";

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

/**
 * Url of the API server
 */
export const apiBaseUrl = production
  ? "http://localhost:8000/api/v1/"
  : "http://localhost:8000/api/v1/";

/**
 * Url of the application
 */
export const appUrl = production
  ? "https://zyntracker.web.ap p"
  : "http://localhost:3000";


// Paths
export const pathSounds = "soundfonts";
export const pathSongs = "songs";

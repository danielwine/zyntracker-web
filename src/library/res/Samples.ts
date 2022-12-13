import { production } from "./Config";

/**
 * List of locally available sample sets
 */
export const local = {
  drums: ["Roland TR808", "Roland TR909", "Akai XR10"],
};

/**
 * List of remote sample sets
 */
export const remote = {
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

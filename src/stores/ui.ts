import { defineStore } from "pinia";

export enum playStates {
  "stopped",
  "playing",
}

export interface ISwitch {
  name: string;
  state: boolean;
  view: boolean;
}

export const useUIStore = defineStore("ui", {
  state: () => ({
    isPadActive: [] as Array<playStates>,
    selectedPad: 1,
    currentPattern: -1,
    transportState: false,
    switches: {
      F1: { name: "about", state: true, view: true },
      F2: { name: "edit", state: false, view: true },
      F4: { name: "solo", state: false, view: false },
      F8: { name: "options", state: false, view: true },
      F9: { name: "", state: false, view: true },
    } as { [key: string]: ISwitch },
  }),
  getters: {},
  actions: {
    clear() {
      this.isPadActive = [];
      this.selectedPad = 1;
      this.currentPattern = -1;
    },
  },
});

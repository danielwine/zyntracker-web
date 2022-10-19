import { defineStore } from "pinia";

export enum playStates {
  "stopped",
  "playing",
}

export const useUIStore = defineStore("ui", {
  state: () => ({
    isPadActive: [] as Array<playStates>,
    selectedPad: 1,
    currentPattern: -1,
    transportState: false,
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

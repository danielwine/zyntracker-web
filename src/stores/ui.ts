import { defineStore } from "pinia";

export enum playStates {
  "stopped",
  "playing",
}

export interface ISwitch {
  [key: string]: any;
  name: string;
  active: boolean;
  isView: boolean;
  disabled: boolean;
}

export const useUIStore = defineStore("ui", {
  state: () => ({
    isPadActive: [] as Array<playStates>,
    selectedPad: 1,
    currentPattern: -1,
    transportState: false,
    switches: {
      F1: { name: "about", active: false, isView: true, disabled: false },
      F2: { name: "edit", active: false, isView: true, disabled: false },
      F4: { name: "solo", active: false, isView: false, disabled: false },
      F8: { name: "options", active: false, isView: true, disabled: false },
      // F9: { name: "", active: false, isView: true, disabled: false },
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

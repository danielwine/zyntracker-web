import { defineStore } from "pinia";

export enum PlayStates {
  "stopped",
  "playing",
}

export enum Panels {
  "pad",
  "pattern",
  "song",
  "options",
  "help",
  "instruments",
  "snapshots"
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
    isPadActive: [] as Array<PlayStates>,
    selectedPad: 1,
    showPadsPanel: true,
    activePanel: Panels.pad,
    lastActivePanel: Panels.pad,
    beforePatternEditorLeave: false,
    beforePatternEditorEnter: false,
    togglePatternTriggered: false,
    currentPattern: 0,
    currentOctave: 3,
    transportState: false,
  }),
  getters: {},
  actions: {
    clear() {
      this.isPadActive = [];
      this.selectedPad = 1;
      this.currentPattern = 0;
    },
  },
});

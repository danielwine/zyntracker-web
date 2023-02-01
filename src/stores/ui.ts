import { defineStore } from "pinia";
import { Alert, Panels, type PlayStates } from "./model";

/**
 * Store for managing UI related states
 */

export const useUIStore = defineStore("ui", {
  state: () => ({
    rendered: false,
    alert: new Alert(),
    alertReturned: "",
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

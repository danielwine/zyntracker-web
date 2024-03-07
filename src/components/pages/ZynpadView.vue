<script lang="ts">
import { defineComponent, nextTick } from "vue";
import Tile from "../app/ZynpadTile.vue";
import Pager from "../elements/PanelPageBar.vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";

import PanelHeader from "../elements/PanelHeader.vue";
import IconBar from "../elements/IconBar.vue";
import IconBarButton from "../elements/Button.vue";
import { storeToRefs } from "pinia";
import * as keymap from "@/library/core/res/keymap";

interface PlayAble {
  togglePlay(): Function;
}

export default defineComponent({
  components: {
    Pager,
    Tile,
    PanelHeader,
    IconBar,
    IconBarButton,
  },
  emits: ["togglePlay"],
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    let { activePanel } = storeToRefs(ui);
    return { main, ui, activePanel, Panels };
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("load", function (event) {
      console.debug("EVERYTHING IS RENDERED!!!");
      useUIStore().rendered = true;
    });
  },
  unmounted() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  },
  props: {
    bankId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      CtrlPressed: false,
    };
  },
  methods: {
    async navigateToPattern() {
      await new Promise((r) => setTimeout(r, 30));
      if (this.ui.activePanel == Panels.pad) {
        if (this.$route.name != "") this.$router.push("/");
        this.ui.activePanel = Panels.pattern;
      } else this.ui.activePanel = Panels.pad;
    },
    keyUp(event: KeyboardEvent) {
      if (event.key == "Control") this.CtrlPressed = false;
    },
    async keyDown(event: KeyboardEvent) {
      if (event.key == " ") {
        this.ui.transportState = !this.ui.transportState;
      }
      if (event.key == "Escape") {
        if (this.ui.activePanel == Panels.pad) this.navigateToPattern();
        else this.ui.activePanel = Panels.pad;
      }
      if (event.key == "F2") {
        this.ui.togglePatternTriggered = !this.ui.togglePatternTriggered;
      }
      if (event.key == "F8") {
        this.$router.push("/options");
      }
      if (event.key == "F9") {
        this.$router.push("/about");
      }
      if (this.ui.activePanel == Panels.pattern) return;
      // console.log('Key: ', event.key, 'Code: ', event.code);
      let pad = this.ui.selectedPad;
      if (event.key == "Control") this.CtrlPressed = true;
      if (event.key == "ArrowLeft" && this.ui.selectedPad > 4)
        this.ui.selectedPad -= 4;
      if (event.key == "ArrowRight" && this.ui.selectedPad < 13)
        this.ui.selectedPad += 4;
      if (event.key == "ArrowUp" && this.ui.selectedPad != 1)
        this.ui.selectedPad -= 1;
      if (event.key == "ArrowDown" && this.ui.selectedPad != 16)
        this.ui.selectedPad += 1;
      if (event.key == "Home") this.ui.selectedPad = 1;
      if (event.key == "End") this.ui.selectedPad = 16;
      if (pad != this.ui.selectedPad)
        this.ui.currentPattern = this.ui.selectedPad - 1;
      if (event.key == "Enter") {
        if (!this.CtrlPressed) {
          let pad = (
            this.$refs["pad-" + this.ui.selectedPad] as Array<PlayAble>
          )[0];
          if (pad) pad.togglePlay();
        } else this.ui.activePanel = Panels.pattern;
      }
      if (event.code == "NumpadAdd") keymap.incrementOctave();
      if (event.code == "NumpadSubtract") keymap.decrementOctave();
    },
  },
  computed: {
    sequences() {
      return this.main.song.getBankContent(this.bankId);
    },
    baseIdx() {
      let idx = this.sequences[this.bankId].id
        ? this.sequences[this.bankId].id
        : 0;
      return idx ? idx : 0;
    },
    rows() {
      return Math.sqrt(this.main.song.bankLength);
    },
    matrix() {
      let matrix: Array<number>[] = [];
      let cols = this.rows;
      for (let y = 0; y < this.rows; y++) {
        let arr = [...new Array(cols).keys()];
        matrix.push(Array.from(arr, (item) => this.baseIdx + y + item * cols));
      }
      return matrix;
    },
  },
  watch: {
    activePanel() {
      if (
        this.ui.lastActivePanel == Panels.pattern &&
        this.activePanel != Panels.pattern
      )
        this.ui.beforePatternEditorLeave = !this.ui.beforePatternEditorLeave;

      if (this.ui.activePanel == Panels.pattern)
        this.ui.beforePatternEditorEnter = !this.ui.beforePatternEditorEnter;
      this.ui.lastActivePanel = this.activePanel;
    },
  },
});
</script>

<template>
  <PanelHeader title="Scene" :id="0">
    <template #option> 00 </template>
    <template #control>
      <Pager title="pattern" :value="0" :min="0" :max="0"></Pager>
    </template>
  </PanelHeader>

  <div class="mt-3"></div>
  <div
    v-for="row in [0, 1, 2, 3]"
    ref="'row-' + row"
    class="container d-flex align-items-center mx-auto"
  >
    <Tile
      v-for="sequence in sequences.filter(
        (sequence: any) => matrix[row].includes(sequence.id))"
      :sequence="sequence"
      :selected="ui.selectedPad == sequence.id ? 'true' : 'false'"
      :ref="'pad-' + sequence.id"
      @editRequest="ui.activePanel = Panels.pattern"
    >
    </Tile>
  </div>
  <div class="mb-4"></div>
  
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Tile from "@/components/ZynpadTile.vue";
import Pager from "@/components/Pager.vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore, Panels } from "@/stores/ui";
import { toggleKey, checkFunctionKeys } from "@/common/keys";
import PanelHeader from "@/components/PanelHeader.vue";

interface PlayAble {
  togglePlay(): Function;
}

export default defineComponent({
  components: {
    Pager,
    Tile,
    PanelHeader,
  },
  emits: ["togglePlay", "nextPattern", "prevPattern", "toggleHelp"],
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return { main, ui, Panels };
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("load", function (event) {
      console.debug("EVERYTHING IS RENDERED!!!");
      useMainStore().rendered = true;
    });
    this.ui.switches["F2"].disabled = false;
    this.ui.switches["F8"].disabled = false;
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
    keyUp(event: KeyboardEvent) {
      if (event.key == "Control") this.CtrlPressed = false;
    },
    keyDown(event: KeyboardEvent) {
      if (event.key == " ") {
        this.ui.transportState = !this.ui.transportState;
      }
      if (this.ui.activePanel == Panels.pattern) return;
      if (event.key == "Backspace" || event.key == "F2") {
        this.ui.activePanel = Panels.pattern;
        return;
      }
      console.log(event.key);
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
      if (event.key == "Enter") {
        if (!this.CtrlPressed) {
          let pad = (
            this.$refs["pad-" + this.ui.selectedPad] as Array<PlayAble>
          )[0];
          if (pad) pad.togglePlay();
        } else this.ui.activePanel = Panels.pattern;
      }
      const result = checkFunctionKeys(event.key, this.$route.name);
      if (result) this.$emit(result);
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
});
</script>

<template>
  <PanelHeader title="ZynPad" :id="Panels.pad">
    <!-- <template #option>
      <Pager></Pager>
    </template> -->
  </PanelHeader>
  <div class="mt-3"></div>
  <div
    v-for="row in [0, 1, 2, 3]"
    ref="'row-' + row"
    class="container d-flex align-items-center"
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
</template>

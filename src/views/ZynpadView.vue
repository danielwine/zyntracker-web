<script lang="ts">
import { defineComponent } from "vue";
import Tile from "@/components/ZynpadTile.vue";
import StatusBar from "@/components/StatusBar.vue";
import TransportBar from "@/components/TransportBar.vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { RouterView } from "vue-router";

interface PlayAble {
  togglePlay(): Function;
}

export default defineComponent({
  components: {
    RouterView,
    StatusBar,
    Tile,
    TransportBar,
  },
  emits: ["togglePlay", "nextPattern", "prevPattern", "showHelp"],
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return { main, ui };
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("load", function (event) {
      console.debug("EVERYTHING IS RENDERED!!!");
      useMainStore().rendered = true;
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
    keyUp(event: KeyboardEvent) {
      if (event.key == "Control") this.CtrlPressed = false;
    },
    keyDown(event: KeyboardEvent) {
      console.log(event.key);
      if (event.key == " ") {
        this.ui.transportState = !this.ui.transportState;
      }
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
        } else this.navigateToEditor();
      }
      if (event.key == "Backspace" || event.key == "F2")
        this.navigateToEditor();
      if (event.key in this.ui.switches) {
        this.ui.switches[event.key.toString()].state =
          !this.ui.switches[event.key].state;
        if (event.key == "F1") this.$emit("showHelp");
      }
    },
    navigateToEditor() {
      this.$router.push("/edit/" + (this.ui.selectedPad - 1));
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
  <div
    v-for="row in [0, 1, 2, 3]"
    ref="'row-' + row"
    class="container d-flex align-items-center justify-content-center"
  >
    <Tile
      v-for="sequence in sequences.filter(
        (sequence: any) => matrix[row].includes(sequence.id))"
      :sequence="sequence"
      :selected="ui.selectedPad == sequence.id ? 'true' : 'false'"
      :ref="'pad-' + sequence.id"
      @editRequest="navigateToEditor"
    >
    </Tile>
  </div>
</template>

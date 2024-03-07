<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";

import {
  minOctave,
  maxOctave,
  incrementOctave,
  decrementOctave,
} from "@/library/core/res/keymap";
import PanelHeader from "../elements/PanelHeader.vue";
import TransportBar from "../app/TransportBar.vue";
import Pager from "../elements/PanelPageBar.vue";

export default defineComponent({
  emits: ["nextPattern", "prevPattern"],
  components: { PanelHeader, TransportBar, Pager },
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return {
      main,
      ui,
      minOctave,
      maxOctave,
      decrementOctave,
      incrementOctave,
      Panels,
    };
  },
  data() {
    return { windowWidth: window.innerWidth };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(e: Event) {
      this.windowWidth = (e.target as Window).innerWidth;
    },
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  computed: {
    patterns() {
      return JSON.stringify(this.main.song?.getPatternIDs());
    },
  },
});
</script>

<template>
  <span class="">
    <PanelHeader title="Song - Octave" :id="Panels.song">
      <template #option> {{ ui.currentOctave }} </template>
      <template #control>
        <Pager
          title="octave"
          :value="ui.currentOctave"
          custom-hint-back="Decrease octave (Num -)"
          custom-hint-forward="Increase octave (Num +)"
          :min="minOctave"
          :max="maxOctave"
          @previous="decrementOctave()"
          @next="incrementOctave()"
        ></Pager>
      </template>
    </PanelHeader>
  </span>

  <div class="panel-content">
    <div class="container song-info-row row">
      <div class="col-12">[{{ main.song.name.toLowerCase() }}]</div>
      <div class="col mt-2">
        <code class="song-info">
          <span class="song-info-detail pe-3"
            >BPM: {{ main.song?.tempo }}</span
          >
          <span class="song-info-detail pe-3"
            >#sequences: {{ main.song?.sequences.length }}</span
          >
          <span class="song-info-detail">
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :title="patterns"
              >#patterns: {{ main.song?.patterns.length }}
            </span>
          </span>
        </code>
      </div>
    </div>
    <div class="quickhelp">
      <div>Press any alphanumeric key to play a note.</div>
      <div>Press Esc to toggle edit mode / window focus.</div>
    </div>
    <span class="me-4"></span>
  </div>
  <!-- <template v-if="windowWidth >= 769"> -->
  <TransportBar></TransportBar>
  <!-- </template> -->
</template>

<style scoped>
.song-info {
  font-size: 0.92em;
  color: burlywood;
  margin-top: 40px;
}
.quickhelp {
  font-size: 1em;
  color: grey;
  margin: 10px 0 0 3px;
}

@media (max-width: 992px) {
  .song-info-row {
    padding-left: 20px;
  }
}

@media (min-width: 992px) {
  .panel-content {
    margin-left: 15px;
  }
  .song-info-row {
    padding-left: 1px;
  }
}

@media (max-width: 1350px) {
  .quickhelp {
    display: none;
  }
}
</style>

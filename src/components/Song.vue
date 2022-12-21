<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import {
  minOctave,
  maxOctave,
  incrementOctave,
  decrementOctave,
} from "../library/res/Keymap";
import PanelHeader from "@/components/PanelHeader.vue";
import TransportBar from "./TransportBar.vue";
import Pager from "./Pager.vue";

export default defineComponent({
  emits: ["nextPattern", "prevPattern"],
  components: { PanelHeader, TransportBar, Pager },
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return { main, ui, minOctave, maxOctave, decrementOctave, incrementOctave };
  },
  methods: {
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
  <span class="mobile-hide-big">
    <PanelHeader title="Song - Octave">
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

  <div class="panel-content mobile-hide-big">
    <div class="container">
      <span>[{{ main.song.name.toLowerCase() }}] &nbsp;&nbsp;</span>
      <code class="song-info">
        &nbsp;
        <span class="song-info-detail"
          >#sequences: {{ main.song?.sequences.length }}&nbsp;</span
        >
        <span class="song-info-detail">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="patterns"
            >&nbsp;#patterns: {{ main.song?.patterns.length }} &nbsp;
          </span>
        </span>
      </code>
    </div>
    <div class="quickhelp">
      <div>Press any alphanumeric key to play a note.</div>
      <div>Press Esc to toggle edit mode / window focus.</div>
    </div>
    <span class="me-4"></span>
  </div>
  <span class="mobile-hide-small">
    <TransportBar></TransportBar>
  </span>
</template>

<style scoped>
.song-info {
  font-size: 0.92em;
  color: burlywood;
  /* color: #66e969; */
  margin-top: 40px;
}
.quickhelp {
  font-size: 1em;
  color: grey;
  margin: 10px 0 0 10px;
}

@media (min-width: 992px) {
  .panel-content {
    margin-left: 15px;
  }
}

@media (max-width: 1350px) {
  .song-info {
    display: none;
  }
}
</style>

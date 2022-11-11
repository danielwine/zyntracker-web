<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import PanelHeader from "@/components/PanelHeader.vue";
import TransportBar from "./TransportBar.vue";

export default defineComponent({
  emits: ["nextPattern", "prevPattern"],
  components: { PanelHeader, TransportBar },
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return { main, ui };
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
  <div>
    <PanelHeader title="Global"></PanelHeader>
    <div class="container">
     <span>[{{ main.song.name.toLowerCase() }}] &nbsp;&nbsp;</span>
      <code class="song-info">Total
        <span class="song-info-detail"
          >sequences: {{ main.song?.sequences.length }},</span
        >
        <span class="song-info-detail">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="patterns"
            >&nbsp;patterns: {{ main.song?.patterns.length }} &nbsp;
          </span>
        </span>
      </code>
    </div>
    <!-- <TransportBar></TransportBar> -->
  </div>
</template>

<style scoped>

.song-info {   
  font-size: 0.92em;
  color: burlywood;
  /* color: #66e969; */
  margin-top: 4px;
}
</style>

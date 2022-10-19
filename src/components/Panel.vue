<script lang="ts">
import { defineComponent } from "vue";
import Tile from "./ZynpadTile.vue";
import StatusBar from "./StatusBar.vue";
import TransportBar from "./TransportBar.vue";
import LoadingScreen from "./LoadingScreen.vue";
import BsToast from "./BsToast.vue";
import { RouterView } from "vue-router";
import { useMainStore } from "@/stores/zss";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

export default defineComponent({
  name: "Panel",
  components: {
    RouterView,
    StatusBar,
    Tile,
    TransportBar,
    BsToast,
    LoadingScreen,
  },
  props: {
    bankId: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    let { currentPattern } = storeToRefs(ui);
    return {
      main,
      ui,
      currentPattern,
    };
  },
  methods: {
    nextPattern() {
      this.currentPattern += 1;
      this.routeToPattern(this.currentPattern);
    },
    previousPattern() {
      this.currentPattern -= 1;
      this.routeToPattern(this.currentPattern);
    },
    routeToPattern(patternNumber: number) {
      this.$router.push(patternNumber.toString());
    },
  },
});
</script>

<template>
  <div class="container g-0">
    <div class="row">
      <StatusBar
        :bankId="bankId"
        @nextPattern="nextPattern()"
        @prevPattern="previousPattern()"
      ></StatusBar>
      <!-- <LoadingScreen :isLoading="!main.rendered" /> -->
      <RouterView
        @nextPattern="nextPattern()"
        @prevPattern="previousPattern()"
      />
      <!-- <TransportBar></TransportBar> -->
    </div>
  </div>

  <BsToast v-if="main.error.message"></BsToast>
</template>

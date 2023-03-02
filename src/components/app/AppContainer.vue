<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

import BsToast from "../elements/BsToast.vue";
import LoadingScreen from "../elements/BsSpinner.vue";

import ZynpadView from "../pages/ZynpadView.vue";
import SideBar from "../layout/SideBar.vue";
import Footer from "../layout/Footer.vue";
import SongInfo from "../app/SongInfo.vue";
import TransportBar from "../app/TransportBar.vue";
import { appInfo } from "@/composables/config";

/**
 * Main container for the actual application UI
 */

export default defineComponent({
  components: {
    BsToast,
    LoadingScreen,
    ZynpadView,
    SongInfo,
    SideBar,
    Footer,
    TransportBar,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
      windowWidth: window.innerWidth,
      appName: appInfo.name,
    };
  },
  methods: {
    toggleAbout() {
      const route = this.$route.name?.toString();
      if (route == "pad") this.$router.push("about");
      if (route == "about") this.$router.go(-1);
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
  async created() {
    window.onresize = () => (this.windowWidth = window.innerWidth);
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
  },
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div ref="padcolumn" class="col-md-6 col-lg-4 g-0">
        <div v-if="main.song.patterns.length > 0 && ui.showPadsPanel">
          <ZynpadView />
          <div class="mb-3"></div>
          <SongInfo></SongInfo>
        </div>
      </div>
      <div
        id="mainpanel"
        ref="patterncolumn"
        class="main-panel col-md-6 col-lg-5 col-xl-6 w-30 gx-0 gx-md-4"
      >
        <div
          v-if="
            main.song.patterns.length > 0 && main.loaded && windowWidth > 768
          "
        >
          <RouterView> </RouterView>
        </div>
      </div>
      <div class="col-lg-3 col-xl-2 pt-md-4 pt-lg-0 g-0">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
  <span class="mobile-show-small"><Footer></Footer></span>
</template>

<style>
.main-panel {
  background-color: black;
  font-size: 1em;
}

@media (min-width: 768px) {
  .main-panel {
    height: 94vh;
  }
}

@media (max-width: 768px) {
  .main-panel {
    height: 45vh;
  }
}
</style>

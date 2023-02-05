<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

import BsNavBar from "../components/layout/BsNavBar.vue";
import BsToast from "@/components/elements/BsToast.vue";
import LoadingScreen from "@/components/elements/BsSpinner.vue";

import ZynpadView from "./ZynpadView.vue";
import SideBar from "@/components/layout/SideBar.vue";
import Footer from "@/components/layout/Footer.vue";
import Song from "@/components/Song.vue";
import TransportBar from "@/components/TransportBar.vue";
import { appName } from "@/library/res/config";

export default defineComponent({
  components: {
    BsNavBar,
    BsToast,
    LoadingScreen,
    ZynpadView,
    Song,
    SideBar,
    Footer,
    TransportBar,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
      windowWidth: window.innerWidth,
      appName,
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
          <Song></Song>
        </div>
      </div>
      <div
        id="mainpanel"
        ref="patterncolumn"
        class="main-panel col-md-6 col-lg-5 col-xl-6 w-30 gx-0 gx-md-4"
      >
        <div v-if="main.song.patterns.length > 0 && main.loaded">
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
}

@media (min-width: 992px) {
  .main-panel {
    height: 94vh;
  }
}

@media (max-width: 992px) {
  .main-panel {
    height: 45vh;
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { Panels, useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { load } from "@/library/core/Loader";
import err from "@/library/res/Error";

import BsNavBar from "../components/BsNavBar.vue";
import BsToast from "@/components/BsToast.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";

import ZynpadView from "../views/ZynpadView.vue";
import SideBar from "@/components/SideBar.vue";
import Footer from "../components/Footer.vue";
import Song from "@/components/Song.vue";
import TransportBar from "@/components/TransportBar.vue";
import { appName } from "@/library/res/Config";

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
      audioReady: false,
      appName,
    };
  },
  methods: {
    async load(fileName: string, release = true) {
      const song = await load(fileName, release);
      if (!song) this.main.error.message = err.import;
      else {
        this.ui.clear();
        this.main.song = song;
        this.audioReady = true;
        (this.$refs.padcolumn as HTMLElement).classList.remove("splash");
      }
    },
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
    if (this.main.song.patterns.length == 0) {
      await this.load("Zynthwave.zss", false);
    }
    window.onresize = () => (this.windowWidth = window.innerWidth);
  },
});
</script>

<template>
  <BsNavBar>
    <template #brand
      >{{ appName }} &nbsp;<font-awesome-icon
        class="btn-green"
        icon="align-justify"
      />
    </template>
    <template #rawcontent>
      <template v-if="windowWidth < 769">
        <TransportBar></TransportBar>
      </template>
    </template>
  </BsNavBar>
  <div class="container-fluid">
    <div class="row">
      <div ref="padcolumn" class="col-md-6 col-lg-4 splash g-0">
        <div v-if="main.song.patterns.length > 0 && ui.showPadsPanel">
          <ZynpadView />
          <div class="mb-3"></div>
          <Song></Song>
        </div>
      </div>
      <div
        id="mainpanel"
        ref="patterncolumn"
        class="col-md-6 col-lg-5 col-xl-6 w-30 gx-0 gx-md-4 splash"
      >
        <div v-if="main.song.patterns.length > 0 && audioReady">
          <RouterView> </RouterView>
        </div>
      </div>
      <div class="col-lg-3 col-xl-2 pt-md-4 pt-lg-0 g-0">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
  <span class="mobile-show-small"><Footer></Footer></span>
  <BsToast v-if="main.error.message"></BsToast>
</template>

<style>
@import "@/assets/base.css";
a {
  color: white;
  text-decoration: underline;
}

.bg-darkgray {
  background: #333;
}

.splash {
  background-color: black;
}

.content {
  height: 20vh;
}

@media (min-width: 992px) {
  .splash {
    height: 95vh;
  }
}

@media (max-width: 991.999px) {
  .splash {
    height: 47vh;
  }
  .fullscreen {
    height: 100%;
  }
}
</style>

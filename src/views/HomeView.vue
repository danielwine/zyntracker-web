<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
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

export default defineComponent({
  components: {
    BsNavBar,
    BsToast,
    LoadingScreen,
    ZynpadView,
    Song,
    SideBar,
    Footer,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
      windowWidth: window.innerWidth,
      audioReady: false,
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
  },
});
</script>

<template>
  <BsNavBar>
    <template #brand
      >ZynTracker alpha
      <!-- <font-awesome-icon class="btn-green" icon="music" /> &nbsp; -->
      &nbsp;<font-awesome-icon class="btn-green" icon="align-justify" />
    </template>
    <template #rawcontent> </template>
  </BsNavBar>
  <div class="container-fluid">
    <div class="row">
      <div ref="padcolumn" class="col-md-4 splash g-0">
        <div v-if="main.song.patterns.length > 0">
          <ZynpadView />
          <div class="mb-3"></div>
          <Song></Song>
        </div>
      </div>
      <div ref="patterncolumn" class="col-md-6 w-30 splash">
        <div v-if="main.song.patterns.length > 0 && audioReady">
          <RouterView> </RouterView>
        </div>
      </div>
      <div class="col-md-2 g-0">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
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
  height: 95vh;
}

.content {
  height: 20vh;
}
</style>

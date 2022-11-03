<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { defineComponent } from "vue";

import BsNavBar from "../components/BsNavBar.vue";
import BsToast from "@/components/BsToast.vue";

import MainSide from "@/components/layouts/MainSide.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import TransportBar from "@/components/TransportBar.vue";
import FileSelector from "@/components/FileSelector.vue";
import Tabs from "@/components/NavTab.vue";

import { loadSong } from "@/library/Loader";
import { AudioService } from "@/library/AudioService";
import err from "@/library/Error";
import NavTab from "../components/NavTab.vue";
import Footer from "../components/Footer.vue";
import StatusBar from "../components/StatusBar.vue";
import { storeToRefs } from "pinia";

const audioService = AudioService.getInstance();

export default defineComponent({
  components: {
    BsToast,
    MainSide,
    LoadingScreen,
    TransportBar,
    Tabs,
    FileSelector,
    NavTab,
    BsNavBar,
    Footer,
    StatusBar,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
      windowWidth: window.innerWidth,
    };
  },
  methods: {
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
    },
    async loadSong(fileName: string, release = true) {
      if (release) audioService.release();
      this.main.error.message = "";
      const song = await loadSong(fileName);
      if (!song) this.main.error.message = err.import;
      else {
        this.ui.clear();
        this.main.song = song;
        audioService.use(song);
        await audioService.initEngines();
        audioService.addBasicPatterns();
        console.debug("AudioSequences: ", audioService.sequences);
      }
    },
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
  created() {
    if (this.main.song.patterns.length == 0) {
      this.loadSong("Zynthwave.zss", false);
    }
  },
});
</script>

<template>
  <BsNavBar>
    <template #brand>ZynTracker</template>
    <template #rawcontent>
      <StatusBar :bankId="0"></StatusBar>
    </template>
  </BsNavBar>
  <div class="container-fluid">
    <!-- <div class="container-fluid g-0"> -->
    <div class="row">
      <div class="col-md-8" v-if="main.song.patterns.length > 0">
        <RouterView
          @nextPattern="nextPattern()"
          @prevPattern="previousPattern()"
          @toggleHelp="toggleAbout()"
        />
      </div>

      <!-- <div class="col-md-4" v-if="$route.name != 'about'"> -->
      <div class="col-md-4">
        <Tabs :tabList="tabList">
          <template v-slot:tabPanel-1>
            <div
              v-for="(tone, index) in main.song.tones"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :title="`(${tone.meta.originalPreset}@${tone.meta.originalEngine})`"
            >
              {{ formatIndex(index) }} - {{ tone.meta.originalPreset }} >
              {{ tone.engine }}
            </div>
          </template>
          <template v-slot:tabPanel-2>
            <FileSelector
              @fileselected="loadSong"
              :names="[
                'FieryRedSunset.zss',
                'Exeunt.zss',
                'CityInTheRain.zss',
                'Zynthwave.zss',
                'factory/001-ThreeOnThree.zss',
                'factory/002-House In RTP.zss',
                'factory/003-FluidR3 GM.zss',
                'factory/004-Mistic Arp.zss',
                'factory/005-Techno Base 01.zss',
              ]"
            >
            </FileSelector>
          </template>
          <template v-slot:tabPanel-3> </template>
        </Tabs>
        <TransportBar></TransportBar>
      </div>
    </div>
  </div>
  <Footer></Footer>
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

.help {
  padding-top: 0.85em;
  padding-bottom: 0.6em;
}

.help-link {
  text-align: left;
}
.help-text {
  height: 40px;
}
.content {
  height: 20vh;
}

</style>

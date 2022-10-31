<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import type { ISwitch } from "@/stores/ui";
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
      help: {
        pad: {
          keys: [
            ["about", "F1 ABOUT"],
            ["edit", "F2 EDIT"],
          ],
          text:
            "CLICK on a pad -> seq start/stop \n" +
            "LONG-CLICK / CTRL-ENTER -> edit.",
        },
        edit: {
          keys: [
            ["about", "F1 ABOUT"],
            ["", "F2 PADS"],
          ],
          text:
            "↑ ↓ ← →  ESC: edit  +/-\n: change octave" + "A-Z: play a note.",
        },
        about: {
          keys: [
            ["about", "F1 ABOUT"],
            ["edit", "F2 EDIT"],
          ],
          text: "",
        },
      } as { [key: string]: { keys: string[][]; text: string } },
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
    getSwitchActiveClass(item: ISwitch) {
      return item.state ? "switch-active" : "";
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
  <div class="container-fluid g-0">
    <div class="row">
      <div v-if="main.song.patterns.length > 0">
        <RouterView
          @nextPattern="nextPattern()"
          @prevPattern="previousPattern()"
          @showHelp="$router.push('/about')"
        />
      </div>
    </div>
    <BsToast v-if="main.error.message"></BsToast>

    <template v-if="$route.name != 'about'">
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
              // 'ThreeOnThree.zss',
            ]"
          >
          </FileSelector>
        </template>
        <template v-slot:tabPanel-3> </template>
      </Tabs>
      <TransportBar></TransportBar>
    </template>
  </div>
  <Footer>
    <template #content>
      <div class="help">
        <span
          class="help-link"
          v-if="$route.name"
          v-for="item of Object.entries(ui.switches)"
        >
          <RouterLink
            :class="getSwitchActiveClass(item[1])"
            :to="'/' + item[1].name"
            >{{ item[0] + " " + item[1].name.toUpperCase() }}</RouterLink
          >&nbsp;
        </span>
        <span v-if="$route.name" class="help-text">
          {{ help[$route.name.toString()].text }}
        </span>
        <p></p>
      </div>
    </template>
  </Footer>
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

.switch-active {
  background-color: red;
}
</style>

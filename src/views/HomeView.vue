<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { defineComponent } from "vue";

import BsNavBar from "../components/BsNavBar.vue";
import BsToast from "@/components/BsToast.vue";

import MainSide from "@/components/layouts/MainSide.vue";
import Panel from "@/components/Panel.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import TransportBar from "@/components/TransportBar.vue";
import FileSelector from "@/components/FileSelector.vue";
import Tabs from "@/components/NavTab.vue";

import { loadSong } from "@/library/Loader";
import { AudioService } from "@/library/AudioService";
import err from "@/library/Error";
import NavTab from "../components/NavTab.vue";

const audioService = AudioService.getInstance();

export default defineComponent({
  components: {
    Panel,
    BsToast,
    MainSide,
    LoadingScreen,
    TransportBar,
    Tabs,
    FileSelector,
    NavTab,
    BsNavBar,
  },
  data() {
    return {
      help: {
        pad:
          "Click on a pad to Start/Stop a sequence.\n" +
          "Click-and-hold / Press Ctrl-Enter to edit.",
        edit:
          "Navigation: ↑ ↓ ← →  Edit: Esc  Octave: +/-\n" +
          "To play a note: a-z. Back: Backspace.",
      } as { [key: string]: string },
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
  },
  setup() {
    const main = useMainStore();
    const ui = useUIStore();

    return {
      main,
      ui,
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
  </BsNavBar>
  <MainSide
    v-if="main.song.patterns.length > 0"
    :header="false"
    :padding="false"
    background="black"
    sideBackground="darkgray"
  >
    <template #main>
      <Panel :bankId="0"></Panel>
    </template>
    <template #side>
      <div class="help">
        <p class="help-link">
          <RouterLink to="/"> What is ZynTracker?</RouterLink>
        </p>
        <p v-if="$route.name" class="help-text">
          {{ help[$route.name.toString()] }}
        </p>
        <p></p>
      </div>
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
        <!-- {{ windowWidth }} -->
      </Tabs>

      <TransportBar></TransportBar>
    </template>
  </MainSide>
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
</style>

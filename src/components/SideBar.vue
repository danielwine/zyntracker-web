<script lang="ts">
import { AudioService } from "@/library/AudioService";
import { load } from "@/library/Loader";
import err from "@/library/Error";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import Tabs from "@/components/NavTab.vue";
import FileSelector from "@/components/FileSelector.vue";
import { defineComponent } from "vue";
import PanelHeader from "./PanelHeader.vue";
import IconBar from "./IconBar.vue";
import IconBarButton from "./IconBarButton.vue";

export default defineComponent({
  components: {
    Tabs,
    FileSelector,
    PanelHeader,
    IconBar,
    IconBarButton,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
    };
  },
  setup() {
    const ui = useUIStore();
    const main = useMainStore();
    const audioService = AudioService.getInstance();
    return {
      main,
      ui,
      audioService,
    };
  },
  methods: {
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
    },
    async load(fileName: string, release = true) {
      const song = await load(fileName, release);
      if (!song) this.main.error.message = err.import;
      else {
        this.ui.clear();
        this.main.song = song;
      }
    },
  },
});
</script>
<template>
  <!-- <Tabs :tabList="tabList"> -->
  <!-- <template v-slot:tabPanel-1> -->
  <PanelHeader title="Snapshots"></PanelHeader>
  <IconBar>
    <template #icons>
      <IconBarButton
      hint="Download snapshot file"
      iconName="download"
      :disabled="true"
      ></IconBarButton>
      
      <IconBarButton
      @fileSelected="loadFile"
      hint="Upload snapshot file"
      iconName="upload"
      :fileinput="true"
      ></IconBarButton>
      
      <IconBarButton
      hint="Save"
      iconName="save"
      :disabled="true"
      ></IconBarButton>
    </template>
  </IconBar>
  <FileSelector
    @fileselected="load"
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
  
  <!-- <span class="me-4"></span> -->
  
  <PanelHeader title="Instruments"></PanelHeader>
  <div
  class="listbox-item"
  v-for="(tone, index) in main.song.tones"
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    :title="`(${tone.meta.originalPreset}@${tone.meta.originalEngine})`"
  >
    {{ formatIndex(index) }} - {{ tone.meta.originalPreset }} >
    {{ tone.engine }}
  </div>
  <!-- </template> -->
  <!-- <template v-slot:tabPanel-2> -->
  <!-- </template> -->
  <!-- <template v-slot:tabPanel-3> </template> -->
  <!-- </Tabs> -->
</template>
<style scoped>
.listbox-item {
  padding: 0.1em 0.5em 0.1em 0.5em;
}
</style>

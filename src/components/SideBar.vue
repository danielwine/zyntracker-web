<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { AudioService } from "@/library/core/AudioService";
import { load, loadSong } from "@/library/core/Loader";
import err from "@/library/res/Error";
import Tabs from "@/components/NavTab.vue";
import FileSelector from "@/components/FileSelector.vue";
import PanelHeader from "./PanelHeader.vue";
import IconBar from "./IconBar.vue";
import IconBarButton from "./IconBarButton.vue";
import type { Song } from "@/library/core/Song";
import Footer from "./Footer.vue";

export default defineComponent({
  name: "FileUpload",
  emits: ["fileloaded"],
  components: {
    Tabs,
    FileSelector,
    PanelHeader,
    IconBar,
    IconBarButton,
    Footer,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
    };
  },
  setup(props, { emit }) {
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
    applySong(song: Song) {
      this.ui.clear();
      this.main.song = song;
      this.ui.currentPattern = -1;
      this.ui.currentPattern = 0;
    },
    async load(fileName: string, release = true) {
      const song = await load(fileName, release);
      if (!song) this.main.error.message = err.import;
      else this.applySong(song);
    },
    async loadFile(file: File, release = true) {
      const FileInput = ref<File | null>();
      let fileName = "";
      FileInput.value = file;
      if (FileInput.value) fileName = FileInput.value.name;
      let fileReader = new FileReader();
      fileReader.onload = async (event) => {
        let res =
          event.target && event.target.result ? event.target.result : null;
        if (res && typeof res === "string") {
          console.log(res);
          try {
            let song = await load(fileName, release, JSON.parse(res));
            if (song) this.applySong(song);
            else this.main.error.message = err.import;
          } catch {
            this.main.error.message = err.json;
          }
          this.$emit("fileloaded", fileName);
        }
      };
      let content = FileInput.value;
      fileReader.readAsText(FileInput.value);
    },
  },
});
</script>
<template>
  <!-- <Tabs :tabList="tabList"> -->
  <!-- <template v-slot:tabPanel-1> -->
  <PanelHeader title="Snapshots"></PanelHeader>
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

  <div class="mb-3"></div>
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
  <span class="mobile-show-big"><Footer></Footer></span>
</template>
<style scoped>
.listbox-item {
  padding: 0.1em 0.5em 0.1em 12px;
}
</style>

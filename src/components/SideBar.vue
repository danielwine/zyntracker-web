<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";
import { localSnapshots } from "@/library/res/resources";
import { AudioService } from "@/library/core/audioservice";
import { load as loadAndInit, ImportFile } from "@/library/core/filemanager";
import err from "@/library/res/error";
import Tabs from "./shared/NavTab.vue";
import FileSelector from "./shared/FileSelector.vue";
import PanelHeader from "./PanelHeader.vue";
import IconBar from "./shared/IconBar.vue";
import IconBarButton from "./shared/IconBarButton.vue";
import type { Song } from "@/library/core/song";
import Footer from "./shared/Footer.vue";

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
      Panels,
      localSnapshots,
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
      const iFile = new ImportFile();
      iFile.name = fileName;
      const song = await loadAndInit(iFile, release);
      if (!song) this.main.error.message = err.import;
      else this.applySong(song);
    },
    async loadSong(file: ImportFile, release: boolean) {
      try {
        let song = await loadAndInit(file, release);
        if (song) this.applySong(song);
        else this.main.error.message = err.import;
      } catch {
        this.main.error.message = err.json;
      }
    },
    async openFile(file: File, release = true) {
      const FileInput = ref<File | null>();
      let iFile = new ImportFile();
      FileInput.value = file;
      if (FileInput.value) iFile.name = FileInput.value.name;
      let fileReader = new FileReader();
      fileReader.onload = async (event) => {
        iFile.content =
          event.target && event.target.result ? event.target.result : undefined;
        if (iFile.content) {
          await this.loadSong(iFile, release);
          this.$emit("fileloaded", iFile.name);
        } else this.main.error.message = err.import;
      };
      if (iFile.binary) fileReader.readAsArrayBuffer(FileInput.value);
      else fileReader.readAsText(FileInput.value);
      if (!iFile.valid) this.main.error.message = err.ext;
    },
  },
});
</script>
<template>
  <div class="d-block d-md-none d-lg-block">
    <PanelHeader title="Snapshots" :id="Panels.snapshots"></PanelHeader>
    <FileSelector @fileselected="load" :names="localSnapshots"> </FileSelector>
    <IconBar>
      <template #icons>
        <IconBarButton
          hint="Save"
          iconName="save"
          :disabled="true"
        ></IconBarButton>

        <IconBarButton
          @fileSelected="openFile"
          hint="Open/import a ZSS or XRNS file"
          iconName="upload"
          :fileinput="true"
        ></IconBarButton>

        <IconBarButton
          hint="Save ZSS file"
          iconName="download"
          :disabled="true"
        ></IconBarButton>
      </template>
    </IconBar>
  </div>

  <div class="mb-3"></div>
  <!-- <span class="me-4"></span> -->

  <div class="d-block d-md-none d-lg-block">
    <PanelHeader title="Instruments" :id="Panels.instruments"></PanelHeader>
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
  </div>
</template>
<style scoped>
.listbox-item {
  padding: 0.1em 0.5em 0.1em 17px;
}
</style>

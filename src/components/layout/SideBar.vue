<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";
import { localSnapshots } from "@/library/core/res/resource";
import { AudioService } from "@/library/core/audio";
import useUpload from "@/composables/upload";
import FileSelector from "../elements/FileSelector.vue";
import PanelHeader from "../elements/PanelHeader.vue";
import IconBar from "../elements/IconBar.vue";
import Button from "../elements/Button.vue";

export default defineComponent({
  name: "FileUpload",
  emits: ["fileloaded"],
  components: {
    FileSelector,
    PanelHeader,
    IconBar,
    Button,
  },
  data() {
    return {
      tabList: ["Instruments", "Test songs"],
    };
  },
  setup(props, { emit }) {
    const ui = useUIStore();
    const main = useMainStore();
    const { openFile, load, loaded, FileInput } = useUpload();
    const audioService = AudioService.getInstance();

    return {
      main,
      ui,
      openFile,
      load,
      loaded,
      FileInput,
      audioService,
      Panels,
      localSnapshots,
    };
  },
  methods: {
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
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
        <Button hint="Save" iconName="save" :disabled="true"></Button>

        <Button
          @fileSelected="openFile"
          hint="Open/import a ZSS or XRNS file"
          iconName="upload"
          type="fileinput"
        ></Button>

        <Button
          hint="Save ZSS file"
          iconName="download"
          :disabled="true"
        ></Button>
      </template>
    </IconBar>
  </div>

  <div class="mb-3"></div>

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
  padding: 0.22em 0.5em 0.22em 17px;
}
</style>

<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { Panels, useUIStore } from "@/stores/ui";
import IconBar from "@/components/IconBar.vue";
import { AudioService } from "@/library/AudioService";
import { defineComponent, ref } from "vue";
import ZssService from "@/library/ZSSService";
import { loadSong } from "@/library/Loader";
import err from "@/library/Error";
import { storeToRefs } from "pinia";
import IconBarButton from "./IconBarButton.vue";

const audioService = AudioService.getInstance();
const ZSS = ZssService.getInstance();

export default defineComponent({
  name: "FileUpload",
  emits: ["fileloaded"],
  setup(props, { emit }) {
    const main = useMainStore();
    const ui = useUIStore();
    const { transportState, selectedPad } = storeToRefs(ui);
    const FileInput = ref<File | null>();
    const loadFile = (file: File) => {
      let fileName = "";
      FileInput.value = file;
      if (FileInput.value) {
        fileName = FileInput.value.name;
        let fileReader = new FileReader();
        fileReader.onload = async (event) => {
          let res =
            event.target && event.target.result ? event.target.result : null;
          if (res && typeof res === "string") {
            console.log(res);
            try {
              let song = await loadSong(fileName, JSON.parse(res));
              if (song) {
                ui.clear();
                main.song = song;
                audioService.use(song);
                await audioService.initEngines();
                audioService.addBasicPatterns();
              } else main.error.message = err.import;
            } catch {
              main.error.message = err.json;
            }
            emit("fileloaded", fileName);
          }
        };
        let content = FileInput.value;
        fileReader.readAsText(FileInput.value);
      }
    };
    return {
      loadFile,
      ui,
      error: main.error,
      song: main.song,
      patterns: main.song.patterns,
      transportState,
      selectedPad,
    };
  },
  mounted() {
    this.transportState = audioService.isPlaying;
  },
  methods: {
    togglePlay() {
      this.toggleAudioPlay();
      this.transportState = !this.transportState;
      console.log(audioService.isPlaying, this.transportState);
    },
    toggleAudioPlay() {
      if (audioService.isPlaying) audioService.stopTransport();
      else audioService.startTransport();
    },
    toggleView() {
      if (this.ui.activePanel == Panels.pattern)
        this.ui.activePanel = Panels.pad;
      else this.ui.activePanel = Panels.pattern;
    },
  },
  computed: {
    getViewPopupText() {
      return `Focus ${
        this.ui.activePanel == Panels.pad ? "pattern editor" : "pads"
      } (F2, backspace)`;
    },
    getViewIconClass() {
      return this.ui.activePanel == Panels.pad ? "align-justify" : "th";
    },
  },
  watch: {
    transportState() {
      if (this.transportState != audioService.isPlaying) this.toggleAudioPlay();
    },
  },
  components: { IconBar, IconBarButton },
});
</script>

<template>
  <IconBar>
    <template #icons>
      <IconBarButton
        @buttonClicked="togglePlay"
        hint="Toggle transport (Space)"
        :iconName="transportState ? 'stop' : 'play'"
      ></IconBarButton>

      <IconBarButton
        @buttonClicked="toggleView"
        :hint="getViewPopupText"
        :iconName="getViewIconClass"
      ></IconBarButton>

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

      <IconBarButton
        hint="Help"
        iconName="question"
        :disabled="true"
      ></IconBarButton>

      <span class="me-4"></span>

      <IconBarButton
        hint="Previous bank"
        iconName="caret-left"
        :disabled="true"
      ></IconBarButton>

      <IconBarButton
        hint="Next bank"
        iconName="caret-right"
        :disabled="true"
      ></IconBarButton>
    </template>
  </IconBar>
</template>

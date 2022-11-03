<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { AudioService } from "@/library/AudioService";
import { defineComponent, ref } from "vue";
import ZssService from "@/library/ZSSService";
import { loadSong } from "@/library/Loader";
import err from "@/library/Error";
import { storeToRefs } from "pinia";
import IconBack from "@/components/icons/IconBack.vue";

const audioService = AudioService.getInstance();
const ZSS = ZssService.getInstance();

export default defineComponent({
  name: "FileUpload",
  emits: ["fileloaded"],
  components: {
    IconBack,
  },
  setup(props, { emit }) {
    const main = useMainStore();
    const ui = useUIStore();
    const { transportState, selectedPad } = storeToRefs(ui);
    const FileInput = ref<File | null>();

    const loadFile = ($event: Event) => {
      const target = $event.target as HTMLInputElement;
      let fileName = "";
      if (target && target.files) FileInput.value = target.files[0];

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
    browse() {
      document.getElementById("FileInput")?.click();
    },
    switchMode() {
      let name = this.switchModeName;
      console.log(name);

      name == "home"
        ? this.$router.push("/")
        : this.$router.push({
            name,
            params: { audioSeqID: this.selectedPad - 1 },
          });
    },
  },
  computed: {
    switchModeName() {
      if (this.$route.name == "edit") return "home";
      else return "edit";
    },
  },
  watch: {
    transportState() {
      if (this.transportState != audioService.isPlaying) this.toggleAudioPlay();
    },
  },
});
</script>

<template>
  <!-- <div class="conta pt-0 mt-0"> -->
  <div class="transport-bar">
    <button
      class="btn btn-dark ms-2"
      v-on:click="togglePlay"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Toggle transport"
    >
    <!-- <IconBack></IconBack> -->
      <i
        :class="'fa fa-1x btn-green fa-' + (transportState ? 'stop' : 'play')"
      ></i>
    </button>
    <button
      class="btn btn-dark"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      disabled="true"
      title="Download snapshot file"
    >
      <i class="fa fa-download fa-1x btn-green"></i>
    </button>
    <input
      type="file"
      style="display: none"
      id="FileInput"
      @change="loadFile"
    />
    <button
      class="btn btn-dark"
      @click="browse()"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Upload snapshot file"
    >
      <i class="fa fa-upload fa-1x btn-green"></i>
    </button>
    <button
      class="btn btn-dark"
      v-on:click=""
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Save"
      disabled
    >
      <i class="fa fa-save fa-1x btn-green"></i>
    </button>
    <button
      class="btn btn-dark"
      @click="switchMode"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Toggle pattern editor"
    >
      <i :class="'fa fa-1x btn-green fa-' + switchModeName"></i>
    </button>
  </div>
  <!-- </div> -->
</template>

<style scoped>
.transport-bar {
  background-color: #333;
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 6px;
}
.transport-bar i {
  padding: 0.6em 0.4em 0.5em 0.4em;
  /* padding: 0.6em 0.4em 0.5em 0.4em; */
}

.transport-bar button {
  margin: 2% 2.85% 2% 0%;
}

.transport-bar button i {
  width: 27px;
}

.btn-green {
  color: #66e969;
}
</style>

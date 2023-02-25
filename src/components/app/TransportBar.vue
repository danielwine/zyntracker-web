<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { Panels, PlayStates } from "@/stores/model";
import IconBar from "../elements/IconBar.vue";
import { AudioService } from "@/library/core/audio";
import { defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";
import Button from "@/components/elements/Button.vue";
import { appInfo, settings } from "@/composables/config";

const audioService = AudioService.getInstance();

/**
 * Component for controlling audio playback and UI operations
 */

export default defineComponent({
  setup(props) {
    const main = useMainStore();
    const ui = useUIStore();
    const { transportState, selectedPad, togglePatternTriggered } =
      storeToRefs(ui);
    return {
      ui,
      error: main.error,
      song: main.song,
      patterns: main.song.patterns,
      Panels,
      transportState,
      togglePatternTriggered,
      selectedPad,
      version: appInfo.version,
    };
  },
  data() {
    return { windowWidth: window.innerWidth };
  },
  mounted() {
    this.transportState = audioService.isPlaying;
    if (!this.transportState && settings.autostartTransport) this.togglePlay();
  },
  methods: {
    async navigateToPattern() {
      await new Promise((r) => setTimeout(r, 30));
      if (this.$route.name != "") {
        this.$router.push("/");
        this.ui.activePanel = Panels.pattern;
      } else this.ui.activePanel = Panels.pad;
    },
    navigateToAboutPage() {
      this.ui.selectedPad = Panels.help;
      if (this.$route.name != "about") this.$router.push("/about");
      console.log(this.$route.name, this.ui.selectedPad);
    },
    onResize(e: Event) {
      this.windowWidth = (e.target as Window).innerWidth;
    },
    togglePlay() {
      this.toggleAudioPlay();
      this.transportState = !this.transportState;
      console.log(audioService.isPlaying, this.transportState);
    },
    toggleAudioPlay() {
      if (audioService.isPlaying) audioService.stopTransport();
      else audioService.startTransport();
    },
    toggleCurrentPattern() {
      let isPlaying = audioService.isPlaying;
      for (let sequence of Object.values(audioService.sequences)) {
        if (sequence.meta.id)
          if (this.ui.currentPattern + 1 != sequence.meta.id || isPlaying) {
            this.ui.isPadActive[sequence.meta.id] = PlayStates.stopped;
            audioService.stopSequence(sequence.meta.id - 1);
          } else {
            this.ui.isPadActive[sequence.meta.id] = PlayStates.playing;
            this.ui.selectedPad = sequence.meta.id;
            this.ui.currentPattern = sequence.meta.id - 1;
            audioService.startSequence(sequence.meta.id - 1);
          }
      }
      this.togglePlay();
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
      console.log(this.transportState, audioService.isPlaying);
    },
    togglePatternTriggered() {
      this.toggleCurrentPattern();
    },
  },
  components: { IconBar, Button },
});
</script>

<template>
  <IconBar>
    <template #icons>
      <Button
        @clicked="togglePlay"
        hint="Toggle transport (Space)"
        :iconName="transportState ? 'stop' : 'play'"
      ></Button>

      <Button
        @clicked="toggleCurrentPattern"
        hint="Play/stop current pattern (F2)"
        iconName="play-circle"
      ></Button>

      <span class="me-4 d-none d-md-inline"></span>

      <Button
        @clicked="ui.activePanel = Panels.pad"
        hint="Focus Zynpad (ESC)"
        iconName="th"
        customClass="d-none d-md-inline"
      ></Button>

      <Button
        @clicked="navigateToPattern()"
        hint="Focus Pattern editor (ESC)"
        iconName="align-justify"
        customClass="d-none d-md-inline"
      ></Button>

      <!-- <Button
        @clicked="toggleView"
        :hint="getViewPopupText"
        :iconName="getViewIconClass"
      ></Button> -->

      <Button
        hint="Options (F8)"
        iconName="wrench"
        disabled
        customClass="d-none d-md-inline"
      ></Button>

      <Button
        @clicked="navigateToAboutPage()"
        hint="Help (F9)"
        iconName="question"
        customClass="spec-hide"
      ></Button>
      <span class="version-number">{{ version }}</span>
    </template>
  </IconBar>
</template>

<style>
.version-number {
  color: #666;
  float: right;
  margin-top: 6px;
  margin-right: 12px;
}

@media (min-width: 1250px) {
  .version-number {
    display: block;
  }
}

@media (max-width: 1250px) {
  .version-number {
    display: none;
  }
}

@media (min-width: 992px) and (max-width: 1025px) {
  .spec-hide {
    display: none;
  }
}
</style>

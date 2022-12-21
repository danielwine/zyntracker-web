<script lang="ts">
import { useMainStore } from "@/stores/zss";
import { Panels, useUIStore } from "@/stores/ui";
import IconBar from "@/components/IconBar.vue";
import { AudioService } from "@/library/core/AudioService";
import { defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";
import IconBarButton from "./IconBarButton.vue";
import { version } from "@/library/res/Config";

const audioService = AudioService.getInstance();

export default defineComponent({
  setup(props) {
    const main = useMainStore();
    const ui = useUIStore();
    const { transportState, selectedPad } = storeToRefs(ui);
    return {
      ui,
      error: main.error,
      song: main.song,
      patterns: main.song.patterns,
      Panels,
      transportState,
      selectedPad,
      version,
    };
  },
  mounted() {
    this.transportState = audioService.isPlaying;
  },
  methods: {
    async navigateToPattern() {
      await new Promise((r) => setTimeout(r, 30));
      if (this.$route.name != "") {
        this.$router.push("/");
        this.ui.activePanel = Panels.pattern;
      } else this.ui.activePanel = Panels.pad;
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
        @buttonClicked="togglePlay"
        hint="Play current pattern (F2)"
        iconName="play-circle"
      ></IconBarButton>

      <span class="me-4"></span>

      <IconBarButton
        @buttonClicked="ui.activePanel = Panels.pad"
        hint="Focus Zynpad (ESC)"
        iconName="th"
        customClass="d-none d-md-inline"
      ></IconBarButton>

      <IconBarButton
        @buttonClicked="navigateToPattern()"
        hint="Focus Pattern editor (ESC)"
        iconName="align-justify"
        customClass="d-none d-md-inline"
      ></IconBarButton>

      <!-- <IconBarButton
        @buttonClicked="toggleView"
        :hint="getViewPopupText"
        :iconName="getViewIconClass"
      ></IconBarButton> -->

      <IconBarButton
        @buttonClicked="$router.push('/options')"
        hint="Options (F8)"
        iconName="wrench"
      ></IconBarButton>

      <IconBarButton
        @buttonClicked="$router.push('/about')"
        hint="Help (F9)"
        iconName="question"
      ></IconBarButton>
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
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import BsNavBar from "./NavBar.vue";
import BsToast from "../elements/BsToast.vue";
import BsModal from "../elements/BsModal.vue";

import TransportBar from "../app/TransportBar.vue";
import AppContainer from "../app/AppContainer.vue";
import StartScreen from "../app/StartScreen.vue";

import { appName, appUrl } from "@/composables/config";
import { AudioService } from "@/library/core/audio";
import { Song } from "@/library/core/song";

export default defineComponent({
  components: {
    BsNavBar,
    BsToast,
    BsModal,
    TransportBar,
    AppContainer,
    StartScreen,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      register: false,
      appName,
      audio: AudioService.getInstance(),
    };
  },
  methods: {
    reset() {
      this.audio.release();
      this.$router.replace("/");
      this.main.loaded = false;
      this.main.song = new Song();
    },
    toggleAbout() {
      const route = this.$route.name?.toString();
      if (route == "pad") this.$router.push("about");
      if (route == "about") this.$router.go(-1);
    },
  },
  setup() {
    const ui = useUIStore();
    let { currentPattern } = storeToRefs(ui);
    return {
      main: useMainStore(),
      ui,
      currentPattern,
    };
  },
  created() {
    this.audio.setUrl(appUrl);
    window.onresize = () => (this.windowWidth = window.innerWidth);
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
  },
});
</script>

<template>
  <BsNavBar @reset-request="reset">
    <template #brand
      >{{ appName }} &nbsp;<font-awesome-icon
        class="brand-icon"
        icon="align-justify"
      />
    </template>
    <template #rawcontent>
      <template v-if="main.loaded && windowWidth < 769">
        <TransportBar></TransportBar>
      </template>
      <template v-if="!main.loaded">
        <span class="me-4">
          <a @click="register = !register"> Sign up </a>
        </span>
      </template>
    </template>
  </BsNavBar>

  <BsModal v-if="ui.alert.message"></BsModal>
  <StartScreen v-if="main.song.name == ''" :register="register"></StartScreen>
  <AppContainer v-if="main.loaded"></AppContainer>
  <BsToast v-if="main.error.message"></BsToast>
</template>

<style>
.brand-icon {
  color: lightcyan;
}
</style>

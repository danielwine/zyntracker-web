<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { load, ImportFile } from "@/library/core/filemanager";
import err from "@/library/res/error";

import BsNavBar from "../components/shared/BsNavBar.vue";
import BsToast from "@/components/shared/BsToast.vue";
import BsModal from "@/components/shared/BsModal.vue";
import LoadingScreen from "@/components/shared/BsSpinner.vue";

import ImportBox from "@/components/ImportBox.vue";

import TransportBar from "@/components/TransportBar.vue";
import AppContainer from "@/views/AppContainer.vue";
import { appName } from "@/library/res/config";

export default defineComponent({
  components: {
    BsNavBar,
    BsToast,
    BsModal,
    LoadingScreen,
    TransportBar,
    ImportBox,
    AppContainer,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      appName,
    };
  },
  methods: {
    async load(fileName: string, release = true) {
      this.main.loading = true;
      let iFile = new ImportFile(fileName);
      const song = await load(iFile, release);
      console.log(fileName, song);

      if (!song) this.main.error.message = err.import;
      else {
        this.main.loaded = true;
        this.main.loading = false;
        this.ui.clear();
        this.main.song = song;
      }
    },
    toggleAbout() {
      const route = this.$route.name?.toString();
      if (route == "pad") this.$router.push("about");
      if (route == "about") this.$router.go(-1);
    },
  },
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    let { currentPattern } = storeToRefs(ui);
    return {
      main,
      ui,
      currentPattern,
    };
  },
  async created() {
    window.onresize = () => (this.windowWidth = window.innerWidth);
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
  },
});
</script>

<template>
  <BsNavBar>
    <template #brand
      >{{ appName }} &nbsp;<font-awesome-icon
        class="btn-green"
        icon="align-justify"
      />
    </template>
    <template #rawcontent>
      <template v-if="main.loaded && windowWidth < 769">
        <TransportBar></TransportBar>
      </template>
    </template>
  </BsNavBar>

  <BsModal v-if="ui.alert.message"></BsModal>
  <ImportBox v-if="main.song.name == ''" @browse="load('Zynthwave.zss')" />
  <LoadingScreen v-if="main.loading" />
  <AppContainer v-if="main.loaded"></AppContainer>
  <BsToast v-if="main.error.message"></BsToast>
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

.content {
  height: 20vh;
}

@media (max-width: 991.999px) {
  .fullscreen {
    height: 100%;
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import BsNavBar from "../components/layout/BsNavBar.vue";
import BsToast from "@/components/elements/BsToast.vue";
import BsModal from "@/components/elements/BsModal.vue";

import TransportBar from "@/components/TransportBar.vue";
import AppContainer from "@/views/AppContainer.vue";
import HomeView from "@/views/HomeView.vue";
import { appName } from "@/library/res/config";

export default defineComponent({
  components: {
    BsNavBar,
    BsToast,
    BsModal,
    TransportBar,
    AppContainer,
    HomeView,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      appName,
    };
  },
  methods: {
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
  <HomeView v-if="main.song.name == ''"></HomeView>
  <AppContainer v-if="main.loaded"></AppContainer>
  <BsToast v-if="main.error.message"></BsToast>
</template>

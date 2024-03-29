<script lang="ts">
import { defineComponent } from "vue";
import { Action, Alert } from "@/stores/model";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import BsNavBar from "./NavBar.vue";
import BsToast from "../elements/BsToast.vue";
import BsModal from "../elements/BsModal.vue";

import TransportBar from "../app/TransportBar.vue";
import AppContainer from "../app/AppContainer.vue";
import StartScreen from "../app/StartScreen.vue";

import { appInfo } from "@/composables/config";
import alerts from "@/composables/alert";
import useAuth from "@/composables/auth";
import useUtils from "@/composables/util";

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
      appName: appInfo.name,
    };
  },
  methods: {
    confirm() {
      if (this.main.loaded) this.alert = alerts["notsaved"];
    },
    exit() {
      this.$router.replace("/");
      this.logout();
    },
    toggleAbout() {
      const route = this.$route.name?.toString();
      if (route == "pad") this.$router.push("about");
      if (route == "about") this.$router.go(-1);
    },
  },
  setup() {
    const ui = useUIStore();
    const { alert, alertReturned } = storeToRefs(useUIStore());
    let { currentPattern } = storeToRefs(ui);
    return {
      main: useMainStore(),
      ui,
      currentPattern,
      alert,
      alertReturned,
      logout: useAuth().logout,
    };
  },
  created() {
    window.onresize = () => (this.windowWidth = window.innerWidth);
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
  },
  watch: {
    alertReturned() {
      if (this.alertReturned != "") {
        const value = this.alertReturned;
        this.alertReturned = "";
        if (this.alert.buttons[value] == Action.restart) {
          this.alert = new Alert();
          this.exit();
        }
      }
    },
  },
});
</script>

<template>
  <BsNavBar
    @brandClicked="confirm"
    @logout="exit"
    :togglerVisible="true"
    :togglerActive="main.loaded && (windowWidth < 768 || ui.loggedin)"
    :pagesVisible="main.loaded"
  >
    <template #brand>{{ appName }} &nbsp; </template>
    <template #content>
      <span class="me-4">
        <template v-if="ui.loggedin">
          <a class="nav-item-auth" @click="exit"> Log out </a>
        </template>
        <template v-if="!ui.loggedin && !main.loaded">
          <a
            v-if="!register"
            class="nav-item-auth"
            @click="register = !register"
          >
            Sign up
          </a>
          <a v-else class="nav-item-auth" @click="register = !register">
            Login
          </a>
        </template>
      </span>
    </template>
  </BsNavBar>

  <BsModal v-if="ui.alert.message"></BsModal>
  <BsToast v-if="main.error.message"></BsToast>

  <StartScreen v-if="main.song.name == ''" :register="register"></StartScreen>
  <AppContainer v-if="main.loaded"></AppContainer>
</template>

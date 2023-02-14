<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { appNameShort } from "@/composables/config";

import BsSpinner from "../elements/BsSpinner.vue";
import BsCard from "../elements/BsCard.vue";
import Logo from "../elements/AppLogo.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import SignupForm from "@/components/auth/SignupForm.vue";

export default defineComponent({
  components: {
    BsSpinner,
    BsCard,
    LoginForm,
    SignupForm,
    Logo,
  },
  props: { register: Boolean },
  setup() {
    return {
      main: useMainStore(),
      ui: useUIStore(),
      appNameShort,
    };
  },
});
</script>

<template>
  <div class="home-background">
    <div class="container background d-flex h-100">
      <div
        class="row start-screen justify-content-center align-self-center w-100"
      >
        <template v-if="main.song.name == '' && !main.loading">
          <BsCard>
            <template #content>
              <h2 class="fw-bold mb-2 text-uppercase">{{ appNameShort }}</h2>
              <span class="subtitle ms-0"
                >Load Zynthian sequences in the browser</span
              >
              <template v-if="!register">
                <Logo />
                <LoginForm :title="appNameShort"></LoginForm>
              </template>
              <div v-else><SignupForm :title="appNameShort"></SignupForm></div>
            </template>
          </BsCard>
        </template>
        <BsSpinner v-if="main.loading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-background {
  background: linear-gradient(180deg, #1b0157, black);
  background-size: 200% 200%;
  animation: gradient 20s ease infinite;
  height: 100vh;
}
.start-screen {
  margin-top: -80px;
}
.subtitle {
  color: lightgreen;
}

@keyframes gradient {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>

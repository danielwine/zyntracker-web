<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { appNameShort } from "@/composables/config";

import BsSpinner from "../elements/BsSpinner.vue";
import BsCard from "../elements/BsCard.vue";
import CardHeader from "../elements/CardHeader.vue";
import Logo from "../elements/AppLogo.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import SignupForm from "@/components/auth/SignupForm.vue";
import { defaultSnapshot } from "@/library/core/res/resource";
import useUpload from "@/composables/upload";
import { storeToRefs } from "pinia";

/**
 * Container for the start screen
 */

export default defineComponent({
  components: {
    BsSpinner,
    BsCard,
    CardHeader,
    LoginForm,
    SignupForm,
    Logo,
  },
  props: { register: Boolean },
  setup() {
    const { loggedin } = storeToRefs(useUIStore());
    return {
      main: useMainStore(),
      load: useUpload().load,
      appNameShort,
      defaultSnapshot,
      loggedin,
    };
  },
  watch: {
    loggedin() {
      this.load(defaultSnapshot);
    },
  },
});
</script>

<template>
  <div class="home-background">
    <div class="container d-flex h-100">
      <div
        class="row start-screen justify-content-center align-self-center w-100 mx-auto"
      >
        <template v-if="main.song.name == '' && !main.loading">
          <BsCard>
            <template #content>
              <template v-if="!register">
                <CardHeader
                  :title="appNameShort"
                  subtitle="Load Zynthian sequences in the browser
"
                ></CardHeader>
                <Logo />
                <LoginForm :title="appNameShort"></LoginForm>
              </template>
              <div v-else>
                <CardHeader
                  title="Sign up"
                  subtitle="Sign up to manage your sequences."
                ></CardHeader>
                <p class="text-info">
                  The account you create can currently only be used to log in.
                </p>
                <div class="mb-5"></div>
                <SignupForm></SignupForm>
              </div>
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

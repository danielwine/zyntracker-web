<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";

import Spinner from "@/components/elements/BsSpinner.vue";
import LoginCard from "@/components/elements/BsLoginCard.vue";
import Button from "@/components/elements/Button.vue";

import { defaultSnapshot } from "@/library/res/resources";
import { appNameShort } from "@/library/res/config";
import useUpload from "@/composables/upload";
import useAPI from "@/composables/api";

export default defineComponent({
  components: {
    LoginCard,
    Spinner,
    Button,
  },
  mounted() {
    this.index();
  },
  setup() {
    const { load, openFile } = useUpload();
    const { items, index } = useAPI();
    return {
      main: useMainStore(),
      ui: useUIStore(),
      load,
      openFile,
      items,
      index,
      defaultSnapshot,
      appNameShort,
    };
  },
});
</script>

<template>
  <div class="home-background">
    <div class="container background d-flex h-100">
      <div class="row login-box justify-content-center align-self-center w-100">
        <template v-if="main.song.name == '' && !main.loading">
          <LoginCard :title="appNameShort">
            <template #header>
              <span class="subtitle ms-0"
                >Load Zynthian sequences in the browser</span
              >
              <span class="text-muted"></span>
            </template>
            <template #extra>
              <div class="col-xl-4">
                <Button
                  @clicked="load(defaultSnapshot)"
                  caption="Browse songs"
                  hint="Browse / test factory ZSS files"
                  highlighted
                  wide
                />
              </div>
              <div class="col-xl-4">
                <Button
                  @fileSelected="openFile"
                  iconName="upload"
                  caption="Import file"
                  hint="Open / import ZSS or XRNS file"
                  type="fileinput"
                  wide
                />
              </div>
            </template>
          </LoginCard>
        </template>
        <Spinner v-if="main.loading" />
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
.login-box {
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

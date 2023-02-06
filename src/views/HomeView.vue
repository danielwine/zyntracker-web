<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";

import Spinner from "@/components/elements/BsSpinner.vue";
import LoginCard from "@/components/elements/BsLoginCard.vue";
import Button from "@/components/elements/Button.vue";

import { defaultSnapshot } from "@/library/res/resources";
import { appNameShort } from "@/library/res/config";
import { useUpload } from "@/composables/upload";

export default defineComponent({
  components: {
    LoginCard,
    Spinner,
    Button,
  },
  setup() {
    const { load, openFile } = useUpload();
    return {
      main: useMainStore(),
      ui: useUIStore(),
      load,
      openFile,
      defaultSnapshot,
      appNameShort,
    };
  },
});
</script>

<template>
  <div class="container d-flex h-100">
    <div class="row login-box justify-content-center align-self-center w-100">
      <template v-if="main.song.name == '' && !main.loading">
        <LoginCard :title="appNameShort">
          <template #header>
            Import / browse test files
            <span class="text-muted"> or login to your account</span>
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
</template>

<style scoped>
.login-box {
  margin-top: -80px;
}
</style>

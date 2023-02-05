<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";

import ImportBox from "@/components/ImportBox.vue";
import Spinner from "@/components/elements/BsSpinner.vue";

import { load, ImportFile } from "@/library/core/filemanager";
import { defaultSnapshot } from "@/library/res/resources";
import { useUpload } from "@/composables/upload";

export default defineComponent({
  components: {
    ImportBox,
    Spinner,
  },
  setup() {
    const { load } = useUpload();
    return {
      main: useMainStore(),
      ui: useUIStore(),
      load,
      defaultSnapshot,
    };
  },
});
</script>

<template>
  <div class="container d-flex h-100">
    <div class="row justify-content-center align-self-center w-100">
      <ImportBox
        v-if="main.song.name == '' && !main.loading"
        @browse="load(defaultSnapshot)"
      />

      <Spinner v-if="main.loading" />
    </div>
  </div>
</template>

<style scoped></style>

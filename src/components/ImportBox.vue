<script lang="ts">
import { useUpload } from "@/composables/upload";
import { defineComponent } from "vue";
import IconBarButton from "./elements/IconBarButton.vue";

export default defineComponent({
  emits: ["browse", "upload", "import"],
  components: { IconBarButton },
  setup() {
    const { openFile } = useUpload();
    return { openFile };
  },
});
</script>

<template>
  <div class="col-12">
    <button class="btn btn-secondary" @click="$emit('browse')">
      Browse test songs
    </button>
  </div>
  <div class="col-6">
    <IconBarButton
      @fileSelected="openFile"
      iconName="upload"
      caption="Upload snapshot file"
      :fileinput="true"
    />
    <IconBarButton
      @fileSelected="openFile"
      iconName="upload"
      caption="Import phrases from XRNS"
      :fileinput="true"
    />
  </div>
</template>

<style scoped></style>

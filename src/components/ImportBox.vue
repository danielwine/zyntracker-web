<script lang="ts">
import useUpload from "@/composables/upload";
import { defineComponent } from "vue";
import Button from "./elements/Button.vue";

export default defineComponent({
  emits: ["browse", "upload", "import"],
  components: { Button },
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
    <Button
      @fileSelected="openFile"
      iconName="upload"
      caption="Upload snapshot file"
      type="fileinput"
    />
    <Button
      @fileSelected="openFile"
      iconName="upload"
      caption="Import phrases from XRNS"
      type="fileinput"
    />
  </div>
</template>

<style scoped></style>
